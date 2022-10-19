const SET_LOCALE = "SET_LOCALE"

const defaultState = {
    locale: localStorage.i18nextLng,
}

export default function localeReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_LOCALE:
            return {
                ...state,
                locale: action.payload,
            }
        default:
            return state
    }
}

export const setLocale = locale => ({type:SET_LOCALE, payload:locale})