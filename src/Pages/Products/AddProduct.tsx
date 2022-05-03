import { SearchOutlined } from '@mui/icons-material'
import { Autocomplete, Button, Card, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import React from 'react'
import { Loading, RetryButton } from '../../Components/Loading'
import { ServerData } from '../../Containers/ServerData'
import { getRequestApi, useAppSelector } from '../../Project/store'
import CustomImagePicker from '../../PureComponents/CustomImagePicker'
import { MultiLanguageTextField } from '../../PureComponents/MultiLanguageTextField'
import { emptyCategory, emptyProduct, ProductDataType, ProductType, StateLoadingType } from '../../types'

type Props = {
    id: number | string | null
    parent: number
    onClose: (refresh?: boolean) => void
}

const AddProduct: React.FC<Props> = (props) => {
    const brands = useAppSelector(state => state.DATA_LIST.brands)
    const [state, setState] = React.useState<ProductType>(emptyProduct)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    const [searchDataCollapsed, setSearchDatasCollapsing] = React.useState<boolean>(false)

    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState(emptyProduct)
                setStateLoading({ loading: false, fail: false })
            } else {
                try {
                    const product = await getRequestApi().getData({ path: `product`, data: { id: props.id } }) as ProductType
                    setState(product)
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
            const { data, ...rest } = state
            const showProgress = true
            if (props.id) {
                await getRequestApi().update({ path: 'product', id: props.id, data: rest, showProgress })
            } else {
                await getRequestApi().insert({ path: 'product', data: rest, showProgress })
            }
            props.onClose(true)
        } catch (e) {
        }
    }

    React.useEffect(() => {
        if (state.uid) setSearchDatasCollapsing(false)
    }, [state.uid])

    return (
        <Dialog
            open
            maxWidth='md'
            onClose={() => props.onClose()}>
            <DialogTitle>Haryt</DialogTitle>
            <DialogContent style={{ width: 500 }}>
                {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : <List>
                    <ListItem>
                        <ListItemAvatar>
                            <CustomImagePicker
                                multiple={false}
                                img={state.icon}
                                onChange={icon => setState(state => ({ ...state, icon }))}
                            />
                        </ListItemAvatar>
                        <ListItemText style={{ marginLeft: 10 }}><Typography variant='body2'>Ikonkasy</Typography></ListItemText>
                    </ListItem>
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
                        <MultiLanguageTextField
                            label='Düşündiriş'
                            rows={4}
                            value={state.description || ''}
                            onValueChange={description => setState(state => ({ ...state, description }))}
                            multiLanguageValue={state.description_lng}
                            onMultiLanguageValueChange={description_lng => setState(state => ({ ...state, description_lng }))}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            label='Unikalnyy ID'
                            helperText='Işkömekçi harytlary bilen arasyndaky baglanyşyk'
                            size='small'
                            value={state.uid}
                            onChange={e => setState(state => ({ ...state, uid: e.target.value }))}
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    <IconButton onClick={() => setSearchDatasCollapsing(collapsed => !collapsed)} size='small'><SearchOutlined fontSize='small' /></IconButton>
                                </InputAdornment>
                            }}
                        />
                    </ListItem>
                    <Collapse in={searchDataCollapsed}>
                        <AsyncAutoCompleteDatas setState={setState} uid={state.uid || '0'} />
                    </Collapse>
                    <ListItem>
                        <Autocomplete
                            options={brands}
                            fullWidth
                            size='small'
                            getOptionLabel={brand => brand.name}
                            value={brands.find(brand => brand.id === state.brand) || null}
                            onChange={(e, newValue) => setState(state => ({ ...state, brand: parseInt(newValue?.id?.toString() || '0') }))}
                            renderInput={props => <TextField {...props} label='Brend' />}
                        />
                    </ListItem>
                    <ListItem>
                        <Autocomplete
                            options={[] as string[]}
                            freeSolo
                            fullWidth
                            multiple
                            size='small'
                            value={state.topar}
                            onChange={(e, newValue) => setState(state => ({ ...state, topar: newValue }))}
                            renderInput={props => <TextField {...props} label='Meňzeş harytlar' />}
                        />
                    </ListItem>
                    <ListItem>
                        <Autocomplete
                            options={[] as string[]}
                            freeSolo
                            fullWidth
                            multiple
                            size='small'
                            value={state.key_words}
                            onChange={(e, newValue) => setState(state => ({ ...state, key_words: newValue }))}
                            renderInput={props => <TextField {...props} label='Açar sözler' />}
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
                </List>}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' size='small' color='inherit' onClick={() => setRetry(retry => retry + 1)}>Arassala</Button>
                <Button variant='contained' size='small' color='primary' onClick={handleSave}>Ýatda sakla</Button>
            </DialogActions>
        </Dialog>
    )
}

const AsyncAutoCompleteDatas: React.FC<{ setState: React.Dispatch<React.SetStateAction<ProductType>>, uid: string }> = (props) => {
    const [options, setOptions] = React.useState<ProductDataType[]>([])
    const [inputValue, setInputValue] = React.useState<string>('')
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: false, fail: false })
    const productdata = useAppSelector(state => state.DATA.productdata[props.uid])
    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            try {
                const { productDatas } = await getRequestApi().getDataList({ path: `productDatas`, data: { search: inputValue } }) as { productDatas: ProductDataType[] }
                setOptions(productDatas)
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
                <ServerData type='productdata' id={props.uid}>
                    <ListItem component='div'>
                        <ListItemText primary={productdata?.name || '???'} secondary={`${productdata?.price_base_for_sale || ''} ${productdata?.currency || ''}`} />
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
                        onChange={(e, value) => props.setState(state => ({ ...state, uid: value?.id || '' }))}
                        renderInput={props => <TextField
                            {...props}
                            label='Haryt maglumat gözle'
                        />}
                    />
                </ListItem>
            </List>
        </ListItem>
    )
}

export default AddProduct