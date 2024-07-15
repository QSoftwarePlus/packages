"use client";

import { Locale } from "..";
import { Dicc } from "../lib/dictonaries";
import React, { useContext, useState } from "react";

interface LanguageContext {
  dictionary: Dicc;
  lang: Locale;
  updateLang: (newLang: Locale) => void;
}

const LanguageContext = React.createContext<LanguageContext | undefined>(
  undefined,
);

export const useLanguage = () => useContext(LanguageContext)!;

export const LanguageProvider = ({
  children,
  ctx,
}: {
  children: React.ReactNode;
  ctx: Omit<LanguageContext, "updateLang">;
}) => {
  const [lang, setLang] = useState<Locale>(ctx.lang);

  const updateLang = (newLang: Locale) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ ...ctx, updateLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
