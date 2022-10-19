import axios from "axios";
import {
    getUnreadNotifications,
    getAllNotifications,
} from "../reducers/notificationsReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;


export const unreadNotifications = () => {
    return async dispatch => {
        try {
            const response = await axios.get(PUBLIC_API_URL+`api/unread-notifications`, {
                headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(getUnreadNotifications(response.data.notifications))
        }catch (e){
            dispatch(getUnreadNotifications([]))
        }
    }
}

export const allNotifications = (page) => {
    return async dispatch => {
        try {
            const response = await axios.get(PUBLIC_API_URL+`api/notifications?page=${page}`, {
                headers:
                    {Authorization:`Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(getAllNotifications(response.data.allNotifications))
        }catch (e){
            dispatch(getAllNotifications([]))
        }
    }
}

export const readNotifications = (id) => {
    return async dispatch => {
        try {
            const response = await axios.get(PUBLIC_API_URL+`api/read-notification/`+id, {
                headers:
                    {Authorization:`Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(getUnreadNotifications(response.data.unreadNotification))
        }catch (e){
            console.log(e)
        }
    }
}
export const readAllNotifications = () => {
    return async dispatch => {
        try {
            const response = await axios.get(PUBLIC_API_URL+`api/read-all-notifications`, {
                headers:
                    {Authorization:`Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(getAllNotifications(response.data.unreadNotification))
            dispatch(getUnreadNotifications([]))

        }catch (e){
            console.log(e)
        }
    }
}
