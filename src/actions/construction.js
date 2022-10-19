import axios from "axios";
import {
    getAllConstructions,
    getConstruction,
    getConstructionCurrentPage,
    getConstructions, setConstructorParams
} from "../reducers/constructionReducer";
import {setSpinner} from "../reducers/modalsReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const construction = (id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL + `api/construction`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getConstruction(response.data.construction))
            await dispatch(setSpinner(false))
        } catch (e) {
            dispatch(getConstructions([]))
        }
    }
}
export const constructions = (data,newData,page = 1) => {
    return async dispatch => {
        try {
            data[newData[0]] = newData[1];
            const response = await axios.post(PUBLIC_API_URL + `api/constructions`, {
                page: page,
                data,
                headers:
                    {
                        'Access-Control-Allow-Origin': PUBLIC_API_URL,
                    }
            })
                dispatch(getConstructionCurrentPage(2));
                dispatch(getConstructions(response.data.constructions));
                dispatch(setConstructorParams(data));
                dispatch(setSpinner(false));
        } catch (e) {
            dispatch(getConstructions([]))
        }
    }
}
export const all_constructions = (region = 1) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL + `api/all-constructions`, {
                region: region,
                headers:
                    {
                        'Access-Control-Allow-Origin': PUBLIC_API_URL,
                    }
            })
                dispatch(getAllConstructions(response.data.constructions));
        } catch (e) {
            dispatch(getAllConstructions([]))
        }
    }
}