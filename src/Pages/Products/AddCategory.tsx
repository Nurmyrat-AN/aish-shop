import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Loading, RetryButton } from '../../Components/Loading'
import { getRequestApi } from '../../Project/store'
import CustomImagePicker from '../../PureComponents/CustomImagePicker'
import { MultiLanguageTextField } from '../../PureComponents/MultiLanguageTextField'
import { CategoryType, emptyCategory, StateLoadingType } from '../../types'

type Props = {
    id: number | string | null
    parent: number
    onClose: (refresh?: boolean) => void
}

const AddCategory: React.FC<Props> = (props) => {
    const [state, setState] = React.useState<CategoryType>(emptyCategory)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)

    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState(emptyCategory)
                setStateLoading({ loading: false, fail: false })
            } else {
                try {
                    const category = await getRequestApi().getData({ path: 'category', data: { id: props.id } }) as CategoryType
                    setState(category)
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
                await getRequestApi().update({ path: 'category', id: props.id, data, showProgress })
            } else {
                await getRequestApi().insert({ path: 'category', data, showProgress })
            }
            props.onClose(true)
        } catch (e) {

        }
    }
    return (
        <Dialog
            open
            onClose={() => props.onClose()}>
            <DialogTitle>Kategoriýa</DialogTitle>
            <DialogContent>
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

export default AddCategory