import React, {useEffect, useState} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import {
    delete_announcement,
    offers_and_closings
} from "../../actions/announcement";
import {Alert, Modal, ModalBody, ModalHeader, Table} from "reactstrap";
import {confirmAlert} from "react-confirm-alert";
import Pagination from "./pagination";
import {useHistory} from "react-router-dom";
import {setBrokerModal} from "../../reducers/modalsReducer";
import {agent} from "../../actions/resources";
import {reviewAgent} from "../../actions/request";
import {brokerReviewSuccess} from "../../reducers/requestReducer";
import {user_comments} from "../../actions/auth";
import ReactStars from "react-rating-stars-component";

const ArchivesListing = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = props;
    const currentUser = useSelector(state => state.auth.currentUser);
    const modal = useSelector(state => state.modals.brokerModal);
    const broker = useSelector(state => state.agent.agent);
    const offersAndClosings = useSelector(state => state.announcement.offersAndClosings);
    const userComments = useSelector(state => state.modals.userComments);
    const send_request = useSelector(state => state.request.broker_review_success);
    const [contactText, setContactText] = useState();
    const [rateBroker, setRateBroker] = useState();
    useEffect(() => {
        if (currentUser.id) {
            dispatch(offers_and_closings(currentUser.id))
            dispatch(user_comments(currentUser.id))
        }
    }, [dispatch, currentUser.id])
    const archivedSpinner = useSelector(state => state.profile.archivedSpinner)
    const getPageRentAnnouncement = (page) => {
        dispatch(offers_and_closings(currentUser.id, page));
    }
    const deleteAnnouncements = (id) => {
        dispatch(delete_announcement(id));
    }
    const review = (id) => {
        dispatch(agent(id));
        dispatch(setBrokerModal('review'));
    }
    const handleContactAgent = (agent_id) => {
        dispatch(reviewAgent(contactText, agent_id, currentUser.id, rateBroker));
        dispatch(brokerReviewSuccess(false));
    }
    const alreadyCommented = (broker_id) => {
        let i = 0;
        userComments.map(value => {
            if(value.broker_id === broker_id) {
                i++;
                return true;
            }
            return false;
        })
        return !i;
    }
    const ratingChanged = (newRating) => {
        setRateBroker(newRating);
    };
    return <div className="favorites-page-wrap">
        {archivedSpinner ?
            <div className="spinner_content">
                <div className="sweet-loading">
                    <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                </div>
            </div>
            :
            <Table>
                <thead>
                <tr className="broker-tab">
                    <th/>
                    <th>{t('price')}</th>
                    <th>{t('role')}</th>
                    <th>{t('created_date')}</th>
                    <th>{t('status')}</th>
                    <th className="actionButtons"/>
                </tr>
                </thead>
                <tbody style={{padding: '2%'}}>
                {offersAndClosings.data && offersAndClosings.data.map((item, key) => {
                    return (
                        <tr key={key}>
                            <td><img className="user-activity-img"
                                     src={apiUrl + 'storage/uploads/announcements/' + item.main_image} alt="..."/></td>
                            <td>{item.currency && item.currency.name} {item.price}</td>
                            <td>
                                    <span className='forSale'>
                                        <li className="point">
                                            <span style={{color: '#011728'}}>
                                                {item.category.translations.map((value) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                })}
                                            </span>
                                        </li>
                                    </span>
                            </td>
                            <td>{
                                new Date(item.created_at).getDate() + '-' +
                                new Date(item.created_at).getMonth() + '-' +
                                new Date(item.created_at).getFullYear()
                            }</td>
                            <td>
                                <span className="verifyStatusPending">Completed</span>
                            </td>
                            <td>
                                <div className={"button-group"}>
                                    <button className="editDeleteButtons" onClick={() => {
                                        history.push(`/edit-property/${item.id}`);
                                    }}>
                                        <i className="editDeleteIcons fa fa-xs fa-pencil"
                                           aria-hidden="true"/>
                                    </button>
                                    <span>  </span>
                                    <button type="submit" className="editDeleteButtons" onClick={() => {
                                        confirmAlert({
                                            customUI: ({onClose}) => {
                                                return (
                                                    <div className='property-filter-menu buttons'>
                                                        <h1>{t('are_you_sure')}</h1>
                                                        <p>{t('you_want_to_delete')}</p>
                                                        <button className="active"
                                                                onClick={() => {
                                                                    deleteAnnouncements(item.id)
                                                                    onClose();
                                                                }}
                                                        >
                                                            {t('yes')}
                                                        </button>
                                                        <button className="active" onClick={onClose}>
                                                            {t('no')}
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        });
                                    }}>
                                        <i className="editDeleteIcons fa fa-xs fa-trash"
                                           aria-hidden="true"/>
                                    </button>
                                    <span>  </span>
                                    {item.broker_id && alreadyCommented(item.broker_id) && <button id={'eye-' + item.broker_id} className="editDeleteButtons" onClick={() => {
                                        review(item.broker_id);
                                    }}>
                                        <i className="editDeleteIcons fa fa-xs fa-eye" aria-hidden="true"/>
                                    </button>
                                    }
                                </div>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>}
        {offersAndClosings.last_page && offersAndClosings.last_page > 1 ? <Pagination data2={offersAndClosings} getPage={getPageRentAnnouncement}/> : ""}
        <Modal className="request_modal" isOpen={modal === "review"}>
            <ModalHeader toggle={() => {
                dispatch(setBrokerModal(''));
                dispatch(brokerReviewSuccess(false));
            }}/>
            <ModalBody>
                <div className="brokerContact-container">
                    <div className="brokerContact">
                        <div className={'brokerContact-container'}>
                            <div className="brokerContact-container-info">
                                <div className="brokerContact-img">
                                    <img width="90px" height="90px" src={broker.avatar ? apiUrl + 'storage/uploads/users/' + broker.avatar : publicUrl + "/assets/img/author/default_avatar.png"} alt="userImg"/>
                                </div>
                                <div className="brokerContact-info">
                                    <div>{broker.first_name} {broker.last_name}</div>
                                    <div>{broker.email}</div>
                                    <a href={`tel:${broker.phone}`}
                                       className="broker-tel-btn btn btn-success mt-3 mb-2">
                                        <i className="fa fa-xs fa-phone mr-2" aria-hidden="true"/>
                                        {broker.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                        {send_request
                            ?
                            <Alert color="info" className="col-xl-12 col-lg-12 col-md-12">
                                {t('message_sending')}
                            </Alert>
                            :
                            <div className="rld-single-input">
                                <div className={"rate_broker_div"}>
                                    <label className={"rate_broker"}>{t('rate_the_agent')}</label>
                                    <ReactStars
                                        value={0}
                                        count={5}
                                        size={24}
                                        activeColor="#FAA61A"
                                        emptyIcon={<i className="far fa-star"/>}
                                        halfIcon={<i className="fa fa-star-half-alt"/>}
                                        fullIcon={<i className="fa fa-star"/>}
                                        isHalf={true}
                                        edit={true}
                                        onChange={ratingChanged}
                                        classNames={"rate_broker_star"}
                                    />
                                </div>
                                <div className="sq-single-select mg-top-10">
                                    <textarea style={{width: '100%', height: 80, padding: 10}} placeholder={t('request_description')} name="description" onChange={(event) => setContactText(event.target.value)}/>
                                </div>
                                <div className="property-filter-menu mg-top-10 text-center">
                                    <button className="active" onClick={() => handleContactAgent(broker.id)}>{t('send')}</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}
export default ArchivesListing

