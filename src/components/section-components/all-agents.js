import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ReactStars from "react-rating-stars-component";
import Pagination from "./pagination";
import {get_search_agent} from "../../actions/request";
import {setSpinner} from "../../reducers/modalsReducer";
import {css} from "@emotion/react";
import {PulseLoader} from "react-spinners";

const AllAgents = (props) => {

    const {t} = props;
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const isAuth = useSelector(state => state.auth.isAuth)
    const publicUrl = process.env.PUBLIC_URL;
    const default_image = publicUrl + "/assets/img/default.png";
    const spinner = useSelector(state => state.modals.spinner);
    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;`;

    const dispatch = useDispatch()
    useEffect(() => {
        async function getData() {
            dispatch(setSpinner(true))
            await dispatch(get_search_agent(1))
        }
        getData();
    }, [dispatch])
    const new_data = useSelector(state => state.agent.new_data)
    const search_params = useSelector(state => state.agent.search_params)
    const getPage = async (page) => {
        await dispatch(get_search_agent(page, search_params, new_data))
    }
    let data = useSelector(state => state.agent.agents.data)
    let data2 = useSelector(state => state.agent.agents)
    console.log(data)
    return <div className="user-list-area pd-top-100 pd-bottom-70">
        {spinner ?
            <div className="spinner_content">
                <div className="sweet-loading">
                    <PulseLoader color={"#BE1E2D"} css={override} loading={true} size={16}/>
                </div>
            </div>
            :
            <div className="container">
                <div className="row">
                    <h5 className="pd-for-title">
                        {t('broker_page_title')}
                    </h5>
                </div>
                <div className="red-line"/>
                <div className="row pd-top-20">
                    {data ? data.map((item, i) =>
                        <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 col-xl-3">
                            <div className="single-user-list single-feature">
                                <div className="brokerImg">
                                    <img
                                        src={item.avatar ? apiUrl + 'storage/uploads/users/' + item.avatar : default_image}
                                        alt={item.first_name ? item.first_name : ''}/>
                                </div>
                                <div className="details">
                                    {
                                        item.super_broker ? <a href={'agency/' + item.super_broker.id} className="feature-logo">
                                            <img src={apiUrl + 'storage/uploads/users/' + item.super_broker.avatar}
                                                 alt={"..."}/>
                                        </a> : ''
                                    }
                                    <br/>
                                    <h4>
                                        <a href={'agent/' + item.id}>{item.first_name}<br/> {item.last_name}</a>
                                    </h4>
                                    <div className='row broker-rating'>
                                        <ReactStars
                                            value={item.rating ? item.rating : 0}
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
                                    <p><i
                                        className="fa fa-map-marker"/>&nbsp; {item.state ? item.state.name : ""}, {item.city ? item.city.name : ""}
                                    </p>
                                    {isAuth &&
                                    <span className="phone">
                                        <i className="fa fa-phone"/>
                                        {item.phone}
                                    </span>
                                    }
                                </div>
                            </div>
                        </div>
                    ) : ""}
                </div>
                {data2.last_page && data2.last_page > 1 ?
                    <Pagination data2={data2} getPage={getPage}/>
                    : ""}
            </div>
        }
    </div>
}

export default AllAgents