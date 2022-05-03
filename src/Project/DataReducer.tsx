import { BrandType, CategoryType, ObjectTypes, ProductDataType, ProductType } from "../types";
import { AppThunkAction } from "./store";

type ObjectDataTypes = ProductType | CategoryType | BrandType

type StateType = { [x in ObjectTypes]: { [x: number | string]: ObjectDataTypes } } & {
    product: { [x: number]: ProductType }
    category: { [x: number]: CategoryType }
    brand: { [x: number]: BrandType }
    productdata: { [x: string]: ProductDataType }
}
const intialState: StateType = {
    product: {},
    category: {},
    brand: {},
    group: {},
    productdata: {}
}

enum ActionType {
    SET_DATA = 'action/data-server/SET_DATA',
}


interface actionSetData {
    type: ActionType,
    key: keyof StateType,
    payload: ObjectDataTypes
}

export const DataReducer: (state: StateType | undefined, action: actionSetData) => StateType = (state = intialState, action) => {
    switch (action.type) {
        case ActionType.SET_DATA:
            return {
                ...state,
                [action.key]: {
                    ...state[action.key],
                    [action.payload.id || 0]: action.payload
                }
            }
        default:
            return state
    }
}

const SET_DATA = (received: { key: ObjectTypes, payload: ObjectDataTypes }) => ({ type: ActionType.SET_DATA, ...received })
export const GET_SERVER_DATA: (props: { type: ObjectTypes, id: number | string }) => AppThunkAction = (props) => {
    return (dispatch, getState, { getRequestApi }) => {
        let tryingCount = 0
        const getData = async () => {
            if (!props.id || props.id === '0') return;
            try {
                const data = await getRequestApi().getData({ path: props.type, data: { id: props.id } }) as ObjectDataTypes
                dispatch(SET_DATA({ key: props.type, payload: data }))
            } catch (e) {
                tryingCount++
                if (tryingCount < 5)
                    setTimeout(getData, 1000)
            }
        }
        getData()
    }
}
