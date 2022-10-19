import React from 'react';
import ChooseAgent from './section-components/choose-agent';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import "../components/translations/i18n";
import Navbar from "./global-components/navbar";

const ChooseBroker = () => {
    window.scrollTo(0, 0)
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
        <ChooseAgent t={t}/>
        <Footer t={t}/>
    </div>
}

export default ChooseBroker

