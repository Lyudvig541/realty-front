import axios from "axios";
import {getAllFavorites, getFavorites} from "../reducers/announcementReducer";
const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;
export const add_favorite = (announcementId , userId) => {
    return async dispatch => {
            await axios.post(PUBLIC_API_URL+`api/add-favorite`, {
                announcementId,
                userId,
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`,
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            }).then((response)=>{
            }).catch ((e)=>{
            console.log(e,'111')});
        }
}
export const remove_favorite = (announcementId , userId) => {
    return async dispatch => {
        await axios.post(PUBLIC_API_URL+`api/remove-favorite`, {
            announcementId,
            userId,
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`,
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=>{
            dispatch(getAllFavorites(response.data.message))
        }).catch ((e)=>{
            console.log(e,'111')});
    }
}

export  const get_favorites = (id) => {
    return async dispatch =>{
        try {
            const ids = Object.values(JSON.parse(id));
            const response = await axios.post(PUBLIC_API_URL + 'api/favorites',{
                ids,
                headers:{
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getFavorites(response.data.favorites))
        }catch (e) {
            await dispatch(getFavorites([]))
        }
    }
}