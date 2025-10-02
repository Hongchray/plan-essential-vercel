// Create a new file: contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "kh" | "en";

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("kh");

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "kh" ? "en" : "kh"));
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setCurrentLanguage, toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
