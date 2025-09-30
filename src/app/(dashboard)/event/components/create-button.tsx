"use client";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
export default function CreateEventButton() {
  const { t } = useTranslation("common");

  return (
    <div className="flex justify-end mb-4">
      <Button
        onClick={() => (window.location.href = "/event/create")}
        className=""
      >
        <PlusIcon /> {t("EventPage.create_button")}
      </Button>
    </div>
  );
}
