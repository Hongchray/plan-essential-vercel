"use client";

import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useMediaQuery } from "react-responsive";

export default function LanguageSwitcher() {
  const { t } = useTranslation("common");

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "km", name: "ភាសាខ្មែរ", flag: "🇰🇭" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Detect small screens
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  // Change language
  const switchLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.cookie = `NEXT_LOCALE=${lng}; path=/; max-age=${
      60 * 60 * 24 * 30
    }`;
    window.location.reload();
  };

  // On small screens: switch to next language
  const handleClick = () => {
    if (isSmallScreen) {
      const nextIndex =
        (languages.findIndex((lang) => lang.code === currentLanguage.code) +
          1) %
        languages.length;
      switchLanguage(languages[nextIndex].code);
    }
  };

  // --- Render ---
  if (isSmallScreen) {
    // Small screens: single button
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-transparent cursor-pointer"
        onClick={handleClick}
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-medium">
          {currentLanguage.code.toUpperCase()}
        </span>
      </Button>
    );
  }

  // Medium+ screens: full dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-transparent cursor-pointer"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </div>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
