const SET_MODAL = "SET_MODAL"
const SET_BROKER_MODAL = "SET_BROKER_MODAL"
const SET_ANNOUNCEMENT_MODAL = "SET_ANNOUNCEMENT_MODAL"
const SET_CHECK_AGENT_MODAL = "SET_CHECK_AGENT_MODAL"
const SET_ANNOUNCEMENT_CONDITIONS_MODAL = "SET_ANNOUNCEMENT__CONDITIONS_MODAL"
const SET_TEXT_MODAL = "SET_TEXT_MODAL"
const SET_SPINNER = "SET_SPINNER"
const GET_USER_COMMENTS = "GET_USER_COMMENTS"
const SET_LIMIT_TEXT_MODAL = "SET_LIMIT_TEXT_MODAL"

const defaultState = {
    modal:"",
    listingConditionModal:'',
    id:'',
    text:'',
    limitText: {},
    brokerModal: '',
    userComments: [],
    spinner:true,
}

export default function modalsReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_MODAL:
            return {
                ...state,
                modal: action.payload,
            }
        case GET_USER_COMMENTS:
            return {
                ...state,
                userComments: action.payload,
            }
        case SET_BROKER_MODAL:
            return {
                ...state,
                brokerModal: action.payload,
            }
        case SET_ANNOUNCEMENT_MODAL:
            return {
                ...state,
                modal: action.payload,
                id:action.id
            }
        case SET_CHECK_AGENT_MODAL:
            return {
                ...state,
                modal: action.payload,
                id:action.id
            }
        case SET_SPINNER:
            return {
                ...state,
                spinner: action.payload,
            }
        case SET_ANNOUNCEMENT_CONDITIONS_MODAL:
            return {
                ...state,
                listingConditionModal: action.payload,
            }
        case SET_TEXT_MODAL:
           return {
               ...state,
               text: action.payload,
           }
        case SET_LIMIT_TEXT_MODAL:
            return {
                ...state,
                limitText: action.payload,
            }
        default:
            return state
    }
}

export const setModal = modal => ({type:SET_MODAL, payload:modal})
export const setUserComments = comments => ({type:GET_USER_COMMENTS, payload:comments})
export const setBrokerModal = modal => ({type:SET_BROKER_MODAL, payload:modal})
export const setTextModal = text => ({type:SET_TEXT_MODAL, payload:text})
export const setLimitTextModal = text => ({type:SET_LIMIT_TEXT_MODAL, payload:text})
export const setSpinner = spinner => ({type:SET_SPINNER, payload:spinner})
export const setAnnouncementModal = (modal,id) => ({type:SET_ANNOUNCEMENT_MODAL, payload:modal,id:id})
export const setCheckAgentModal = (modal,id) => ({type:SET_CHECK_AGENT_MODAL, payload:modal,id:id})
export const setAnnouncementConditionsModal = (modal) => ({type:SET_ANNOUNCEMENT_CONDITIONS_MODAL, payload:modal})