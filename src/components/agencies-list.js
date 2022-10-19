import React from 'react';
import Navbar from './global-components/navbar';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import AllAgencies from "./section-components/all-agencies";
import {Helmet} from "react-helmet";

const AgenciesList = () => {
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
        <Helmet>
            <meta charSet="utf-8" />
            <title>{t('meta_agencies_list')}</title>
            <meta name="description" content={t('meta_agencies_list_description')} />
        </Helmet>
        <Navbar t={t} data={data}/>
        <AllAgencies t={t}/>
        <Footer t={t}/>
    </div>
}

export default AgenciesList

