const SET_USER_DATA = "SET_USER_DATA";
const SET_SUPER_BROKERS_NAMES_DATA = "SET_SUPER_BROKERS_NAMES_DATA";

const defaultState = {
    user_data: [],
    superBrokersNames: [],
}

export default function userDataReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                user_data: action.payload,
            }
        case SET_SUPER_BROKERS_NAMES_DATA:
            return {
                ...state,
                superBrokersNames: action.payload,
            }
        default:
            return state
    }
}
export const setUserData = user_data => ({type: SET_USER_DATA, payload: user_data})
export const setSuperBrokersNames = user_data => ({type: SET_SUPER_BROKERS_NAMES_DATA, payload: user_data})

