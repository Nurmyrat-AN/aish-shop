import { Card, Grid } from '@mui/material'
import React from 'react'
import { BanerPropsType } from './types'

const GRID_LIST: React.FC<BanerPropsType> = props => {
    return (
        <div style={{ padding: 4 }}>
            <Grid container spacing={2}>
                {props.data.map((item, idx) => <Grid key={idx} xs={6} item>
                    <Card className="img-preview" style={{ backgroundImage: `url(${item.src})`, height: 180, display: 'block' }} />
                </Grid>)}
            </Grid>
        </div>
    )
}

export default GRID_LIST