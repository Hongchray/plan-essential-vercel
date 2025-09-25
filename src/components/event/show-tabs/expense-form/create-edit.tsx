"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currencyFormatters, formatCurrency } from "@/utils/currency";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  EditIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { formatDate } from "date-fns";
import { formatDateCustom } from "@/utils/date";
export function useExpenseFormSchema() {
  const { t } = useTranslation("common");
  return z.object({
    name: z.string().min(1, { message: t("expense.form.error_name_required") }),
    description: z.string().nullable().optional(),
    budget_amount: z.coerce
      .number()
      .min(1, { message: t("expense.form.error_budget_required") }),
    actual_amount: z.coerce.number().optional(),
    payments: z.array(
      z.object({
        id: z.string().optional(),
        name: z
          .string()
          .min(1, { message: t("expense.form.payment.error_name_required") }),
        amount: z.coerce.number().min(0.01, {
          message: t("expense.form.payment.error_amount_required"),
        }),
        paidAt: z.string().optional(),
        note: z.string().nullable().optional(),
      })
    ),
  });
}

export function CreateEditForm({ id }: { id: string }) {
  const { t } = useTranslation("common");
  const params = useParams();
  const eventId = params.id;
  type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;
  const ExpenseFormSchema = useExpenseFormSchema();
  const [collapsedPayments, setCollapsedPayments] = useState<{
    [key: number]: boolean;
  }>({});

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema), // <--- add this
    defaultValues: {
      name: "",
      description: "",
      budget_amount: undefined, // better than 0 to enforce required
      actual_amount: 0,
      payments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "payments",
  });

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  // Calculate total payments amount
  const watchedPayments = form.watch("payments");
  const totalPaymentsAmount =
    watchedPayments?.reduce((sum, payment) => {
      return sum + (Number(payment.amount) || 0);
    }, 0) || 0;

  // Update actual_amount when payments change
  useEffect(() => {
    form.setValue("actual_amount", totalPaymentsAmount);
  }, [totalPaymentsAmount, form]);

  const editExpense = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${eventId}/expense/${id}`);
    const data = await res.json();
    if (data) {
      // Format paidAt dates for input fields
      const formattedPayments =
        data.payments?.map((payment: any) => ({
          ...payment,
          paidAt: payment.paidAt
            ? new Date(payment.paidAt).toISOString().split("T")[0]
            : "",
        })) || [];

      form.reset({
        ...data,
        payments: formattedPayments,
      });
    }
    setLoading(false);
    return data;
  }, [id, eventId, form]);

  const addPayment = () => {
    const newIndex = fields.length;

    append({
      name: "",
      amount: 0,
      paidAt: new Date().toISOString().split("T")[0], // Today's date
      note: "",
    });
    setCollapsedPayments((prev) => ({ ...prev, [newIndex]: false }));
  };
  const togglePaymentCollapse = (index: number) => {
    setCollapsedPayments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const onSubmit = async (values: ExpenseFormData) => {
    setLoading(true);

    // Format payments data for API
    const formattedValues = {
      ...values,
      payments:
        values.payments?.map((payment) => ({
          ...payment,
          paidAt: payment.paidAt
            ? new Date(payment.paidAt).toISOString()
            : new Date().toISOString(),
        })) || [],
    };

    try {
      if (id) {
        await fetch(`/api/admin/event/${eventId}/expense/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        });
      } else {
        await fetch(`/api/admin/event/${eventId}/expense`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        });
      }
      setDialogOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && dialogOpen) {
      editExpense();
    }
  }, [dialogOpen, editExpense, id]);

  return (
    <>
      {id ? (
        <Button
          size="icon"
          variant="outline"
          onClick={() => setDialogOpen(true)}
          className="cursor-pointer"
        >
          <EditIcon />
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="cursor-pointer"
        >
          <PlusIcon />
          {t("expense.form.addNew")}
        </Button>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {id ? t("expense.form.editTitle") : t("expense.form.addTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("expense.form.description")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                step={0.01}
                form={form}
                disabled={loading}
              />
            </div>

            {/* Payments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {t("expense.form.payments.title")}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={addPayment}
                  disabled={loading}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  {t("expense.form.payments.add")}
                </Button>
              </div>

              {fields.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      {t("expense.form.payments.no_payments")}
                    </p>
                  </CardContent>
                </Card>
              )}

              {fields.map((field, index) => {
                const isCollapsed = collapsedPayments[index] ?? true;
                const payment = watchedPayments?.[index];
                const paymentSummary = payment?.name || `Payment #${index + 1}`;
                const paymentAmount = payment?.amount
                  ? `${formatCurrency(payment.amount)}`
                  : "$0.00";

                return (
                  <Collapsible key={field.id} open={!isCollapsed}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader
                          className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors "
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePaymentCollapse(index);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {isCollapsed ? (
                                  <ChevronDownIcon className="w-4 h-4" />
                                ) : (
                                  <ChevronUpIcon className="w-4 h-4" />
                                )}
                                <CardTitle className="text-base flex justify-between items-center">
                                  <span>{paymentSummary}</span>
                                  <span className="text-sm text-gray-500 ml-5">
                                    {payment.paidAt}
                                  </span>
                                </CardTitle>
                              </div>
                              {isCollapsed && (
                                <span className="text-sm text-muted-foreground font-medium">
                                  {paymentAmount}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePaymentCollapse(index);
                                }}
                                className="h-8 w-8 p-0 cursor-pointer"
                              >
                                {isCollapsed ? (
                                  <ChevronDownIcon className="w-4 h-4" />
                                ) : (
                                  <ChevronUpIcon className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  remove(index);
                                  // Update collapsed state indexes
                                  setCollapsedPayments((prev) => {
                                    const updated = { ...prev };
                                    delete updated[index];
                                    // Shift down higher indexes
                                    Object.keys(updated).forEach((key) => {
                                      const keyIndex = parseInt(key);
                                      if (keyIndex > index) {
                                        updated[keyIndex - 1] =
                                          updated[keyIndex];
                                        delete updated[keyIndex];
                                      }
                                    });
                                    return updated;
                                  });
                                }}
                                disabled={loading}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-4 pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputTextField
                              label={t("expense.form.payments.name")}
                              name={`payments.${index}.name`}
                              placeholder={t(
                                "expense.form.payments.name_placeholder"
                              )}
                              form={form}
                              disabled={loading}
                            />
                            <InputTextField
                              label={t("expense.form.payments.amount")}
                              name={`payments.${index}.amount`}
                              placeholder={t(
                                "expense.form.payments.amount_placeholder"
                              )}
                              type="number"
                              step={0.01}
                              form={form}
                              disabled={loading}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <TextareaField
                              label={t("expense.form.payments.note")}
                              name={`payments.${index}.note`}
                              placeholder={t(
                                "expense.form.payments.note_placeholder"
                              )}
                              form={form}
                              disabled={loading}
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}

              {fields.length > 0 && (
                <div className="flex justify-end text-sm text-muted-foreground">
                  {t("expense.form.payments.total")}:{" "}
                  {formatCurrency(totalPaymentsAmount)}
                </div>
              )}
            </div>

            <DialogFooter>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
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
