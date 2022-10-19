const GET_CATEGORY = "GET_CATEGORY";

const defaultState = {
    categories:[],
}

export default function typeReducer(state = defaultState, action){
    switch (action.type){
        case GET_CATEGORY:
            return {
                ...state,
                categories: action.payload,
            }
        default:
            return state
    }
}

export const getCategories = categories => ({type:GET_CATEGORY, payload:categories})
