import React from 'react';
import BuyOrSellByType from './section-components/buy-or-sell-by-type';
import Footer from './global-components/footer';
import Navbar from "./global-components/navbar";
import {useTranslation} from "react-i18next";

const SellByType = () => {
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
        <BuyOrSellByType t={t}/>
        <Footer t={t}/>
    </div>
}

export default SellByType

