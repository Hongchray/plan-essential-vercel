"use client";

import { useState, useCallback, useEffect } from "react";
import { Expense } from "@/interfaces/expense";
import { Search, Edit, Trash2, Plus, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextareaField } from "@/components/composable/input/input-textarea-text-field";
import { InputTextField } from "@/components/composable/input/input-text-field";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@/components/composable/button/submit-button";
import { NoData } from "@/components/composable/no-data";
export default function TabExpenseMobile({
  data,
  setData,
}: {
  data: Expense[];
  setData: (items: Expense[]) => void;
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteMultiple, setPendingDeleteMultiple] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedItems(data.map((item) => item.id));
  const deselectAll = () => setSelectedItems([]);
  const allSelected = data.length > 0 && selectedItems.length === data.length;

  // Enhanced delete functions with proper async handling and error management
  const handleDeleteSelected = async () => {
    setDeleteLoading(true);
    try {
      // Call API to delete multiple items
      const deletePromises = selectedItems.map((id) =>
        fetch(`/api/admin/event/${eventId}/expense/${id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deletePromises);

      // Update local state only after successful API calls
      const newData = data.filter((item) => !selectedItems.includes(item.id));
      setData(newData);
      setSelectedItems([]);
    } catch (error) {
      console.error("Failed to delete selected expenses:", error);
      // You might want to show a toast notification here
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      // Call API to delete single item
      const response = await fetch(
        `/api/admin/event/${eventId}/expense/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      // Update local state only after successful API call
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      setSelectedItems((prev) => prev.filter((i) => i !== id));
    } catch (error) {
      console.error("Failed to delete expense:", error);
      // You might want to show a toast notification here
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper function to get the item being deleted (for single delete)
  const getItemToDelete = () => {
    if (pendingDeleteId) {
      return data.find((item) => item.id === pendingDeleteId);
    }
    return null;
  };

  // Enhanced confirm dialog handlers
  const handleConfirmDelete = async () => {
    try {
      if (pendingDeleteMultiple) {
        await handleDeleteSelected();
      } else if (pendingDeleteId) {
        await handleDelete(pendingDeleteId);
      }
    } finally {
      // Reset state after operation completes (success or failure)
      setConfirmOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteMultiple(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
    setPendingDeleteMultiple(false);
  };

  // --- Form schema ---
  const ExpenseFormSchema = z.object({
    name: z.string().min(1, { message: t("expense.form.error_name_required") }),
    description: z.string().nullable().optional(),
    budget_amount: z.coerce.number().min(1, {
      message: t("expense.form.error_budget_required"),
    }),
    actual_amount: z.coerce.number().optional(),
  });
  type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      budget_amount: 0,
      actual_amount: 0,
    },
  });

  // --- Edit fetch ---
  const editExpense = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/event/${eventId}/expense/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch expense");
        }
        const data = await res.json();
        if (data) {
          form.reset(data);
        }
      } catch (error) {
        console.error("Failed to fetch expense for editing:", error);
      } finally {
        setLoading(false);
      }
    },
    [eventId, form]
  );

  useEffect(() => {
    if (editingId && dialogOpen) {
      editExpense(editingId);
    }
  }, [editingId, dialogOpen, editExpense]);

  const onSubmit = async (values: ExpenseFormData) => {
    setLoading(true);
    try {
      if (editingId) {
        // Edit existing
        const res = await fetch(
          `/api/admin/event/${eventId}/expense/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to update expense");
        }

        const updatedItem = await res.json();

        // Update the data array with the updated item
        setData(
          data.map((item) => (item.id === editingId ? updatedItem : item))
        );

        setDialogOpen(false);
        setEditingId(null);
        form.reset();
      } else {
        // Create new
        const res = await fetch(`/api/admin/event/${eventId}/expense`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("Failed to create expense");
        }

        const newItem = await res.json();

        setData([...data, newItem]);

        setDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error("Failed to save expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-white rounded-lg p-2">
      <div className="space-y-3">
        {/* Search + Add */}
        <div className="flex gap-2 items-center bg-white p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t("expense.list.search")}
              className="pl-10 border-0 bg-gray-50 focus-visible:ring-1"
            />
          </div>
          <Button
            onClick={() => {
              setDialogOpen(true);
              setEditingId(null);
            }}
            className="text-white px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("expense.list.add")}
          </Button>
        </div>

        {/* Select / Deselect */}
        {data.length > 0 && (
          <div className="flex items-center gap-2 px-3">
            <input
              id="select-all"
              type="checkbox"
              checked={allSelected}
              onChange={allSelected ? deselectAll : selectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="select-all"
              className="text-sm text-gray-700 cursor-pointer"
            >
              {allSelected
                ? t("expense.list.deselectAll")
                : t("expense.list.selectAll")}
            </label>
          </div>
        )}
        <Separator />

        {/* Item list */}
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 flex items-start gap-4 border-b border-b-gray-200"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="mt-1 w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base leading-snug mb-2 truncate">
                  {item.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {t("expense.list.actual")}:{" "}
                    {formatCurrency(item.actual_amount)}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {t("expense.list.budget")}:{" "}
                    {formatCurrency(item.budget_amount)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(item.id);
                    setDialogOpen(true);
                  }}
                  className="w-8 h-8 p-0 rounded-full border-blue-200 hover:bg-blue-50 bg-transparent flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPendingDeleteId(item.id);
                    setPendingDeleteMultiple(false);
                    setConfirmOpen(true);
                  }}
                  className="w-8 h-8 p-0 rounded-full border-red-200 hover:bg-red-50 bg-transparent flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6">
            <NoData
              icon="database"
              title={`${t("expense.list.no_data", "No data found.")}`}
              description=""
            />
          </div>
        )}

        {/* Footer bar */}
        <div className="sticky bottom-0 left-0 w-full bg-gray-50 p-3 flex items-center justify-between rounded-b-lg">
          {selectedItems.length === 0 ? (
            <span className="text-sm text-gray-700">
              {t("expense.list.total", { count: data.length })}
            </span>
          ) : (
            <>
              <span className="text-sm text-gray-700">
                {t("expense.list.selected", { count: selectedItems.length })}
              </span>
              <Button
                onClick={() => {
                  setPendingDeleteMultiple(true);
                  setConfirmOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t("expense.list.delete")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* --- Create/Edit Dialog --- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? t("expense.form.editTitle")
                : t("expense.form.addTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("expense.form.description")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <DialogFooter>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    form.reset();
                    setDialogOpen(false);
                    setEditingId(null);
                  }}
                >
                  {t("expense.form.cancel")}
                </Button>
                <SubmitButton loading={loading} entityId={editingId ?? ""} />
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Enhanced Confirm Delete Dialog --- */}
      <Dialog open={confirmOpen} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              {t("expense.list.confirm_delete_title")}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {pendingDeleteMultiple ? (
                <div className="space-y-2">
                  <p>
                    {t("expense.list.confirm_delete_multiple_desc", {
                      count: selectedItems.length,
                    })}
                  </p>
                  <span className="text-sm text-gray-600">
                    {t("expense.list.confirm_delete_warning")}
                  </span>
                </div>
              ) : (
                <span className="space-y-2">
                  <span>
                    {t("expense.list.confirm_delete_single_desc")}
                    {getItemToDelete() && (
                      <span className="font-medium text-gray-900">
                        "{getItemToDelete()?.name}"
                      </span>
                    )}
                    ?
                  </span>
                  <span className="text-sm text-gray-600">
                    {t("expense.list.confirm_delete_warning")}
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                disabled={deleteLoading}
              >
                {t("expense.form.cancel")}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("expense.list.deleting")}
                  </div>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" />
                    {pendingDeleteMultiple
                      ? t("expense.list.delete_selected")
                      : t("expense.list.delete")}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
