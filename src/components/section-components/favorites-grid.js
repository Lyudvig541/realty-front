import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {get_favorites} from "../../actions/announcement";
import {Link, useHistory} from 'react-router-dom';
import {auth} from "../../actions/auth";
import {add_favorite, remove_favorite} from "../../actions/favorite";
import {PulseLoader} from "react-spinners";
import NumberFormat from "react-number-format";

const FavoritesGrid = (props) => {
    const publicUrl = process.env.PUBLIC_URL;
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const history = useHistory();
    const {t} = props;
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.currentUser);
    let data = useSelector(state => state.announcement.allFavorites);
    const favoriteSpinner = useSelector(state => state.profile.favoriteListingSpinner)
    const currencies = useSelector(state => state.announcement.currencies);

    useEffect(() => {
        const $ = window.$;
        if ($('.single-select').length) {
            $('.single-select').niceSelect();
        }

        async function getData() {
            if(!user.id){
                await dispatch(auth());
            }
        }
        getData();
        dispatch(get_favorites(user.id));
    }, [dispatch,user.id,data.length])

    const addFavorite = (e, id) => {
        if(!user.id){
            dispatch(auth())
        }
        if(e.currentTarget.className === "activeHeart"){
            dispatch(remove_favorite(id,user.id));
        }else {
            dispatch(add_favorite(id,user.id));
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
            return price;
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
            return currency;
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
            return currency;
        })
        return currency+' ';
    }


    const linkTo = (e, id) => {
        e.stopPropagation()
        if (e.target.className !== 'fa fa-heart' && e.target.className !== 'activeHeart') {
            history.push(`/property-details/${id}`);
        }
    }

    return <div className="favorites-page-wrap">
        <div className="container">
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12  mg-top-10">
                    {favoriteSpinner ?
                        <div className="spinner_content">
                            <div className="sweet-loading">
                                <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                            </div>
                        </div>
                        :
                        <div className="row mg-auto">
                            {data.length ? data.map((item, i) =>
                                <div key={i} className="col-xl-6 col-sm-12 col-lg-6 col-12 col-md-6">
                                    <div className="single-feature-announcement listing-content favoritesCard"
                                             onClick={(e) => {
                                                 linkTo(e, item.announcement.id)
                                             }}>
                                        <div className="thumb" style={{height: 250}}>
                                            <img style={{height: '100%', width: '100%'}} src={item.announcement && item.announcement.main_image ? apiUrl + 'storage/uploads/announcements/' + item.announcement.main_image : process.env.PUBLIC_URL+"/assets/img/default.png"} alt='...'/>
                                            <span className='forSale'>
                                                <li className="point">
                                                    <span style={{color: '#011728'}}>
                                                        {item.announcement.category && item.announcement.category.translations.map((value, i) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                        })}
                                                    </span>
                                                </li>
                                            </span>
                                            <span onClick={(e) => {
                                                addFavorite(e, item.announcement.id)
                                            }} className="activeHeart">
                                            <i className="fa fa-heart"/>
                                        </span>
                                        </div>
                                        <Link to={`/property-details/${item.announcement.id}`}>
                                            <div className="details">
                                                <h6 className="price">
                                                    <NumberFormat value={priceFormat(item.announcement)} displayType={'text'} thousandSeparator={true} prefix={PrefixFormat(item.announcement)} suffix={currencyFormat(item.announcement)} />
                                                </h6>
                                                <h6 className="readeal-top">
                                                    <i className="fa fa-map-marker"/>
                                                    { item.announcement.address && item.announcement.address.length > 40 ? item.announcement.address.slice(0, 40) + '...': item.announcement.address}
                                                </h6>
                                                <ul className="info-list-announcement">
                                                    <li><img alt={item.area}
                                                             src={publicUrl + '/assets/img/icons/measured.png'} /> {item.announcement.area}
                                                    </li>
                                                    {item.announcement.rooms ?
                                                        <li><i className="fa fa-bed"/> {item.rooms} {t('bed')}
                                                        </li> : null}
                                                    {item.announcement.bathroom ? <li><i
                                                        className="fa fa-bath"/> {item.announcement.bathroom} {t('bath')}
                                                    </li> : null}
                                                </ul>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                            )
                            :<div className="col-12 text-center mt-3">
                                <h3>{t('no_favorite')}</h3>
                            </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
}

export default FavoritesGrid
