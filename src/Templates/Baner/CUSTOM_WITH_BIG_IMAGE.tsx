import { Card, CardContent, CardMedia, Grid } from '@mui/material'
import React from 'react'
import { BanerPropsType } from './types'

const CUSTOM_WITH_BIG_IMAGE: React.FC<BanerPropsType> = props => {
    console.log(props)
    return (
        <Card>
            <CardMedia
                component={'img'}
                height={200}
                src={props.data?.[0]?.src || ''} />
            <div style={{ display: 'flex', overflow: 'auto', flexWrap: 'nowrap', marginTop: 8, background: '#eee' }}>
                {props.data.slice(1).map((item, idx) => <Card key={idx} className="img-preview" style={{ backgroundImage: `url(${item.src})`, backgroundColor: 'white', margin: '1px 2px', height: 100, width: 100, minHeight: 100, minWidth: 100, display: 'block' }} />)}
            </div>
        </Card>
    )
}

export default CUSTOM_WITH_BIG_IMAGE