"use client";
import { useForm } from "react-hook-form";
import { InputTextField } from "@/components/composable/input/input-text-field";
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PlusIcon,
  Settings,
  Trash2Icon,
  XIcon,
  Check,
  PencilLine,
  TagIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Tag } from "@/interfaces/tag";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { Spining } from "@/components/composable/loading/loading";
import { useTranslation } from "react-i18next";

const tagFormSchema = z.object({
  name_en: z.string().min(1, "Name (English) is required"),
  name_kh: z.string().min(1, "Name (Khmer) is required"),
});

type TagFormData = z.infer<typeof tagFormSchema>;

export function ManageTagForm({ callBack }: { callBack: () => void }) {
  const { t } = useTranslation("common");
  const params = useParams();
  const eventId = params.id;

  const [editId, setEditId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: { name_en: "", name_kh: "" },
  });

  const editForm = useForm<TagFormData>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: { name_en: "", name_kh: "" },
  });

  const getTags = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${eventId}/tag`);
    const data = await res.json();
    if (data) setTags(data);
    setLoading(false);
    return data;
  }, [eventId]);

  const onSubmit = async (values: TagFormData) => {
    setLoading(true);
    await fetch(`/api/admin/event/${eventId}/tag`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    setLoading(false);
    form.reset();
    getTags();
    callBack();
  };

  const onUpdate = async (values: TagFormData) => {
    if (!editId) return;
    setLoading(true);
    await fetch(`/api/admin/event/${eventId}/tag/${editId}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    setLoading(false);
    setEditId("");
    editForm.reset();
    getTags();
    callBack();
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    await fetch(`/api/admin/event/${eventId}/tag/${id}`, { method: "DELETE" });
    setLoading(false);
    getTags();
    callBack();
  };

  useEffect(() => {
    if (dialogOpen) getTags();
  }, [dialogOpen, getTags]);

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="text-rose-500 hover:text-rose-700 text-sm flex items-center gap-1 cursor-pointer border border-dashed rounded-md p-1 border-rose-200"
      >
        <Settings className="h-4 w-4" />{" "}
        {t("guest_form.create_edit.manage_tags")}
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex gap-2">
              <Settings className="h-5 w-5" />{" "}
              {t("guest_form.create_edit.manage_tags")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 bg-gray-50 p-5 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputTextField
                label={t("guest_form.create_edit.name_en")}
                name="name_en"
                placeholder={t("guest_form.create_edit.name_en_placeholder")}
                form={form}
                disabled={loading}
              />
              <InputTextField
                label={t("guest_form.create_edit.name_kh")}
                name="name_kh"
                placeholder={t("guest_form.create_edit.name_kh_placeholder")}
                form={form}
                disabled={loading}
              />
            </div>

            <Button
              size="sm"
              type="button"
              disabled={loading}
              onClick={() => form.handleSubmit(onSubmit)()}
              className="cursor-pointer"
            >
              <PlusIcon /> {t("guest_form.create_edit.add_tag")}
            </Button>
          </div>

          <div className="rounded-md gap-2">
            <div className="px-3 font-semibold">
              {t("guest_form.create_edit.list_of_tags")}{" "}
              <span className="text-xs text-gray-500">
                ({t("guest_form.create_edit.total")} {tags.length})
              </span>
            </div>

            <ScrollArea className="h-[300px] rounded-md p-3">
              <div className="flex flex-col gap-2 p-1">
                {loading ? (
                  <Spining />
                ) : tags.length > 0 ? (
                  tags.map((tag) =>
                    editId === tag.id ? (
                      <div
                        key={tag.id}
                        className="border-2 rounded-md p-2 shadow-md"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <InputTextField
                            label={t("guest_form.create_edit.name_en")}
                            name="name_en"
                            placeholder={t(
                              "guest_form.create_edit.name_en_placeholder"
                            )}
                            form={editForm}
                            disabled={loading}
                          />
                          <InputTextField
                            label={t("guest_form.create_edit.name_kh")}
                            name="name_kh"
                            placeholder={t("guest_form.create_edit.")}
                            form={editForm}
                            disabled={loading}
                          />
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => {
                              setEditId("");
                              editForm.reset();
                            }}
                          >
                            <XIcon />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            className="cursor-pointer"
                            disabled={loading}
                            onClick={() => editForm.handleSubmit(onUpdate)()}
                          >
                            <Check className="text-green-600" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={tag.id}
                        className="flex justify-between items-center border rounded-md p-2"
                      >
                        <div className="flex gap-2 items-center">
                          <TagIcon className="w-4 h-4" />
                          <div>
                            <div className="text-sm font-medium">
                              {tag.name_en}
                            </div>
                            <div className="text-xs text-gray-500">
                              {tag.name_kh}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => {
                              setEditId(tag.id);
                              editForm.reset(tag);
                            }}
                          >
                            <PencilLine className="text-primary" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button
                                size="icon"
                                variant="ghost"
                                className="cursor-pointer"
                              >
                                <Trash2Icon className="text-red-600" />
                              </Button>
                            }
                            title={t("guest_form.create_edit.delete_tag_title")}
                            description={t(
                              "guest_form.create_edit.delete_tag_description"
                            )}
                            onConfirm={() => onDelete(tag.id)}
                          />
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center">
                    {t("guest_form.create_edit.list_of_tags")} is empty
                  </div>
                )}
              </div>
            </ScrollArea>
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
                }}
              >
                {t("guest_form.create_edit.cancel")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
