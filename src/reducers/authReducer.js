const SET_USER = "SET_USER";
const LOGOUT = "LOGOUT";
const ERRORS = "ERRORS";
const GET_MESSAGES = "GET_MESSAGES";
const GET_USER_BROKER_MESSAGES = "GET_USER_BROKER_MESSAGES";
const UNREAD_MESSAGES = "UNREAD_MESSAGES";
const REQUEST = "REQUEST";
const GET_USER_BROKER_MORE_MESSAGES = "GET_USER_BROKER_MORE_MESSAGES";
const SET_CURRENT_MESSAGE_PAGE = "SET_CURRENT_MESSAGE_PAGE";
const LOGIN_ERRORS = "LOGIN_ERRORS";
const REGISTER_ERRORS = "REGISTER_ERRORS";
const BROKER_REGISTER_ERRORS = "BROKER_REGISTER_ERRORS";

const defaultState = {
    currentUser:{},
    isAuth:false,
    request_status:false,
    errors:[],
    loginErrors:[],
    registerErrors:[],
    brokerRegisterErrors:[],
    messages:[],
    userBrokerMessages:[],
    unreadMessages:[],
    currentMessagePage:2,
}

export default function authReducer(state = defaultState, action){
    switch (action.type){
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isAuth: true
            }
        case UNREAD_MESSAGES:
            return {
                ...state,
                unreadMessages: action.payload,
            }
        case REQUEST:
            return {
                ...state,
                request_status: action.payload,
            }
        case GET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
            }
        case GET_USER_BROKER_MESSAGES:
            return {
                ...state,
                userBrokerMessages: action.payload,
            }
        case GET_USER_BROKER_MORE_MESSAGES:
            return {
                ...state,
                userBrokerMessages: state.userBrokerMessages.concat(action.payload.data),
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                currentUser: {},
                errors:[],
                isAuth: false
            }
        case ERRORS:
            return {
                ...state,
                errors: action.payload,
            }
        case LOGIN_ERRORS:
            return {
                ...state,
                loginErrors: action.payload,
            }
        case REGISTER_ERRORS:
            return {
                ...state,
                registerErrors: action.payload,
            }
        case BROKER_REGISTER_ERRORS:
            return {
                ...state,
                brokerRegisterErrors: action.payload,
            }
        case SET_CURRENT_MESSAGE_PAGE:
            return {
                ...state,
                currentMessagePage: action.payload,
            }
        default:
            return state
    }
}
export const setUser = user => ({type:SET_USER, payload:user})
export const logout = () => ({type: LOGOUT})
export const request = request_status => ({type: REQUEST, payload:request_status})
export const setErrors = errors => ({type:ERRORS, payload:errors})
export const setLoginErrors = errors => ({type:LOGIN_ERRORS, payload:errors})
export const setRegisterErrors = errors => ({type:REGISTER_ERRORS, payload:errors})
export const setBrokerErrors = errors => ({type:BROKER_REGISTER_ERRORS, payload:errors})
export const getMessage = messages => ({type:GET_MESSAGES, payload:messages})
export const setUserBrokerMessages = messages => ({type:GET_USER_BROKER_MESSAGES, payload:messages})
export const setUserBrokerMoreMessages = messages => ({type:GET_USER_BROKER_MORE_MESSAGES, payload:messages})
export const setCurrentMessagePage = page => ({type:SET_CURRENT_MESSAGE_PAGE, payload:page})
export const unreadMessages = unreadMessages => ({type:UNREAD_MESSAGES, payload:unreadMessages})