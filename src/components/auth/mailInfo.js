import React from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import {setModal} from "../../reducers/modalsReducer";
import {useTranslation} from "react-i18next";

const MailInfo = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const modal = useSelector(state => state.modals.modal)

    return <div>
        <Modal className="forgot_modal" isOpen={modal === "mail_info"}>
            <ModalHeader toggle={()=> dispatch(setModal(""))}/>
            <ModalBody>
                <div className="container">
                    <div className="row ">
                        <div className="col-12 text-center">
                            <h4>{t('request_text')}</h4>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
}

export default MailInfo

