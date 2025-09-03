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

export default function LanguageSwitcher() {
  const { t } = useTranslation("common");

  const switchLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.cookie = `NEXT_LOCALE=${lng}; path=/; max-age=${
      60 * 60 * 24 * 30
    }`;
    window.location.reload();
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "km", name: "ខ្មែរ", flag: "🇰🇭" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 min-w-[120px] justify-start bg-transparent"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.name}</span>
          <span className="md:hidden">
            {currentLanguage.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
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
