import React, {useEffect, useState} from 'react';
import {GeolocationControl, Map, SearchControl, YMaps} from "react-yandex-maps";
import {useHistory, useParams} from "react-router-dom";
import NumberFormat from "react-number-format";
import {
    add_announcement,
    additional_information,
    currencies,
    facilities_information,
    states, validateListing
} from "../../actions/announcement";
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch, useSelector} from "react-redux";
import ImageUploading from 'react-images-uploading';
import {limit_text} from "../../actions/text";
import {Alert, Modal, ModalBody, ModalHeader} from "reactstrap";
import {
    setAnnouncementConditionsModal,
    setAnnouncementModal,
} from "../../reducers/modalsReducer";
import {setActiveTab, setListingValidate, setLoadListing} from "../../reducers/announcementReducer";
import ReCAPTCHA from "react-google-recaptcha";
import {conditionText} from "../../actions/text";
import {PulseLoader} from "react-spinners";
import {get_search_agent} from "../../actions/request";

const AddNew = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY;
    const recaptchaRef = React.createRef();
    const dispatch = useDispatch();
    const {t} = props;
    const [floors, setFloors] = useState(25)
    const [mapState] = useState({
        center: [40.1776121, 44.6125849],
        zoom: 10,
        yandexMapDisablePoiInteractivity: true,
    });
    let data = useSelector(state => state.agent.agents.data)
    const history = useHistory();
    const coefficient = {
        price: {
            reinforced_concrete: 230000,
            stone: 255000
        },
        region: {
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

    const [announcement, setAnnouncement] = useState({
        price: '',
        rent_type: 'daily_rent',
        land_area: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        ceiling_height: '',
        floor: '',
        storeys: '',
        balcony: '',
        cover: '',
        condition: '',
        building_type: '',
        sewer: '',
        distance_from_metro_station: '',
        distance_from_medical_center: '',
        distance_from_stations: '',
        address: '',
        furniture: '',
        category: '',
        latitude: '',
        longitude: '',
        images: [],
        description: '',
        type: '',
        user_id: '',
        certificate: '',
        check_agent: 0,
        agree: '',
        building_number: '',
        state: '40.1872023_44.515209',
        city: '',
        region: 'Yerevan',
        recaptcha: '',
        region_id: '1',
        city_id: '',
        currency: '',
        condominium: '',
        agent_id: ''
    });
    const [propertyPrice, setPropertyPrice] = useState({
        price: 'reinforced_concrete',
        region: 'erevan',
        cover: 'reinforced_concrete',
        ceiling_height: '2.7',
        floor: 1,
        degree: 0,
        year: '0.6',
        area: 0,
        buildingType: 'reinforced_concrete'
    });
    const countPropertyPrice = () => {
        return propertyPrice.area * coefficient.price[propertyPrice.buildingType] * ((coefficient.region[propertyPrice.region])[0] + (coefficient.region[propertyPrice.region])[1]) / 2 * coefficient.cover[propertyPrice.cover]
            * propertyPrice.ceiling_height * coefficient.floor[propertyPrice.floor] * coefficient.degree[propertyPrice.degree]
            * coefficient.year[propertyPrice.year];
    }

    const {type, category, broker} = useParams();
    announcement.type = type;
    announcement.category = category;
    announcement.agent_id = broker;
    announcement.user_id = useSelector(state => state.auth.currentUser ? state.auth.currentUser.id : state.auth.currentUser);
    const facilities = useSelector(state => state.announcement.facilitiesInformation);
    const [selectedAdditionalInformation, setSelectidAdditionalInformation] = useState({});
    const [selectedFacilitiesaInformation, setSelectidFacilitiesInformation] = useState({});
    const [condition_accept, setConditionAccept] = useState(true);
    const ymaps = React.useRef(null);
    const placemarkRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const additionalInformation = useSelector(state => state.announcement.additionalInformation);
    const regions = useSelector(state => state.announcement.states);
    const text = useSelector(state => state.modals.text);
    const limitText = useSelector(state => state.modals.limitText);
    const allCurrenies = useSelector(state => state.announcement.currencies);
    const modal = useSelector(state => state.modals.modal);
    const [index, setIndex] = useState(0);
    const [isCondition, setIsCondition] = useState(false);
    const validation_errors = useSelector(state => state.announcement.errors);
    const spinner = useSelector(state => state.modals.spinner)
    const load_listing = useSelector(state => state.announcement.loadListing)
    const load_validate = useSelector(state => state.announcement.loadValidateListing)
    const addListingFinished = useSelector(state => state.announcement.addListingFinished)
    addListingFinished && history.push('/')
    const yMapContainer = React.createRef();
    const changeFloor = (event) => {
        setAnnouncement({
            ...announcement,
            [event.target.name]: event.target.value
        })
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
        setAnnouncement({
            ...announcement,
            [event.target.name]: event.target.value
        })
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

    useEffect(() => {
        if (!additionalInformation.length) {
            dispatch(additional_information());
        }
        if (!facilities.length) {
            dispatch(facilities_information());
        }
        if (!regions.length) {
            dispatch(states());
        }
        if (!text) {
            dispatch(conditionText('condition'));
        }
        if (!limitText) {
            dispatch(limit_text('limit'));
        }
        if (!allCurrenies.length) {
            dispatch(currencies());
        }
        if (!data) {
            dispatch(get_search_agent(1))
        }
        setIsCondition(true)
    }, [dispatch, text, limitText, additionalInformation.length, allCurrenies.length, data, facilities.length, regions.length])
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
            setAnnouncement({
                ...announcement, address: firstGeoObject.getAddressLine(), latitude: coords[0], longitude: coords[1]
            })
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
    const handleSelect = async (address, type) => {
        if (!address) {
            return announcement.city = '';
        }
        if (type === "state") {
            address = address + ', Armenia'
        } else {
            regions.map((value => {
                if (value.name === announcement.region) {
                    return (announcement.city_id = value.cities[address].id) && (announcement.city = value.cities[address].name);
                }
                return null
            }))
            address = announcement.city + ', ' + announcement.region + ', Armenia'
        }
    };

    function onChangeRecaptcha(value) {
        announcement.recaptcha = value;
    }

    function focus() {
        yMapContainer.current.scrollIntoView(true)
        const input = document.getElementById("YMaps").getElementsByTagName("INPUT");
        input[0].focus();
    }

    return <div className="add-new-property-area " style={{backgroundColor: '#FBFBFB'}}>
        <div className="container pd-top-90">
            <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-7 col-md-7  mg-top-30">
                    <div className="section-title">
                        <h4>{t('general_description')}</h4>
                    </div>
                    <div className="row pd-top-10">
                        {
                            category === "2" ?
                                <div className="col-md-12 col-xl-12 col-lg-12 pd-bottom-20">
                                    <div className="row">
                                        <div className="col-md-4 col-xl-4 col-lg-4 mg-top-10">
                                            {t('rent_price')}<span>*</span>
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <NumberFormat
                                                        name="price"
                                                        placeholder="xxxxx"
                                                        value={announcement.price}
                                                        thousandSeparator={true}
                                                        allowNegative={false}
                                                        inputMode="numeric"
                                                        onValueChange={(values) => {
                                                            const {formattedValue} = values;
                                                            setAnnouncement({
                                                                ...announcement,
                                                                'price': formattedValue
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-xl-4 col-lg-4 mg-top-10">
                                            {t('currency')}<span>*</span>
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <select className="select single-select add-property-select"
                                                            name="currency"
                                                            onChange={event => setAnnouncement({
                                                                ...announcement,
                                                                [event.target.name]: event.target.value
                                                            })}
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
                                        <div className="col-md-4 col-xl-4 col-lg-4 mg-top-35">
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <select className="select single-select add-property-select"
                                                            name="rent_type"
                                                            onChange={event => setAnnouncement({
                                                                ...announcement,
                                                                [event.target.name]: event.target.value
                                                            })}
                                                    >
                                                        <option value="daily_rent">{t('daily_rent')}</option>
                                                        <option value="monthly_rent">{t('monthly_rent')}</option>
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
                                        <div className="col-md-12 col-xl-6 col-lg-6">
                                            <label>{t('price')}<span>*</span></label>
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <NumberFormat
                                                        allowNegative={false}
                                                        name="price"
                                                        placeholder="xxxxx"
                                                        value={announcement.price}
                                                        thousandSeparator={true}
                                                        inputMode="numeric"
                                                        onValueChange={(values) => {
                                                            const {formattedValue} = values;
                                                            setAnnouncement({
                                                                ...announcement,
                                                                'price': formattedValue
                                                            })
                                                        }}
                                                    />
                                                    <label className="error-message">
                                                        {validation_errors["data.price"] && t('require')}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-xl-6 col-lg-6 ">
                                            <label>{t('currency')}<span>*</span></label>
                                            <div className="rld-single-input">
                                                <div className="sq-single-select">
                                                    <select className="select single-select add-property-select"
                                                            name="currency"
                                                            onChange={event => setAnnouncement({
                                                                ...announcement,
                                                                [event.target.name]: event.target.value
                                                            })}
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
                                                <label
                                                    className="error-message">{validation_errors["data.ceiling_height"] && t('require')}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                        <div className="col-md-12 col-xl-6 col-lg-6 pd-bottom-20">
                            <div className="rld-single-input">
                                <label>{(type !== '3' && t('area')) || t('general_area')} <span>*</span></label>
                                <input type="text" name="area" placeholder="xxx" value={announcement.area}
                                       onChange={event => {
                                           event.target.value >= 0 && setAnnouncement({
                                               ...announcement,
                                               [event.target.name]: event.target.value
                                           })
                                           setPropertyPrice({
                                               ...propertyPrice,
                                               [event.target.name]: event.target.value
                                           })

                                       }}
                                />
                                <label className="meterSquare">{t('m')}²</label>
                                <label
                                    className="error-message">{validation_errors["data.area"] && t('require')}</label>
                            </div>
                        </div>
                        {type === "1" ?
                            <div className="col-md-12 col-xl-6 col-lg-6 pd-bottom-20">
                                <div className="rld-single-input">
                                    <label>{t('land_area')}</label>
                                    <div className="sq-single-select">
                                        <input type="text" name="land_area" placeholder="xxx"
                                               value={announcement.land_area}
                                               onChange={(event) => {
                                                   event.target.value >= 0 && setAnnouncement({
                                                       ...announcement,
                                                       [event.target.name]: event.target.value
                                                   })
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
                        {type !== "3" ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-select">
                                    <label>{t('number_of_bedrooms')} <span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select"
                                                name='bedrooms'
                                                placeholder={t('choose')}
                                                onChange={event => setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })}
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
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('ceiling_height')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="ceiling_height"
                                            onChange={event => ceilingHeightChange(event)}
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
                                <label
                                    className="error-message">{validation_errors["data.ceiling_height"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('storeys')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="storeys"
                                            onChange={event => {
                                                setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })
                                                setFloors(event.target.value)
                                            }}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        {
                                            [...Array(25)].map((el, index) => <option value={index + 1}
                                                                                      key={index}>{index + 1}</option>)
                                        }

                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.storeys"] && t('require')}</label>
                            </div>
                        </div>
                        {type === "2" || type === "3" ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-input ">
                                    <label>{t('floor')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select" name="floor"
                                                onChange={(event) => {
                                                    setAnnouncement({
                                                        ...announcement,
                                                        [event.target.name]: event.target.value
                                                    })
                                                }
                                                }
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value={"basement"}>{t('basement')}</option>
                                            {
                                                [...Array(Number(floors))].map((el, index) => <option value={index + 1}
                                                                                                      key={index}>{index + 1}</option>)
                                            }
                                        </select>
                                    </div>
                                    <label
                                        className="error-message">{validation_errors["data.floor"] && t('require')}</label>
                                </div>
                            </div> : null}
                        {type === "3" ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-input ">
                                    <label>{t('land_type')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select" name="land_type"
                                                onChange={event => setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value="shops">{t('shops')}</option>
                                            <option value="offices">{t('offices')}</option>
                                            <option value="services">{t('services')}</option>
                                            <option value="other">{t('other')}</option>
                                        </select>
                                    </div>
                                    <label
                                        className="error-message">{validation_errors["data.land_type"] && t('require')}</label>
                                </div>
                            </div>
                            : null}
                        {type === "3" ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-input ">
                                    <label>{t('property_place')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select"
                                                name="property_place"
                                                onChange={event => setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value="into_building">{t('into_building')}</option>
                                            <option value="out_of_building">{t('out_of_building')}</option>
                                        </select>
                                    </div>
                                    <label className="error-message">
                                        {validation_errors["data.property_place"] && t('require')}
                                    </label>
                                </div>
                            </div>
                            : null}
                        {type !== "3" ?
                            <div className="col-md-12 col-xl-6 col-lg-6">
                                <div className="rld-single-input">
                                    <label>{t('balcony')}<span>*</span></label>
                                    <div className="sq-single-select">
                                        <select className="select single-select add-property-select"
                                                name="balcony"
                                                onChange={event => setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })}
                                        >
                                            <option value=''>{t('choose')}</option>
                                            <option value='open_balcony'>{t('open_balcony')}</option>
                                            <option value='close_balcony'>{t('close_balcony')}</option>
                                            <option value='no_balcony'>{t('no_balcony')}</option>
                                        </select>
                                    </div>
                                    <label className="error-message">
                                        {validation_errors["data.balcony"] && t('require')}
                                    </label>
                                </div>
                            </div>
                            : null}
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('cover')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="cover"
                                            onChange={event => {
                                                setPropertyPrice({
                                                    ...propertyPrice,
                                                    [event.target.name]: event.target.value
                                                })

                                                setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })
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
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-select">
                                <label>{t('number_of_bathrooms')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="bathrooms"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={1}>1</option>
                                        <option value={1.5}>1.5</option>
                                        <option value={2}>2</option>
                                        <option value={2.5}>2.5</option>
                                        <option value={3}>3</option>
                                        <option value={3.4}>3.5</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.bathrooms"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('condition')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="condition"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"zero_condition"}>{t('zero_condition')}</option>
                                        <option value={"bad"}>{t('bad')}</option>
                                        <option value={"middle"}>{t('middle')}</option>
                                        <option value={"good"}>{t('good')}</option>
                                        <option value={"excellent"}>{t('excellent')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.condition"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('building_type')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="building_type"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"new_building"}>{t('new_building')}</option>
                                        <option value={"monolith"}>{t('monolith')}</option>
                                        <option value={"stone"}>{t('stone')}</option>
                                        <option value={"panel"}>{t('panel')}</option>
                                        <option value={"other"}>{t('other')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.building_type"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('sewer')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select" name="sewer"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value="individual">{t('individual')}</option>
                                        <option value="centralised">{t('centralised')}</option>
                                        <option value="no_sewer">{t('no_sewer')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.sewer"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('distance_from_metro_station')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="distance_from_metro_station"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value="0 - 100">{t('before')} 100</option>
                                        <option value="100 - 500">100 - 500</option>
                                        <option value="no_metro">{t('no_metro')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.distance_from_metro_station"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('distance_from_medical_center')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="distance_from_medical_center"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
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
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('furniture')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select" name="furniture"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={true}>{t('furniture_available')}</option>
                                        <option value={false}>{t('furniture_no_available')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.furniture"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input ">
                                <label>{t('distance_from_stations')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="distance_from_stations"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value="0-100">{t('before')} 100</option>
                                        <option value="101-300">101 - 300</option>
                                        <option value="301">301 +</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{validation_errors["data.sewer"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('year')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="year"
                                            onChange={event => {
                                                setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })
                                                setPropertyPrice({
                                                    ...propertyPrice,
                                                    [event.target.name]: event.target.value
                                                })

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
                        </div>
                        <div className="col-md-12 col-xl-6 col-lg-6">
                            <div className="rld-single-input">
                                <label>{t('degree')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="degree"
                                            onChange={event => {
                                                setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })
                                                setPropertyPrice({
                                                    ...propertyPrice,
                                                    [event.target.name]: event.target.value
                                                })

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
                        </div>
                        {type !== "1" && <div className="col-md-12 col-xl-6 col-lg-6 pd-bottom-20">
                            <label>{t('condominium')}<span>*</span></label>
                            <div className="rld-single-input">
                                <div className="sq-single-select">
                                    <input type="text" name="condominium" placeholder="xxx"
                                           value={announcement.condominium}
                                           onChange={(event) => {
                                               event.target.value >= 0 && setAnnouncement({
                                                   ...announcement,
                                                   [event.target.name]: event.target.value
                                               })
                                           }}
                                    />
                                    <label className="meterSquare">֏</label>
                                    <label
                                        className="error-message">{validation_errors["data.condominium"] && t('require')}</label>
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
                                                onChange={event => {
                                                    announcement.region_id = regions[event.target.value].id
                                                    announcement.region = regions[event.target.value].name
                                                    setIndex(event.target.value);
                                                    announcement.city = '';
                                                }
                                                }
                                        >
                                            {regions.map((value, key) => (
                                                <option key={key} value={key}>
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
                                                onChange={event => {
                                                    handleSelect(event.target.value, event.target.name);
                                                }
                                                }
                                        >
                                            <option value="">{t('choose')}</option>
                                            {regions[index] && regions[index].cities.map((value, key) => (
                                                <option key={index + '.' + key} value={key}>
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
                        <div ref={yMapContainer}
                             className={type !== "1" ? "col-lg-10 col-md-12 col-xl-10 pd-top-30" : "col-lg-12 col-md-12 col-xl-12 pd-top-30"}>
                            <div className="rld-single-input">
                                <label>{t('address')} <span>*</span></label>
                                <div className="addressInfoHover" onClick={() => focus()}>
                                    <input type="text" name="address" placeholder={t('info_address')}
                                           disabled
                                           style={{position: "relative"}}
                                           value={announcement.address}/>
                                    <div className="infoIcon">
                                        <i className="fa fa-info"/>
                                    </div>
                                    <div className="addressInfo">{t('info_address')}</div>
                                    <label
                                        className="error-message">{validation_errors["data.address"] && t('require')}</label>
                                </div>
                            </div>
                        </div>
                        {type !== "1" ?
                            <div className="col-lg-2 col-md-2 col-xl-2 pd-top-30">
                                <div className="rld-single-input">
                                    <label>{t('building_number')}</label>
                                    <input type="text" name="building_number"
                                           onChange={(event) => {
                                               event.target.value >= 0 && setAnnouncement({
                                                   ...announcement,
                                                   [event.target.name]: event.target.value
                                               })
                                           }}
                                    />
                                </div>
                            </div>
                            : null}

                        <div className="col-lg-12 col-md-12 col-xl-12 pd-top-30" id="YMaps" style={{height: 350}}>
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
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-xl-6" key={key}>
                                                    <div className="facility" onClick={() => {
                                                        facilityClick(key)
                                                        setSelectidFacilitiesInformation({
                                                            ...selectedFacilitiesaInformation,
                                                            [value.id]: selectedFacilitiesaInformation[value.id] ? false : true
                                                        })
                                                    }} id={'mainClassFacility' + key}>
                                                        <img src={apiUrl + 'storage/uploads/facilities/' + value.image}
                                                             style={{height: '20px', paddingRight: '5px'}} alt={"..."}/>
                                                        <label
                                                            className="labelStyle">  {value.translations.map((value) => {
                                                            return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.title : null
                                                        })} </label>
                                                        <input className="checkboxStyle" type="checkbox"
                                                               id={"facility" + key} hidden/>
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
                                        <div key={i} className="col-lg-6 col-md-6 col-sm-6 col-xl-6">
                                            <div className="additionalInfo" onClick={() => {
                                                additionalInfoClick(i)
                                                setSelectidAdditionalInformation({
                                                    ...selectedAdditionalInformation,
                                                    [addInfo.id]: selectedAdditionalInformation[addInfo.id] ? false : true
                                                })
                                            }} id={'mainClassAdditionalInfo' + i}>
                                                <img src={apiUrl + 'storage/uploads/additional_infos/' + addInfo.image}
                                                     style={{height: '20px', paddingRight: '5px'}} alt={"..."}/>
                                                <label
                                                    className="labelStyle">{addInfo.translations.map((value, key) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') ||
                                                    (value.locale === localStorage.i18nextLng) ? value.title : null
                                                })}</label>
                                                <input className="checkboxStyle" type="checkbox"
                                                       id={"additionalInfo" + i} hidden/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row pd-top-50">
                        <div className="col-md-12 col-lg-12 col-xl-12">
                            <label>{t('certificate_info')}</label>
                            <ImageUploading maxFileSize="25000000" value={announcement.certificate}
                                            onChange={onChangeCertificate}
                                            dataURLKey="data_url">
                                {({imageList, onImageUpload, onImageUpdate, dragProps}) => (
                                    <div className="upload__image-wrapper">
                                        &nbsp;
                                        <div className="row">
                                            <div key={0} className="col-md-12 col-lg-6 col-lx-6">

                                                {
                                                    announcement.certificate !== '' ?
                                                        <div className="imageArea"
                                                        >
                                                            <img onClick={() => onImageUpdate(0)}
                                                                 src={imageList[0].data_url} alt="img" width="100%"
                                                                 height="184" style={{borderRadius: 5}}/>
                                                        </div>
                                                        :
                                                        <div className="imageArea"
                                                             onClick={onImageUpload}
                                                             {...dragProps}
                                                        >
                                                            <div className="imageAreaIcons">
                                                                <i className="fa fa-picture-o" aria-hidden="true"></i>
                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ImageUploading>
                        </div>

                        <div className="col-md-12 col-lg-12 col-xl-12 pd-top-30">
                            <input className="checkboxStyle" type="checkbox" id="agree_terms"
                                   name="agree_terms"
                                   onChange={() => {
                                       announcement.agree ? announcement.agree = '' : announcement.agree = 'true'
                                   }}
                            />
                            <label className="labelStyle">{t('agree_question')}</label>
                            <br/>
                            <label className="error-message">{validation_errors["data.agree"] && t('require')}</label>
                        </div>
                        <div className="col-md-12 col-lg-12 col-xl-12 pd-top-60">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={recaptchaKey}
                                onChange={onChangeRecaptcha}
                            />
                            <label
                                className="error-message">{validation_errors["data.recaptcha"] && t('require')}</label>
                        </div>
                    </div>
                    <div className="row  pd-top-50">
                        <div className="col-lg-1 col-md-0 col-sm-0 col-xl-1"/>
                        <div className="col-lg-6 col-md-8 col-xl-6 col-sm-8 property-filter-menu buttons">
                            {announcement.check_agent === "2" ?
                                !load_validate ? <button className="active" style={{width: '100%'}} type="submit"
                                                         onClick={() => {
                                                             dispatch(setListingValidate(true))
                                                             dispatch(validateListing(announcement, 'continue'))
                                                         }
                                                         }
                                    >{t('continue')}
                                    </button> :
                                    <div className="spinner_content">
                                        <div className="sweet-loading">
                                            <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                                        </div>
                                    </div>
                                :
                                !load_validate ?
                                    <button className="active" style={{width: '100%'}} type="submit"
                                            onClick={() => {
                                                dispatch(setListingValidate(true))
                                                dispatch(validateListing(announcement))
                                            }}
                                    >{t('publish_listing')}
                                    </button>
                                    :
                                    <div className="spinner_content">
                                        <div className="sweet-loading">
                                            <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal className="condition_modal" isOpen={isCondition}>
            <ModalBody>
                <div className="container">
                    {spinner ?
                        <div className="spinner_content">
                            <div className="sweet-loading">
                                <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                            </div>
                        </div>
                        :
                        <div className="details text-center pd-bottom-40 pd-top-40">
                            <h5 className="preview">
                                {text && text.translations && text.translations.map((value) => {
                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.sub_title : null
                                })}
                            </h5>
                            <div className="col-md-10 col-sm-12 condition_text">
                                <p>
                                    {text && text.translations && text.translations.map((value) => {
                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.text : null
                                    })}
                                </p>
                            </div>
                        </div>
                    }
                    <div className="text-center">
                        <label className="labelStyle condition_label">{t('accept')}
                            <input className="ml-2 checkboxStyle"
                                   type="checkbox" value={condition_accept}
                                   name="condition_accept"
                                   onChange={() => {
                                       setConditionAccept(!condition_accept)
                                   }}
                            />
                        </label>
                    </div>
                    <div className="row  pd-top-50">
                        <div className="col-lg-3 col-md-3 col-xl-3"/>
                        <div className="col-lg-3 col-md-3 col-xl-3 property-filter-menu buttons">
                            <button className={!condition_accept ? "active" : ""} style={{width: '100%'}} type="submit"
                                    disabled={condition_accept}
                                    onClick={() => {
                                        dispatch(setAnnouncementConditionsModal(""))
                                        setIsCondition(false);
                                    }}>
                                {t('continue')}
                            </button>
                        </div>
                        <div className="col-lg-3 col-md-3 col-xl-3 property-filter-menu buttons">
                            <button style={{width: '100%'}} onClick={() => {
                                dispatch(setAnnouncementConditionsModal(""))
                                history.goBack();
                            }}>{t('cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal className="request_modal" isOpen={modal === "announcement"}>
            <ModalHeader toggle={() => {
                dispatch(setListingValidate(false))
                dispatch(setAnnouncementModal(""))
            }}/>
            <ModalBody>
                <div className="container">
                    <div className="details text-center">
                        <h4 className="mg-top-30">{t('publish_listing')}</h4>
                        <h6 className="mg-top-30">{t('finish_listing')}</h6>
                        <Alert color="info" className="col-xl-12 col-lg-12 col-md-12">
                            {t('verify_listing')}
                        </Alert>
                        <div className="property-filter-menu buttons mg-top-30">
                            {load_listing ?
                                <div className="spinner_content">
                                    <div className="sweet-loading">
                                        <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                                    </div>
                                </div>
                                : <button className="active" style={{width: '50%'}} type="submit"
                                          onClick={() => {
                                              dispatch(setLoadListing(true))
                                              const price = countPropertyPrice();
                                              dispatch(add_announcement(announcement, selectedAdditionalInformation, selectedFacilitiesaInformation, price))

                                          }}
                                >{t('verify')}
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal className="request_modal" isOpen={modal === "announcements_limit"}>
            <ModalHeader toggle={() => {
                dispatch(setAnnouncementModal(""))
                history.push('/')
                dispatch(setActiveTab(true))
            }}/>
            <ModalBody>
                <div className="container">
                    <div className="details text-center">
                        <Alert color="warning" className="col-xl-12 col-lg-12 col-md-12">
                            {limitText.translations && limitText.translations.map((value) => {
                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.text : null
                            })}
                        </Alert>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}
export default AddNew

