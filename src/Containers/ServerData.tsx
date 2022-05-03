import React from 'react'
import { GET_SERVER_DATA } from '../Project/DataReducer'
import { useAppDispatch, useAppSelector } from '../Project/store'
import { ObjectTypes } from '../types'

type Props = {
    type: ObjectTypes
    id: number | string
    dataViaProps?: boolean
    children?: React.ReactNode
    [x: string]: any
}

export const ServerData: React.FC<Props> = (props) => {
    const {type, id, dataViaProps, children, ...rest} = props
    const dispatch = useAppDispatch()
    React.useEffect(() => {
        dispatch(GET_SERVER_DATA({ type: props.type, id: props.id }))
    }, [props.id, props.type])

    return (
        <>
            {props.dataViaProps ? <StateData {...props} /> : React.Children.map(props.children, (child) => React.isValidElement(child) ? React.cloneElement(child, {...rest}) : child)}
        </>
    )
}

const StateData: React.FC<Props> = (props) => {
    const {type, id, dataViaProps, children, ...rest} = props
    const data = useAppSelector(state => state.DATA[props.type][props.id])
    return (
        <>
            {React.Children.map(props.children, (child, idx) => React.isValidElement(child) ? React.cloneElement(child, { data, ...rest }) : child)}
        </>
    )
}