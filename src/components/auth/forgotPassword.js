import React, {useState} from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import {setModal} from "../../reducers/modalsReducer";
import {useTranslation} from "react-i18next";
import {forgotPassword} from "../../actions/auth";

const ForgotPassword = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const modal = useSelector(state => state.modals.modal)
    const [email, setEmail] = useState("")
    const errors = useSelector(state => state.auth.loginErrors);
    console.log(errors)

    return <div>
        <Modal className="forgot_modal" isOpen={modal === "forgot_password"}>
            <ModalHeader toggle={()=> dispatch(setModal(""))}>
                <div onClick={()=> dispatch(setModal("login"))} className="back_button">
                    <span> <i className="fa fa-angle-left">  {t('back')} </i></span>
                </div>
            </ModalHeader>
            <ModalBody>
                <div className="container">
                    <div className="row ">
                        <div className="col-12 text-center">
                            <h4>{t('forgot_password')}</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="offset-1"/>
                        <div className="col-10">
                            <div className="sq-single-input">
                                <label>{t('email')} <span>*</span></label>
                                <input type="email" name="email" placeholder="example@gmail.com"
                                       className={`form-control ${errors.email_valid ? " is-invalid" : ""}`}
                                       onChange={(event) => setEmail(event.target.value)}/>
                                <label className="error-message"><span>{errors.email_valid && t(errors.email_valid)}</span></label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="modal-button">
                            <button className="btn main-button" onClick={() => dispatch(forgotPassword(email))}>{t('send_link')}</button>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}

export default ForgotPassword

