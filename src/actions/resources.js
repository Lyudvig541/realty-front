import axios from "axios";
import {
    getAgencies,
    getTopAgencies,
    getPartners,
    getTopCompanies,
    getAnnouncements,
    getAllCompanies,
    getAgency,
    getCompany,
    getTextPage,
    getTextPages,
    getConstAgency, getConstAgencies, getAgencyAnnouncements,
} from "../reducers/resourcesReducer";
import {getNames, getAllAgents, getAgent} from "../reducers/agentReducer";
import {setSpinner} from "../reducers/modalsReducer";
const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;
export const partners = () => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/partners`, {

            })
            dispatch(getPartners(response.data.partners))
        }catch (e){
            dispatch(getPartners([]))
        }
    }
}

export const agencies = (page) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/agencies`, {
                page:page,
                headers:
                    {
                        'Access-Control-Allow-Origin': PUBLIC_API_URL,
                    }
            })
            dispatch(getAgencies(response.data.agencies))
            dispatch(setSpinner(false))
        }catch (e){
            dispatch(getAgencies([]))
        }
    }
}
export const agenciesAll = () => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/agenciesAll`, {
                headers:
                    {
                        'Access-Control-Allow-Origin': PUBLIC_API_URL,
                    }
            })
            dispatch(getAgencies(response.data.agencies))
        }catch (e){
            dispatch(getAgencies([]))
        }
    }
}
export const topAgencies = () => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/top_agencies`, {
            })
            dispatch(getTopAgencies(response.data.top_agencies))
        }catch (e){
            dispatch(getTopAgencies([]))
        }
    }
}

export const agents = (page) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/brokers-names`, {
                page:page,
                headers:
                    {
                        'Access-Control-Allow-Origin': PUBLIC_API_URL,
                    }
            })
            dispatch(getNames(response.data.brokers))
        }catch (e){
            dispatch(getNames([]))
        }
    }
}

export const allAgents = () => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/brokers_list`)
            dispatch(getAllAgents(response.data.brokers))
        }catch (e){
            dispatch(getAllAgents([]))
        }
    }
}

export const topCompanies = () => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/top_companies`, {

            })
            dispatch(getTopCompanies(response.data.top_companies))
        }catch (e){
            dispatch(getTopCompanies([]))
        }
    }
}
export const allCompanies = () => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/all_companies`, {
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:8000',
                }
            })
            dispatch(getAllCompanies(response.data.all_companies))
        }catch (e){
            dispatch(getAllCompanies([]))
        }
    }
}


export const announcements = (coordinates = []) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/announcements`, {
                coordinates,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getAnnouncements(response.data.announcements));
        }catch (e){
            dispatch(getAnnouncements([]))
        }
    }
}
export const agent = (id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/broker`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getAgent(response.data.broker))
        }catch (e){
            dispatch(getAgent([]))
        }
    }
}
export const agency = (id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/agency`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getAgency(response.data.agency))
        }catch (e){
            dispatch(getAgency([]))
        }
    }
}
export const agency_announcements = (id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/agency-announcements`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getAnnouncements(response.data.announcements))
        }catch (e){
            dispatch(getAnnouncements([]))
        }
    }
}
export const agency_brokers_announcements = (id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/agency-brokers-announcements`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getAgencyAnnouncements(response.data.announcements))
        }catch (e){
            dispatch(getAgencyAnnouncements([]))
        }
    }
}

export  const company = (id) =>{
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/company`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getCompany(response.data.company))
        }catch (e) {
            dispatch(getCompany([]))
        }
    }
}
export  const textPages = () =>{
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/text_pages`, {
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getTextPages(response.data.pages))
        }catch (e) {
            dispatch(getTextPages([]))
        }
    }
}
export  const textPage = (slug) =>{
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/text_page`, {
                slug:slug,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getTextPage(response.data.page))
        }catch (e) {
            dispatch(getTextPage([]))
        }
    }
}
export const const_agency = (id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/constructor_agency`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getConstAgency(response.data.const_agency))
        }catch (e){
            dispatch(getConstAgency([]))
        }
    }
}
export const const_agencies = () => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/constructor_agencies`, {
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getConstAgencies(response.data.const_agencies))
        }catch (e){
            dispatch(getConstAgencies([]))
        }
    }
}