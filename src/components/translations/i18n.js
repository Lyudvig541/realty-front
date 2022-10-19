import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { TRANSLATIONS_AM } from "./am/translations";
import { TRANSLATIONS_RU } from "./ru/translations";
import { TRANSLATIONS_US } from "./us/translations";
let lng = localStorage.getItem('i18nextLng') ? localStorage.getItem('i18nextLng') : "am";
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: lng,
        resources: {
            am: {
                translation: TRANSLATIONS_AM
            },
            ru: {
                translation: TRANSLATIONS_RU
            },
            us: {
                translation: TRANSLATIONS_US
            }
        }
    });
i18n.changeLanguage(lng);