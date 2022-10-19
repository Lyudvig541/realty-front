import React, {useEffect, useState} from 'react';
import {Map, Placemark, YMaps} from "react-yandex-maps";
import {useHistory, useParams} from "react-router-dom";
import 'react-image-lightbox/style.css';
import {useDispatch, useSelector} from "react-redux";
import {
    additional_information,
    facilities_information,
    get_announcement,
    get_user_favorites,
    similar_announcements
} from "../../actions/announcement";
import Lightbox from 'react-image-lightbox';
import {setModal} from "../../reducers/modalsReducer";
import {Alert, Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Modal, ModalBody, ModalHeader} from "reactstrap";
import Back from "../back";
import {sendContactAgent} from "../../actions/request";
import {auth} from "../../actions/auth";
import {add_favorite, remove_favorite} from "../../actions/favorite";
import {PulseLoader} from "react-spinners";
import {css} from "@emotion/react";
import {brokerMessageSuccess} from "../../reducers/requestReducer";
import Moment from "moment";
import "rc-tabs/assets/index.css";
import NumberFormat from "react-number-format";

import {Link, Element} from 'react-scroll'


const PropertyDetails = (props) => {
    let apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const default_image = publicUrl + "/assets/img/default.png";
    let imagealt = 'image';
    const {t} = props;
    const {id} = useParams();
    const dispatch = useDispatch();
    const [priceOpen, setPriceOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector(state => state.auth.currentUser);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [clickFavorite] = useState(false)
    const announcement = useSelector(state => state.announcement.oneAnnouncement);
    const broker = useSelector(state => state.agent.agent);
    const currencies = useSelector(state => state.announcement.currencies);
    const similarAnnouncement = useSelector(state => state.announcement.similarAnnouncements);
    const isAuth = useSelector(state => state.auth.isAuth)
    let favorites = useSelector(state => state.announcement.favorites)
    const send_request = useSelector(state => state.request.broker_message_success);
    useEffect(() => {
        async function getData() {
            dispatch(facilities_information());
            dispatch(additional_information());
            dispatch(get_user_favorites(user.id));
            if (!user.id) {
                dispatch(auth())
            }
            dispatch(get_user_favorites(user.id));
        }

        getData();
    }, [dispatch, user.id])
    useEffect(() => {
        dispatch(get_announcement(id));
        dispatch(similar_announcements(id))
    },[dispatch,id])
    const facilities = useSelector(state => state.announcement.facilitiesInformation);
    const additionalInformations = useSelector(state => state.announcement.additionalInformation);
    const announcmentFacilities = useSelector(state => state.announcement.facilities);
    const announcmentAdditional = useSelector(state => state.announcement.additional);
    let images = [apiUrl + 'storage/uploads/announcements/' + announcement.main_image]
    announcement.announcement_images && announcement.announcement_images.map((value, index) => {
        return images[index + 1] = apiUrl + 'storage/uploads/announcements/' + value.name;
    })
    const addFavorite = (e, id) => {
        if (!user.id) {
            dispatch(auth())
        }
        if (e.target.className === "fa fa-heart activeHeart cursor") {
            e.target.className = "fa fa-heart-o cursor"
            dispatch(remove_favorite(id, user.id));
        } else {
            e.target.className = "fa fa-heart activeHeart cursor"
            dispatch(add_favorite(id, user.id));
        }
    }
    const isFavorite = (id) => {
        for (const idKey in favorites) {
            if (favorites[idKey].announcement_id === id)
                return true;
        }
        return false;
    }

    const mapOptions = {
        preset: "islands#redCircleDotIcon",
        hideIconOnBalloonOpen: false,
        openEmptyBalloon: true,
        open: true,
        iconImageSize: [30, 42],
        iconImageOffset: [-3, -42],
    };
    const modal = useSelector(state => state.modals.modal);
    const isLogin = () => {
        dispatch(setModal("login"));
    }
    const [contactText, setContactText] = useState();

    const handleContactAgent = () => {
        dispatch(sendContactAgent(contactText, broker.id, user.id));
    }
    const isFacility = (id) => {
        return announcmentFacilities[id];
    }
    const isAdditional = (id) => {
        return announcmentAdditional[id];
    }
    const spinner = useSelector(state => state.modals.spinner)
    const propertySpinner = useSelector(state => state.announcement.propertySpinner)
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: red;
    `;
    const togglePrice = () => setPriceOpen(!priceOpen);
    const priceFormat = (item) => {
        let price;
        item.currency && currencies.map((value) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")) {
                if (value.id === item.currency.id) {
                    return price = item.price;
                } else {
                    return price = Math.floor((item.price * item.currency.value) / value.value)
                }
            }
            return price
        })
        return price;
    }
    const currencyFormat = () => {
        let currency = '';
        announcement.currency && currencies.map((value) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")) {
                if (value.local !== "en")
                    return currency = value.name;
            }
            return currency
        })
        return ' ' + currency;
    }
    const PrefixFormat = () => {
        let currency = ' ';
        announcement.currency && currencies.map((value) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")) {
                if (value.local === "en")
                    return currency = value.name;
            }
            return currency
        })
        return currency + ' ';
    }
    const history = useHistory();
    const linkTo = (e, id) => {
        e.stopPropagation()
        if (e.target.className !== 'fa fa-heart-o cursor' && e.target.className !== 'fa fa-heart activeHeart cursor') {
            history.push(`/property-details/${id}`);
        }
    }
    return <div className="property-details-area">
        {clickFavorite && isLogin()}
        {isOpen && (
            <Lightbox
                mainSrc={images[photoIndex]}
                nextSrc={images[(photoIndex + 1) % images.length]}
                prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                onCloseRequest={() => setIsOpen(false)}
                onMovePrevRequest={() =>
                    setPhotoIndex((photoIndex + images.length - 1) % images.length)
                }
                onMoveNextRequest={() =>
                    setPhotoIndex((photoIndex + 1) % images.length)
                }
            />
        )}
        <div className="pd-top-100 pd-bottom-90">
            <div className="back-content">
                <Back/>
            </div>
            <div className="container">
                <div className="row ">
                    {propertySpinner ?
                        <div className="col-md-9 col-lg-9 mg-top-50">
                            <div className="spinner_content">
                                <div className="sweet-loading">
                                    <PulseLoader color={"#BE1E2D"} css={override} loading={true} size={16}/>
                                </div>
                            </div>
                        </div>
                        : <>
                            <div className="col-md-5 col-lg-5 col-xl-5 mg-top-10">
                                <div className="property-details-slider">
                                    <div className="property-details-swiper row">
                                        {announcement.announcement_images ? images.map((image, index) => {
                                                if (index === 0) {
                                                    return <div key={index} onClick={() => {
                                                        setIsOpen(true);
                                                        setPhotoIndex(index)
                                                    }}>
                                                        <div className="mainImage">
                                                            {announcement.main_image &&
                                                            <img className={"property-details-images"}
                                                                 src={apiUrl + "storage/uploads/announcements/" + announcement.main_image}
                                                                 alt={imagealt}/>
                                                            }
                                                        </div>
                                                    </div>
                                                } else {
                                                    return <div key={index} onClick={() => {
                                                        setIsOpen(true);
                                                        setPhotoIndex(index)
                                                    }} className="col-lx-6 col-md-6 col-lg-6 mg-top-30">
                                                        <div className="item">
                                                            <div className="thumb lightbox_item">
                                                                <img src={image} className={"property-details-images"}
                                                                     alt={imagealt}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            }
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-4 mg-top-10">
                                <div className="single-explore">
                                    <div style={{alignItems: 'initial'}} className="details readeal-top">
                                        <div className="space-between">
                                            <div className="inline-block">
                                        <span className='forSalePropertyDetails'>
                                            <li className="pointPropertyDetails">
                                                {announcement.category && announcement.category.translations.map((value) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                })}
                                            </li>
                                        </span>
                                            </div>
                                            <div className="inline-block">
                                                <div className="propertyDetailsHeart">
                                            <span onClick={(e) => {
                                                (localStorage.token || isLogin()) && addFavorite(e, announcement.id)
                                            }}
                                                  className={"heart main_color_heart"}>
                                                <i className={isFavorite(announcement.id) ? "fa fa-heart activeHeart cursor" : "fa fa-heart-o cursor"}/>
                                            </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="detailsBody">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-xl-6">
                                                    <Dropdown isOpen={priceOpen} toggle={togglePrice}>
                                                        <DropdownToggle caret className="price_dropdown_toggle">
                                                            <p className="price-body">
                                                                <NumberFormat value={priceFormat(announcement)}
                                                                              displayType={'text'} thousandSeparator={true}
                                                                              prefix={PrefixFormat()}
                                                                              suffix={currencyFormat()}/>
                                                            </p>
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            {announcement.currency ? currencies.map((value, key) => {
                                                                    let lang = localStorage.i18nextLng === 'us' ? 'en' : localStorage.i18nextLng;
                                                                    if (value.local !== lang) {
                                                                        if (value.local === 'eur') {
                                                                            return <DropdownItem className="property-details-price"
                                                                                                 key={key}>
                                                                                <NumberFormat
                                                                                    value={Math.floor((announcement.price * announcement.currency.value) / value.value)}
                                                                                    displayType={'text'} thousandSeparator={true}
                                                                                    prefix={value.name && value.local ? value.name + ' ' : ''}
                                                                                />
                                                                            </DropdownItem>
                                                                        } else {
                                                                            return <DropdownItem className="property-details-price"
                                                                                                 key={key}>
                                                                                <NumberFormat
                                                                                    value={Math.floor((announcement.price * announcement.currency.value) / value.value)}
                                                                                    displayType={'text'} thousandSeparator={true}
                                                                                    suffix={value.name && value.local !== 'en' ? ' ' + value.name : ''}
                                                                                    prefix={value.name && value.local === 'en' ? value.name + ' ' : ''}
                                                                                />
                                                                            </DropdownItem>
                                                                        }
                                                                    }
                                                                    return null ;
                                                                }
                                                            ) : ""}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-xl-6 d-flex justify-content-center p-2">
                                                    <p className="rent-type">{announcement.category_id === 2 && t(announcement.rent_type)}</p>
                                                </div>
                                            </div>
                                            {announcement.rent_type && announcement.rent_type === 'daily_rent' ?
                                                <div style={{marginTop: 16}}>
                                                    <span>{t('busy_date')}: {announcement.start_date && announcement.end_date && Moment(announcement.start_date).format('DD/MM/YYYY') + ' - ' + Moment(announcement.end_date).format('DD/MM/YYYY')}</span>
                                                </div>
                                                : ''}
                                            <div style={{marginTop: 16}}>
                                                <i className="fa fa-map-marker"/> {announcement.address} {announcement.building_number ?
                                                <span>{t('building_number')} {announcement.building_number}</span> : ""}
                                            </div>
                                            <div className="row paramsBody">
                                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                                    <img src={publicUrl + '/assets/img/icons/measured.png'}
                                                         alt="icon"/> {announcement.area} {t('m')}²
                                                </div>
                                                {announcement.type_id !== 4 ? <div className='col-lg-4 col-md-4 col-sm-4'>
                                                    <img alt={"roomLogo"}
                                                         src={publicUrl + '/assets/img/icons/bathroom.png'}/> {announcement.bathroom} {t('bath')}
                                                </div> : ""}
                                                {announcement.type_id !== 4 ? <div className='col-lg-4 col-md-4 col-sm-4'>
                                                    <img alt={"roomLogo"}
                                                         src={publicUrl + '/assets/img/icons/room_icon.png'}/> {announcement.rooms} {t('bed')}
                                                </div> : ""}

                                            </div>
                                        </div>
                                        <div className="property-filter-menu buttons">
                                            <button className='contact' onClick={() => isAuth ? dispatch(setModal('contact')) : dispatch(setModal('login'))}>
                                                {broker.roles && broker.roles[0] && broker.roles[0].slug === 'broker' ? t('contact_agent') : broker.roles && broker.roles[0] && broker.roles[0].slug === 'super_broker' ? t('contact_company') : t('contact_owner')}</button>
                                        </div>
                                        <div>
                                            <div className={'new-tabs-links-container'}>
                                                <Link
                                                    activeClass="activelink"
                                                    to="firstInsideContainer"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={250}
                                                    containerId="containerElement"
                                                >
                                                    {t("overview")}
                                                </Link>
                                                <Link
                                                    activeClass="activelink"
                                                    spy={true}
                                                    to="secondInsideContainer"
                                                    smooth={true}
                                                    duration={250}
                                                    containerId="containerElement"
                                                >
                                                    {t("features")}
                                                </Link>
                                                <Link
                                                    activeClass="activelink"
                                                    to="thirdInsideContainer"
                                                    smooth={true}
                                                    spy={true}
                                                    duration={250}
                                                    containerId="containerElement"

                                                >
                                                    {t("additional")}
                                                </Link>
                                            </div>
                                            <Element
                                                name="test7"
                                                className="elementsContainer"
                                                id="containerElement"
                                                style={{
                                                    position: "relative",
                                                    height: "200px",
                                                    overflowY: "scroll",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                <Element name="firstInsideContainer">
                                                    <div id='section1' style={{border: 0}}
                                                         className="mt-2 tab-pane fade show active">
                                                        <div className="col-lg-12, col-md-12">
                                                            <i className="fa fa-clock-o"/>&nbsp;
                                                            <span>{Moment(announcement.created_at).format('DD-MM-YYYY')}</span>
                                                        </div>
                                                        <div className="col-lg-12, col-md-12"
                                                             style={{fontSize: 14, color: '#000000'}}>
                                                            {(announcement.translations && announcement.translations.map((value) => {
                                                                return (localStorage.i18nextLng === 'us' &&
                                                                    value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.additional_text : null
                                                            }))|| announcement.description}
                                                        </div>
                                                    </div>
                                                </Element>
                                                <Element name="secondInsideContainer">
                                                    <div id='section2' style={{border: 0}} className="tab-pane fade show">
                                                        <div className="col-lg-12, col-md-12"
                                                             style={{fontSize: 14, color: '#000000', marginTop: 20}}>
                                                            {announcement.area ?
                                                                <div><img src={publicUrl + '/assets/img/icons/area.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("general_area")}: {announcement.area} {t("m")}²
                                                                </div> : ""}
                                                            {announcement.rooms ? <div><img alt={"roomLogo"}
                                                                                            src={publicUrl + '/assets/img/icons/bedroom1.png'}
                                                                                            className="feature-icons"/> {t('number_of_bedrooms')}: {announcement.rooms}
                                                            </div> : ""}
                                                            {announcement.bathroom ? <div><img alt={"roomLogo"}
                                                                                               src={publicUrl + '/assets/img/icons/bathroom1.png'}
                                                                                               className="feature-icons"/> {t("number_of_bathrooms")}: {announcement.bathroom}
                                                            </div> : ""}
                                                            {announcement.type_id === 1 ?
                                                                <div><img src={publicUrl + '/assets/img/icons/floor1.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("floors")}: {announcement.storeys}
                                                                </div> : ""}
                                                            {announcement.type_id === 2 ?
                                                                <div><img src={publicUrl + '/assets/img/icons/floor1.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("floor")}: {announcement.floor} / {announcement.storeys}
                                                                </div> : ""}
                                                            {announcement.type_id === 3 ?
                                                                <div><img src={publicUrl + '/assets/img/icons/floor1.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("floor")}: {announcement.floor} / {announcement.storeys}
                                                                </div> : ""}
                                                            {announcement.distance_from_medical_center ?
                                                                <div><img src={publicUrl + '/assets/img/icons/hospital.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("distance_from_medical_center")}: {announcement.distance_from_medical_center} {t("m")}
                                                                </div> : ""}
                                                            {announcement.distance_from_stations ?
                                                                <div><img src={publicUrl + '/assets/img/icons/station.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("distance_from_stations")}: {announcement.distance_from_stations} {t("m")}
                                                                </div> : ""}
                                                            {announcement.distance_from_metro_station ?
                                                                <div><img src={publicUrl + '/assets/img/icons/metro.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("distance_from_metro_station")}: {announcement.distance_from_metro_station} {t("m")}
                                                                </div> : ""}
                                                            {announcement.furniture && announcement.furniture === 'true' ?
                                                                <div><img src={publicUrl + '/assets/img/icons/furniture.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("furniture")}: {t("yes")}
                                                                </div> : ""}
                                                            {announcement.furniture && announcement.furniture === 'false' ?
                                                                <div><img src={publicUrl + '/assets/img/icons/furniture.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("furniture")}: {t("no")}
                                                                </div> : ""}
                                                            {announcement.condominium ?
                                                                <div><img src={publicUrl + '/assets/img/icons/condominium.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("condominium")}: {announcement.condominium} ֏
                                                                </div> : ""}
                                                            {announcement.building_type ? <div><img alt={"roomLogo"}
                                                                                                    src={publicUrl + '/assets/img/icons/building_type.png'}
                                                                                                    className="feature-icons"/> {t("building_type")}: {t(announcement.building_type)}
                                                            </div> : ""}
                                                            {announcement.ceiling_height ? <div><img
                                                                src={publicUrl + '/assets/img/icons/ceiling_height.png'}
                                                                alt="icon"
                                                                className="feature-icons"/> {t("ceiling_height")}: {announcement.ceiling_height}
                                                            </div> : ""}
                                                            {announcement.degree ? <div><img alt={"roomLogo"}
                                                                                             src={publicUrl + '/assets/img/icons/degree.png'}
                                                                                             className="feature-icons"/> {t("degree")}: {announcement.degree}
                                                            </div> : ""}
                                                            {announcement.infrastructure ? <div><img
                                                                src={publicUrl + '/assets/img/icons/infrastructure.png'}
                                                                alt="icon"
                                                                className="feature-icons"/> {t("infrastructure")}: {t(announcement.infrastructure)}
                                                            </div> : ""}
                                                            {announcement.fence_type ?
                                                                <div><img src={publicUrl + '/assets/img/icons/fence.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("fence_type")}: {t(announcement.fence_type)}
                                                                </div> : ""}
                                                            {announcement.road_type ? <div><img alt={"roomLogo"}
                                                                                                src={publicUrl + '/assets/img/icons/road_type.png'}
                                                                                                className="feature-icons"/> {t("road_type")}: {t(announcement.road_type)}
                                                            </div> : ""}
                                                            {announcement.front_position ? <div><img
                                                                src={publicUrl + '/assets/img/icons/front_position.png'}
                                                                alt="icon"
                                                                className="feature-icons"/> {t("front_position")}: {t(announcement.front_position)}, {announcement.front_position_length} {t("m")}
                                                            </div> : ""}
                                                            {announcement.building ? <div><img alt={"roomLogo"}
                                                                                               src={publicUrl + '/assets/img/icons/building.png'}
                                                                                               className="feature-icons"/> {t("building")}: {t(announcement.building)}
                                                            </div> : ""}
                                                            {announcement.cover ?
                                                                <div><img src={publicUrl + '/assets/img/icons/cover.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("cover")}: {t(announcement.cover)}
                                                                </div> : ""}
                                                            {announcement.land_geometric_appearance ? <div><img
                                                                src={publicUrl + '/assets/img/icons/land_geometric_appearance.png'}
                                                                alt="icon"
                                                                className="feature-icons"/> {t("land_geometric")}: {announcement.land_geometric_appearance}
                                                            </div> : ""}
                                                            {announcement.land_area ?
                                                                <div><img src={publicUrl + '/assets/img/icons/area.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("land_area")}: {announcement.land_area} {t("m")}²
                                                                </div> : ""}
                                                            {announcement.condition ?
                                                                <div><img src={publicUrl + '/assets/img/icons/condition.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("condition")}: {t(announcement.condition)}
                                                                </div> : ""}
                                                            {announcement.sewer ?
                                                                <div><img src={publicUrl + '/assets/img/icons/sewer.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("sewer")}: {t(announcement.sewer)}
                                                                </div> : ""}
                                                            {announcement.balcony ?
                                                                <div><img src={publicUrl + '/assets/img/icons/balcony.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t(announcement.balcony)}
                                                                </div> : ""}
                                                            {announcement.purpose ?
                                                                <div><img src={publicUrl + '/assets/img/icons/purpose.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t(announcement.purpose)}
                                                                </div> : ""}
                                                            {announcement.year ?
                                                                <div><img src={publicUrl + '/assets/img/icons/calendar_new.png'}
                                                                          alt="icon"
                                                                          className="feature-icons"/> {t("year")}: {announcement.year}
                                                                </div> : ""}
                                                        </div>
                                                    </div>
                                                </Element>
                                                <Element name='thirdInsideContainer'>
                                                    <div id={'section3'} style={{border: 0}} className="tab-pane fade show">
                                                        <div className="row" style={{marginTop: 20}}>
                                                            {
                                                                facilities.map((value, key) => {
                                                                    return (
                                                                        isFacility(value.id) ?
                                                                            <div className="col-lg-8 col-md-8 col-sm-8 col-xl-8"
                                                                                 key={key}>
                                                                                {value.image ? <img
                                                                                    src={apiUrl + 'storage/uploads/facilities/' + value.image}
                                                                                    style={{
                                                                                        height: '20px',
                                                                                        paddingRight: '5px'
                                                                                    }} alt={"..."}/> : ""}
                                                                                <span className="featureData">
                                                                    {value.translations.map((value) => {
                                                                        return (localStorage.i18nextLng === 'us' &&
                                                                            value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.title : null
                                                                    })}
                                                                        </span></div> : null)
                                                                })}
                                                            {additionalInformations.map((value, key) => {
                                                                return (
                                                                    isAdditional(value.id) ?
                                                                        <div className="col-lg-8 col-md-8 col-sm-8 col-xl-8"
                                                                             key={key}>
                                                                            {value.image ? <img
                                                                                src={apiUrl + 'storage/uploads/additional_infos/' + value.image}
                                                                                style={{height: '20px', paddingRight: '5px'}}
                                                                                alt={"..."}/> : ""}
                                                                            <span
                                                                                className="featureData">{value.translations.map((value) => {
                                                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.title : null
                                                                            })}
                                                            </span></div> : null)
                                                            })}
                                                        </div>
                                                    </div>
                                                </Element>
                                            </Element>
                                        </div>
                                        <div className="tab-content">
                                            <div className="col-lg-12, col-md-12 pd-top-30">
                                                <span>{t('published_by')}: </span>
                                                <img alt="broker" style={{marginLeft: 5}} width='30px' height='30px'
                                                     src={announcement.user && announcement.user.avatar ? apiUrl + 'storage/uploads/users/' + announcement.user.avatar : publicUrl + "/assets/img/author/default_avatar.png" || publicUrl + "/assets/img/author/default_avatar.png"}/>
                                                <span style={{
                                                    fontFamily: 'DM Sans',
                                                    fontFtyle: 'normal',
                                                    fontWeight: 'normal',
                                                    fontSize: '16px',
                                                    lineHeight: '170%',
                                                    alignItems: 'center',
                                                    color: ' #011728',
                                                    marginLeft: '10px'
                                                }}>{announcement.user && announcement.user.first_name} {announcement.user && announcement.user.last_name}</span>
                                            </div>
                                            <div className="col-lg-12, col-md-12" style={{height: 293, marginTop: 30}}>
                                                {announcement && announcement.longitude && announcement.latitude &&
                                                <YMaps query={{
                                                    coordorder: "longlat",
                                                    apikey: process.env.REACT_APP_Y_API_KEY
                                                }}>
                                                    <Map width="100%" height="100%" defaultState={{
                                                        center: [announcement.longitude, announcement.latitude],
                                                        zoom: 13
                                                    }}>
                                                        <Placemark
                                                            geometry={[announcement.longitude, announcement.latitude]}
                                                            options={mapOptions}
                                                            draggable={true}
                                                            properties={{
                                                                balloonContent: `<strong>$ ${announcement.price}</strong>`,
                                                                open: true,
                                                            }}
                                                            modules={['geoObject.addon.balloon']}
                                                        />

                                                    </Map>
                                                </YMaps>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    <div className="col-md-3 col-lg-3 mg-top-10 single-explore pt-2">
                        <h4>{t('similar_listing')}</h4>
                        {spinner ?
                            <div className="spinner_content">
                                <div className="sweet-loading">
                                    <PulseLoader color={"#BE1E2D"} css={override} loading={true} size={16}/>
                                </div>
                            </div>
                            : <div>
                                {similarAnnouncement.length ? similarAnnouncement.map((item, key) => {
                                    return <div key={key} className={"listing-content similar-content mt-5"}>
                                        <div className="single-feature-similar-announcement"
                                             onClick={(e) => {
                                                 linkTo(e, item.id)
                                             }}>
                                            <div className="thumb">
                                                <img className="thumb-image"
                                                     src={item.main_image ? apiUrl + 'storage/uploads/announcements/' + item.main_image : default_image}
                                                     alt={item.property_name}/>
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
                                                <div className="details">
                                                    <h6 className="price">
                                                        <NumberFormat value={priceFormat(item)} displayType={'text'}
                                                                      prefix={PrefixFormat(item)}
                                                                      suffix={currencyFormat(item)}
                                                                      thousandSeparator={true}/>

                                                    </h6>
                                                    <h6 className="font-announcement-icons">
                                                        <i className="fa fa-map-marker"/>
                                                        {item.address.length > 40 ? item.address.slice(0, 40) + '...' : item.address}
                                                    </h6>
                                                    <ul className="info-list-announcement font-announcement-icons">
                                                        <li>
                                                            <img alt={item.area}
                                                                 src={publicUrl + '/assets/img/icons/measured.png'}/> {item.area} {t('m')}²
                                                        </li>
                                                        {item.rooms ? <li><img alt={item.area}
                                                                               src={publicUrl + '/assets/img/icons/room_icon.png'}/> {item.rooms} {t('bed')}
                                                        </li> : null}
                                                        {item.bathroom ? <li><img alt={item.area}
                                                                                  src={publicUrl + '/assets/img/icons/bathroom.png'}/> {item.bathroom} {t('bath')}
                                                        </li> : null}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }) : t('no_result')
                                }
                            </div>}
                    </div>
                </div>
            </div>
        </div>

        <Modal className="request_modal modal-cont" isOpen={modal === "contact"}>
            <ModalHeader toggle={() => {
                dispatch(setModal(''));
                dispatch(brokerMessageSuccess(false));
            }}/>
            <ModalBody>
                <div className="brokerContact-container">
                    <div className="brokerContact">
                        {
                            <div className={'brokerContact-container'}>
                                <div className="brokerContact-container-info">
                                    <div className="brokerContact-img">
                                        <img width="90px" height="90px"
                                             src={broker.id && broker.avatar ? apiUrl + 'storage/uploads/users/' + broker.avatar : publicUrl + "/assets/img/author/default_avatar.png"}
                                             alt="userImg"/>
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
                        }
                    </div>
                    {send_request
                        ?
                        <Alert color="info" className="col-xl-12 col-lg-12 col-md-12">
                            {t('message_sending')}
                        </Alert>
                        :
                        <div className="rld-single-input">
                            <div className="sq-single-select mg-top-10">
                                    <textarea style={{width: '100%', height: 80, padding: 10}}
                                              placeholder={t('request_description')} name="description"
                                              onChange={(event) => setContactText(event.target.value)}/>
                            </div>
                            <div className="property-filter-menu mg-top-10 text-center">
                                <button className="active" onClick={() => handleContactAgent()}>{t('send')}</button>
                            </div>
                        </div>
                    }
                </div>
            </ModalBody>
        </Modal>

    </div>
}

export default PropertyDetails
