import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Pagination from "./pagination";
import Moment from 'moment';
import {allNotifications, readAllNotifications, readNotifications} from "../../actions/notifications";

const NotificationsList = (props) => {
    const dispatch = useDispatch();
    const {t} = props;
    useEffect(() => {
        async function getData() {
            await dispatch(allNotifications(1))
        }
        getData();
    }, [dispatch])
    const getPage = async (page) => {
        await dispatch(allNotifications(page))
    }
    const [show, setShow] = useState(0);
    let response = useSelector(state => state.notifications.all_notifications)
    const onRead = (id,status) => {
        setShow(id);
        if (!Number(status)){
            dispatch(readNotifications(id))
            document.getElementById('icon-' + id).className = "fa fa-envelope-open";
            document.getElementById('notification-' + id).className = "mb-0 accordion-title";
        }
    };
    const readAll = () => {
         dispatch(readAllNotifications())
    }
    return <div className="py-5 container">
            <div className="row py-lg-5">
                <div className="col-xl-12 col-lg-12 col-md-12">
                    <div className="row">
                        <div className="accordion notifications-accordion" id="notifications-list">
                            <div className={"notification-mark_all_as_read"}>
                                <u onClick={()=>readAll()} className={"notification-text-of-mark_all_as_read"}>{t('mark_all_as_read')}</u>
                            </div>
                            {response.data && response.data.length ?  response.data.map((item, i) =>
                                    <div key={i} className="card">
                                        <div className="card-header" id={'heading_'+item.id} onClick={() => {onRead(item.id,item.status)}} >
                                            <h5 id={"notification-" + item.id} className={item.status === "1" ? "mb-0 accordion-title" : "mb-0 accordion-title unread_notification"} >
                                                    {item.title}
                                                <i id = {'icon-' + item.id} className={item.status === "1" ? "fa fa-envelope-open" : "fa fa-envelope"}/>
                                            </h5>
                                            <span>{Moment(item.created_at).format('DD-MM-YYYY')}</span>
                                        </div>
                                        <div id={'collapse_'+item.id} className={show === item.id ? "collapse show" : "collapse"} aria-labelledby={'heading_'+item.id} data-parent="#notifications-list">
                                            <div className="card-body">
                                                {item.text}
                                            </div>
                                        </div>
                                    </div>
                            ) : <div className="col-12 text-center mt-3">
                                    <h3>{t('no_result')}</h3>
                                </div>}
                        </div>
                    </div>
                </div>
                {response.last_page && response.last_page > 1 ?
                    <Pagination data2={response} getPage={getPage}/>
                    : ""}
            </div>
    </div>
}

export default NotificationsList
