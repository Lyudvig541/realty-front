import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import TextPageInfo from "./section-components/text-page-info";

const TextPage = () => {
    window.scrollTo(0, 0)
    const {t} = useTranslation();
    const data = {
        mainNavbar : " main-navbar-area",
        searchBar : "hidden-for-scroll"
    }
    return <div>
        <Navbar t={t} data={data}/>
        <PageHeader />
        <TextPageInfo/>
        <Footer t={t}/>
    </div>
}

export default TextPage

