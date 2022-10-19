import axios from "axios";
import {setPlaces} from "../reducers/placesReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const allPlaces = () => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/places`, {
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(setPlaces(response.data.places))
            return response.data.places;
        }catch (e){

        }
    }
}
