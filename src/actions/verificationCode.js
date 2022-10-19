import axios from "axios";
import {setVerify, verificationCode, setVerificationErrors} from "../reducers/verificationReducer";
import {auth} from "./auth";
import {setErrors} from "../reducers/authReducer";


const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const verification_code = (id, phone) => {
    return async dispatch => {
            await axios.post(PUBLIC_API_URL+`api/phone-number-verification-code`, {
                id,
                phone,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            }).then((response)=> {
                if (response.data.status === 400) {
                    dispatch(setErrors(response.data.errors))
                    dispatch(setVerificationErrors(response.data.errors))
                }else{
                    dispatch(verificationCode(response.data))
                }
            })
    }
}

export const verify = (id, code, phone) => {
    return async dispatch => {
        await axios.post(PUBLIC_API_URL+`api/check-verification-code`, {
            id,
            code,
            phone,
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`,
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=>{
            if (response.data.status === 400) {
                dispatch(setErrors(response.data.errors))
                dispatch(setVerificationErrors(response.data.errors))
            }else{
                dispatch(setVerify(response.data))
                dispatch(auth());
            }
        }).catch ((e)=>{
            console.log(e,'111')});
    }
}