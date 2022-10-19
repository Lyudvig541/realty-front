import axios from "axios";
import {setSpinner} from "../reducers/modalsReducer";
import {setSuperBrokersNames, setUserData} from "../reducers/userDataReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const user = (id) => {
    return async dispatch => {
        try {
            dispatch(setSpinner(true))
            const response = await axios.post(PUBLIC_API_URL+`api/user`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(setUserData(response.data.user));
            dispatch(setSpinner(false))
        }catch (e){
            dispatch(setSpinner(false))
        }
    }
}
export const super_brokers_names = (id) => {
    return async dispatch => {
        try {
            dispatch(setSpinner(true))
            const response = await axios.post(PUBLIC_API_URL+`api/super-brokers-names`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(setSuperBrokersNames(response.data.brokers));
        }catch (e){
            dispatch(setSuperBrokersNames([]));
        }
    }
}
