import { SERVER_INSERT_TYPE, SERVER_UPDATE_TYPE, SERVER_DELETE_TYPE } from './../Server/types';
import axios from "axios";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore, Dispatch } from "redux";
import thunk from "redux-thunk";
import { SERVER_GET_LIST_TYPE, SERVER_GET_TYPE } from "../Server/types";
import ArchiveUtils from "./ArchiveUtils";
import { DataListReducer } from "./DataListReducer";
import { DataReducer } from "./DataReducer";
import { DialogsReducer } from "./DialogsReducer";
import { LanguageReducer } from "./LanguageReducer";

export const URL_API = 'http://localhost:2022'
// export const URL_API = 'https://api.atom.com.tm'

export const getRequestApi = () => new RequestApi()

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers({
    DIALOGS: DialogsReducer,
    DATA_LIST: DataListReducer,
    DATA: DataReducer,
    LANGUAGE: LanguageReducer,
    global: (state: { [x: string]: any } | undefined = {}, action) => action.type === 'MAIN/SET_GLOBAL' ? action.payload : state,
    // ...Reducers
}), composeEnhancers(applyMiddleware(thunk.withExtraArgument({ getRequestApi }))))


interface Action<T = any> {
    type: T
}
interface AnyAction extends Action {
    // Allows any extra properties to be defined in an action.
    [extraProps: string]: any
}
type RootState = ReturnType<typeof store.getState>
type AppDispatch = Dispatch<AnyAction | any>

export type AppThunkAction = (dispatch: AppDispatch, getState: () => RootState, extraArguments: { getRequestApi: typeof getRequestApi }) => any

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const SET_GLOBAL = (cb: (global: any, state: RootState) => any) => async (dispatch: AppDispatch, getState: () => RootState) => dispatch({ type: 'MAIN/SET_GLOBAL', payload: await cb(getState().global, getState()) })

class RequestApi {
    axios = axios.create({
        withCredentials: true,
        baseURL: URL_API
    })
    // ({ path: string, data: { [x: string]: any }, showProgress?: Boolean }) => any
    request = async ({ path, data, showProgress = false }: { path: string, data: any, showProgress?: Boolean }) => {
        try {
            // @ts-ignore
            if (showProgress) store.dispatch(SET_GLOBAL(global => ({ ...global, loading: true })))

            var fd = new FormData()
            const content = await ArchiveUtils.zip(data)
            fd.append('file', content)
            const requestURL = `${URL_API}${path}`
            const result = await axios.post(requestURL, fd, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/multipart-data'
                },
                responseType: 'blob',
            })
            //@ts-ignore
            if (showProgress) store.dispatch(SET_GLOBAL(global => ({ ...global, loading: false })))
            return await ArchiveUtils.unzip(result.data)
        } catch (e) {
            //@ts-ignore
            if (showProgress) store.dispatch(SET_GLOBAL(global => ({ ...global, loading: false })))
            throw e
        }
    }

    getData = (props: { path: SERVER_GET_TYPE, data: { id: number | string }, showProgress?: boolean }) => this.request({ path: `/get/${props.path}`, data: props.data, showProgress: props.showProgress })
    getDataList = (props: { path: SERVER_GET_LIST_TYPE, data: { [x: number | string]: any }, showProgress?: boolean }) => this.request({ path: `/list/${props.path}`, data: props.data, showProgress: props.showProgress })
    insert = (props: { path: SERVER_INSERT_TYPE, data: { [x: number | string]: any }, showProgress?: boolean }) => this.request({ path: `/insert/${props.path}`, data: props.data, showProgress: props.showProgress })
    update = (props: { path: SERVER_UPDATE_TYPE, id: number | string, data: { [x: number | string]: any }, showProgress?: boolean }) => this.request({ path: `/update/${props.path}/${props.id}`, data: props.data, showProgress: props.showProgress })
    delete = (props: { path: SERVER_DELETE_TYPE, data: { [x: number | string]: any }, showProgress?: boolean }) => this.request({ path: `/delete/${props.path}/0`, data: props.data, showProgress: props.showProgress })


}


//@ts-ignore
if (window.location.hostname === 'localhost') window.store = store;
export default store