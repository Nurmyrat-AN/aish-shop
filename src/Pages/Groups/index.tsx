import { DeleteOutline } from '@mui/icons-material'
import { Autocomplete, Avatar, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import React from 'react'
import { Loading, RetryButton } from '../../Components/Loading'
import { ServerData } from '../../Containers/ServerData'
import { ADD_GROUPS, CLEAR_LIST } from '../../Project/DataListReducer'
import { DialogReducerType } from '../../Project/DialogsReducer'
import { getRequestApi, useAppDispatch, useAppSelector } from '../../Project/store'
import ContextMenuWithChildren from '../../PureComponents/ContextMenuWithChildren'
import DragSort from '../../PureComponents/DragSort'
import { MultiLanguageTextField } from '../../PureComponents/MultiLanguageTextField'
import { EditDialogTypes, emptyGroup, GroupType, ProductType, StateLoadingType, TEMPLATES } from '../../types'

const Groups = () => {
    const [editData, setEditData] = React.useState<DialogReducerType | null>(null)
    const [search, setSearch] = React.useState<string>('')
    const [retry, setRetry] = React.useState<number>(0)
    const datas = useAppSelector(state => state.DATA_LIST.groups)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const dispatch = useAppDispatch()

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        dispatch(CLEAR_LIST('groups'))
        timer = setTimeout(async () => {
            try {
                const { groups } = await getRequestApi().getDataList({ path: `groups`, data: { search } }) as { groups: GroupType[] }
                dispatch(ADD_GROUPS(groups))
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [search, retry, dispatch])

    const handleClose = (refresh?: boolean) => {
        setEditData(null)
        if (refresh === true) setRetry(retry + 1)
    }

    return (
        <Container>
            <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    autoComplete='off'
                    value={search}
                    onChange={e => setSearch(e.target.value.toString())}
                    size='small'
                    label={'Gözleg'}
                />
                <Button onClick={() => setEditData({ type: EditDialogTypes.group, id: null })} size='small' variant='outlined' style={{ marginLeft: 10 }}>+</Button>
            </div>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Ady</TableCell>
                        <TableCell>Şablon</TableCell>
                        <TableCell>Tertip belgi</TableCell>
                        <TableCell>Haryt sany</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stateLoading.loading || stateLoading.fail || datas.length === 0 ? <TableRow>
                        <TableCell align='center' colSpan={4}>
                            {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : 'Tapylmady!'}
                        </TableCell>
                    </TableRow> : datas.map(data => <ContextMenuWithChildren key={data.id} options={[{ label: 'Üýtget', onClick: () => setEditData({ type: EditDialogTypes.group, id: data.id }) }]}><TableRow>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.template}</TableCell>
                        <TableCell>{data.tertip}</TableCell>
                        <TableCell>{data.products.length}</TableCell>
                    </TableRow></ContextMenuWithChildren>)}
                </TableBody>
            </Table>
            {editData && <EditGroup onClose={handleClose} {...editData} />}
        </Container>
    )
}

type Props = {
    id: number | string | null
    onClose: (refresh?: boolean) => void
}
const EditGroup: React.FC<Props> = (props) => {
    const [state, setState] = React.useState<GroupType>(emptyGroup)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)

    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState(emptyGroup)
                setStateLoading({ loading: false, fail: false })
            } else {
                try {
                    const group = await getRequestApi().getData({ path: `group`, data: { id: props.id } }) as GroupType
                    setState(group)
                    setStateLoading({ loading: false, fail: false })
                } catch (e) {
                    setStateLoading({ loading: false, fail: true })
                }
            }

        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [props.id, retry])

    const handleSave = async () => {
        if (!state.name) return;
        try {
            const data = state
            const showProgress = true
            if (props.id) {
                await getRequestApi().update({ path: 'group', id: props.id, data, showProgress })
            } else {
                await getRequestApi().insert({ path: 'group', data, showProgress })
            }
            props.onClose(true)
        } catch (e) {

        }
    }
    return (
        <Dialog open onClose={() => props.onClose()}>
            <DialogTitle>Topar</DialogTitle>
            <DialogContent style={{ width: 500 }}>
                {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : <List>
                    <ListItem>
                        <MultiLanguageTextField
                            label='Ady'
                            value={state.name}
                            onValueChange={name => setState(state => ({ ...state, name }))}
                            multiLanguageValue={state.name_lng}
                            onMultiLanguageValueChange={name_lng => setState(state => ({ ...state, name_lng }))}
                        />
                    </ListItem>
                    <ListItem>
                        <Autocomplete
                            fullWidth
                            size='small'
                            options={TEMPLATES}
                            value={state.template}
                            onChange={(e, template) => setState(state => ({ ...state, template: template || 'SIMPLE' }))}
                            renderInput={props => <TextField {...props} label='Şablon' />}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            label='Tertip belgi'
                            size='small'
                            type='number'
                            value={state.tertip}
                            onChange={e => setState(state => ({ ...state, tertip: parseInt(e.target.value || '0') }))}
                        />
                    </ListItem>
                    <AsyncAutoCompleteProduct setState={setState} products={state.products} onSort={sort => setState(state => ({ ...state, products: sort.map(idx => state.products[idx]) }))} />
                </List>}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' size='small' color='inherit' onClick={() => setRetry(retry => retry + 1)}>Arassala</Button>
                <Button variant='contained' size='small' color='primary' onClick={handleSave}>Ýatda sakla</Button>
            </DialogActions>

        </Dialog>
    )
}

