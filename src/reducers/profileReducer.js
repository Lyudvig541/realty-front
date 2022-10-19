const SET_ERRORS = "SET_ERRORS";
const SET_LISTING_SPINNER = "SET_LISTING_SPINNER";
const SET_RENT_LISTING_SPINNER = "SET_RENT_LISTING_SPINNER";
const SET_FAVORITE_LISTING_SPINNER = "SET_FAVORITE_LISTING_SPINNER";
const SET_MESSAGE_SPINNER = "SET_MESSAGE_SPINNER";
const SET_UNVERIFIED_SPINNER = "SET_UNVERIFIED_SPINNER";
const SET_ARCHIVED_SPINNER = "SET_ARCHIVED_SPINNER";

const defaultState = {
    errors:[],
    listingSpinner:true,
    rentListingSpinner:true,
    favoriteListingSpinner:true,
    messageSpinner:true,
    unverifiedSpinner:true,
    archivedSpinner:true,
}

export default function authReducer(state = defaultState, action){
    switch (action.type){
        case SET_ERRORS:
            return {
                ...state,
                errors: action.payload,
            }
        case SET_LISTING_SPINNER:
            return {
                ...state,
                listingSpinner: action.payload,
            }
        case SET_RENT_LISTING_SPINNER:
            return {
                ...state,
                rentListingSpinner: action.payload,
            }
        case SET_FAVORITE_LISTING_SPINNER:
            return {
                ...state,
                favoriteListingSpinner: action.payload,
            }
        case SET_MESSAGE_SPINNER:
            return {
                ...state,
                messageSpinner: action.payload,
            }
        case SET_UNVERIFIED_SPINNER:
            return {
                ...state,
                unverifiedSpinner: action.payload,
            }
        case SET_ARCHIVED_SPINNER:
            return {
                ...state,
                archivedSpinner: action.payload,
            }
        default:
            return state
    }
}

export const setErrors = errors => ({type:SET_ERRORS, payload:errors})
export const setListingSpinner = spinner => ({type:SET_LISTING_SPINNER, payload:spinner})
export const setRentListingSpinner = spinner => ({type:SET_RENT_LISTING_SPINNER, payload:spinner})
export const setFavoriteListingSpinner = spinner => ({type:SET_FAVORITE_LISTING_SPINNER, payload:spinner})
export const setMessageSpinner = spinner => ({type:SET_MESSAGE_SPINNER, payload:spinner})
export const setUnverifiedSpinner = spinner => ({type:SET_UNVERIFIED_SPINNER, payload:spinner})
export const setArchivedSpinner = spinner => ({type:SET_ARCHIVED_SPINNER, payload:spinner})
