import React from 'react';
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Back = () => {
    const publicUrl = process.env.PUBLIC_URL;
    const history = useHistory();
    const {t} = useTranslation();
    return <div className="rld-single-input">
                        <div className="sq-single-select">
                            <button className='back-button' onClick={()=>{
                                history.goBack()
                            }
                            }><img src={`${publicUrl}/assets/img/icons/left-arrow.png`} alt="..."/> {t('back')}</button>
                        </div>
                    </div>
}

export default Back