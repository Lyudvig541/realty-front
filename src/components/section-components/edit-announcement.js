import React, {useEffect, useState} from 'react';
import {GeolocationControl, Map, Placemark, SearchControl, YMaps} from "react-yandex-maps";
import {useParams} from "react-router-dom";
import {
    additional_information,
    currencies, edit_announcement, editListingValidate,
    facilities_information,
    get_announcement,
    states,
} from "../../actions/announcement";
import {useDispatch, useSelector} from "react-redux";
import ImageUploading from 'react-images-uploading';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {setAnnouncementModal, setModal} from "../../reducers/modalsReducer";
import {getAdditional, getFacilities, getOneAnnouncement, setActiveTab} from "../../reducers/announcementReducer";
import {getCities} from "../../reducers/regionReducer";
import {get_search_agent} from "../../actions/request";
import ReactStars from "react-rating-stars-component";
import Pagination from "./pagination";
import NumberFormat from "react-number-format";
import { Alert } from 'reactstrap';

const EditAnnouncement = (props) => {
    const publicUrl = process.env.PUBLIC_URL;
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const default_image = publicUrl + "/assets/img/default.png";
    const oldAnnouncement = useSelector(state => state.announcement.oneAnnouncement);
    const [announcement, setAnnouncement] = useState({
        images: [],
        certificate: '',
        main_image: '',
        check_agent: 0,
    });
    const dispatch = useDispatch();
    const {t} = props;
    const [mapState] = useState({
        center: [40.1776121, 44.6125849],
        zoom: 10,
        yandexMapDisablePoiInteractivity: true,
    });
    const coefficient = {
        price: {
            reinforced_concrete: 230000,
            stone: 255000
        },
        state: {
            erevan: [0.17, 1],
            kotayq: [0.055, 0.26],
            armavir: [0.044, 0.32],
            ararat: [0.035, 0.32],
            aragacotn: [0.035, 0.32],
            shirak: [0.035, 0.21],
            lori: [0.035, 0.26],
            tavush: [0.035, 0.17],
            syuniq: [0.035, 0.13],
            vayocDzor: [0.035, 0.13],
            gexarquniq: [0.035, 0.13],
        },
        cover: {
            reinforced_concrete: 1,
            wood: 0.9
        },
        ceiling_height: {
            2.7: 0.9,
            3.0: 1,
            4: 1.1
        },
        floor: {
            1: 0.95,
            2.5: 1,
            6.9: 0.9,
            10: 0.8,
            0: 0.5,
            0.5: 0.65,
            10.5: 0.7,
            11: 0.95,
        },
        degree: {
            0: 1,
            1: 0.95,
            2: 0.95,
            3: 0.5,
            4: 0,
        },
        year: {
            0.6: 1,
            7.9: 0.94,
            10.12: 0.91,
            13.15: 0.88,
            16.18: 0.85,
            19.21: 0.82,
            22.24: 0.79,
            25.27: 0.76,
            28.30: 0.73,
            31.40: 0.7,
            41: 0.6,
        },
        area: 0,
        '': 0,
    }
    const [propertyPrice, setPropertyPrice] = useState({
        price: 'reinforced_concrete',
        state: 'erevan',
        cover: 'reinforced_concrete',
        ceiling_height: '2.7',
        floor: 1,
        degree: 0,
        year: '0.6',
        area: 0,
        buildingType: 'reinforced_concrete'
    });
    const countPropertyPrice = () => {
        return propertyPrice.area * coefficient.price[propertyPrice.buildingType] * ((coefficient.state[propertyPrice.state])[0] + (coefficient.state[propertyPrice.state])[1]) / 2 * coefficient.cover[propertyPrice.cover]
            * propertyPrice.ceiling_height * coefficient.floor[propertyPrice.floor] * coefficient.degree[propertyPrice.degree]
            * coefficient.year[propertyPrice.year];
    }
    const active = useSelector(state => state.announcement.active)
    const new_data = useSelector(state => state.agent.new_data)
    let data = useSelector(state => state.agent.agents.data)
    let data2 = useSelector(state => state.agent.agents)
    const search_params = useSelector(state => state.agent.search_params)
    const getPage = async (page) => {
        await dispatch(get_search_agent(page, search_params, new_data))
    }
    const ymaps = React.useRef(null);
    const placemarkRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const mapOptions = {
        preset: "islands#redCircleDotIcon",
        hideIconOnBalloonOpen: false,
        openEmptyBalloon: true,
        open: true,
        iconImageSize: [30, 42],
        iconImageOffset: [-3, -42],
    };
    const additionalInformation = useSelector(state => state.announcement.additionalInformation);
    const regions = useSelector(state => state.announcement.states);
    const cities = useSelector(state => state.announcement.cities);
    const allCurrenies = useSelector(state => state.announcement.currencies);
    const {id} = useParams();
    useEffect(() => {
        async function getData() {
            dispatch(get_announcement(id));
            dispatch(additional_information());
            dispatch(facilities_information());
            dispatch(states());
            dispatch(currencies());
            dispatch(get_search_agent(1))
        }

        getData();

    }, [dispatch, id])
    let facilities = useSelector(state => state.announcement.facilitiesInformation);
    const announcmentFacilities = useSelector(state => state.announcement.facilities);
    const addInfos = useSelector(state => state.announcement.additional);
    const createPlacemark = (coords) => {
        return new ymaps.current.Placemark(
            coords,
            {
                iconCaption: "loading.."
            },
            {
                preset: "islands#redCircleDotIcon",
                draggable: true,
                hideIconOnBalloonOpen: false,
                openEmptyBalloon: true,
                open: true,
                iconImageSize: [30, 42],
                iconImageOffset: [-3, -42],
            }
        );
    };
    const getAddress = (coords) => {
        placemarkRef.current.properties.set("iconCaption", "loading..");
        ymaps.current.geocode(coords).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            const newAddress = [
                firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
            ]
                .filter(Boolean)
                .join(", ");
            dispatch(getOneAnnouncement({
                ...oldAnnouncement,
                address: firstGeoObject.getAddressLine(),
                latitude: coords[0],
                longitude: coords[1]
            }))
            placemarkRef.current.properties.set({
                iconCaption: newAddress,
                balloonContent: firstGeoObject.getAddressLine()
            });
        });
    };

    const onMapClick = (e) => {
        const coords = e.get("coords");

        if (placemarkRef.current) {
            placemarkRef.current.geometry.setCoordinates(coords);
        } else {
            placemarkRef.current = createPlacemark(coords);
            mapRef.current.geoObjects.add(placemarkRef.current);
            placemarkRef.current.events.add("dragend", function () {
                getAddress(placemarkRef.current.geometry.getCoordinates());
            });
        }
        getAddress(coords);
    };

    const onChangeCertificate = (image) => {
        setAnnouncement({
                ...announcement,
                'certificate': image
            }
        )
    }
    const changeFloor = (event) => {
        let floor;
        switch (event.target.value) {
            case '1': {
                floor = 0.95;
                break;
            }
            case '2':
            case '3':
            case '4':
            case '5': {
                floor = 1;
                break;
            }
            case '6':
            case '7':
            case '8':
            case '9': {
                floor = 0.9;
                break;
            }
            case '10': {
                floor = 0.8;
                break;
            }
            case 'basement': {
                floor = 0.5;
                break;
            }
            case 'halfBasement': {
                floor = 0.65;
                break;
            }
            case 'last': {
                floor = 0.95;
                break;
            }
            case '10.5': {
                floor = 0.7;
                break;
            }
            default :
                floor = 0;
        }
        setPropertyPrice({
            ...propertyPrice,
            [event.target.name]: floor
        })
    }
    const ceilingHeightChange = (event) => {
        let ceiling_height;
        switch (event.target.value) {
            case '2.5' :
                ceiling_height = 0.9;
                break;
            case '2.6' :
                ceiling_height = 0.9;
                break;
            case '2.7' :
                ceiling_height = 0.9;
                break;
            case '2.75' :
                ceiling_height = 0.9;
                break;
            case '2.8' :
                ceiling_height = 1;
                break;
            case '3' :
                ceiling_height = 1;
                break;
            case '3.2':
                ceiling_height = 1.1;
                break;
            case '3.4':
                ceiling_height = 1.1;
                break;
            case '3.5':
                ceiling_height = 1.1;
                break;
            case '4.0':
                ceiling_height = 1.1;
                break;
            default :
                ceiling_height = 0;
        }
        setPropertyPrice({
            ...propertyPrice,
            [event.target.name]: ceiling_height
        })
    }
    const handleSelect = async (address, type) => {
        if (address === '') {
            dispatch(getOneAnnouncement({
                ...oldAnnouncement,
                'city':  ''
            }))
            return;
        }
        if (type === "state") {
            regions.map((value => {
                if (value.id === Number(address)) {
                    dispatch(getOneAnnouncement({
                        ...oldAnnouncement,
                        'state_id': value.id,
                        'city': '',
                    }))
                    dispatch(getCities(value.cities))
                    return address = value.name + ', Armenia'
                }
                return null
            }))
        } else {
            cities.map((value => {
                if (value.id === Number(address)) {
                    dispatch(getOneAnnouncement({
                        ...oldAnnouncement,
                        'city_id': value.id,
                        'city': value.name
                    }))
                    return address = value.name + ', ' + oldAnnouncement.state + ', Armenia'
                }
                return null
            }))
        }
    };
    const modal = useSelector(state => state.modals.modal);
    const validation_errors = useSelector(state => state.announcement.errors);
    const isAddInfo = (id) => {
        return Boolean(addInfos[id]);
    }
    const isFacility = (id) => {
        return Boolean(announcmentFacilities[id]);
    }
    const facilityClick = (key) => {
        if (document.getElementById("facility" + key).checked !== true) {
            document.getElementById("facility" + key).checked = true;
            document.getElementById('mainClassFacility' + key).classList.remove("facility");
            document.getElementById('mainClassFacility' + key).classList.add("activeFacility");
        } else {
            document.getElementById("facility" + key).checked = false;
            document.getElementById('mainClassFacility' + key).classList.remove("activeFacility");
            document.getElementById('mainClassFacility' + key).classList.add("facility");
        }
    }
    const additionalInfoClick = (key) => {
        if (document.getElementById("additionalInfo" + key).checked !== true) {
            document.getElementById("additionalInfo" + key).checked = true;
            document.getElementById("mainClassAdditionalInfo" + key).classList.remove("additionalInfo");
            document.getElementById("mainClassAdditionalInfo" + key).classList.add("activeAdditionalInfo");
        } else {
            document.getElementById("additionalInfo" + key).checked = false;
            document.getElementById("mainClassAdditionalInfo" + key).classList.remove("activeAdditionalInfo");
            document.getElementById("mainClassAdditionalInfo" + key).classList.add("additionalInfo");
        }

    }

    return <div className="add-new-property-area pd-top-90" style={{backgroundColor: '#FBFBFB'}}>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-7 col-md-7" hidden={!active}>
                    <div className="section-title pd-top-30">
                        <h4>{t('general_description')}</h4>
                    </div>
                    {oldAnnouncement.verify === 2 && oldAnnouncement.reason &&
                        <Alert color="danger">
                            {oldAnnouncement.reason}
                        </Alert>
                    }
                    <div className="row pd-top-10">
                        {
                            oldAnnouncement.category_id === 2 ?
                                <div className="col-md-12 col-xl-12 col-lg-12 pd-bottom-20">
                                    <div className="row">
                                        <div className="col-md-12 col-xl-12 col-lg-12 ">{t('rent_price')}<span>*</span>
                                        </div>
                                        <div className="col-md-4 col-xl-4 col-lg-4 mg-top-10">
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <NumberFormat
                                                        name="price"
                                                        placeholder="xxxxx"
                                                        value={oldAnnouncement.price || ''}
                                                        thousandSeparator={true}
                                                        allowNegative={false}
                                                        inputMode="numeric"
                                                        onValueChange={(values) => {
                                                            const { formattedValue } = values;
                                                            dispatch(getOneAnnouncement({
                                                                ...oldAnnouncement,
                                                                'price': formattedValue
                                                            }))
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-xl-4 col-lg-4 mg-top-10">
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <select className="select single-select add-property-select"
                                                            value={oldAnnouncement.currency_id || ''}
                                                            name="currency_id"
                                                            onChange={event => {
                                                                dispatch(getOneAnnouncement({
                                                                    ...oldAnnouncement,
                                                                    [event.target.name]: event.target.value
                                                                }))
                                                            }}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        {allCurrenies.length && allCurrenies.map((value, key) => {
                                                            return (
                                                                <option key={key} value={value.id}>
                                                                    {value.name}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-xl-4 col-lg-4 mg-top-10">
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <select className="select single-select add-property-select"
                                                            name="rent_type"
                                                            value={oldAnnouncement.rent_type  || ''}
                                                            onChange={event => dispatch(getOneAnnouncement({
                                                                ...oldAnnouncement,
                                                                [event.target.name]: event.target.value
                                                            }))}
                                                    >
                                                        <option value='daily_rent'>{t('daily_rent')}</option>
                                                        <option value='monthly_rent'>{t('monthly_rent')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <label className="error-message">
                                        {validation_errors["data.price"] && t('require')}
                                    </label>
                                </div>

                                : <div className="col-md-12 col-xl-6 col-lg-6">
                                    <div className="row">
                                        <div className="col-md-12 col-xl-12 col-lg-12 ">
                                            <label>{t('price')}<span>*</span></label>
                                        </div>
                                        <div className="col-md-12 col-xl-6 col-lg-6">
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <NumberFormat
                                                        name="price"
                                                        placeholder="xxxxx"
                                                        value={oldAnnouncement.price || ''}
                                                        allowNegative={false}
                                                        thousandSeparator={true}
                                                        inputMode="numeric"
                                                        onValueChange={(values) => {
                                                            const { formattedValue } = values;
                                                            dispatch(getOneAnnouncement({
                                                                ...oldAnnouncement,
                                                                'price': formattedValue
                                                            }))
                                                        }}
                                                    />
                                                    <label className="error-message">
                                                        {validation_errors["data.price"] && t('require')}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-xl-6 col-lg-6 ">
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <select className="select single-select add-property-select"
                                                            name="currency_id"
                                                            value={oldAnnouncement.currency_id || ''}
                                                            onChange={event => dispatch(getOneAnnouncement({
                                                                ...oldAnnouncement,
                                                                [event.target.name]: event.target.value
                                                            }))}
                                                    >
                                                        <option value=''>{t('choose')}</option>
                                                        {allCurrenies.length && allCurrenies.map((value, key) => {
                                                            return (
                                                                <option key={key} value={value.id}>
                                                                    {value.name}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <label className="error-message">{validation_errors["data.ceiling_height"] && t('require')}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                        <div className="col-md-12 col-xl-6 col-lg-6 pd-bottom-20">
                            <div className="rld-single-input">
                                <label>{(oldAnnouncement.type_id < 3 && t('area')) || t('general_area')}
                                    <span>*</span></label>
                                <input type="text" name="area" placeholder="xxx"
                                       value={oldAnnouncement.area || ''}
                                       onChange={event => {
                                           event.target.value >= 0 &&  dispatch(getOneAnnouncement({
                                               ...oldAnnouncement,
                                               [event.target.name]: event.target.value
                                           }))
                                            setPropertyPrice({
                                               ...propertyPrice,
                                               [event.target.name]: event.target.value
                                           })
                                       }}
                                />
                                <label className="meterSquare">{t("m")}²</label>
                                <label className="error-message">{validation_errors["data.area"] && t('require')}</label>
                            </div>
                        </div>
                        {(oldAnnouncement.type_id === 3 || oldAnnouncement.type_id === 2) && <div className="col-md-12 col-xl-6 col-lg-6">
                            <label>{t('condominium')}<span>*</span></label>
                            <div className="rld-single-input">
                                <div className="sq-single-select">
                                    <input type="text" name="condominium" placeholder="xxx"
                                           value={oldAnnouncement.condominium || ''}
                                           onChange={(event) => {
                                               event.target.value >= 0 && dispatch(getOneAnnouncement({
                                                   ...oldAnnouncement,
                                                   [ event.target.name]:  event.target.value
                                               }))
                                           }}
                                    />
                                    <label
                                        className="error-message">{validation_errors["data.condominium"] && t('require')}</label>
                                </div>
                            </div>
                        </div>
                        }
                        {oldAnnouncement.type_id === 1 ?
                            <div className="col-md-12 col-xl-6 col-lg-6 pd-bottom-20">
                                <div className="rld-single-input">
                                    <label>{t('land_area')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <input type="text" name="land_area" placeholder="xxx"
                                               value={oldAnnouncement.land_area || ''}
                                               onChange={(event) => {
                                                   event.target.value >0 &&   dispatch(getOneAnnouncement({
                                                       ...oldAnnouncement,
                                                       [ event.target.name]:  event.target.value
                                                   }))
                                               }}
                                        />
                                        <label className="meterSquare">{t('m')}²</label>
                                        <label
                                            className="error-message">{validation_errors["data.land_area"] && t('require')}</label>
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                        {!(oldAnnouncement.type_id > 2 && oldAnnouncement.type_id !== 4) ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-select">
                                    <label>{t('number_of_bedrooms')} <span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select"
                                                name='rooms'
                                                placeholder={t('choose')}
                                                value={oldAnnouncement.rooms || ''}
                                                onChange={event => dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6+</option>
                                        </select>
                                    </div>
                                    <label
                                        className="error-message">{validation_errors["data.bedrooms"] && t('require')}</label>
                                </div>
                            </div>
                            : null}
                        {
                            oldAnnouncement.type_id !== 4 ?
                                <div className="col-md-12 col-xl-6 col-lg-6">
                                    <div className="rld-single-input">
                                        <label>{t('ceiling_height')}<span>*</span></label>
                                        <div className="sq-single-select">
                                            <select className="select single-select add-property-select"
                                                    name="ceiling_height"
                                                    value={oldAnnouncement.ceiling_height || ''}
                                                    onChange={event => {
                                                        ceilingHeightChange(event)
                                                        dispatch(getOneAnnouncement({
                                                            ...oldAnnouncement,
                                                            [ event.target.name]:  event.target.value
                                                        }))
                                                    }}
                                            >
                                                <option value=''>{t('choose')}</option>
                                                <option value={2.5}>2.5 {t('m')}</option>
                                                <option value={2.6}>2.6 {t('m')}</option>
                                                <option value={2.7}>2.7 {t('m')}</option>
                                                <option value={2.75}>2.75 {t('m')}</option>
                                                <option value={2.8}>2.8 {t('m')}</option>
                                                <option value={3.0}>3.0 {t('m')}</option>
                                                <option value={3.2}>3.2 {t('m')}</option>
                                                <option value={3.4}>3.4 {t('m')}</option>
                                                <option value={3.5}>3.5 {t('m')}</option>
                                                <option value={4.0}>4.0 {t('m')}</option>
                                            </select>
                                        </div>
                                        <label className="error-message">{validation_errors["data.ceiling_height"] && t('require')}</label>
                                    </div>
                                </div>
                                : null
                        }
                        {oldAnnouncement.type_id !== 4 && <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('storeys')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="storeys"
                                            value={oldAnnouncement.storeys || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={8}>8</option>
                                        <option value={9}>9</option>
                                        <option value={10}>10</option>
                                        <option value={11}>11</option>
                                        <option value={12}>12</option>
                                        <option value={13}>13</option>
                                        <option value={14}>14</option>
                                        <option value={15}>15</option>
                                        <option value={16}>16</option>
                                        <option value={17}>17</option>
                                        <option value={18}>18</option>
                                        <option value={19}>19</option>
                                        <option value={20}>20</option>
                                        <option value={21}>21</option>
                                        <option value={22}>22</option>
                                        <option value={23}>23</option>
                                        <option value={24}>24+</option>
                                    </select>
                                </div>
                                <label className="error-message">{validation_errors["data.storeys"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id === 2 || oldAnnouncement.type_id === 3 ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-input ">
                                    <label>{t('floor')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select" name="floor"
                                                value={oldAnnouncement.floor || ''}
                                                onChange={(event) => {
                                                    changeFloor(event)
                                                    dispatch(getOneAnnouncement({
                                                        ...oldAnnouncement,
                                                        [ event.target.name]:  event.target.value
                                                    }))
                                                }
                                                }
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={"basement"}>{t('basement')}</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                            <option value={7}>7</option>
                                            <option value={8}>8</option>
                                            <option value={9}>9</option>
                                            <option value={10}>10</option>
                                            <option value={11}>11</option>
                                            <option value={12}>12</option>
                                            <option value={13}>13</option>
                                            <option value={14}>14</option>
                                            <option value={15}>15</option>
                                            <option value={16}>16</option>
                                            <option value={17}>17</option>
                                            <option value={18}>18</option>
                                            <option value={19}>19</option>
                                            <option value={20}>20</option>
                                            <option value={21}>21</option>
                                            <option value={22}>22</option>
                                            <option value={23}>23</option>
                                            <option value={24}>24</option>
                                        </select>
                                    </div>
                                    <label className="error-message">{validation_errors["data.floor"] && t('require')}</label>
                                </div>
                            </div> : null}
                        {oldAnnouncement.type_id === 3 || oldAnnouncement.type_id !== 4 ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-input ">
                                    <label>{t('land_type')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select" name="land_type"
                                                value={oldAnnouncement.land_type || ''}
                                                onChange={event => dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value="shops">{t('shops')}</option>
                                            <option value="offices">{t('offices')}</option>
                                            <option value="services">{t('services')}</option>
                                            <option value="other">{t('other')}</option>
                                        </select>
                                    </div>
                                    <label className="error-message">{validation_errors["data.land_type"] && t('require')}</label>
                                </div>
                            </div>
                            : null}
                        {oldAnnouncement.type_id === 3 ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-input ">
                                    <label>{t('property_place')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select"
                                                name="property_place"
                                                value={oldAnnouncement.property_place || ''}
                                                onChange={event => dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value="into_building">{t('into_building')}</option>
                                            <option value="out_of_building">{t('out_of_building')}</option>
                                        </select>
                                    </div>
                                    <label className="error-message">{validation_errors["data.land_type"] && t('require')}</label>
                                </div>
                            </div>
                            : null}
                        {oldAnnouncement.type_id < 3 ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-input">
                                    <label>{t('balcony')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select"
                                                name="balcony"
                                                value={oldAnnouncement.balcony || ''}
                                                onChange={event => dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value='no_balcony'>{t('no_balcony')}</option>
                                            <option value='open_balcony'>{t('open_balcony')}</option>
                                            <option value='close_balcony'>{t('close_balcony')}</option>
                                        </select>
                                    </div>
                                    <label className="error-message">{validation_errors["data.balcony"] && t('require')}</label>
                                </div>
                            </div>
                            : null}
                        {oldAnnouncement.type_id !== 4 && <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('cover')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="cover"
                                            value={oldAnnouncement.cover || ''}
                                            onChange={event => {
                                                setPropertyPrice({
                                                    ...propertyPrice,
                                                    [event.target.name]: event.target.value
                                                })
                                                dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))
                                            }}
                                    >
                                        <option value={''}>{t('choose')}</option>
                                        <option value={'reinforced_concrete'}>{t('reinforced_concrete')}</option>
                                        <option value={'panel'}>{t('panel')}</option>
                                        <option value={'wood'}>{t('wood')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        }

                        {oldAnnouncement.type_id !== 4 && <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-select">
                                <label>{t('number_of_bathrooms')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="bathroom"
                                            value={oldAnnouncement.bathroom || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={1}>1</option>
                                        <option value={1.5}>1.5</option>
                                        <option value={2}>2</option>
                                        <option value={2.5}>2.5</option>
                                        <option value={3}>3</option>
                                        <option value={3.5}>3.5</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                                <label className="error-message">{validation_errors["data.bathrooms"] && t('require')}</label>
                            </div>
                        </div>
                        }
                        {oldAnnouncement.type_id !== 4 && <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('condition')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="condition"
                                            value={oldAnnouncement.condition || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"zero_condition"}>{t('zero_condition')}</option>
                                        <option value={"bad"}>{t('bad')}</option>
                                        <option value={"middle"}>{t('middle')}</option>
                                        <option value={"good"}>{t('good')}</option>
                                        <option value={"excellent"}>{t('excellent')}</option>
                                    </select>
                                </div>
                                <label className="error-message">{validation_errors["data.condition"] && t('require')}</label>
                            </div>
                        </div>
                        }
                        {oldAnnouncement.type_id !== 4 && <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('building_type')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="building_type"
                                            value={oldAnnouncement.building_type || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"new_building"}>{t('new_building')}</option>
                                        <option value={"monolith"}>{t('monolith')}</option>
                                        <option value={"stone"}>{t('stone')}</option>
                                        <option value={"panel"}>{t('panel')}</option>
                                        <option value={"other"}>{t('other')}</option>
                                    </select>
                                </div>
                                <label className="error-message">{validation_errors["data.building_type"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id === 4 && <div className="col-lg-6 col-md-12 col-xl-6 pd-bottom-20">
                            <div className="rld-single-input ">
                                <label>{t('front_position_length')}<span>*</span></label>
                                <div>
                                    <input type="text" name="front_position_length" placeholder="xxx"
                                           value={oldAnnouncement.front_position_length || ''}
                                           onChange={event => {
                                               event.target.value >= 0 && dispatch(getOneAnnouncement({
                                                   ...oldAnnouncement,
                                                   [ event.target.name]:  event.target.value
                                               }))
                                           }}
                                    />
                                    <label className="meterSquare">m </label>
                                    <label className="error-message">{validation_errors["data.front_position_length"] && t('require')}</label>
                                </div>
                            </div>
                        </div>}
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('sewer')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select" name="sewer"
                                            value={oldAnnouncement.sewer || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value="individual">{t('individual')}</option>
                                        <option value="centralised">{t('centralised')}</option>
                                    </select>
                                </div>
                                <label className="error-message">{validation_errors["data.sewer"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('distance_from_metro_station')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="distance_from_metro_station"
                                            value={oldAnnouncement.distance_from_metro_station || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value="0 - 100">{t('before')} 100</option>
                                        <option value="100 - 500">100 - 500</option>
                                        <option value="no_metro">{t('no_metro')}</option>
                                    </select>
                                </div>
                                <label className="error-message">{validation_errors["data.distance_from_metro_station"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('distance_from_medical_center')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="distance_from_medical_center"
                                            value={oldAnnouncement.distance_from_medical_center || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value="0-1000">{t('before')} 1000</option>
                                        <option value="1001">1001 +</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.sewer"] && t('require')}</label>
                            </div>
                        </div>
                        {oldAnnouncement.type_id !== 4 && <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('furniture')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select" name="furniture"
                                            value={oldAnnouncement.furniture || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={true}>{t('yes')}</option>
                                        <option value={false}>{t('no')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.furniture"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id === 4 && <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('land_geometric')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name='land_geometric'
                                            value={oldAnnouncement.land_geometric || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={'0-2'}>{t('smooth')}</option>
                                        <option value={'2-5'}>2-5 {t('degrees')}</option>
                                        <option value={'5-10'}>5-10 {t('degrees')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.land_geometric"] && t('require')}</label>
                            </div>
                        </div>
                        }
                        {oldAnnouncement.type_id === 4 && <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('purpose')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="purpose"
                                            value={oldAnnouncement.purpose || ''}

                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option
                                            value={'public_construction_of_settlements'}>{t('public_construction_of_settlements')}</option>
                                        <option
                                            value={'residential_construction_of_settlements'}>{t('residential_construction_of_settlements')}</option>
                                        <option
                                            value={'mixed_construction_of_settlements'}>{t('mixed_construction_of_settlements')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.purpose"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id === 4 && <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('front_position')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="front_position"
                                            value={oldAnnouncement.front_position || ''}
                                            onChange={event => {
                                                dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))
                                            }
                                            }
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option
                                            value={"primary_and_secondary"}>{t('primary_and_secondary')}</option>
                                        <option value={"primary"}>{t('primary')}</option>
                                        <option value={"secondary"}>{t('secondary')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.front_position"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id === 4 && <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('road_type')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="road_type"
                                            value={oldAnnouncement.road_type || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"asphalt"}>{t('asphalt')}</option>
                                        <option value={"ground"}>{t('ground')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.road_type"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id === 4 && <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('fence_type')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="fence_type"
                                            value={oldAnnouncement.fence_type || ''}
                                            onChange={event => {
                                                dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))
                                            }}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"partly_fenced"}>{t('partly_fenced')}</option>
                                        <option value={"stone_fence"}>{t('stone_fence')}</option>
                                        <option value={"no_fence"}>{t('no_fence')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.fence_type"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id === 4 && <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('infrastructure')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="infrastructure"
                                            value={oldAnnouncement.infrastructure || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"all_available"}>{t('all_available')}</option>
                                        <option value={"no_communication"}>{t('no_communication')}</option>
                                        <option
                                            value={"all_available_except_irrigation_water"}>{t('all_available_except_irrigation_water')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.infrastructure"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id === 4 && <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('building')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="building"
                                            value={oldAnnouncement.building || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"there_is_building"}>
                                            {t('there_is_building')}
                                        </option>
                                        <option value={"there_is_not_building"}>
                                            {t('there_is_not_building')}
                                        </option>
                                    </select>
                                </div>
                                <label className="error-message">
                                    {validation_errors["data.building"] && t('require')}
                                </label>
                            </div>
                        </div>}

                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('distance_from_stations')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="distance_from_stations"
                                            value={oldAnnouncement.distance_from_stations || ''}
                                            onChange={event => dispatch(getOneAnnouncement({
                                                ...oldAnnouncement,
                                                [ event.target.name]:  event.target.value
                                            }))}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value="0-100">{t('before')} 100</option>
                                        <option value="101-300">101 - 300</option>
                                        <option value="301">301 +</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.distance_from_stations"] && t('require')}</label>
                            </div>
                        </div>
                        {oldAnnouncement.type_id !== 4 && <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('year')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="year"
                                            value={oldAnnouncement.year || ''}
                                            onChange={event => {
                                                setPropertyPrice({
                                                    ...propertyPrice,
                                                    [event.target.name]: event.target.value
                                                })
                                                dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))
                                            }}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={0.6}>{t('before')} 6</option>
                                        <option value={7.9}>7 - 9</option>
                                        <option value={10.12}>10 - 12</option>
                                        <option value={13.15}>13 - 15</option>
                                        <option value={16.18}>16 - 18</option>
                                        <option value={19.21}>19 - 21</option>
                                        <option value={22.24}>22 - 24</option>
                                        <option value={25.27}>25 - 27</option>
                                        <option value={28.30}>28 - 30</option>
                                        <option value={31.40}>31 - 40</option>
                                        <option value={41}>41 +</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.year"] && t('require')}</label>
                            </div>
                        </div>}
                        {oldAnnouncement.type_id !== 4 && <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('degree')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="degree"
                                            value={oldAnnouncement.degree || ''}
                                            onChange={event => {
                                                setPropertyPrice({
                                                    ...propertyPrice,
                                                    [event.target.name]: event.target.value
                                                })
                                                dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    [ event.target.name]:  event.target.value
                                                }))
                                            }}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                            </div>
                        </div>}
                        <div className="col-md-12 col-xl-12 col-lg-12 ">
                            <div className="rld-single-input mg-top-20">
                                <label>{t('region')}<span>*</span></label>
                                <div className="row">
                                    <div className="sq-single-select col-md-12 col-xl-6 col-lg-6">
                                        <select className="select single-select add-property-select"
                                                name="state"
                                                value={oldAnnouncement.state_id || ''}
                                                onChange={event => {
                                                    handleSelect(event.target.value, event.target.name);
                                                }
                                                }
                                        >
                                            {regions.map((value, key) => (
                                                <option key={key} value={value.id}>
                                                    {value.translations && value.translations.map((item, index) => {
                                                        return (localStorage.i18nextLng === 'us' && item.locale === 'en') || (item.locale === localStorage.i18nextLng) ? item.name : null
                                                    })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sq-single-select col-md-12 col-xl-6 col-lg-6">
                                        <select className="select single-select add-property-select"
                                                name="city"
                                                value={oldAnnouncement.city_id || ''}
                                                onChange={event => {
                                                    handleSelect(event.target.value, event.target.name);
                                                }
                                                }
                                        >
                                            <option value="">{t('choose')}</option>
                                            {cities.map((value, key) => (
                                                <option key={key} value={value.id}>
                                                    {value.translations && value.translations.map((item) => {
                                                        return (localStorage.i18nextLng === 'us' && item.locale === 'en') || (item.locale === localStorage.i18nextLng) ? item.name : null
                                                    })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={oldAnnouncement.type_id === 2 || oldAnnouncement.type_id === 3 ? "col-lg-10 col-md-12 col-xl-10 pd-top-30" : "col-lg-12 col-md-12 col-xl-12 pd-top-30"}>
                            <div className="rld-single-input">
                                <label>{t('address')} <span>*</span></label>
                                <div className="addressInfoHover">
                                    <input type="text" name="address" placeholder={t('info_address')}
                                           disabled
                                           style={{position: "relative"}}
                                           value={oldAnnouncement.address  || ''}
                                    />
                                    <label
                                        className="error-message">{validation_errors["data.address"] && t('require')}</label>
                                    <div className="infoIcon">
                                        <i className="fa fa-info"/>
                                    </div>
                                    <div className="addressInfo">{t('info_address')}</div>
                                </div>
                            </div>
                        </div>
                        {oldAnnouncement.type_id === 2 || oldAnnouncement.type_id === 3 ?
                            <div className="col-lg-2 col-md-2 col-xl-2 pd-top-30">
                                <div className="rld-single-input">
                                    <label>{t('building_number')}</label>
                                    <input type="text" name="building_number"
                                           value={oldAnnouncement.building_number  || ''}
                                           onChange={(event) => {
                                               event.target.value >=0 && dispatch(getOneAnnouncement({
                                               ...oldAnnouncement,
                                               [ event.target.name]:  event.target.value
                                           }))
                                           }}
                                    />
                                </div>
                            </div>
                            : null}
                        <div className="col-lg-12 col-md-12 col-xl-12 pd-top-30" style={{height: 350}}>
                            <YMaps width="100%" height="100%" enterprise
                                   query={{
                                       apikey: process.env.REACT_APP_Y_API_KEY,
                                       lang: 'en'
                                   }}>
                                <Map state={mapState}
                                     width="100%"
                                     height="100%"
                                     modules={["Placemark", "geocode", "geoObject.addon.balloon"]}
                                     instanceRef={mapRef}
                                     onLoad={(ympasInstance) => (ymaps.current = ympasInstance)}
                                     onClick={onMapClick}
                                >
                                    <Placemark
                                        geometry={[oldAnnouncement.latitude, oldAnnouncement.longitude]}
                                        options={mapOptions}
                                        draggable={true}
                                    />
                                    <SearchControl
                                        options={{
                                            noPlacemark: true,
                                        }}
                                    />
                                    <GeolocationControl options={{position: {bottom: 50, right: 30}}}/>
                                </Map>
                            </YMaps>
                        </div>
                    </div>
                    <div className="row pd-top-50">
                        <div className="col-md-12 col-lg-12 col-xl-12">
                            <div className="section-title">
                                <h4>{t('facilities')}</h4>
                                <div className="row">
                                    {
                                        facilities.map((value, key) => {
                                            return (
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xl-6" key={key}>
                                                    <div className={isFacility(value.id) ? "activeFacility" : "facility"} onClick={() => {
                                                        facilityClick(key)
                                                        dispatch(getFacilities({
                                                            ...announcmentFacilities,
                                                            [value.id]: announcmentFacilities[value.id] ? false : true
                                                        }))
                                                    }} id={'mainClassFacility' + key}>
                                                        <img src={apiUrl + 'storage/uploads/facilities/' + value.image} style={{height: '20px', paddingRight: '5px'}} alt={'...'}/>
                                                        <label
                                                            className="labelStyle">  {value.translations.map((value) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.title : null
                                                        })}</label>&nbsp;
                                                        <input className="checkboxStyle" type="checkbox" defaultChecked={isFacility(value.id)} value={value.id} name={value.title} id={"facility" + key} hidden/>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row pd-top-50">
                        <div className="col-md-12 col-lg-12 col-xl-12">
                            <div className="section-title">
                                <h4>{t('add_info')}</h4>
                                <div className="row">
                                    {additionalInformation.map((addInfo, i) =>
                                        <div key={i} className="col-md-12 col-lg-6 col-xl-6">
                                            <div className={isAddInfo(addInfo.id) ? "activeAdditionalInfo" : "additionalInfo"} onClick={() => {
                                                additionalInfoClick(i)
                                                dispatch(getAdditional({
                                                    ...addInfos,
                                                    [addInfo.id]: addInfos[addInfo.id] ? false : true
                                                }))
                                            }} id={'mainClassAdditionalInfo' + i}>
                                                <img src={apiUrl + 'storage/uploads/additional_infos/' + addInfo.image}
                                                     style={{height: '20px', paddingRight: '5px'}} alt={'...'}/>
                                                <label
                                                    className="labelStyle">{addInfo.translations.map((value, key) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') ||
                                                    (value.locale === localStorage.i18nextLng) ? value.title : null
                                                })}</label>
                                                <input className="checkboxStyle" type="checkbox"
                                                       id={"additionalInfo" + i} defaultChecked={isAddInfo(addInfo.id)}
                                                       value={addInfo.id} name={addInfo.title} hidden/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row pd-top-30">
                        <div className="col-md-12 col-lg-12 col-xl-12">
                            <label>{t('certificate_info')}</label>
                            <ImageUploading  maxFileSize="25000000" value={announcement.certificate} onChange={onChangeCertificate} dataURLKey="data_url">
                                {({imageList, onImageUpload, onImageUpdate, dragProps}) => (
                                    <div className="upload__image-wrapper">
                                        &nbsp;
                                        <div className="row">
                                            <div key={0} className="col-md-12 col-lg-6 col-lx-6">

                                                {announcement.certificate && oldAnnouncement.certificate  ?
                                                        <div className="imageArea">
                                                            <img onClick={() => onImageUpdate(0)} src={imageList[0].data_url} alt="img" width="100%" height="184" style={{borderRadius: 5}}/>
                                                        </div>
                                                        :
                                                        <div className="imageArea" onClick={onImageUpload}{...dragProps}>
                                                            <img alt="img" width="100%" height="184" style={{borderRadius: 5}} src={oldAnnouncement.certificate ? apiUrl + 'storage/uploads/announcements/' + oldAnnouncement.certificate : default_image}/>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ImageUploading>
                        </div>
                    </div>
                    <div className="row  pd-top-50">
                        <div className="col-lg-1 col-md-0 col-sm-0 col-xl-1">
                        </div>
                        <div className="col-lg-6 col-md-8 col-xl-6 col-sm-8 property-filter-menu buttons">
                            {announcement.check_agent === "2" ?
                                <button className="active" style={{width: '100%'}} type="submit"
                                        onClick={async () => {
                                            await dispatch(editListingValidate(announcement, oldAnnouncement, 'continue'))
                                        }
                                        }
                                >{t('continue')}
                                </button> :
                                <button className="active" style={{width: '100%'}} type="submit"
                                        onClick={() => {
                                            dispatch(editListingValidate(announcement, oldAnnouncement))
                                        }}
                                >{t('edit_listing')}
                                </button>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-xl-7 col-lg-7 col-md-7" hidden={active}>
                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-6">
                            <div className="rld-single-input">
                                <div className="sq-single-select">
                                    <button className='back-button' onClick={() => {dispatch(setActiveTab(true))}}>
                                        <img src={`${publicUrl}/assets/img/icons/left-arrow.png`} alt="..."/>
                                        {t('back')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6">
                            <h4>
                                {t('Choose an Agent')}
                            </h4>
                        </div>
                    </div>
                    <div className="user-list-area mg-top-30">
                        <div className="container">
                            <div className="row">
                                {data ? data.map((item, i) =>
                                    <div key={i} className="col-lg-4 col-md-4">
                                        <div
                                            className={oldAnnouncement.broker_id === item.id ? "single-user-list single-feature single-broker-feature selected_card" : "single-user-list single-feature single-broker-feature"}
                                            onClick={() => {
                                                dispatch(getOneAnnouncement({
                                                    ...oldAnnouncement,
                                                    'broker_id':  oldAnnouncement.broker_id === item.id ? '' : item.id
                                                }))
                                            }}>
                                            <div className="brokerImg">
                                                <img src={apiUrl + 'storage/uploads/users/' + item.avatar}
                                                     alt={item.name}/>
                                            </div>
                                            <div className="details">
                                                {
                                                    item.agency ?
                                                        <a href="#feature-logo" className="feature-logo">
                                                            <img src={apiUrl + 'storage/uploads/agencies/' + item.agency.image} alt={item.agency.name}/>
                                                        </a>
                                                        : ''
                                                }
                                                <h4>
                                                    {item.first_name} {item.last_name}
                                                </h4>
                                                <div className='row broker-rating'>
                                                    <ReactStars
                                                        value={item.rating}
                                                        count={5}
                                                        size={24}
                                                        activeColor="#FAA61A"
                                                        emptyIcon={<i className="far fa-star"/>}
                                                        halfIcon={<i className="fa fa-star-half-alt"/>}
                                                        fullIcon={<i className="fa fa-star"/>}
                                                        isHalf={true}
                                                        edit={false}
                                                    />
                                                </div>
                                                <p>
                                                    <i className="fa fa-map-marker"/> {item.state ? item.state.name : ""} {item.city ? item.city.name : ""}
                                                </p>
                                                <span className="phone"><i className="fa fa-phone"/>{item.phone}</span>
                                            </div>
                                            {oldAnnouncement.broker_id === item.id &&
                                            <div className="check"><span className="checkmark">✔</span></div>
                                            }
                                        </div>
                                    </div>
                                ) : ""}
                            </div>
                            {data2.last_page && data2.last_page > 1 ?
                                <Pagination data2={data2} getPage={getPage}/>
                                : ""}
                        </div>
                    </div>
                    <div className="row  pd-top-50">
                        <div className="col-lg-4 col-md-4 col-xl-4 col-sm-4"/>
                        <div className="col-lg-8 col-md-8 col-xl-8 col-sm-8 property-filter-menu buttons">
                            <button className="active" style={{width: '50%'}} type="submit"
                                    onClick={() => {
                                        !active && dispatch(setModal("announcement"))
                                    }}
                            >{t('publish_listing')}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-xl-1 col-lg-1 col-md-1"/>
            </div>
        </div>
        <Modal className="request_modal" isOpen={modal === "announcement"}>
            <ModalHeader toggle={() => {
                dispatch(setAnnouncementModal(""))
            }}/>
            <ModalBody>
                <div className="container">
                    <div className="details text-center">
                        <h4 className="mg-top-30">{t('publish_listing')}</h4>
                        <h6 className="mg-top-30">{t('finish_listing')}</h6>
                        <div className="property-filter-menu buttons mg-top-30">
                            <button className="active" style={{width: '50%'}} type="submit"
                                    onClick={() => {
                                        const price = countPropertyPrice();
                                        dispatch(edit_announcement(announcement, oldAnnouncement, addInfos, announcmentFacilities, price))
                                    }}
                            >{t('edit_listing')}
                            </button>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal className="request_modal" isOpen={modal === "announcement"}>
            <ModalHeader toggle={() => {
                dispatch(setAnnouncementModal(""))
            }}/>
            <ModalBody>
                <div className="container">
                    <div className="details text-center">
                        <h4 className="mg-top-30">{t('publish_listing')}</h4>
                        <h6 className="mg-top-30">{t('finish_listing')}</h6>
                        <div className="property-filter-menu buttons mg-top-30">
                            <button className="active" style={{width: '50%'}} type="submit"
                                    onClick={() => {
                                        const price = countPropertyPrice();
                                        dispatch(edit_announcement(announcement,oldAnnouncement, addInfos, announcmentFacilities, price))
                                    }}
                            >{t('publish_listing')}
                            </button>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}
export default EditAnnouncement

