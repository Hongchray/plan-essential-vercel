"use client";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../composable/button/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect, useState } from "react";
import { InputTextField } from "../composable/input/input-text-field";
import { Button } from "../ui/button";
import { CodeEditor } from "../composable/input/input-code-editor";
import { SwitchField } from "../composable/input/switch";
import { SelectField } from "../composable/select/select-option";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/LoadingContext";
import ImageUpload from "../composable/upload/upload-image";
import { useTranslation } from "next-i18next";

export function CreateEditForm({ id }: { id?: string }) {
  const { setOverlayLoading } = useLoading();
  const { t, ready } = useTranslation("common");
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // All hooks must be called before any conditional returns
  // ✅ schema uses translations with fallback
  const formSchema = z.object({
    name: z
      .string()
      .min(
        3,
        ready
          ? t("template.validation.nameMin")
          : "Name must be at least 3 characters"
      )
      .max(
        50,
        ready
          ? t("template.validation.nameMax")
          : "Name must be less than 50 characters"
      ),
    type: z
      .string()
      .min(
        1,
        ready ? t("template.validation.typeRequired") : "Type is required"
      ),
    image: z.string(),
    defaultConfig: z.any(),
    status: z.string(),
    unique_name: z
      .string()
      .min(
        1,
        ready
          ? t("template.validation.uniqueNameRequired")
          : "Unique name is required"
      ),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      image: "",
      defaultConfig: "",
      status: "",
      unique_name: "",
    },
  });

  // Ensure component only renders on client after translations are ready
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;
      setOverlayLoading(true);

      const res = await getEditTemplate(id);
      if (res) {
        form.reset(res);
        setOverlayLoading(false);
      }
    };
    fetchTemplate();
  }, [id, form, t, setOverlayLoading]);

  // Don't render until we're on the client and translations are ready
  if (!isClient || !ready) {
    return (
      <div className="p-6 border rounded-md bg-white mx-auto max-w-5xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  async function createTemplate(data: FormData) {
    const res = await fetch("/api/admin/template", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(t("template.createSuccess"));
    } else {
      toast.error(t("template.createError"));
    }
    return res;
  }
  async function updateTemplate(id: string, data: FormData) {
    const res = await fetch(`/api/admin/template/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(t("template.updateSuccess"));
    } else {
      toast.error(t("template.updateError"));
    }
    return res;
  }
  async function getEditTemplate(id: string) {
    const res = await fetch(`/api/admin/template/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      return res.json();
    } else {
      toast.error(t("template.getError"));
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    if (typeof data.defaultConfig === "string") {
      data.defaultConfig = JSON.parse(data.defaultConfig);
    }
    if (id) {
      const response = await updateTemplate(id, data);
      if (response.ok) {
        const json = await response.json();
        router.push(`/template/edit/${json?.id}`);
      }
    } else {
      const response = await createTemplate(data);
      if (response.ok) {
        const json = await response.json();
        form.reset();
        toast.success(t("template.createSuccess"));
        router.push(`/template/edit/${json?.id}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-6 border rounded-md bg-white mx-auto max-w-5xl">
      <div>
        <h2 className="text-xl font-bold pb-2">
          {id ? t("template.editTitle") : t("template.createTitle")}
        </h2>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="py-2">
          <ImageUpload
            label={t("template.coverImage")}
            folder="/template/cover"
            {...form.register("image")}
            value={form.watch("image")}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputTextField
            label={t("template.name")}
            name="name"
            placeholder={t("template.namePlaceholder")}
            form={form}
            disabled={loading}
          />
          <InputTextField
            label={t("template.uniqueName")}
            name="unique_name"
            placeholder={t("template.uniqueNamePlaceholder")}
            form={form}
            disabled={loading}
          />
          <SelectField
            label={t("template.chooseType")}
            name="type"
            placeholder={t("template.chooseTypePlaceholder")}
            options={[
              { label: t("template.type.wedding"), value: "wedding" },
              { label: t("template.type.housewarming"), value: "housewarming" },
              { label: t("template.type.birthday"), value: "birthday" },
              { label: t("template.type.anniversary"), value: "anniversary" },
            ]}
            form={form}
          />
          <SwitchField
            label={t("template.status")}
            name="status"
            trueValue="active"
            falseValue="inactive"
            form={form}
          />
        </div>
        <div className="py-5">
          <CodeEditor
            language="json"
            label={t("template.defaultConfig")}
            value={JSON.stringify(
              form.getValues().defaultConfig || {},
              null,
              2
            )}
            onChange={(value) => {
              form.setValue("defaultConfig", JSON.parse(value || ""));
            }}
          />
        </div>
        <div className="pt-2 flex gap-2 items-center justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/template")}
          >
            {t("template.cancel")}
          </Button>
          <SubmitButton loading={loading} entityId={id} />
        </div>
      </form>
    </div>
  );
}
