import React from 'react'
import { useSelector } from 'react-redux'
import _ from 'underscore'
import { SET_GLOBAL } from '../Project/store'

export const Languages = ['tm', 'ru', 'en']
export const Default_Language = 'tm'
export const emptyMultiLanguage = Languages.reduce((res, ln) => ({ ...res, [ln]: '' }), {})

export const SetLanguage = dispatch => (lng) => {
    dispatch(SET_GLOBAL(global => ({
        ...global,
        lng
    })))
}

export const TranslateText = (words, text, lngReceive) => words[text]?.[lngReceive] || text


export const Translate = (props) => {
    const words = useSelector(state => state.global.words || {}, _.isEqual)
    const lng = useSelector(state => state.global.lng || Default_Language, _.isEqual)

    try {
        return <>{words[props.children]?.[props.lng || lng] || props.children}</>
    } catch (e) {
        return <>{props.children}</>
    }
}

export const TranslateOwnWords = (props) => {
    const lng = useSelector(state => state.global.lng || Default_Language, _.isEqual)

    try {
        return <>{props.text[props.lng || lng]}</>
    } catch (e) {
        return <>{props?.text?.tm || '...'}</>
    }
}
