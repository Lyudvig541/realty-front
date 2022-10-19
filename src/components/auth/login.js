import React, {useState} from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {Alert, InputGroup, InputGroupAddon, Modal, ModalBody, ModalHeader} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import {broker_register, login, register, socialLogin} from "../../actions/auth";
import {setModal} from "../../reducers/modalsReducer";
import {useTranslation} from "react-i18next";
import {logout, request} from "../../reducers/authReducer";
import NumberFormat from "react-number-format";

const Login = () => {
    const {t} = useTranslation();
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
    const fbClientId = process.env.REACT_APP_FB_CLIENT_ID
    const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET
    const publicUrl = process.env.PUBLIC_URL;
    const [email, setEmail] = useState("")
    const [emailRegister, setEmailRegister] = useState("")
    const [emailBroker, setEmailBroker] = useState("")
    const [phone, setPhone] = useState("")
    const verifyed = useSelector(state => state.verification.verify)
    const [password, setPassword] = useState("")
    const [passwordRegister, setPasswordRegister] = useState("")
    const [firstNameBroker, setFirstNameBroker] = useState("")
    const [firstNameRegister, setFirstNameRegister] = useState("")
    const [lastNameBroker, setLastNameBroker] = useState("")
    const [lastNameRegister, setLastNameRegister] = useState("")
    const [input_type, setInputType] = useState("password")
    const [tab, setTab] = useState("signin")
    const [repeatPassword, setRepeatPassword] = useState("")
    const dispatch = useDispatch();
    const modal = useSelector(state => state.modals.modal)
    const currentUser = useSelector(state => state.auth.currentUser)
    const registerErrors = useSelector(state => state.auth.registerErrors);
    const errors = useSelector(state => state.auth.loginErrors);
    const brokerErrors = useSelector(state => state.auth.brokerRegisterErrors);
    const request_status = useSelector(state => state.auth.request_status);
    if(verifyed){
        setTimeout(() => {
            dispatch(setModal(""))
        }, 2000);
    }

    if(request_status){
        setTimeout(() => {
            dispatch(setModal(""))
            dispatch(request(false))
            window.location.reload(true);
        }, 2000);
    }

    const hendleClose = () => {
        if (!verifyed){
            dispatch(logout())
        }
        dispatch(setModal(""))
        setEmail('')
        setFirstNameRegister('')
        setLastNameRegister('')
        setPasswordRegister('')
        setRepeatPassword('')
        setPassword('')
        setEmailBroker('')
        setFirstNameBroker('')
        setLastNameBroker('')
        setPhone('')
    }
    const responseFacebook = (response) => {
        const data = {
            token: response.accessToken,
            first_name: response.name.split(' ')[0],
            last_name: response.name.split(' ')[1],
            email: response.email,
            url: response.picture.data.url,
            social_type: 'facebook'
        };
        dispatch(socialLogin(data));
    }
    const requestMail = async () => {

    }
    const responseErrorGoogle = (response) => {
        console.log(response);
    }
    const responseGoogle = (response) => {
        const data = {
            email: response.profileObj.email,
            first_name: response.profileObj.givenName,
            last_name: response.profileObj.familyName,
            url: response.profileObj.imageUrl,
            token: response.accessToken,
            social_type: 'google'
        }
        dispatch(socialLogin(data));
    }
    const onlyLettersFirstName = (e) => {
        const re = /[0-9!@#$%^&*()_+="'/\\;,:><?.{}~`|\[\]\b]+$/;
        if (e.target.value === '' || !(re.test(e.target.value))) {
            setFirstNameRegister(e.target.value)
        }
    }
    const onlyLettersLastName = (e) => {
        const re = /[0-9!@#$%^&*()_+="'/\\;,:><?.{}~`|\[\]\b]+$/;
        if (e.target.value === '' || !(re.test(e.target.value))) {
            setLastNameRegister(e.target.value)
        }
    }

    const tooglePassword = () => {
        if (input_type === 'password'){
            setInputType('text')
        }else{
            setInputType('password')
        }
    }


    return <div>
        <Modal className="login_modal" isOpen={modal === "login"}>
            <ModalHeader toggle={() => hendleClose()}/>
            <ModalBody>
                <div className="container">
                    <div className="row ">
                        <div className="modal-header-text">
                            <h3>{t('welcome')}</h3>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-xl-12 col-sm-12" >
                            <ul className="nav nav-tabs justify-content-center auth_modal_tabs">
                                <li className="nav-item">
                                    <span className={tab === "signin" ? "nav-link active" : "nav-link"} onClick={() => setTab("signin")}>{t('sign_in')}</span>
                                </li>
                                <li className="nav-item ">
                                    <span className={tab === "signup" ? "nav-link active" : "nav-link"} onClick={() => setTab("signup")}>{t('sign_up')}</span>
                                </li>
                                <li className="nav-item ">
                                    <span className={tab === "for_broker" ? "nav-link active" : "nav-link"} onClick={() => setTab("for_broker")}>{t('broker')}</span>
                                </li>
                            </ul>
                            </div>
                        </div>
                        <div className="tab-content pd-top-20">
                            <div className={tab === "signin" ? "tab-pane fade show active p-2 pb-3" : "tab-pane fade p-2 pb-3"} id="signin">
                                <div className="row">
                                    <div className="col-12">
                                        <label className="error-message">{errors.email_or_password && t(errors.email_or_password)}</label>
                                        <div className="sq-single-input">
                                            <label>{t('email')} <span>*</span></label>
                                            <input className={`form-control ${errors.email && errors.email[0] ? " is-invalid" : ""}`}
                                                   type="text" name="email" value={email}
                                                   onChange={(event) => setEmail(event.target.value)}
                                                   placeholder="example@email.com"/>
                                            <label className="error-message"><span>{errors.email && t(errors.email[0])}</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row pd-top-15">
                                    <div className="col-12">
                                        <div className="sq-single-input">
                                            <label>{t('password')}<span>*</span></label>
                                            <InputGroup>
                                                <input className={`password-input form-control ${errors.password && errors.password[0] ? " is-invalid" : ""}`}
                                                       type={input_type} name="password" value={password}
                                                       onChange={(event) => setPassword(event.target.value)}
                                                       placeholder={t('password')}/>
                                                <InputGroupAddon addonType="append" className="password-input-icon">
                                                    <i className={input_type === "password" ? "fa fa-eye-slash" : "fa fa-eye"} onClick={() => tooglePassword()}/>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <label className="error-message"><span>{errors.password && t(errors.password[0])}</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <p className="forgot-pass" onClick={() => dispatch(setModal("forgot_password"))}>
                                        <ins>{t('forgot_password')}</ins>
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="modal-button">
                                        <button type="submit" className="btn main-button"
                                                onClick={() => dispatch(login(email, password))}>
                                            {t('sign_in')}
                                        </button>
                                    </div>
                                </div>
                                <div className="row mg-top-30">
                                    <div className="col-4 text-center">
                                        <div className={"google-button"}>
                                            <GoogleLogin
                                                clientId={clientId}
                                                clientSecret={clientSecret}
                                                onSuccess={responseGoogle}
                                                onFailure={responseErrorGoogle}
                                            >
                                                <i className="fa fa-info"/>
                                            </GoogleLogin>
                                        </div>
                                    </div>
                                    <div className="col-4 text-center">
                                        <FacebookLogin
                                            appId={fbClientId}
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            callback={responseFacebook}
                                            cssClass="my-facebook-button-class"
                                            icon="fa-facebook fa-lg"
                                            textButton={null}
                                            size={"medium"}
                                            style={{
                                                borderRadius:"50%"
                                            }}
                                        />
                                    </div>
                                    <div className="col-4 text-center">
                                        <div className={"mail-button"}>
                                            <img onClick={()=>{requestMail()}} src={publicUrl + '/assets/img/icons/mail_ru_logo_icon.png'} alt="..."/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={tab === "signup" ? "tab-pane fade show active p-2 pb-3" : "tab-pane fade p-2 pb-3"} id="signup">
                                {currentUser && Object.keys(currentUser).length ? <div className="container">
                                    </div> :
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <div className="sq-single-input">
                                                    <label>{t('first_name')} <span>*</span></label>
                                                    <input className={`form-control ${registerErrors.firstName && registerErrors.firstName[0] ? " is-invalid" : ""}`}
                                                           type="text" name="firstName" value={firstNameRegister}
                                                           onChange={onlyLettersFirstName}
                                                           placeholder={t('first_name')}/>
                                                    <label className="error-message"><span>{registerErrors.firstName && t(registerErrors.firstName[0])}</span></label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6  col-md-12 col-sm-12">
                                                <div className="sq-single-input">
                                                    <label>{t('last_name')} <span>*</span></label>
                                                    <input className={`form-control ${registerErrors.lastName && registerErrors.lastName[0] ? " is-invalid" : ""}`}
                                                           type="text" name="lastName" value={lastNameRegister}
                                                           onChange={onlyLettersLastName}
                                                           placeholder={t('last_name')}/>
                                                    <label className="error-message"><span>{registerErrors.lastName && t(registerErrors.lastName[0])}</span></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row pd-top-15">
                                            <div className="col-12">
                                                <div className="sq-single-input">
                                                    <label>{t('email')} <span>*</span></label>
                                                    <input className={`form-control ${registerErrors.email && registerErrors.email[0] ? " is-invalid" : ""}`}
                                                           type="text" name="email"
                                                           onChange={(event) => setEmailRegister(event.target.value)}
                                                           placeholder="example@gmail.com"/>
                                                    <label className="error-message"><span>{registerErrors.email && t(registerErrors.email[0])}</span></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row pd-top-15">
                                            <div className="col-12">
                                                <div className="sq-single-input">
                                                    <label>{t('password')}<span> *</span><span className={'password_info'}> {t('password_info')}</span></label>
                                                    <InputGroup>
                                                        <input className={`password-input form-control ${registerErrors.password && registerErrors.password[0] ? " is-invalid" : ""}`}
                                                               type={input_type} name="password"
                                                               onChange={(event) => setPasswordRegister(event.target.value)}
                                                               placeholder={t('password')}/>
                                                        <InputGroupAddon addonType="append" className="password-input-icon">
                                                            <i className={input_type === "password" ? "fa fa-eye-slash" : "fa fa-eye"} onClick={() => tooglePassword()}/>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    <label className="error-message"><span>{registerErrors.password && registerErrors.password[0]!=="confirm_password_error" && t(registerErrors.password[0])}</span></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row pd-top-15">
                                            <div className="col-12">
                                                <div className="sq-single-input">
                                                    <label>{t('confirm_password')} <span>*</span></label>
                                                    <InputGroup>
                                                        <input type={input_type} name="password_confirmation"
                                                               className={`password-input form-control ${registerErrors.confirm_password && registerErrors.confirm_password[0] ? " is-invalid" : ""}`}
                                                               value={repeatPassword}
                                                               onChange={(event) => setRepeatPassword(event.target.value)}
                                                               placeholder={t('confirm_password')}/>
                                                        <InputGroupAddon addonType="append" className="password-input-icon">
                                                            <i className={input_type === "password" ? "fa fa-eye-slash" : "fa fa-eye"} onClick={() => tooglePassword()}/>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    <label className="error-message">
                                                        <span>{registerErrors.password_confirmation && t(registerErrors.password_confirmation[0])}</span>
                                                        <span>{registerErrors.password && registerErrors.password[0] ==="confirm_password_error" && !registerErrors.password_confirmation && t(registerErrors.password[0])}</span>
                                                        <span>{registerErrors.password && registerErrors.password[1] ==="confirm_password_error" && !registerErrors.password_confirmation && t(registerErrors.password[1])}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 text-center" style={{padding:0}}>
                                                <button className="btn register-main-button" type="submit"
                                                        onClick={() => dispatch(register(firstNameRegister, lastNameRegister, emailRegister, passwordRegister, repeatPassword))}>
                                                    {t('continue_registration')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={tab === "for_broker" ? "tab-pane fade show active p-2 pb-3" : "tab-pane fade p-2 pb-3"} id="for_broker">
                               <div className="container">
                                   {!request_status ? <div className="request">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <div className="sq-single-input">
                                                    <label>{t('first_name')} <span>*</span></label>
                                                    <input className={`form-control ${brokerErrors.firstName && brokerErrors.firstName[0] ? " is-invalid" : ""}`}
                                                           type="text" name="firstName" value={firstNameBroker}
                                                           onChange={(event) => setFirstNameBroker(event.target.value)}
                                                           placeholder={t('first_name')}/>
                                                    <label className="error-message"><span>{brokerErrors.firstName && t(brokerErrors.firstName[0])}</span></label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6  col-md-12 col-sm-12">
                                                <div className="sq-single-input">
                                                    <label>{t('last_name')} <span>*</span></label>
                                                    <input className={`form-control ${brokerErrors.lastName && brokerErrors.lastName[0] ? " is-invalid" : ""}`}
                                                           type="text" name="lastName" value={lastNameBroker}
                                                           onChange={(event) => setLastNameBroker(event.target.value)}
                                                           placeholder={t('last_name')}/>
                                                    <label className="error-message"><span>{brokerErrors.lastName && t(brokerErrors.lastName[0])}</span></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row pd-top-15">
                                            <div className="col-12">
                                                <div className="sq-single-input">
                                                    <label>{t('email')} <span>*</span></label>
                                                    <input className={`form-control ${brokerErrors.email && brokerErrors.email[0] ? " is-invalid" : ""}`}
                                                           type="text" name="email"
                                                           onChange={(event) => setEmailBroker(event.target.value)}
                                                           placeholder="example@gmail.com"/>
                                                    <label className="error-message"><span>{brokerErrors.email && t(brokerErrors.email[0])}</span></label>
                                                </div>
                                            </div>
                                        </div>
                                       <div className="row pd-top-15">
                                           <div className="col-12">
                                               <div className="sq-single-input">
                                                   <label>{t('phone')} <span>*</span></label>
                                                   <div className="input-group mb-3">
                                                       <NumberFormat
                                                           name="phone"
                                                           value={phone}
                                                           format="+374 (##) ##-##-##"
                                                           mask="_"
                                                           className={`form-control ${brokerErrors.phone && brokerErrors.phone[0] ? " is-invalid" : ""}`}
                                                           allowEmptyFormatting={true}
                                                           onValueChange={(values) => {
                                                               const { formattedValue } = values;
                                                               setPhone(formattedValue)
                                                           }}
                                                       />
                                                   </div>
                                                   <label className="error-message"><span>{brokerErrors.phone && t(brokerErrors.phone[0])}</span></label>
                                               </div>
                                           </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 text-center" style={{padding:0}}>
                                                <button className="btn register-main-button" type="submit"
                                                        onClick={() => dispatch(broker_register(firstNameBroker, lastNameBroker, emailBroker, phone))}>
                                                    {t('send_request')}
                                                </button>
                                            </div>
                                        </div>
                                   </div>: <div className="col-12"><Alert color="success" className="col-12 text-center"><p>{t('request_success_text')}</p></Alert></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}

export default Login

