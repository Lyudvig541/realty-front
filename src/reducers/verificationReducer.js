const SET_CODE_SUCCESS = "SET_CODE_SUCCESS";
const SET_VERIFY = "SET_VERIFY";
const ERRORS = "ERRORS"

const defaultState = {
    code_success:'',
    verify:'',
    errors:[],
}

export default function verificationReducer(state = defaultState, action){
    switch (action.type){
        case SET_CODE_SUCCESS:
            return {
                ...state,
                code_success: action.payload,
            }
            case SET_VERIFY:
                return {
                    ...state,
                    verify: action.payload,
                }
            case ERRORS:
                return {
                    ...state,
                    errors: action.payload,
                }
        default:
            return state;
    }
}

export const verificationCode = code_success => ({type:SET_CODE_SUCCESS, payload:code_success})
export const setVerify = verify => ({type:SET_VERIFY, payload:verify})
export const setVerificationErrors = errors => ({type:ERRORS, payload:errors})

