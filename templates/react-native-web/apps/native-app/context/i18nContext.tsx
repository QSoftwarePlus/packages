import React, { createContext, useState, useEffect } from "react";
import * as Localization from "expo-localization";
import i18n from "../i18n";

export interface I18nContextProps {
  locale: string;
  setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextProps>({
  locale: "en",
  setLocale: () => {},
});

export const I18nProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    const updateLocale = () => {
      const currentLocale = locale || "en";
      setLocale(currentLocale);
      i18n.locale = currentLocale;
    };

    updateLocale();
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};
