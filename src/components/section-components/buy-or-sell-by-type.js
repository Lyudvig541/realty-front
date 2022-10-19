import React, {useEffect} from 'react';
import {useParams, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {types} from "../../actions/type";
import {PulseLoader} from "react-spinners";
import {setAddListingFinished, setLoadListing} from "../../reducers/announcementReducer";

const BuyOrSellByType = (props) => {
    const {t} = props;
    const imagePath = process.env.REACT_APP_PUBLIC_API_URL;
    const dispatch = useDispatch();
    const {category} = useParams();
    const getTypes = useSelector(state => Object.values(state.type.types));
    useEffect(() => {
        dispatch(types())
        dispatch(setLoadListing(false))
        dispatch(setAddListingFinished(false));
    }, [dispatch]);
    const spinner = useSelector(state => state.modals.spinner)
    return <div className="buy-sell-area pd-bottom-70">
        <div className="container">
            <div className="section-title text-center">
                <h2 className="preview">{ category === "1" ? t('what_do_you_want_to_sell') : t('what_do_you_want_to_rent')}</h2>
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
                    {getTypes.map((value, key) => {
                        return (
                            <div key={key} className="col-xl-3 col-lg-4 col-sm-6">
                                <Link to={`/choose-agent/${category}/${value.id}`}>
                                    <div className="single-author style-two text-center">
                                        <div className="thumb">
                                            <img src={imagePath + 'storage/uploads/announcement_types/' + value.image}
                                                 alt="House"/>
                                        </div>
                                        <div className="author-details">
                                            <h4 className="preview">
                                                {value.translations.map((value) => {
                                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : null
                                                })}
                                            </h4>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    </div>
}

export default BuyOrSellByType