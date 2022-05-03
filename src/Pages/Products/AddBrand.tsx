import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import React from 'react'
import { Loading, RetryButton } from '../../Components/Loading'
import { getRequestApi } from '../../Project/store'
import CustomImagePicker from '../../PureComponents/CustomImagePicker'
import { MultiLanguageTextField } from '../../PureComponents/MultiLanguageTextField'
import { BrandType, emptyBrand, StateLoadingType } from '../../types'

type Props = {
    id: number | string | null
    parent: number
    onClose: (refresh?: boolean) => void
}

const AddBrand: React.FC<Props> = (props) => {
    const [state, setState] = React.useState<BrandType>(emptyBrand)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)

    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState(emptyBrand)
                setStateLoading({ loading: false, fail: false })
            } else {
                try {
                    const brand = await getRequestApi().getData({ path: `brand`, data: { id: props.id } }) as BrandType
                    setState(brand)
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
                await getRequestApi().update({ path: 'brand', id: props.id, data, showProgress })
            } else {
                await getRequestApi().insert({ path: 'brand', data, showProgress })
            }
            props.onClose(true)
        } catch (e) {

        }
    }
    return (
        <Dialog
            open
            onClose={() => props.onClose()}>
            <DialogTitle>Brend</DialogTitle>
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

export default AddBrand