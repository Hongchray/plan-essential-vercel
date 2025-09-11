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

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  type: z.string().min(1, "Type is required"),
  owner: z.coerce.string().optional(),
  bride: z.string().min(1, "Bride is required"),
  groom: z.string().min(1, "Groom is required"),
  image: z.string(),
  status: z.string(),
  description: z.string(),
  userId: z.string(),
  location: z.string(),
  latitude: z.coerce.string().optional(),
  longitude: z.coerce.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

// ✅ Helper functions now take `t` as argument
async function createEvent(data: FormData, t: any) {
  const res = await fetch("/api/admin/event", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    toast.success(t("EventPage.message.createSuccess"));
  } else {
    toast.error(t("EventPage.message.createError"));
  }
  return res;
}

async function updateEvent(id: string, data: FormData, t: any) {
  const res = await fetch(`/api/admin/event/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    toast.success(t("EventPage.message.updateSuccess"));
  } else {
    toast.error(t("EventPage.message.updateError"));
  }
  return res;
}

async function getEditEvent(id: string, t: any) {
  const res = await fetch(`/api/admin/event/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return res.json();
  } else {
    toast.error(t("EventPage.message.getError"));
  }
}

export function CreateEditForm({ id }: { id?: string }) {
  const { setOverlayLoading } = useLoading();
  const router = useRouter();
  const { t } = useTranslation("common"); // ✅ use hook inside component

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "wedding",
      image: "",
      status: "",
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

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;
      setOverlayLoading(true);

      const res = await getEditEvent(id, t); // ✅ pass t
      if (res) {
        form.reset(res);
        setOverlayLoading(false);
      }
    };
    fetchTemplate();
  }, [id, form, setOverlayLoading, t]);

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    if (id) {
      const response = await updateEvent(id, data, t); // ✅ pass t
      if (response.ok) {
        const json = await response.json();
        router.push(`/event/edit/${json?.id}`);
      }
    } else {
      const response = await createEvent(data, t); // ✅ pass t
      if (response.ok) {
        const json = await response.json();
        form.reset();
        router.push(`/event/edit/${json?.id}`);
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
      {/* {form.formState.errors && (
        <div className="text-red-500 text-sm">
          {Object.entries(form.formState.errors).map(([fieldName, error]) => (
            <div key={fieldName}>
              <strong>{fieldName}:</strong> {error?.message?.toString()}
            </div>
          ))}
        </div>
      )} */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <ImageUpload
            label={t("EventPage.create.coverImage")}
            folder="/event/cover"
            {...form.register("image")}
            value={form.watch("image")}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputTextField
            label={t("EventPage.create.name")}
            name="name"
            placeholder={t("EventPage.create.namePlaceholder")}
            form={form}
            disabled={loading}
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
          <SelectField
            label={t("EventPage.create.type")}
            name="type"
            placeholder={t("EventPage.create.typePlaceholder")}
            disabled={id != null}
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
