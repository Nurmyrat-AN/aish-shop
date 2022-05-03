import { EditDialogTypes } from './../types';
const { v4: uuidv4 } = require('uuid')

export type DialogReducerType = {
    type: EditDialogTypes
    id: number | string | null
    uid?: string
}
const initialState: DialogReducerType[] = []

enum ActionType {
    OPEN_DIALOG = 'OPEN_DIALOG',
    CLOSE_DIALOG = 'CLOSE_DIALOG',
}
interface actionOpen {
    type: ActionType.OPEN_DIALOG
    payload: DialogReducerType
}

interface actionClose {
    type: ActionType.CLOSE_DIALOG
    uid: string
}

export const DialogsReducer = (state: DialogReducerType[] = initialState, action: actionOpen | actionClose) => {
    switch (action.type) {
        case ActionType.OPEN_DIALOG:
            return [
                ...state,
                action.payload
            ]
        case ActionType.CLOSE_DIALOG:
            return state.filter(item => item.uid !== action.uid)
        default:
            return state
    }
}

export const OpenGlobalDialog = (payload: DialogReducerType) => ({ type: ActionType.OPEN_DIALOG, payload: { ...payload, uid: uuidv4() } })
export const CloseGlobalDialog = (uid: string) => ({ type: ActionType.CLOSE_DIALOG, uid })