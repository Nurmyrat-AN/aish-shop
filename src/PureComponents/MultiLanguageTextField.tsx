import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Language from '@mui/icons-material/Language';
import React from "react";
import { LanguageTitles, MULTILANGUAGE_VALUE } from "../Project/LanguageReducer";

type Props = {
    label: string
    value: string
    rows?: number
    onValueChange: (value: string) => void
    multiLanguageValue?: MULTILANGUAGE_VALUE
    onMultiLanguageValueChange?: (multiLanguageValue: MULTILANGUAGE_VALUE) => void
}

export const MultiLanguageTextField: React.FC<Props> = props => {
    const [isExpanded, setCollapsing] = React.useState(false)

    return (
        <div style={{ flexGrow: 1 }}>
            <TextField
                label={props.label}
                fullWidth
                size='small'
                multiline={Boolean(props.rows)}
                rows={props.rows || 1}
                variant="outlined"
                value={props.value}
                onChange={e => props.onValueChange(e.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position='end'><IconButton onClick={() => setCollapsing(isExpanded => !isExpanded)} size='small'><Language fontSize='small' /></IconButton></InputAdornment>
                }}
            />
            <Collapse in={isExpanded}>
                <Card style={{ flexGrow: 1 }} elevation={3}>
                    <List>
                        {LanguageTitles.keys.map((key, idx) => <ListItem key={key}>
                            <TextField
                                label={LanguageTitles.titles[key]}
                                fullWidth
                                size='small'
                                multiline={Boolean(props.rows)}
                                rows={props.rows || 1}
                                variant="outlined"
                                value={props.multiLanguageValue?.[key] || ''}
                                onChange={e => props.onMultiLanguageValueChange ? props.onMultiLanguageValueChange({ ...props.multiLanguageValue || {}, [key]: e.target.value }) : null}
                            />
                        </ListItem>)}
                    </List>
                </Card>
            </Collapse>
        </div>
    )
}