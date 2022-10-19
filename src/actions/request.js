import axios from "axios";
import {getBankRequest} from "../reducers/resourcesReducer";
import {getAgents} from "../reducers/agentReducer";
import {setModal, setSpinner} from "../reducers/modalsReducer";
import {getCities} from "../reducers/announcementReducer";
import {setUser} from "../reducers/authReducer";
import {setErrors} from "../reducers/profileReducer";
import {brokerMessageSuccess, brokerReviewSuccess} from "../reducers/requestReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const bank_request = (data) => {
    return async dispatch => {
        try {
            JSON.stringify(data);
            const files = data.images;
            await axios.post(PUBLIC_API_URL+`api/add_bank_request`, {
                data,
                files,
                Authorization:`Bearer ${localStorage.getItem('token')}`,
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }).then((response)=>{
                dispatch(setModal("request"))
                dispatch(getBankRequest(response.data.bankRequest))
            })
        }catch (e){
            console.log(e, 'eeeeeeerespons');
        }
    }
}
export const get_search_agent = (page,data=[],newData=[]) => {
    return async dispatch =>{
        try {
            data[newData[0]] = newData[1];
            const response = await axios.post(PUBLIC_API_URL + 'api/search_agent',{
                data,
                page:page,
                headers:{
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getAgents(response.data.brokers))
            dispatch(setSpinner(false))
        }catch (e) {
            await dispatch(getAgents([]))
        }
    }
}
export  const cities = () =>{
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/cities`, {
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getCities(response.data.cities))
        }catch (e) {
            console.log(e, 'cities')
        }
    }
}

export const edit_user = (data,id) => {
    return async dispatch => {
        try {
            console.log(data,"dadadaa")
            const response = await axios.post(PUBLIC_API_URL+`api/edit_user`, {
                data,id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            if (response.data.status === 400) {
                dispatch(setErrors(response.data.message))

            }else {
                dispatch(setUser(response.data.user))
                dispatch(setErrors([]))
                window.scrollTo(0, 0)
            }
        }catch (e){
            console.log(e)

        }
    }
}
export const edit_user_image = (file,id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/edit_user_image`, {
                file,id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
                dispatch(setUser(response.data.user))
        }catch (e){
            console.log(e, 'eeeeeeerespons');
        }
    }
}
export const sendContactAgent = (message,agent_id,user_id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/send-message`, {
                message,agent_id,user_id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            if (response.data.status === 200){
                dispatch(brokerMessageSuccess(true));
            }
        }catch (e){
            console.log(e, 'eeeeeeerespons');
        }
    }
}
export const reviewAgent = (message, agent_id, user_id, rate_broker) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/add_comment`, {
                message,
                agent_id,
                user_id,
                rate_broker,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            if (response.data.status === 200){
                dispatch(brokerReviewSuccess(true));
                document.getElementById('eye-' + agent_id).hidden = true;
            }
        }catch (e){
            console.log(e, 'eeeeeeerespons');
        }
    }
}
