import React, {useEffect} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import {
    currencies,
    delete_announcement,
    get_user_unverified_announcements
} from "../../actions/announcement";
import {Table} from "reactstrap";
import {confirmAlert} from "react-confirm-alert";
import Pagination from "./pagination";
import {useHistory} from "react-router-dom";
import NumberFormat from "react-number-format";

const UnverifiedListing = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const default_image = publicUrl + "/assets/img/default.png";
    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = props;
    const user = useSelector(state => state.auth.currentUser);
    const unverifiedAnnouncements = useSelector(state => state.announcement.unverifiedAnnouncements)
    const allCurrenies = useSelector(state => state.announcement.currencies);

    useEffect(() => {
        dispatch(currencies());
        if(user.id){
            dispatch(get_user_unverified_announcements(user.id))
        }
    }, [dispatch,user.id])
    const unverifiedSpinner = useSelector(state => state.profile.unverifiedSpinner)
    const getPageRentAnnouncement = (page) => {
        dispatch(get_user_unverified_announcements(user.id,page));
    }
    const deleteAnnouncements = (id) => {
        dispatch(delete_announcement(id));
    }

    const priceFormat = (item) =>{
        let price;
        item.currency && allCurrenies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.id === item.currency.id){
                    return price = item.price;
                }else{
                    return price = Math.floor((item.price * item.currency.value) / value.value)
                }
            }
            return null;
        })
        return price;
    }

    const currencyFormat = (item) =>{
        let currency = ' ';
        item.currency && allCurrenies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.local !== "en")
                   return currency = value.name;
            }
            return null;
        })
        return ' '+currency;
    }

    const PrefixFormat = (item) =>{
        let currency = ' ';
        item.currency && allCurrenies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.local === "en")
                    return currency = value.name;
            }
            return null;
        })
        return currency+' ';
    }

    return <div className="favorites-page-wrap">
        {unverifiedSpinner ?
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
                    {unverifiedAnnouncements.data && unverifiedAnnouncements.data.map((item, key) => {
                        return (
                            <tr key={key}>
                                <td>
                                    <img className="user-activity-img" src={item.main_image ? apiUrl + 'storage/uploads/announcements/' + item.main_image : default_image} alt={item.address}/>
                                </td>
                                <td>
                                    <NumberFormat value={priceFormat(item)} displayType={'text'} thousandSeparator={true} prefix={PrefixFormat(item)} suffix={currencyFormat(item)}/>
                                </td>
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
                                    <span className="verifyStatusPending">Unverified</span>
                                </td>
                                <td>
                                    <button onClick={() => {
                                        history.push(`/edit-property/${item.id}`);
                                    }}
                                            className="editDeleteButtons">
                                        <i className="editDeleteIcons fa fa-xs fa-pencil"
                                           aria-hidden="true"/>
                                    </button>
                                    <span>  </span>
                                    <button onClick={() => {
                                        confirmAlert({
                                            customUI: ({onClose}) => {
                                                return (
                                                    <div
                                                        className='property-filter-menu buttons'>
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
                                    }}
                                            type="submit" className="editDeleteButtons">
                                        <i className="editDeleteIcons fa fa-xs fa-trash"
                                           aria-hidden="true"/>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>}
        {unverifiedAnnouncements.last_page && unverifiedAnnouncements.last_page > 1 ?
            <Pagination data2={unverifiedAnnouncements} getPage={getPageRentAnnouncement}/>
            : ""}
    </div>
}
export default UnverifiedListing

