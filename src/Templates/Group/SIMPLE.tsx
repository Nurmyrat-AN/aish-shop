import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import React from "react";
import ServerProductsListContainer, { PropsForProductListContainer } from "../../Containers/ProductsList";
import { GroupPropsType } from "./types";

const SIMPLE: React.FC<GroupPropsType> = (props) => {
    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: 10, boxShadow: '0 1px 2px grey' }}>
                <Typography variant='body2' style={{ flexGrow: 1 }}>{props.data.name}</Typography>
                <KeyboardArrowRight fontSize='small' />
            </div>
            <div style={{ padding: 4 }}>
                <ServerProductsListContainer
                    category={props.data.category || undefined}
                    brand={props.data.brand || undefined}
                    groups={props.data.groups}
                    ids={props.data.products}
                ><ProductsList
                        products={[]}
                        count={0}
                        stateLoading={{ fail: false, loading: false }}
                        page={0}
                        setPage={() => null}
                        setRetry={() => null}
                    /></ServerProductsListContainer>
            </div>
        </div>
    )
}

const ProductsList: React.FC<PropsForProductListContainer> = (props) => {
    return (
        <Grid container spacing={2}>
            {props.products.slice(0, 6).map(product => <Grid item xs={6} style={{ display: 'flex' }}>
                <Card style={{ flexGrow: 1 }}>
                    <CardMedia
                        component='img'
                        height={120}
                        src={product.icon}
                    />
                    <CardContent>
                        <Typography variant='body1'>{product.name}</Typography>
                        <Typography variant='body1'>{`${((product.data?.price_base_for_sale || 1) * (product.data?.kurs || 1))} TMT`}</Typography>
                    </CardContent>
                </Card>
            </Grid>)}
        </Grid>
    )
}

export default SIMPLE