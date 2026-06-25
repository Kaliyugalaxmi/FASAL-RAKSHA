import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { selectCrops: "Select Crops", wheat: "Wheat", rice: "Rice (Paddy)" } },
  hi: { translation: { selectCrops: "फसल चुनें",    wheat: "गेहूँ",  rice: "धान (चावल)"  } },
  // ...
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0].languageCode ?? "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;