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
  GroupIcon,
  PlusIcon,
  Settings,
  Trash2Icon,
  XIcon,
  Check,
  PencilLine,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Group } from "@/interfaces/group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { Spining } from "@/components/composable/loading/loading";
import { useTranslation } from "react-i18next";
const guestFormSchema = z.object({
  name_en: z.string().min(1, "Name en is required"),
  name_kh: z.string().min(1, "Name km is required"),
});
type GuestFormData = z.infer<typeof guestFormSchema>;

export function ManageGroupForm({ callBack }: { callBack: () => void }) {
  const { t } = useTranslation("common");
  const params = useParams();
  const id = params.id;
  const [editId, setEditId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: { name_en: "", name_kh: "" },
  });

  const editForm = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: { name_en: "", name_kh: "" },
  });

  const getGroup = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${id}/group`);
    const data = await res.json();
    if (data) setGroups(data);
    setLoading(false);
    return data;
  }, [id]);

  const onSubmit = async (values: GuestFormData) => {
    setLoading(true);
    await fetch(`/api/admin/event/${id}/group`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    await getGroup();
    setLoading(false);
    form.reset();
    callBack();
  };

  const onUpdate = async (values: GuestFormData) => {
    setLoading(true);
    await fetch(`/api/admin/event/${id}/group/${editId}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    await getGroup();
    setLoading(false);
    setEditId("");
    editForm.reset();
    callBack();
  };

  const onDelete = async (groupId: string) => {
    setLoading(true);
    await fetch(`/api/admin/event/${id}/group/${groupId}`, {
      method: "DELETE",
    });
    await getGroup();
    setLoading(false);
    callBack();
  };

  useEffect(() => {
    if (dialogOpen) getGroup();
  }, [dialogOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="text-rose-500 hover:text-rose-700 text-sm flex items-center gap-1 cursor-pointer border border-dashed rounded-md p-1 border-rose-200"
      >
        <Settings className="h-4 w-4" />
        {t("guest_form.create_edit.manage_groups")}
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              <span className="flex gap-2">
                <Settings className="h-5 w-5" />{" "}
                {t("guest_form.create_edit.manage_groups")}
              </span>
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
              <PlusIcon /> {t("guest_form.create_edit.add_group")}
            </Button>
          </div>

          <div className="rounded-md gap-2">
            <div className="px-3 font-semibold">
              {t("guest_form.create_edit.list_of_groups")}{" "}
              <span className="text-xs text-gray-500">
                ({t("guest_form.create_edit.total")} {groups.length})
              </span>
            </div>

            <ScrollArea className="h-[300px] rounded-md p-3">
              <div className="flex flex-col gap-2 p-1 w-full">
                {loading ? (
                  <Spining />
                ) : groups.length > 0 ? (
                  groups.map((group) =>
                    editId === group.id ? (
                      <div
                        key={group.id}
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
                            placeholder={t(
                              "guest_form.create_edit.name_kh_placeholder"
                            )}
                            form={editForm}
                            disabled={loading}
                          />
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditId("");
                              editForm.reset();
                            }}
                            className="cursor-pointer"
                          >
                            <XIcon />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            disabled={loading}
                            onClick={() => editForm.handleSubmit(onUpdate)()}
                            className="cursor-pointer"
                          >
                            <Check className="text-green-600" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={group.id}
                        className="flex justify-between items-center border rounded-md p-2"
                      >
                        <div className="flex gap-2 items-center">
                          <GroupIcon className="w-4 h-4" />
                          <div>
                            <div className="text-sm font-medium">
                              {group.name_en}
                            </div>
                            <div className="text-xs text-gray-500">
                              {group.name_kh}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditId(group.id);
                              editForm.reset(group);
                            }}
                            className="cursor-pointer"
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
                            title={t(
                              "guest_form.create_edit.delete_group_title"
                            )}
                            description={t(
                              "guest_form.create_edit.delete_group_description"
                            )}
                            onConfirm={() => onDelete(group.id)}
                          />
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center">
                    {t("guest_form.create_edit.no_group_found")}
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
