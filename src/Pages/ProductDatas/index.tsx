import React from 'react'
import { Typography, TextField, Container, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import { BrandType, CategoryType, EditDialogTypes, ProductDataType, ProductType, StateLoadingType } from '../../types'
import { getRequestApi } from '../../Project/store'
import { Loading, RetryButton } from '../../Components/Loading'
import ContextMenuWithChildren from '../../PureComponents/ContextMenuWithChildren'
import AddProduct from '../Products/AddProduct'

const ProductDatas = () => {
    const [filter, setFilter] = React.useState<{ code?: string, search?: string, isactive?: string, property_1?: string, property_2?: string, property_3?: string, property_4?: string, property_5?: string, shop?: string }>({})
    const [datas, setDatas] = React.useState<ProductDataType[]>([])
    const refScroll = React.useRef(null)
    const [stateLoading, setStateLoading] = React.useState<StateLoadingType>({ loading: true, fail: false })
    const [retry, setRetry] = React.useState<number>(0)
    const [page, setPage] = React.useState<number>(0)
    const [count, setCount] = React.useState<number>(0)
    const [addUid, setUid] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (page === 0) setDatas([])
        setStateLoading({ loading: true, fail: false })
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(async () => {
            try {
                const { productDatas, count } = await getRequestApi().getDataList({ path: `productDatas`, data: { ...filter, page } }) as { productDatas: ProductDataType[], count: number }
                setCount(count)
                setDatas(datas => [...datas, ...productDatas])
                setStateLoading({ loading: false, fail: false })
            } catch (e) {
                setStateLoading({ loading: false, fail: true })
            }
        }, 500)
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [filter, page, retry])
    React.useEffect(() => setPage(0), [filter])

    const scrollEffect = count > datas.length && !stateLoading.loading && !stateLoading.fail

    React.useEffect(() => {
        const handleScroll = () => {
            if (refScroll.current) {
                //@ts-ignore
                const rect = refScroll.current.getBoundingClientRect()
                if (window.innerHeight > rect.top && scrollEffect) {
                    setPage(Math.ceil(datas.length / 10))
                }
            }
        }
        window.addEventListener('scroll', handleScroll)
        let timer: NodeJS.Timeout | null = null
        timer = setTimeout(handleScroll, 500)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (timer) clearTimeout(timer)
        }

    }, [refScroll.current, scrollEffect, datas.length])

    const handleTruncate = async () => {
        if (!window.confirm('Siz bu harydy hakykatdan hem sanawy arassalamak isleýäňizmi?')) return;
        try {
            await getRequestApi().truncate({ path: 'productDatas', showProgress: true })
            setPage(0)
        } catch (e) { }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Siz bu harydy hakykatdan hem pozmak isleýäňizmi?')) return;
        try {
            await getRequestApi().delete({ path: 'productDatas', id, data: { id }, showProgress: true })
            setDatas(datas => datas.filter(data => data.id !== id))
        } catch (e) { }
    }

    const handleClose = (refresh?: boolean) => {
        setUid(null)
        if (refresh) setRetry(retry => retry + 1)
    }

    return (
        <div style={{ marginTop: 10, marginLeft: 26, marginRight: 26 }}>
            <Table size='small' stickyHeader>
                <TableHead style={{ position: 'sticky', top: 50 }}>
                    <TableRow>
                        <ContextMenuWithChildren options={[{ label: 'Arassala', onClick: handleTruncate }]}><TableCell style={{ padding: 2 }}>ID</TableCell></ContextMenuWithChildren>
                        <SearchField label='Status' value={filter.isactive} onChange={isactive => setFilter(filter => ({ ...filter, isactive }))} />
                        <SearchField label='Kod' value={filter.code} onChange={code => setFilter(filter => ({ ...filter, code }))} />
                        <SearchField label='Ady' value={filter.search} onChange={search => setFilter(filter => ({ ...filter, search }))} />
                        <TableCell style={{ padding: 2 }} align='center'>Ölçegi</TableCell>
                        <TableCell style={{ padding: 2 }} align='center'>Satyş bahasy</TableCell>
                        <SearchField label='1-nji aýratynlyk' value={filter.property_1} onChange={property_1 => setFilter(filter => ({ ...filter, property_1 }))} />
                        <SearchField label='2-nji aýratynlyk' value={filter.property_2} onChange={property_2 => setFilter(filter => ({ ...filter, property_2 }))} />
                        <SearchField label='3-nji aýratynlyk' value={filter.property_3} onChange={property_3 => setFilter(filter => ({ ...filter, property_3 }))} />
                        <SearchField label='4-nji aýratynlyk' value={filter.property_4} onChange={property_4 => setFilter(filter => ({ ...filter, property_4 }))} />
                        <SearchField label='5-nji aýratynlyk' value={filter.property_5} onChange={property_5 => setFilter(filter => ({ ...filter, property_5 }))} />
                        <SearchField label='Dükan' value={filter.shop} onChange={shop => setFilter(filter => ({ ...filter, shop }))} />
                        <TableCell style={{ padding: 2 }} align='center'>Ulanyş sany</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datas.map(data => <ContextMenuWithChildren options={[{ label: 'Haryt döret', onClick: () => setUid(data.id) }, { label: 'Poz', onClick: () => handleDelete(data.id) }]} key={data.id}>
                        <TableRow>
                            <TableCell>{data.id}</TableCell>
                            <TableCell>{data.isactive}</TableCell>
                            <TableCell>{data.code}</TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.measure}</TableCell>
                            <TableCell>{`${data.price_base_for_sale} ${data.currency}`}</TableCell>
                            <TableCell>{data.property_1}</TableCell>
                            <TableCell>{data.property_2}</TableCell>
                            <TableCell>{data.property_3}</TableCell>
                            <TableCell>{data.property_4}</TableCell>
                            <TableCell>{data.property_5}</TableCell>
                            <TableCell>{data.shop}</TableCell>
                            <TableCell>{data.used}</TableCell>
                        </TableRow>
                    </ContextMenuWithChildren>
                    )}
                    {(stateLoading.loading || stateLoading.fail) ?
                        <TableRow>
                            <TableCell align='center' colSpan={13}>
                                {stateLoading.loading ? <Loading /> : <RetryButton onClick={() => setRetry(retry => retry + 1)} />}
                            </TableCell>
                        </TableRow> : datas.length === 0 ?
                            <TableRow>
                                <TableCell align='center' colSpan={13}>
                                    <Typography>Tapylmady!</Typography>
                                </TableCell>
                            </TableRow> : null}
                </TableBody>
            </Table>
            {addUid && <AddProduct id={null} parent={0} onClose={handleClose} uid={addUid} />}

            <div ref={refScroll} />
            {stateLoading.fail || stateLoading.loading || <div style={{ background: 'white', textAlign: 'center', position: 'sticky', bottom: 0 }}><Typography variant='caption' >{`JEMI: ${count}`}</Typography></div>}
        </div>
    )
}

const SearchField: React.FC<{ value?: string, onChange: (value: string) => void, label: string }> = props => {
    return (
        <TableCell style={{ padding: 2 }}>
            <TextField
                fullWidth
                size='small'
                value={props.value || ''}
                onChange={e => props.onChange(e.target.value)}
                label={props.label}
            />
        </TableCell>
    )
}

export default ProductDatas