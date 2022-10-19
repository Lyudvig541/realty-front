import React, {useEffect} from 'react';
import {setModal} from "../../reducers/modalsReducer";
import {useDispatch, useSelector} from "react-redux";
import {categories} from "../../actions/category";
import {useHistory} from "react-router-dom";
import {PulseLoader} from "react-spinners";

const BuyOrSell = (props) => {
    const {t} = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const imagePath = process.env.REACT_APP_PUBLIC_API_URL;
    const token = localStorage.getItem('token');
    const getCategories = useSelector(state => state.category.categories);
    const isLogin = () => {
        dispatch(setModal("login"));
    }

    const checkVerification = (id) => {
        history.push(`/sell-by-type/${id}`);
    }
    const spinner = useSelector(state => state.modals.spinner)
    useEffect(() => {
        !getCategories.length && dispatch(categories())
    }, [dispatch]);
    return (
        <div>
            <div className="buy-sell-area pd-bottom-70">
                <div>
                    {!token && isLogin()}
                </div>
                <div className="container">
                    <div className="section-title text-center">
                        <h2 className="preview">{t('list_property_for')}</h2>
                        <div className="partner-red-line mt-4"/>
                    </div>
                    {spinner ?
                        <div className="spinner_content">
                            <div className="sweet-loading">
                                <PulseLoader color={"#BE1E2D"} loading={true} size={16}/>
                            </div>
                        </div>
                        :
                        <div className="row justify-content-center buy-sell-area-content">
                            {getCategories.map((item, i) => {
                                return (
                                    <div key={i} className="col-xl-3 col-lg-4 col-sm-6 buy-sell-card" onClick={() => {
                                        checkVerification(item.id)
                                    }}>
                                        <div className="single-author style-two text-center mg-bottom-0">
                                            <div className="thumb">
                                                <img src={imagePath + 'storage/uploads/categories/' + item.image} alt={'Category'}/>
                                            </div>
                                            <div className="author-details">
                                                <h4 className="preview">
                                                    {item.translations.map((value, i) => {
                                                        return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                    })}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default BuyOrSell