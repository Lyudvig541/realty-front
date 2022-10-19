import React from 'react';
import Navbar from './global-components/navbar';
import AnnouncementsGrid from './section-components/announcements-grid';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import SearchBar from "./section-components/search-bar";
import { useLocation } from "react-router-dom"
import {Helmet} from "react-helmet";

const Announcements = () => {
    window.scrollTo(0, 0)
    const data = {
        navBarFixedClass: "navbar-area-fixed",
        blackLogo: " ",
        logo: "hidden-for-scroll ",
        mainNavbar: " "
    }
    const {t} = useTranslation();
    const location = useLocation()

    return <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{t('meta_announcements')}</title>
            <meta name="description" content={t('meta_announcements_description')} />
        </Helmet>
        <Navbar data={data} t={t}/>
        <SearchBar data={location.state} t={t}/>
        <AnnouncementsGrid data={location.state} t={t}/>
        <Footer t={t}/>
    </div>
}

export default Announcements

