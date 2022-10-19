import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {cities, get_search_agent} from "../../actions/request";
import {agenciesAll} from "../../actions/resources";
import {getNewData, getSearchParams} from "../../reducers/agentReducer";
import {Dropdown, DropdownMenu, DropdownToggle} from "reactstrap";

const SearchAgent = (props) => {
    const publicUrl = process.env.PUBLIC_URL;
    const dispatch = useDispatch();
    const {t} = props;
    const {active} = props;
    const [searchParams, setSearchParams] = useState({
        agency: '',
        region: '',
        service_type: '',
        name: ''
    })
    const [region,setRegion] = useState('region');
    const [agency,setAgency] = useState('company');
    const [type,setType] = useState('service_type');
    const [regionOpen,setOpenRegion] = useState(false);
    const [typeOpen,setOpenType] = useState(false);
    const [agencyOpen,setOpenAgency] = useState(false);
    const toggleRegion = () => setOpenRegion(prevState => !prevState);
    const toggleAgency = () => setOpenAgency(prevState => !prevState);
    const toggleType = () => setOpenType(prevState => !prevState);


    const allAgencies = useSelector(state => state.resources.agencies);
    const allRegions = useSelector(state => state.announcement.cities);
    const searchData = useSelector(state => state.agent.search_params);

    const [filterModal, setFilterModal] = useState(false)
    const filterIcon = publicUrl + "/assets/img/icons/filter-icon.png";
    useEffect(() => {
        if (!allAgencies.length){
            dispatch(agenciesAll())
        }
        if (!allRegions.length){
            dispatch(cities())
        }

    }, [dispatch, allAgencies, allRegions]);

    const searchBarChange = (name, value) => {
        setSearchParams({
            ...searchParams,
            [name]: value
        })
        search([name, value])
    }
    const search = async (data) => {
        searchParams.name = searchData.name
        await dispatch(getSearchParams(searchParams));
        await dispatch(getNewData(data));
        await dispatch(get_search_agent(1, searchParams, data));
    }
    return <div className={'searchbar-container'} hidden={active}>
        <div style={{background: '#F6F6F7', padding: 10}}>
            <div className="tab-pane fade show">
                <div className="rld-main-search flex-end">
                        <div className="row mr-4 mt-1 filter-desktop agent-filter">

                                <div className="">
                                    <Dropdown isOpen={regionOpen} toggle={toggleRegion}>
                                        <DropdownToggle
                                            className="search-bar-dropdown-toggle search-bar-components">
                                            <div className="sq-single-select ">
                                                {!region.id ? t(region) : region.translations.map((value, i) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                })}
                                                <img
                                                    className={regionOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                                    src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                            </div>
                                        </DropdownToggle>
                                        <DropdownMenu className="search-bar-dropdown-type region-dropdown scrollCss">
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
                                                                <ol className={'search-bar-types-style'} key={key}
                                                                    onClick={() => {
                                                                        toggleRegion()
                                                                        setRegion(value)
                                                                        searchBarChange('region', value.id)
                                                                    }}>
                                                                    {value.translations.map((value, i) => {
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
                                    <Dropdown isOpen={agencyOpen} toggle={toggleAgency}>
                                        <DropdownToggle
                                            className="search-bar-dropdown-toggle search-bar-components">
                                            <div className="sq-single-select ">
                                                {!agency.id ? t(agency) : agency.translations.map((value, i) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                })}
                                                <img
                                                    className={agencyOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                                    src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                            </div>
                                        </DropdownToggle>
                                        <DropdownMenu className="search-bar-dropdown-type">
                                            <div className="rld-single-input mg-top-10">
                                                <div className="sq-single-select">
                                                    <ul style={{paddingLeft: 0}}>
                                                        <ol className={'search-bar-types-style'}
                                                            onClick={() => {
                                                                toggleAgency()
                                                                setAgency(t('company'))
                                                                searchBarChange('agency', '')
                                                            }}>
                                                            {t('company')}
                                                        </ol>
                                                        {allAgencies.length && allAgencies.map((value, key) => {
                                                            return (
                                                                <ol className={'search-bar-types-style'} key={key}
                                                                    onClick={() => {
                                                                        toggleAgency()
                                                                        setAgency(value)
                                                                        searchBarChange('agency', value.id)
                                                                    }}>
                                                                    {value.translations.map((value, i) => {
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
                                    <Dropdown isOpen={typeOpen} toggle={toggleType}>
                                        <DropdownToggle
                                            className="search-bar-dropdown-toggle search-bar-components">
                                            <div className="sq-single-select ">
                                                {t(type)}
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
                                                                setType('sell')
                                                                searchBarChange('service_type', 'sell')
                                                            }}>
                                                            {t('sell')}
                                                        </ol>
                                                        <ol className={'search-bar-types-style'}
                                                            onClick={() => {
                                                                toggleType()
                                                                setType('rent')
                                                                searchBarChange('service_type', 'rent')
                                                            }}>
                                                            {t('rent')}
                                                        </ol>
                                                        <ol className={'search-bar-types-style'}
                                                            onClick={() => {
                                                                toggleType()
                                                                setType('sell_or_rent')
                                                                searchBarChange('service_type', '')
                                                            }}>
                                                            {t('sell_or_rent')}
                                                        </ol>
                                                    </ul>
                                                </div>
                                            </div>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className="">
                                    <div className="refresh" onClick={() => {
                                        localStorage.removeItem('names')
                                        window.location.reload(false);
                                    }}>
                                        <i className="fa fa-repeat" aria-hidden="true"/>
                                        <span style={{paddingLeft: 20}}>{t('reset')}</span>
                                    </div>
                                </div>


                        </div>
                    <div  className="search-bar-components filter-mobile">
                        <img src={filterIcon} onClick={()=>{setFilterModal(v=>!v)}} alt={"..."}/>
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
                            onClick={()=>{
                                setFilterModal(v=>!v)
                            }
                            }
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="filter-modal">

                    <div className="">
                        <Dropdown isOpen={regionOpen} toggle={toggleRegion}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {!region.id ? t(region) : region.translations.map((value, i) => {
                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                    })}
                                    <img
                                        className={regionOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-type">
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
                                                    <ol className={'search-bar-types-style'} key={key}
                                                        onClick={() => {
                                                            toggleRegion()
                                                            setRegion(value)
                                                            searchBarChange('region', value.id)
                                                        }}>
                                                        {value.translations.map((value, i) => {
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
                        <Dropdown isOpen={agencyOpen} toggle={toggleAgency}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {!agency.id ? t(agency) : agency.translations.map((value, i) => {
                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                    })}
                                    <img
                                        className={agencyOpen ? 'search-bar-arrow-open' : 'search-bar-arrow'}
                                        src={publicUrl + '/assets/img/icons/arrow-down.png'} alt="..."/>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="search-bar-dropdown-type">
                                <div className="rld-single-input mg-top-10">
                                    <div className="sq-single-select">
                                        <ul style={{paddingLeft: 0}}>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleAgency()
                                                    setAgency(t('company'))
                                                    searchBarChange('agency', '')
                                                }}>
                                                {t('company')}
                                            </ol>
                                            {allAgencies.length && allAgencies.map((value, key) => {
                                                return (
                                                    <ol className={'search-bar-types-style'} key={key}
                                                        onClick={() => {
                                                            toggleAgency()
                                                            setAgency(value)
                                                            searchBarChange('agency', value.id)
                                                        }}>
                                                        {value.translations.map((value, i) => {
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
                        <Dropdown isOpen={typeOpen} toggle={toggleType}>
                            <DropdownToggle
                                className="search-bar-dropdown-toggle search-bar-components">
                                <div className="sq-single-select filter-modal-single modal-arrow">
                                    {t(type)}
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
                                                    setType('sell')
                                                    searchBarChange('service_type', 'sell')
                                                }}>
                                                {t('sell')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleType()
                                                    setType('rent')
                                                    searchBarChange('service_type', 'rent')
                                                }}>
                                                {t('rent')}
                                            </ol>
                                            <ol className={'search-bar-types-style'}
                                                onClick={() => {
                                                    toggleType()
                                                    setType('sell_or_rent')
                                                    searchBarChange('service_type', '')
                                                }}>
                                                {t('sell_or_rent')}
                                            </ol>
                                        </ul>
                                    </div>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="">
                        <div className="refresh" onClick={() => {
                            localStorage.removeItem('names')
                            window.location.reload(false);
                        }}>
                            <i className="fa fa-repeat" aria-hidden="true"/>
                            <span style={{paddingLeft: 20}}>{t('reset')}</span>
                        </div>
                    </div>


                </div>
                <div className="filter-modal-save-button-container justify-center mt-3">
                    <button className=" filter-modal-save-button btn btn-danger" onClick={()=>setFilterModal(v=>!v)}>Save</button>
                </div>

            </div>
            :""}
    </div>

}


export default SearchAgent