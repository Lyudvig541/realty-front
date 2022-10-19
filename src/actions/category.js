import axios from "axios";
import {getCategories} from "../reducers/categoryReducer";
import {setSpinner} from "../reducers/modalsReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const categories = () => {
    return async dispatch => {
        try {
            dispatch(setSpinner(true))
            const language = localStorage.i18nextLng
            const response = await axios.post(PUBLIC_API_URL+`api/categories`, {
                language,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getCategories(response.data.categories));
            dispatch(setSpinner(false))
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}
