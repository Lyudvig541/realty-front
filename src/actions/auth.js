import axios from "axios";
import {
    getMessage,
    request,
    setBrokerErrors,
    setCurrentMessagePage,
    setLoginErrors,
    setRegisterErrors,
    setUser,
    setUserBrokerMessages,
    setUserBrokerMoreMessages,
    unreadMessages
} from "../reducers/authReducer";
import {setModal, setUserComments} from "../reducers/modalsReducer";
import {setMessageSpinner} from "../reducers/profileReducer";

const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;

export const login = (email, password) => {
    return async dispatch => {
           await axios.post(PUBLIC_API_URL+`api/login`, {
                email,
                password,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            }).then((response)=> {
               if (response.data.status === 400) {
                   dispatch(setLoginErrors(response.data.errors))
               }else {
                   dispatch(setUser(response.data.user))
                   dispatch(setModal(""))
                   localStorage.setItem('token', response.data.token.original.access_token)
                   if (response.data.user.phone_number_verified_at === null){
                       dispatch(setModal("phone_number_verification"))
                   }
               }
           })
    }
}
export const socialLogin = (data) => {
    return async dispatch => {
            await axios.post(PUBLIC_API_URL+`api/social-login`, {
                 data,
                 headers: {
                     'Access-Control-Allow-Origin': PUBLIC_API_URL,
                 }
             }).then((response)=> {
                dispatch(setUser(response.data.user))
                dispatch(setModal(""))
                localStorage.setItem('token', response.data.token)
                if (response.data.user.phone_number_verified_at === null){
                    dispatch(setModal("phone_number_verification"))
                }
            })
    }
}

export const auth =  () => {
    return async dispatch => {
        try {
            const response = await axios.get(PUBLIC_API_URL+`api/auth`,
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data.user))
        } catch (e) {
            // localStorage.removeItem('token')
        }
    }
}
export const forgotPassword =  (email) => {
    return async dispatch => {
        await axios.post(PUBLIC_API_URL+`api/forgot_password`,
                {'email':email,
                    headers: {
                        'Access-Control-Allow-Origin': PUBLIC_API_URL,
                    }}).then((response)=> {
                if (response.data.status === 400) {
                    dispatch(setLoginErrors(response.data.errors))
                    console.log(response.data.errors)
                }else{
                    dispatch(setModal("mail_info"))
                }
            })
    }
}

export const register = (firstName,lastName,email, password,repeatPassword) => {
    return async dispatch => {
            const user = {
                firstName : firstName,
                lastName : lastName,
                email : email,
                password:password,
                password_confirmation : repeatPassword,
            }
            await axios.post(PUBLIC_API_URL+`api/register`, {
                user,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            }).then((response)=> {
                if (response.data.status === 400) {
                    dispatch(setRegisterErrors(response.data.errors))
                }else{
                    dispatch(setUser(response.data.user))
                    localStorage.setItem('token', response.data.token.original.access_token)
                }
            })
    }
}

export const broker_register = (firstName,lastName,email, phone) => {
    return async dispatch => {
        const user = {
            firstName : firstName,
            lastName : lastName,
            email : email,
            phone:phone,
        }
        await axios.post(PUBLIC_API_URL+`api/api-agent-request`, {
            user,
            headers: {
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=> {
            if (response.data.status === 400) {
                dispatch(setBrokerErrors(response.data.errors))
            }else{
                dispatch(request(response.data.request_status))
            }
        })
    }
}

export const resetPassword = (email,password,repeatPassword) => {
    return async dispatch => {
        const user = {
            email : email,
            password:password,
            password_confirmation : repeatPassword,
        }
        await axios.post(PUBLIC_API_URL+`api/reset_password`, {
            user,
            headers: {
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=> {
            if (response.data.status === 400) {
                dispatch(setLoginErrors(response.data.errors))
            }else{
                window.location.href = '/'
                dispatch(setUser(response.data.user))
                localStorage.setItem('token', response.data.token.original.access_token)
                if (response.data.user.phone_number_verified_at === null){
                    dispatch(setModal("phone_number_verification"))
                }
            }
        })
    }
}
export const getUserMessages = (user) => {
    return async dispatch => {
        await axios.post(PUBLIC_API_URL+`api/get-messages`, {
            user_id : user,
            headers: {
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=> {
            dispatch(getMessage(response.data.messages))
            dispatch(setMessageSpinner(false))
        }).catch(()=>{
            dispatch(setMessageSpinner(false))
        })
    }
}
export const getUserBrokerMessages = (user_id, broker_id, class_name, page= 1,see_more = 1) => {
    return async dispatch => {
        await axios.post(PUBLIC_API_URL+`api/get-user-broker-messages`, {
            user_id : user_id,
            broker_id : broker_id,
            page:page,
            headers: {
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=> {
            if (see_more){
                dispatch(setCurrentMessagePage(2))
                dispatch(setUserBrokerMessages(response.data.messages.data))
                document.getElementsByClassName(class_name)[0].scrollTop = 200;
            }else{
                dispatch(setCurrentMessagePage(++page))
                dispatch(setUserBrokerMoreMessages(response.data.messages))
            }
        }).catch((e)=>{
            console.log(e)
        })
    }
}
export const getUnreadMessages = (user_id) => {
    return async dispatch => {
        await axios.post(PUBLIC_API_URL+`api/unread-messages`, {
            user_id : user_id,
            headers: {
                'Access-Control-Allow-Origin': PUBLIC_API_URL,
            }
        }).then((response)=> {
            dispatch(unreadMessages(response.data.unreadMessages))
        }).catch((e)=>{
            console.log(e)
        })
    }
}
export const user_comments = (user_id) => {
    return async dispatch => {
        try {
            const response = await axios.post(PUBLIC_API_URL+`api/user_comments`, {
                user_id,
                headers: {
                    'Access-Control-Allow-Origin': PUBLIC_API_URL,
                }
            })
            dispatch(setUserComments(response.data.comments))
        }catch (e){
            dispatch(setUserComments([]))
        }
    }
}

