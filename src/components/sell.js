import React from 'react';
import BuyOrSell from './section-components/buy-or-sell';
import Footer from './global-components/footer';
import Navbar from "./global-components/navbar";
import {useTranslation} from "react-i18next";

const Sell = () => {
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
        <BuyOrSell t={t}/>
        <Footer t={t}/>
    </div>
}

export default Sell

