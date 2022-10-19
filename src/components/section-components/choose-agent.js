import React, {useEffect} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch, useSelector} from "react-redux";
import ReactStars from "react-rating-stars-component";
import Pagination from "./pagination";
import {get_agents, get_super_agents} from "../../actions/agent";
import {useHistory, useParams} from "react-router-dom";


const ChooseAgent = (props) => {
    const publicUrl = process.env.PUBLIC_URL;
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const default_broker_image = publicUrl + "/assets/img/broker.jpg";
    const default_agency_image = publicUrl + "/assets/img/brokers_company.jpg";
    const {t} = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const agents = useSelector(state => state.agent.agents.data)
    const agents2 = useSelector(state => state.agent.agents)
    const superAgents = useSelector(state => state.agent.superAgents.data)
    const superAgents2 = useSelector(state => state.agent.superAgents)
    const {category, type} = useParams();
    const getAgentPage = (page) => {
        dispatch(get_agents(page))
    }
    const getSuperAgentPage = (page) => {
        dispatch(get_super_agents(page))
    }
    useEffect(() => {
        dispatch(get_agents(1))
        dispatch(get_super_agents(1))
    }, [dispatch]);
    const chooseBroker = (id) => {
        history.push(`/add-property/${category}/${type}/${id}`);
    }
    return <div className="add-new-property-area " style={{backgroundColor: '#FBFBFB'}}>
        <div className="container pd-top-90">
            <div className="row justify-content-center">
                <div className="col-xl-12 col-lg-12 col-md-12 mg-top-30">
                    <div className="row">
                        <div className="col-xl-5 col-lg-5 col-md-5 col-sm-6">
                            <h4>
                                {t('choose_a_company')}
                            </h4>
                        </div>
                    </div>
                    <div className="user-list-area mg-top-20">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3 col-md-4 col-xl-3 col-sm-6 col-6">
                                    <div className={"single-user-list single-feature single-broker-feature auto-company"} onClick={() => chooseBroker("agency")}>
                                        <div className="brokerImg">
                                            <img src={default_agency_image} alt={'...'}/>
                                        </div>
                                        <div className="details">
                                            <h6>
                                                {t('choose_auto')}
                                            </h6>
                                            <div className='row broker-rating'>
                                                <ReactStars
                                                    value={5}
                                                    count={5}
                                                    size={18}
                                                    activeColor="#FAA61A"
                                                    emptyIcon={<i className="far fa-star"/>}
                                                    halfIcon={<i className="fa fa-star-half-alt"/>}
                                                    fullIcon={<i className="fa fa-star"/>}
                                                    isHalf={true}
                                                    edit={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {superAgents ? superAgents.map((item, i) =>
                                    <div key={i} className="col-lg-3 col-md-4 col-xl-3 col-sm-6 col-6">
                                        <div className={"single-user-list single-feature single-broker-feature"} onClick={() => chooseBroker(item.id)}>
                                            <div className="brokerImg">
                                                <img src={item.avatar ? apiUrl + 'storage/uploads/users/' + item.avatar : default_agency_image} alt={item.first_name ? item.first_name : ''}/>
                                            </div>
                                            <div className="details">
                                                <h6>
                                                    {item.first_name}
                                                </h6>
                                                <div className='row broker-rating'>
                                                    <ReactStars
                                                        value={item.rating}
                                                        count={5}
                                                        size={18}
                                                        activeColor="#FAA61A"
                                                        emptyIcon={<i className="far fa-star"/>}
                                                        halfIcon={<i className="fa fa-star-half-alt"/>}
                                                        fullIcon={<i className="fa fa-star"/>}
                                                        isHalf={true}
                                                        edit={false}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : ""}
                            </div>
                            {superAgents2.last_page && superAgents2.last_page > 1 ?
                                <Pagination data2={superAgents2} getPage={getSuperAgentPage}/>
                                : ""}
                        </div>
                    </div>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 mg-top-30">
                    <div className="row">
                        <div className="col-xl-5 col-lg-5 col-md-5 col-sm-6">
                            <h4>
                                {t('choose_an_agent')}
                            </h4>
                        </div>
                    </div>
                    <div className="user-list-area mg-top-20">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3 col-md-4 col-xl-3 col-sm-6 col-6">
                                    <div className={"single-user-list single-feature single-broker-feature"} onClick={() => chooseBroker("broker")}>
                                        <div className="brokerImg">
                                            <img src={default_broker_image} alt={'...'}/>
                                        </div>
                                        <div className="details">
                                            <h6>
                                                {t('auto_choose_broker')} {t('choose_auto_broker')}
                                            </h6>
                                            <div className='row broker-rating'>
                                                <ReactStars
                                                    value={5}
                                                    count={5}
                                                    size={18}
                                                    activeColor="#FAA61A"
                                                    emptyIcon={<i className="far fa-star"/>}
                                                    halfIcon={<i className="fa fa-star-half-alt"/>}
                                                    fullIcon={<i className="fa fa-star"/>}
                                                    isHalf={true}
                                                    edit={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {agents ? agents.map((item, i) =>
                                    <div key={i} className="col-lg-3 col-md-4 col-xl-3 col-sm-6 col-6">
                                        <div className={"single-user-list single-feature single-broker-feature"} onClick={() => chooseBroker(item.id)}>
                                            <div className="brokerImg">
                                                <img src={item.avatar ? apiUrl + 'storage/uploads/users/' + item.avatar : default_broker_image} alt={item.first_name ? item.first_name : ''}/>
                                            </div>
                                            <div className="details">
                                                {
                                                    item.agency ?
                                                        <a href="#feature-logo" className="feature-logo">
                                                            <img src={item.agency.image ? apiUrl + 'storage/uploads/agencies/' + item.agency.image : default_agency_image} alt={item.agency.name ? item.agency.name : ''}/>
                                                        </a>
                                                        : ''
                                                }
                                                <h6>
                                                    {item.first_name}
                                                </h6>
                                                <h6>
                                                    {item.last_name}
                                                </h6>
                                                <div className='row broker-rating'>
                                                    <ReactStars
                                                        value={item.rating}
                                                        count={5}
                                                        size={18}
                                                        activeColor="#FAA61A"
                                                        emptyIcon={<i className="far fa-star"/>}
                                                        halfIcon={<i className="fa fa-star-half-alt"/>}
                                                        fullIcon={<i className="fa fa-star"/>}
                                                        isHalf={true}
                                                        edit={false}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : ""}
                            </div>
                            {agents2.last_page && agents2.last_page > 1 ?
                                <Pagination data2={agents2} getPage={getAgentPage}/>
                                : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default ChooseAgent

