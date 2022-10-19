import React, {useEffect, useState} from 'react';
import {GeolocationControl, Map, SearchControl, YMaps} from "react-yandex-maps";
import {useParams, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {add_announcement, currencies, states, validateListing} from "../../actions/announcement";
import ImageUploading from 'react-images-uploading';
import {Alert, Modal, ModalBody, ModalHeader} from "reactstrap";
import {setAnnouncementModal, setAnnouncementConditionsModal, setModal} from "../../reducers/modalsReducer";
import {setListingValidate, setLoadListing} from "../../reducers/announcementReducer";
import ReCAPTCHA from "react-google-recaptcha";
import {conditionText} from "../../actions/text";
import {PulseLoader} from "react-spinners";
import NumberFormat from "react-number-format";

const AddLand = (props) => {
    const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY;
    const recaptchaRef = React.createRef();
    const {t} = props;
    const dispatch = useDispatch();
    const [mapState] = useState({
        center: [40.1776121, 44.6125849],
        zoom: 10,
        yandexMapDisablePoiInteractivity: true,
    });
    const [isCondition, setIsCondition] = useState(true);
    const [announcement, setAnnouncement] = useState({
        area: '',
        land_geometric: '',
        purpose: '',
        price: '',
        address: '',
        front_position: '',
        front_position_length: '',
        sewer: '',
        distance_from_metro_station: '',
        distance_from_medical_center: '',
        distance_from_stations: '',
        road_type: '',
        fence_type: '',
        infrastructure: '',
        category: '',
        latitude: '',
        longitude: '',
        images: [],
        description: '',
        type: '',
        user_id: '',
        certificate: '',
        building: '',
        agree: '',
        rent_type: 'monthly_rent',
        state: '40.1872023_44.515209',
        city: '',
        city_id: '1',
        region: 'Yerevan',
        region_id: '1',
        dataRange: [null, null],
        check_agent: 0,
        agent_id: ''
    });
    const history = useHistory();
    const load_listing = useSelector(state => state.announcement.loadListing)
    const load_validate = useSelector(state => state.announcement.loadValidateListing)
    const addListingFinished = useSelector(state => state.announcement.addListingFinished)
    addListingFinished && history.push('/')
    const {type, category, broker} = useParams();
    announcement.type = type;
    announcement.category = category;
    announcement.agent_id = broker;
    announcement.user_id = useSelector(state => state.auth.currentUser ? state.auth.currentUser.id : state.auth.currentUser);
    const ymaps = React.useRef(null);
    const placemarkRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const [index, setIndex] = useState(0);
    const regions = useSelector(state => state.announcement.states);
    const text = useSelector(state => state.modals.text);
    const allCurrenies = useSelector(state => state.announcement.currencies);
    const [condition_accept, setConditionAccept] = useState(true);

    useEffect(() => {
        dispatch(states());
        dispatch(currencies());
        dispatch(conditionText('condition'));
    }, [dispatch])
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
    const conditions = () => {
        dispatch(setAnnouncementConditionsModal('announcementCondition'));
    }

    function onChangeRecaptcha(value) {
        announcement.recaptcha = value;
    }

    const modal = useSelector(state => state.modals.modal);
    const errors = useSelector(state => state.announcement.errors);
    const spinner = useSelector(state => state.modals.spinner)
    const yMapContainer = React.createRef();

    function focus() {
        yMapContainer.current.scrollIntoView(true)
        const input = document.getElementById("YMaps").getElementsByTagName("INPUT");
        input[0].focus();
    }

    return <div className="add-new-property-area pd-top-90 " style={{backgroundColor: '#FBFBFB'}}>
        <div className="container">
            {isCondition && conditions()}
            <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-7 col-md-7 pd-top-30">
                    <div className="section-title">
                        <h4>{t('general_description')}</h4>
                    </div>
                    <div className="row pd-top-10">
                        {
                            category === "2" ?
                                <div className="col-md-12 col-xl-12 col-lg-12 pd-bottom-20">
                                    <div className="row">
                                        <div className={"col-md-4 col-xl-4 col-lg-4 mg-top-10"}>
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
                                                            onChange={event => {
                                                                setAnnouncement({
                                                                    ...announcement,
                                                                    [event.target.name]: event.target.value
                                                                })
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
                                                        <option name='daily_rent'>{t('daily_rent')}</option>
                                                        <option name='monthly_rent'>{t('monthly_rent')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <label className="error-message">
                                        {errors["data.price"] && t('require')}
                                    </label>
                                </div>
                                : <div className="col-md-12 col-xl-6 col-lg-6">
                                    <div className="row">
                                        <div className="col-md-6 col-xl-6 col-lg-6">
                                            <label>{t('price')}<span>*</span></label>
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
                                        <div className="col-md-6 col-xl-6 col-lg-6 ">
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
                                            </div>
                                        </div>
                                    </div>
                                    <label className="error-message">{errors["data.price"] && t('require')}</label>
                                </div>
                        }
                        <div className="col-lg-6 col-md-12 col-xl-6 pd-bottom-20">
                            <div className="rld-single-input">
                                <label>{t('general_area')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <input type="text" name="area" placeholder="xxx" value={announcement.area}
                                           onChange={(event) => {
                                               event.target.value >= 0 && setAnnouncement({
                                                   ...announcement,
                                                   [event.target.name]: event.target.value
                                               })
                                           }}
                                    />
                                    <label className="meterSquare">{t('m')}²</label>
                                    <label
                                        className="error-message">{errors["data.area"] && t('require')}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6 pd-bottom-20">
                            <div className="rld-single-input ">
                                <label>{t('front_position_length')}<span>*</span></label>
                                <div>
                                    <input type="text" name="front_position_length" placeholder="xxx"
                                           value={announcement.front_position_length}
                                           onChange={event => {
                                               event.target.value >= 0 && setAnnouncement({
                                                   ...announcement,
                                                   [event.target.name]: event.target.value
                                               })
                                           }}
                                    />
                                    <label className="meterSquare">m </label>
                                    <label
                                        className="error-message">{errors["data.front_position_length"] && t('require')}</label>
                                </div>
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
                                    className="error-message">{errors["data.distance_from_metro_station"] && t('require')}</label>
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
                                    className="error-message">{errors["data.distance_from_medical_center"] && t('require')}</label>
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
                                    className="error-message">{errors["data.distance_from_stations"] && t('require')}</label>
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
                                <label className="error-message">{errors["data.sewer"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('land_geometric')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name='land_geometric'
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={'0-2'}>{t('smooth')}</option>
                                        <option value={'2-5'}>2-5 {t('degrees')}</option>
                                        <option value={'5-10'}>5-10 {t('degrees')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{errors["data.land_geometric"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('purpose')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="purpose"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
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
                                <label className="error-message">{errors["data.purpose"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('front_position')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="front_position"
                                            onChange={event => {
                                                setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })
                                            }
                                            }
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"primary_and_secondary"}>{t('primary_and_secondary')}</option>
                                        <option value={"primary"}>{t('primary')}</option>
                                        <option value={"secondary"}>{t('secondary')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{errors["data.front_position"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('road_type')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="road_type"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"asphalt"}>{t('asphalt')}</option>
                                        <option value={"ground"}>{t('ground')}</option>
                                    </select>
                                </div>
                                <label className="error-message">{errors["data.road_type"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('fence_type')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="fence_type"
                                            onChange={event => {
                                                setAnnouncement({
                                                    ...announcement,
                                                    [event.target.name]: event.target.value
                                                })
                                            }}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"partly_fenced"}>{t('partly_fenced')}</option>
                                        <option value={"stone_fence"}>{t('stone_fence')}</option>
                                        <option value={"no_fence"}>{t('no_fence')}</option>
                                    </select>
                                </div>
                                <label className="error-message">{errors["data.fence_type"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('infrastructure')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="infrastructure"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
                                    >
                                        <option value=''>{t('choose')}</option>
                                        <option value={"all_available"}>{t('all_available')}</option>
                                        <option value={"no_communication"}>{t('no_communication')}</option>
                                        <option
                                            value={"all_available_except_irrigation_water"}>{t('all_available_except_irrigation_water')}</option>
                                    </select>
                                </div>
                                <label
                                    className="error-message">{errors["data.infrastructure"] && t('require')}</label>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6">
                            <div className="rld-single-input">
                                <label>{t('building')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select"
                                            name="building"
                                            onChange={event => setAnnouncement({
                                                ...announcement,
                                                [event.target.name]: event.target.value
                                            })}
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
                                    {errors["data.building"] && t('require')}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-12 col-lg-12">
                            <div className="rld-single-input">
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
                        <div ref={yMapContainer} className="col-lg-12 col-md-12 col-xl-12 pd-top-50">
                            <div className="rld-single-input">
                                <label>{t('address')} <span>*</span></label>
                                <div className="addressInfoHover" onClick={() => focus()}>
                                    <input type="text" name="address" placeholder={t('info_address')}
                                           disabled
                                           style={{position: "relative"}}
                                           value={announcement.address}/>
                                    <label
                                        className="error-message">{errors["data.address"] && t('require')}</label>
                                    <div className="infoIcon">
                                        <i className="fa fa-info"/>
                                    </div>
                                    <div className="addressInfo">{t('info_address')}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-xl-12 pd-top-30" id="YMaps" style={{height: 350}}>
                            <YMaps width="100%" height="100%" enterprise
                                   query={{
                                       apikey: process.env.REACT_APP_Y_API_KEY,
                                   }}>
                                <Map
                                    width="100%"
                                    height="100%"
                                    modules={["Placemark", "geocode", "geoObject.addon.balloon", "geoObject.addon.editor"]}
                                    instanceRef={mapRef}
                                    onLoad={(ympasInstance) => (ymaps.current = ympasInstance)}
                                    onClick={onMapClick}
                                    state={mapState}
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
                        <div className="col-lg-12 col-md-12 col-xl-12 pd-top-50">
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
                                                                 src={imageList[0].data_url} alt="img"
                                                                 width="100%"
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
                                   }}/>
                            <label className="labelStyle">{t('agree_question')}</label>
                            <br/>
                            <label className="error-message">{errors["data.agree"] && t('require')}</label>
                        </div>
                        <div className="col-md-12 col-lg-12 col-xl-12 pd-top-30">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={recaptchaKey}
                                onChange={onChangeRecaptcha}
                            />
                            <label
                                className="error-message">{errors["data.recaptcha"] && t('require')}
                            </label>
                        </div>
                        <div className="col-lg-1 col-md-0 col-sm-0 col-xl-1 pd-top-50">
                        </div>
                        <div className="col-lg-6 col-md-12 col-xl-6 pd-top-50 property-filter-menu buttons">
                            {announcement.check_agent === "2" ?
                                !load_validate ?
                                    <button className="active" style={{width: '100%'}} type="submit"
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
                            <h5>
                                {text && text.translations && text.translations.map((value) => {
                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.sub_title : null
                                })}
                            </h5>
                            <div className="col-10 condition_text">
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
                    <div className="row pd-top-50">
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
                                dispatch(setModal(""))
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
                dispatch(setAnnouncementModal(""))
                dispatch(setListingValidate(false))
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
                                              dispatch(add_announcement(announcement))
                                          }}
                                >{t('publish_listing')}
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
            }}/>
            <ModalBody>
                <div className="container">
                    <div className="details text-center">
                        <Alert color="warning" className="col-xl-12 col-lg-12 col-md-12">
                            {t('listing_limit_error')}
                        </Alert>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}

export default AddLand

