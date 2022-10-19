import React, {useEffect} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import {
    de_archiving_announcement,
    delete_announcement,
    get_user_archived_announcements
} from "../../actions/announcement";
import {Table} from "reactstrap";
import {confirmAlert} from "react-confirm-alert";
import Pagination from "./pagination";
import {useHistory} from "react-router-dom";

const ArchivesListing = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = props;
    const user = useSelector(state => state.auth.currentUser);
    const archivedAnnouncements = useSelector(state => state.announcement.archivedAnnouncements)
    useEffect(() => {
        if(user.id){
            dispatch(get_user_archived_announcements(user.id))
        }
    }, [dispatch,user.id])
    const archivedSpinner = useSelector(state => state.profile.archivedSpinner)
    const getPageRentAnnouncement = (page) => {
        dispatch(get_user_archived_announcements(user.id,page));
    }
    const deleteAnnouncements = (id) => {
        dispatch(delete_announcement(id));
    }
    const deArchiving = (id) => {
        dispatch(de_archiving_announcement(user.id,id));
    }
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
                        <th></th>
                        <th>{t('price')}</th>
                        <th>{t('role')}</th>
                        <th>{t('created_date')}</th>
                        <th>{t('status')}</th>
                        <th className="actionButtons"/>
                    </tr>
                </thead>
                <tbody style={{padding: '2%'}}>
                    {archivedAnnouncements.data && archivedAnnouncements.data.map((item, key) => {
                        return (
                            <tr key={key}>
                                <td><img className="user-activity-img" src={apiUrl + 'storage/uploads/announcements/' + item.main_image} alt="..."/> </td>
                                <td>{item.currency && item.currency.name} {item.price}</td>
                                <td>
                                    <span className='forSale'>
                                        <li className="point">
                                            <span style={{color: '#011728'}}>
                                                {item.category.translations.map((value, i) => {
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
                                    <span className="verifyStatusPending">Archived</span>
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
                                        <button className="editDeleteButtons" onClick={() => {
                                            deArchiving(item.id);
                                        }}>
                                            <i className="editDeleteIcons fa fa-xs fa-arrow-circle-o-up"
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
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>}
        {archivedAnnouncements.last_page && archivedAnnouncements.last_page > 1 ?
            <Pagination data2={archivedAnnouncements} getPage={getPageRentAnnouncement}/>
            : ""}
    </div>
}
export default ArchivesListing

