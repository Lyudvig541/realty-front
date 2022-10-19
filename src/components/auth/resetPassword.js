import React, {useState} from 'react';
import {InputGroup, InputGroupAddon, Modal, ModalBody, ModalHeader} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import {setModal} from "../../reducers/modalsReducer";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {resetPassword} from "../../actions/auth";

const ResetPassword = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const modal = useSelector(state => state.modals.modal)
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const errors = useSelector(state => state.auth.errors);
    const [input_type, setInputType] = useState("password")
    const {email} = useParams();
    if(email){
        dispatch(setModal("reset_password"))
    }

    const tooglePassword = () => {
        if (input_type === 'password'){
            setInputType('text')
        }else{
            setInputType('password')
        }
    }

    return <div>
        <Modal className="forgot_modal" isOpen={modal === "reset_password"}>
            <ModalHeader toggle={() => { window.location.href = '/'}}/>
            <ModalBody>
                <div className="container">
                    <div className="row ">
                        <div className="col-12 text-center">
                            <h4>{t('forgot_password')}</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="sq-single-input">
                                <label>{t('email')} <span>*</span></label>
                                <input type="email" name="email" placeholder="example@gmail.com" disabled={true} value={email}/>
                            </div>
                        </div>
                    </div>
                    <div className="row pd-top-15">
                        <div className="col-12">
                            <div className="sq-single-input">
                                <label>{t('password')}<span> *</span><span className={'password_info'}> {t('password_info')}</span></label>
                                <InputGroup>
                                    <input className={`password-input form-control ${errors.password && errors.password[0] ? " is-invalid" : ""}`}
                                        type={input_type} name="password"
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder={t('password')}/>
                                    <InputGroupAddon addonType="append" className="password-input-icon">
                                        <i className={input_type === "password" ? "fa fa-eye-slash" : "fa fa-eye"} onClick={() => tooglePassword()}></i>
                                    </InputGroupAddon>
                                </InputGroup>
                                <label className="error-message"><span>{errors.password && errors.password[0] !== "confirm_password_error" && t(errors.password[0])}</span></label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="sq-single-input">
                                <label>{t('confirm_password')} <span>*</span></label>
                                <InputGroup>
                                    <input type={input_type} name="password_confirmation"
                                           className={`password-input form-control ${errors.confirm_password && errors.confirm_password[0] ? " is-invalid" : ""}`}
                                           value={repeatPassword}
                                           onChange={(event) => setRepeatPassword(event.target.value)}
                                           placeholder={t('confirm_password')}/>
                                    <InputGroupAddon addonType="append" className="password-input-icon">
                                        <i className={input_type === "password" ? "fa fa-eye-slash" : "fa fa-eye"} onClick={() => tooglePassword()}></i>
                                    </InputGroupAddon>
                                </InputGroup>
                                <label className="error-message"><span>{errors.password && errors.password.indexOf("confirm_password_error") > -1 && t(errors.password[errors.password.indexOf("confirm_password_error")])}</span></label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                            <div className="col-12 text-center">
                                <button type="submit" className="btn main-lg-button"
                                        onClick={() => dispatch(resetPassword(email,password,repeatPassword))}>{t('reset_password')}
                                </button>
                            </div>
                        </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}

export default ResetPassword

