import React from 'react';
import Navbar from './global-components/navbar';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import  BankRequestPage from './section-components/bank-request-page'

const BankRequest = () => {
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
        <BankRequestPage t={t}/>
        <Footer t={t} />
    </div>
}

export default BankRequest

