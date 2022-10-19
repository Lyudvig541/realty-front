import React, {useEffect} from 'react';
import {useDispatch, useSelector,} from "react-redux";
import {agent} from "../../actions/resources";
import {useParams} from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import {Map, Placemark, YMaps} from "react-yandex-maps";
import {setModal} from "../../reducers/modalsReducer";
import {add_favorite, remove_favorite} from "../../actions/favorite";
import {auth} from "../../actions/auth";
import NumberFormat from "react-number-format";
import {useHistory} from "react-router-dom";
import {currencies} from "../../actions/announcement";


const mapState = {
    center: [40.205232423495, 44.50179792794979],
    zoom: 16,
    yandexMapDisablePoiInteractivity: true,
};
const coordinates = [
    [40.205232423495, 44.50179792794979],
];
const mapOptions = {
    preset: "islands#redCircleDotIcon",
    hideIconOnBalloonOpen: false,
    openEmptyBalloon: true,
    open: true,
    iconImageSize: [30, 42],
    iconImageOffset: [-3, -42],
};
const AgentInfo = (props) => {
    const inlineStyle = { backgroundColor: '#E5E5E5' }
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const default_avatar = publicUrl + "/assets/img/author/default_avatar.png";
    let {id} = useParams();
    const default_image = publicUrl + "/assets/img/default.png";
    const isAuth = useSelector(state => state.auth.isAuth)
    const dispatch = useDispatch()
    const history = useHistory();
    const {t} = props;
    let data = useSelector(state => state.agent.agent);
    let favorites = useSelector(state => state.announcement.favorites)
    let user = useSelector(state => state.auth.currentUser)
    const getCurrencies = useSelector(state => state.announcement.currencies);
    useEffect(() => {
        dispatch(agent(id));
        dispatch(currencies());

    }, [dispatch, id])
    const isLogin = () => {
        dispatch(setModal("login"));
    }
    const addFavorite = (e, id) => {
        if (!user.id) {
            dispatch(auth())
        }
        if (e.target.className === "fa fa-heart activeHeart cursor" && e.target.className !== "heart") {
            e.target.className = "fa fa-heart-o cursor"
            dispatch(remove_favorite(id, user.id));
        } else if (e.target.className !== "heart") {
            e.target.className = "fa fa-heart activeHeart cursor"
            dispatch(add_favorite(id, user.id));
        }
    }
    const linkTo = (e, id) => {
        e.stopPropagation()
        if (e.target.className !== 'fa fa-heart-o cursor' && e.target.className !== 'fa fa-heart activeHeart cursor') {
            history.push(`/property-details/${id}`);
        }
    }

    const isFavorite = (id) => {
        for (const idKey in favorites) {
            if (favorites[idKey].announcement_id === id)
                return true;
        }
        return false;
    }
    const priceFormat = (item) =>{
        let price;
        item.currency && getCurrencies.map((value) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.id === item.currency.id){
                    price = item.price;
                }else{
                    price = Math.floor((item.price * item.currency.value) / value.value)
                }
            }
        })
        return price;
    }

    const currencyFormat = (item) =>{
        let currency = ' ';
        item.currency && getCurrencies.map((value) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.local !== "en")
                    currency = value.name;
            }
        })
        return ' '+currency;
    }

    const PrefixFormat = (item) =>{
        let currency = ' ';
        item.currency && getCurrencies.map((value) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.local === "en")
                    currency = value.name;
            }
        })
        return currency+' ';
    }
    return <div style={inlineStyle}>
        <div className="container pd-top-100">
            <div className="row">
                <div className="col-lg-4 col-md-5">
                    <div className="single-user-list single-feature">
                        <div className="brokerImg">
                            {data.rating ? <img src={data.avatar ? apiUrl + 'storage/uploads/users/' + data.avatar : default_image} alt={data.first_name ? data.first_name : ''}/> : ""}
                        </div>
                        <div className="details ">
                            { data.super_broker ? <a href={'/agency/' + data.super_broker.id} className="feature-logo"> <img src={apiUrl + 'storage/uploads/users/' + data.super_broker.avatar} alt={"..."}/> </a> : '' }
                            <h4>
                                <a href={'#first_name'}>{data.first_name} {data.last_name}</a>
                            </h4>
                            <div className='row broker-rating'>
                                {data.rating ?
                                    <ReactStars
                                        value={data.rating}
                                        count={5}
                                        size={24}
                                        activeColor="#FAA61A"
                                        emptyIcon={<i className="far fa-star"/>}
                                        halfIcon={<i className="fa fa-star-half-alt"/>}
                                        fullIcon={<i className="fa fa-star"/>}
                                        isHalf={true}
                                        edit={false}
                                    /> : ""}
                            </div>
                            <p><i className="fa fa-map-marker"/> {data.state && data.state.translations.map((value) => {
                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                            })}, {data.city && data.city.translations.map((value) => {
                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                            })}
                            </p>
                            {isAuth &&
                                <span className="phone"><i className="fa fa-phone"/>
                                    {data.phone}
                                    <a href={`tel:${data.phone}`} className="btn btn-main-color call-button">{t('call_now')}</a>
                                </span>
                            }
                        </div>
                    </div>
                    <div className=" container brokerInfo pd-top-30">
                        <h6>{t('professional_information')}</h6>
                        <div className="row">
                            <div className="col-lg-5 col-md-6 col-sm-3 col-5">
                                <p>{t('address')}:</p>
                            </div>
                            <div className="col-lg-7 col-md-6 col-sm-5 col-7">
                                <p>{data.city ? data.city.name : ""}, {data.country ? data.country.name : ""} </p>
                            </div>
                        </div>
                        {isAuth &&
                            <div className="row">
                                <div className="col-lg-5 col-md-6 col-sm-3 col-5">
                                    <p>{t('cell_phone')}:</p>
                                </div>
                                <div className="col-lg-7 col-md-6 col-sm-5 col-7">
                                    <p>{data.phone}</p>
                                </div>
                            </div>
                        }
                        <div className="row">
                            <div className="col-lg-5 col-md-6 col-sm-3 col-5">
                                <p>{t('member_since')}:</p>
                            </div>
                            <div className="col-lg-7 col-md-6 col-sm-5 col-7">
                                <p>{data.created_at ? new Date(data.created_at).getDate() + '-' + (new Date(data.created_at).getMonth() + 1) + '-' + new Date(data.created_at).getFullYear() : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8 col-md-7 ">
                    <div style={{height: "230px"}}>
                        <YMaps height="100%" width="inherit" enterprise
                               query={{apikey: process.env.REACT_APP_Y_API_KEY}}>
                            <Map width="100%" height="inherit" state={mapState}>
                                {coordinates.map((coordinate, i) =>
                                    <Placemark key={i}
                                               geometry={coordinate}
                                               options={mapOptions}
                                               draggable={true}
                                               properties={{
                                                   balloonContent: "<p><strong>Vahram Papazyan Str, 22</strong></p>",
                                                   open: true,
                                               }}
                                               modules={['geoObject.addon.balloon']}
                                    />)}
                            </Map>
                        </YMaps>
                    </div>
                    <div className="brokerTab mg-top-30 mg-bottom-30">
                        <ul className="nav">
                            <li className="nav-item">
                                <button className="nav-link" data-toggle="tab" href="#property">
                                    <div className="border-bottom-line">{t('properties')}</div>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link active" data-toggle="tab" href="#about">
                                    <div className="border-bottom-line">{t('about_me')}</div>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link " data-toggle="tab" href="#comments">
                                    <div className="border-bottom-line">{t('comments')}</div>
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content pd-top-20 pd-bottom-20">
                            <div className="tab-pane show brokerScrollCss" id="property">
                                <div className="container">
                                    <div className="row">
                                        {data.broker_announcements && data.broker_announcements.map((item, i) =>
                                            <div key={i} className="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-12 mg-top-30">
                                                <div className="single-feature-announcement listing-content"
                                                     onClick={(e) => {
                                                         linkTo(e, item.id)
                                                     }}
                                                     style={{inlineSize: 'fit-content'}}>
                                                    <div className="thumb" style={{height: 250}}>
                                                        <img className="thumb-image" style={{height: '100%'}} src={item.main_image ? apiUrl + 'storage/uploads/announcements/' + item.main_image : default_image} alt={item.property_name}/>
                                                        <span className='forSale'>
                                                            <li className="point">
                                                                <span style={{color: '#011728'}}>
                                                                    {item.category && item.category.translations.map((value) => {
                                                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                                    })}
                                                                </span>
                                                            </li>
                                                        </span>
                                                        <span onClick={(e) => {
                                                            (localStorage.token || isLogin()) && addFavorite(e, item.id)
                                                        }}
                                                              className={"heart"}>
                                                            <i className={isFavorite(item.id) ? "fa fa-heart activeHeart cursor" : "fa fa-heart-o cursor"}/>
                                                        </span>
                                                    </div>
                                                    <div className="listing-details">
                                                        <div className="details pt-1">
                                                            <h6 className="price">
                                                                <NumberFormat value={priceFormat(item)} displayType={'text'} prefix={PrefixFormat(item)} suffix={currencyFormat(item)} thousandSeparator={true}/>
                                                            </h6>
                                                            <h6 className="font-announcement-icons">
                                                                <i className="fa fa-map-marker"/>
                                                                {item.address.length > 40 ? item.address.slice(0, 40) + '...' : item.address}
                                                            </h6>
                                                            <ul className="info-list-announcement font-announcement-icons">
                                                                <li>
                                                                    <img alt={item.area} src={publicUrl + '/assets/img/icons/measured.png'}/> {item.area} {t('m')}²
                                                                </li>
                                                                {item.rooms ? <li><img alt={item.area} src={publicUrl + '/assets/img/icons/room_icon.png'}/> {item.rooms} {t('bed')}
                                                                </li> : null}
                                                                {item.bathroom ? <li><img alt={item.area} src={publicUrl + '/assets/img/icons/bathroom.png'}/> {item.bathroom} {t('bath')}
                                                                </li> : null}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane show active" id="about">
                                <div className="container">
                                    <p>{data.info}</p>
                                </div>
                            </div>
                            <div className="tab-pane show brokerScrollCss" id="comments">
                                <div className="container">
                                    {data.broker_comments && data.broker_comments.map((value,key)=>{
                                        return value.user && <div key={key} className={"comments"}>
                                            <div className="container">
                                                <img className={"user-avatar-in-comments"}
                                                     src={value.user && value.user.avatar ? (apiUrl + 'storage/uploads/users/' + value.user.avatar) : default_avatar}
                                                     alt=""/>
                                                <span
                                                    className={"user-name"}> {value.user && value.user.first_name} {value.user && value.user.last_name}</span>
                                                <p>{value.text}</p>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default AgentInfo