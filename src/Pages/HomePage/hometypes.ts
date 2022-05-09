import { MULTILANGUAGE_VALUE } from "../../Project/LanguageReducer"

export enum HomeDataTypeKeys {
    baner = 'baner',
    group = 'group'
}


export const BANER_TEMPLATES = ['SLIDER', 'GRID_LIST', 'CUSTOM_WITH_BIG_IMAGE'] as const
export type BANER_TEMPLATES_TYPE = typeof BANER_TEMPLATES[number]

export type HomeBanerImageType = {
    name: string
    name_lng?: MULTILANGUAGE_VALUE
    src: string
    category?: { id: number | null }
    brand?: { id: number | null }
    product?: { id: number | null }
    group?: { groups: string[] }
}

export type HomadataBaner = {
    type: HomeDataTypeKeys.baner
    data: HomeBanerImageType[]
    template: BANER_TEMPLATES_TYPE
}

//*********************************************** */

export const GROUP_TEMPLATES = ['SIMPLE', 'HORIZONTAL_SCROLL'] as const
export type GROUP_TEMPLATES_TYPE = typeof GROUP_TEMPLATES[number]

export type HomeGroupType = {
    name: string
    name_lng?: MULTILANGUAGE_VALUE
    products?: number[]
    category?: number | null
    brand?: number | null
    groups?: string[]
    discount?: number | null
}

export type HomadataGroup = {
    type: HomeDataTypeKeys.group
    data: HomeGroupType
    template: GROUP_TEMPLATES_TYPE
}

type HomeMultiDataType = HomadataBaner | HomadataGroup

export type HomeDataType = {
    id: number | null
    tertip: number
    name: string
} & HomeMultiDataType


export const emptyHomeData: HomeDataType = {
    id: null,
    name: '',
    tertip: 0,
    type: HomeDataTypeKeys.baner,
    template: 'SLIDER',
    data: []
}

export const emptyHomeGroup: HomeGroupType = {
    name: '',
    products: []
}

export const emptyHomeImageBaner: HomeBanerImageType = {
    name: '',
    src: ''
}



