import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Map, Placemark, Polygon, YMaps} from "react-yandex-maps";
import {useDispatch, useSelector} from "react-redux";
import {all_constructions, constructions} from "../../actions/construction";
import {PulseLoader} from "react-spinners";
import {css} from "@emotion/react";
import NumberFormat from "react-number-format";
import {currencies} from "../../actions/announcement";
import polygons from "../../data/coordinates.json";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import Pagination from "./pagination";
import {setSpinner} from "../../reducers/modalsReducer";

const ConstructionList = (props) => {

    let apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const default_image = publicUrl + "/assets/img/default.png";
    const {t} = props;
    const dispatch = useDispatch();
    const [poligonCoordinates, setPoligonCoordinates] = useState([]);
    const allConstructors = useSelector(state => state.construction.allConstructions);
    const spinner = useSelector(state => state.modals.spinner);
    const searchParams = useSelector(state => state.construction.searchParams);
    useEffect(() => {
        async function response() {
            setPoligonCoordinates(polygons.coordinates[searchParams.region || "1"])
        }

        dispatch(all_constructions(searchParams.region));
        response();
    }, [dispatch, searchParams.region]);
    useEffect(() => {
        dispatch(currencies());
        dispatch(constructions([], [null, null], 1))
    }, [dispatch]);
    let allConstructions = useSelector(state => state.construction.constructions)
    const mapOptions = {
        preset: "islands#redCircleDotIcon",
        hideIconOnBalloonOpen: false,
        openEmptyBalloon: true,
        open: true,
        iconImageSize: [30, 42],
        iconImageOffset: [-3, -42],
    };
    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;`;

    const openMapIcon = publicUrl + "/assets/img/icons/open-map.png";
    const openListIcon = publicUrl + "/assets/img/icons/open-list.png";
    const [mapListToggle, setMapListToggle] = useState('false')
    const getPageConstructors = (page) => {
        dispatch(setSpinner(true));
        dispatch(constructions(searchParams, [null, null], page));
    }
    return <div className="pd-top-20" style={{backgroundColor: '#FBFBFB'}}>
        <div className="search-container construction-container-desktop">
            <div className="container-fluid" style={{width: '103%'}}>
                <div className="row">
                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 scrollCss">
                        <div>
                            {allConstructions.last_page && allConstructions.last_page > 1 ?
                                <Pagination data2={allConstructions} getPage={getPageConstructors} count={3}
                                            styles={"padding"}/>
                                : ""}
                            {spinner ?
                                <div className="spinner_content">
                                    <div className="sweet-loading">
                                        <PulseLoader color={"#BE1E2D"} css={override} loading={true} size={16}/>
                                    </div>
                                </div>
                                :
                                allConstructions.data ? allConstructions.data.map((item, i) =>
                                    <Link to={'/construction-details/' + item.id} key={i}>
                                        <div key={i} className="single-feature style-two construction">
                                            <div className="thumb">
                                                <LazyLoadImage
                                                    alt={item.property_name && item.property_name}
                                                    height="220px"
                                                    src={item.main_image ? apiUrl + 'storage/uploads/constructors/' + item.main_image : default_image}
                                                />
                                            </div>
                                            {item.const_agency ?
                                                <div className="single-feature-details">
                                                    <div className="constructor-feature-logo">
                                                        <LazyLoadImage
                                                            alt={item.const_agency && item.const_agency.first_name}
                                                            src={item.const_agency && item.const_agency.avatar ? apiUrl + 'storage/uploads/users/' + item.const_agency.avatar : default_image}
                                                        />
                                                    </div>
                                                </div> : ""}
                                            <div className="construction-wrap ">
                                                <div>
                                                    <span className="constructionTitle">
                                                        {item.translations.map((value) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.property_name : null
                                                        })}
                                                    </span>
                                                    <br/>
                                                    <span className="constructionSubTitle">
                                                                {item.translations.map((value) => {
                                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.sub_title : null
                                                                })}
                                                            </span>
                                                    <br/>
                                                    <span className="constructionPrice">
                                                        <NumberFormat value={item.price_start}
                                                                      displayType={'text'}
                                                                      prefix={item.currency && item.currency.local === 'en' ? item.currency.name + ' ' : ' '}
                                                                      thousandSeparator={true}/>
                                                        <NumberFormat value={item.price_end}
                                                                      prefix={item.currency && item.currency.local === 'en' ? " -" + " " + item.currency.name + ' ' : ''}
                                                                      displayType={'text'}
                                                                      thousandSeparator={true}/>
                                                    </span>
                                                </div>
                                                <p>
                                                    <i className="fa fa-map-marker"/> {item.translations.map((value) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.address : null
                                                })}</p>
                                                <p>
                                                    <i className="fa fa-calendar-o"
                                                       aria-hidden="true"> {item.start_date} : {item.end_date}</i>
                                                </p>
                                                <p>
                                                    <img alt={"keyLogo"}
                                                         src={publicUrl + '/assets/img/icons/key.png'}/> {t('available2') + " " + item.available_apartments + "/" + item.apartment_counts}
                                                </p>
                                                <p>
                                                    <img alt={"areaLogo"}
                                                         src={publicUrl + '/assets/img/icons/measured.png'}/> {item.area} {t('m')}²
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ) : t('no_result')
                            }
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-7 col-md-7" style={{height: '925px'}}>
                        <YMaps query={{apikey: process.env.REACT_APP_Y_API_KEY}}>
                            <Map width="100%" height="100%" defaultState={{center: [40.135282, 44.512432], zoom: 12}}>
                                {allConstructors.length ? allConstructors.map((construct, i) =>
                                    <Placemark key={i}
                                               geometry={[construct.latitude, construct.longitude]}
                                               options={mapOptions}
                                               draggable={true}
                                               properties={{
                                                   balloonContent: `<a href=${'/construction-details/' + construct.id}><strong>${construct.currency && construct.currency.name}${construct.price_start} ${construct.price_end ? ' - ' + (construct.currency && ' ' + construct.currency.name) + construct.price_end : ''}</br> ${construct.address} </strong></a>`,
                                                   iconCaption: `${construct.currency && ' ' + construct.currency.name}${construct.price_start} ${construct.price_end ? ' - ' + (construct.currency && ' ' + construct.currency.name) + construct.price_end : ''}`,
                                                   open: true,
                                               }}
                                               modules={['geoObject.addon.balloon']}/>) : ""}

                                <Polygon
                                    geometry={poligonCoordinates}
                                    options={{
                                        fillColor: '#BE1E2D',
                                        fillOpacity: 0.04,
                                        strokeColor: '#BE1E2D',
                                        strokeOpacity: 0.9,
                                        strokeWidth: 2,
                                    }}
                                />
                            </Map>
                        </YMaps>
                    </div>
                </div>
            </div>
        </div>
        <div className={'construction-list-map'}>
            <div className={'construction-container-top'}>
                <div className={'map-list-toggle-container ml-3 mb-3'} onClick={() => {
                    setMapListToggle(v => !v)
                }}>
                    {mapListToggle ?
                        <div className={'map-list-toggle'}>
                            <img src={openMapIcon} alt=""/>
                            <p>{t('open_map')}</p>
                        </div>
                        :
                        <div className={'map-list-toggle'}>
                            <img src={openListIcon} alt=""/>
                            <p>{t('open_list')}</p>
                        </div>

                    }
                </div>
            </div>
            {mapListToggle ?
                <div className="scrollCss">
                    <div>
                        {allConstructions.last_page && allConstructions.last_page > 1 ?
                            <Pagination data2={allConstructions} getPage={getPageConstructors} count={3}
                                        styles={"padding"}/>
                            : ""}
                        {spinner ?
                            <div className="spinner_content">
                                <div className="sweet-loading">
                                    <PulseLoader color={"#BE1E2D"} css={override} loading={true} size={16}/>
                                </div>
                            </div>
                            : allConstructions.data ? allConstructions.data.map((item, i) =>
                                <div key={i} className={'mb-3'}>
                                    <Link to={'/construction-details/' + item.id}>
                                        <div key={i}
                                             className="single-feature style-two construction construction-card-container">
                                            <div className={'construction-card-img'}>
                                                <div className="construction-card-main-image">
                                                    <LazyLoadImage
                                                        alt={item.property_name}
                                                        height="220px"
                                                        src={item.main_image ? apiUrl + 'storage/uploads/constructors/' + item.main_image : default_image}
                                                    />
                                                </div>
                                                {item.const_agency ?
                                                    <div className="construction-card-sec-image">
                                                        <LazyLoadImage
                                                            alt={item.const_agency && item.const_agency.first_name}
                                                            src={item.const_agency && item.const_agency.avatar ? apiUrl + 'storage/uploads/users/' + item.const_agency.avatar : default_image}
                                                        />
                                                    </div> : ""}
                                            </div>
                                            <div className="construction-wrap construction-wrap-mobile">
                                                <div className="">
                                                    <div className="">
                                                            <span className="constructionTitle">
                                                                {item.translations.map((value) => {
                                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.property_name : null
                                                                })}
                                                            </span>
                                                        <br/>
                                                        <span className="constructionSubTitle">
                                                                {item.translations.map((value) => {
                                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.sub_title : null
                                                                })}
                                                            </span>
                                                        <br/>
                                                        <span className="constructionPrice">
                                                            {item.currency && item.currency.local !== 'en' ? ' ' + item.currency.name : ''}
                                                            <NumberFormat value={item.price_start && item.price_start}
                                                                          displayType={'text'}
                                                                          prefix={item.currency && item.currency.local === 'en' ? item.currency.name + ' ' : ''}
                                                                          thousandSeparator={true}/> - {item.currency && item.currency.local !== 'en' ? ' ' + item.currency.name : ''}
                                                            <NumberFormat value={item.price_end && item.price_end}
                                                                          displayType={'text'}
                                                                          thousandSeparator={true}/>

                                                        </span>
                                                    </div>
                                                </div>
                                                <p>
                                                    <i className="fa fa-map-marker"/> {item.translations.map((value) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.address : null
                                                })}</p>
                                                <p>
                                                    <i className="fa fa-calendar-o"
                                                       aria-hidden="true"> {item.start_date} : {item.end_date}</i>
                                                </p>
                                                <p>
                                                    <img alt={"keyLogo"}
                                                         src={publicUrl + '/assets/img/icons/key.png'}/> {t('available') + " " + item.available_apartments + "/" + item.apartment_counts}
                                                </p>
                                                <p>
                                                    <img alt={"areaLogo"}
                                                         src={publicUrl + '/assets/img/icons/measured.png'}/> {item.area} {t('m')}²
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ) : t('no_result')}
                    </div>
                    }
                </div>
                :
                <div className="" style={{height: '925px'}}>
                    <YMaps query={{apikey: process.env.REACT_APP_Y_API_KEY}}>
                        <Map width="100%" height="100%" defaultState={{center: [40.135282, 44.512432], zoom: 12}}>
                            {allConstructors.length ? allConstructors.map((construct, i) =>
                                <Placemark key={i}
                                           geometry={[construct.latitude, construct.longitude]}
                                           options={mapOptions}
                                           draggable={true}
                                           properties={{
                                               balloonContent: `<a href=${'/construction-details/' + construct.id}><strong>${construct.currency && ' ' + construct.currency.name} ${construct.price_start} - ${construct.currency && ' ' + construct.currency.name} ${construct.price_end} </br> ${construct.address} </strong></a>`,
                                               iconCaption: `${construct.currency && ' ' + construct.currency.name} ${construct.price_start} - ${construct.currency && ' ' + construct.currency.name} ${construct.price_end}`,
                                               open: true,
                                           }}
                                           modules={['geoObject.addon.balloon']}/>) : ""}

                            <Polygon
                                geometry={poligonCoordinates}
                                options={{
                                    fillColor: '#BE1E2D',
                                    fillOpacity: 0.04,
                                    strokeColor: '#BE1E2D',
                                    strokeOpacity: 0.9,
                                    strokeWidth: 2,
                                }}
                            />
                        </Map>
                    </YMaps>
                </div>
            }
        </div>
    </div>

}

export default ConstructionList