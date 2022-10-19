import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {currencies, get_categories, get_search, get_types} from "../../actions/announcement";
import {Alert, Dropdown, DropdownMenu} from 'reactstrap';
import {DropdownToggle} from "reactstrap";
import {setSelectPlaces} from "../../reducers/announcementReducer";

const SearchBar = (props) => {
    const dispatch = useDispatch();
    const {t} = props;
    const publicUrl = process.env.PUBLIC_URL;
    const filterIcon = publicUrl + "/assets/img/icons/filter-icon.png";
    const [priceOpen, setPriceOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [otherOpen, setOtherOpen] = useState(false);
    const togglePrice = () => setPriceOpen(prevState => !prevState);
    const toggleType = () => setTypeOpen(prevState => !prevState);
    const toggleCategory = () => setCategoryOpen(prevState => !prevState);
    const toggleOther = () => setOtherOpen(prevState => !prevState);
    const [category, setCategory] = useState(props.data && props.data.cat ? props.data.cat : 1);
    const [price, setPrice] = useState(0);
    const [type, setType] = useState('property_type');
    const [centerCoordinates] = useState([]);
    const [categoryName, setCategoryName] = useState((category === 1 && 'Sale') || (category === 2 && 'Rent') || 'property_for');
    const getTypes = useSelector(state => state.type.types);
    const getCurrencies = useSelector(state => state.announcement.currencies);
    const [searchParams, setSearchParams] = useState({
        category: category,
        type: '',
        land_type: '',
        furniture: '',
        minArea: '',
        maxArea: '',
        minPrice: '',
        currency: '',
        maxPrice: '',
        minSize: '',
        maxSize: '',
        rooms: '',
        floor: '',
        storeys: '',
        building_type: '',
        condition: '',
        ceiling_height: '',
        bathroom: '',
        state: '',
        city: '',
        land_geometric_appearance: '',
        front_position: '',
        purpose: '',
        place: '1',
    })
    useEffect(() => {
        dispatch(get_categories())
        dispatch(get_types())
        dispatch(currencies())
        const address = localStorage.addresses && JSON.parse(localStorage.addresses).length > 0 ? JSON.parse(localStorage.addresses) : [];
        if (address.length) {
            dispatch(get_search(searchParams, ['place', address[address.length - 1].id]));
        } else {
            dispatch(get_search(searchParams, ['place', 1]));
        }
    }, [dispatch, category, centerCoordinates, searchParams]);
    const [minPrice, setMinPrice] = useState(null)
    const [maxPrice, setMaxPrice] = useState(null)
    const addresses = useSelector(state => state.announcement.places)
    const changeMinPrice = (minPrice) => {
        setMinPrice(minPrice);
        setSearchParams({
            ...searchParams,
            'minPrice': minPrice
        })
        search(['minPrice', minPrice])
    }
    const searchBarChange = (name, value) => {
        name === "category" && setCategory(value);
        setSearchParams({
            ...searchParams,
            [name]: value
        })
        search([name, value])
    }
    const changeMaxPrice = (maxPrice) => {
        setMaxPrice(maxPrice);
        setSearchParams({
            ...searchParams,
            'maxPrice': maxPrice
        })
        search(['maxPrice', maxPrice])
    }
    const changeMinSize = (minSize) => {
        setSearchParams({
            ...searchParams,
            'minSize': minSize
        })
        search(['minSize', minSize])
    }
    const changeMaxSize = (maxSize) => {
        setSearchParams({
            ...searchParams,
            'maxSize': maxSize
        })
        search(['maxSize', maxSize]);
    }
    const search = (data) => {
        dispatch(get_search(searchParams, data));
    }
    const [visible] = useState(true);
    const onDismiss = (uid) => function () {
        addresses.map((value, i) => {
            if (uid === value.id)
                addresses.splice(i, 1)
            return addresses
        })
        localStorage.setItem("addresses", JSON.stringify(addresses))
        if (addresses.length > 0) {
            dispatch(setSelectPlaces([...addresses]))
        } else {
            dispatch(get_search(searchParams, ['place', 1]));
            dispatch(setSelectPlaces([]))
        }
    }
    const showRangeValue = (e) => {
        setPrice(e.target.value)
    }
    const rangeValue = (e) => {
        setSearchParams({
            ...searchParams,
            'maxPrice': Number(e.target.value)
        })
        search(['maxPrice', Number(e.target.value)]);
    }
    const handleSelectPlace = (address) => function () {

        addresses.forEach((value, index) => {
            if (value.id === address.id) {
                addresses.splice(index, 1);
            }
        })
        addresses.push({
            id: address.id,
            name: address.name,
            coordinates: address.coordinates,
            map_zoom: address.map_zoom,
            key: address.key
        });
        localStorage.removeItem("addresses")
        localStorage.setItem("addresses", JSON.stringify(addresses))
        dispatch(setSelectPlaces([...addresses]))
        search(['place', address.id])
    }

    const [filterModal, setFilterModal] = useState(false)
    const [mobileCategory, setMobileCategory] = useState(false)
    const [mobileType, setMobileType] = useState(false)
    const [mobilePrice, setMobilePrice] = useState(false)
    const [mobileMore, setMobileMore] = useState(false)

    const toggleMobileCategory = () => setMobileCategory(prevState => !prevState);
    const toggleMobileType = () => setMobileType(prevState => !prevState);
    const toggleMobilePrice = () => setMobilePrice(prevState => !prevState);
    const toggleMobileMore = () => setMobileMore(prevState => !prevState)

    return <div className='searchbar-container'>
        <div style={{background: '#F6F6F7', padding: 10}}>
            <div className="tab-pane fade show">
                <div className="rld-main-search ">
                    <div className="main-search-cont-div-cont half-width">
                        <div className="main-search-cont-div ">
                            {addresses.map((value, i) =>
                                <Alert key={i} color="light" isOpen={visible} toggle={onDismiss(value.id)}
                                       className="main-search-cont-input m-1 old_search_list">
                                    <div onClick={handleSelectPlace(value)}>
                                        <i className="fa fa-search mr-2"
                                           style={{color: "#BE1E2D"}}/> {value.name}
                                    </div>
                                </Alert>
                            )}
                        </div>
                    </div>
                    <div className="main-search-cont-div-cont-filter half-width">
                        <div className="search-bar-components mt-1 mr-4 filter-desktop full-width">
                            <div className="">
                                <Dropdown isOpen={categoryOpen} toggle={toggleCategory}>
                                    <DropdownToggle
                                        className="search-bar-dropdown-toggle search-bar-components">
                                        <div className="sq-single-select">
                                            {t(categoryName)}
                                            <img
                                                className={categoryOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                                src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                        </div>
                                    </DropdownToggle>
                                    <DropdownMenu className="search-bar-dropdown-buy">
                                        <div className="rld-single-input mg-top-10">
                                            <div className="sq-single-select">
                                                <ul style={{paddingLeft: 0}}>
                                                    <ol className={'search-bar-types-style'}
                                                        onClick={() => {
                                                            toggleCategory()
                                                            setCategoryName('property_for')
                                                            searchBarChange('category', '')
                                                        }}>
                                                        {t('property_for')}
                                                    </ol>
                                                    <ol className={'search-bar-types-style'}
                                                        onClick={() => {
                                                            toggleCategory()
                                                            setCategoryName('Sale')
                                                            searchBarChange('category', 1)
                                                        }}>
                                                        {t('Sale')}
                                                    </ol>
                                                    <ol className={'search-bar-types-style'}
                                                        onClick={() => {
                                                            toggleCategory()
                                                            setCategoryName('Rent')
                                                            searchBarChange('category', 2)
                                                        }}>
                                                        {t('Rent')}
                                                    </ol>
                                                </ul>
                                            </div>
                                        </div>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <div className="">
                                <Dropdown isOpen={typeOpen} toggle={toggleType}>
                                    <DropdownToggle
                                        className="search-bar-dropdown-toggle search-bar-components">
                                        <div className="sq-single-select">
                                            {type === 'property_type' ? t(type) : type.translations.map((value, i) => {
                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                            })}
                                            <img
                                                className={typeOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                                src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                        </div>
                                    </DropdownToggle>
                                    <DropdownMenu className="search-bar-dropdown-type">
                                        <div className="rld-single-input mg-top-10">
                                            <div className="sq-single-select">
                                                <ul style={{paddingLeft: 0}}>
                                                    <ol className={'search-bar-types-style'}
                                                        onClick={() => {
                                                            toggleType()
                                                            setType('property_type')
                                                            searchBarChange('type', '')
                                                        }}>
                                                        {t('property_type')}
                                                    </ol>
                                                    {getTypes.map((value, key) => (
                                                        <ol className={'search-bar-types-style'} key={key}
                                                            onClick={() => {
                                                                toggleType()
                                                                setType(value)
                                                                searchBarChange('type', value.id)
                                                            }}>
                                                            {value.translations.map((value, i) => {
                                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                            })}
                                                        </ol>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <div className="">
                                <Dropdown isOpen={priceOpen} toggle={togglePrice}>
                                    <DropdownToggle
                                        className="search-bar-dropdown-toggle search-bar-components">
                                        <div className="sq-single-select">
                                            {t('price')}
                                            <img
                                                className={priceOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                                src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                        </div>
                                    </DropdownToggle>
                                    <DropdownMenu className="search-bar-dropdown-price">
                                        <div className="container">
                                            <div className="rld-single-input mg-top-10">
                                                <div className="sq-single-select row">
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <label>{t('min')}</label>
                                                        <input value={minPrice ? minPrice : ''}
                                                               type="text" placeholder={t('max')} min='0'
                                                               onChange={(event) => {
                                                                   if (event.target.value >= 0) {
                                                                       changeMinPrice(event.target.value)
                                                                   }
                                                               }}

                                                        />

                                                    </div>
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <label>{t('max')}</label>
                                                        <input value={maxPrice ? maxPrice : ''}
                                                               onChange={(event) => {
                                                                   if (event.target.value >= 0) {
                                                                       changeMaxPrice(event.target.value)
                                                                   }
                                                               }} type="text" placeholder={t('max')}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rld-single-input mg-top-30">
                                                <div className="sq-single-select">
                                                    <select className="select single-select add-property-select"
                                                            name="currency"
                                                            onChange={(event) => {
                                                                searchBarChange(event.target.name, event.target.value)
                                                            }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        {getCurrencies.map((value, key) => {
                                                            return (
                                                                <option key={key} value={value.id}>
                                                                    {value.name}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                    <label className="mg-top-30">{price}</label>
                                                </div>
                                            </div>
                                            <input type="range" onChange={e => showRangeValue(e)} onMouseUp={e => rangeValue(e)} name="vol" min="0" max="100000000"/>
                                        </div>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <div className="">
                                <Dropdown isOpen={otherOpen} toggle={toggleOther}>
                                    <DropdownToggle
                                        className="search-bar-dropdown-toggle search-bar-components">
                                        <div className="sq-single-select">
                                            {t('more')}
                                            <img className={otherOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'} src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                        </div>
                                    </DropdownToggle>
                                    <DropdownMenu className="search-bar-dropdown-more">
                                        {(!type.id) && <div className="container">
                                            <div className="rld-single-input mg-top-10">
                                                <label>{t('area')} {t('m')}²</label>
                                                <div className="sq-single-select row">
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.minSize ? searchParams.minSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMinSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('min')}/>
                                                    </div>
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMaxSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('max')}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sq-single-select row mg-top-20">
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('number_of_bedrooms')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="bathroom"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('number_of_bathrooms')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="rooms"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="sq-single-select row mg-top-20">
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('floor')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="floor"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={0}>{t('basement')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                        <option value={7}>7+</option>
                                                        <option value={8}>8+</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('storeys')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="storeys"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                        <option value={7}>7+</option>
                                                        <option value={8}>8+</option>
                                                        <option value={9}>9+</option>
                                                        <option value={10}>10+</option>
                                                        <option value={11}>11+</option>
                                                        <option value={12}>12+</option>
                                                        <option value={13}>13+</option>
                                                        <option value={14}>14+</option>
                                                        <option value={15}>15+</option>
                                                        <option value={16}>16+</option>
                                                        <option value={17}>17+</option>
                                                        <option value={18}>18+</option>
                                                        <option value={19}>19+</option>
                                                        <option value={20}>20+</option>
                                                        <option value={21}>21+</option>
                                                        <option value={22}>22+</option>
                                                        <option value={23}>23+</option>
                                                        <option value={24}>24+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('building_type')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="building_type"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={"new_building"}>{t('new_building')}</option>
                                                    <option value={"monolith"}>{t('monolith')}</option>
                                                    <option value={"stone"}>{t('stone')}</option>
                                                    <option value={"panel"}>{t('panel')}</option>
                                                    <option value={"other"}>{t('other')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('condition')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="condition"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option
                                                        value={"zero_condition"}>{t('zero_condition')}</option>
                                                    <option value={"bad"}>{t('bad')}</option>
                                                    <option value={"middle"}>{t('middle')}</option>
                                                    <option value={"good"}>{t('good')}</option>
                                                    <option value={"excellent"}>{t('excellent')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20 pd-bottom-20">
                                                <label>{t('ceiling_height')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="ceiling_height"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={2.6}>2.6+</option>
                                                    <option value={2.8}>2.8+</option>
                                                    <option value={3.0}>3.0+</option>
                                                    <option value={3.2}>3.2+</option>
                                                    <option value={3.4}>3.4+</option>
                                                </select>
                                            </div>
                                        </div>}
                                        {(type.id === 1) && <div className="container">
                                            <div className="rld-single-input mg-top-10">
                                                <label>{t('area')} {t('m')}²</label>
                                                <div className="sq-single-select row">
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input value={searchParams.minSize ? searchParams.minSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMinSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('min')}/>
                                                    </div>
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMaxSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('max')}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rld-single-input mg-top-10">
                                                <label>{t('land_area')} {t('m')}²</label>
                                                <div className="sq-single-select row">
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input name={"land_area"} value={searchParams.minArea ? searchParams.minArea : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    searchBarChange('minArea',event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('min')}/>
                                                    </div>
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    searchBarChange('maxArea',event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('max')}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sq-single-select row mg-top-20">
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('number_of_bedrooms')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="bathroom"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('number_of_bathrooms')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="rooms"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="sq-single-select row mg-top-20">
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('condition')}</label>
                                                    <select className="select single-select add-property-select"
                                                            name="condition"
                                                            onChange={(e) => {
                                                                searchBarChange(e.target.name, e.target.value)
                                                            }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option
                                                            value={"zero_condition"}>{t('zero_condition')}</option>
                                                        <option value={"bad"}>{t('bad')}</option>
                                                        <option value={"middle"}>{t('middle')}</option>
                                                        <option value={"good"}>{t('good')}</option>
                                                        <option value={"excellent"}>{t('excellent')}</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('storeys')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="storeys"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                        <option value={7}>7+</option>
                                                        <option value={8}>8+</option>
                                                        <option value={9}>9+</option>
                                                        <option value={10}>10+</option>
                                                        <option value={11}>11+</option>
                                                        <option value={12}>12+</option>
                                                        <option value={13}>13+</option>
                                                        <option value={14}>14+</option>
                                                        <option value={15}>15+</option>
                                                        <option value={16}>16+</option>
                                                        <option value={17}>17+</option>
                                                        <option value={18}>18+</option>
                                                        <option value={19}>19+</option>
                                                        <option value={20}>20+</option>
                                                        <option value={21}>21+</option>
                                                        <option value={22}>22+</option>
                                                        <option value={23}>23+</option>
                                                        <option value={24}>24+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('building_type')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="building_type"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={"new_building"}>{t('new_building')}</option>
                                                    <option value={"monolith"}>{t('monolith')}</option>
                                                    <option value={"stone"}>{t('stone')}</option>
                                                    <option value={"panel"}>{t('panel')}</option>
                                                    <option value={"other"}>{t('other')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('furniture')}</label>
                                                <select
                                                    className="select single-select add-property-select"
                                                    name="furniture"
                                                    onChange={(e) => {
                                                        searchBarChange(e.target.name, e.target.value)
                                                    }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={true}>{t('furniture_available')}</option>
                                                    <option value={false}>{t('furniture_no_available')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20 pd-bottom-20">
                                                <label>{t('ceiling_height')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="ceiling_height"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={2.6}>2.6+</option>
                                                    <option value={2.8}>2.8+</option>
                                                    <option value={3.0}>3.0+</option>
                                                    <option value={3.2}>3.2+</option>
                                                    <option value={3.4}>3.4+</option>
                                                </select>
                                            </div>
                                        </div>}
                                        {(type.id === 2) && <div className="container">
                                            <div className="rld-single-input mg-top-10">
                                                <label>{t('area')} {t('m')}²</label>
                                                <div className="sq-single-select row">
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.minSize ? searchParams.minSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMinSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('min')}/>
                                                    </div>
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMaxSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('max')}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sq-single-select row mg-top-20">
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('number_of_bedrooms')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="bathroom"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('number_of_bathrooms')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="rooms"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="sq-single-select row mg-top-20">
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('floor')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="floor"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={0}>{t('basement')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                        <option value={7}>7+</option>
                                                        <option value={8}>8+</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('storeys')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="storeys"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                        <option value={7}>7+</option>
                                                        <option value={8}>8+</option>
                                                        <option value={9}>9+</option>
                                                        <option value={10}>10+</option>
                                                        <option value={11}>11+</option>
                                                        <option value={12}>12+</option>
                                                        <option value={13}>13+</option>
                                                        <option value={14}>14+</option>
                                                        <option value={15}>15+</option>
                                                        <option value={16}>16+</option>
                                                        <option value={17}>17+</option>
                                                        <option value={18}>18+</option>
                                                        <option value={19}>19+</option>
                                                        <option value={20}>20+</option>
                                                        <option value={21}>21+</option>
                                                        <option value={22}>22+</option>
                                                        <option value={23}>23+</option>
                                                        <option value={24}>24+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('building_type')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="building_type"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={"new_building"}>{t('new_building')}</option>
                                                    <option value={"monolith"}>{t('monolith')}</option>
                                                    <option value={"stone"}>{t('stone')}</option>
                                                    <option value={"panel"}>{t('panel')}</option>
                                                    <option value={"other"}>{t('other')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('condition')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="condition"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option
                                                        value={"zero_condition"}>{t('zero_condition')}</option>
                                                    <option value={"bad"}>{t('bad')}</option>
                                                    <option value={"middle"}>{t('middle')}</option>
                                                    <option value={"good"}>{t('good')}</option>
                                                    <option value={"excellent"}>{t('excellent')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('furniture')}</label>
                                                <select
                                                    className="select single-select add-property-select"
                                                    name="furniture"
                                                    onChange={(e) => {
                                                        searchBarChange(e.target.name, e.target.value)
                                                    }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={true}>{t('furniture_available')}</option>
                                                    <option value={false}>{t('furniture_no_available')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20 pd-bottom-20">
                                                <label>{t('ceiling_height')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="ceiling_height"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={2.6}>2.6+</option>
                                                    <option value={2.8}>2.8+</option>
                                                    <option value={3.0}>3.0+</option>
                                                    <option value={3.2}>3.2+</option>
                                                    <option value={3.4}>3.4+</option>
                                                </select>
                                            </div>
                                        </div>}
                                        {(type.id === 3) && <div className="container">
                                            <div className="rld-single-input mg-top-10">
                                                <label>{t('general_area')} {t('m')}²</label>
                                                <div className="sq-single-select row">
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.minSize ? searchParams.minSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMinSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('min')}/>
                                                    </div>
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMaxSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder={t('max')}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sq-single-select row mg-top-20">
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('number_of_bathrooms')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="rooms"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 col-xl-6 col-lg-6">
                                                    <label>{t('storeys')}</label>
                                                    <select
                                                        className="select single-select add-property-select"
                                                        name="storeys"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        <option value={1}>1+</option>
                                                        <option value={2}>2+</option>
                                                        <option value={3}>3+</option>
                                                        <option value={4}>4+</option>
                                                        <option value={5}>5+</option>
                                                        <option value={6}>6+</option>
                                                        <option value={7}>7+</option>
                                                        <option value={8}>8+</option>
                                                        <option value={9}>9+</option>
                                                        <option value={10}>10+</option>
                                                        <option value={11}>11+</option>
                                                        <option value={12}>12+</option>
                                                        <option value={13}>13+</option>
                                                        <option value={14}>14+</option>
                                                        <option value={15}>15+</option>
                                                        <option value={16}>16+</option>
                                                        <option value={17}>17+</option>
                                                        <option value={18}>18+</option>
                                                        <option value={19}>19+</option>
                                                        <option value={20}>20+</option>
                                                        <option value={21}>21+</option>
                                                        <option value={22}>22+</option>
                                                        <option value={23}>23+</option>
                                                        <option value={24}>24+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('building_type')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="building_type"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={"new_building"}>{t('new_building')}</option>
                                                    <option value={"monolith"}>{t('monolith')}</option>
                                                    <option value={"stone"}>{t('stone')}</option>
                                                    <option value={"panel"}>{t('panel')}</option>
                                                    <option value={"other"}>{t('other')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('condition')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="condition"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option
                                                        value={"zero_condition"}>{t('zero_condition')}</option>
                                                    <option value={"bad"}>{t('bad')}</option>
                                                    <option value={"middle"}>{t('middle')}</option>
                                                    <option value={"good"}>{t('good')}</option>
                                                    <option value={"excellent"}>{t('excellent')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('furniture')}</label>
                                                <select
                                                    className="select single-select add-property-select"
                                                    name="furniture"
                                                    onChange={(e) => {
                                                        searchBarChange(e.target.name, e.target.value)
                                                    }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={true}>{t('furniture_available')}</option>
                                                    <option value={false}>{t('furniture_no_available')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('land_type')}</label>
                                                <select
                                                    className="select single-select add-property-select"
                                                    name="land_type"
                                                    onChange={(e) => {
                                                        searchBarChange(e.target.name, e.target.value)
                                                    }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value="shops">{t('shops')}</option>
                                                    <option value="offices">{t('offices')}</option>
                                                    <option value="services">{t('services')}</option>
                                                    <option value="other">{t('other')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20 pd-bottom-20">
                                                <label>{t('ceiling_height')}</label>
                                                <select className="select single-select add-property-select"
                                                        name="ceiling_height"
                                                        onChange={(e) => {
                                                            searchBarChange(e.target.name, e.target.value)
                                                        }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={2.6}>2.6+</option>
                                                    <option value={2.8}>2.8+</option>
                                                    <option value={3.0}>3.0+</option>
                                                    <option value={3.2}>3.2+</option>
                                                    <option value={3.4}>3.4+</option>
                                                </select>
                                            </div>
                                        </div>}
                                        {type.id === 4 && <div className="container">
                                            <div className="rld-single-input mg-top-10">
                                                <label>{t('general_area')} m²</label>
                                                <div className="sq-single-select row">
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.minSize ? searchParams.minSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMinSize(event.target.value)
                                                                }
                                                            }} type="text" placeholder="Min"/>
                                                    </div>
                                                    <div className="col-md-6 col-xl-6 col-lg-6">
                                                        <input
                                                            value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                            onChange={(event) => {
                                                                if (event.target.value >= 0) {
                                                                    changeMaxSize(event.target.value)
                                                                }

                                                            }} type="text" placeholder="Max"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('front_position')}</label>
                                                <select
                                                    className="select single-select add-property-select"
                                                    name="front_position"
                                                    onChange={(e) => {
                                                        searchBarChange(e.target.name, e.target.value)
                                                    }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={"primary_and_secondary"}>{t('primary_and_secondary')}</option>
                                                    <option value={"primary"}>{t('primary')}</option>
                                                    <option value={"secondary"}>{t('secondary')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('purpose')}</label>
                                                <select
                                                    className="select single-select add-property-select"
                                                    name="purpose"
                                                    onChange={(e) => {
                                                        searchBarChange(e.target.name, e.target.value)
                                                    }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={'public_construction_of_settlements'}>{t('public_construction_of_settlements')}</option>
                                                    <option value={'residential_construction_of_settlements'}>{t('residential_construction_of_settlements')}</option>
                                                    <option value={'mixed_construction_of_settlements'}>{t('mixed_construction_of_settlements')}</option>
                                                </select>
                                            </div>
                                            <div className="sq-single-select mg-top-20">
                                                <label>{t('land_geometric')}</label>
                                                <select
                                                    className="select single-select add-property-select"
                                                    name="land_geometric_appearance"
                                                    onChange={(e) => {
                                                        searchBarChange(e.target.name, e.target.value)
                                                    }}
                                                >
                                                    <option value=''>{t('choose')}</option>
                                                    <option value={'0-2'}>{t('smooth')}</option>
                                                    <option value={'2-5'}>2-5 {t('degrees')}</option>
                                                    <option value={'5-10'}>5-10 {t('degrees')}</option>
                                                </select>
                                            </div>
                                        </div>}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>

                            <div className="" onClick={() => {
                                localStorage.removeItem('addresses')
                                window.location.reload(false);
                            }}>
                                <i className="fa fa-repeat" aria-hidden="true"></i>
                                <span style={{paddingLeft: 10}}>{t('reset')}</span>
                            </div>
                        </div>
                        <div className="search-bar-components filter-mobile">
                            <img src={filterIcon} onClick={() => { setFilterModal(v => !v) }} alt={"..."}/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        {filterModal ?
            <div className={'filter-modal-container'}>
                <div className={'close-button-container'}>
                    <button type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() => {
                                setFilterModal(v => !v)
                            }
                            }
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="filter-modal">

                    <div className="filter-modal-inner">
                        <Dropdown isOpen={mobileCategory} toggle={toggleMobileCategory}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components ">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {t(categoryName)}
                                    <img
                                        style={{width:20}}
                                        className={mobileCategory ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-type">
                                <div className="rld-single-input mg-top-10">
                                    <div className="sq-single-select">
                                        <ul style={{paddingLeft: 0}}>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileCategory()
                                                    setCategoryName('property_for')
                                                    searchBarChange('category', '')
                                                }}>
                                                {t('property_for')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileCategory()
                                                    setCategoryName('Sale')
                                                    searchBarChange('category', 1)
                                                }}>
                                                {t('Sale')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileCategory()
                                                    setCategoryName('Rent')
                                                    searchBarChange('category', 2)
                                                }}>
                                                {t('Rent')}
                                            </ol>
                                        </ul>
                                    </div>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="">
                        <Dropdown isOpen={mobileType} toggle={toggleMobileType}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {type === 'property_type' ? t(type) : type.translations.map((value, i) => {
                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                    })}
                                    <img
                                        style={{width:20}}
                                        className={mobileType ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-type">
                                <div className="rld-single-input mg-top-10">
                                    <div className="sq-single-select">
                                        <ul style={{paddingLeft: 0}}>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileType()
                                                    setType('property_type')
                                                    searchBarChange('type', '')
                                                }}>
                                                {t('property_type')}
                                            </ol>
                                            {getTypes.map((value, key) => (
                                                <ol className={'search-bar-types-style'} key={key}
                                                    onClick={() => {
                                                        toggleMobileType()
                                                        setType(value)
                                                        searchBarChange('type', value.id)
                                                    }}>
                                                    {value.translations.map((value, i) => {
                                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                    })}
                                                </ol>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="">
                        <Dropdown isOpen={mobilePrice} toggle={toggleMobilePrice}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {t('price')}
                                    <img
                                        style={{width:20}}
                                        className={mobilePrice ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className=" search-bar-dropdown-more">
                                <div className="container">
                                    <div className="rld-single-input mg-top-10">
                                        <div className="sq-single-select row">
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <label>{t('min')}</label>
                                                <input value={minPrice ? minPrice : ''}
                                                       type="text" placeholder={t('max')} min='0'
                                                       onChange={(event) => {
                                                           if (event.target.value >= 0) {
                                                               changeMinPrice(event.target.value)
                                                           }
                                                       }}

                                                />

                                            </div>
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <label>{t('max')}</label>
                                                <input value={maxPrice ? maxPrice : ''}
                                                       onChange={(event) => {
                                                           if (event.target.value >= 0) {
                                                               changeMaxPrice(event.target.value)
                                                           }
                                                       }} type="text" placeholder={t('max')}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rld-single-input mg-top-30">
                                        <div className="sq-single-select">
                                            <select className="select single-select add-property-select"
                                                    name="currency"
                                                    onChange={(event) => {
                                                        searchBarChange(event.target.name, event.target.value)
                                                    }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                {getCurrencies.map((value, key) => {
                                                    return (
                                                        <option key={key} value={value.id}>
                                                            {value.name}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                            <label className="mg-top-30">{price}</label>
                                        </div>
                                    </div>
                                    <input type="range" onChange={e => showRangeValue(e)}
                                           onMouseUp={e => rangeValue(e)} name="vol" min="0"
                                           max="100000000"/>

                                </div>
                                <div className={'justify-center'}>
                                    <button className={' btn btn-danger'} onClick={() => toggleMobilePrice()}>{t('search')}
                                    </button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="">
                        <Dropdown isOpen={mobileMore} toggle={toggleMobileMore}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {t('more')}
                                    <img
                                        style={{width:20}}
                                        className={mobileMore ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-more">
                                {(!type.id) && <div className="container">
                                    <div className="rld-single-input mg-top-10">
                                        <label>{t('area')} {t('m')}²</label>
                                        <div className="sq-single-select row">
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.minSize ? searchParams.minSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMinSize(event.target.value)
                                                        }
                                                    }} type="text" placeholder={t('min')}/>
                                            </div>
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMaxSize(event.target.value)
                                                        }
                                                    }} type="text" placeholder={t('max')}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sq-single-select row mg-top-20">
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('number_of_bedrooms')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="bathroom"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('number_of_bathrooms')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="rooms"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sq-single-select row mg-top-20">
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('floor')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="floor"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={0}>{t('basement')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                                <option value={7}>7+</option>
                                                <option value={8}>8+</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('storeys')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="storeys"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                                <option value={7}>7+</option>
                                                <option value={8}>8+</option>
                                                <option value={9}>9+</option>
                                                <option value={10}>10+</option>
                                                <option value={11}>11+</option>
                                                <option value={12}>12+</option>
                                                <option value={13}>13+</option>
                                                <option value={14}>14+</option>
                                                <option value={15}>15+</option>
                                                <option value={16}>16+</option>
                                                <option value={17}>17+</option>
                                                <option value={18}>18+</option>
                                                <option value={19}>19+</option>
                                                <option value={20}>20+</option>
                                                <option value={21}>21+</option>
                                                <option value={22}>22+</option>
                                                <option value={23}>23+</option>
                                                <option value={24}>24+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('building_type')}</label>
                                        <select className="select single-select add-property-select"
                                                name="building_type"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={"new_building"}>{t('new_building')}</option>
                                            <option value={"monolith"}>{t('monolith')}</option>
                                            <option value={"stone"}>{t('stone')}</option>
                                            <option value={"panel"}>{t('panel')}</option>
                                            <option value={"other"}>{t('other')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('condition')}</label>
                                        <select className="select single-select add-property-select"
                                                name="condition"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option
                                                value={"zero_condition"}>{t('zero_condition')}</option>
                                            <option value={"bad"}>{t('bad')}</option>
                                            <option value={"middle"}>{t('middle')}</option>
                                            <option value={"good"}>{t('good')}</option>
                                            <option value={"excellent"}>{t('excellent')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20 pd-bottom-20">
                                        <label>{t('ceiling_height')}</label>
                                        <select className="select single-select add-property-select"
                                                name="ceiling_height"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={2.6}>2.6+</option>
                                            <option value={2.8}>2.8+</option>
                                            <option value={3.0}>3.0+</option>
                                            <option value={3.2}>3.2+</option>
                                            <option value={3.4}>3.4+</option>
                                        </select>
                                    </div>
                                </div>}
                                {(type.id === 1) && <div className="container">
                                    <div className="rld-single-input mg-top-10">
                                        <label>{t('area')} {t('m')}²</label>
                                        <div className="sq-single-select row">
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input value={searchParams.minSize ? searchParams.minSize : ''}
                                                       onChange={(event) => {
                                                           if (event.target.value >= 0) {
                                                               changeMinSize(event.target.value)
                                                           }
                                                       }} type="text" placeholder={t('min')}/>
                                            </div>
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMaxSize(event.target.value)
                                                        }
                                                    }} type="text" placeholder={t('max')}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rld-single-input mg-top-10">
                                        <label>{t('land_area')} {t('m')}²</label>
                                        <div className="sq-single-select row">
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input name={"land_area"} value={searchParams.minArea ? searchParams.minArea : ''}
                                                       onChange={(event) => {
                                                           if (event.target.value >= 0) {
                                                               searchBarChange('minArea',event.target.value)
                                                           }
                                                       }} type="text" placeholder={t('min')}/>
                                            </div>
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            searchBarChange('maxArea',event.target.value)
                                                        }
                                                    }} type="text" placeholder={t('max')}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sq-single-select row mg-top-20">
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('number_of_bedrooms')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="bathroom"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('number_of_bathrooms')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="rooms"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sq-single-select row mg-top-20">
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('condition')}</label>
                                            <select className="select single-select add-property-select"
                                                    name="condition"
                                                    onChange={(e) => {
                                                        searchBarChange(e.target.name, e.target.value)
                                                    }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option
                                                    value={"zero_condition"}>{t('zero_condition')}</option>
                                                <option value={"bad"}>{t('bad')}</option>
                                                <option value={"middle"}>{t('middle')}</option>
                                                <option value={"good"}>{t('good')}</option>
                                                <option value={"excellent"}>{t('excellent')}</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('storeys')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="storeys"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                                <option value={7}>7+</option>
                                                <option value={8}>8+</option>
                                                <option value={9}>9+</option>
                                                <option value={10}>10+</option>
                                                <option value={11}>11+</option>
                                                <option value={12}>12+</option>
                                                <option value={13}>13+</option>
                                                <option value={14}>14+</option>
                                                <option value={15}>15+</option>
                                                <option value={16}>16+</option>
                                                <option value={17}>17+</option>
                                                <option value={18}>18+</option>
                                                <option value={19}>19+</option>
                                                <option value={20}>20+</option>
                                                <option value={21}>21+</option>
                                                <option value={22}>22+</option>
                                                <option value={23}>23+</option>
                                                <option value={24}>24+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('building_type')}</label>
                                        <select className="select single-select add-property-select"
                                                name="building_type"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={"new_building"}>{t('new_building')}</option>
                                            <option value={"monolith"}>{t('monolith')}</option>
                                            <option value={"stone"}>{t('stone')}</option>
                                            <option value={"panel"}>{t('panel')}</option>
                                            <option value={"other"}>{t('other')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('furniture')}</label>
                                        <select
                                            className="select single-select add-property-select"
                                            name="furniture"
                                            onChange={(e) => {
                                                searchBarChange(e.target.name, e.target.value)
                                            }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={true}>{t('furniture_available')}</option>
                                            <option value={false}>{t('furniture_no_available')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20 pd-bottom-20">
                                        <label>{t('ceiling_height')}</label>
                                        <select className="select single-select add-property-select"
                                                name="ceiling_height"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={2.6}>2.6+</option>
                                            <option value={2.8}>2.8+</option>
                                            <option value={3.0}>3.0+</option>
                                            <option value={3.2}>3.2+</option>
                                            <option value={3.4}>3.4+</option>
                                        </select>
                                    </div>
                                </div>}
                                {(type.id === 2) && <div className="container">
                                    <div className="rld-single-input mg-top-10">
                                        <label>{t('area')} {t('m')}²</label>
                                        <div className="sq-single-select row">
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.minSize ? searchParams.minSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMinSize(event.target.value)
                                                        }
                                                    }} type="text" placeholder={t('min')}/>
                                            </div>
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMaxSize(event.target.value)
                                                        }
                                                    }} type="text" placeholder={t('max')}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sq-single-select row mg-top-20">
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('number_of_bedrooms')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="bathroom"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('number_of_bathrooms')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="rooms"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sq-single-select row mg-top-20">
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('floor')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="floor"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={0}>{t('basement')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                                <option value={7}>7+</option>
                                                <option value={8}>8+</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('storeys')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="storeys"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                                <option value={7}>7+</option>
                                                <option value={8}>8+</option>
                                                <option value={9}>9+</option>
                                                <option value={10}>10+</option>
                                                <option value={11}>11+</option>
                                                <option value={12}>12+</option>
                                                <option value={13}>13+</option>
                                                <option value={14}>14+</option>
                                                <option value={15}>15+</option>
                                                <option value={16}>16+</option>
                                                <option value={17}>17+</option>
                                                <option value={18}>18+</option>
                                                <option value={19}>19+</option>
                                                <option value={20}>20+</option>
                                                <option value={21}>21+</option>
                                                <option value={22}>22+</option>
                                                <option value={23}>23+</option>
                                                <option value={24}>24+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('building_type')}</label>
                                        <select className="select single-select add-property-select"
                                                name="building_type"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={"new_building"}>{t('new_building')}</option>
                                            <option value={"monolith"}>{t('monolith')}</option>
                                            <option value={"stone"}>{t('stone')}</option>
                                            <option value={"panel"}>{t('panel')}</option>
                                            <option value={"other"}>{t('other')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('condition')}</label>
                                        <select className="select single-select add-property-select"
                                                name="condition"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option
                                                value={"zero_condition"}>{t('zero_condition')}</option>
                                            <option value={"bad"}>{t('bad')}</option>
                                            <option value={"middle"}>{t('middle')}</option>
                                            <option value={"good"}>{t('good')}</option>
                                            <option value={"excellent"}>{t('excellent')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('furniture')}</label>
                                        <select
                                            className="select single-select add-property-select"
                                            name="furniture"
                                            onChange={(e) => {
                                                searchBarChange(e.target.name, e.target.value)
                                            }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={true}>{t('furniture_available')}</option>
                                            <option value={false}>{t('furniture_no_available')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20 pd-bottom-20">
                                        <label>{t('ceiling_height')}</label>
                                        <select className="select single-select add-property-select"
                                                name="ceiling_height"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={2.6}>2.6+</option>
                                            <option value={2.8}>2.8+</option>
                                            <option value={3.0}>3.0+</option>
                                            <option value={3.2}>3.2+</option>
                                            <option value={3.4}>3.4+</option>
                                        </select>
                                    </div>
                                </div>}
                                {(type.id === 3) && <div className="container">
                                    <div className="rld-single-input mg-top-10">
                                        <label>{t('general_area')} {t('m')}²</label>
                                        <div className="sq-single-select row">
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.minSize ? searchParams.minSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMinSize(event.target.value)
                                                        }
                                                    }} type="text" placeholder={t('min')}/>
                                            </div>
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMaxSize(event.target.value)
                                                        }
                                                    }} type="text" placeholder={t('max')}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sq-single-select row mg-top-20">
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('number_of_bathrooms')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="rooms"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('storeys')}</label>
                                            <select
                                                className="select single-select add-property-select"
                                                name="storeys"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={1}>1+</option>
                                                <option value={2}>2+</option>
                                                <option value={3}>3+</option>
                                                <option value={4}>4+</option>
                                                <option value={5}>5+</option>
                                                <option value={6}>6+</option>
                                                <option value={7}>7+</option>
                                                <option value={8}>8+</option>
                                                <option value={9}>9+</option>
                                                <option value={10}>10+</option>
                                                <option value={11}>11+</option>
                                                <option value={12}>12+</option>
                                                <option value={13}>13+</option>
                                                <option value={14}>14+</option>
                                                <option value={15}>15+</option>
                                                <option value={16}>16+</option>
                                                <option value={17}>17+</option>
                                                <option value={18}>18+</option>
                                                <option value={19}>19+</option>
                                                <option value={20}>20+</option>
                                                <option value={21}>21+</option>
                                                <option value={22}>22+</option>
                                                <option value={23}>23+</option>
                                                <option value={24}>24+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('building_type')}</label>
                                        <select className="select single-select add-property-select"
                                                name="building_type"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={"new_building"}>{t('new_building')}</option>
                                            <option value={"monolith"}>{t('monolith')}</option>
                                            <option value={"stone"}>{t('stone')}</option>
                                            <option value={"panel"}>{t('panel')}</option>
                                            <option value={"other"}>{t('other')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('condition')}</label>
                                        <select className="select single-select add-property-select"
                                                name="condition"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option
                                                value={"zero_condition"}>{t('zero_condition')}</option>
                                            <option value={"bad"}>{t('bad')}</option>
                                            <option value={"middle"}>{t('middle')}</option>
                                            <option value={"good"}>{t('good')}</option>
                                            <option value={"excellent"}>{t('excellent')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('furniture')}</label>
                                        <select
                                            className="select single-select add-property-select"
                                            name="furniture"
                                            onChange={(e) => {
                                                searchBarChange(e.target.name, e.target.value)
                                            }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={true}>{t('furniture_available')}</option>
                                            <option value={false}>{t('furniture_no_available')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('land_type')}</label>
                                        <select
                                            className="select single-select add-property-select"
                                            name="land_type"
                                            onChange={(e) => {
                                                searchBarChange(e.target.name, e.target.value)
                                            }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value="shops">{t('shops')}</option>
                                            <option value="offices">{t('offices')}</option>
                                            <option value="services">{t('services')}</option>
                                            <option value="other">{t('other')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20 pd-bottom-20">
                                        <label>{t('ceiling_height')}</label>
                                        <select className="select single-select add-property-select"
                                                name="ceiling_height"
                                                onChange={(e) => {
                                                    searchBarChange(e.target.name, e.target.value)
                                                }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={2.6}>2.6+</option>
                                            <option value={2.8}>2.8+</option>
                                            <option value={3.0}>3.0+</option>
                                            <option value={3.2}>3.2+</option>
                                            <option value={3.4}>3.4+</option>
                                        </select>
                                    </div>
                                </div>}
                                {type.id === 4 && <div className="container">
                                    <div className="rld-single-input mg-top-10">
                                        <label>{t('general_area')} m²</label>
                                        <div className="sq-single-select row">
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.minSize ? searchParams.minSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMinSize(event.target.value)
                                                        }
                                                    }} type="text" placeholder="Min"/>
                                            </div>
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <input
                                                    value={searchParams.maxSize ? searchParams.maxSize : ''}
                                                    onChange={(event) => {
                                                        if (event.target.value >= 0) {
                                                            changeMaxSize(event.target.value)
                                                        }

                                                    }} type="text" placeholder="Max"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('front_position')}</label>
                                        <select
                                            className="select single-select add-property-select"
                                            name="front_position"
                                            onChange={(e) => {
                                                searchBarChange(e.target.name, e.target.value)
                                            }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={"primary_and_secondary"}>{t('primary_and_secondary')}</option>
                                            <option value={"primary"}>{t('primary')}</option>
                                            <option value={"secondary"}>{t('secondary')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('purpose')}</label>
                                        <select
                                            className="select single-select add-property-select"
                                            name="purpose"
                                            onChange={(e) => {
                                                searchBarChange(e.target.name, e.target.value)
                                            }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={'public_construction_of_settlements'}>{t('public_construction_of_settlements')}</option>
                                            <option value={'residential_construction_of_settlements'}>{t('residential_construction_of_settlements')}</option>
                                            <option value={'mixed_construction_of_settlements'}>{t('mixed_construction_of_settlements')}</option>
                                        </select>
                                    </div>
                                    <div className="sq-single-select mg-top-20">
                                        <label>{t('land_geometric')}</label>
                                        <select
                                            className="select single-select add-property-select"
                                            name="land_geometric_appearance"
                                            onChange={(e) => {
                                                searchBarChange(e.target.name, e.target.value)
                                            }}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={'0-2'}>{t('smooth')}</option>
                                            <option value={'2-5'}>2-5 {t('degrees')}</option>
                                            <option value={'5-10'}>5-10 {t('degrees')}</option>
                                        </select>
                                    </div>
                                </div>}
                                <div className={'justify-center'}>
                                    <button className={' btn btn-danger'} onClick={() => toggleMobileMore()}>{t('search')}</button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="" onClick={() => {
                        localStorage.removeItem('addresses')
                        window.location.reload(false);
                    }}>
                        <i className="fa fa-repeat" aria-hidden="true"></i>
                        <span style={{paddingLeft: 20}}>{t('reset')}</span>
                    </div>

                </div>
                <div className="filter-modal-save-button-container justify-center mt-3">
                    <button className=" filter-modal-save-button btn" onClick={() => setFilterModal(v => !v)}>{t('search')}</button>
                </div>
            </div>
            : ""}
    </div>
}


export default SearchBar