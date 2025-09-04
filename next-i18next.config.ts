import type { UserConfig } from "next-i18next";

const config: UserConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "km"],
  },
  detection: {
    order: ["cookie", "querystring", "localStorage", "navigator"],
    caches: ["cookie"],
    cookieMinutes: 60 * 24 * 30, // 30 days
    cookieDomain:
      typeof window === "undefined" ? "localhost" : window.location.hostname,
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};

export default config;
