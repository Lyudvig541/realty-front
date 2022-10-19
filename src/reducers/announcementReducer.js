const GET_ANNOUNCEMENT = "GET_ANNOUNCEMENT";
const GET_ANNOUNCEMENTS = "GET_ANNOUNCEMENTS";
const GET_MY_ANNOUNCEMENTS = "GET_MY_ANNOUNCEMENTS";
const GET_MY_RENT_ANNOUNCEMENTS = "GET_MY_RENT_ANNOUNCEMENTS";
const GET_ADDITIONAL_INFORMATION = "GET_ADDITIONAL_INFORMATION";
const GET_FACILITIES_INFORMATION = "GET_FACILITIES_INFORMATION";
const GET_ADDITIONAL = "GET_ADDITIONAL";
const GET_FACILITIES = "GET_FACILITIES";
const GET_ONE_ANNOUNCEMENT = "GET_ONE_ANNOUNCEMENT";
const GET_ONE_FAVORITE = "GET_ONE_FAVORITE";
const GET_FAVORITES = "GET_FAVORITES";
const GET_ALL_FAVORITES = "GET_ALL_FAVORITES";
const GET_SEARCH_ANNOUNCEMENTS = "GET_SEARCH_ANNOUNCEMENTS";
const SET_ERRORS = "SET_ERRORS";
const SET_ACTIVE = "SET_ACTIVE";
const GET_STATES =  "GET_STATES";
const GET_CITIES =  "GET_CITIES";
const GET_CURRENCIES =  "GET_CURRENCIES";
const SEARCH_PARAMS =  "SEARCH_PARAMS";
const CURRENT_PAGE =  "CURRENT_PAGE";
const SET_SELECTED_PLACES =  "SET_SELECTED_PLACES";
const SET_POLYGON =  "SET_POLYGON";
const GET_SIMILAR_ANNOUNCEMENTS =  "GET_SIMILAR_ANNOUNCEMENTS";
const SET_LOAD_LISTING =  "SET_LOAD_LISTING";
const ADD_LISTING_FINISHED =  "ADD_LISTING_FINISHED";
const TOTAL_COUNT =  "TOTAL_COUNT";
const GET_ALL_ANNOUNCEMENTS =  "GET_ALL_ANNOUNCEMENTS";
const GET_UNVERIFIED_ANNOUNCEMENTS =  "GET_UNVERIFIED_ANNOUNCEMENTS";
const GET_ARCHIVED_ANNOUNCEMENTS =  "GET_ARCHIVED_ANNOUNCEMENTS";
const LISTING_VALIDATE =  "LISTING_VALIDATE";
const PROPERTY_SPINNER =  "PROPERTY_SPINNER";
const GET_OFFERS_AND_CLOSINGS =  "GET_OFFERS_AND_CLOSINGS";

const defaultState = {
    announcement: [],
    allAnnouncements: [],
    total_count: 0,
    places: [],
    polygon: [],
    announcements: [],
    similarAnnouncements: [],
    myAnnouncements: [],
    myRentAnnouncements:[],
    unverifiedAnnouncements:[],
    archivedAnnouncements:[],
    offersAndClosings:[],
    oneAnnouncement: {translations: []},
    additionalInformation: [],
    facilitiesInformation: [],
    favorite: {},
    favorites: [],
    allFavorites: [],
    searchAnnouncements:[],
    errors:[],
    error:'',
    states:[],
    cities:[],
    currencies:[],
    facilities: {},
    additional: {},
    currentPage:1,
    active:true,
    loadListing:false,
    addListingFinished:false,
    loadValidateListing:false,
    propertySpinner:false,
    searchParams : {
        category: '',
        type: '',
        minPrice: '',
        currency: '',
        maxPrice: '',
        minSize: '',
        maxArea: '',
        land_type: '',
        land_geometric_appearance: '',
        front_position: '',
        purpose: '',
        furniture: '',
        minArea: '',
        maxSize: '',
        rooms: '',
        floor: '',
        storeys: '',
        building_type: '',
        condition: '',
        ceiling_height: '',
        bathroom: '',
        center: [44.515209, 40.1872023],
    }
}

