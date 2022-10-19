import React from 'react';
import AddNew from './section-components/add-new';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import "../components/translations/i18n";
import Navbar from "./global-components/navbar";
import {useParams} from "react-router-dom";
import AddLand from "./section-components/add-land";

const AddProperty = () => {
    window.scrollTo(0, 0)
    const {t} = useTranslation();
    const {type} = useParams();
    const data = {
        navBarFixedClass: "navbar-area-fixed",
        blackLogo: " ",
        logo: "hidden-for-scroll ",
        searchBar: "hidden-for-scroll",
        mainNavbar: " "
    }
    return <div>

        <Navbar data={data} t={t}/>
        {type !== "4" ? <AddNew t={t}/> : <AddLand t={t}/> }
        <Footer t={t}/>
    </div>
}

export default AddProperty

