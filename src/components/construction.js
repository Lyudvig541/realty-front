import React from 'react';
import Navbar from './global-components/navbar';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import ConstructionList from "./section-components/construction-list";
import SearchConstructor from "./section-components/search-constructor";
import {Helmet} from "react-helmet";

const Construction = () => {
    window.scrollTo(0, 0)
    const {t} = useTranslation();
    const data = {
        navBarFixedClass : "navbar-area-fixed",
        blackLogo : " ",
        logo : "hidden-for-scroll ",
        no_search: true,
        mainNavbar : " "
    }

    return <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{t('meta_construction')}</title>
            <meta name="description" content={t('meta_construction_description')} />
        </Helmet>
        <Navbar t={t} data={data}/>
        <SearchConstructor t ={t}/>
        <ConstructionList  t={t}/>
        <Footer  t={t}/>
    </div>
}

export default Construction

