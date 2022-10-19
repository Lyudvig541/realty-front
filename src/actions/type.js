import axios from "axios";
import {getTypes} from "../reducers/typeReducer";
import {setSpinner} from "../reducers/modalsReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const types = () => {
    return async dispatch => {
        try {
            dispatch(setSpinner(true))
            const language = localStorage.i18nextLng
            const response = await axios.post(PUBLIC_API_URL+`api/types`, {
                language,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getTypes(response.data.types));
            dispatch(setSpinner(false))
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}
