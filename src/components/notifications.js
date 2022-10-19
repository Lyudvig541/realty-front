import React from 'react';
import Navbar from './global-components/navbar';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import NotificationsList from "./section-components/notifications-list";

const Notifications = () => {
    window.scrollTo(0, 0)
    const data = {
        navBarFixedClass: "navbar-area-fixed",
        blackLogo: " ",
        searchBar : "hidden-for-scroll",
        logo: "hidden-for-scroll ",
        mainNavbar: " "
    }
    const {t} = useTranslation();
    return <div>
        <Navbar data={data} t={t}/>
        <NotificationsList t={t}/>
        <Footer t={t}/>
    </div>
}

export default Notifications

