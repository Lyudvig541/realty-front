import React, {useEffect, useState} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch, useSelector} from "react-redux";
import {getUserBrokerMessages, getUserMessages} from "../../actions/auth";
import {sendContactAgent} from "../../actions/request";
import {PulseLoader} from "react-spinners";

const Message = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const default_avatar = publicUrl + "/assets/img/author/default_avatar.png";
    const dispatch = useDispatch();
    const {t} = props;
    const user = useSelector(state => state.auth.currentUser);
    const messages = useSelector(state => state.auth.messages);
    const broker_user_messages = useSelector(state => state.auth.userBrokerMessages);
    const unread_messages = useSelector(state => state.auth.unreadMessages);
    useEffect(() => {
        !messages.length && dispatch(getUserMessages(user.id));
    }, [dispatch, user.id, messages.length])
    const userBrokerMessages = (user_id, broker_id,class_name) => {
        setText('');
        dispatch(getUserBrokerMessages(user_id, broker_id,class_name,1))
        document.getElementsByClassName(class_name)[0].scrollTop = 200;
    }
    const [text, setText] = useState();
    const messageTaxt = (e) => {
        setText(e.target.value)
    }
    const sendMessage = (user_id, broker_id, class_name) => {
        let div_my_message = document.createElement('div')
        div_my_message.className = "message my-message"
        let image = document.createElement('img')
        image.className = "img-circle medium-image"
        image.src = user.avatar ? apiUrl + 'storage/uploads/users/' + user.avatar : default_avatar
        let div_message_body = document.createElement('div')
        div_message_body.className = "message-body"
        div_message_body.style = "height: \"auto\""
        let div_message_body_inner = document.createElement('div')
        div_message_body_inner.className = "message-body-inner"
        let div_message_info = document.createElement('div')
        div_message_info.className = "message-info"
        let h4 = document.createElement('h4')
        let hr = document.createElement('hr')
        let br = document.createElement('br')
        let div_message_text = document.createElement('div')
        div_message_text.className = "message-text"
        div_message_text.textContent = text
        h4.innerText = user.first_name + ' ' + user.last_name
        div_my_message.appendChild(image)
        div_message_info.appendChild(h4)
        div_message_body_inner.appendChild(div_message_info)
        div_message_body_inner.appendChild(hr)
        div_message_body_inner.appendChild(div_message_text)
        div_message_body.appendChild(div_message_body_inner)
        div_my_message.appendChild(div_message_body)
        div_my_message.appendChild(br)
        document.getElementById("my-message-" + broker_id).appendChild(div_my_message)
        document.getElementById('message-text-' + broker_id).value = ''
        dispatch(sendContactAgent(text, broker_id, user_id))
        setText('')
        document.getElementsByClassName(class_name)[0].scrollTop += 100;
    }
    const hasNewMessage = (broker_id) => {
        for (const value of unread_messages) {
            if (broker_id === value.broker_id) {
                return true;
            }
        }
        return false;
    }
    const currentMessagePage = useSelector(state => state.auth.currentMessagePage)
    const scrollFunction = async (user_id, broker_id, class_name) => {
        if (document.getElementsByClassName(class_name)[0] && document.getElementsByClassName(class_name)[0].scrollTop === 0) {
            dispatch(getUserBrokerMessages(user_id, broker_id,class_name,currentMessagePage,0));
        }
    }
    const messageSpinner = useSelector(state => state.profile.messageSpinner)

    return <div className="favorites-page-wrap">
        {messageSpinner ?
            <div className="spinner_content">
                <div className="sweet-loading">
                    <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                </div>
            </div>
            :
        <div className="container">
            {messages.length ? <div className="row">
                    <div className="col-4">
                        <div className="single-explore">
                            <div className="profile">
                                <div className="details readeal-top">
                                    <ul className="nav nav-tabs rld-banner-tab" style={{borderBottomWidth: 0}}>
                                        {messages.map((value, key) => {
                                            return (key === 0 || messages[key].broker_id !== messages[key - 1].broker_id) ?
                                                <li className="message-tab" key={key}>
                                                    <a className={"nav-link activeTab"}
                                                       data-toggle="tab"
                                                       href={'#message-' + value.id}
                                                       onClick={() => userBrokerMessages(value.user_id, value.broker_id,value.broker.email)}
                                                    >
                                                        {hasNewMessage(value.broker_id) &&
                                                        <div className='red-point'/>
                                                        }
                                                        {value.broker && value.broker.first_name} {value.broker && value.broker.last_name}
                                                    </a>
                                                </li>
                                                : null
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 messages-chat-body">
                        <div className="tab-content">
                            {messages.map((value, key) => {
                                return (key === 0 || messages[key].broker_id !== messages[key - 1].broker_id) ?
                                    <div className={"tab-pane fade show message-body"} id={'message-' + value.id} key={key}>
                                            <div className={"chat-body messages-scroll-css " + value.broker.email} id={"my-message-" + value.broker_id} onScroll={()=>scrollFunction(value.user_id, value.broker_id,value.broker.email)}>
                                                {broker_user_messages.map((message, key) => {
                                                    return broker_user_messages[broker_user_messages.length - 1 - key].write_broker ? <div className="message info" key={key}>
                                                            <img alt="" className="img-circle medium-image"
                                                                 src={apiUrl + 'storage/uploads/users/' + broker_user_messages[broker_user_messages.length - 1 - key].broker.avatar}/>
                                                            <div className="message-body" style={{height: "auto"}}>
                                                                <div className="message-info">
                                                                    <h4> {broker_user_messages[broker_user_messages.length - 1 - key].broker.first_name} {broker_user_messages[broker_user_messages.length - 1 - key].broker.last_name} </h4>
                                                                </div>
                                                                <hr/>
                                                                <div className="message-text">
                                                                    {broker_user_messages[broker_user_messages.length - 1 - key].message}
                                                                </div>
                                                            </div>
                                                            <br/>
                                                        </div>
                                                        :
                                                        <div className="message my-message" key={key}>
                                                            <img alt="" className="img-circle medium-image"
                                                                 src={user && user.avatar ? apiUrl + 'storage/uploads/users/' + user.avatar : default_avatar}/>
                                                            <div className="message-body" style={{height: "auto"}}>
                                                                <div className="message-body-inner">
                                                                    <div className="message-info">
                                                                        <h4>{user.first_name} {user.last_name}</h4>
                                                                    </div>
                                                                    <hr/>
                                                                    <div className="message-text">
                                                                        {broker_user_messages[broker_user_messages.length - 1 - key].message}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <br/>
                                                        </div>
                                                })}
                                            </div>
                                        <div className="chat-footer">
                                    <textarea onChange={(e) => messageTaxt(e)}
                                              className="send-message-text" id={"message-text-" + value.broker_id}/>
                                            <button type="button" className="send-message-button btn-info"
                                                    onClick={() => sendMessage(value.user_id, value.broker_id,value.broker.email)}>
                                                <i className="fa fa-send"></i></button>
                                        </div>
                                    </div>
                                    : null
                            })}
                        </div>
                    </div>
                </div> :
                <div className="col-12 text-center mt-3">
                    <h3>{t('no_messages')}</h3>
                </div>}
        </div>}
    </div>
}
export default Message

