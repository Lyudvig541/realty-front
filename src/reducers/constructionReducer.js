const GET_CONSTRUCTION = "GET_CONSTRUCTION";
const GET_CONSTRUCTIONS = "GET_CONSTRUCTIONS";
const GET_CONSTRUCTIONS_ON_SCROLL = "GET_CONSTRUCTIONS_ON_SCROLL";
const SEARCH_CONSTRUCTOR_PARAMS =  "SEARCH_CONSTRUCTOR_PARAMS";
const GET_CURRENT_PAGE =  "GET_CURRENT_PAGE";
const GET_ALL_CONSTRUCTIONS =  "GET_ALL_CONSTRUCTIONS";

const defaultState = {
    construction: {},
    constructions: [],
    allConstructions: [],
    searchParams : {
        minPrice: '',
        maxPrice: '',
        deadline: '',
        region: '',
        currency: '',
        constAgency:'',
    },
    currentPage:2,
}

export default function constructionReducer(state = defaultState, action) {

    switch (action.type) {
        case GET_CONSTRUCTION:
            return {
                ...state,
                construction: action.payload,
            }
        case GET_CONSTRUCTIONS:
            return {
                ...state,
                constructions: action.payload,
            }
        case GET_ALL_CONSTRUCTIONS:
            return {
                ...state,
                allConstructions: action.payload,
            }
        case GET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.payload,
            }
        case GET_CONSTRUCTIONS_ON_SCROLL:
            return {
                ...state,
                constructions: state.constructions.concat(action.payload.data),
            }
        case SEARCH_CONSTRUCTOR_PARAMS:{
            return {
                ...state,
                searchParams:action.payload
            }
        }
        default:
            return state
    }

}

export const getConstruction = construction => ({type: GET_CONSTRUCTION, payload: construction})
export const getConstructionCurrentPage = currentPage => ({type: GET_CURRENT_PAGE, payload: currentPage})
export const getConstructions = constructions => ({type: GET_CONSTRUCTIONS, payload: constructions})
export const getAllConstructions = constructions => ({type: GET_ALL_CONSTRUCTIONS, payload: constructions})
export const getConstructionsOnScroll = constructions => ({type: GET_CONSTRUCTIONS_ON_SCROLL, payload: constructions})
export const setConstructorParams = states => ({type: SEARCH_CONSTRUCTOR_PARAMS, payload: states});

