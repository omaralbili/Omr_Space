import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: localStorage.getItem("lang") || "ar",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function setLanguage(lang: "ar" | "en") {
  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

// تطبيق الاتجاه عند بدء التشغيل
const initialLang = (localStorage.getItem("lang") || "ar") as "ar" | "en";
document.documentElement.lang = initialLang;
document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";

export default i18n;
