import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {YMaps, Map, Placemark, Polygon, ZoomControl} from 'react-yandex-maps';
import polygons from '../../data/coordinates.json';
import {setModal} from "../../reducers/modalsReducer";
import {add_favorite, remove_favorite} from "../../actions/favorite";
import {auth} from "../../actions/auth";
import {announcements, get_search, get_user_favorites} from "../../actions/announcement";
import {css} from "@emotion/react";
import {PulseLoader} from "react-spinners";
import {Dropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import NumberFormat from "react-number-format";

const AnnouncementsGrid = (props) => {
    const publicUrl = process.env.PUBLIC_URL;
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const default_image = publicUrl + "/assets/img/default.png";
    let category = props.data && props.data.cat ? props.data.cat : 1;
    let place = useSelector(state => state.announcement.places);
    const history = useHistory();
    const {t} = props;
    const [currentCoordinates, setCurrentCoordinates] = useState()
    const [sortByOpen, setSortByOpen] = useState(false);
    const toggleSortBy = () => setSortByOpen(prevState => !prevState);
    const dispatch = useDispatch();
    const [poligonCoordinates, setPoligonCoordinates] = useState([]);
    const [zoom, setZoom] = useState();
    const lng = localStorage.getItem('i18nextLng') ? localStorage.getItem('i18nextLng') : "am";
    const spinner = useSelector(state => state.modals.spinner)
    const isLogin = () => {
        dispatch(setModal("login"));
    }
    let favorites = useSelector(state => state.announcement.favorites)
    let user = useSelector(state => state.auth.currentUser)
    const searchParams = useSelector(state => state.announcement.searchParams)
    let resources = useSelector(state => state.announcement.announcements)
    let allCoordinates = useSelector(state => state.announcement.allAnnouncements)
    let total_count = useSelector(state => state.announcement.total_count)
    const currencies = useSelector(state => state.announcement.currencies);
    useEffect(() => {
        async function response() {
            if (place.length && polygons.coordinates[place[place.length - 1].id] && polygons.coordinates[place[place.length - 1].id].length > 0) {
                setPoligonCoordinates(polygons.coordinates[place[place.length - 1].id])
                setZoom(place[place.length - 1].map_zoom)
                setCurrentCoordinates(place[place.length - 1].coordinates)
            }else if(place.length && place[place.length - 1].id && !polygons.coordinates[place[place.length - 1].id]){
                const id = place[place.length - 1].id ? place[place.length - 1].id.split(',') : "1";
                setPoligonCoordinates(polygons.coordinates[id[0]])
                setZoom(place[place.length - 1].map_zoom)
                setCurrentCoordinates(place[place.length - 1].coordinates)
            } else {
                setPoligonCoordinates(polygons.coordinates["1"])
                setZoom(11)
                setCurrentCoordinates([40.177628, 44.512546]);
            }
        }

        response()
        if (!user.id) {
            dispatch(auth())
        }
        dispatch(get_user_favorites(user.id));
    }, [dispatch, category, lng, user.id, place])
    const currentPage = useSelector(state => state.announcement.currentPage)
    const scrollFunction = async () => {
        const maxHeight = document.getElementsByClassName('scrollCss')[0].scrollHeight - document.getElementsByClassName('scrollCss')[0].clientHeight
        const currentHeight = document.getElementsByClassName('scrollCss')[0].scrollTop
        if (maxHeight <= currentHeight) {
            dispatch(announcements(searchParams, ['category', searchParams.category], currentPage));
        }
    }
    const mapOptions = {
        preset: "islands#redCircleDotIcon",
        hideIconOnBalloonOpen: false,
        openEmptyBalloon: true,
        open: true,
        iconImageSize: [30, 42],
        iconImageOffset: [-3, -42],
    };

    const [mapListToggle, setMapListToggle] = useState('false')

    const openMapIcon = publicUrl + "/assets/img/icons/open-map.png";
    const openListIcon = publicUrl + "/assets/img/icons/open-list.png";
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
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: red;
    `;
    const sortBy = (value, type) => {
        dispatch(get_search(searchParams, ['sort_by', [value, type]]));
    }
    const fun = (id) => {
        setTimeout(() => {
            const element = document.getElementsByClassName("ymaps-2-1-79-balloon__content");
            element[0].addEventListener('click',()=>{
                contentClick(id)
            })
        }, 500)

    }

    const contentClick = (id) => {
        window.location.href = "/property-details/"+id;
        const element = document.getElementsByClassName("ymaps-2-1-79-balloon__content");
        element[0].removeEventListener('click',contentClick)
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
    const priceFormat = (item) =>{
        let price;
        item.currency && currencies.map((value, key) => {
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
        item.currency && currencies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.local !== "en")
                currency = value.name;
            }
        })
        return ' '+currency;
    }
    const PrefixFormat = (item) =>{
        let currency = ' ';
        item.currency && currencies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.local === "en")
                currency = value.name;
            }
        })
        return currency+' ';
    }
    return <div className="search-page-wrap ">
        <div className="announcement-container">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mt-3 mg-bottom-10 ">
                <div className="announcement-container-top">
                    <div className={'map-list-toggle-container'} onClick={()=>{setMapListToggle(v=>!v)}}>
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
                    <div className="">
                        <Dropdown isOpen={sortByOpen} toggle={toggleSortBy}>
                            <DropdownToggle className="sort-by-dropdown-toggle search-bar-components sort-by-button-mobile">
                                <div className="sq-single-select">
                                    {t('sort_by')}
                                    <img className={sortByOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                         src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-type sort-by-mobile">
                                <div className="rld-single-input mg-top-10">
                                    <div className="sq-single-select">
                                        <ul style={{paddingLeft: 0}}>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleSortBy()
                                                    sortBy('price', 'asc')
                                                }}>
                                                {t('price_low_high')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleSortBy()
                                                    sortBy('price', 'desc')
                                                }}>
                                                {t('price_high_low')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleSortBy()
                                                    sortBy('created_at', 'desc')
                                                }}>
                                                {t('date_newest_first')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleSortBy()
                                                    sortBy('created_at', 'asc')
                                                }}>
                                                {t('date_oldest_first')}
                                            </ol>
                                        </ul>
                                    </div>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className=" text-right mg-top-10 res-count">
                        {total_count} {t('results')}
                    </div>
                </div>
                <div className="announcement-list-container-desktop announcement-list-container scrollCss" onScroll={scrollFunction}>
                    <div className="">
                        {spinner ?
                            <div className="spinner_content">
                                <div className="sweet-loading">
                                    <PulseLoader color={"#BE1E2D"} css={override} loading={true} size={16}/>
                                </div>
                            </div>
                            :
                            <div className="row">
                                {resources.length ? resources.map((item, i) =>
                                        <div key={i} className="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-12 mg-top-30">
                                            <div className="single-feature-announcement listing-content"
                                                 onClick={(e) => {
                                                     linkTo(e, item.id)
                                                 }}>
                                                <div className="thumb">
                                                    <img className="thumb-image "  src={item.main_image ? apiUrl + 'storage/uploads/announcements/' + item.main_image : default_image} alt={item.address}/>
                                                    <span className='forSale'>
                                                            <li className="point">
                                                                <span style={{color: '#011728'}}>
                                                                    {item.category && item.category.translations.map((value, i) => {
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
                                                    <a href={"/property-details/"+item.id}>
                                                    <div className="details">
                                                        <h6 className="price">
                                                            <NumberFormat value={priceFormat(item)} displayType={'text'} thousandSeparator={true} prefix={PrefixFormat(item)} suffix={currencyFormat(item)}/>
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
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ) :
                                    t('no_result')
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12  mg-top-30 map-container" style={{width: '100%', height: '100vh'}}>
                <YMaps query={{apikey: process.env.REACT_APP_Y_API_KEY, lang: 'en'}}>
                    <Map width="100%" height="90vh" state={{center: currentCoordinates, zoom: zoom}}>
                        {allCoordinates.map((announcement, i) =>
                            <Placemark key={i}
                                       geometry={[announcement.latitude, announcement.longitude]}
                                       options={mapOptions}
                                       draggable={true}
                                       onClick={()=>{fun(announcement.id)}}
                                       properties={{
                                           balloonContent: `<a href=${'/property-details/' + announcement.id}><strong>${announcement.currency && announcement.currency.name}  ${announcement.price}</br> ${announcement.address} </strong></a>`,
                                           iconCaption: `${announcement.currency && announcement.currency.name} ${announcement.price}`,
                                           open: true,
                                       }}

                                       modules={['geoObject.addon.balloon']}
                            />)}
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
                        <ZoomControl/>
                    </Map>
                </YMaps>
            </div>
            <div className={'announcement-list-map'}>
                {mapListToggle ?
                    <div className="announcement-list-container scrollCss" onScroll={scrollFunction}>
                        <div className="">
                            {spinner ?
                                <div className="spinner_content">
                                    <div className="sweet-loading">
                                        <PulseLoader color={"#BE1E2D"} css={override} loading={true} size={16}/>
                                    </div>
                                </div>
                                :
                                <div className="row">
                                    {resources.length ? resources.map((item, i) =>
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
                                                                    {item.category && item.category.translations.map((value, i) => {
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
                                        ) :
                                        t('no_result')
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    :
                    <div className="col-xl-6 col-lg-6 col-md-12  mg-top-30 " style={{width: '100%', height: '100vh'}}>
                        <YMaps query={{apikey: process.env.REACT_APP_Y_API_KEY, lang: 'en'}}>
                            <Map width="100%" height="90vh" state={{center: currentCoordinates, zoom: zoom}}>
                                {allCoordinates.map((announcement, i) =>
                                    <Placemark key={i}
                                               geometry={[announcement.latitude, announcement.longitude]}
                                               options={mapOptions}
                                               draggable={true}
                                               onClick={()=>{fun(announcement.id)}}
                                               properties={{
                                                   balloonContent: `<a href=${'/property-details/' + announcement.id}><strong>${announcement.price} ${announcement.currency && announcement.currency.name}</br> ${announcement.address} </strong></a>`,
                                                   iconCaption: `${announcement.price} ${announcement.currency && announcement.currency.name}`,
                                                   open: true,
                                               }}

                                               modules={['geoObject.addon.balloon']}
                                    />)}
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
                                <ZoomControl/>
                            </Map>
                        </YMaps>
                    </div>
                }
            </div>
        </div>
    </div>
}

export default AnnouncementsGrid
