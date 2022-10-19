import axios from "axios";
import {getAgents, getSuperAgents, setAgentSpinner, setSuperAgentSpinner} from "../reducers/agentReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const get_agents = (page = 1) => {
    return async dispatch => {
        try {
            dispatch(setAgentSpinner(true))
            const response = await axios.post(PUBLIC_API_URL+`api/brokers`, {
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getAgents(response.data.brokers));
            dispatch(setAgentSpinner(false))
        }catch (e){
            dispatch(getAgents([]));
        }
    }
}
export const get_super_agents = (page = 1) => {
    return async dispatch => {
        try {
            dispatch(setSuperAgentSpinner(true))
            const response = await axios.post(PUBLIC_API_URL+`api/super-brokers`, {
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getSuperAgents(response.data.brokers));
            dispatch(setSuperAgentSpinner(false))
        }catch (e){
            dispatch(getSuperAgents([]));
        }
    }
}
