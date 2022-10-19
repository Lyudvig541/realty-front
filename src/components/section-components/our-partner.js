import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {partners} from "../../actions/resources";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';

SwiperCore.use([Autoplay]);

const OurPartner = (props) => {

    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const dispatch = useDispatch()
    useEffect(() => {
        async function getData() {
            await dispatch(partners())
        }
        getData();
    }, [dispatch])

    let data = useSelector(state => state.resources.partners)
    const {t} = props;

    return <div className="partner-area ">
        <div className="container">
            <div className="section-title text-center">
                <h3 className="title">{t('our_partners')}</h3>
                <div className="partner-red-line"/>
                <p className="partnerDesc">{t('see_the_list_of_partners')}</p>
            </div>
            <div className="partner-swiper">
                <Swiper
                    breakpoints={{
                        250: {
                            width: 250,
                            slidesPerView: 1,
                            spaceBetween:12,

                        },
                        300: {
                            width: 250,
                            slidesPerView: 1,
                            spaceBetween:12,

                        },
                        350: {
                            width: 330,
                            slidesPerView: 1,
                            spaceBetween:12,

                        },
                        375: {
                            width: 360,
                            slidesPerView: 1,
                            spaceBetween:20,

                        },
                        450: {
                            width: 440,
                            slidesPerView: 2,
                            spaceBetween:80,

                        },
                        715: {
                            width: 500,
                            slidesPerView:3,
                            spaceBetween:15,

                        },
                        768: {
                            width: 690,
                            slidesPerView: 3,
                            spaceBetween:15,

                        },
                        1024: {
                            width: 900,
                            slidesPerView: 4,
                            spaceBetween:30,
                        },
                        1200: {
                            width: 1100,
                            slidesPerView: 4,
                            spaceBetween:15,
                        },
                        1600: {
                            width: 1300,
                            slidesPerView: 4,
                            spaceBetween:30,
                        },
                    }}
                    width={1800}
                    key={data.length}
                    spaceBetween={15}
                    slidesPerView={4}
                    autoplay
                    loop={true}
                    delay={2000}
                >
                    {data.map((item, i) =>
                        <SwiperSlide key={i} >
                            <div key={i} className="item">
                                <div className="thumb text-center">
                                    <img className="greyImg"  src={apiUrl + 'storage/uploads/partners/' + item.image} alt={item.name}/>
                                </div>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </div>
    </div>
}

export default OurPartner