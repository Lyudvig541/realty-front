import axios from "axios";
import {
    getAnnouncements,
    getAdditionalInformation,
    getFacilitiesInformation,
    getOneAnnouncement,
    getFavorites,
    setAnnouncementErrors,
    getStates,
    getCities,
    getMyAnnouncements,
    getMyRentingAnnouncements,
    getCurrencies,
    setSearchParams,
    getSearchAnnouncements,
    setCurrentPage,
    getFacilities,
    getAdditional,
    getAllFavorites,
    getSimilarAnnouncements,
    setSelectPlaces,
    setActiveTab,
    setAddListingFinished,
    getTotalCount,
    getAllAnnouncements,
    setListingValidate,
    getUnverifiedAnnouncements,
    getArchivedAnnouncements,
    getOffersAndClosings,
    setPropertySpinner,
} from "../reducers/announcementReducer";
import {setAnnouncementModal, setCheckAgentModal, setModal, setSpinner} from "../reducers/modalsReducer";
import {getAgent, setSelectedAgent} from "../reducers/agentReducer";
import {getTypes} from "../reducers/typeReducer";
import {getCategories} from "../reducers/categoryReducer";
import {
    setArchivedSpinner,
    setFavoriteListingSpinner,
    setListingSpinner,
    setRentListingSpinner,
    setUnverifiedSpinner
} from "../reducers/profileReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;
const language = localStorage.i18nextLng

export const add_announcement = (data, additionalInformation = [], facilitiesaInformation =[],price=0) => {
    return async dispatch => {
            JSON.stringify(data);
            const additionalInfo = additionalInformation || [];
            const facilitiesaInfo =facilitiesaInformation || [];
            const files = data.images;
            await axios.post(PUBLIC_API_URL+`api/add-announcement`, {
                data,
                additionalInformation:additionalInfo,
                facilitiesaInformation:facilitiesaInfo,
                price,
                files,
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                    Authorization:`Bearer ${localStorage.getItem('token')}`,
                }
            }).then((response)=>{
                if (response.data.status === 200){
                    dispatch(getOneAnnouncement(response.data.announcement))
                    dispatch(setAnnouncementErrors([]))
                    dispatch(setAnnouncementModal("announcement",response.data.announcement.id))
                    dispatch(setActiveTab(true))
                    dispatch(setAddListingFinished(true));
                    dispatch(setAnnouncementModal(""));
                    dispatch(setListingValidate(false))
                }else if(response.data.status === 400){
                    let errors = {...response.data.message[0],...response.data.message[1]};
                    dispatch(setAnnouncementErrors(errors))
                }else if(response.data.status === 402){
                    dispatch(setModal('announcements_limit'))
                }
            }).catch ((e)=>{
            console.log(e,'111')});
        }
}
export const edit_announcement = (newData,oldData, additionalInformation = [], facilitiesaInformation =[],price) => {
    return async dispatch => {
        const data = {
            id:oldData.id,
            type:oldData.type_id,
            category:oldData.category_id,
            price: oldData.price,
            rent_type: oldData.rent_type,
            land_area: oldData.land_area,
            year: oldData.year,
            area: oldData.area,
            check_agent: newData.check_agent,
            bedrooms: oldData.rooms,
            bathrooms:  oldData.bathroom,
            ceiling_height:  oldData.ceiling_height,
            floor: oldData.floor,
            storeys: oldData.storeys,
            balcony:  oldData.balcony,
            cover:  oldData.cover,
            condition: oldData.condition,
            building_type: oldData.building_type,
            sewer: oldData.sewer,
            condominium: oldData.condominium,
            degree: oldData.degree,
            distance_from_metro_station:  oldData.distance_from_metro_station,
            distance_from_medical_center: oldData.distance_from_medical_center,
            distance_from_stations: oldData.distance_from_stations,
            address: oldData.address,
            furniture: oldData.furniture,
            latitude: oldData.latitude,
            longitude: oldData.longitude,
            description: oldData.description,
            certificate: newData.certificate,
            main_image: newData.main_image,
            building_number: oldData.building_number,
            state_id: oldData.state_id,
            region_id: oldData.state_id,
            city_id:oldData.city_id,
            currency: oldData.currency_id,
        }
        JSON.stringify(data);
        const additionalInfo = additionalInformation || [];
        const facilitiesaInfo = facilitiesaInformation;
        const files = newData.images;
        await axios.post(PUBLIC_API_URL+`api/edit-announcement`, {
            data,
            additionalInformation:additionalInfo,
            facilitiesaInformation:facilitiesaInfo,
            price,
            files,
            headers:{
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
                Authorization:`Bearer ${localStorage.getItem('token')}`,
            }
        }).then((response)=>{
            if (response.data.status === 200){
                dispatch(getOneAnnouncement(response.data.announcement))
                dispatch(setAnnouncementErrors([]))
                dispatch(setAnnouncementModal("announcement",response.data.announcement.id))
                // dispatch(setActiveTab(true))
                window.location.href = '/'
            }else if(response.data.status === 400){
                let errors = {...response.data.message[0],...response.data.message[1]};
                dispatch(setAnnouncementErrors(errors))
            }
        }).catch ((e)=>{
            console.log(e,'111')});
    }
}

