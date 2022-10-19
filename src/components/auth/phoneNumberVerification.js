import React, {useState} from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {verification_code, verify} from "../../actions/verificationCode";
import {logout} from "../../reducers/authReducer";
import {setModal} from "../../reducers/modalsReducer";
import NumberFormat from "react-number-format";

const PhoneNumberVerification = () => {
    const {t} = useTranslation();
    const [phone, setPhone] = useState("")
    const code_success = useSelector(state => state.verification.code_success)
    const verifyed = useSelector(state => state.verification.verify)
    const [code, setCode] = useState("")
    const dispatch = useDispatch();
    const modal = useSelector(state => state.modals.modal)
    const currentUser = useSelector(state => state.auth.currentUser)
    const errors = useSelector(state => state.verification.errors);

    const verification = (e) => {
        e.preventDefault()
       dispatch(verification_code(currentUser.id, phone));
    }

    const hendleSubmit = (e) => {
        e.preventDefault()
        dispatch(verify(currentUser.id, code, phone));
    }

    const hendleClose = () => {
        if (!verifyed){
            dispatch(logout())
        }
        dispatch(setModal(""))
    }

    return <div>
        <Modal className="phone_number_verification" isOpen={modal === "phone_number_verification"}>
            <ModalHeader toggle={() => hendleClose()}/>
            <ModalBody>
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h4>{t('phone_number_verification')}</h4>
                        </div>
                    </div>
                    <div className="container">
                        {!verifyed ? <div className="verified">
                            {!code_success && <>
                                <div className="row pd-top-15 mt-3">
                                    <div className="col-12">
                                        <div className="sq-single-input">
                                            <label>{t('phone')} <span>*</span></label>
                                            <div className="input-group mb-3">
                                                <NumberFormat
                                                    name="phone"
                                                    value={phone}
                                                    format="+374 (##) ##-##-##"
                                                    mask="_"
                                                    className={`form-control ${errors.phone && errors.phone[0] ? " is-invalid" : ""}`}
                                                    allowEmptyFormatting={true}
                                                    onValueChange={(values) => {
                                                        const { formattedValue } = values;
                                                        setPhone(formattedValue)
                                                    }}
                                                />
                                            </div>
                                            <label className="error-message"><span>{errors.phone && t(errors.phone[0])}</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center mb-4 mt-2">
                                        <button type="submit" className="btn main-lg-button" onClick={e => verification(e)}>
                                            {t('get_code')}
                                        </button>
                                    </div>
                                </div>
                            </>}
                            {code_success && <div>
                                <div className="row pd-top-15">
                                    <div className="col-12">
                                        <div className="sq-single-input">
                                            <label>{t('code')}<span>*</span></label>
                                            <input className={`form-control ${errors.code && errors.code[0] ? " is-invalid" : ""}`}
                                                   type="text" name="code" value={code}
                                                   onChange={(event) => setCode(event.target.value)}
                                                   placeholder={t('code')}/>
                                            <label className="error-message"><span>{errors.code && t(errors.code[0])}</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <button type="submit" className="btn main-lg-button" disabled={!code_success} onClick={ e => { hendleSubmit(e)}}>
                                            {t('verify')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>: <div className="col-12 text-center"><p>{t('verified_text')}</p></div>}
                </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}

export default PhoneNumberVerification

