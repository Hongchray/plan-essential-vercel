"use client";
import { useEffect } from "react";
import i18n from "@/lib/i18n";

export function LocaleFontProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const locale = i18n.language; // en or km
    if (locale === "km") {
      document.documentElement.style.fontFamily =
        "'Kantumruy Pro', 'Inter', sans-serif";
    } else {
      document.documentElement.style.fontFamily =
        "'Inter', 'Kantumruy Pro', sans-serif";
    }
  }, []);

  return <>{children}</>;
}
