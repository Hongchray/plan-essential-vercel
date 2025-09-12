"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmText,
  cancelText,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation("common"); // or your namespace where translations live

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title ?? t("component.confirm_dialog.title")}
          </DialogTitle>
          <DialogDescription>
            {description ?? t("component.confirm_dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelText ?? t("component.confirm_dialog.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {confirmText ?? t("component.confirm_dialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
