// lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import en from "../../lang/en/common.json";
import km from "../../lang/km/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      km: { common: km },
    },
    fallbackLng: "en",
    detection: {
      order: ["cookie", "navigator"],
      caches: ["cookie"],
      lookupCookie: "NEXT_LOCALE",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
