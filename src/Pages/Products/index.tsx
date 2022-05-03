import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material'
import { Avatar, Button, Card, Chip, Collapse, Container, Divider, Grid, InputAdornment, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material'
import React from 'react'
import { Loading, RetryButton } from '../../Components/Loading'
import { ServerData } from '../../Containers/ServerData'
import { ADD_BRANDS, ADD_CATEGORIES, ADD_PRODUCTS, CLEAR_LIST } from '../../Project/DataListReducer'
import { DialogReducerType } from '../../Project/DialogsReducer'
import { getRequestApi, useAppDispatch, useAppSelector } from '../../Project/store'
import ContextMenuWithChildren from '../../PureComponents/ContextMenuWithChildren'
import { BrandType, CategoryType, EditDialogTypes, ProductType, StateLoadingType } from '../../types'
import AddBrand from './AddBrand'
import AddCategory from './AddCategory'
import AddProduct from './AddProduct'

const grid_sizes = {
    xs: 6,
    sm: 4,
    md: 3,
    xl: 2.4
}

const Products = () => {
    const [editData, setEditData] = React.useState<DialogReducerType | null>(null)
    const [collapse, setCollapse] = React.useState<{ category: boolean, brand: boolean }>({ category: true, brand: true })
    const [currentCategory, setCurrentCategory] = React.useState<number>(0)
    const [currentBrand, setCurrentBrand] = React.useState<number | null>(null)
    const [anchorEl, setAnchorEl] = React.useState<any>(null)

    const [search, setSearch] = React.useState<string>('')
    const [retry, setRetry] = React.useState<number>(0)

    React.useEffect(() => setCurrentBrand(null), [currentCategory])

    const handleAdd = (type: EditDialogTypes, id: number | null) => {
        setAnchorEl(null)
        setEditData({ type, id })
    }

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
                    InputProps={{
                        startAdornment: <InputAdornment position='start'>
                            <ServerData type='category' id={currentCategory} dataViaProps><CategoryTitle setCurrentCategory={setCurrentCategory} /></ServerData>
                        </InputAdornment>,
                        endAdornment: <InputAdornment position='end'>
                            <ServerData type='brand' id={currentBrand || 0} dataViaProps><BrandTitle setCurrentBrand={setCurrentBrand} /></ServerData>
                        </InputAdornment>
                    }}
                />
                <Button onClick={e => setAnchorEl(e.currentTarget)} size='small' variant='outlined' style={{ marginLeft: 10 }}>+</Button>
                <Menu
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                >
                    <MenuItem onClick={() => handleAdd(EditDialogTypes.category, null)}>Kategoriýa</MenuItem>
                    <MenuItem onClick={() => handleAdd(EditDialogTypes.brand, null)}>Brend</MenuItem>
                    <MenuItem onClick={() => handleAdd(EditDialogTypes.product, null)}>Haryt</MenuItem>
                </Menu>
            </div>
            <Divider />
            {editData?.type === EditDialogTypes.product ?
                <AddProduct onClose={handleClose} parent={currentCategory} id={editData.id} />
                : editData?.type === EditDialogTypes.category ?
                    <AddCategory onClose={handleClose} parent={currentCategory} id={editData.id} />
                    : editData?.type === EditDialogTypes.brand ?
                        <AddBrand onClose={handleClose} parent={currentCategory} id={editData.id} />
                        : null}
            <Button onClick={() => setCollapse(colllapse => ({ ...collapse, category: !collapse.category }))} size='small' color='inherit' startIcon={collapse.category ? <KeyboardArrowDown fontSize='small' /> : <KeyboardArrowRight fontSize='small' />}>Kategoriýalar</Button>
            <Collapse in={collapse.category}>
                <Categories handleAdd={handleAdd} retry={retry} currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
            </Collapse>
            <Button onClick={() => setCollapse(colllapse => ({ ...collapse, brand: !collapse.brand }))} size='small' color='inherit' startIcon={collapse.brand ? <KeyboardArrowDown fontSize='small' /> : <KeyboardArrowRight fontSize='small' />}>Brendler</Button>
            <Collapse in={collapse.brand}>
                <Brands handleAdd={handleAdd} retry={retry} currentCategory={currentCategory} setCurrentBrand={setCurrentBrand} />
            </Collapse>
            <Divider />
            <ProductsList handleAdd={handleAdd} retry={retry} currentCategory={currentCategory} currentBrand={currentBrand} search={search} />
        </Container>
    )
}

const CategoryTitle = (props: { data?: CategoryType, setCurrentCategory: (id: number) => void }) => {
    return (
        <Chip variant='outlined' size='small' label={props.data?.name || 'Ählisi'} onDelete={props.data?.id ? () => props.setCurrentCategory(props.data?.parent || 0) : undefined} />
    )
}

const BrandTitle = (props: { data?: CategoryType, setCurrentBrand: (id: number | null) => void }) => {
    return (
        <Chip variant='outlined' size='small' label={props.data?.name || 'Ählisi'} onDelete={props.data?.id ? () => props.setCurrentBrand(null) : undefined} />
    )
}

