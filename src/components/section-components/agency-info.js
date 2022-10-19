import React, {useEffect} from 'react';
import {useDispatch, useSelector,} from "react-redux";
import {agency, agency_announcements, agency_brokers_announcements} from "../../actions/resources";
import {useHistory, useParams} from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import NumberFormat from "react-number-format";
import {setModal} from "../../reducers/modalsReducer";
import {auth} from "../../actions/auth";
import {add_favorite, remove_favorite} from "../../actions/favorite";
import {currencies, get_user_favorites} from "../../actions/announcement";
import {Helmet} from "react-helmet";


const AgencyInfo = (props) => {
    const inlineStyle = {
        backgroundColor: '#FBFBFB',
    }
    const history = useHistory();
    const publicUrl = process.env.PUBLIC_URL;
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const default_image = publicUrl + "/assets/img/default.png";
    const default_broker_image = publicUrl + "/assets/img/broker.jpg";
    const allCurrencies = useSelector(state => state.announcement.currencies);
    let {id} = useParams();
    const {t} = props;
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(agency(id));
        dispatch(agency_announcements(id));
        dispatch(agency_brokers_announcements(id));
        dispatch(get_user_favorites(user.id));
        dispatch(currencies());
    }, [dispatch, id])
    let data = useSelector(state => state.resources.agency);
    let announcements = useSelector(state => state.resources.announcements);
    const user = useSelector(state => state.auth.currentUser);
    const linkTo = (e, id) => {
        e.stopPropagation()
        if (e.target.className !== 'fa fa-heart-o cursor' && e.target.className !== 'fa fa-heart activeHeart cursor') {
            history.push(`/property-details/${id}`);
        }
    }
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
    let favorites = useSelector(state => state.announcement.favorites)
    const isFavorite = (id) => {
        for (const idKey in favorites) {
            if (favorites[idKey].announcement_id === id)
                return true;
        }
        return false;
    }
    const priceFormat = (item) => {
        let price;
        item.currency && allCurrencies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")) {
                if (value.id === item.currency.id) {
                    price = item.price;
                } else {
                    price = Math.floor((item.price * item.currency.value) / value.value)
                }
            }
        })
        return price;
    }
    const currencyFormat = (item) => {
        let currency = ' ';
        item.currency && allCurrencies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")) {
                if (value.local !== "en")
                    currency = value.name;
            }
        })
        return ' ' + currency;
    }
    const PrefixFormat = (item) => {
        let currency = ' ';
        item.currency && allCurrencies.map((value, key) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")) {
                if (value.local === "en")
                    currency = value.name;
            }
        })
        return currency + ' ';
    }
    return <div style={inlineStyle}>
        <Helmet>
            <meta charSet="utf-8"/>
            <title>{t('meta_agency_info')}</title>
            <meta name="description" content={data.translations && data.translations.map((value, i) => {
                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.description : null
            })}/>
        </Helmet>
        <div className="container pd-top-100">
            <div className="row">
                <div className="col-lg-4 col-md-5">
                    <div className="single-user-list single-feature">
                        <div className="brokerImg">
                            <img src={apiUrl + 'storage/uploads/users/' + data.avatar} alt={"..."}/>
                        </div>
                        <div className="details ">
                            <h4>
                                <a href={'#first_name'}>{data.translations && data.translations.map((value, i) => {
                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : ""
                                })}</a>
                            </h4>
                            <p><i
                                className="fa fa-map-marker"/> {data.country ? data.country.name : ""} {data.state ? data.state.name : ""} {data.city ? data.city.name : ""}
                            </p>
                            <span className="phone"><i className="fa fa-phone"/>{data.phone}</span>
                        </div>
                    </div>
                    <div className="container brokerInfo pd-top-30">
                        <h6>{t('professional_information')}</h6>
                        <div className="row">
                            <div className="col-lg-5 col-md-6 col-sm-3 col-5">
                                <p>{t('address')}:</p>
                            </div>
                            <div className="col-lg-7 col-md-6 col-sm-5 col-7">
                                <p>{data.state ? data.state.name : ""} {data.city ? data.country.city : ""} </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-5 col-md-6 col-sm-3 col-5">
                                <p>{t('cell_phone')}:</p>
                            </div>
                            <div className="col-lg-7 col-md-6 col-sm-5 col-7">
                                <p>{data.phone}</p>
                            </div>
                        </div>
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
                    <div className=" container brokerTab pd-top-30 mg-bottom-30">
                        <div className="container">
                            <ul className="nav">
                                <li className="nav-item">
                                    <button className="nav-link" data-toggle="tab" href="#properties">
                                        <div className="border-bottom-line">{t('properties')}</div>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" data-toggle="tab" href="#brokers">
                                        <div className="border-bottom-line">{t('brokers')}</div>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link active" data-toggle="tab" href="#about">
                                        <div className="border-bottom-line">{t('about')}</div>
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content pd-top-20">

                                <div className="tab-pane show" id="properties">
                                    <div className="container row">
                                        {announcements.length ? announcements.map((item, i) =>
                                                <div key={i}
                                                     className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-12 mg-top-30">
                                                    <div className="single-feature-announcement listing-content"
                                                         onClick={(e) => {
                                                             linkTo(e, item.id)
                                                         }}
                                                         style={{inlineSize: 'fit-content'}}>
                                                        <div className="thumb" style={{height: 250}}>
                                                            <img className="thumb-image" style={{height: '100%'}}
                                                                 src={item.main_image ? apiUrl + 'storage/uploads/announcements/' + item.main_image : default_image}
                                                                 alt={item.property_name}/>
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
                                                                    <NumberFormat value={priceFormat(item)}
                                                                                  displayType={'text'}
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
                                            ) :
                                            t('no_result')
                                        }
                                    </div>
                                </div>
                                <div className="tab-pane show" id="brokers">
                                    <div className="container">
                                        <div className="row">
                                            {data.brokers ? data.brokers.map((item, i) =>
                                                <div key={i} className="col-lg-4 col-md-4 col-xl-4 col-sm-4">
                                                    <div
                                                        className={"single-user-list single-feature single-broker-feature"}
                                                        onClick={() => history.push('/agent/' + item.id)}>
                                                        <div className="brokerImg">
                                                            <img
                                                                src={item.avatar ? apiUrl + 'storage/uploads/users/' + item.avatar : default_broker_image}
                                                                alt={item.first_name ? item.first_name : ''}/>
                                                        </div>
                                                        <div className="details">
                                                            {
                                                                <a href="#feature-logo" className="feature-logo">
                                                                    <img
                                                                        src={apiUrl + 'storage/uploads/users/' + data.avatar}
                                                                        alt={'...'}/>
                                                                </a>
                                                            }
                                                            <h6>
                                                                {item.first_name}
                                                            </h6>
                                                            <h6>
                                                                {item.last_name}
                                                            </h6>
                                                            <div className='row broker-rating'>
                                                                <ReactStars
                                                                    value={item.rating}
                                                                    count={5}
                                                                    size={18}
                                                                    activeColor="#FAA61A"
                                                                    emptyIcon={<i className="far fa-star"/>}
                                                                    halfIcon={<i className="fa fa-star-half-alt"/>}
                                                                    fullIcon={<i className="fa fa-star"/>}
                                                                    isHalf={true}
                                                                    edit={false}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane show active" id="about">
                                    <div className="container">
                                        <p>{data.translations && data.translations.map((value, i) => {
                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.description : null
                                        })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default AgencyInfo