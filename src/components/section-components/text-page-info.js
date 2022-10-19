import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {textPage} from "../../actions/resources";
import {useParams} from "react-router-dom";


const TextPageInfo = (props) => {
    const inlineStyle = {
        backgroundColor: '#fff',
    }
    const dispatch = useDispatch();
    const {slug} = useParams();
    useEffect(() => {
        async function getData() {
            await dispatch(textPage(slug));
        }
        getData();
    }, [dispatch,slug])
    const page_data = useSelector(state => state.resources.text_page);

    return <div style={inlineStyle}>
        <div className="container pd-top-30 pd-bottom-30">
            {page_data.translations && page_data.translations.map((i, key) => {
                return <div key={key} dangerouslySetInnerHTML={{__html: (localStorage.i18nextLng === 'us' && i.locale === 'en') || (i.locale === localStorage.i18nextLng) ? i.editor : ""}}/>
            })}
        </div>
    </div>
}

export default TextPageInfo