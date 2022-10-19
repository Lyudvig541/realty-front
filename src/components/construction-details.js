import React from 'react';
import ConstructionDetailsSection from './section-components/construction-details';
import Footer from './global-components/footer';
import Navbar from "./global-components/navbar";
import {useTranslation} from "react-i18next";

const ConstructionDetails = () => {
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
        <ConstructionDetailsSection t={t}/>
        <Footer t={t} />
    </div>
}

export default ConstructionDetails

