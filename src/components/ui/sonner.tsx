"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  // detect NEXT_LOCALE from cookies
  const locale =
    typeof window !== "undefined"
      ? document.cookie.match(/NEXT_LOCALE=(\w+)/)?.[1] ?? "km"
      : "en";

  // assign font variable
  const fontFamily =
    locale === "km"
      ? 'var(--font-km), "Kantumruy Pro", sans-serif'
      : 'var(--font-en), "Inter", sans-serif';

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          fontFamily, // ✅ force font inside Sonner portal
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
