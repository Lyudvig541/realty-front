import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {user} from "../../actions/user";
import { useParams } from "react-router";

const UserPage = (props) => {
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const publicUrl = process.env.PUBLIC_URL;
    const default_avatar = publicUrl + "/assets/img/author/default_avatar.png";
    const {t} = props;
    const dispatch = useDispatch()
    let { id } = useParams();
    let data = useSelector(state => state.user.user_data);
    const user_avatar = data && data.avatar ? (apiUrl + 'storage/uploads/users/' + data.avatar) : default_avatar

    useEffect(() => {
        async function getData() {
            await dispatch(user(id))
        }
        getData();
    }, [dispatch, id])

    return <div className="profile-area">
        <div className="pd-top-100 pd-bottom-90">
            <div className="container tablet-cont">
                <div className="row prof-cont">
                    <div className="col-md-12 col-lg-12 col-sm-12 tab-content-cont">
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="profile">
                                <div className="details">
                                    <div className="profile-tab position-relative" >
                                        {data ? <div className="container">
                                                <div className="tab-header-container" style={{padding: '3%'}}>
                                                    <div>
                                                        <h4 className="contact-name">{t('personal_information')}</h4>
                                                    </div>
                                                </div>
                                                <div className="profile-info-container">
                                                    <div className=" ">
                                                        <div className="profile-image">
                                                            <div className="bankImg text-center">
                                                                <img src={user_avatar} alt={'logo'}
                                                                     style={{borderRadius: "50%"}}/>
                                                            </div>
                                                            <div className="text-center pd-bottom-40 pd-top-20">
                                                                <h4 className="contact-name">
                                                                    {data.first_name} {data.last_name}
                                                                </h4>
                                                                <h5 className="contact-placeholder user-id">ID
                                                                    - {data.id}</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className=" ">
                                                        <div className="vertical-grey-line"/>
                                                    </div>
                                                    <div className=" contact-information text-left">
                                                        <h4 className="contact-title">{t('contact_information')}</h4>
                                                        <br/>
                                                        <h5 className="contact-placeholder">{t("email")}</h5>
                                                        <h5 className="contact-text">{data.email}</h5>
                                                        <br/>
                                                        <h5 className="contact-placeholder">{t('phone_number')}</h5>
                                                        <h5 className="contact-text">{data.phone}</h5>
                                                        <br/>
                                                    </div>
                                                </div>
                                            </div> :
                                            <div className="col-12 text-center mt-3">
                                                <h3>{t('user_not_exist')}</h3>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default UserPage
