import SearchOutlined from '@mui/icons-material/SearchOutlined'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Loading, RetryButton } from '../../Components/Loading'
import { ServerData } from '../../Containers/ServerData'
import { getRequestApi, useAppSelector } from '../../Project/store'
import CustomImagePicker from '../../PureComponents/CustomImagePicker'
import { MultiLanguageTextField } from '../../PureComponents/MultiLanguageTextField'
import { emptyProduct, ProductDataType, ProductType, StateLoadingType } from '../../types'
import { AsyncAutoCompleteCategory } from '../HomePage/CommonFunctions'

type Props = {
    id: number | string | null
    uid?: string
    parent: number
    onClose: (refresh?: boolean) => void
}

const AddProduct: React.FC<Props> = (props) => {
    const brands = useAppSelector(state => state.DATA_LIST.brands)
    const [state, setState] = React.useState<ProductType>({ ...emptyProduct, category: props.parent, uid: props.uid || '' })
    const category = useAppSelector(stateApp => stateApp.DATA.category[state.category || 0])
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    const [searchDataCollapsed, setSearchDatasCollapsing] = React.useState<boolean>(false)

    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState({ ...emptyProduct, category: props.parent, uid: props.uid || '' })
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
    }, [props.id, retry, props.parent])

    const handleSave = async () => {
        if (!state.name) return;
        try {
            const { data, ...rest } = state
            const showProgress = true
            debugger
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
            <DialogTitle><ServerData type='category' id={state.category || 0}>{category?.name || 'Haryt'}</ServerData></DialogTitle>
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
                    <AsyncAutoCompleteCategory id={state.category} setState={category => setState(state => ({ ...state, category }))} />
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
                            label='D??????ndiri??'
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
                            helperText='I??k??mek??i harytlary bilen arasyndaky baglany??yk'
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
                            value={state.groups_base}
                            onChange={(e, newValue) => setState(state => ({ ...state, groups_base: newValue }))}
                            renderInput={props => <TextField {...props} label='Me??ze?? harytlar' />}
                        />
                    </ListItem>
                    <ListItem>
                        <Autocomplete
                            options={[] as string[]}
                            freeSolo
                            fullWidth
                            multiple
                            size='small'
                            value={state.groups_for_parent}
                            onChange={(e, newValue) => setState(state => ({ ...state, groups_for_parent: newValue }))}
                            renderInput={props => <TextField {...props} label='Enesine bagly topar' />}
                        />
                    </ListItem>
                    <ListItem>
                        <Autocomplete
                            options={[] as string[]}
                            freeSolo
                            fullWidth
                            multiple
                            size='small'
                            value={state.groups_for_children}
                            onChange={(e, newValue) => setState(state => ({ ...state, groups_for_children: newValue }))}
                            renderInput={props => <TextField {...props} label='Cagasyna bagly topar' />}
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
                            renderInput={props => <TextField {...props} label='A??ar s??zler' />}
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
                <Button variant='contained' size='small' color='primary' onClick={handleSave}>??atda sakla</Button>
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
                const { productDatas } = await getRequestApi().getDataList({ path: `productDatas`, data: { search: inputValue, countPerPage: 50 } }) as { productDatas: ProductDataType[] }
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
                        renderOption={(props, option) => <ListItem {...props} key={option.id}><ListItemText primary={option.name} secondary={`Ulanylan haryt sany: ${option.used || 0}`} /></ListItem>}
                        options={options}
                        getOptionLabel={option => option.name}
                        onInputChange={(e, value) => setInputValue(value)}
                        onChange={(e, value) => props.setState(state => ({ ...state, uid: value?.id || '' }))}
                        renderInput={props => <TextField
                            {...props}
                            label='Haryt maglumat g??zle'
                        />}
                    />
                </ListItem>
            </List>
        </ListItem>
    )
}

export default AddProduct