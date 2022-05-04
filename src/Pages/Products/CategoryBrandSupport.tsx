import { DeleteOutline } from "@mui/icons-material";
import { Autocomplete, Avatar, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material";
import React from "react";
import { Loading, RetryButton } from "../../Components/Loading";
import { ServerData } from "../../Containers/ServerData";
import { getRequestApi, useAppSelector } from "../../Project/store";
import { SERVER_GET_LIST_TYPE } from "../../Server/types";
import { BrandType, CategoryType, StateLoadingType } from "../../types";

type Props = { data: { category: number, brand?: null } | { category?: null, brand: number }, onClose: () => void }

const CategoryBrandSupport: React.FC<Props> = (props) => {
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    const [state, setState] = React.useState<CategoryType[] | BrandType[]>([])
    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            try {
                const { categoryBrandSupport } = await getRequestApi().getDataList({ path: `categoryBrandSupport`, data: props.data }) as { categoryBrandSupport: CategoryType[] | BrandType[] }
                setState(categoryBrandSupport)
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }

        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [props.data, retry])

    const handleAdd = (id: number | null) => {
        if (id) {
            getRequestApi().insert({ path: 'categoryBrandSupport', data: { category_id: props.data.category || id, brand_id: props.data.brand || id }, showProgress: true }).then(() => setRetry(retry => retry + 1))
        }
    }

    const handleDelete = (id: number | null) => {
        if (id) {
            getRequestApi().delete({ path: 'categoryBrandSupport', data: { category_id: props.data.category || id, brand_id: props.data.brand || id }, showProgress: true }).then(() => setRetry(retry => retry + 1))
        }
    }

    return (
        <Dialog
            open
            onClose={props.onClose}>
            <DialogTitle><ServerData type={props.data.category ? 'category' : 'brand'} id={props.data.category || props.data.brand || 0} dataViaProps><OwnDialogTItle /></ServerData></DialogTitle>
            <DialogContent style={{ minWidth: 450, minHeight: 300 }}>
                {stateLoading.loading || stateLoading.fail ? <div style={{ flex: '1 1', alignItems: 'center', justifyContent: 'center' }}>
                    {stateLoading.loading ? <Loading /> : <RetryButton onClick={() => setRetry(retry => retry + 1)} />}
                </div> :
                    <div style={{ maxHeight: 450, overflow: 'auto' }}>
                        <div>
                            <AsyncAutoCompleteDatas label={props.data.category ? "Brend gözle" : "Kategoriýa gözle"} path={props.data.category ? 'brands' : 'categories'} handleAdd={handleAdd} />
                        </div>
                        <List>
                            {state.map(item => <ListItem button key={item.id}>
                                <ListItemAvatar>
                                    <Avatar src={item.icon} />
                                </ListItemAvatar>
                                <ListItemText>{item.name}</ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => handleDelete(item.id)} size='small'><DeleteOutline color="error" /></IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>)}
                        </List>
                    </div>}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' size='small' color='inherit' onClick={() => setRetry(retry => retry + 1)}>Arassala</Button>
            </DialogActions>
        </Dialog>
    )
}

const OwnDialogTItle: React.FC<{ data?: { name: string } }> = props => {
    return <>{props.data?.name || '???'}</>
}


const AsyncAutoCompleteDatas: React.FC<{ handleAdd: (id: number | null) => void, label: string, path: SERVER_GET_LIST_TYPE }> = ({ label, ...props }) => {
    const [options, setOptions] = React.useState<BrandType[] | CategoryType[]>([])
    const [inputValue, setInputValue] = React.useState<string>('')
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: false, fail: false })
    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            try {
                const { brands, categories } = await getRequestApi().getDataList({ path: props.path, data: { search: inputValue } }) as { brands?: BrandType[], categories: CategoryType[] }
                setOptions(brands || categories || [])
            } catch (e) { }
            setStateLoading({ loading: false, fail: false })
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [inputValue, props.path])
    return (
        <List component={Card} elevation={5} style={{ flexGrow: 1, background: '#f6f6f6', marginBottom: 25 }}>
            <ListItem component='div'>
                <Autocomplete
                    size='small'
                    fullWidth
                    loading={stateLoading.loading}
                    options={options}
                    getOptionLabel={option => option.name}
                    onInputChange={(e, value) => setInputValue(value)}
                    onChange={(e, value) => { props.handleAdd(value?.id || null); setInputValue('') }}
                    renderInput={props => <TextField
                        {...props}
                        label={label}
                    />}
                />
            </ListItem>
        </List>
    )
}

export default CategoryBrandSupport