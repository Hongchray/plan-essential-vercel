"use client";

import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useTranslation } from "next-i18next";

interface SubmitButtonProps {
  loading: boolean;
  entityId?: string;
  className?: string;
}

export function SubmitButton({
  loading,
  entityId,
  className,
}: SubmitButtonProps) {
  const { t } = useTranslation("common");

  return (
    <Button type="submit" disabled={loading} className={className}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading
        ? t("component.button.saving")
        : entityId
        ? (<><Check/>  {t("component.button.saveChanges")}</>)
        : (<><Check/>  {t("component.button.create")}</>)}
    </Button>
  );
}
