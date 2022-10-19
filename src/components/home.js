import React from 'react';
import Navbar from './global-components/navbar';
import Banner from './section-components/banner';
import Service from './section-components/service';
import Agencies from './section-components/agencies';
import Footer from './global-components/footer';
import Agents from "./section-components/agents";
import { useTranslation } from "react-i18next";
import "../components/translations/i18n";
import {Helmet} from "react-helmet";


const Home = () => {
    window.scrollTo(0, 0)
    const data = {
        mainNavbar : " main-navbar-area",
        searchBar : "hidden-for-scroll"
    }
    const {t} = useTranslation();
    return <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{t('meta_home_title1')}</title>
            <meta name="description" content={t('meta_home_description')} />
        </Helmet>
        <Navbar t={t} data={data}/>
        <Banner t={t}/>
        <Service t={t} />
        <Agents t={t}/>
        <Agencies t={t}/>
        <Footer t={t}/>
    </div>
}

export default Home