export const get_announcement = (id) => {
    return async dispatch => {
        try {
            dispatch(setPropertySpinner(true))
            const response = await axios.post(PUBLIC_API_URL+`api/get_announcement`, {
                id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getOneAnnouncement(response.data.announcement))
            dispatch(getCurrencies(response.data.currencies))
            dispatch(getFacilities(JSON.parse(response.data.announcement.facilities)||{}))
            dispatch(getCities(response.data.state.cities))
            dispatch(getAgent(response.data.user))
            dispatch(getAdditional(JSON.parse(response.data.announcement.additional_infos)||{}))
            if (response.data.announcement.agent_id){
                dispatch(setSelectedAgent(response.data.announcement.agent_id))
            }
            setSpinner(false)
            dispatch(setPropertySpinner(false))
        }catch (e){
            dispatch(getOneAnnouncement({}))
            dispatch(setPropertySpinner(false))
        }
    }
}

export const get_types = () => {
    return async dispatch => {
        try {
            const language = localStorage.i18nextLng
            const response = await axios.post(PUBLIC_API_URL+`api/types`, {
                language,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getTypes(response.data.types));
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}

export const get_categories = () => {
    return async dispatch => {
        try {
            const language = localStorage.i18nextLng
            const response = await axios.post(PUBLIC_API_URL+`api/categories`, {
                language,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getCategories(response.data.categories));
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}

export const delete_announcement = (id) => {
    return async () => {
        try {
            await axios.post(PUBLIC_API_URL+`api/delete_announcement`, {
                id,
                headers: {
                    'Authorization':'Bearer ' +  localStorage.getItem('token'),
                }
            })
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}
export const de_archiving_announcement = (user_id,id) => {
    return async dispatch => {
        try {
            const response =  await axios.post(PUBLIC_API_URL+`api/de_archiving_announcement`, {
                id,
                user_id,
                headers: {
                    'Authorization':'Bearer ' +  localStorage.getItem('token'),
                }
            })
            dispatch(getArchivedAnnouncements(response.data.announcements));
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}
export const offers_and_closings = (user_id) => {
    return async dispatch => {
        try {
            const response =  await axios.post(PUBLIC_API_URL+`api/offers_and_closings`, {
                user_id,
                headers: {
                    'Authorization':'Bearer ' +  localStorage.getItem('token'),
                }
            })
            dispatch(getOffersAndClosings(response.data.announcements));
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}

export  const states = () =>{
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/states`, {
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getStates(response.data.states))
        }catch (e) {
            console.log(e, 'states')
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
            console.log(e, 'states')
        }
    }
}

export  const currencies = () =>{
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/currencies`, {
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getCurrencies(response.data.currencies))
        }catch (e) {
            console.log(e, 'states')
        }
    }
}

export  const facilities_information = () =>{
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/facilities`, {
                language,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getFacilitiesInformation(response.data.facilitiesInformation))
        }catch (e) {
            console.log(e, 'addInfo')
        }
    }
}

export  const additional_information = () =>{
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/additional`, {
                language,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getAdditionalInformation(response.data.additionalInformation))
        }catch (e) {
            console.log(e, 'addInfo')
        }
    }
}

export  const get_favorites = (id) => {
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL + 'api/favorites',{
                id,
                headers:{
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getAllFavorites(response.data.favorites))
            dispatch(setFavoriteListingSpinner(false))
        }catch (e) {
            console.log(e, 'favorit')
            await dispatch(getFavorites([]))
            dispatch(setFavoriteListingSpinner(false))
        }
    }
}

export  const get_user_favorites = (id) => {
    return async dispatch =>{
        try {
            const response = await axios.post(PUBLIC_API_URL + 'api/get_user_favorite',{
                id,
                headers:{
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getFavorites(response.data.favorites))
        }catch (e) {
            console.log(e, 'favorit')
            await dispatch(getFavorites([]))
        }
    }
}

export  const get_search = (data,newData,page = 1) => {
    return async dispatch =>{
        try {
            dispatch(setSpinner(true))
            data[newData[0]] = newData[1];
            const response = await axios.post(PUBLIC_API_URL + 'api/search_announcement',{
                page,
                data,
                headers:{
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getAllAnnouncements(response.data.allAnnouncements))
            await dispatch(getSearchAnnouncements(response.data.announcements))
            dispatch(getTotalCount(response.data.announcements.total))
            await dispatch(setSearchParams(data))
            await dispatch(setCurrentPage(1))
            await dispatch(setSpinner(false))
        }catch (e) {
            console.log(e, 'search')
            await dispatch(getAnnouncements([]))
        }
    }
}

export  const similar_announcements = (id,page = 1) => {
    return async dispatch =>{
        try {
            dispatch(setSpinner(true))
            const response = await axios.post(PUBLIC_API_URL + 'api/similar-announcements',{
                page,
                id,
                headers:{
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getSimilarAnnouncements(response.data.announcements))
            await dispatch(setSpinner(false))
        }catch (e) {
            console.log(e, 'search')
            await dispatch(getAnnouncements([]))
        }
    }
}

export const announcements = (data,newData,currentPage = 1) => {
    return async dispatch => {
        try {
            data[newData[0]] = newData[1];
            const page = currentPage + 1;
            dispatch(setCurrentPage(page));
            const response = await axios.post(PUBLIC_API_URL+`api/search_announcement`, {
                page:page,
                data,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            await dispatch(getAnnouncements(response.data.announcements));
        }catch (e){
            dispatch(getAnnouncements([]))
        }
    }
}

export const sendRequestToAgent = (agent,announcement) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/add-agent-announcement`, {
                agent,
                announcement,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            if (response && response.data.status === 'success'){
                dispatch(setCheckAgentModal(''))
                dispatch(setAnnouncementModal("announcement", response.data.announcement.id))
            }
        }catch (e){
            dispatch(getAnnouncements([]))
        }
    }
}

export const selectAgent = (id, agentId) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/select-agent`, {
                id,
                agentId,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            if (response && response.data.status === 'success'){
                dispatch(setCheckAgentModal(''))
                dispatch(setAnnouncementModal("announcement", response.data.announcement.id))
            }
        }catch (e){

        }
    }
}

export const get_user_announcements = (id,page = 1) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/user_announcements`, {
                id,
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getMyAnnouncements(response.data.announcements))
            dispatch(setListingSpinner(false))
        }catch (e){
            dispatch(getMyAnnouncements([]))
            dispatch(setListingSpinner(false))
            console.log(e, 'eeeeeeerespons')
        }
    }
}

export const get_user_renting_announcements = (id,page=1) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/user_renting_announcements`, {
                id,
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getMyRentingAnnouncements(response.data.announcements))
            dispatch(setRentListingSpinner(false))
        }catch (e){
            dispatch(getMyRentingAnnouncements([]))
            dispatch(setRentListingSpinner(false))
            console.log(e, 'eeeeeeerespons')
        }
    }
}
export const add_archive = (id, user_id, type, page = 1) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/add_archive`, {
                id,
                user_id,
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            if(type === "my_announcements"){
                dispatch(getMyAnnouncements(response.data.announcements));
            }else{
                dispatch(getMyRentingAnnouncements(response.data.announcements));
            }
        }catch (e){
            dispatch(getArchivedAnnouncements([]))
            console.log(e, 'eeeeeeerespons')
        }
    }
}
export const completed_announcement = (id, user_id, type, page) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/completed`, {
                id,
                user_id,
                type,
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            if(type === "my_announcements"){
                dispatch(getMyAnnouncements(response.data.announcements));
            }else{
                dispatch(getMyRentingAnnouncements(response.data.announcements));
            }
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}
export const renew_announcement = (id, user_id, type, page) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/renew`, {
                id,
                user_id,
                type,
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            if(type === "my_announcements"){
                dispatch(getMyAnnouncements(response.data.announcements));
            }else{
                dispatch(getMyRentingAnnouncements(response.data.announcements));
            }
        }catch (e){
            console.log(e, 'eeeeeeerespons')
        }
    }
}

export const get_user_unverified_announcements = (id,page=1) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/user_unverified_announcements`, {
                id,
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getUnverifiedAnnouncements(response.data.announcements))
            dispatch(setUnverifiedSpinner(false))
        }catch (e){
            dispatch(get_user_unverified_announcements([]))
            dispatch(setUnverifiedSpinner(false))
            console.log(e, 'eeeeeeerespons')
        }
    }
}
export const get_user_archived_announcements = (id,page=1) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/user_archived_announcements`, {
                id,
                page,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(getArchivedAnnouncements(response.data.announcements))
            dispatch(setArchivedSpinner(false))
        }catch (e){
            dispatch(getArchivedAnnouncements([]))
            dispatch(setArchivedSpinner(false))
            console.log(e, 'eeeeeeerespons')
        }
    }
}


export const get_places = () => {
    return async dispatch => {
        let addresses = localStorage.addresses && JSON.parse(localStorage.addresses).length > 0 ? JSON.parse(localStorage.addresses) : [];
        dispatch(setSelectPlaces(addresses))
    }
}

export const set_selected_places = (suggestion) => {
    return async dispatch => {
        if (Object.keys(suggestion).length > 0) {
            let addresses = localStorage.addresses && JSON.parse(localStorage.addresses).length > 0 ? JSON.parse(localStorage.addresses) : [];
            let new_address = [];
            let result = [];
            if (addresses.length > 0) {
                addresses.forEach((value, index) => {
                    if (value.id === suggestion.id) {
                        addresses.splice(index, 1);
                    }
                })
                addresses.push({
                    id: suggestion.id,
                    name: suggestion.name,
                    map_zoom: suggestion.map_zoom,
                    coordinates: suggestion.coordinates.split(',').map(Number),
                    key: suggestion.key
                });
                new_address = addresses;
            } else {
                new_address = [{
                    id: suggestion.id,
                    name: suggestion.name,
                    map_zoom: suggestion.map_zoom,
                    coordinates: suggestion.coordinates.split(',').map(Number),
                    key: suggestion.key
                }];
            }
            if (new_address.length > 4) {
                result = new_address.slice(Math.max(new_address.length - 4, 1))
            } else {
                result = new_address
            }
            localStorage.removeItem("addresses")
            localStorage.setItem("addresses", JSON.stringify(result))
            dispatch(setSelectPlaces(result));
        }
    }
}

export const validateListing = (data, type = null)=>{
    return async dispatch => {
        await axios.post(`${PUBLIC_API_URL}api/validate_listing`,{
            data,
            headers: {
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=>{
            if (response.data.status === 200){
                if (type){
                    dispatch(setAnnouncementErrors([]))
                    dispatch(setActiveTab(false))
                }else {
                    dispatch(setAnnouncementErrors([]))
                    dispatch(setAnnouncementModal('announcement'))
                    dispatch(setActiveTab(true))
                }
            }else if(response.data.status === 400){
                let errors = {...response.data.message[0],...response.data.message[1]};
                dispatch(setAnnouncementErrors(errors))
                const value = Object.keys(errors)[0].split('.');
                if (document.getElementsByName(value[1])[0]){
                    document.documentElement.scrollTop = window.scrollY + document.getElementsByName(value[1])[0].getBoundingClientRect().top - 120;
                }
                dispatch(setActiveTab(true))
                dispatch(setListingValidate(false))
            }
        })
    }
}

export const editListingValidate = (newData,oldData, type = null)=>{
    return async dispatch => {
        const data = {
            id:oldData.id,
            type:oldData.type_id,
            category:oldData.category_id,
            price: oldData.price,
            rent_type: oldData.rent_type,
            land_area: oldData.land_area,
            year: oldData.year,
            area: oldData.area,
            check_agent: newData.check_agent,
            bedrooms: oldData.rooms,
            bathrooms: oldData.bathroom,
            ceiling_height: oldData.ceiling_height,
            floor: oldData.floor,
            storeys: oldData.storeys,
            balcony: oldData.balcony,
            cover: oldData.cover,
            condition: oldData.condition,
            building_type: oldData.building_type,
            sewer: oldData.sewer,
            condominium: oldData.condominium,
            degree: oldData.degree,
            distance_from_metro_station: oldData.distance_from_metro_station,
            distance_from_medical_center: oldData.distance_from_medical_center,
            distance_from_stations: oldData.distance_from_stations,
            address: oldData.address,
            furniture: oldData.furniture,
            latitude: oldData.latitude,
            longitude: oldData.longitude,
            description: oldData.description,
            certificate: newData.certificate,
            main_image: newData.main_image,
            building_number: oldData.building_number,
            city: oldData.city,
            state: oldData.state,
            state_id: oldData.state_id,
            region_id: oldData.state_id,
            city_id: oldData.city_id,
            currency: oldData.currency_id,
            recaptcha: true,
            agree: true,
        }
        await axios.post(`${PUBLIC_API_URL}api/validate_listing`,{
            data,
            headers: {
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=>{
            if (response.data.status === 200){
                if (type){
                    dispatch(setAnnouncementErrors([]))
                    dispatch(setActiveTab(false))
                }else {
                    dispatch(setAnnouncementErrors([]))
                    dispatch(setAnnouncementModal('announcement'))
                    dispatch(setActiveTab(true))
                }
            }else if(response.data.status === 400){
                let errors = {...response.data.message[0],...response.data.message[1]};
                dispatch(setAnnouncementErrors(errors))
                dispatch(setActiveTab(true))
            }
        })
    }
}

export const changeRentAnnouncementDatePicker = (id,date)=>{
        return async dispatch => {
            await axios.post(`${PUBLIC_API_URL}api/date-picker`,{
                id,
                start_date:date[0],
                end_date:date[1],
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            }).then((response)=>{
                dispatch(getMyRentingAnnouncements(response.data.rentAnnouncements));
            }).catch((error)=>{
                console.log(error,'datePicker')
            })
        }
}