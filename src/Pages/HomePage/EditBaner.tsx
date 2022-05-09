import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { Avatar, Button, Card, CardContent, Collapse, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material"
import React from "react"
import CustomImagePicker from "../../PureComponents/CustomImagePicker"
import DragSort from "../../PureComponents/DragSort"
import { MultiLanguageTextField } from "../../PureComponents/MultiLanguageTextField"
import { AsyncAutoCompleteBrand, AsyncAutoCompleteCategory, AsyncAutoCompleteProduct } from "./CommonFunctions"
import { HomeBanerImageType } from "./hometypes"

type Props = { state: HomeBanerImageType[], setState: (cb: (state: HomeBanerImageType[]) => HomeBanerImageType[]) => void }
export const EditBaner: React.FC<Props> = ({ state, setState }) => {
    return (
        <>
            <ListItem>
                <Typography variant='body2' style={{ flexGrow: 1 }}>Suratlar</Typography>
                <CustomImagePicker
                    multiple
                    height={60}
                    width={60}
                    onChange={images => setState(state => [...state, ...images.map(img => ({ name: '', src: img }))])}
                />
            </ListItem>
            <ListItem>
                <List style={{ height: 500, overflow: 'auto', flexGrow: 1 }} elevation={5} component={Card}>
                    <DragSort onChange={sort => setState(state => sort.map(idx => state[idx]))}>
                        {state.map((item, idx) => <BanerItem
                            key={idx}
                            item={item}
                            idx={idx}
                            state={state}
                            setState={setState}
                        />)}
                    </DragSort>
                </List>
            </ListItem>
        </>
    )
}

const BanerItem: React.FC<Props & { item: HomeBanerImageType, idx: number, [x: string]: any }> = ({ idx, item, setState, state, ...rest }) => {
    const [isExpanded, setExpanded] = React.useState<boolean>(false)
    return (
        <div style={{ margin: 5 }} {...rest}>
            <ListItem component={Card}>
                <ListItemAvatar>
                    <Avatar src={item.src} />
                </ListItemAvatar>
                <MultiLanguageTextField
                    label="Ady"
                    value={item.name}
                    multiLanguageValue={item.name_lng}
                    onValueChange={name => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ ...sitem, name })))}
                    onMultiLanguageValueChange={name_lng => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ ...sitem, name_lng })))}
                />
                <ListItemSecondaryAction>
                    <IconButton size='small' onClick={() => setExpanded(expanded => !expanded)}>
                        {isExpanded ? <KeyboardArrowDown fontSize='small' /> : <KeyboardArrowUp fontSize='small' />}
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={isExpanded}>
                <Grid container spacing={2} style={{ padding: 10 }}>
                    <Grid item xs={6}><Button onClick={() => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ name: sitem.name, name_lng: sitem.name_lng, src: sitem.src })))} fullWidth size='small' variant={!item.category && !item.brand && !item.product ? 'contained' : 'outlined'}>Boş surat</Button></Grid>
                    <Grid item xs={6}><Button onClick={() => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ name: sitem.name, name_lng: sitem.name_lng, src: sitem.src, category: { id: null } })))} fullWidth size='small' variant={item.category ? 'contained' : 'outlined'}>Kategoriýa</Button></Grid>
                    <Grid item xs={6}><Button onClick={() => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ name: sitem.name, name_lng: sitem.name_lng, src: sitem.src, brand: { id: null } })))} fullWidth size='small' variant={item.brand ? 'contained' : 'outlined'}>Brend</Button></Grid>
                    <Grid item xs={6}><Button onClick={() => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ name: sitem.name, name_lng: sitem.name_lng, src: sitem.src, product: { id: null } })))} fullWidth size='small' variant={item.product ? 'contained' : 'outlined'}>Haryt</Button></Grid>
                </Grid>
                {item.product ? <AsyncAutoCompleteProduct id={item.product.id} setState={id => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ ...item, product: { id } })))} />
                    : item.category ? <AsyncAutoCompleteCategory id={item.category.id} setState={id => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ ...item, category: { id } })))} />
                        : item.brand ? <AsyncAutoCompleteBrand id={item.brand.id} setState={id => setState(state => state.map((sitem, sidx) => sidx !== idx ? sitem : ({ ...item, brand: { id } })))} />
                            : null
                }
            </Collapse>
        </div>
    )
}
