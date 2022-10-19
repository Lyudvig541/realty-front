import React from 'react';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import "../components/translations/i18n";
import Navbar from "./global-components/navbar";
import EditAnnouncement from "./section-components/edit-announcement";

const EditProperty = () => {
    const {t} = useTranslation();
    const data = {
        navBarFixedClass: "navbar-area-fixed",
        blackLogo: " ",
        logo: "hidden-for-scroll ",
        searchBar: "hidden-for-scroll",
        mainNavbar: " "
    }
    return <div>
        <Navbar data={data} t={t}/>
        <EditAnnouncement t={t}/>
        <Footer t={t}/>
    </div>
}

export default EditProperty

