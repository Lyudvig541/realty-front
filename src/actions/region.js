import axios from "axios";
import {getStates,getCities} from "../reducers/regionReducer";
const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const get_states = () => {
    return async dispatch => {
            await axios.post(PUBLIC_API_URL+`api/use-states`, {
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            }).then((response)=> {
                    dispatch(getStates(response.data.regions))
            })
    }
}

export const get_cities = () => {
    return async dispatch => {
        await axios.post(PUBLIC_API_URL+`api/use-cities`, {
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`,
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=>{
                dispatch(getCities(response.data.cities))
        }).catch ((e)=>{
            console.log(e,'111')});
    }
}