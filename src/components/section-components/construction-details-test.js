import React, {useEffect, useState} from 'react';
import {useParams, Link} from "react-router-dom";
import 'react-image-lightbox/style.css';
import {useDispatch, useSelector} from "react-redux";
import {construction} from "../../actions/construction";
import {setModal} from "../../reducers/modalsReducer";
import Lightbox from 'react-image-lightbox';
import NumberFormat from "react-number-format";
import {currencies} from "../../actions/announcement";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import Back from "../back";
import {PulseLoader} from "react-spinners";
import {css} from "@emotion/react";
import {setSpinner} from "../../reducers/modalsReducer";
import {Map, Placemark, YMaps} from "react-yandex-maps";

const publicUrl = process.env.PUBLIC_URL;
const default_image = publicUrl + "/assets/img/default.png";
const mapOptions = {
    preset: "islands#redCircleDotIcon",
    hideIconOnBalloonOpen: false,
    openEmptyBalloon: true,
    open: true,
    iconImageSize: [30, 42],
    iconImageOffset: [-3, -42],
};
const ConstructionDetailsTest = (props) => {
    let publicUrl = process.env.PUBLIC_URL;
    let apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const {t} = props;
    const {id} = useParams();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState();
    const [clickFavorite] = useState(false)
    const oneConstruction = useSelector(state => state.construction.construction);
    const allCurrencies = useSelector(state => state.announcement.currencies);
    const [priceOpen, setPriceOpen] = useState(false);
    const spinner = useSelector(state => state.modals.spinner);

    useEffect(() => {
        async function getData() {
            dispatch(setSpinner(true))
            await dispatch(construction(id));
            dispatch(currencies());
        }

        getData();
    }, [dispatch, id])
    let images = [];
    oneConstruction.constructor_images && oneConstruction.constructor_images.map((value, index) => {
        return images[index] = apiUrl + 'storage/uploads/constructors/' + value.name;
    })

    const isLogin = () => {
        dispatch(setModal("login"));
    }
    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;`;
    const formatDate = (date) => {
        let format_date = date.split("-")
        let formed_date = new Date(format_date[2], format_date[1] - 1, format_date[0])
        return formed_date.getTime()
    }
    oneConstruction.translations && oneConstruction.translations.map((value) => {
        if((localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng)) {
            window.imageMapFloors(value.floors)
            window.imageMapPlans(value.plans)
        }
        return null;
    })
    const priceFormatEn = (price, type) => {
        oneConstruction.currency && allCurrencies.map((value) => {
            if (value.local === "en") {
                if (oneConstruction.currency && oneConstruction.currency.local === 'en') {
                    if (type === 'start') {
                        price = Math.floor((oneConstruction.price_start * oneConstruction.currency.value) / value.value);
                    } else {
                        price = Math.floor((oneConstruction.price_end * oneConstruction.currency.value) / value.value);
                    }
                }
            }
            return price;
        })
        return price;
    }

    const PrefixFormatEn = () => {
        let currency = ' ';
        oneConstruction.currency && allCurrencies.map((value) => {
            if (value.local === "en") {
                currency = value.name;
            }
            return currency;
        })
        return currency + ' ';
    }
    const togglePrice = () => setPriceOpen(prevState => !prevState);

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
        <div className="bg-gray pd-top-100 pd-bottom-90">
            <div className="back-content">
                <Back/>
            </div>
            {spinner ?
                <div className="spinner_content">
                    <div className="sweet-loading">
                        <PulseLoader color={"#BE1E2D"} css={override} loading={true} size={16}/>
                    </div>
                </div>
                :
                <div className="construction-details-container">
                    <div className="construction-details-main-container row">
                        <div className="property-details-slider  col-lg-8 col-xl-8 ">
                            <div>
                                <div className="mainImage">
                                    <div id="image-map-floors-container"/>
                                </div>
                            </div>
                            <div className="construction-swiper">
                                <div id="image-map-plans-container"/>
                            </div>
                        </div>
                        <div className="single-explore  col-lg-4 col-xl-4 ">
                            <div className="details">
                                <div className="">
                                    <div className="">
                                        <p className="constructionTitle">
                                            {oneConstruction.translations && oneConstruction.translations.map((value) => {
                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.property_name : ""
                                            })}</p>
                                        <p className="constructionSubTitle">
                                            {oneConstruction.translations && oneConstruction.translations.map((value) => {
                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.sub_title : ""
                                            })}</p>
                                        <Dropdown isOpen={priceOpen} toggle={togglePrice}>
                                            <DropdownToggle caret className="price_dropdown_toggle">
                                                <p className="price-body">
                                                    <NumberFormat value={priceFormatEn(oneConstruction.price_start, 'start')}
                                                        displayType={'text'} prefix={PrefixFormatEn()} thousandSeparator={true}/> {oneConstruction.price_end && '-'}
                                                    {oneConstruction.price_end && <NumberFormat
                                                        value={priceFormatEn(oneConstruction.price_end, 'end')}
                                                        displayType={'text'} thousandSeparator={true}/>}
                                                </p>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {oneConstruction.currency && allCurrencies && allCurrencies.map((value, key) => {
                                                    if (value.local !== 'en') {
                                                        return <DropdownItem className="priceBody" key={key}>
                                                            <NumberFormat
                                                                value={Math.floor((oneConstruction.price_start * oneConstruction.currency.value) / value.value)}
                                                                displayType={'text'} prefix={value.local === 'eur' ? value.name + ' ' : ""}
                                                                thousandSeparator={true} suffix={oneConstruction.price_end ? " " : value.local === 'eur' ? ' ' : " " + value.name}/>
                                                            {oneConstruction.price_end && '-'} {oneConstruction.price_end && <NumberFormat
                                                            value={Math.floor((oneConstruction.price_end * oneConstruction.currency.value) / value.value)}
                                                            displayType={'text'} thousandSeparator={true}
                                                            suffix={value.local === 'eur' ? ' ' : " " + value.name}/>}
                                                        </DropdownItem>
                                                    }
                                                    return null;
                                                }
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="constructionLocation ">
                                    <i className="fa fa-map-marker"/> {oneConstruction.address}
                                </div>
                                <div className="row paramsBody construction-details-wrap">
                                    <div className="col-lg-12 col-md-12 col-xl-12">
                                        <div className="pb-2">
                                            {t('ready')} :
                                            <span className="badge" style={{fontSize: '18px'}}>
                                                {oneConstruction.end_date && new Date().getTime() > formatDate(oneConstruction.end_date)}
                                                {oneConstruction.start_date && oneConstruction.end_date && new Date().getTime() < formatDate(oneConstruction.end_date) ?
                                                    Math.floor(((new Date().getTime() - formatDate(oneConstruction.start_date)) / (formatDate(oneConstruction.end_date) - formatDate(oneConstruction.start_date))) * 100) + ' %'
                                                    : '100%'
                                                }
                                            </span>
                                            <div className="tooltip-auto-choose">
                                                <i className="fa fa-question-circle-o"/>
                                                <span className="tooltiptext" style={{width: '200px'}}>
                                                    {t('const_percent_text')}
                                                </span>
                                            </div>
                                        </div>
                                        <p>
                                            <img alt={"calendar"} width={32}
                                                 src={publicUrl + '/assets/img/icons/calendar.png'}/>{oneConstruction.start_date} : {oneConstruction.end_date}
                                        </p>
                                        <p>
                                            <img alt={"floorLogo"}
                                                 src={publicUrl + '/assets/img/icons/floor.png'}/>{t('storeys') + ": " + oneConstruction.storeys}
                                        </p>
                                        <p>
                                            <img alt={"keyLogo"}
                                                 src={publicUrl + '/assets/img/icons/key.png'}/>{t('available2') + " " + oneConstruction.available_apartments + "/" + oneConstruction.apartment_counts}
                                        </p>
                                        <p>
                                            <img alt={"floorLogo"}
                                                 src={publicUrl + '/assets/img/icons/floor.png'}/>{t('floor_height') + " " + oneConstruction.floor_height + t('m')}
                                        </p>
                                        <p>
                                            <img alt={"areaLogo"}
                                                 src={publicUrl + '/assets/img/icons/measured.png'}/>{t("general_area")}: {oneConstruction.area} {t("m")}²
                                        </p>
                                        <p>
                                            <img alt={"parkingLogo"}
                                                 src={publicUrl + '/assets/img/icons/car.png'}/>{t('parking') + " " + oneConstruction.available_parking + "/" + oneConstruction.parking}
                                        </p>
                                        <p>
                                            <img alt={"pharmacyLogo"}
                                                 src={publicUrl + '/assets/img/icons/pharmacy.png'}/>{t('distance_from_pharmacy') + ": " + oneConstruction.distance_from_pharmacy + " " + t('m')}
                                        </p>
                                        <p>
                                            <img alt={"mallLogo"}
                                                 src={publicUrl + '/assets/img/icons/mall.png'}/>{t('distance_from_supermarket') + ": " + oneConstruction.distance_from_supermarket + " " + t('m')}
                                        </p>
                                        <p>
                                            <img alt={"mallLogo"}
                                                 src={publicUrl + '/assets/img/icons/school.png'}/>{t('distance_from_school') + ": " + oneConstruction.distance_from_school + " " + t('m')}
                                        </p>
                                        <p>
                                            <img alt={"mallLogo"}
                                                 src={publicUrl + '/assets/img/icons/kindergarten.png'}/>{t('distance_from_kindergarten') + ": " + oneConstruction.distance_from_kindergarten + " " + t('m')}
                                        </p>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    {oneConstruction.const_agency &&
                                    <Link to={'/agency/' + oneConstruction.const_agency.id}>
                                        <div className="single-explore  p-3">
                                            <div className='d-flex flex-row align-items-center bg-white pl-2'>
                                                <div className="card-img">
                                                    <img src={oneConstruction.const_agency && oneConstruction.const_agency.avatar ? apiUrl + "storage/uploads/users/" + oneConstruction.const_agency.avatar : default_image}
                                                        alt="const-agency"/>
                                                </div>
                                                <div className='d-flex flex-column ml-3'>
                                                    <p className='card-text-1'>
                                                        {oneConstruction.const_agency && oneConstruction.const_agency.translations.map((value) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : ""
                                                        })}
                                                    </p>
                                                    <p className='card-text-2'>{t('const_agency')}</p>
                                                </div>
                                            </div>
                                            <div className='d-flex flex-column mt-3 const_agency_info'>
                                                <div className='d-flex'>
                                                    <i className="fa fa-home fa-lg"/>
                                                    <p className='card-text-3 pl-2'>
                                                        {oneConstruction.const_agency && oneConstruction.const_agency.state && oneConstruction.const_agency.state.translations.map((value) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                        })}
                                                        &#160;
                                                        {oneConstruction.const_agency && oneConstruction.const_agency.city && oneConstruction.const_agency.city.translations.map((value) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                        })}
                                                    </p>
                                                </div>
                                                <div className='d-flex'>
                                                    <i className="fa fa-envelope fa-lg"/>
                                                    <p className='card-text-3 pl-2'>{oneConstruction.const_agency ? oneConstruction.const_agency.email : ""}</p>
                                                </div>
                                                <div className='d-flex'>
                                                    <i className="fa fa-phone fa-lg"/>
                                                    <p className='card-text-3 pl-2'>{oneConstruction.const_agency ? oneConstruction.const_agency.phone : ""}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    }
                                </div>
                                <div className="col-lg-12, col-md-12 pb-2" style={{height: 293, marginTop: 30}}>
                                    {oneConstruction && oneConstruction.longitude && oneConstruction.latitude &&
                                        <YMaps query={{
                                            coordorder: "longlat",
                                            apikey: process.env.REACT_APP_Y_API_KEY
                                        }}>
                                            <Map width="100%" height="100%" defaultState={{
                                                center: [oneConstruction.longitude, oneConstruction.latitude],
                                                zoom: 13
                                            }}>
                                                <Placemark
                                                    geometry={[oneConstruction.longitude, oneConstruction.latitude]}
                                                    options={mapOptions}
                                                    draggable={true}
                                                    modules={['geoObject.addon.balloon']}
                                                />
                                            </Map>
                                        </YMaps>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="brokerTab">
                        <ul className="nav">
                            <li className="nav-item">
                                <button className="nav-link active" data-toggle="tab" href="#description">
                                    <div className="border-bottom-line">{t('description')}</div>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" data-toggle="tab" href="#gallery">
                                    <div className="border-bottom-line">{t('gallery')}</div>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" data-toggle="tab" href="#features">
                                    <div className="border-bottom-line">{t('features')}</div>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" data-toggle="tab" href="#renovation">
                                    <div className="border-bottom-line">{t('renovation')}</div>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" data-toggle="tab" href="#live">
                                    <div className="border-bottom-line">{t('live_video')}</div>
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content pd-top-20">
                            <div className="tab-pane show active" id="description">
                                <div className="col-12">
                                    <div>
                                        {oneConstruction.translations && oneConstruction.translations.map((value, i) => {
                                            return <p key={i}
                                                      dangerouslySetInnerHTML={{__html: (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.property_description : ""}}/>
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane show" id="gallery">
                                <div className="col-12">
                                    <div className="row">
                                        {oneConstruction.constructor_images ? oneConstruction.constructor_images.map((image, index) =>
                                            <div onClick={() => {
                                                setIsOpen(true)
                                                setPhotoIndex(index)
                                            }} className="col-lx-3 col-md-3 col-lg-3 m-1 lightbox-img" key={index}>
                                                <img src={apiUrl + "storage/uploads/constructors/" + image.name}
                                                     alt={oneConstruction.property_name}/>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane show" id="features">
                                <div className="col-12">
                                    <div>
                                        {oneConstruction.translations && oneConstruction.translations.map((value, i) => {
                                            return <p key={i}
                                                      dangerouslySetInnerHTML={{__html: (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.features : ""}}/>
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane show" id="renovation">
                                <div className="col-12">
                                    <div>
                                        {oneConstruction.translations && oneConstruction.translations.map((value, i) => {
                                            return <p key={i}
                                                      dangerouslySetInnerHTML={{__html: (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.renovation : ""}}/>
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane show" id="live">
                                <div className="col-12">
                                    <iframe src={oneConstruction.live_video_url} title="description" height="600px"
                                            width="735px"/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }
        </div>

    </div>
}

export default ConstructionDetailsTest