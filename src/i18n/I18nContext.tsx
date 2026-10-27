"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, dictionaries } from "./dictionaries";

interface I18nContextType {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: typeof dictionaries["es"];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem("cospace_locale") as Locale | null;
    if (saved === "es" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (lang: Locale) => {
    setLocaleState(lang);
    localStorage.setItem("cospace_locale", lang);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n debe ser usado dentro de un I18nProvider");
  }
  return context;
}