import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material'
import { Button, Card, CardContent, CardMedia, Collapse, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'
import { Loading, RetryButton } from '../../Components/Loading'
import { ServerData } from '../../Containers/ServerData'
import { getRequestApi } from '../../Project/store'
import ContextMenuWithChildren from '../../PureComponents/ContextMenuWithChildren'
import { DiscountActionTypeTitles, DiscountType, emptyDiscount, StateLoadingType } from '../../types'
import { AsyncAutoCompleteBrand, AsyncAutoCompleteCategory, AsyncAutoCompleteProductMultiple } from '../HomePage/CommonFunctions'


const Discounts = () => {
    const [editData, setEditData] = React.useState<{ id: null | number } | null>(null)
    const [search, setSearch] = React.useState<string>('')
    const [retry, setRetry] = React.useState<number>(0)
    const [datas, setDatas] = React.useState<DiscountType[]>([])
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })


    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            try {
                const { discounts } = await getRequestApi().getDataList({ path: `discounts`, data: { search } }) as { discounts: DiscountType[] }
                setDatas(discounts)
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [search, retry])


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
                <Button onClick={() => setEditData({ id: null })} size='small' variant='outlined' style={{ marginLeft: 10 }}>+</Button>
            </div>

            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Ady</TableCell>
                        <TableCell>Hasaplama görnuşi</TableCell>
                        <TableCell>Hasaplama möçberi</TableCell>
                        <TableCell>Kategoriýa</TableCell>
                        <TableCell>Brend</TableCell>
                        <TableCell>Harytlar</TableCell>
                        <TableCell>Priority</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stateLoading.loading || stateLoading.fail || datas.length === 0 ? <TableRow>
                        <TableCell align='center' colSpan={7}>
                            {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : 'Tapylmady!'}
                        </TableCell>
                    </TableRow> : datas.map(data => <ContextMenuWithChildren key={data.id} options={[{ label: 'Üýtget', onClick: () => setEditData({ id: data.id }) }]}><TableRow>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{DiscountActionTypeTitles[data.actionType].toUpperCase()}</TableCell>
                        <TableCell align='center'>{data.amount}</TableCell>
                        <TableCell>{data.category ? <ServerData id={data.category} type='category' dataViaProps><ObjectTitle /></ServerData> : <Typography variant='caption' color='textSecondary'>Saýlanmadyk</Typography>}</TableCell>
                        <TableCell>{data.brand ? <ServerData id={data.brand} type='brand' dataViaProps><ObjectTitle /></ServerData> : <Typography variant='caption' color='textSecondary'>Saýlanmadyk</Typography>}</TableCell>
                        <TableCell align={data.products?.length ? 'center' : 'left'}>{data.products?.length || <Typography variant='caption' color='textSecondary'>Saýlanmadyk</Typography>}</TableCell>
                        <TableCell align='center'>{data.priority}</TableCell>
                    </TableRow></ContextMenuWithChildren>)}
                </TableBody>
            </Table>

            {editData && <EditDiscount id={editData.id} onClose={handleClose} />}
        </Container>
    )
}

const ObjectTitle: React.FC<{ data?: { name: string } }> = props => <Typography variant='body2'>{props.data?.name || '...'}</Typography>

