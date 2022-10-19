import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import NumberFormat from "react-number-format";
import {auth} from "../../actions/auth";
import {add_favorite, remove_favorite} from "../../actions/favorite";
import {setModal} from "../../reducers/modalsReducer";
import {get_user_favorites} from "../../actions/announcement";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";


const Card = () => {
    const dispatch = useDispatch();
    const priceFormat = (item) =>{
        let price;
        item.currency && currencies.map((value) => {
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
        item.currency && currencies.map((value) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.local !== "en")
                    currency = value.name;
            }
        })
        return ' '+currency;
    }
    const PrefixFormat = (item) =>{
        let currency = ' ';
        item.currency && currencies.map((value) => {
            if (localStorage.i18nextLng === value.local || (localStorage.i18nextLng === "us" && value.local === "en")){
                if (value.local === "en")
                    currency = value.name;
            }
        })
        return currency+' ';
    }
    const {t} = useTranslation();

    const publicUrl = process.env.PUBLIC_URL;
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const default_image = publicUrl + "/assets/img/default.png";
    let user = useSelector(state => state.auth.currentUser)
    const currencies = useSelector(state => state.announcement.currencies);
    const history = useHistory();
    let resources = useSelector(state => state.announcement.announcements)
    useEffect(() => {
        if (!user.id) {
            dispatch(auth())
        }
        dispatch(get_user_favorites(user.id));
    }, [dispatch, user.id,])
    let favorites = useSelector(state => state.announcement.favorites)

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
    return <div className="user-list-area pd-top-100 pd-bottom-70">
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
                            </div>
                        </div>
                    </div>
                ) :
                t('no_result')
            }
    </div>
}

export default Card