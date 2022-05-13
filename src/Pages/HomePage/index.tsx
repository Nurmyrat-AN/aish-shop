import { CloseOutlined } from "@mui/icons-material";
import { AppBar, Autocomplete, Avatar, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Radio, RadioGroup, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React from "react";
import { Loading, RetryButton } from "../../Components/Loading";
import { getRequestApi } from "../../Project/store";
import ContextMenuWithChildren from "../../PureComponents/ContextMenuWithChildren";
import HOME_TEMPLATES from "../../Templates";
import { StateLoadingType } from "../../types";
import { EditBaner } from "./EditBaner";
import { EditTopar } from "./EditTopar";
import { BANER_TEMPLATES, emptyHomeData, emptyHomeGroup, GROUP_TEMPLATES, HomeBanerImageType, HomeDataType, HomeDataTypeKeys, HomeGroupType } from "./hometypes";

const HomePage = () => {
    const [datas, setState] = React.useState<HomeDataType[]>([])
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [search, setSearch] = React.useState<string>('')
    const [retry, setRetry] = React.useState<number>(0)
    const [editData, setEditData] = React.useState<{ id: number | null } | null>(null)
    const [preview, setPreview] = React.useState<boolean>(false)

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            try {
                const { home } = await getRequestApi().getDataList({ path: 'home', data: { search } }) as { home: HomeDataType[] }
                setState(home)
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [search, retry])

    return (
        <Container>
            <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => setPreview(true)} size='small' variant='outlined' style={{ marginLeft: 10 }}>PREVIEW</Button>
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
                        <TableCell>Görnüşi</TableCell>
                        <TableCell>Şablony</TableCell>
                        <TableCell>Tertip belgi</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stateLoading.loading || stateLoading.fail || datas.length === 0 ? <TableRow>
                        <TableCell align='center' colSpan={4}>
                            {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : 'Tapylmady!'}
                        </TableCell>
                    </TableRow> : datas.map(data => <ContextMenuWithChildren key={data.id} options={[{ label: 'Üýtget', onClick: () => setEditData({ id: data.id }) }]}><TableRow>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.type}</TableCell>
                        <TableCell>{data.template}</TableCell>
                        <TableCell>{data.tertip}</TableCell>
                    </TableRow></ContextMenuWithChildren>)}
                </TableBody>
            </Table>

            <Preview datas={datas} open={preview} onClose={() => setPreview(false)} />

            {editData ? <EditDataDialog id={editData.id} onClose={(refresh?: boolean) => {
                if (refresh) setRetry(retry => retry + 1)
                setEditData(null)
            }} /> : null}
        </Container>
    )
}

const EditDataDialog: React.FC<{ id: number | null, onClose: (refresh?: boolean) => void }> = (props) => {
    const [state, setState] = React.useState<HomeDataType>(emptyHomeData)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        setStateLoading({ loading: true, fail: false })
        timer = setTimeout(async () => {
            if (props.id === null) {
                setState(emptyHomeData)
                setStateLoading({ loading: false, fail: false })
            } else {
                try {
                    const home = await getRequestApi().getData({ path: `home`, data: { id: props.id } }) as HomeDataType
                    setState(home)
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
            if (props.id) {
                await getRequestApi().update({ path: 'home', id: props.id, data: state, showProgress: true })
            } else {
                await getRequestApi().insert({ path: 'home', data: state, showProgress: true })
            }
            props.onClose(true)
        } catch (e) { }
    }

    const handleChangeType = (type: HomeDataTypeKeys) => {
        setState(state => type === HomeDataTypeKeys.baner ? ({
            ...state,
            type,
            template: 'SLIDER',
            data: []
        }) : ({
            ...state,
            type,
            template: 'SIMPLE',
            data: emptyHomeGroup
        }))
    }

    return (
        <Dialog
            onClose={() => props.onClose()}
            open
            fullWidth>
            <DialogTitle>
            </DialogTitle>
            <DialogContent style={{ minWidth: 500 }}>
                {stateLoading.loading ? <Loading /> : stateLoading.fail ? <RetryButton onClick={() => setRetry(retry => retry + 1)} /> : <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='body2'>Görnüşi:</Typography>
                        <Button onClick={() => handleChangeType(HomeDataTypeKeys.baner)} fullWidth style={{ margin: '0 10px' }} size='small' variant='contained' color={state.type === HomeDataTypeKeys.baner ? 'primary' : 'inherit'}>Baner</Button>,
                        <Button onClick={() => handleChangeType(HomeDataTypeKeys.group)} fullWidth style={{ margin: '0 10px' }} size='small' variant='contained' color={state.type === HomeDataTypeKeys.group ? 'primary' : 'inherit'}>Topar</Button>
                    </div>
                    <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                    <List>
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
                                onChange={e => setState(state => ({ ...state, tertip: parseInt(e.target.value || '0') }))}
                            />
                        </ListItem>
                        <ListItem>
                            <Autocomplete
                                size='small'
                                fullWidth
                                options={state.type === HomeDataTypeKeys.baner ? BANER_TEMPLATES : GROUP_TEMPLATES}
                                value={state.template}
                                //@ts-ignore
                                onChange={(e, template) => setState(state => template ? ({ ...state, template }) : state)}
                                renderInput={props => <TextField
                                    {...props}
                                    label='Şablon'
                                />}
                            />

                        </ListItem>
                        {state.type === HomeDataTypeKeys.baner ?
                            <EditBaner state={state.data} setState={(cb: (state: HomeBanerImageType[]) => HomeBanerImageType[]) => setState(state => state.type === HomeDataTypeKeys.baner ? ({ ...state, data: cb(state.data) }) : state)} />
                            : <EditTopar state={state.data} setState={(cb: (state: HomeGroupType) => HomeGroupType) => setState(state => state.type === HomeDataTypeKeys.group ? ({ ...state, data: cb(state.data) }) : state)} />}
                    </List>
                </div>}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' size='small' color='inherit' onClick={() => setRetry(retry => retry + 1)}>Arassala</Button>
                <Button variant='contained' size='small' color='primary' onClick={handleSave}>Ýatda sakla</Button>
            </DialogActions>
        </Dialog >
    )
}

const Preview: React.FC<{ datas: HomeDataType[], open: boolean, onClose: () => void }> = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}>
            <DialogTitle style={{ background: '#1976d2', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <b style={{ flexGrow: 1 }}>PREVIEW</b>
                    <IconButton onClick={props.onClose}><CloseOutlined fontSize='small' style={{ fill: 'white' }} /></IconButton>
                </div>
            </DialogTitle>
            <div style={{ height: 720, width: 380, overflow: 'auto' }}>
                {props.datas.map(data => <>
                    {data.type === 'group' ? <HOME_TEMPLATES.GROUP data={data.data} template={data.template} /> :
                        data.type === 'baner' ? <HOME_TEMPLATES.BANER data={data.data} template={data.template} /> : null}
                    <Divider />
                </>)}
            </div>
        </Dialog>
    )
}



export default HomePage