import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {allAgents} from "../../actions/resources";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Autoplay} from 'swiper';
import ReactStars from "react-rating-stars-component";
import {Link, useHistory} from "react-router-dom";


SwiperCore.use([Navigation, Autoplay]);

const Agents = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;

    const dispatch = useDispatch()
    useEffect(() => {
        async function getData() {
            await dispatch(allAgents())
        }
        getData();
    }, [dispatch])
    const {t} = props;
    const prevRef = React.useRef(null);
    const nextRef = React.useRef(null);
    const history = useHistory();
    const publicUrl = process.env.PUBLIC_URL;
    const default_image = publicUrl + "/assets/img/default.png";

    const linkTo = (id) =>{
        history.push(`/agent/${id}`);
    }

    let data = useSelector(state => state.agent.all_agents)
    return <div className="reviewByLocalArea">
        <div className="container pd-top-50 mb-4 homepage-agents-mobile">
            <div className="row">
                <div className="col-md-6 col-lg-6">
                    <br/>
                    <h3 className="see-the-agents">{t('see_the_agents')}</h3>
                    <div className="red-line"/>
                    <br/>
                    <p>{t('see_the_agents_who')}</p>
                </div>
            </div>
            <div className="brokers-swiper pd-top-30">
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
                            spaceBetween:50,

                        },

                        715: {
                            width: 500,
                            slidesPerView: 1,
                            spaceBetween:25,
                            navigation:true,

                        },
                        768: {
                            width: 690,
                            slidesPerView: 1,
                            spaceBetween:15,

                        },
                        1020: {
                            width: 900,
                            slidesPerView: 2,
                            spaceBetween:40,
                        },
                        1200: {
                            width: 1100,
                            slidesPerView: 3,
                            spaceBetween:30,
                        },
                        1600: {
                            width: 1300,
                            slidesPerView: 3,
                            spaceBetween:33,
                        },
                    }}
                    width={1800}
                    spaceBetween={50}
                    slidesPerView={3}
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
                    {data ? data.map((item, i) =>
                        <SwiperSlide key={i} onClick={()=>{linkTo(item.id)}}>
                            <div className="item">
                                <div className="broker-header">
                                    <img className="image broker-swiper-image" src={item.avatar ? apiUrl + 'storage/uploads/users/' + item.avatar : default_image} alt={item.first_name ? item.first_name : ''}/>
                                    <div className='name'>
                                        {item.first_name.length + item.last_name.length < 20 ? item.first_name + " " + item.last_name : item.first_name.slice(0, 1) + ". " + item.last_name}
                                    </div>
                                    <div className='rating'>
                                        <span className="point">{item.rating ? item.rating : ''}</span>
                                        {item.rating ?
                                            <ReactStars
                                                value={item.rating}
                                                count={1}
                                                size={20}
                                                activeColor="#FAA61A"
                                                emptyIcon={<i className="far fa-star"/>}
                                                halfIcon={<i className="fa fa-star-half-alt"/>}
                                                fullIcon={<i className="fa fa-star"/>}
                                                isHalf={true}
                                                edit={false}
                                            />
                                            : ''}
                                    </div>
                                    <div className='address'>{item.city ? item.city.name : ''} {item.state ? item.state.name : ''} </div>
                                </div>
                                <p className="description">
                                    {item.info && item.info.length > 100 ? item.info.slice(0, 100) + "..." : item.info}
                                </p>
                            </div>
                        </SwiperSlide>
                    ):""}
                </Swiper>
            </div>
            <div className="row pd-top-80">
                <div className="col-md-12 col-xs-12 col-sm-12" style={{textAlign:'center'}}>
                    <Link className="btn btn-main-color mobile-btn" to="/agents-list">{t('see_all_agents')}</Link>
                </div>
            </div>
        </div>
    </div>
}

export default Agents
