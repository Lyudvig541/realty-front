const GET_TYPE = "GET_TYPE";

const defaultState = {
    types:[],
}

export default function typeReducer(state = defaultState, action){
    switch (action.type){
        case GET_TYPE:
            return {
                ...state,
                types: action.payload,
            }
        default:
            return state;
    }
}

export const getTypes = types => ({type:GET_TYPE, payload:types})
