import React from 'react';
import Navbar from './global-components/navbar';
import FavoritesGrid from './section-components/favorites-grid';
import Footer from './global-components/footer';
import {useTranslation} from "react-i18next";
import SearchBar from "./section-components/search-bar";

const Favorites = () => {
    const data = {
        navBarFixedClass: "navbar-area-fixed",
        blackLogo: " ",
        logo: "hidden-for-scroll ",
        mainNavbar: " "
    }
    const {t} = useTranslation();
    return <div>
        <Navbar data={data} t={t}/>
        <SearchBar t={t}/>
        <FavoritesGrid t={t}/>
        <Footer t={t}/>
    </div>
}

export default Favorites

