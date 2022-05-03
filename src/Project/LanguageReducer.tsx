import { DICTIONARY_TYPE, TM } from "../Language/TM"
import { EN } from "../Language/EN"
import { RU } from "../Language/RU"


const languages = {
    TM,
    EN,
    RU
}

type languagesType = typeof languages

export type LanguageType = keyof languagesType
export type MULTILANGUAGE_VALUE = { [x in LanguageType]?: string }

type StateType = {
    lng: LanguageType
    dictionary: DICTIONARY_TYPE
}

const defaultLanguage: LanguageType = 'TM'

const initialState: StateType = {
    lng: defaultLanguage,
    dictionary: languages[defaultLanguage]
}
type actionType = { type: 'action/language/setLanguage', lng: LanguageType }

export const LanguageReducer: (state: StateType | undefined, action: actionType) => StateType = (state = initialState, action) => {
    return action.type === 'action/language/setLanguage' ? { lng: action.lng, dictionary: languages[action.lng] } : state
}

export const SET_LANGUAGE: (lng: LanguageType) => actionType = (lng) => ({ type: 'action/language/setLanguage', lng })


export const LanguageTitles: { keys: LanguageType[], titles: { [x in LanguageType]: string } } = {
    keys: ['TM', 'EN', 'RU'],
    titles: {
        TM: 'Türkme dili',
        EN: 'English',
        RU: 'Русский язык'
    }
}