import React from 'react'
import { CurrencyType, EditDialogTypes, StateLoadingType, emptyCurrency } from '../../types'
import { ADD_CURRENCIES, CLEAR_LIST } from '../../Project/DataListReducer'
import { DialogReducerType } from '../../Project/DialogsReducer'
import { getRequestApi, useAppDispatch, useAppSelector } from '../../Project/store'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import ListItem from '@mui/material/ListItem'
import { Loading, RetryButton } from '../../Components/Loading'
import ContextMenuWithChildren from '../../PureComponents/ContextMenuWithChildren'

const Currencies = () => {
    const [editData, setEditData] = React.useState<DialogReducerType | null>(null)
    const [search, setSearch] = React.useState<string>('')
    const [retry, setRetry] = React.useState<number>(0)
    const datas = useAppSelector(state => state.DATA_LIST.currencies)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const dispatch = useAppDispatch()

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        dispatch(CLEAR_LIST('currencies'))
        timer = setTimeout(async () => {
            try {
                const { currencies } = await getRequestApi().getDataList({ path: `currencies`, data: { search } }) as { currencies: CurrencyType[] }
                dispatch(ADD_CURRENCIES(currencies))
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
                <Button onClick={() => setEditData({ type: EditDialogTypes.currency, id: null })} size='small' variant='outlined' style={{ marginLeft: 10 }}>+</Button>
            </div>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Ady</TableCell>
                        <TableCell>Kurs</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stateLoading.loading || stateLoading.fail || datas.length === 0 ? <TableRow>
                        <TableCell align='center' colSpan={4}>
                            {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : 'Tapylmady!'}
                        </TableCell>
                    </TableRow> : datas.map(data => <ContextMenuWithChildren key={data.id} options={[{ label: 'Üýtget', onClick: () => setEditData({ type: EditDialogTypes.currency, id: data.id }) }]}><TableRow>
                        <TableCell>{data.id}</TableCell>
                        <TableCell>{data.kurs}</TableCell>
                    </TableRow></ContextMenuWithChildren>)}
                </TableBody>
            </Table>
            {editData && <EditCurrency onClose={handleClose} {...editData} />}
        </Container>
    )
}

type Props = {
    id: number | string | null
    onClose: (refresh?: boolean) => void
}
const EditCurrency: React.FC<Props> = (props) => {

    const [state, setState] = React.useState<CurrencyType>(emptyCurrency)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)

    React.useEffect(() => {
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState(emptyCurrency)
                setStateLoading({ loading: false, fail: false })
            } else {
                try {
                    const currency = await getRequestApi().getData({ path: `currency`, data: { id: props.id } }) as CurrencyType
                    setState(currency)
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
        if (!state.id) return;
        try {
            const data = state
            const showProgress = true
            if (props.id) {
                await getRequestApi().update({ path: 'currency', id: props.id, data, showProgress })
            } else {
                await getRequestApi().insert({ path: 'currency', data, showProgress })
            }
            props.onClose(true)
        } catch (e) {

        }
    }
    return (
        <Dialog open onClose={() => props.onClose()}>
            <DialogTitle>Walýuta</DialogTitle>
            <DialogContent style={{ width: 500 }}>
                {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : <List>
                    <ListItem>
                        <TextField
                            fullWidth
                            size='small'
                            label='Ady'
                            value={state.id}
                            onChange={e => setState(state => ({ ...state, id: e.target.value || '' }))}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            label='Kurs'
                            size='small'
                            type='number'
                            value={state.kurs}
                            onChange={e => setState(state => ({ ...state, kurs: parseFloat(e.target.value || '1') }))}
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


export default Currencies