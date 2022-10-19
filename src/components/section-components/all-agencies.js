import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {agencies} from "../../actions/resources";
import Pagination from "./pagination";

const AllAgencies = () => {

    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;
    const imagealt = 'imagealt';
    const dispatch = useDispatch();

    useEffect(() => {
        !data2.length && dispatch(agencies(1))
        getPage()
    }, [dispatch])

    async function getPage() {
        await dispatch(agencies())
    }
    let data = useSelector(state => state.resources.agencies.data)
    let data2 = useSelector(state => state.resources.agencies)
    return <div className="user-list-area pd-top-100 pd-bottom-70">
        <div className="container">
            <div className="row">
                {data ? data.map((item, i) =>
                    <div key={i} className="col-lg-4 col-md-6">
                        <div className="single-user-list text-center pd-top-30 pd-bottom-30">
                            <div className="thumb">
                                <img src={apiUrl + 'storage/uploads/users/' + item.avatar} alt={imagealt}/>
                            </div>
                            <div className="details">
                                <h4><a href={'agency/' + item.id}>{item.translations && item.translations.map((value, i) => {
                                    return (localStorage.i18nextLng === 'us' && value.locale === 'en') || (value.locale === localStorage.i18nextLng) ? value.name : ""
                                })}</a></h4>
                                <p dangerouslySetInnerHTML={{__html: item.address}}/>
                                <span className="phone"><i className="fa fa-phone"/>{item.phone}</span>
                            </div>
                        </div>
                    </div>
                ) : ""}
            </div>
            {data2.last_page && data2.last_page > 1 ?
                <Pagination data2={data2} getPage={getPage}/>
                : ""}
        </div>
    </div>
}

export default AllAgencies