import { MULTILANGUAGE_VALUE } from "./Project/LanguageReducer"

export const TEMPLATES = ['SIMPLE', 'GRID_4_PRODUCT'] as const
export type TemplatesType = typeof TEMPLATES[number]

export type ObjectTypes = 'product' | 'category' | 'brand' | 'group' | 'productdata'

export type CurrencyType = {
    id: string
    kurs: number
}

export type CategoryType = {
    id: number | null
    icon: string
    name: string
    name_lng?: MULTILANGUAGE_VALUE
    parent: number
    tertip: number
}

export type BrandType = {
    id: number | null
    icon: string
    name: string
    name_lng?: MULTILANGUAGE_VALUE
    parent: number
    tertip: number
}

export type GroupType = {
    id: number | null
    name: string
    name_lng?: MULTILANGUAGE_VALUE
    tertip: number
    template: TemplatesType
    products: number[]
}

export type ProductType = {
    id: number | null
    icon: string
    uid: string | null
    name: string
    name_lng?: MULTILANGUAGE_VALUE
    description?: string
    description_lng?: MULTILANGUAGE_VALUE
    category: number | null
    brand: number | null
    topar: string[]
    key_words: string[]
    tertip: number
    data?: ProductDataType
}

export type BanerType = {
    gallery: { src: string, category?: { id: number | null }, brand?: { id: number | null }, product?: { id: number | null }, group?: { id: number | null } }[]
    id: number | null
    tertip: number
    name: string
}

export type ProductDataType = {
    id: string
    name: string
    code: string
    measure: string
    price_base_for_sale: number
    currency: string
    isactive: string
    kurs: number
}

export enum EditDialogTypes {
    category = 'category',
    product = 'product',
    brand = 'brand',
    group = 'group',
    currency = 'currency',
    baner = 'baner',
}

export type StateLoadingType = {
    loading: boolean
    fail: boolean
}



export const emptyCategory: CategoryType = {
    id: null,
    name: '',
    icon: '',
    parent: 0,
    tertip: 0
}

export const emptyBrand: BrandType = {
    id: null,
    name: '',
    icon: '',
    parent: 0,
    tertip: 0
}

export const emptyProduct: ProductType = {
    id: null,
    uid: '',
    icon: '',
    name: '',
    topar: [],
    key_words: [],
    brand: null,
    category: null,
    tertip: 0
}

export const emptyGroup: GroupType = {
    id: null,
    name: '',
    products: [],
    template: 'SIMPLE',
    tertip: 0
}

export const emptyCurrency: CurrencyType = {
    id: '',
    kurs: 1
}

export const emptyBaner: BanerType = {
    id: null,
    gallery: [],
    tertip: 0,
    name: ''
}