"use client";

import { useForm } from "react-hook-form";
import { InputTextField } from "@/components/composable/input/input-text-field";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SubmitButton } from "@/components/composable/button/submit-button";
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
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextareaField } from "@/components/composable/input/input-textarea-text-field";
import { MultiSelect } from "@/components/composable/select/muliple-select-option";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ManageGroupForm } from "./manage-group";
import { ManageTagForm } from "./manage-tag";
import { Group } from "@/interfaces/group";
import { Tag } from "@/interfaces/tag";
import { useParams, useRouter } from "next/navigation";
import { EditIcon, Plus, X } from "lucide-react";
import ImageUpload from "@/components/composable/upload/upload-image";
import { useTranslation } from "react-i18next";
import { RequiredMark } from "@/components/composable/required-mark";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
export function CreateEditForm({ id }: { id: string }) {
  const { t } = useTranslation("common"); // assuming your translations are in common.json
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();

  const guestFormSchema = z.object({
    image: z.string().nullable().optional(),
    name: z.string().min(1, { message: t("guest_form.message.name_required") }),
    email: z.string().nullable().optional(),
    phone: z.string().nullable(),
    note: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    groups: z.array(z.string()).nullable().optional(),
  });

  type GuestFormData = z.infer<typeof guestFormSchema>;

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      note: "",
      address: "",
      image: "",
      tags: [],
      groups: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [groupList, setGroupList] = useState<Group[]>([]);
  const { data: session } = useSession();

  // edit guest
  const editGuest = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${eventId}/guest/${id}`);
    const data = await res.json();
    if (data) form.reset(data);
    setLoading(false);
    return data;
  }, [id]);

  const getTag = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${eventId}/tag`);
    const data = await res.json();
    if (data) setTagList(data);
    setLoading(false);
    return data;
  }, []);

  const getGroup = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/event/${eventId}/group`);
    const data = await res.json();
    if (data) setGroupList(data);
    setLoading(false);
    return data;
  }, []);

  const onSubmit = async (values: GuestFormData) => {
    setLoading(true);

    if (!session?.user?.id) {
      toast.error(t("guest_form.message.not_logged_in"));
      setLoading(false);
      return;
    }

    const payload = { ...values, userId: session.user.id };

    try {
      let res;
      if (id) {
        res = await fetch(`/api/admin/event/${eventId}/guest/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/event/${eventId}/guest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          toast.error(t("guest_form.message.limit_reached"));
        } else {
          toast.error(data.message || t("guest_form.message.create_failed"));
        }
        setLoading(false);
        return;
      }

      toast.success(
        id
          ? t("guest_form.message.update_success")
          : t("guest_form.message.create_success")
      );

      setDialogOpen(false);
      form.reset();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(t("guest_form.message.create_error"));
    } finally {
      setLoading(false);
    }
  };

  const groupOptions = useMemo(
    () =>
      groupList.map((group) => ({
        label: group.name_kh,
        value: group.id,
      })),
    [groupList]
  );
  const tagOptions = useMemo(
    () =>
      tagList.map((tag) => ({
        label: tag.name_kh,
        value: tag.id,
      })),
    [tagList]
  );

  useEffect(() => {
    if (dialogOpen) {
      getTag();
      getGroup();
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (id && dialogOpen) editGuest();
  }, [dialogOpen]);

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
          className="cursor-pointer"
          size="sm"
          onClick={() => setDialogOpen(true)}
        >
          <Plus />
          {t("guest_form.create_edit.add_new")}
        </Button>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-left">
              {id
                ? t("guest_form.create_edit.edit_guest")
                : t("guest_form.create_edit.add_new_guest")}
            </DialogTitle>
            <DialogDescription className="text-left">
              {t("guest_form.create_edit.fill_guest_details")}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 md:space-y-4 overflow-y-auto"
          >
            {/* <div>
              <ImageUpload
                label={t("guest_form.create_edit.photo")}
                folder="/event/guest"
                {...form.register("image")}
                value={form.watch("image") ?? ""}
              />
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <InputTextField
                label={t("guest_form.create_edit.name")}
                name="name"
                placeholder={t("guest_form.create_edit.name_placeholder")}
                form={form}
                disabled={loading}
                required
              />
              <InputTextField
                label={t("guest_form.create_edit.phone")}
                name="phone"
                placeholder={t("guest_form.create_edit.phone_placeholder")}
                form={form}
                disabled={loading}
              />

              {/* <TextareaField
                label={t("guest_form.create_edit.address")}
                name="address" 
                placeholder={t("guest_form.create_edit.address_placeholder")}
                form={form}
                disabled={loading}
              /> */}

              <div>
                <div className="flex justify-between items-center pt-2">
                  <Label>{t("guest_form.create_edit.groups")}</Label>
                  <ManageGroupForm callBack={getGroup} />
                </div>
                <MultiSelect
                  label=""
                  options={groupOptions}
                  form={form}
                  name="groups"
                  placeholder={t("guest_form.create_edit.groups_placeholder")}
                />
              </div>
              <div>
                <div className="flex justify-between items-center pt-2">
                  <Label>{t("guest_form.create_edit.tags")}</Label>
                  <ManageTagForm callBack={getTag} />
                </div>
                <MultiSelect
                  label=""
                  options={tagOptions}
                  form={form}
                  name="tags"
                  hideSelectAll={false}
                  placeholder={t("guest_form.create_edit.tags_placeholder")}
                />
              </div>
              <TextareaField
                label={t("guest_form.create_edit.note")}
                name="note"
                placeholder={t("guest_form.create_edit.note_placeholder")}
                form={form}
                disabled={loading}
              />
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
                  <X />
                  {t("guest_form.create_edit.cancel")}
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
