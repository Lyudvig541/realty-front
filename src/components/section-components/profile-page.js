import React, {useEffect, useState} from 'react';
import {Table} from "reactstrap";
import {
    add_archive,
    changeRentAnnouncementDatePicker, completed_announcement,
    delete_announcement,
    get_user_announcements,
    get_user_renting_announcements,
    renew_announcement
} from "../../actions/announcement";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import FavoritesGrid from "../../components/section-components/favorites-grid";
import Message from "../../components/section-components/message";
import UnverifiedListing from "../../components/section-components/unverified-listing";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {edit_user, edit_user_image} from "../../actions/request";
import ImageUploading from "react-images-uploading";
import {PulseLoader} from "react-spinners";
import DatePicker from "react-datepicker";
import Pagination from "./pagination";
import NumberFormat from "react-number-format";
import ArchivesListing from "./archived-listing";
import OffersAndClosings from "./offers-and-closings";

const ProfilePage = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const default_avatar = publicUrl + "/assets/img/author/default_avatar.png";
    const default_image = publicUrl + "/assets/img/default.png";
    const {t} = props;
    const location = useLocation()
    const active = location.state?.key
    const dispatch = useDispatch();
    const history = useHistory();
    const announcements = useSelector(state => state.announcement.myAnnouncements)
    const rentAnnouncements = useSelector(state => state.announcement.myRentAnnouncements)
    const user = useSelector(state => state.auth.currentUser);
    const [editProfile, setEditProfile] = useState(false);
    const errors = useSelector(state => state.profile.errors);
    useEffect(() => {
        const getData = async () => {
            if (!announcements.length) {
                dispatch(get_user_announcements(user.id));
            }
            if (!rentAnnouncements.length) {
                dispatch(get_user_renting_announcements(user.id))
            }
        }
        getData();
    }, [dispatch, user.id, announcements.length, rentAnnouncements.length])
    const deleteAnnouncements = (id) => {
        dispatch(delete_announcement(id));
    }
    const user_avatar = user && user.avatar ? (apiUrl + 'storage/uploads/users/' + user.avatar) : default_avatar
    const [newUserData, setNewUserData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        old_password: "",
        password_confirmation: "",
    });
    const setValues = () => {
        setEditProfile(true);
        setNewUserData({
            ...newUserData,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
        });
    }
    const handleEditProfile = () => {
        dispatch(edit_user({
            first_name: newUserData.first_name,
            last_name: newUserData.last_name,
            email: newUserData.email,
            old_password: newUserData.old_password,
            password: newUserData.password,
            password_confirmation: newUserData.password_confirmation,
        }, user.id));
    }
    const onChangeAvatar = (image) => {
        dispatch(edit_user_image(image,user.id));
    }
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const listingSpinner = useSelector(state => state.profile.listingSpinner)
    const rentSpinner = useSelector(state => state.profile.rentListingSpinner)
    const [editDatePicker,setEditDatePicker] = useState();
    const openDatePicker = (id)=>{
        setDateRange([null,null])
        setEditDatePicker(id)
    }
    const saveDatePicker = (id)=>{
        if (dateRange[0]){
            dispatch(changeRentAnnouncementDatePicker(id,dateRange))
            setEditDatePicker(0)
        }else{
            setEditDatePicker(0)
        }
    }
    const getPageRentAnnouncement = (page) => {
        dispatch(get_user_renting_announcements(user.id,page));
    }
    const getPageAnnouncement = (page) => {
        dispatch(get_user_announcements(user.id,page));
    }
    const archived = (id, type) => {
        dispatch(add_archive(id, user.id, type));
    }
    const completed = (id, type) => {
        dispatch(completed_announcement(id, user.id, type));
    }

    const renew = (id, type) => {
        dispatch(renew_announcement(id, user.id, type));
    }


    return <div className="profile-area">
        <div className="pd-top-100 pd-bottom-90">
            <div className="container tablet-cont">
                <div className="row prof-cont">
                    <div className="col-md-3 col-lg-3 col-sm-3 single-explore-cont">
                        <div className="single-explore">
                            <div className="profile">
                                <div className="details readeal-top">
                                    <ul className="nav nav-tabs rld-banner-tab" style={{borderBottomWidth: 0}}>
                                        <li className="profileTabLi">
                                            <a className={"nav-link activeTab " + (active === 1 ? "active" : "")} data-toggle="tab" href="#profile">
                                                {t('profile')}
                                            </a>
                                        </li>
                                        <li className="profileTabLi">
                                            <a className={"nav-link activeTab " + (active === 2 ? "active" : "")} data-toggle="tab" href="#my_announcements">
                                                {t('my_announcements')}
                                            </a>
                                        </li>
                                        <li className="profileTabLi">
                                            <a className={"nav-link activeTab " + (active === 3 ? "active" : "")} data-toggle="tab" href="#favorites">
                                                {t('favorites')}
                                            </a>
                                        </li>
                                        <li className="profileTabLi">
                                            <a className={"nav-link activeTab " + (active === 4 ? "active" : "")} data-toggle="tab" href="#messages">
                                                {t('messages')}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 col-lg-9 col-sm-9 tab-content-cont">
                        <div className="tab-content">
                            <div className={"tab-pane fade show " + (active === 1 ? "active" : "")} id="profile">
                                <div className="details">
                                    <div className="profile-tab position-relative" >
                                        <div className="container">
                                            <div className="tab-header-container" style={{padding: '3%',}}>
                                                <div className="">
                                                    <h4 className="contact-name">{t('personal_information')}</h4>
                                                </div>
                                                <div className="">
                                                    <button className="editProfile" onClick={setValues}>{t('edit_profile')}</button>
                                                </div>
                                            </div>
                                            <div className="profile-info-container">
                                                <div className=" ">
                                                    <div className="profile-image">
                                                        <div className="bankImg text-center">
                                                            <img src={user_avatar} alt={'logo'} style={{borderRadius: "50%"}}/>
                                                            <div className="feature-logo-2">
                                                                <ImageUploading  maxFileSize="25000000" value={user_avatar} onChange={onChangeAvatar} dataURLKey="data_url">
                                                                    {({onImageUpdate}) => (
                                                                        <div className="upload__image-wrapper">
                                                                            <i onClick={() => onImageUpdate(0)} className="fa fa-pencil" aria-hidden="true"/>
                                                                        </div>)}
                                                                </ImageUploading>
                                                            </div>
                                                        </div>
                                                        <div className="text-center pd-bottom-40 pd-top-20">
                                                            <h4 className="contact-name">
                                                                {user.first_name} {user.last_name}
                                                            </h4>
                                                            <h5 className="contact-placeholder user-id">ID - {user.id}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" ">
                                                    <div className="vertical-grey-line"/>
                                                </div>
                                                <div className=" contact-information text-left">
                                                    <h4 className="contact-title">{t('contact_information')}</h4>
                                                    <br/>
                                                    <h5 className="contact-placeholder">{t("email")}</h5>
                                                    <h5 className="contact-text">{user.email}</h5>
                                                    <br/>
                                                    <h5 className="contact-placeholder">{t('phone_number')}</h5>
                                                    <h5 className="contact-text">{user.phone}</h5>
                                                    <br/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" pd-top-40" style={{display: editProfile ? "block" : "none"}}>
                                        <div className="profile-tab">
                                            <div className="container">
                                                <div className="row" style={{padding: '3% 2.5% 1% 3%',}}>
                                                    <div className="col-md-9 col-xl-9 col-sm-9">
                                                        <h4 className="contact-name">{t('edit_profile')}</h4>
                                                    </div>
                                                    <div className="col-md-3 col-xl-3 col-sm-3 text-right">
                                                        <button onClick={() => setEditProfile(false)} style={{background: 'transparent'}}>
                                                            <i className="fa fa-times" aria-hidden="true"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grey-line-full"/>
                                            <div className="container">
                                                <div className="row" style={{padding: '3% 0% 1% 3%',}}>
                                                    <div className="col-md-9 col-xl-9 col-sm-9">
                                                        <h4 className="contact-name">{t('personal_information')}</h4>
                                                    </div>
                                                </div>
                                                <div className="row" style={{padding: '3% 0% 1% 3%',}}>
                                                    <div className="col-md-4 col-xl-4 col-sm-4">
                                                        <div className="form-group">
                                                            <label htmlFor="name">{t("name")}</label>
                                                            <input type="text" name="first_name"
                                                                   className="form-control"
                                                                   value={newUserData.first_name|| " "}
                                                                   onChange={(event) => {
                                                                       setNewUserData({
                                                                           ...newUserData,
                                                                           [event.target.name]: event.target.value
                                                                       })
                                                                   }} id="first_name"/>
                                                            <label className="error-message">{errors["data.first_name"] && t(errors["data.first_name"])}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-xl-4 col-sm-4">
                                                        <div className="form-group">
                                                            <label htmlFor="surname">{t("surname")}</label>
                                                            <input type="text" name="last_name" className="form-control"
                                                                   value={newUserData.last_name|| " "}
                                                                   onChange={(event) => {
                                                                       setNewUserData({
                                                                           ...newUserData,
                                                                           [event.target.name]: event.target.value
                                                                       })
                                                                   }}
                                                                   id="last_name"/>
                                                            <label className="error-message">{errors["data.last_name"] && t('require')}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row" style={{padding: '3% 0% 1% 3%',}}>
                                                    <div className="col-md-9 col-xl-9 col-sm-9">
                                                        <h4 className="contact-name">{t('sign_in_security')}</h4>
                                                    </div>
                                                </div>
                                                <div className="row" style={{padding: '3% 0% 1% 3%',}}>
                                                    <div className="col-md-4 col-xl-4 col-sm-4">
                                                        <div className="form-group">
                                                            <label htmlFor="email">{t('email')}</label>
                                                            <input type="text" name="email"
                                                                   value={newUserData.email|| ""} className="form-control"
                                                                   id="email"
                                                                   onChange={(event) => {
                                                                       setNewUserData({
                                                                           ...newUserData,
                                                                           [event.target.name]: event.target.value
                                                                       })
                                                                   }}/>
                                                            <label className="error-message">{errors["data.email"] && t(errors["data.email"][0])}</label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="password">{t('password')}</label><br/>
                                                            <input type="password" name="old_password" className="form-control"
                                                                   onChange={(event) => {
                                                                       setNewUserData({
                                                                           ...newUserData,
                                                                           [event.target.name]: event.target.value
                                                                       })}} id="old_password"/>
                                                            <label><span className={'password_info'}> {t('password_required')}</span></label>
                                                            <label className="error-message">{errors["data.old_password"] && t('password_required')}</label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="password_confirmation">{t('confirm_password')}</label>
                                                            <input type="password" name="password_confirmation"
                                                                   className="form-control"
                                                                   onChange={(event) =>setNewUserData({
                                                                       ...newUserData,
                                                                       [event.target.name]: event.target.value})} id="password_confirmation"/>
                                                            <label className="error-message">{errors["data.password_confirmation"] && t(errors["data.password_confirmation"][0])}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-xl-4 col-sm-4">
                                                        <div className="form-group">
                                                            <label htmlFor="phone">{t('phone_number')}</label>
                                                            <input type="tel" name="phone" value={user.phone || " "} className="form-control" id="phone" disabled/>
                                                            <label className="error-message">{errors["data.phone"] && t('require')}</label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="new_password">{t('new_password')}</label>
                                                            <input type="password" name="password" className="form-control"
                                                                   onChange={(event) =>setNewUserData({
                                                                       ...newUserData,
                                                                       [event.target.name]: event.target.value})} id="new_password"/>
                                                            <label><span className={'password_info'}> {t('password_info')}</span></label>
                                                            <label className="error-message">{errors["data.password"] && t(errors["data.password"][0])}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8 col-xl-8 col-sm-8">
                                                        <div className="form-group">
                                                            <label htmlFor="submit"> &nbsp;&nbsp; </label>
                                                            <button onClick={() => handleEditProfile()} style={{width: '100%'}} className="btn btn-main-color" id="submit">{t('update')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"tab-pane fade show " + (active === 2 ? "active" : "")} id="my_announcements">
                                <div className="details">
                                    <div className="broker-tab-container">
                                        <ul className="nav history-type" >
                                            <li className="nav-item">
                                                <button className="nav-link active active_my_announcement_tab" data-toggle="tab" href="#your_property">
                                                    <div className="border-bottom-line">{t('your_property')}</div>
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link active_my_announcement_tab" data-toggle="tab" href="#rentings">
                                                    <div className="border-bottom-line">{t('rentings')}</div>
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link active_unverified_announcement_tab" data-toggle="tab" href="#unverified_announcements">
                                                    <div className="border-bottom-line">{t('unverified_announcements')}</div>
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link active_unverified_announcement_tab" data-toggle="tab" href="#archived_announcements">
                                                    <div className="border-bottom-line">{t('archived_announcements')}</div>
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link active_unverified_announcement_tab" data-toggle="tab" href="#offers_and_closings">
                                                    <div className="border-bottom-line">{t('offers_and_closings')}</div>
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="tab-content mg-top-10">
                                            {listingSpinner ?
                                                <div className="spinner_content">
                                                    <div className="sweet-loading">
                                                        <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                                                    </div>
                                                </div>
                                                :
                                            <div className="tab-pane fade show active" id="your_property">
                                                <Table className={'profile-history-table'}>
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
                                                    {announcements.data && announcements.data.map((item, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>
                                                                    <img className="user-activity-img" src={item.main_image ? apiUrl + 'storage/uploads/announcements/' + item.main_image : default_image} alt="..."/>
                                                                </td>
                                                                <td><NumberFormat value={item.price} displayType={'text'} thousandSeparator={true}
                                                                                  prefix={item.currency && item.currency.local === 'en' ? item.currency.name+' ' : ''}
                                                                                  suffix={item.currency && item.currency.local !== 'en' ? ' '+item.currency.name : ''} /></td>
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
                                                                    {item.verify ?
                                                                        <span className="verifyStatusActive">Active</span> :
                                                                        <span className="verifyStatusPending">Pending</span>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div className="button-group">
                                                                        <button onClick={() => {history.push(`/edit-property/${item.id}`);}} className="editDeleteButtons" title={t('edit')}>
                                                                            <i className="editDeleteIcons fa fa-xs fa-pencil" aria-hidden="true"/>
                                                                        </button>
                                                                        <span>  </span>
                                                                        <button onClick={() => {archived(item.id,'my_announcements')}} className="editDeleteButtons" title={t('archive')}>
                                                                            <i className="editDeleteIcons fa fa-xs fa-archive" aria-hidden="true"/>
                                                                        </button>
                                                                        <span>  </span>
                                                                        <button onClick={() => {completed(item.id, "my_announcements")}} className="editDeleteButtons" title={t('complete')}>
                                                                            <i className="editDeleteIcons fa fa-xs fa-check" aria-hidden="true"/>
                                                                        </button>
                                                                        <span>  </span>
                                                                        <button onClick={() => {renew(item.id,'my_announcements')}} className="editDeleteButtons" title={t('renew')}>
                                                                            <i className="editDeleteIcons fa fa-xs fa-arrow-up" aria-hidden="true"/>
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
                                                                                            <button className="active"
                                                                                                    onClick={onClose}>
                                                                                                {t('no')}
                                                                                            </button>

                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            });
                                                                        }}>
                                                                            <i className="editDeleteIcons fa fa-xs fa-trash" aria-hidden="true"/>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    </tbody>
                                                </Table>
                                                {announcements.last_page && announcements.last_page > 1 ?
                                                    <Pagination data2={announcements} getPage={getPageAnnouncement}/>
                                                    : ""}
                                            </div>}
                                            <div style={{border: 0}} className="tab-pane fade show" id="rentings">
                                                {rentSpinner ?
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
                                                        <th>{t('busy_date')}</th>
                                                        <th className="actionButtons"/>
                                                    </tr>
                                                    </thead>
                                                    <tbody style={{padding: '2%'}}>
                                                    {rentAnnouncements.data && rentAnnouncements.data.map((item, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>
                                                                    <img className="user-activity-img" src={apiUrl + 'storage/uploads/announcements/' + item.main_image} alt="..."/>
                                                                </td>
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
                                                                    <div>
                                                                        {
                                                                            editDatePicker === item.id
                                                                                ?
                                                                                <div className="row">
                                                                                    <div className="col-md-6 col-lg-8 col-xl-8">
                                                                                        <DatePicker
                                                                                            key={item.id}
                                                                                            selectsRange={true}
                                                                                            startDate={startDate || (item.start_date && new Date(item.start_date)) }
                                                                                            endDate={endDate || (!startDate && item.end_date && new Date(item.end_date))}
                                                                                            onChange={(update) => {
                                                                                                setDateRange(update);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-md-6 col-lg-4 col-xl-4">
                                                                                        <button className="editDeleteButtons" onClick={()=>{saveDatePicker(item.id)}}>
                                                                                            <i className="editDeleteIcons fa fa-xs fa-check-circle-o" aria-hidden="true"/>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                :
                                                                                <div className="row">
                                                                                    <div className="col-md-6 col-lg-8 col-xl-8">
                                                                                        <span>
                                                                                            {item.start_date && item.end_date ?
                                                                                                (new Date(item.start_date).getMonth() + 1 ) + '/' +
                                                                                                new Date(item.start_date).getDate() + '/' +
                                                                                                new Date(item.start_date).getFullYear()
                                                                                                + ' - ' +
                                                                                                (new Date(item.end_date).getMonth() + 1) + '/' +
                                                                                                new Date(item.end_date).getDate() + '/' +
                                                                                                new Date(item.end_date).getFullYear() :
                                                                                            'DD/MM/YYYY - DD/MM/YYYY'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="col-md-6 col-lg-4 col-xl-4">
                                                                                        <button className="editDeleteButtons" onClick={()=>{openDatePicker(item.id)}}>
                                                                                            <i className="editDeleteIcons fa fa-xs fa-calendar-check-o" aria-hidden="true"/>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                        }
                                                                    </div>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div className="button-group">
                                                                        <button onClick={() => {history.push(`/edit-property/${item.id}`);}} className="editDeleteButtons">
                                                                            <i className="editDeleteIcons fa fa-xs fa-pencil" aria-hidden="true"/>
                                                                        </button>
                                                                        <span>  </span>
                                                                        <button onClick={() => {archived(item.id,'rent_announcements')}} className="editDeleteButtons" title={t('archive')}>
                                                                            <i className="editDeleteIcons fa fa-xs fa-archive" aria-hidden="true"/>
                                                                        </button>
                                                                        <span>  </span>
                                                                        <button onClick={() => {completed(item.id, "rent_announcements")}} className="editDeleteButtons" title={t('complete')}>
                                                                            <i className="editDeleteIcons fa fa-xs fa-check" aria-hidden="true"/>
                                                                        </button>
                                                                        <button onClick={() => {
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
                                                                        }}
                                                                                type="submit" className="editDeleteButtons">
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
                                                {rentAnnouncements.last_page && rentAnnouncements.last_page > 1 ?
                                                    <Pagination data2={rentAnnouncements} getPage={getPageRentAnnouncement}/>
                                                    : ""}
                                            </div>
                                            <div style={{border: 0}} className="tab-pane fade show" id="unverified_announcements">
                                                <UnverifiedListing t={t}/>
                                            </div>
                                            <div className="tab-pane fade show" id="archived_announcements">
                                                <ArchivesListing t={t}/>
                                            </div>
                                            <div className="tab-pane fade show" id="offers_and_closings">
                                                <OffersAndClosings t={t}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"tab-pane fade show " + (active === 3 ? "active" : "")} id="favorites">
                                <FavoritesGrid t={t}/>
                            </div>
                            <div className={"tab-pane fade show " + (active === 4 ? "active" : "")} id="messages">
                                <Message t={t}/>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade show active" id="profile">
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default ProfilePage
