import axios from "axios";
import {setLimitTextModal, setSpinner, setTextModal} from "../reducers/modalsReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const conditionText = (slug) => {
    return async dispatch => {
        try {
            dispatch(setSpinner(true))
            const response = await axios.post(PUBLIC_API_URL+`api/text`, {
                slug,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(setTextModal(response.data.text))
            dispatch(setSpinner(false))
        }catch (e){
            dispatch(setSpinner(false))
            console.log(e.response, 'eeeeeeerespons')
        }
    }
}
export const limit_text = (slug) => {
    return async dispatch => {
        try {
            dispatch(setSpinner(true))
            const response = await axios.post(PUBLIC_API_URL+`api/text`, {
                slug,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(setLimitTextModal(response.data.text))
            dispatch(setSpinner(false))
        }catch (e){
            dispatch(setSpinner(false))
            console.log(e.response, 'eeeeeeerespons')
        }
    }
}