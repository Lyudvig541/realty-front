import React, {useEffect, useState} from 'react';
import ImageUploading from "react-images-uploading";
import {useDispatch, useSelector} from "react-redux";
import {bank_request} from "../../actions/request";
import {company} from "../../actions/resources";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {setModal} from "../../reducers/modalsReducer";
import {Link} from "react-router-dom";


const BankRequestPage = (props) => {
    const inlineStyle = {
        backgroundColor: '#E5E5E5',
    }
    const {t} = props;
    const dispatch = useDispatch();

    useEffect(() => {
        async function getData() {
            await dispatch(company(2));
        }

        getData();
    }, [dispatch])
    const company_data = useSelector(state => state.resources.company)||[];
    const [bankRequest, setBankRequest] = useState({
        name: '',
        surname: '',
        property_price: '',
        property_size: '',
        bathrooms: '',
        bedrooms: '',
        comment: '',
        file: '',
        user_id: 1,
        company_id: 3,
    });
    const onChangeFile = (image) => {
        setBankRequest({
                ...bankRequest,
                'file': image,

            }
        )
    }

    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const public_url = process.env.PUBLIC_URL;
    const modal = useSelector(state => state.modals.modal)

    return <div style={inlineStyle}>
        <div className="container pd-top-120">
            <div className="row">
                <div className="col-lg-3 col-md-3">
                    <div className="brokerInfo">
                        <div className="bankImg text-center pd-top-20">
                            <img src={apiUrl + 'storage/uploads/companies/' + company_data.image} alt={'logo'}/>
                        </div>
                        <div className="details text-center pd-bottom-40 pd-top-20">
                            <h4>
                                <Link to='#'>{company_data.name}</Link>
                            </h4>
                            <p><i className="fa fa-map-marker"/> {company_data.address}</p>
                            <span className="phone"><i className="fa fa-phone"/>+374 {company_data.phone}</span>
                            <div className="pd-top-30">
                                <button className="btn bankContact">Contact</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8 col-lg-8">
                    <div className="section-title">
                        <h4>{t('general_description')}</h4>
                    </div>
                    <div className="row pd-top-10">
                        <div className="col-md-6">
                            <div className="rld-single-input ">
                                <label>{t('name')}<span>*</span></label>
                                <input type="text" name="name" placeholder={t('name')}
                                       onChange={(event) => setBankRequest({
                                           ...bankRequest,
                                           [event.target.name]: event.target.value
                                       })}/>
                            </div>
                            <div className="rld-single-input mg-top-30">
                                <label>{t('property_price')}<span>*</span></label>
                                <div className="sq-single-select">
                                    <input type="number" name="property_price" placeholder="$1000/sq"
                                           onChange={(event) => setBankRequest({
                                               ...bankRequest,
                                               [event.target.name]: event.target.value
                                           })}/>
                                </div>
                            </div>
                            <div className="rld-single-input mg-top-30">
                                <label>{t('number_of_bathrooms')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select" name="bathrooms"
                                            onChange={(event) => setBankRequest({
                                                ...bankRequest, [event.target.name]: event.target.value
                                            })}>
                                        <option value={0}/>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                            </div>
                            <div className="rld-single-input mg-top-30">
                                <label>{t('comment')}<span>*</span></label>
                                <textarea style={{width: '100%', minHeight: 140, padding: 10}}
                                          placeholder={t('comment')} name="comment"
                                          onChange={(event) => setBankRequest({
                                              ...bankRequest,
                                              [event.target.name]: event.target.value
                                          })}/>
                            </div>
                        </div>
                        <div className="col-md-6  pd-top-10">
                            <div className="rld-single-input ">
                                <label>{t('surname')}<span>*</span></label>
                                <input type="text" name="surname" placeholder={t('surname')}
                                       onChange={(event) => setBankRequest({
                                           ...bankRequest,
                                           [event.target.name]: event.target.value
                                       })}/>
                            </div>

                            <div className="rld-single-input mg-top-30">
                                <label>{t('property_size')} <span>*</span></label>
                                <input type="number" name="property_size" placeholder="100sq"
                                       onChange={(event) => setBankRequest({
                                           ...bankRequest,
                                           [event.target.name]: event.target.value
                                       })}/>
                            </div>
                            <div className="rld-single-input mg-top-30">
                                <label>{t('number_of_bedrooms')} <span>*</span></label>
                                <div className="sq-single-select">
                                    <select className="select single-select add-property-select" name="bedrooms"
                                            onChange={(event) => setBankRequest({
                                                ...bankRequest,
                                                [event.target.name]: event.target.value
                                            })}>
                                        <option value={0}/>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                            </div>
                            <div className="rld-single-input mg-top-30">
                                <ImageUploading value={bankRequest.file} onChange={onChangeFile} dataURLKey="data_url">
                                    {({imageList, onImageUpload, onImageUpdate, onImageRemove, dragProps}) => (
                                        <div className="upload__image-wrapper">
                                            &nbsp;
                                            <div className="row">
                                                {
                                                    imageList.length !== 0 ?
                                                        <div className="imageArea">
                                                            <img onClick={() => onImageUpdate(0)}
                                                                 src={imageList[0] ? imageList[0].data_url : ''}
                                                                 alt="img" width="100%" height="186px"
                                                                 style={{borderRadius: 5}}/>
                                                            <i onClick={() => onImageRemove(0)} style={{
                                                                position: "absolute",
                                                                right: '1%',
                                                                top: '17%',
                                                                color: '#BE1E2D'
                                                            }}
                                                               className="fa fa-trash" aria-hidden="true">
                                                            </i>
                                                        </div>
                                                        :
                                                        <div className="imageArea"
                                                             onClick={onImageUpload}{...dragProps}>
                                                            <i style={{marginTop: '20%'}} className="fa fa-picture-o"
                                                               aria-hidden="true"/>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    )}
                                </ImageUploading>
                            </div>
                        </div>
                    </div>
                    <div className="text-center pd-top-80 pd-bottom-90">
                        <button className="btn main-button" type="submit" onClick={async () => {
                            dispatch(bank_request(bankRequest))
                        }}>{t('send')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
        <Modal className="request_modal" isOpen={modal === "request"}>
            <ModalHeader toggle={() => dispatch(setModal(""))}/>
            <ModalBody>
                <div className="container">
                    <div className="text-center pd-top-20">
                        <img src={public_url + '/assets/img/icons/tick-mark.png'} alt={'logo'}/>
                    </div>
                    <div className="details text-center pd-bottom-40 pd-top-40">
                        <h4>Thank You For Your Request!</h4>
                        <p>Our customer review officer will contact you as soon as possible!</p>
                    </div>
                </div>
            </ModalBody>
        </Modal>

    </div>
}

export default BankRequestPage