import React from 'react';
import Navbar from './global-components/navbar';
import AllAgents from './section-components/all-agents';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import TopAgencies from "./section-components/top-agencies";
import SearchAgent from "./section-components/search-agent";
import {Helmet} from "react-helmet";

const AgentsList = () => {
    window.scrollTo(0, 0)
    const {t} = useTranslation();
    const data = {
        navBarFixedClass : "navbar-area-fixed",
        blackLogo : " ",
        logo : "hidden-for-scroll ",
        searchBar : "hidden-for-scroll",
        searchAgent : " ",
        mainNavbar : " "
    }
    return <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{t('meta_agents_list')}</title>
            <meta name="description" content={t('meta_agents_list_description')} />
        </Helmet>
        <Navbar t={t} data={data}/>
        <SearchAgent t ={t}/>
        <AllAgents t={t}/>
        <TopAgencies t={t}/>
        <Footer t={t} />
    </div>
}

export default AgentsList

