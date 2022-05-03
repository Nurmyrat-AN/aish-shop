import { Autocomplete, Avatar, Button, Card, CardContent, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, List, ListItem, ListItemAvatar, ListItemText, Radio, RadioGroup, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'
import { Loading, RetryButton } from '../../Components/Loading'
import { ServerData } from '../../Containers/ServerData'
import { ADD_BANERS, ADD_CURRENCIES, CLEAR_LIST } from '../../Project/DataListReducer'
import { DialogReducerType } from '../../Project/DialogsReducer'
import { getRequestApi, useAppDispatch, useAppSelector } from '../../Project/store'
import ContextMenuWithChildren from '../../PureComponents/ContextMenuWithChildren'
import CustomImagePicker from '../../PureComponents/CustomImagePicker'
import { BanerType, BrandType, CategoryType, EditDialogTypes, emptyBaner, ProductType, StateLoadingType } from '../../types'

const Baners = () => {
    const [editData, setEditData] = React.useState<DialogReducerType | null>(null)
    const [search, setSearch] = React.useState<string>('')
    const [retry, setRetry] = React.useState<number>(0)
    const datas = useAppSelector(state => state.DATA_LIST.baners)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const dispatch = useAppDispatch()

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        dispatch(CLEAR_LIST('baners'))
        timer = setTimeout(async () => {
            try {
                const { baners } = await getRequestApi().getDataList({ path: `baners`, data: { search } }) as { baners: BanerType[] }
                dispatch(ADD_BANERS(baners))
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
                <Button onClick={() => setEditData({ type: EditDialogTypes.baner, id: null })} size='small' variant='outlined' style={{ marginLeft: 10 }}>+</Button>
            </div>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Ady</TableCell>
                        <TableCell>Sahypa sany</TableCell>
                        <TableCell>Tertip belgi</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stateLoading.loading || stateLoading.fail || datas.length === 0 ? <TableRow>
                        <TableCell align='center' colSpan={4}>
                            {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : 'Tapylmady!'}
                        </TableCell>
                    </TableRow> : datas.map(data => <ContextMenuWithChildren key={data.id} options={[{ label: 'Üýtget', onClick: () => setEditData({ type: EditDialogTypes.baner, id: data.id }) }]}><TableRow>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.gallery.length}</TableCell>
                        <TableCell>{data.tertip}</TableCell>
                    </TableRow></ContextMenuWithChildren>)}
                </TableBody>
            </Table>
            {editData && <EditBaner onClose={handleClose} {...editData} />}
        </Container>
    )
}

type Props = {
    id: number | string | null
    onClose: (refresh?: boolean) => void
}
const EditBaner: React.FC<Props> = (props) => {

    const [state, setState] = React.useState<BanerType>(emptyBaner)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)

    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState(emptyBaner)
                setStateLoading({ loading: false, fail: false })
            } else {
                try {
                    const baner = await getRequestApi().getData({ path: `baner`, data: { id: props.id } }) as BanerType
                    setState(baner)
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
                await getRequestApi().update({ path: 'baner', id: props.id, data, showProgress })
            } else {
                await getRequestApi().insert({ path: 'baner', data, showProgress })
            }
            props.onClose(true)
        } catch (e) {

        }
    }

    return (
        <Dialog open onClose={() => props.onClose()}>
            <DialogTitle>Baner</DialogTitle>
            <DialogContent style={{ width: 500 }}>
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
                            label='Tertip'
                            size='small'
                            type='number'
                            value={state.tertip}
                            onChange={e => setState(state => ({ ...state, tertip: parseFloat(e.target.value || '1') }))}
                        />
                    </ListItem>
                    <ListItem>
                        <Typography variant='body2' style={{ flexGrow: 1 }}>Suratlar</Typography>
                        <CustomImagePicker
                            multiple
                            height={60}
                            width={60}
                            onChange={images => setState(state => ({ ...state, gallery: [...state.gallery, ...images.map(img => ({ src: img }))] }))}
                        />
                    </ListItem>
                    <ListItem>
                        <List style={{ height: 500, overflow: 'auto', flexGrow: 1 }} elevation={5} component={Card}>
                            {state.gallery.map((item, idx) => <div>
                                <ListItem key={idx} component={Card} style={{ margin: '20px 0' }}>
                                    <ListItemAvatar>
                                        <Avatar src={item.src} />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}><Button onClick={() => setState(state => ({ ...state, gallery: state.gallery.map((sitem, sidx) => sidx !== idx ? sitem : ({ src: sitem.src })) }))} fullWidth size='small' variant={!item.category && !item.brand && !item.product ? 'contained' : 'outlined'}>Boş surat</Button></Grid>
                                            <Grid item xs={6}><Button onClick={() => setState(state => ({ ...state, gallery: state.gallery.map((sitem, sidx) => sidx !== idx ? sitem : ({ src: sitem.src, category: { id: null } })) }))} fullWidth size='small' variant={item.category ? 'contained' : 'outlined'}>Kategoriýa</Button></Grid>
                                            <Grid item xs={6}><Button onClick={() => setState(state => ({ ...state, gallery: state.gallery.map((sitem, sidx) => sidx !== idx ? sitem : ({ src: sitem.src, brand: { id: null } })) }))} fullWidth size='small' variant={item.brand ? 'contained' : 'outlined'}>Brend</Button></Grid>
                                            <Grid item xs={6}><Button onClick={() => setState(state => ({ ...state, gallery: state.gallery.map((sitem, sidx) => sidx !== idx ? sitem : ({ src: sitem.src, product: { id: null } })) }))} fullWidth size='small' variant={item.product ? 'contained' : 'outlined'}>Haryt</Button></Grid>
                                        </Grid>
                                    </ListItemText>
                                </ListItem>
                                {item.product ? <AsyncAutoCompleteProduct id={item.product.id} setState={id => setState(state => ({ ...state, gallery: state.gallery.map((sitem, sidx) => sidx !== idx ? sitem : ({ ...item, product: { id } })) }))} />
                                    : item.category ? <AsyncAutoCompleteCategory id={item.category.id} setState={id => setState(state => ({ ...state, gallery: state.gallery.map((sitem, sidx) => sidx !== idx ? sitem : ({ ...item, category: { id } })) }))} />
                                        : item.brand ? <AsyncAutoCompleteBrand id={item.brand.id} setState={id => setState(state => ({ ...state, gallery: state.gallery.map((sitem, sidx) => sidx !== idx ? sitem : ({ ...item, brand: { id } })) }))} />
                                            : null
                                }
                            </div>)}
                        </List>
                    </ListItem>
                </List>}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' size='small' color='inherit' onClick={() => setRetry(retry => retry + 1)}>Arassala</Button>
                <Button variant='contained' size='small' color='primary' onClick={handleSave}>Ýatda sakla</Button>
            </DialogActions>
        </Dialog>
    )
}


