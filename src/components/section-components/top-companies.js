import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {topCompanies} from "../../actions/resources";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';

SwiperCore.use([Autoplay]);

const TopCompanies = () => {

    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const dispatch = useDispatch()
    useEffect(() => {
        async function getData() {
            await dispatch(topCompanies())
        }
        getData();
    }, [])

    let data = useSelector(state => state.resources.top_companies)

    return <div className="author-area pd-bottom-70">
            <div className="container">
                <div className="section-title">
                <h2 className="title">Top Companies</h2>
            </div>
            <div className="client-swiper">
                <Swiper
                    key={data.length}
                    spaceBetween={30}
                    slidesPerView={4}
                    autoplay
                >
                    {data.map((item, i) =>
                        <SwiperSlide key={i} >
                            <div className="single-author text-center">
                                <div className="thumb">
                                    <img src={apiUrl + 'storage/uploads/company/' + item.image} alt={item.name}/>
                                </div>
                                <div className="author-details">
                                    <h5>{ item.name }</h5>
                                    <a className="view-more" href={ 'company/'+item.id }>View Company</a>
                                </div>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </div>
    </div>
}

export default TopCompanies