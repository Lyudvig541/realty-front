import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {textPage} from "../../actions/resources";

const Page_header = () => {
    const dispatch = useDispatch();
    const {slug} = useParams();

    useEffect(() => {
        async function getData() {
            await dispatch(textPage(slug));
        }
        getData();
    }, [dispatch, slug])
    const page_data = useSelector(state => state.resources.text_page);
    let publicApiUrl = process.env.REACT_APP_PUBLIC_API_URL
    return <div className="breadcrumb-area " style={{
        backgroundImage: page_data && page_data.image ? 'url('+ publicApiUrl + 'storage/uploads/pages/'+page_data.image+')' : 'url(/assets/img/banner/banner.jpg)',
    }}>
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="breadcrumb-inner">
                        <h1 className="page-title">
                            {page_data.translations && page_data.translations.map((i, key) => {
                                    return <div key={key}>{(localStorage.i18nextLng === 'us' && i.locale === 'en') || (i.locale === localStorage.i18nextLng) ? i.title : ""}</div>
                                })}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>

}


export default Page_header