const EditDiscount: React.FC<{ id: null | number, onClose: (refresh?: boolean) => void }> = (props) => {
    const [state, setState] = React.useState<DiscountType>(emptyDiscount)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    const [expanded, setExpanded] = React.useState<{
        category: boolean
        brand: boolean
        products: boolean
    }>({
        brand: false,
        category: false,
        products: false
    })

    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState(emptyDiscount)
                setStateLoading({ loading: false, fail: false })
            } else {
                try {
                    const discount = await getRequestApi().getData({ path: `discount`, data: { id: props.id } }) as DiscountType
                    setState(discount)
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
        try {
            const { id, ...data } = state
            if (state.id) {
                await getRequestApi().update({ path: 'discount', data, id: state.id, showProgress: true })
            } else {
                await getRequestApi().insert({ path: 'discount', data, showProgress: true })
            }
            props.onClose(true)
        } catch (e) { }
    }

    return (
        <Dialog
            open
            onClose={() => props.onClose()}>
            <DialogTitle>Arzanladyş</DialogTitle>
            <DialogContent style={{ minWidth: 500 }}>
                {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : <List>
                    <ListItem>
                        <TextField
                            fullWidth
                            size='small'
                            label='Ady'
                            value={state.name}
                            onChange={e => setState(state => ({ ...state, name: e.target.value || '' }))}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            label='Priority'
                            size='small'
                            type='number'
                            value={state.priority}
                            onChange={e => setState(state => ({ ...state, priority: parseFloat(e.target.value || '0') }))}
                        />
                    </ListItem>
                    <ListItem>
                        <Grid container spacing={1}>
                            <ActionButton active={state.actionType === 'EQUAL'} xs={12} label={DiscountActionTypeTitles['EQUAL']} onSelect={() => setState(state => ({ ...state, actionType: 'EQUAL' }))} />
                            <ActionButton active={state.actionType === 'ADD_PERCENT'} label={DiscountActionTypeTitles['ADD_PERCENT']} onSelect={() => setState(state => ({ ...state, actionType: 'ADD_PERCENT' }))} />
                            <ActionButton active={state.actionType === 'REMOVE_PERCENT'} label={DiscountActionTypeTitles['REMOVE_PERCENT']} onSelect={() => setState(state => ({ ...state, actionType: 'REMOVE_PERCENT' }))} />
                            <ActionButton active={state.actionType === 'ADD_AMOUNT'} label={DiscountActionTypeTitles['ADD_AMOUNT']} onSelect={() => setState(state => ({ ...state, actionType: 'ADD_AMOUNT' }))} />
                            <ActionButton active={state.actionType === 'REMOVE_AMOUNT'} label={DiscountActionTypeTitles['REMOVE_AMOUNT']} onSelect={() => setState(state => ({ ...state, actionType: 'REMOVE_AMOUNT' }))} />
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            label='Möçber'
                            size='small'
                            type='number'
                            value={state.amount}
                            onChange={e => setState(state => ({ ...state, amount: parseFloat(e.target.value || '0') }))}
                        />
                    </ListItem>
                    <CollapseItem
                        label='Kategoriýa'
                        expanded={expanded.category}
                        setExpanded={() => setExpanded(expanded => ({ ...expanded, category: !expanded.category }))}
                        collapseData={<AsyncAutoCompleteCategory id={state.category} setState={id => setState(state => ({ ...state, category: id }))} />}
                    />
                    <CollapseItem
                        label='Brand'
                        expanded={expanded.brand}
                        setExpanded={() => setExpanded(expanded => ({ ...expanded, brand: !expanded.brand }))}
                        collapseData={<AsyncAutoCompleteBrand id={state.brand} setState={id => setState(state => ({ ...state, brand: id }))} />}
                    />
                    <CollapseItem
                        label='Harytlar'
                        expanded={expanded.products}
                        setExpanded={() => setExpanded(expanded => ({ ...expanded, products: !expanded.products }))}
                        collapseData={<AsyncAutoCompleteProductMultiple products={state.products || []} setState={cb => setState(state => ({ ...state, products: cb(state.products || []) }))} onSort={() => { }} />}
                    />
                </List>}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' size='small' color='inherit' onClick={() => setRetry(retry => retry + 1)}>Arassala</Button>
                <Button variant='contained' size='small' color='primary' onClick={handleSave}>Ýatda sakla</Button>
            </DialogActions>
        </Dialog>
    )
}

const ActionButton: React.FC<{ active: boolean, label: string, onSelect: () => void, xs?: number }> = (props) => {
    return (<Grid item xs={props.xs || 6}>
        <Button
            fullWidth
            variant='contained'
            size='small'
            color={props.active ? 'primary' : 'inherit'}
            onClick={props.onSelect}
            style={{ lineHeight: 1 }}>
            {props.label}
        </Button>
    </Grid>)
}


const CollapseItem: React.FC<{ expanded: boolean, label: string, collapseData: any, setExpanded: () => void }> = (props) => {
    return (
        <ListItem>
            <Card style={{ flexGrow: 1 }}>
                <CardMedia style={{ boxShadow: '0 1px 2px gray' }}>
                    <ListItem button onClick={props.setExpanded} component='div'>
                        <ListItemAvatar>{props.expanded ? <KeyboardArrowDown fontSize='small' /> : <KeyboardArrowRight fontSize='small' />}</ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">{props.label}</Typography>
                        </ListItemText>
                    </ListItem>
                </CardMedia>
                <Collapse in={props.expanded}>
                    {props.collapseData}
                </Collapse>
            </Card>
        </ListItem>
    )
}


export default Discounts