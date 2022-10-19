import React from 'react';
import Navbar from './global-components/navbar';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import ConstAgencyInfo from "./section-components/const-agency-info";


const ConstAgency = (props) => {
    window.scrollTo(0, 0)
    const {t} = useTranslation();
    const data = {
        navBarFixedClass : "navbar-area-fixed",
        blackLogo : " ",
        logo : "hidden-for-scroll ",
        mainNavbar : " ",
        no_search: true,

    }
    return (
        <div>
            <Navbar t={t} data={data}/>
            <ConstAgencyInfo t={t}/>
            <Footer t={t}/>
        </div>

    );
}

export default ConstAgency;