"use client";

import { useForm } from "react-hook-form";
import { InputTextField } from "@/components/composable/input/input-text-field";
import { useState, useEffect, useCallback } from "react";
import { SubmitButton } from "@/components/composable/button/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextareaField } from "@/components/composable/input/input-textarea-text-field";
import { useParams, useRouter } from "next/navigation";
import { EditIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function useExpenseFormSchema() {
  const { t } = useTranslation("common");
  return z.object({
    name: z.string().min(1, { message: t("expense.form.error_name_required") }),
    description: z.string().nullable().optional(),
    budget_amount: z.coerce
      .number()
      .min(1, { message: t("expense.form.error_budget_required") }),
    actual_amount: z.coerce.number().optional(),
  });
}

export function CreateEditForm({ id }: { id: string }) {
  const { t } = useTranslation("common");
  const params = useParams();
  const eventId = params.id;
  type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;
  const ExpenseFormSchema = useExpenseFormSchema();
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      budget_amount: 0,
      actual_amount: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const editExpense = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${eventId}/expense/${id}`);
    const data = await res.json();
    if (data) {
      form.reset(data);
    }
    setLoading(false);
    return data;
  }, [id]);

  const onSubmit = async (values: ExpenseFormData) => {
    setLoading(true);
    if (id) {
      await fetch(`/api/admin/event/${eventId}/expense/${id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
    } else {
      await fetch(`/api/admin/event/${eventId}/expense`, {
        method: "POST",
        body: JSON.stringify(values),
      });
    }
    setLoading(false);
    setDialogOpen(false);
    form.reset();
    router.refresh();
  };

  useEffect(() => {
    if (id && dialogOpen) {
      editExpense();
    }
  }, [dialogOpen]);

  return (
    <>
      {id ? (
        <Button
          size="icon"
          variant="outline"
          onClick={() => setDialogOpen(true)}
        >
          <EditIcon />
        </Button>
      ) : (
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          {t("expense.form.addNew")}
        </Button>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {id ? t("expense.form.editTitle") : t("expense.form.addTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("expense.form.description")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <InputTextField
                label={t("expense.form.name")}
                name="name"
                placeholder={t("expense.form.name_placeholder")}
                form={form}
                disabled={loading}
              />
              <TextareaField
                label={t("expense.form.desc")}
                name="description"
                placeholder={t("expense.form.desc_placeholder")}
                form={form}
                disabled={loading}
              />
              <InputTextField
                label={t("expense.form.budget")}
                name="budget_amount"
                placeholder={t("expense.form.amount_placeholder")}
                type="number"
                step={0.1}
                form={form}
                disabled={loading}
              />
              <InputTextField
                label={t("expense.form.actual")}
                name="actual_amount"
                placeholder={t("expense.form.amount_placeholder")}
                type="number"
                step={0.1}
                form={form}
                disabled={loading}
              />
            </div>
            <DialogFooter>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    form.reset();
                    setDialogOpen(false);
                    router.refresh();
                  }}
                >
                  {t("expense.form.cancel")}
                </Button>
                <SubmitButton loading={loading} entityId={id} />
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
