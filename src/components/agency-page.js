import React from 'react';
import Navbar from './global-components/navbar';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import AgencyInfo from "./section-components/agency-info";

const AgencyPage = () => {
    window.scrollTo(0, 0)
    const {t} = useTranslation();
    const data = {
        navBarFixedClass : "navbar-area-fixed",
        blackLogo : " ",
        logo : "hidden-for-scroll ",
        searchBar : "hidden-for-scroll",
        mainNavbar : " "
    }

    return <div>
        <Navbar t={t} data={data}/>
        <AgencyInfo  t={t}/>
        <Footer t={t} />
    </div>
}

export default AgencyPage