const Categories: React.FC<{ currentCategory: number, setCurrentCategory: (id: number) => void, retry: number, handleAdd: (type: EditDialogTypes, id: number | null) => void }> = (props) => {
    const categories = useAppSelector(state => state.DATA_LIST.categories)
    const dispatch = useAppDispatch()
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    React.useEffect(() => {
        dispatch(CLEAR_LIST('categories'))
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            try {
                const { categories } = await getRequestApi().getDataList({ path: `categories`, data: { id: props.currentCategory } }) as { categories: CategoryType[] }
                dispatch(ADD_CATEGORIES(categories))
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [props.currentCategory, retry, props.retry])
    return (
        <Tabs value={0} variant='scrollable'>
            <Tab label='Ählisi' />
            {stateLoading.loading || stateLoading.fail ? stateLoading.loading ? <Loading /> : <span><RetryButton onClick={() => setRetry(retry => retry + 1)} /></span> :
                categories.map(category =>
                    <ContextMenuWithChildren
                        key={category.id}
                        options={[{ label: 'Üýtget', onClick: () => props.handleAdd(EditDialogTypes.category, category.id) }]}
                    >
                        <Tab
                            onClick={e => props.setCurrentCategory(category.id || 0)}
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar style={{ height: 24, width: 24 }} src={category.icon} />
                                    <div style={{ width: 10 }} />
                                    <Typography variant='caption' style={{ lineHeight: 1 }}>{category.name}</Typography>
                                </div>
                            } />
                    </ContextMenuWithChildren>)
            }
        </Tabs>
    )
}

const Brands: React.FC<{ currentCategory: number, setCurrentBrand: (id: number | null) => void, retry: number, handleAdd: (type: EditDialogTypes, id: number | null) => void }> = (props) => {
    const brands = useAppSelector(state => state.DATA_LIST.brands)
    const dispatch = useAppDispatch()
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    React.useEffect(() => {
        dispatch(CLEAR_LIST('brands'))
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            try {
                const { brands } = await getRequestApi().getDataList({ path: `brands`, data: { id: props.currentCategory } }) as { brands: BrandType[] }
                dispatch(ADD_BRANDS(brands))
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [props.currentCategory, retry, props.retry])
    return (
        <Tabs value={0} variant='scrollable'>
            <Tab label='Ählisi' />
            {stateLoading.loading || stateLoading.fail ? stateLoading.loading ? <Loading /> : <span><RetryButton onClick={() => setRetry(retry => retry + 1)} /></span> :
                brands.map(brand =>
                    <ContextMenuWithChildren
                        key={brand.id}
                        options={[{ label: 'Üýtget', onClick: () => props.handleAdd(EditDialogTypes.brand, brand.id) }]}
                    >
                        <Tab
                            onClick={e => props.setCurrentBrand(brand.id)}
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar style={{ height: 24, width: 24 }} src={brand.icon} />
                                    <div style={{ width: 10 }} />
                                    <Typography variant='caption' style={{ lineHeight: 1 }}>{brand.name}</Typography>
                                </div>
                            } />
                    </ContextMenuWithChildren>)
            }
        </Tabs>
    )
}

const ProductsList: React.FC<{ currentCategory: number, retry: number, currentBrand: number | null, search: string, handleAdd: (type: EditDialogTypes, id: number | null) => void }> = (props) => {
    const products = useAppSelector(state => state.DATA_LIST.products)
    const dispatch = useAppDispatch()
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    const [page, setPage] = React.useState<number>(0)
    const [count, setCount] = React.useState<number>(0)
    React.useEffect(() => {
        if (page === 0) dispatch(CLEAR_LIST('products'))
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            try {
                const { products, count } = await getRequestApi().getDataList({ path: `products`, data: { brand: props.currentBrand, search: props.search, page, categories: [props.currentCategory] } }) as { products: ProductType[], count: number }
                setCount(count)
                dispatch(ADD_PRODUCTS(products))
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [props.currentCategory, retry, props.retry, props.currentBrand, props.search, page])

    React.useEffect(() => setPage(0), [props.currentCategory, props.search, props.currentBrand])

    return (
        <>
            <Grid style={{ marginTop: 10 }} container spacing={3}>
                {(stateLoading.loading || stateLoading.fail) && page === 0 ? <Grid item>
                    {stateLoading.loading ? <Loading /> : <RetryButton onClick={() => setRetry(retry => retry + 1)} />}
                </Grid> : products.length === 0 ? <Grid item xs={12}><div style={{ textAlign: 'center' }}>Tapylmady!</div></Grid> : products.map(product =>
                    <ContextMenuWithChildren
                        key={product.id}
                        options={[{ label: 'Üýtget', onClick: () => props.handleAdd(EditDialogTypes.product, product.id) }]}
                    >
                        <Grid
                            item
                            {...grid_sizes}
                        >
                            <ListItem component={Card} style={{ cursor: 'pointer', height: '100%' }} button>
                                <ListItemAvatar>
                                    <Avatar src={product.icon} />
                                </ListItemAvatar>
                                <ListItemText primary={product.name} secondary={`${product.data?.price_base_for_sale || '???'} ${product.data?.currency}`} />
                            </ListItem>
                        </Grid>
                    </ContextMenuWithChildren>)}
                {(stateLoading.loading || stateLoading.fail) && page > 0 ? <Grid item>
                    {stateLoading.loading ? <Loading /> : <RetryButton onClick={() => setRetry(retry => retry + 1)} />}
                </Grid> : null}
            </Grid>
            {stateLoading.fail || stateLoading.loading || products.length % 50 !== 0 || products.length === 0 || <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}><Button onClick={() => setPage(page => page + 1)} variant='contained' size='small'>Ýene</Button></div>}
            {stateLoading.fail || stateLoading.loading || <div style={{ background: 'white', textAlign: 'center', position: 'sticky', bottom: 0 }}><Typography variant='caption' >{`JEMI: ${count}`}</Typography></div>}
        </>
    )
}


export default Products