const AsyncAutoCompleteProduct: React.FC<{ setState: React.Dispatch<React.SetStateAction<GroupType>>, products: number[], onSort: (indexes: number[]) => void }> = (props) => {
    const [options, setOptions] = React.useState<ProductType[]>([])
    const [inputValue, setInputValue] = React.useState<string>('')
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: false, fail: false })
    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            try {
                const { products } = await getRequestApi().getDataList({ path: `products`, data: { search: inputValue, brand: null, categories: [0] } }) as { products: ProductType[] }
                setOptions(products)
            } catch (e) { }
            setStateLoading({ loading: false, fail: false })
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [inputValue])

    return (
        <ListItem>
            <div style={{ flexGrow: 1 }}>
                <Autocomplete
                    size='small'
                    fullWidth
                    loading={stateLoading.loading}
                    options={options}
                    renderOption={(props, option, state) => <ListItem {...props} key={option.id}><ListItemText primary={option.name} secondary={`${option.data?.price_base_for_sale} ${option.data?.currency}`} /></ListItem>}
                    getOptionLabel={option => option.name}
                    onInputChange={(e, value) => setInputValue(value)}
                    multiple
                    value={[]}
                    onChange={(e, value) => props.setState(state => ({ ...state, products: [...props.products, ...value.filter(v => !v.id || !props.products.includes(v.id)).map(v => v.id || 0)] }))}
                    renderInput={props => <TextField
                        {...props}
                        label='Haryt gözle'
                    />}
                />
                <List
                    component={Card}
                    elevation={5}
                    style={{ flexGrow: 1, height: 500, overflow: 'auto' }}
                >
                    <ListItem component='div'><Divider /></ListItem>
                    <ListItem component='div'>
                        <List style={{ flexGrow: 1 }}>
                            <DragSort onChange={props.onSort}>
                                {props.products.map(id => <ListItem key={id}>
                                    <ServerData id={id} type='product' dataViaProps><ProductItem id={id} onRemove={id => props.setState(state => ({ ...state, products: state.products.filter(sp => sp !== id) }))} /></ServerData>
                                </ListItem>)}
                            </DragSort>
                        </List>
                    </ListItem>
                </List>
            </div>
        </ListItem>
    )
}

const ProductItem: React.FC<{ data?: ProductType, onRemove: (id: number) => void, id: number }> = (props) => {
    return (
        <>
            <ListItemAvatar>
                <Avatar style={{ width: 24, height: 24 }} src={props.data?.icon} />
            </ListItemAvatar>
            <ListItemText primary={props.data?.name} secondary={`${props.data?.data?.price_base_for_sale || ''} ${props.data?.data?.currency}`} />
            <ListItemSecondaryAction>
                <IconButton size='small' onClick={() => props.onRemove(props.id)}><DeleteOutline fontSize='small' /></IconButton>
            </ListItemSecondaryAction>
        </>
    )
}

export default Groups