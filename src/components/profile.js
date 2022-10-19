import React from 'react';
import Footer from './global-components/footer';
import Navbar from "./global-components/navbar";
import ProfilePage from "./section-components/profile-page";
import {useTranslation} from "react-i18next";

const Profile = () => {
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
        <ProfilePage t={t}/>
        <Footer t={t}/>
    </div>
}

export default Profile

