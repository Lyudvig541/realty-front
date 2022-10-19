import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {agenciesAll} from "../../actions/resources";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Autoplay } from 'swiper';
import {Link} from "react-router-dom";

SwiperCore.use([Navigation, Autoplay]);

const Agencies = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(agenciesAll())
    }, [dispatch])
    let data = useSelector(state => state.resources.agencies)
    const {t} = props;
    const prevRef = React.useRef(null);
    const nextRef = React.useRef(null);
    return <div className="agencies-swiper-container">
        <div className="container">
            <div className="text-center">
                <h3 className="title"> {t('estate_agencies')}</h3>
                <div className="partner-red-line"/>
                <p className="partnerDesc"> {t('see_the_list_of')}</p>
            </div>

            <div className="agencies-swiper">
                <div ref={prevRef} className="swiper-button-prev"/>
                <div ref={nextRef} className="swiper-button-next"/>
                <Swiper
                    breakpoints={{
                        250: {
                            width: 240,
                            slidesPerView: 1,
                            spaceBetween:12,

                        },
                        300: {
                            width: 290,
                            slidesPerView: 1,
                            spaceBetween:12,

                        },
                        350: {
                            width: 320,
                            slidesPerView: 1,
                            spaceBetween:30,

                        },
                        375: {
                            width: 340,
                            slidesPerView: 1,
                            spaceBetween:40,

                        },
                        411: {
                            width: 370,
                            slidesPerView: 1,
                            spaceBetween:40,
                        },
                        465: {
                            width: 420,
                            slidesPerView: 1,
                            spaceBetween:50,

                        },
                        490: {
                            width: 435,
                            slidesPerView: 1,
                            spaceBetween:50,

                        },

                        520: {
                            width: 490,
                            slidesPerView: 1,
                            spaceBetween:40,

                        },
                        715: {
                            width: 510,
                            slidesPerView: 2,
                            spaceBetween:15,
                            navigation:true,
                            centeredSlides:false,
                        },
                        768: {
                            width: 690,
                            slidesPerView:3,
                            spaceBetween:15,

                        },
                        1024: {
                            width: 900,
                            slidesPerView: 3,
                            spaceBetween:30,
                        },
                        1200: {
                            width: 1100,
                            slidesPerView: 3,
                            spaceBetween:30,
                        },
                        1600: {
                            width: 1300,
                            slidesPerView: 5,
                            spaceBetween:33,
                        },
                    }}
                    width={1800}
                    spaceBetween={30}
                    slidesPerView={5}
                    centeredSlides={true}
                    autoplay
                    loop={true}
                    delay={2500}
                    onInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }}
                >
                    {data.length ? data.map((item, i) => {
                          return <SwiperSlide key={i} className={i}>
                                <div className="item">
                                    <Link to={'/agency/' + item.id}>
                                        <div className="single-service single-agencies">
                                            <div className="double-img">
                                                <img src={apiUrl + 'storage/uploads/users/' + item.avatar}
                                                     alt={item.first_name}/>
                                            </div>
                                            <div className={'agenciesName'}>
                                                <h6>{item.translations && item.translations.map((value, i) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : ""
                                                })}</h6>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        }
                    ):""}
                </Swiper>
            </div>
            <div className="row pd-top-180">
                <div className="col-md-12 col-xs-12 col-sm-12" style={{textAlign:'center'}}>
                    <Link className="btn btn-main-color mobile-btn" to="/agencies-list">{t('see_all_estate_agencies')}</Link>
                </div>
            </div>

        </div>
    </div>
}

export default Agencies