const AsyncAutoCompleteProduct: React.FC<{ setState: (id: number | null) => void, id: number | null }> = (props) => {
    const [options, setOptions] = React.useState<ProductType[]>([])
    const [inputValue, setInputValue] = React.useState<string>('')
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: false, fail: false })
    const product = useAppSelector(state => state.DATA.product[props.id || 0])
    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            try {
                const { products } = await getRequestApi().getDataList({ path: `products`, data: { search: inputValue, categories: [0] } }) as { products: ProductType[] }
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
            <List component={Card} elevation={5} style={{ flexGrow: 1, background: '#f6f6f6', marginBottom: 25 }}>
                <ServerData type='product' id={props.id || 0}>
                    <ListItem component='div'>
                        <ListItemText primary={product?.name || '???'} secondary={`${product?.data?.price_base_for_sale || ''} ${product?.data?.currency || ''}`} />
                    </ListItem>
                </ServerData>
                <ListItem component='div'>
                    <Autocomplete
                        size='small'
                        fullWidth
                        loading={stateLoading.loading}
                        options={options}
                        renderOption={(props, option, state) => <ListItem {...props} key={option.id}><ListItemText primary={option.name} secondary={`${option.data?.price_base_for_sale} ${option.data?.currency}`} /></ListItem>}
                        getOptionLabel={option => option.name}
                        onInputChange={(e, value) => setInputValue(value)}
                        onChange={(e, value) => props.setState(value?.id || null)}
                        renderInput={props => <TextField
                            {...props}
                            label='Haryt gözle'
                        />}
                    />
                </ListItem>
            </List>
        </ListItem>
    )
}


const AsyncAutoCompleteCategory: React.FC<{ setState: (id: number | null) => void, id: number | null }> = (props) => {
    const [options, setOptions] = React.useState<CategoryType[]>([])
    const [inputValue, setInputValue] = React.useState<string>('')
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: false, fail: false })
    const category = useAppSelector(state => state.DATA.category[props.id || 0])
    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            try {
                const { categories } = await getRequestApi().getDataList({ path: `categories`, data: { search: inputValue } }) as { categories: CategoryType[] }
                setOptions(categories)
            } catch (e) { }
            setStateLoading({ loading: false, fail: false })
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [inputValue])
    return (
        <ListItem>
            <List component={Card} elevation={5} style={{ flexGrow: 1, background: '#f6f6f6', marginBottom: 25 }}>
                <ServerData type='category' id={props.id || 0}>
                    <ListItem component='div'>
                        <ListItemText primary={category?.name || '???'} />
                    </ListItem>
                </ServerData>
                <ListItem component='div'>
                    <Autocomplete
                        size='small'
                        fullWidth
                        loading={stateLoading.loading}
                        options={options}
                        getOptionLabel={option => option.name}
                        onInputChange={(e, value) => setInputValue(value)}
                        onChange={(e, value) => props.setState(value?.id || null)}
                        renderInput={props => <TextField
                            {...props}
                            label='Kategoriýa gözle'
                        />}
                    />
                </ListItem>
            </List>
        </ListItem>
    )
}


const AsyncAutoCompleteBrand: React.FC<{ setState: (id: number | null) => void, id: number | null }> = (props) => {
    const [options, setOptions] = React.useState<BrandType[]>([])
    const [inputValue, setInputValue] = React.useState<string>('')
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: false, fail: false })
    const brand = useAppSelector(state => state.DATA.brand[props.id || 0])
    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            try {
                const { brands } = await getRequestApi().getDataList({ path: `brands`, data: { search: inputValue } }) as { brands: BrandType[] }
                setOptions(brands)
            } catch (e) { }
            setStateLoading({ loading: false, fail: false })
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [inputValue])
    return (
        <ListItem>
            <List component={Card} elevation={5} style={{ flexGrow: 1, background: '#f6f6f6', marginBottom: 25 }}>
                <ServerData type='brand' id={props.id || 0}>
                    <ListItem component='div'>
                        <ListItemText primary={brand?.name || '???'} />
                    </ListItem>
                </ServerData>
                <ListItem component='div'>
                    <Autocomplete
                        size='small'
                        fullWidth
                        loading={stateLoading.loading}
                        options={options}
                        getOptionLabel={option => option.name}
                        onInputChange={(e, value) => setInputValue(value)}
                        onChange={(e, value) => props.setState(value?.id || null)}
                        renderInput={props => <TextField
                            {...props}
                            label='Kategoriýa gözle'
                        />}
                    />
                </ListItem>
            </List>
        </ListItem>
    )
}


export default Baners