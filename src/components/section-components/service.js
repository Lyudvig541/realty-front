import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import AutocompleteReact from "react-autocomplete";
import {useDispatch, useSelector} from "react-redux";
import {allPlaces} from "../../actions/places";
import {setSelectPlaces} from "../../reducers/announcementReducer";
import {setModal} from "../../reducers/modalsReducer";

const Service = (props) => {

    const dispatch = useDispatch()
    const history = useHistory();
    const [toggle, setToggle] = useState(false);
    const [category, setCategory] = useState('');
    const [value, setValue] = useState('');
    const [suggestion, setSuggestion] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const locale = useSelector(state => state.locale.locale)
    const isAuth = useSelector(state => state.auth.isAuth)

    async function getData(locale) {
        let language = locale === 'us' ? 'en' : locale;
        let places = await dispatch(allPlaces())
        let sorted = places.sort(compareLocale)
        let result = [];
        for (var key in sorted) {
            if (sorted[key].locale === language){
                result.push(sorted[key])
                delete sorted[key]
            }
        }
        let sorted_places = result.concat(sorted)
        setSuggestions(sorted_places)
    }

    useEffect(() => {
        getData(locale);
    }, [dispatch,locale])

    const checkLogin = () => {
        if (isAuth) {
            history.push(`/sell`);
        } else {
            dispatch(setModal("login"))
        }
    }
    document.addEventListener('keydown', logKey);
    let i = false;
    function logKey(e) {
        if(e.code === "Enter" && value && !i) {
            i = true;
            handleSearch();
        }
    }
    function compareLocale(a, b) {
        const locale1 = a.locale;
        const locale2 = b.locale;
        let comparison = 0;
        if (locale1 > locale2) {
            comparison = 1;
        } else if (locale1 < locale2) {
            comparison = -1;
        }
       return comparison;
    }

    const handleClose = () => {
        setToggle(false)
        setCategory('')
        setValue('')
    }

    const handleOpen = (id) => {
        setToggle(true)
        setCategory(id)
        getData(locale);
    }

    const handleSearch = () => {
        if (Object.keys(suggestion).length > 0) {
            let addresses = localStorage.addresses && JSON.parse(localStorage.addresses).length > 0 ? JSON.parse(localStorage.addresses) : [];
            let new_address = [];
            let result = [];
            if (addresses.length > 0) {
                addresses.forEach((value, index) => {
                    if (value.id === suggestion.id) {
                        addresses.splice(index, 1);
                    }
                })
                addresses.push({
                    id: suggestion.id,
                    name: suggestion.name,
                    coordinates: suggestion.coordinates.split(',').map(Number),
                    map_zoom:suggestion.map_zoom ? suggestion.map_zoom : 12,
                    key: suggestion.key
                });
                new_address = addresses;
            } else {
                new_address = [{
                    id: suggestion.id,
                    name: suggestion.name,
                    coordinates: suggestion.coordinates.split(',').map(Number),
                    map_zoom:suggestion.map_zoom ? suggestion.map_zoom : 12,
                    key: suggestion.key
                }];
            }
            if (new_address.length > 4) {
                result = new_address.slice(Math.max(new_address.length - 4, 1))
            } else {
                result = new_address
            }
            localStorage.removeItem("addresses")
            localStorage.setItem("addresses", JSON.stringify(result))
            dispatch(setSelectPlaces(result))
            history.push({
                pathname: '/announcements',
                state: { cat: category, suggestion: suggestion }
            });
        }
    }

    let publicUrl = process.env.PUBLIC_URL;
    const {t} = props;
    return <div className="service-area h1-service-slider-area">
        <div className="container">
            <div className="service-slider row">
                <div key="1" className="item col-xl-3 col-lg-12 col-sm-12">
                    <div className="single-service cards">
                        <Link to="#" onClick={()=> {
                            handleOpen(1)
                        }}>
                            <div className="double-img">
                                <img src={publicUrl + "/assets/img/icons/buy.png"} alt="Buy"/>
                                <span className="cards-title">{t('buy')}</span>
                            </div>
                            <div className="details sq-top card-text">
                                <h4>{t('buy')}</h4>
                                <p >{t('buy_text')}</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div key="2" className="item col-xl-3 col-lg-12 col-sm-12">
                    <div className="single-service cards">
                        <Link to="#" onClick={()=> {
                            handleOpen(2)
                        }}>
                        <div className="double-img">
                            <img src={publicUrl + "/assets/img/icons/rent_icon.png"} alt="Rent"/>
                            <span className="cards-title">{t('rent')}</span>
                        </div>
                        <div className="details sq-top card-text">
                            <h4>{t('rent')}</h4>
                            <p >{t('rent_text')}</p>
                        </div>
                        </Link>
                    </div>
                </div>
                <div key="3" className="item col-xl-3 col-lg-12 col-sm-12">
                    <div className="single-service cards">
                        <Link to="/from-construction">
                        <div className="double-img">
                            <img src={publicUrl + "/assets/img/icons/construction.png"} alt="Construction"/>
                            <span className="cards-title">{t('construction')}</span>
                        </div>
                        <div className="details sq-top card-text">
                            <h4>{t('construction')}</h4>
                            <p>{t('construction_text')}</p>
                        </div>
                        </Link>
                    </div>
                </div>
                <div key="4" className="item col-xl-3 col-lg-12 col-sm-12">
                    <div className="single-service cards">
                        <Link to="#" onClick={() => {
                            checkLogin()
                        }}>
                            <div className="double-img">
                                <img src={publicUrl + "/assets/img/icons/sell.png"} alt="Sell"/>
                                <span className="cards-title">{t('add_listing')}</span>
                            </div>
                            <div className="details sq-top card-text">
                                <h4 >{t('add_listing')}</h4>
                                <p>{t('sell_text')}</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <Modal className="search-modal" isOpen={toggle} toggle={handleOpen}>
            <ModalHeader toggle={handleClose}/>
            <ModalBody>
                <div className="search-modal-area">
                    <div className="row justify-content-center">
                        <div className="col-xl-7 col-lg-9 text-center">
                            <h2 className="preview">{t('modal_title_1')}</h2>
                            <p>{t('modal_title_2')}</p>
                            <div className="sq-banner-search">
                                <div className="sq-single-input left-icon">
                                    <i className="fa fa-map-marker search-icon"/>
                                    <AutocompleteReact
                                        wrapperStyle={
                                            {display: 'unset'}
                                        }
                                        shouldItemRender={(item, value) => item.name.toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1}
                                        getItemValue={(item) => item.name}
                                        inputProps={{ placeholder: t("choose") }}
                                        items={suggestions}
                                        menuStyle={{
                                            borderRadius: '3px',
                                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            padding: '2px 0',
                                            fontSize: '90%',
                                            position: 'fixed',
                                            overflow: 'auto',
                                            maxHeight: '70%',
                                            top:'',
                                            left:'',
                                            textAlign:'left',
                                        }}
                                        renderItem={(item, isHighlighted) =>
                                            <div key={item.key} style={{ cursor:'pointer', background: isHighlighted ? 'lightgray' : 'white' }}>
                                                <i className="fa fa-map-marker autocomplete-icon"/>
                                                <span className="autocomplete-span">
                                                    {item.name}
                                                </span>
                                            </div>
                                        }
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        onSelect={(value, event) => {
                                                setValue(value)
                                                setSuggestion(event)
                                            }
                                        }
                                    />
                                    <button id="search_button" className="btn-home3 sqtop" onClick={() => { handleSearch(); }}>{t('search')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}

export default Service


