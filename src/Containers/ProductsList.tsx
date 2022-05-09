import React from 'react'
import { getRequestApi } from '../Project/store'
import { ProductType, StateLoadingType } from '../types'


type Props = {
    children?: any
    category?: number
    ids?: number[]
    categories?: number[]
    brand?: number
    brands?: number[]
    search?: string
    groups?: string[]
    withData?: boolean
}

const ServerProductsListContainer: React.FC<Props> = ({ children, ...rest }) => {
    const [state, setState] = React.useState<ProductType[]>([])
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    const [page, setPage] = React.useState<number>(0)
    const [count, setCount] = React.useState<number>(0)

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            try {
                const { products, count } = await getRequestApi().getDataList({ path: `products`, data: rest }) as { products: ProductType[], count: number }
                setCount(count)
                setState(state => page > 0 ? [...state, ...products] : products)
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [rest, retry, page])
    return (
        <>
            {React.Children.map(children, (child, idx) => React.isValidElement<PropsForProductListContainer>(child) ? React.cloneElement(child, {
                products: state,
                count,
                page,
                setRetry: () => setRetry(retry => retry + 1),
                stateLoading,
                setPage
            }) : child)}
        </>
    )
}

export type PropsForProductListContainer = {
    products: ProductType[]
    stateLoading: StateLoadingType
    page: number
    setRetry: () => void
    count: number
    setPage: (page: number) => void
}

export default ServerProductsListContainer