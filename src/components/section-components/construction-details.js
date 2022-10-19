import React, {useEffect, useState} from 'react';
import {useParams,Link} from "react-router-dom";
import 'react-image-lightbox/style.css';
import {useDispatch, useSelector} from "react-redux";
import {construction} from "../../actions/construction";
import {Swiper, SwiperSlide} from 'swiper/react';
import {setModal} from "../../reducers/modalsReducer";
import Back from "../back";
import Lightbox from 'react-image-lightbox';
import NumberFormat from "react-number-format";
import {currencies} from "../../actions/announcement";
import {Dropdown, DropdownMenu, DropdownToggle} from "reactstrap";

const publicUrl = process.env.PUBLIC_URL;
const default_image = publicUrl + "/assets/img/default.png";


const ConstructionDetails = (props) => {
    let publicUrl = process.env.PUBLIC_URL;
    let apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const {t} = props;
    const {id} = useParams();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [clickFavorite] = useState(false)
    const oneConstruction = useSelector(state => state.construction.construction);
    const allCurrencies = useSelector(state => state.announcement.currencies);
    const [priceOpen, setPriceOpen] = useState(false);

    useEffect(() => {
        async function getData() {
            await dispatch(construction(id));
            dispatch(currencies());
        }
        getData();
    }, [dispatch, id])
    let images = [apiUrl + 'storage/uploads/constructors/' + oneConstruction.main_image];
    oneConstruction.main_image && oneConstruction.constructor_images.map((value, index) => {
        return images[index + 1] = apiUrl + 'storage/uploads/constructors/' + value.name;
    })

    const togglePrice = () => setPriceOpen(prevState => !prevState);

    const isLogin = () => {
        dispatch(setModal("login"));
    }

    const formatDate = (date) => {
        let format_date = date.split("-")
        let formed_date = new Date( format_date[2], format_date[1] - 1, format_date[0])
        return formed_date.getTime()
    }
    oneConstruction.translations && oneConstruction.translations.map((value, i) => {
        if((localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng)) {
            window.imageMapFloors(value.floors)
            window.imageMapPlans(value.plans)
        }
        return null;
    })

    const prevRef = React.useRef(null);
    const nextRef = React.useRef(null);

    const priceFormat = (price, type) =>{
        oneConstruction.currency && allCurrencies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.id === oneConstruction.currency.id){
                    if (type === 'start'){
                        price = oneConstruction.price_start;
                    }else{
                        price = oneConstruction.price_end;
                    }
                }else{
                    if (type === 'start') {
                        price = Math.floor((oneConstruction.price_start * oneConstruction.currency.value) / value.value)
                    }else{
                        price = Math.floor((oneConstruction.price_end * oneConstruction.currency.value) / value.value)
                    }
                }
            }
            return price;
        })
        return price;
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
        <div className="bg-gray pd-top-100 pd-bottom-90">
            <div className="back-content">
                <Back/>
            </div>
            <div className="container">
                <div className="row ">
                    <div className="col-md-8 col-lg-8 col-xl-8">
                        <div className="property-details-slider">
                            <div key={0} className="item" onClick={() => {
                                setIsOpen(true)
                            }}>
                                <div className="mainImage">
                                    {oneConstruction.main_image &&
                                    <img width="100%" height="100%" style={{cursor:'zoom-in'}}
                                         src={apiUrl + "storage/uploads/constructors/" + oneConstruction.main_image}
                                         alt={oneConstruction.property_name}/>
                                    }
                                </div>
                            </div>
                            <div className="construction-swiper">
                                <div ref={prevRef} className="swiper-button-prev"></div>
                                <div ref={nextRef} className="swiper-button-next"></div>
                                <Swiper
                                    className="construction_details_swiper"
                                    spaceBetween={30}
                                    slidesPerView={5}
                                    loop={false}
                                    autoplay
                                    display={2000}
                                >
                                    {oneConstruction.constructor_images ? oneConstruction.constructor_images.map((image, index) =>
                                        <SwiperSlide key={index + 1}>
                                            <div onClick={() => {
                                                setIsOpen(true)
                                            }} className="col-lx-12 col-md-12 col-lg-12 mg-top-30">
                                                <div className="item" key={index + 1}>
                                                    <div className="thumb lightbox_item">
                                                        <img width="100%" height="100%" style={{cursor:'zoom-in'}}
                                                             src={apiUrl + "storage/uploads/constructors/" + image.name}
                                                             alt={oneConstruction.property_name}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ) : null}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <div className="single-explore">
                            <div className="details">
                                <div className="row">
                                    <div className="col-lg-8 col-md-8 col-xl-8">
                                        <p className="constructionTitle">
                                        {oneConstruction.translations && oneConstruction.translations.map((value, i) => {
                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.property_name : ""})}</p>
                                        <p className="constructionSubTitle">
                                            {oneConstruction.translations && oneConstruction.translations.map((value, i) => {
                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.sub_title : ""})}</p>
                                        <Dropdown isOpen={priceOpen} toggle={togglePrice}>
                                            <DropdownToggle className="search-bar-dropdown-toggle property-details-dropdown price_dropdown_toggle">
                                                <div className="sq-single-select">
                                                    <p className="construction-price-body">
                                                        <NumberFormat value={priceFormat(oneConstruction.price_start, 'start')} displayType={'text'} thousandSeparator={true}/> - <NumberFormat value={priceFormat(oneConstruction.price_end,'end')} displayType={'text'} thousandSeparator={true}/>
                                                    </p>
                                                    <img
                                                        className={priceOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                                        src={publicUrl + '/assets/img/icons/arrow-down.png'}
                                                        alt="..."/>
                                                </div>
                                            </DropdownToggle>
                                            <DropdownMenu className="search-bar-dropdown-type">
                                                <div className="rld-single-input mg-top-10">
                                                    <div className="sq-single-select">
                                                        <ul style={{paddingLeft: 0}}>
                                                            <ol className={'search-bar-types-style'}>
                                                                {oneConstruction.currency_id && allCurrencies.map((value, key) => {
                                                                    return <p className="priceBody" key={key}>
                                                                        <NumberFormat value={value.currency_id === oneConstruction.currency.id ?
                                                                            oneConstruction.price_start : Math.floor((oneConstruction.price_start * oneConstruction.currency.value) / value.value)} displayType={'text'} thousandSeparator={true} />
                                                                       -<NumberFormat value={value.currency_id === oneConstruction.currency.id ?
                                                                            oneConstruction.price_end : Math.floor((oneConstruction.price_end * oneConstruction.currency.value) / value.value)} displayType={'text'} thousandSeparator={true}/>
                                                                    </p>
                                                                })}
                                                            </ol>
                                                        </ul>
                                                    </div>
                                                </div>
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
                                            <span className="badge" style={{fontSize:'18px'}}>
                                                {oneConstruction.start_date && oneConstruction.end_date &&
                                                  Math.floor(((new Date().getTime() - formatDate(oneConstruction.start_date)) / (formatDate(oneConstruction.end_date)- formatDate(oneConstruction.start_date))) * 100)+' %'
                                                }
                                            </span>
                                            <div className="tooltip-auto-choose">
                                                <i className="fa fa-question-circle-o"/>
                                                <span className="tooltiptext" style={{width:'200px'}}>
                                                    {t('const_percent_text')}
                                                </span>
                                            </div>
                                        </div>
                                            <p>
                                            <img alt={"calendar"} width={32} src={publicUrl + '/assets/img/icons/calendar.png'}/>{oneConstruction.start_date} : {oneConstruction.end_date}
                                        </p>
                                        <p>
                                            <img alt={"keyLogo"} src={publicUrl + '/assets/img/icons/key.png'}/>{t('available2') + " " + oneConstruction.available_apartments +"/"+oneConstruction.apartment_counts}
                                        </p>
                                        <p>
                                            <img alt={"areaLogo"} src={publicUrl + '/assets/img/icons/measured.png'}/>{t("general_area")}: {oneConstruction.area} {t("m")}²
                                        </p>
                                        <p>
                                            <img alt={"parkingLogo"} src={publicUrl + '/assets/img/icons/car.png'}/>{t('parking') + " " + oneConstruction.available_parking + "/" + oneConstruction.parking}
                                        </p>
                                        <p>
                                            <img alt={"floorLogo"} src={publicUrl + '/assets/img/icons/floor.png'}/>{t('floor_height') + " " + oneConstruction.floor_height + t('m')}
                                        </p>
                                        <Link to={'/construction-details-test/' + oneConstruction.id}>Test</Link>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    {oneConstruction.const_agency &&
                                        <Link to={'/constructor-agency/' + oneConstruction.const_agency.id}>
                                            <div className="single-explore p-3">
                                                <div className='d-flex flex-row align-items-center bg-white pl-2'>
                                                    <div className="card-img">
                                                        <img
                                                            src={oneConstruction.const_agency && oneConstruction.const_agency.image ? apiUrl + "storage/uploads/constructor_agencies/" + oneConstruction.const_agency.image : default_image}
                                                            alt="const-agency"/>
                                                    </div>
                                                    <div className='d-flex flex-column ml-3'>
                                                        <p className='card-text-1'>
                                                            {oneConstruction.const_agency && oneConstruction.const_agency.translations.map((value, i) => {
                                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                            })}
                                                        </p>
                                                        <p className='card-text-2'>{t('const_agency')}</p>
                                                    </div>
                                                </div>
                                                <div className='d-flex flex-column mt-3 const_agency_info'>
                                                    <div className='d-flex'>
                                                        <i className="fa fa-home fa-lg"></i>
                                                        <p className='card-text-3 pl-2'>
                                                            {oneConstruction.const_agency && oneConstruction.const_agency.state && oneConstruction.const_agency.state.translations.map((value, i) => {
                                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                            })}
                                                            &#160;
                                                            {oneConstruction.const_agency && oneConstruction.const_agency.city && oneConstruction.const_agency.city.translations.map((value, i) => {
                                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <i className="fa fa-envelope fa-lg"></i>
                                                        <p className='card-text-3 pl-2'>{oneConstruction.const_agency ? oneConstruction.const_agency.email : ""}</p>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <i className="fa fa-phone fa-lg"></i>
                                                        <p className='card-text-3 pl-2'>{oneConstruction.const_agency ? oneConstruction.const_agency.phone : ""}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="brokerTab">
                    <ul className="nav">
                        <li className="nav-item">
                            <button className="nav-link active" data-toggle="tab" href="#apartments">
                                <div className="border-bottom-line">{t('apartments')}</div>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-toggle="tab" href="#description">
                                <div className="border-bottom-line">{t('description')}</div>
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
                        <div className="tab-pane show active" id="apartments">
                            <div className="col-12">
                                <div id="image-map-floors-container"/>
                                <div id="image-map-plans-container"/>
                            </div>
                        </div>
                        <div className="tab-pane show" id="description">
                            <div className="col-12">
                                <div>
                                    {oneConstruction.translations && oneConstruction.translations.map((value, i) => {
                                        return <p key={i} dangerouslySetInnerHTML={{__html: (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.property_description : ""}}/>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane show" id="features">
                            <div className="col-12">
                                <div>
                                    {oneConstruction.translations && oneConstruction.translations.map((value, i) => {
                                        return <p key={i} dangerouslySetInnerHTML={{__html: (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.features : ""}}/>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane show" id="renovation">
                            <div className="col-12">
                                <div>
                                    {oneConstruction.translations && oneConstruction.translations.map((value, i) => {
                                        return <p key={i} dangerouslySetInnerHTML={{__html: (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.renovation : ""}}/>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane show" id="live">
                            <div className="col-12">
                                <iframe src={oneConstruction.live_video_url} title="description"  height="600px" width="735px"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
}

export default ConstructionDetails