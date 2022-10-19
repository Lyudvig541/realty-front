import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {currencies, states} from "../../actions/announcement";
import {Dropdown, DropdownMenu} from 'reactstrap';
import {DropdownToggle} from "reactstrap";
import {constructions} from "../../actions/construction";
import {setSpinner} from "../../reducers/modalsReducer";
import {getConstructionCurrentPage} from "../../reducers/constructionReducer";
import {super_brokers_names} from "../../actions/user";

const SearchConstructor = (props) => {
    const dispatch = useDispatch();
    const {t} = props;
    const publicUrl = process.env.PUBLIC_URL;
    const [regionOpen, setOpenRegion] = useState(false);
    const [priceOpen, setPriceOpen] = useState(false);
    const [companyOpen, setCompanyOpen] = useState(false);
    const [deadlineOpen, setDeadlineOpen] = useState(false);
    const allRegions = useSelector(state => state.announcement.states);
    const getCurrencies = useSelector(state => state.announcement.currencies);
    const togglePrice = () => setPriceOpen(prevState => !prevState);
    const toggleRegion = () => setOpenRegion(prevState => !prevState);
    const toggleCompany = () => setCompanyOpen(prevState => !prevState);
    const toggleDeadline = () => setDeadlineOpen(prevState => !prevState);
    const [price, setPrice] = useState(0);
    const constCompanies = useSelector(state => state.user.superBrokersNames);
    const filterIcon = publicUrl + "/assets/img/icons/filter-icon.png";
    const [searchParams, setSearchParams] = useState({
        minPrice: '',
        maxPrice: '',
        deadline: '',
        region: '',
        currency: '',
        constAgency: '',
    })
    useEffect(() => {
        dispatch(states())
        dispatch(currencies())
        dispatch(super_brokers_names())
    }, [dispatch, searchParams]);
    const [region, setRegion] = useState('region');
    const [minPrice, setMinPrice] = useState(null)
    const [maxPrice, setMaxPrice] = useState(null)
    const [deadline, setDeadline] = useState(null)
    const [constAgency, setConstAgency] = useState('')
    const [filterModal, setFilterModal] = useState(false)

    const changeMinPrice = (minPrice) => {
        setMinPrice(minPrice);
        setSearchParams({
            ...searchParams,
            'minPrice': minPrice
        })
        search(['minPrice', minPrice])
    }
    const changeMaxPrice = (maxPrice) => {
        setMaxPrice(maxPrice);
        setSearchParams({
            ...searchParams,
            'maxPrice': maxPrice
        })
        search(['maxPrice', maxPrice])
    }
    const searchBarChange = (name, value) => {
        setSearchParams({
            ...searchParams,
            [name]: value
        })
        search([name, value])
    }

    const search = (data) => {
        dispatch(getConstructionCurrentPage(2));
        dispatch(constructions(searchParams, data));
        dispatch(setSpinner(true))
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

    const [mobileCompany, setMobileCompany] = useState(false)
    const [mobilePrice, setMobilePrice] = useState(false)
    const [mobileRegion, setMobileRegion] = useState(false)
    const [mobileDeadLine, setMobileDeadLine] = useState(false)

    const toggleMobileCompany = () => setMobileCompany(prevState => !prevState)
    const toggleMobilePrice = () => setMobilePrice(prevState => !prevState)
    const toggleMobileRegion = () => setMobileRegion(prevState => !prevState)
    const toggleMobileDeadLine = () => setMobileDeadLine(prevState => !prevState)


    return <div className={'searchbar-construction-container'}>
        <div style={{background: '#F6F6F7', padding: 10}}>
            <div className="tab-pane fade show flex-end">
                <div className="rld-main-search">
                    <div className="  search-bar-components filter-desktop">
                        <div className="search-constructor-container">
                            <div className={'row mt-1 mr-4'}>
                                <div className="">
                                    <Dropdown isOpen={companyOpen} toggle={toggleCompany}>
                                        <DropdownToggle className="search-bar-dropdown-toggle search-bar-components">
                                            <div className="sq-single-select">
                                                {constAgency ? t(constAgency.name ? constAgency.name : constAgency) : t('companies')}
                                                <img className={companyOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'} src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                            </div>
                                        </DropdownToggle>
                                        <DropdownMenu className="search-bar-dropdown-type">
                                            <div className="rld-single-input mg-top-10">
                                                <div className="sq-single-select">
                                                    <ul style={{paddingLeft: 0}}>
                                                        <ol className={'search-bar-types-style'}
                                                            onClick={() => {
                                                                toggleCompany()
                                                                setConstAgency('all')
                                                                searchBarChange('constAgency', '')
                                                            }}>
                                                            {t('all')}
                                                        </ol>
                                                        {constCompanies && constCompanies.map((value, key) => {
                                                            return (
                                                                <ol key={key}
                                                                    className={'search-bar-types-style'}
                                                                    onClick={() => {
                                                                        toggleCompany()
                                                                        setConstAgency(value)
                                                                        searchBarChange('constAgency', value.id)
                                                                    }}>
                                                                    {value.translations.map((value) => {
                                                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                                    })}
                                                                </ol>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div>
                                    <Dropdown isOpen={regionOpen} toggle={toggleRegion}>
                                        <DropdownToggle className="search-bar-dropdown-toggle search-bar-components">
                                            <div className="sq-single-select">
                                                {!region.id ? t(region) : region.translations.map((value) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                })}
                                                <img className={regionOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'} src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                            </div>
                                        </DropdownToggle>
                                        <DropdownMenu className="search-bar-dropdown-type regionScroll">
                                            <div className="rld-single-input mg-top-10">
                                                <div className="sq-single-select">
                                                    <ul style={{paddingLeft: 0}}>
                                                        <ol className={'search-bar-types-style'}
                                                            onClick={() => {
                                                                toggleRegion()
                                                                setRegion(t('region'))
                                                                searchBarChange('region', '')
                                                            }}>
                                                            {t('region')}
                                                        </ol>
                                                        {allRegions.map((value, key) => {
                                                            return (
                                                                <ol className={'search-bar-types-style'}
                                                                    key={key}
                                                                    onClick={() => {
                                                                        toggleRegion()
                                                                        setRegion(value)
                                                                        searchBarChange('region', value.id)
                                                                    }}>
                                                                    {value.translations.map((value) => {
                                                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                                    })}
                                                                </ol>
                                                            )
                                                        })}
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
                                                <img className={priceOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'} src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                            </div>
                                        </DropdownToggle>
                                        <DropdownMenu className="search-bar-dropdown-more">
                                            <div className="container">
                                                <div className="rld-single-input mg-top-10">
                                                    <div className="sq-single-select row">
                                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                                            <label>{t('min')}</label>
                                                            <input value={minPrice ? minPrice : ''}
                                                                   type="text" placeholder={t('min')} min='0'
                                                                   onChange={(event) => {
                                                                       if (event.target.value >= 0) {
                                                                           changeMinPrice(event.target.value)
                                                                       }
                                                                   }}/>
                                                        </div>
                                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                                            <label>{t('max')}</label>
                                                            <input value={maxPrice ? maxPrice : ''} type="text" placeholder={t('max')}
                                                                onChange={(event) => {
                                                                    if (event.target.value >= 0) {
                                                                        changeMaxPrice(event.target.value)
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rld-single-input mg-top-30">
                                                    <div className="sq-single-select">
                                                        <select className="select single-select add-property-select" name="currency" onChange={(event) => {searchBarChange(event.target.name, event.target.value)}}>
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
                                    <Dropdown isOpen={deadlineOpen} toggle={toggleDeadline}>
                                        <DropdownToggle
                                            className="search-bar-dropdown-toggle search-bar-components">
                                            <div className="sq-single-select">
                                                {deadline ? t(deadline) : t('completion_deadlines')}
                                                <img className={deadlineOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'} src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                            </div>
                                        </DropdownToggle>
                                        <DropdownMenu className="search-bar-dropdown-type">
                                            {<div className="rld-single-input mg-top-10">
                                                <div className="sq-single-select">
                                                    <ul style={{paddingLeft: 0}}>
                                                        <ol className={'search-bar-types-style'}
                                                            onClick={() => {
                                                                toggleDeadline()
                                                                setDeadline('all')
                                                                searchBarChange('deadline', '')
                                                            }}>
                                                            {t('all')}
                                                        </ol>
                                                        <ol className={'search-bar-types-style'}
                                                            onClick={() => {
                                                                toggleDeadline()
                                                                setDeadline('finished')
                                                                searchBarChange('deadline', 'finished')
                                                            }}>
                                                            {t('finished')}
                                                        </ol>
                                                        <ol className={'search-bar-types-style'}
                                                            onClick={() => {
                                                                toggleDeadline()
                                                                setDeadline('current')
                                                                searchBarChange('deadline', 'current')
                                                            }}>
                                                            {t('current')}
                                                        </ol>
                                                    </ul>
                                                </div>
                                            </div>}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className="search-bar-components">
                                    <div className="refresh" onClick={() => {
                                        localStorage.removeItem('addresses')
                                        window.location.reload(false);
                                    }}>
                                        <i className="fa fa-repeat" aria-hidden="true"/>
                                        <span style={{paddingLeft: 20}}>{t('reset')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="search-bar-components filter-mobile mt-3">
                        <img src={filterIcon} onClick={() => {setFilterModal(v => !v)}} alt="..."/>
                    </div>
                </div>
            </div>
        </div>
        {filterModal ?
            <div className={'filter-modal-container'}>
                <div className={'close-button-container'}>
                    <button type="button" className="close" aria-label="Close" onClick={() => {setFilterModal(v => !v)}}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="filter-modal">
                    <div className="filter-modal-inner">
                        <Dropdown isOpen={mobileCompany} toggle={toggleMobileCompany}>
                            <DropdownToggle className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {constAgency ? t(constAgency.name ? constAgency.name : constAgency) : t('companies')}
                                    <img className={mobileCompany ? 'search-bar-arrow-open' : 'search-bar-arrow'} src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-type">
                                <div className="rld-single-input mg-top-10">
                                    <div className="sq-single-select">
                                        <ul style={{paddingLeft: 0}}>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileCompany()
                                                    setConstAgency('all')
                                                    searchBarChange('constAgency', '')
                                                }}>
                                                {t('all')}
                                            </ol>
                                            {constCompanies && constCompanies.map((value, key) => {
                                                return (
                                                    <ol key={key}
                                                        className={'search-bar-types-style'}
                                                        onClick={() => {
                                                            toggleMobileCompany()
                                                            setConstAgency(value)
                                                            searchBarChange('constAgency', value.id)
                                                        }}>
                                                        {value.translations.map((value) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                        })}
                                                    </ol>
                                                )
                                            })}

                                        </ul>
                                    </div>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="">
                        <Dropdown isOpen={mobileRegion} toggle={toggleMobileRegion}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {!region.id ? t(region) : region.translations.map((value) => {
                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                    })}
                                    <img
                                        className={mobileRegion ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'}
                                        alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-type regionScroll">
                                <div className="rld-single-input mg-top-10">
                                    <div className="sq-single-select">
                                        <ul style={{paddingLeft: 0}}>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileRegion()
                                                    setRegion(t('region'))
                                                    searchBarChange('region', '')
                                                }}>
                                                {t('region')}
                                            </ol>
                                            {allRegions.map((value, key) => {
                                                return (
                                                    <ol className={'search-bar-types-style'}
                                                        key={key}
                                                        onClick={() => {
                                                            toggleMobileRegion()
                                                            setRegion(value)
                                                            searchBarChange('region', value.id)
                                                        }}>
                                                        {value.translations.map((value) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                        })}
                                                    </ol>
                                                )
                                            })}
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
                                        className={mobilePrice ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'}
                                        alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-more">
                                <div className="container">
                                    <div className="rld-single-input mg-top-10">
                                        <div className="sq-single-select row">
                                            <div className="col-md-6 col-xl-6 col-lg-6">
                                                <label>{t('min')}</label>
                                                <input value={minPrice ? minPrice : ''}
                                                       type="text" placeholder={t('min')} min='0'
                                                       onChange={(event) => {
                                                           if (event.target.value >= 0) {
                                                               changeMinPrice(event.target.value)
                                                           }
                                                       }}/>
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
                                            <select
                                                className="select single-select add-property-select"
                                                name="currency" onChange={(event) => {
                                                searchBarChange(event.target.name, event.target.value)
                                            }}>
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
                                    <div className={'justify-center'}>
                                        <button className={' btn btn-danger'} onClick={() => toggleMobilePrice()}>{t('search')}</button>
                                    </div>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="">
                        <Dropdown isOpen={mobileDeadLine} toggle={toggleMobileDeadLine}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {deadline ? t(deadline) : t('completion_deadlines')}
                                    <img
                                        className={mobileDeadLine ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'}
                                        alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-type">
                                {<div className="rld-single-input mg-top-10">
                                    <div className="sq-single-select">
                                        <ul style={{paddingLeft: 0}}>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileDeadLine()
                                                    setDeadline('all')
                                                    searchBarChange('deadline', '')
                                                }}>
                                                {t('all')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileDeadLine()
                                                    setDeadline('finished')
                                                    searchBarChange('deadline', 'finished')
                                                }}>
                                                {t('finished')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleMobileDeadLine()
                                                    setDeadline('current')
                                                    searchBarChange('deadline', 'current')
                                                }}>
                                                {t('current')}
                                            </ol>
                                        </ul>

                                    </div>
                                </div>}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="search-bar-components">
                        <div className="refresh" onClick={() => {
                            localStorage.removeItem('addresses')
                            window.location.reload(false);
                        }}>
                            <i className="fa fa-repeat" aria-hidden="true"/>
                            <span style={{paddingLeft: 20}}>{t('reset')}</span>
                        </div>
                    </div>

                </div>
                <div className="filter-modal-save-button-container justify-center mt-3">
                    <button className=" filter-modal-save-button btn btn-danger"
                            onClick={() => setFilterModal(v => !v)}>{t('search')}
                    </button>
                </div>
            </div>
            : ""}
    </div>
}


export default SearchConstructor