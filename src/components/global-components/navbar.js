import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import i18n from "i18next";
import ReactFlagsSelect from 'react-flags-select';
import {useDispatch, useSelector} from "react-redux";
import {setModal} from "../../reducers/modalsReducer";
import Modals from "../auth/modals";
import {logout} from "../../reducers/authReducer";
import {get_search_agent} from "../../actions/request";
import {getSearchParams} from "../../reducers/agentReducer";
import {Badge} from 'reactstrap';
import AutocompleteReact from 'react-autocomplete';
import {agents} from "../../actions/resources";
import {unreadNotifications} from "../../actions/notifications";
import Moment from 'moment';
import {allPlaces} from "../../actions/places";
import {get_places, get_search, set_selected_places} from "../../actions/announcement";
import {setLocale} from "../../reducers/localeReducer";
import {getUnreadMessages} from "../../actions/auth";


const Navbar = (props) => {
    const publicUrl = process.env.PUBLIC_URL;
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const history = useHistory();
    const data = props.data ? props.data : {}
    const mainNavbar = data.mainNavbar ? data.mainNavbar : " "
    const navBarFixedClass = data.navBarFixedClass ? data.navBarFixedClass : " ";
    const no_search = data.no_search ? data.no_search : false;
    const blackLogo = data.blackLogo ? data.blackLogo : "hidden-for-scroll "
    const searchAgent = data.searchAgent ? data.searchAgent : "hidden-for-scroll"
    const searchBar = data.searchBar ? data.searchBar : " "
    const logo = data.logo ? data.logo : " "
    const default_avatar = publicUrl + "/assets/img/author/default_avatar.png";
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuth)
    const user = useSelector(state => state.auth.currentUser)
    const modal = useSelector(state => state.modals.modal)
    const {t} = props;
    let lang_code = localStorage.getItem('i18nextLng');
    const [language, setLanguage] = useState(lang_code ? lang_code.toUpperCase() : "AM")
    const searchParams = useSelector(state => state.agent.search_params)
    const searchAnnouncementParams = useSelector(state => state.announcement.searchParams)
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [suggestion, setSuggestion] = useState({});
    const [place_value, setPlaceValue] = useState('');
    const locale = useSelector(state => state.locale.locale);
    const unread_messages = useSelector(state => state.auth.unreadMessages);
    const [mobileNavbar, setMobileNavbar] = useState(false);
    let names = [];
    let agentsData = useSelector(state => state.agent.names);
    const [burger, setBurger] = useState('')
    const [display, setDisplay] = useState('');

    useEffect(() => {
        if (isAuth && !user.phone_number_verified_at && !modal) {
            dispatch(setModal('phone_number_verification'));
        }

        if (searchAgent !== "hidden-for-scroll") {
            if (!agentsData.length) {
                dispatch(agents())
            }
        }
        dispatch(get_places())

        async function notifications() {
            await dispatch(unreadNotifications())
        }

        if (isAuth) {
            dispatch(getUnreadMessages(user.id))
            notifications();
        }
        places(locale)
    }, [dispatch, agentsData.length, searchAgent, isAuth, locale, modal, user.phone_number_verified_at, user.id])

    async function places(locale) {
        let language = locale === 'us' ? 'en' : locale;
        let places = await dispatch(allPlaces())
        let sorted = places.sort(compareLocale)
        let result = [];
        for (var key in sorted) {
            if (sorted[key].locale === language) {
                result.push(sorted[key])
                delete sorted[key]
            }
        }
        let sorted_places = result.concat(sorted)
        setSuggestions(sorted_places)
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

    agentsData && agentsData.map((item) => {
        return names.push(item.first_name + " " + item.last_name)
    })

    const setName = async () => {
        const data = ['name', value];
        let setParam = {...searchParams, name: value}
        await dispatch(getSearchParams(setParam));
        dispatch(get_search_agent(1, searchParams, data))
    }

    const handleOnclick = (code) => {
        dispatch(setLocale(code.toLowerCase() === 'us' ? 'en' : code.toLowerCase()));
        places(code.toLowerCase())
        setLanguage(code);
        i18n.changeLanguage(code.toLowerCase())
    }

    let unread_notifications = useSelector(state => state.notifications.unread_notifications)

    const [values, setValues] = useState(names);

    const checkLogin = () => {
        if (isAuth) {
            history.push(`/sell`);
        } else {
            dispatch(setModal("login"))
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        window.location.href = '/'
    }

    const hendleAutocomplete = (value) => {
        let arr = [];
        names.map((item, key) => {
            if (item.search(value) > -1) {
                arr.push(item)
            }
            return arr;
        })
        setValues(arr);
    }

    const handleSearch = async () => {
        dispatch(get_search(searchAnnouncementParams, ['place', suggestion.id]));
        dispatch(set_selected_places(suggestion))
    }

    return <div>
        <div className={"navbar-area " + navBarFixedClass + " "}>
            <nav className={mainNavbar + " navbar navbar-area navbar-expand-lg " + navBarFixedClass} id={'navbar'}>
                <div className={`container nav-container ${display}`}>
                    <div className="responsive-mobile-menu">
                        <button className={`menu toggle-btn d-block d-lg-none ${burger}`}
                                data-toggle="collapse"
                                data-target="#realdeal_main_menu"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                                onClick={() => {
                                    setMobileNavbar(!mobileNavbar);
                                    if (burger === 'open') {
                                        setBurger('')
                                        setDisplay('')
                                    } else {
                                        setBurger('open')
                                        setDisplay('d-block')
                                    }
                                }}
                        >
                            <span className="icon-left"/>
                            <span className="icon-right"/>
                        </button>
                    </div>
                    <div className={"logo readeal-top " + logo}>
                        <Link to="/"><img src={publicUrl + "/assets/img/logo.png"} alt="logo"/></Link>
                    </div>

                    <div className={"logo-black readeal-top " + blackLogo}>
                        <Link to="/"><img className={'margin-left'} src={publicUrl + "/assets/img/logo-black.png"}
                                          alt="logo"/></Link>
                    </div>
                    <div className={'mobile-menu-item'}>
                        <div className="collapse navbar-collapse " id="realdeal_main_menu">
                            <ul className="navbar-nav menu-open readeal-top">
                                <li>
                                    <div className="nav-right-part nav-right-part-mobile">
                                        <Link className="btn btn-main-color" to='#' onClick={() => {
                                            checkLogin()
                                        }}><p className={'text-white'}>{t('add_listing')}</p></Link>
                                    </div>
                                </li>
                                <li>
                                    <ReactFlagsSelect className="langChange flag-container" selected={language}
                                                      countries={["US", "AM", "RU",]}
                                                      customLabels={{"US": "Eng", "AM": "Հայ", "RU": "Ру"}}
                                                      onSelect={handleOnclick}/>
                                </li>
                                {isAuth && <li>
                                    <Link to={{
                                        pathname: "/profile",
                                        state: {key: 1}
                                    }}>
                                        {t('profile')}
                                    </Link>
                                </li>}
                                <li className="menu-item-has-children current-menu-item">
                                    {!isAuth &&
                                    <Link to="#" onClick={() => dispatch(setModal("login"))}>{t('login')}</Link>
                                    }
                                    {isAuth &&
                                    <>
                                        <p className={'menu-text'}>{t("notification")}</p>
                                        <Badge className="notifications-count">
                                            {unread_notifications.length > 0 ? unread_notifications.length : ''}
                                        </Badge>
                                    </>
                                    }
                                </li>

                                {isAuth &&
                                <>
                                    <li>
                                        <Link to={{pathname: "/profile", state: {key: 2}}}>
                                            {t('my_announcements')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={{pathname: "/profile", state: {key: 3}}}>
                                            {t('favorites')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={{pathname: "/profile", state: {key: 4}}}>
                                            {t('messages')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/" onClick={() => handleLogout()}>
                                            {t('logout')}
                                        </Link>
                                    </li>
                                </>
                                }
                            </ul>
                        </div>
                    </div>
                    <div className={" nav-center-part  ml-4 " + searchBar}>
                        <div className="sq-banner-search">
                            <div className="sq-single-input left-icon fixed-nav-suggest">
                                {!no_search &&
                                <>
                                    <i className="fa fa-map-marker search-icon"/>
                                    <AutocompleteReact
                                        wrapperStyle={{display: 'unset'}}
                                        shouldItemRender={(item, place_value) => item.name.toString().toLowerCase().indexOf(place_value.toString().toLowerCase()) > -1}
                                        getItemValue={(item) => item.name}
                                        inputProps={{placeholder: t("search_places")}}
                                        items={suggestions}
                                        menuStyle={{
                                            borderRadius: '3px',
                                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            padding: '2px 0',
                                            fontSize: '90%',
                                            position: 'fixed',
                                            overflow: 'auto',
                                            maxHeight: '50%',
                                            top: '',
                                            left: '',
                                            textAlign: 'left',
                                        }}
                                        renderItem={(item, isHighlighted) =>
                                            <div key={item.key} style={{
                                                cursor: 'pointer',
                                                background: isHighlighted ? 'lightgray' : 'white'
                                            }}>
                                                <i className="fa fa-map-marker autocomplete-icon"/>
                                                <span className="autocomplete-span">
                                                    {item.name}
                                                </span>
                                            </div>
                                        }
                                        value={place_value}
                                        onChange={e => setPlaceValue(e.target.value)}
                                        onSelect={(place_value, event) => {
                                            setPlaceValue(place_value)
                                            setSuggestion(event)
                                        }
                                        }
                                    />
                                    <button className="btn-home3 sqtop" onClick={() => {
                                        handleSearch();
                                    }}><i className="fa fa-search fixed-nav-icon"/></button>
                                </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={"col-5 nav-center-part ml-4 " + searchAgent}>
                        <div className="sq-banner-search">
                            <div className="sq-single-input fixed-nav-suggest display-flex">
                                {!no_search &&
                                <>
                                    <AutocompleteReact
                                        wrapperStyle={
                                            {display: 'unset'}
                                        }
                                        getItemValue={(item) => item}
                                        items={values}
                                        inputProps={{placeholder: t('first_name') + " " + t('last_name')}}
                                        renderItem={(item, isHighlighted) => {
                                            return (
                                                <div key={item} style={{
                                                    cursor: 'pointer',
                                                    background: isHighlighted ? 'lightgray' : 'white'
                                                }}>
                                                    <i className="fa fa-user autocomplete-icon"/>
                                                    <span className="autocomplete-span">
                                                        {item}
                                                    </span>
                                                </div>
                                            )
                                        }}
                                        value={value}
                                        onChange={(e) => {
                                            hendleAutocomplete(e.target.value)
                                            setValue(e.target.value)
                                        }}
                                        id="name"
                                        onSelect={(val) => setValue(val)}/>
                                    <button className="btn-home3" onClick={setName}><i
                                        className="fa fa-search fixed-nav-icon"/></button>
                                </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav menu-open">
                            {!isAuth &&
                            <li>
                                <Link to="#" onClick={() => dispatch(setModal("login"))}>{t('login')}</Link>
                            </li>
                            }
                            {isAuth && <>
                                <li className="menu-item-has-children current-menu-item" onClick={() => {
                                    history.push(`/notifications`);
                                }}>

                                    <i className="fa fa-bell-o notifications-icon"/>
                                    <Badge className="notifications-count">
                                        {unread_notifications.length > 0 ? (unread_notifications.length < 9 ? unread_notifications.length : '9+') : ''}
                                    </Badge>
                                    {unread_notifications.length ?
                                        <ul className="sub-menu notificationScroll ">
                                            {unread_notifications.length ? unread_notifications.map((item, i) =>
                                                <li key={i} className="notification-item">
                                                    <Link to="/notifications">
                                                        <p className="notification-text">{item.title}</p>
                                                        <p className="notification-date">{Moment(item.created_at).format('DD-MM-YYYY')}</p>
                                                    </Link>
                                                </li>
                                            ) : ""}
                                        </ul> : ""
                                    }
                                </li>
                                <li className="menu-item-has-children current-menu-item">
                                    <img className={"profileImg"}
                                         src={user && user.avatar ? apiUrl + 'storage/uploads/users/' + user.avatar : default_avatar}
                                         alt={'profileImg'}/>
                                    <Badge className="messages-count">
                                        {unread_messages.length > 0 ? unread_messages.length : ''}
                                    </Badge>
                                    <ul className="sub-menu">
                                        {user && user.phone_number_verified_at ?
                                            <li>
                                                <p className="text_li">
                                                    <img src={publicUrl + "/assets/img/icons/check.png"}
                                                         alt="verified_user"/>&nbsp;&nbsp;
                                                    {t('account_verified')}
                                                </p>
                                            </li> : ""}
                                        <li>
                                            <Link to={{
                                                pathname: "/profile",
                                                state: {key: 1}
                                            }}>
                                                <i className="fa fa-user"
                                                   aria-hidden="true">&nbsp;&nbsp;{t('profile')}</i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={{
                                                pathname: "/profile",
                                                state: {key: 2}
                                            }}>
                                                <i className="fa fa-history"
                                                   aria-hidden="true">&nbsp;&nbsp;{t('my_announcements')}</i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={{
                                                pathname: "/profile",
                                                state: {key: 3}
                                            }}>
                                                <i className="fa fa-heart">&nbsp;&nbsp;{t('favorites')}</i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={{
                                                pathname: "/profile",
                                                state: {key: 4}
                                            }}>
                                                <i className="fa fa-envelope"
                                                   aria-hidden="true">&nbsp;&nbsp;{t('messages')}</i>
                                                <Badge className="messages-count-in-drop-down">
                                                    {unread_messages.length > 0 ? unread_messages.length : ''}
                                                </Badge>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/" onClick={() => handleLogout()}>
                                                <i className="fa fa-sign-out"
                                                   aria-hidden="true">&nbsp;&nbsp;{t('logout')}</i>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </>
                            }
                        </ul>
                    </div>
                    <div className="nav-right-part nav-right-part-desktop sq-top" id={'realdeal_main_menu'}>
                        <Link className="btn btn-main-color" to='#' onClick={() => {
                            checkLogin()
                        }}>{t('add_listing')}</Link>
                    </div>
                    {isAuth ?
                        <div className="nav-right-part nav-right-part-desktop sq-top">
                            <Link to={{
                                pathname: "/profile",
                                state: {key: 3}
                            }}><i className={'favorites-icon fa fa-heart-o'}/></Link>
                        </div> : ""}
                    <div className="nav-right-part nav-right-part-desktop sq-top">
                        <ReactFlagsSelect className="langChange" selected={language}
                                          countries={["US", "AM", "RU",]}
                                          customLabels={{"US": "Eng", "AM": "Հայ", "RU": "Ру"}}
                                          onSelect={handleOnclick}/>
                    </div>
                    <div className={'mobile-search-input-container' + searchBar}>
                        <div className={"  mobile-search-input " + searchBar}>
                            <div className="sq-banner-search">
                                <div className="sq-single-input left-icon fixed-nav-suggest">
                                    {!no_search &&
                                    <>
                                        <i className="fa fa-map-marker search-icon"/>
                                        <AutocompleteReact
                                            wrapperStyle={
                                                {display: 'unset'}
                                            }
                                            shouldItemRender={(item, place_value) => item.name.toString().toLowerCase().indexOf(place_value.toString().toLowerCase()) > -1}
                                            getItemValue={(item) => item.name}
                                            inputProps={{placeholder: t("search_places")}}
                                            items={suggestions}
                                            menuStyle={{
                                                borderRadius: '3px',
                                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                padding: '2px 0',
                                                fontSize: '90%',
                                                position: 'fixed',
                                                overflow: 'auto',
                                                maxHeight: '50%',
                                                top: '',
                                                left: '',
                                                textAlign: 'left',
                                            }}
                                            renderItem={(item, isHighlighted) =>
                                                <div key={item.key} style={{
                                                    cursor: 'pointer',
                                                    background: isHighlighted ? 'lightgray' : 'white'
                                                }}>
                                                    <i className="fa fa-map-marker autocomplete-icon"/>
                                                    <span className="autocomplete-span">
                                                    {item.name}
                                                </span>
                                                </div>
                                            }
                                            value={place_value}
                                            onChange={e => setPlaceValue(e.target.value)}
                                            onSelect={(place_value, event) => {
                                                setPlaceValue(place_value)
                                                setSuggestion(event)
                                            }
                                            }
                                        />
                                        <button className="btn-home3 sqtop" onClick={() => {
                                            handleSearch();
                                        }}><i className="fa fa-search fixed-nav-icon"/></button>
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'mobile-search-input-container' + searchAgent}>
                        <div className={"  mobile-search-input " + searchAgent}>
                            <div className="sq-banner-search">
                                <div className="sq-single-input fixed-nav-suggest display-flex">
                                    {!no_search &&
                                    <>
                                        <AutocompleteReact
                                            wrapperStyle={
                                                {display: 'unset'}
                                            }
                                            getItemValue={(item) => item}
                                            items={values}
                                            inputProps={{placeholder: t('first_name') + " " + t('last_name')}}
                                            renderItem={(item, isHighlighted) => {
                                                return (
                                                    <div key={item} style={{
                                                        cursor: 'pointer',
                                                        background: isHighlighted ? 'lightgray' : 'white'
                                                    }}>
                                                        <i className="fa fa-user autocomplete-icon"/>
                                                        <span className="autocomplete-span">
                                                                        {item}
                                                                    </span>
                                                    </div>
                                                )
                                            }}
                                            value={value}
                                            onChange={(e) => {
                                                hendleAutocomplete(e.target.value)
                                                setValue(e.target.value)
                                            }}
                                            id="name"
                                            onSelect={(val) => setValue(val)}/>
                                        <button className="btn-home3" onClick={setName}><i
                                            className="fa fa-search fixed-nav-icon"/></button>
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <Modals/>
    </div>
}


export default Navbar
