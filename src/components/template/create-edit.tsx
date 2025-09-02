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

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  type: z.string().min(1, "Type is required"),
  image: z.string(),
  defaultConfig: z.any(),
  status: z.string(),
  unique_name: z.string().min(1, "Unique name is required"),
});

type FormData = z.infer<typeof formSchema>;

async function createTemplate(data: FormData) {
  const res = await fetch("/api/admin/template", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    toast.success("Create Template successfully");
  } else {
    toast.error("Error create template");
  }
  return res;
}
async function updateTemplate(id: string, data: FormData) {
  const res = await fetch(`/api/admin/template/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    toast.success("Update Template successfully");
  } else {
    toast.error("Error update template");
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
    toast.error("Error get template");
  }
}

export function CreateEditForm({ id }: { id?: string }) {
  const { setOverlayLoading } = useLoading();
  const router = useRouter();
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
  }, [id, form]);
  const [loading, setLoading] = useState(false);

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
        toast.success("Create Template successfully");
        router.push(`/template/edit/${json?.id}`);
      }
    }
    setLoading(false);
  };
  return (
    <div className="p-6 border rounded-md  bg-white  mx-auto">
      <div>
        <h2 className="text-xl font-bold pb-2">
          {id ? "Edit" : "Create"} Template
        </h2>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2">
          <InputTextField
            label="Name"
            name="name"
            placeholder="Enter name"
            form={form}
            disabled={loading}
          />
          <InputTextField
            label="Unique Name"
            name="unique_name"
            placeholder="Enter unique name"
            form={form}
            disabled={loading}
          />
          <SelectField
            label="Choose Template Type"
            name="type"
            placeholder="Choose Template Type"
            options={[
              { label: "Wedding", value: "wedding" },
              { label: "Housewarming", value: "housewarming" },
              { label: "Birthday", value: "birthday" },
              { label: "Anniversary", value: "anniversary" },
            ]}
            form={form}
          />
          <SwitchField
            label="Status"
            name="status"
            trueValue="active"
            falseValue="inactive"
            form={form}
          />
        </div>
        <div className="py-5">
          <CodeEditor
            language="json"
            label="Default Config"
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
            variant="destructive"
            type="button"
            onClick={() => router.push("/template")}
          >
            Cancel
          </Button>
          <SubmitButton loading={loading} entityId={id} />
        </div>
      </form>
    </div>
  );
}
