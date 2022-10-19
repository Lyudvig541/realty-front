const GET_STATES = "GET_STATES";
const GET_CITIES = "GET_CITIES";

const defaultState = {
    states: [],
    cities: [],
}

export default function regionReducer(state = defaultState, action){
    switch (action.type){
        case GET_STATES:
            return {
                ...state,
                states: action.payload,
            }
            case GET_CITIES:
            return {
                ...state,
                cities: action.payload,
            }
        default:
            return state;
    }
}

export const getStates = states => ({type:GET_STATES, payload:states})
export const getCities = cities => ({type:GET_CITIES, payload:cities})