export default function announcementReducer(state = defaultState, action) {
    switch (action.type) {
        case GET_ANNOUNCEMENT:
            return {
                ...state,
                announcement: action.payload.announcement,
            }
        case GET_ALL_ANNOUNCEMENTS:
            return {
                ...state,
                allAnnouncements: action.payload,
            }
            case GET_ANNOUNCEMENTS:
            return {
                ...state,
                announcements: state.announcements.concat(action.payload.data),
            }
            case SET_LOAD_LISTING:
            return {
                ...state,
                loadListing: action.payload,
            }
            case PROPERTY_SPINNER:
            return {
                ...state,
                propertySpinner: action.payload,
            }
            case TOTAL_COUNT:
            return {
                ...state,
                total_count: action.payload,
            }
            case ADD_LISTING_FINISHED:
            return {
                ...state,
                addListingFinished: action.payload,
            }
            case GET_OFFERS_AND_CLOSINGS:
            return {
                ...state,
                offersAndClosings: action.payload,
            }
            case LISTING_VALIDATE:
            return {
                ...state,
                loadValidateListing: action.payload,
            }
            case GET_UNVERIFIED_ANNOUNCEMENTS:
            return {
                ...state,
                unverifiedAnnouncements: action.payload,
            }
            case GET_ARCHIVED_ANNOUNCEMENTS:
            return {
                ...state,
                archivedAnnouncements: action.payload,
            }
            case GET_SIMILAR_ANNOUNCEMENTS:
            return {
                ...state,
                similarAnnouncements: action.payload.data,
            }
            case SET_SELECTED_PLACES:
            return {
                ...state,
                places: action.payload,
            }
            case SET_ACTIVE:
            return {
                ...state,
                active: action.payload,
            }
            case SET_POLYGON:
            return {
                ...state,
                polygon: action.payload,
            }
        case GET_ONE_ANNOUNCEMENT:
            return {
                ...state,
                oneAnnouncement: action.payload,
            }
        case GET_ALL_FAVORITES:
            return {
                ...state,
                allFavorites: action.payload,
            }
        case GET_MY_ANNOUNCEMENTS:
            return {
                ...state,
                myAnnouncements: action.payload,
            }
        case GET_MY_RENT_ANNOUNCEMENTS:
            return {
                ...state,
                myRentAnnouncements: action.payload,
            }
        case GET_ADDITIONAL_INFORMATION:
            return {
                ...state,
                additionalInformation: action.payload
            }
        case GET_FACILITIES_INFORMATION:
            return {
                ...state,
                facilitiesInformation: action.payload
            }
        case GET_ADDITIONAL:
            return {
                ...state,
                additional: action.payload
            }
        case GET_FACILITIES:
            return {
                ...state,
                facilities: action.payload
            }
        case GET_ONE_FAVORITE:
            return {
                ...state,
                favorite: action.payload
            }
        case GET_FAVORITES:
            return {
                ...state,
                favorites: action.payload
            }
        case GET_SEARCH_ANNOUNCEMENTS:{
            return {
                ...state,
                announcements:action.payload.data
            }
        }
        case SET_ERRORS:{
            return {
                ...state,
                errors:action.payload
            }
        }
        case GET_STATES:{
            return {
                ...state,
                states:action.payload
            }
        }
        case SEARCH_PARAMS:{
            return {
                ...state,
                searchParams:action.payload
            }
        }
        case GET_CITIES:{
            return {
                ...state,
                cities:action.payload
            }
        }
        case GET_CURRENCIES:{
            return {
                ...state,
                currencies:action.payload
            }
        }
        case CURRENT_PAGE:{
            return {
                ...state,
                currentPage:action.payload
            }
        }
        default:
            return state
    }
}

export const getAnnouncement = announcement => ({type: GET_ANNOUNCEMENT, payload: announcement})
export const getStates = states => ({type: GET_STATES, payload: states});
export const setPropertySpinner = states => ({type: PROPERTY_SPINNER, payload: states});
export const setSearchParams = states => ({type: SEARCH_PARAMS, payload: states});
export const setCurrentPage = states => ({type: CURRENT_PAGE, payload: states});
export const getCities = cities => ({type: GET_CITIES, payload: cities});
export const getCurrencies = currencies => ({type: GET_CURRENCIES, payload: currencies});
export const getAnnouncements = announcement => ({type: GET_ANNOUNCEMENTS, payload: announcement})
export const getMyAnnouncements = announcements => ({type: GET_MY_ANNOUNCEMENTS, payload: announcements})
export const getMyRentingAnnouncements = announcements => ({type: GET_MY_RENT_ANNOUNCEMENTS, payload: announcements})
export const getUnverifiedAnnouncements = announcements => ({type: GET_UNVERIFIED_ANNOUNCEMENTS, payload: announcements})
export const getArchivedAnnouncements = announcements => ({type: GET_ARCHIVED_ANNOUNCEMENTS, payload: announcements})
export const getOffersAndClosings = announcements => ({type: GET_OFFERS_AND_CLOSINGS, payload: announcements})
export const getOneAnnouncement = announcement => ({type: GET_ONE_ANNOUNCEMENT, payload: announcement})
export const getAdditionalInformation = additionalInformation => ({type: GET_ADDITIONAL_INFORMATION,payload: additionalInformation})
export const getFacilitiesInformation = facilitiesInformation => ({type: GET_FACILITIES_INFORMATION,payload: facilitiesInformation})
export const getAdditional = additional => ({type: GET_ADDITIONAL,payload: additional})
export const getFacilities = facilities => ({type: GET_FACILITIES,payload: facilities})
export const getAllFavorites = facilities => ({type: GET_ALL_FAVORITES,payload: facilities})
export const getFavorite = favorite => ({type: GET_ONE_FAVORITE, payload: favorite})
export const getFavorites = favorites => ({type: GET_FAVORITES, payload: favorites})
export const getSearchAnnouncements = search => ({type: GET_SEARCH_ANNOUNCEMENTS, payload: search})
export const getSimilarAnnouncements = search => ({type: GET_SIMILAR_ANNOUNCEMENTS, payload: search})
export const setAnnouncementErrors = error => ({type: SET_ERRORS, payload: error})
export const setActiveTab = active => ({type: SET_ACTIVE, payload: active})
export const setSelectPlaces = places => ({type: SET_SELECTED_PLACES, payload: places})
export const setLoadListing = loadListing => ({type: SET_LOAD_LISTING, payload: loadListing})
export const setAddListingFinished = addListingFinished => ({type: ADD_LISTING_FINISHED, payload: addListingFinished})
export const setListingValidate = listingValidate => ({type: LISTING_VALIDATE, payload: listingValidate})
export const getTotalCount = count => ({type: TOTAL_COUNT, payload: count})
export const getAllAnnouncements = announcements => ({type: GET_ALL_ANNOUNCEMENTS, payload: announcements})
