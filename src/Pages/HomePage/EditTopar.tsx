import { KeyboardArrowRight, KeyboardArrowUp } from "@mui/icons-material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Card, CardContent, CardMedia, Collapse, ListItem, ListItemAvatar, ListItemText, Typography, Autocomplete, TextField } from "@mui/material";
import React from "react";
import { MultiLanguageTextField } from "../../PureComponents/MultiLanguageTextField";
import { AsyncAutoCompleteProductMultiple, AsyncAutoCompleteCategory, AsyncAutoCompleteBrand } from "./CommonFunctions";
import { HomeGroupType } from "./hometypes";


type Props = { state: HomeGroupType, setState: (cb: (state: HomeGroupType) => HomeGroupType) => void }
export const EditTopar: React.FC<Props> = ({ state, setState }) => {
    const [expand, setExpanded] = React.useState<'products' | 'category' | 'brand' | 'groups' | 'discount'>(
        state.products ? 'products' :
            state.category ? 'category' :
                state.brand ? 'brand' :
                    state.groups ? 'groups' :
                        state.discount ? 'discount' : 'products'
    )

    React.useEffect(() => {
        setState(state => ({
            name: state.name,
            name_lng: state.name_lng,
            ...expand === 'products' ? { products: state.products || [] } : {},
            ...expand === 'category' ? { category: state.category || null } : {},
            ...expand === 'brand' ? { brand: state.brand || null } : {},
            ...expand === 'groups' ? { groups: state.groups || [] } : {},
            ...expand === 'discount' ? { discount: state.discount || null } : {},
        }))
    }, [expand])
    return (
        <>
            <ListItem>
                <MultiLanguageTextField
                    value={state.name}
                    multiLanguageValue={state.name_lng}
                    onValueChange={name => setState(state => ({ ...state, name }))}
                    onMultiLanguageValueChange={name_lng => setState(state => ({ ...state, name_lng }))}
                    label='Ady'
                />
            </ListItem>
            <CollapseItem
                expanded={expand === 'products'}
                label='Harytlar'
                setExpanded={() => setExpanded('products')}
                collapseData={<AsyncAutoCompleteProductMultiple setState={setState} products={state.products || []} onSort={indexes => setState(state => ({ ...state, products: indexes.map(idx => (state.products || [])[idx] || 0) }))} />}
            />
            <CollapseItem
                expanded={expand === 'category'}
                label='Kategoriýa'
                setExpanded={() => setExpanded('category')}
                collapseData={<AsyncAutoCompleteCategory id={state.category || null} setState={id => setState(state => ({ ...state, category: id }))} />}
            />
            <CollapseItem
                expanded={expand === 'brand'}
                label='Brend'
                setExpanded={() => setExpanded('brand')}
                collapseData={<AsyncAutoCompleteBrand id={state.brand || null} setState={id => setState(state => ({ ...state, brand: id }))} />}
            />
            <CollapseItem
                expanded={expand === 'groups'}
                label='Haryt toparlary'
                setExpanded={() => setExpanded('groups')}
                collapseData={<Autocomplete
                    options={[]}
                    value={state.groups || []}
                    //@ts-ignore
                    onChange={(e, groups) => setState(state => ({ ...state, groups }))}
                    freeSolo
                    multiple={true}
                    fullWidth
                    size='small'
                    renderInput={props => <TextField {...props} label='Haryt toparlary' />} />}
            />
            <CollapseItem
                expanded={expand === 'discount'}
                label='Arzanladyşdaky harytlar'
                setExpanded={() => setExpanded('discount')}
                collapseData='Salam'
            />
        </>
    )
}

const CollapseItem: React.FC<{ expanded: boolean, label: string, collapseData: any, setExpanded: () => void }> = (props) => {
    return (
        <ListItem>
            <Card style={{ flexGrow: 1 }}>
                <CardMedia style={{ boxShadow: '0 1px 2px gray' }}>
                    <ListItem button onClick={props.setExpanded} component='div'>
                        <ListItemAvatar>{props.expanded ? <KeyboardArrowDown color={props.expanded ? 'primary' : 'disabled'} fontSize='small' /> : <KeyboardArrowRight color={props.expanded ? 'primary' : 'disabled'} fontSize='small' />}</ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2" color={props.expanded ? 'primary' : 'textSecondary'}>{props.label}</Typography>
                        </ListItemText>
                    </ListItem>
                </CardMedia>
                <Collapse in={props.expanded}>
                    <CardContent>
                        {props.collapseData}
                    </CardContent>
                </Collapse>
            </Card>
        </ListItem>
    )
}