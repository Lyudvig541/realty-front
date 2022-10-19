const GET_PARTNERS = "GET_PARTNERS";
const GET_AGENCIES = "GET_AGENCIES";
const GET_AGENCY = "GET_AGENCY";
const GET_CONST_AGENCY = "GET_CONST_AGENCY";
const GET_CONST_AGENCIES = "GET_CONST_AGENCIES";
const GET_TOP_AGENCIES = "GET_TOP_AGENCIES";
const GET_COMPANY = "GET_COMPANY";
const GET_TEXT_PAGE = "GET_TEXT_PAGE";
const GET_TEXT_PAGES = "GET_TEXT_PAGES";
const GET_BANK_REQUEST = "GET_BANK_REQUEST";
const GET_TOP_COMPANIES = "GET_TOP_COMPANIES";
const GET_ALL_COMPANIES = "GET_ALL_COMPANIES";
const GET_ANNOUNCEMENTS = "GET_ANNOUNCEMENTS";
const GET_FAVORITE_ANNOUNCEMENTS = "GET_FAVORITE_ANNOUNCEMENTS";
const GET_AGENCY_ANNOUNCEMENTS = "GET_AGENCY_ANNOUNCEMENTS";

const defaultState = {
    partners: [],
    agencies: [],
    agency: [],
    const_agency: [],
    const_agencies: [],
    company: [],
    text_page: {},
    text_pages: [],
    top_agencies: [],
    bank_request: [],
    top_companies: [],
    all_companies: [],
    announcements: [],
    favoriteAnnouncement: []
}

export default function resourcesReducer(state = defaultState, action) {
    switch (action.type) {
        case GET_PARTNERS:
            return {
                ...state,
                partners: action.payload,
            }
        case GET_AGENCIES:
            return {
                ...state,
                agencies: action.payload,
            }
        case GET_AGENCY:
            return {
                ...state,
                agency: action.payload,
            }
        case GET_CONST_AGENCY:
            return {
                ...state,
                const_agency: action.payload,
            }
        case GET_CONST_AGENCIES:
            return {
                ...state,
                const_agencies: action.payload,
            }
        case GET_COMPANY:
            return {
                ...state,
                company: action.payload,
            }
        case GET_BANK_REQUEST:
            return {
                ...state,
                bank_request: action.payload,
            }
        case GET_TOP_COMPANIES:
            return {
                ...state,
                top_companies: action.payload,
            }
        case GET_TOP_AGENCIES:
            return {
                ...state,
                top_agencies: action.payload,
            }
        case GET_ALL_COMPANIES:
            return {
                ...state,
                all_companies: action.payload,
            }
        case GET_ANNOUNCEMENTS:
            return {
                ...state,
                announcements: action.payload,
            }
        case GET_FAVORITE_ANNOUNCEMENTS:
            return {
                ...state,
                favoriteAnnouncement: action.payload,
            }
        case GET_TEXT_PAGE:
            return {
                ...state,
                text_page: action.payload,
            }
        case GET_TEXT_PAGES:
            return {
                ...state,
                text_pages: action.payload,
            }
        case GET_AGENCY_ANNOUNCEMENTS:
            return {
                ...state,
                announcements: state.announcements.concat(action.payload),
            }
        default:
            return state
    }
}

export const getPartners = partners => ({type: GET_PARTNERS, payload: partners})
export const getAgencies = agencies => ({type: GET_AGENCIES, payload: agencies})
export const getAgency = agency => ({type: GET_AGENCY, payload: agency})
export const getConstAgency = const_agency => ({type: GET_CONST_AGENCY, payload: const_agency})
export const getConstAgencies = const_agencies => ({type: GET_CONST_AGENCIES, payload: const_agencies})
export const getTopAgencies = top_agencies => ({type: GET_TOP_AGENCIES, payload: top_agencies})
export const getCompany = company => ({type: GET_COMPANY, payload: company})
export const getBankRequest = bank_request => ({type: GET_BANK_REQUEST, payload: bank_request})
export const getTopCompanies = top_companies => ({type: GET_TOP_COMPANIES, payload: top_companies})
export const getAllCompanies = all_companies => ({type: GET_ALL_COMPANIES, payload: all_companies})
export const getAnnouncements = announcements => ({type: GET_ANNOUNCEMENTS, payload: announcements})
export const getAgencyAnnouncements = announcements => ({type: GET_AGENCY_ANNOUNCEMENTS, payload: announcements})
export const getTextPage = text_page => ({type: GET_TEXT_PAGE, payload: text_page})
export const getTextPages = text_pages => ({type: GET_TEXT_PAGES, payload: text_pages})
export const getFavoriteAnnouncements = favoriteAnnouncement => ({
    type: GET_FAVORITE_ANNOUNCEMENTS,
    payload: favoriteAnnouncement
})
