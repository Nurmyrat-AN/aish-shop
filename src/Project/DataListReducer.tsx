import { BanerType, BrandType, CategoryType, CurrencyType, GroupType, ProductType } from "../types";

type StateType = {
    categories: CategoryType[]
    products: ProductType[]
    brands: BrandType[]
    groups: GroupType[]
    currencies: CurrencyType[]
    baners: BanerType[]
}

const intialState: StateType = {
    categories: [],
    products: [],
    brands: [],
    groups: [],
    currencies: [],
    baners: []
}


enum ActionType {
    SET_PRODUCTS = 'action/datalist/SET_PRODUCTS',
    SET_CATEGORIES = 'action/datalist/SET_CATEGORIES',
    SET_BRANDS = 'action/datalist/SET_BRANDS',
    SET_GROUPS = 'action/datalist/SET_GROUPS',
    SET_CURRENCIES = 'action/datalist/SET_CURRENCIES',
    SET_BANERS = 'action/datalist/SET_BANERS',
    CLEAR = 'action/datalist/CLEAR',
}

interface actionProducts {
    type: ActionType.SET_PRODUCTS
    payload: ProductType[]
}

interface actionCategory {
    type: ActionType.SET_CATEGORIES
    payload: CategoryType[]
}

interface actionBrands {
    type: ActionType.SET_BRANDS
    payload: BrandType[]
}

interface actionGroups {
    type: ActionType.SET_GROUPS
    payload: GroupType[]
}

interface actionBaners {
    type: ActionType.SET_BANERS
    payload: BanerType[]
}

interface actionCurrencies {
    type: ActionType.SET_CURRENCIES
    payload: CurrencyType[]
}

interface actionClear {
    type: ActionType.CLEAR
    payload: keyof StateType
}

export const DataListReducer: (state: StateType | undefined, action: actionProducts | actionBaners | actionCategory | actionBrands | actionGroups | actionCurrencies | actionClear) => StateType = (state = intialState, action) => {
    switch (action.type) {
        case ActionType.SET_BRANDS:
            return {
                ...state,
                brands: [...state.brands, ...action.payload]
            }
        case ActionType.SET_PRODUCTS:
            return {
                ...state,
                products: [...state.products, ...action.payload]
            }
        case ActionType.SET_CATEGORIES:
            return {
                ...state,
                categories: [...state.categories, ...action.payload]
            }
        case ActionType.SET_GROUPS:
            return {
                ...state,
                groups: [...state.groups, ...action.payload]
            }
        case ActionType.SET_CURRENCIES:
            return {
                ...state,
                currencies: [...state.currencies, ...action.payload]
            }
        case ActionType.SET_BANERS:
            return {
                ...state,
                baners: [...state.baners, ...action.payload]
            }
        case ActionType.CLEAR:
            return {
                ...state,
                [action.payload]: []
            }
        default:
            return state
    }
}

export const ADD_PRODUCTS = (payload: ProductType[]) => ({ type: ActionType.SET_PRODUCTS, payload })
export const ADD_CATEGORIES = (payload: CategoryType[]) => ({ type: ActionType.SET_CATEGORIES, payload })
export const ADD_BRANDS = (payload: BrandType[]) => ({ type: ActionType.SET_BRANDS, payload })
export const ADD_GROUPS = (payload: GroupType[]) => ({ type: ActionType.SET_GROUPS, payload })
export const ADD_CURRENCIES = (payload: CurrencyType[]) => ({ type: ActionType.SET_CURRENCIES, payload })
export const ADD_BANERS = (payload: BanerType[]) => ({ type: ActionType.SET_BANERS, payload })
export const CLEAR_LIST = (payload: keyof StateType) => ({ type: ActionType.CLEAR, payload })