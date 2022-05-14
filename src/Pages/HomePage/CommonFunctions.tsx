import { DeleteOutlined, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { Autocomplete, Avatar, Card, Collapse, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material"
import React from "react"
import { ServerData } from "../../Containers/ServerData"
import { getRequestApi, useAppSelector } from "../../Project/store"
import DragSort from "../../PureComponents/DragSort"
import { BrandType, CategoryType, ProductType, StateLoadingType } from "../../types"

export const AsyncAutoCompleteProduct: React.FC<{ setState: (id: number | null) => void, id: number | null }> = (props) => {
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


export const AsyncAutoCompleteCategory: React.FC<{ setState: (id: number | null) => void, id: number | null }> = (props) => {
    const [options, setOptions] = React.useState<CategoryType[]>([])
    const [inputValue, setInputValue] = React.useState<string>('')
    const [isExpanded, setExpanded] = React.useState<boolean>(false)
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
            <List component={Card} style={{ flexGrow: 1, padding: 0 }}>
                <ServerData type='category' id={props.id || 0}>
                    <ListItem component='div'>
                        <ListItemText primary={category?.name || '???'} />
                        <ListItemSecondaryAction><IconButton onClick={() => setExpanded(isExpanded => !isExpanded)} size='small'>{isExpanded ? <KeyboardArrowUp fontSize='small' /> : <KeyboardArrowDown fontSize='small' />}</IconButton></ListItemSecondaryAction>
                    </ListItem>
                </ServerData>
                <Collapse in={isExpanded}>
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
                </Collapse>
            </List>
        </ListItem>
    )
}


export const AsyncAutoCompleteBrand: React.FC<{ setState: (id: number | null) => void, id: number | null }> = (props) => {
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



export const AsyncAutoCompleteProductMultiple: React.FC<{ setState: (cb: (products: number[]) => number[]) => void, products: number[], onSort: (indexes: number[]) => void }> = (props) => {
    const [options, setOptions] = React.useState<ProductType[]>([])
    const [inputValue, setInputValue] = React.useState<string>('te')
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: false, fail: false })
    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            try {
                setStateLoading({ loading: true, fail: false })
                const { products } = await getRequestApi().getDataList({ path: `products`, data: { search: inputValue, brand: null, categories: [0] } }) as { products: ProductType[] }
                setOptions(products)
            } catch (e) { }
            setStateLoading({ loading: false, fail: false })
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [inputValue])

    debugger
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
                    onInputChange={(e, value, reason) => setInputValue(value)}
                    inputValue={inputValue}
                    multiple
                    renderTags={props => null}
                    onChange={(e, value) => props.setState(products => [...products, ...value.filter(v => !v.id || !props.products.includes(v.id)).map(v => v.id || 0)])}
                    renderInput={props => <TextField
                        {...props}
                        label='Haryt gözle'
                    />}
                />
                <List
                    component={Card}
                    elevation={5}
                    style={{ flexGrow: 1, height: 300, overflow: 'auto' }}
                >
                    <ListItem component='div'><Divider /></ListItem>
                    <ListItem component='div'>
                        <List style={{ flexGrow: 1 }}>
                            <DragSort onChange={props.onSort}>
                                {props.products.map(id => <ListItem key={id}>
                                    <ServerData id={id} type='product' dataViaProps><ProductItem id={id} onRemove={id => props.setState(products => (products || []).filter(sp => sp !== id))} /></ServerData>
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
                <IconButton size='small' onClick={() => props.onRemove(props.id)}><DeleteOutlined color='error' fontSize='small' /></IconButton>
            </ListItemSecondaryAction>
        </>
    )
}


