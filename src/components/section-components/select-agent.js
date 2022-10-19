import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ReactStars from "react-rating-stars-component";
import {Modal, ModalBody, ModalHeader, Button} from "reactstrap";
import {get_announcement, sendRequestToAgent} from '../../actions/announcement';
import {setAnnouncementModal, setCheckAgentModal} from "../../reducers/modalsReducer";
import {useHistory} from "react-router-dom";
import {get_search_agent} from "../../actions/request";
import Pagination from "./pagination";
import {setSelectedAgent} from "../../reducers/agentReducer";

const CheckAgent = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const {t} = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const selectedItem = useSelector(state => state.agent.selected_agent);
    const [agentId,setAgentId] = useState();
    const queryParams = new URLSearchParams(window.location.search);
    const announcementId = queryParams.get('id');
    useEffect(() => {
        async function getData() {
            dispatch(get_search_agent(1))
            dispatch(get_announcement(announcementId))
        }
        getData();
    }, [dispatch,announcementId])

   const onItemSelected = (index) => {
        if (selectedItem === index){
            dispatch(setSelectedAgent(null))
        }else{
            dispatch(setSelectedAgent(index))
            dispatch(setCheckAgentModal('check_agent'))
        }
   }
    const new_data = useSelector(state => state.agent.new_data)
    const search_params = useSelector(state => state.agent.search_params)
    const getPage = async (page) => {
        await dispatch(get_search_agent(page,search_params,new_data))
    }
    let data = useSelector(state => state.agent.agents.data)
    let data2 = useSelector(state => state.agent.agents)
    const modal = useSelector(state => state.modals.modal)
    const sendRequestAgent = ()=>{
        dispatch(sendRequestToAgent(agentId,announcementId));
    }
    return <div className="user-list-area pd-top-100 pd-bottom-70">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-md-12 text-center">
                    <h5>
                        Check Agent !
                    </h5>
                </div>
                <div className="col-lg-12 col-md-12 mb-5 pb-5">
                    <Button className="mr-2" onClick={()=>  history.push(`/`)} color="secondary">{t('cancel')}</Button>
                    <Button onClick={()=>{sendRequestAgent()}} className="btn-main-color">{t('select_auto')}</Button>
                </div>
            </div>
            <div className="row">
                {data ? data.map((item, i) =>
                    <div key={i} className="col-lg-3 col-md-6">
                        <div className={selectedItem === item.id ? "single-user-list single-feature single-broker-feature selected_card" : "single-user-list single-feature single-broker-feature"} onClick={() => {
                                onItemSelected(item.id)
                                setAgentId(item.id);
                            }}>
                            <div className="brokerImg">
                                <img src={apiUrl + 'storage/uploads/users/' + item.avatar} alt={item.name}/>
                            </div>
                            <div className="details">
                                {
                                    item.agency ? <a href={'/agent/' + item.id} className="feature-logo">
                                        <img src={apiUrl + 'storage/uploads/agencies/' + item.agency.image}
                                             alt={item.agency.name}/>
                                    </a> : ''
                                }
                                <h4>
                                    <a href={'/agent/' + item.id}>{item.first_name} {item.last_name}</a>
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
                                    <i className="fa fa-map-marker"/> {item.country ? item.country.name : ""} {item.state ? item.state.name : ""} {item.city ? item.city.name : ""}
                                </p>
                                <span className="phone"><i
                                    className="fa fa-phone"/>{item.phone}</span>
                            </div>
                            {selectedItem === item.id &&
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

        <Modal className="request_modal" isOpen={modal === "announcement"}>
            <ModalHeader toggle={() => {
                dispatch(setAnnouncementModal(""))
                history.push(`/`);

            }}/>
            <ModalBody>
                <div className="container">
                    <div className="text-center pd-top-20">
                        <img src={publicUrl + '/assets/img/icons/tick-mark.png'} alt={'logo'}/>
                    </div>
                    <div className="details text-center pd-bottom-40 pd-top-40">
                        <h4>Thank You</h4>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}

export default CheckAgent

