import React from 'react';
import Navbar from './global-components/navbar';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import AgentInfo from "./section-components/agent-info";

const SingleAgent = () => {
    window.scrollTo(0, 0)
    const {t} = useTranslation();
    const data = {
        navBarFixedClass : "navbar-area-fixed",
        blackLogo : " ",
        logo : "hidden-for-scroll ",
        searchBar: "hidden-for-scroll",
        mainNavbar : " "
    }

    return <div>
        <Navbar t={t} data={data}/>
        <AgentInfo t={t}/>
        <Footer t={t} />
    </div>
}

export default SingleAgent

