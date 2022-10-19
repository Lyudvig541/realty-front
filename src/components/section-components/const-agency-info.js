import React, {useEffect} from 'react';
import {useDispatch, useSelector,} from "react-redux";
import {useParams} from "react-router-dom";
import {const_agency} from "../../actions/resources";
const publicUrl = process.env.PUBLIC_URL;
const default_image = publicUrl + "/assets/img/default.png";

const ConstAgencyInfo = (props) => {

    const inlineStyle = {
        backgroundColor: '#FBFBFB',
    }

    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    let {id} = useParams();

    const dispatch = useDispatch()
    useEffect(() => {
        async function getData() {
            await dispatch(const_agency(id))
        }
        getData();
    }, [dispatch, id])

    let data = useSelector(state => state.resources.const_agency);
    const {t} = props;

    return (
        <div style={inlineStyle}>
            <div className="container pd-top-100">
                <div className="row">
                    <div className="col-lg-3 col-md-3">
                        <div className="single-user-list single-feature">
                            <div className="brokerImg">
                                <img src={data && data.image ? apiUrl + 'storage/uploads/constructor_agencies/' + data.image : default_image} alt={data ? data.name : ''}/>
                            </div>
                            <div className="details ">
                                <h4>
                                    <a href={'#name'}>{data ? data.name : ''} </a>
                                </h4>
                                <p>
                                    <i className="fa fa-map-marker"/>
                                    {data && data.country ? data.country.name : ""} {data && data.state ? data.state.name : ""} {data && data.city ? data.city.name : ""}
                                </p>
                                <span className="phone"><i className="fa fa-phone"/>{data && data.phone ? data.phone : ''}</span>
                            </div>
                        </div>
                        <div className="container brokerInfo pd-top-30">
                            <div className="row">
                                <div className="col-lg-5 col-md-5">
                                    <p>{t('address')}:</p>
                                </div>
                                <div className="col-lg-7 col-md-7">
                                    <p>{data && data.state ? data.state.name : ""} {data && data.city ? data.country.city : ""} </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-5 col-md-5">
                                    <p>{t('cell_phone')}:</p>
                                </div>
                                <div className="col-lg-7 col-md-7">
                                    <p>{data && data.phone ? data.phone : ''}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-5 col-md-5">
                                    <p>{t('member_since')}:</p>
                                </div>
                                <div className="col-lg-7 col-md-7">
                                    <p> {data && data.created_at ? data.created_at.slice(0, 10) : ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-9">
                        <div className="container brokerTab pd-top-30 ">
                            <div className="container">
                                <ul className="nav">
                                    <li className="nav-item">
                                        <button className="nav-link active" data-toggle="tab" href="#about">
                                            <div className="border-bottom-line">{t('about')}</div>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" data-toggle="tab" href="#reviews">
                                            <div className="border-bottom-line">{t('reviews')}</div>
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content pd-top-20">
                                    <div className="tab-pane show active" id="about">
                                        <div className="container">
                                            <p>{data.translations && data.translations.map((value, i) => {
                                                return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.description : ""
                                            })}</p>
                                        </div>
                                    </div>
                                    <div className="tab-pane show" id="reviews">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ConstAgencyInfo;