import React from 'react';
import Navbar from './global-components/navbar';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import SelectAgent from "./section-components/select-agent";
import SearchAgent from "./section-components/search-agent";

const SelectAgentList = () => {
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
        <Navbar t={t} data={data}/>
        <SearchAgent t ={t}/>
        <SelectAgent t={t}/>
        <Footer t={t} />
    </div>
}

export default SelectAgentList

