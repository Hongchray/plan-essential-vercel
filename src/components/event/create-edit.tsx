"use client";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../composable/button/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect, useState } from "react";
import { InputTextField } from "../composable/input/input-text-field";
import { Button } from "../ui/button";
import { SwitchField } from "../composable/input/switch";
import { SelectField } from "../composable/select/select-option";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/LoadingContext";
import { TextareaField } from "../composable/input/input-textarea-text-field";
import { DatePickerField } from "../composable/date/date-picker";
import ImageUpload from "../composable/upload/upload-image";
import { useTranslation } from "next-i18next";
import { Label } from "@/components/ui/label";

export function CreateEditForm({ id }: { id?: string }) {
  const { t } = useTranslation("common");
  const { setOverlayLoading } = useLoading();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Zod schema inside component to use t()
  const formSchema = z.object({
    name: z
      .string()
      .min(1, t("EventPage.error.nameRequired"))
      .max(50, t("EventPage.error.nameMax")),
    type: z.string().min(1, t("EventPage.error.typeRequired")),
    bride: z.string().min(1, t("EventPage.error.brideRequired")),
    groom: z.string().min(1, t("EventPage.error.groomRequired")),
    image: z.string().nullable(),
    status: z.string(),
    description: z.string(),
    userId: z.string(),
    location: z.string(),
    latitude: z.coerce.string().optional(),
    longitude: z.coerce.string().optional(),
    startTime: z.coerce.date().optional(),
    owner: z.coerce.string().optional(),
    endTime: z.coerce.date().optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "wedding",
      image: "",
      status: "active",
      description: "",
      userId: "",
      location: "",
      latitude: "",
      longitude: "",
      startTime: undefined,
      endTime: undefined,
      owner: "",
      bride: "",
      groom: "",
    },
  });

  // ✅ API helpers
  const createEvent = async (data: FormData) => {
    const res = await fetch("/api/admin/event", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(t("EventPage.message.createSuccess"));
    } else {
      toast.error(t("EventPage.error.createFailed"));
    }
    return res;
  };

  const updateEvent = async (id: string, data: FormData) => {
    const res = await fetch(`/api/admin/event/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(t("EventPage.message.updateSuccess"));
    } else {
      toast.error(t("EventPage.error.updateFailed"));
    }
    return res;
  };

  const getEditEvent = async (id: string) => {
    const res = await fetch(`/api/admin/event/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) return res.json();
    toast.error(t("EventPage.error.getFailed"));
  };

  useEffect(() => {
    setMounted(true);
    if (!id) return;
    const fetchEvent = async () => {
      setOverlayLoading(true);
      const data = await getEditEvent(id);
      if (data) form.reset(data);
      setOverlayLoading(false);
    };
    fetchEvent();
  }, [id, form, setOverlayLoading]);

  if (!mounted) return null;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    if (id) {
      const res = await updateEvent(id, data);
      if (res.ok) {
        const json = await res.json();
        router.push(`/event/edit/${json.id}`);
      }
    } else {
      const res = await createEvent(data);
      if (res.ok) {
        const json = await res.json();
        form.reset();
        router.push(`/event/edit/${json.id}`);
      }
    }
    setLoading(false);
  };
  return (
    <div className="p-6 border rounded-md bg-white mx-auto">
      <div>
        <h2 className="text-xl font-bold pb-2">
          {id ? t("EventPage.create.edit") : t("EventPage.create.title")}
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 mt-4 mb-8">
          <Label>{t("EventPage.create.coverImage")}</Label>
          <ImageUpload
            label={t("EventPage.create.imageSize")}
            folder="/event/cover"
            {...form.register("image")}
            value={form.watch("image") ?? undefined}
            type="event"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputTextField
            label={t("EventPage.create.name")}
            name="name"
            placeholder={t("EventPage.create.namePlaceholder")}
            form={form}
            disabled={loading}
          />

          <SelectField
            label={t("EventPage.create.type")}
            name="type"
            placeholder={t("EventPage.create.typePlaceholder")}
            disabled={id != null}
            className="w-full"
            options={[
              { label: t("EventPage.create.wedding"), value: "wedding" },
              {
                label: t("EventPage.create.housewarming"),
                value: "housewarming",
              },
              { label: t("EventPage.create.birthday"), value: "birthday" },
              {
                label: t("EventPage.create.anniversary"),
                value: "anniversary",
              },
            ]}
            form={form}
          />
          {form.getValues("type") != "wedding" && (
            <InputTextField
              label={t("EventPage.create.owner")}
              name="owner"
              placeholder={t("EventPage.create.ownerPlaceholder")}
              form={form}
              disabled={loading}
            />
          )}
          {form.getValues("type") === "wedding" && (
            <>
              <InputTextField
                label={t("EventPage.create.groom")}
                name="groom"
                placeholder={t("EventPage.create.groomPlaceholder")}
                form={form}
                disabled={loading}
              />
              <InputTextField
                label={t("EventPage.create.bride")}
                name="bride"
                placeholder={t("EventPage.create.bridePlaceholder")}
                form={form}
                disabled={loading}
              />
            </>
          )}

          <DatePickerField
            label={t("EventPage.create.startDate")}
            name="startTime"
            placeholder={t("EventPage.create.startDatePlaceholder")}
            form={form}
          />
          <DatePickerField
            label={t("EventPage.create.endDate")}
            name="endTime"
            placeholder={t("EventPage.create.endDatePlaceholder")}
            form={form}
          />

          <TextareaField
            label={t("EventPage.create.description")}
            name="description"
            placeholder={t("EventPage.create.descriptionPlaceholder")}
            form={form}
            disabled={loading}
          />
          <TextareaField
            label={t("EventPage.create.location")}
            name="location"
            placeholder={t("EventPage.create.locationPlaceholder")}
            form={form}
            disabled={loading}
          />

          <SwitchField
            label={t("EventPage.create.status")}
            name="status"
            trueValue="active"
            falseValue="inactive"
            form={form}
          />
        </div>
        <div className="pt-2 flex gap-2 items-center justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/event")}
          >
            {t("EventPage.create.cancel")}
          </Button>
          <SubmitButton loading={loading} entityId={id} />
        </div>
      </form>
    </div>
  );
}
