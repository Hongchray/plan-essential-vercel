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

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  type: z.string().min(1, "Type is required"),
  owner: z.string(),
  bride: z.string().min(1, "Bride is required"),
  groom: z.string().min(1, "Groom is required"),
  image: z.string(),
  status: z.string(),
  description: z.string(),
  userId: z.string(),
  location: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

async function createTemplate(data: FormData) {
  const res = await fetch("/api/admin/event", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    toast.success("Create Event successfully");
  } else {
    toast.error("Error create template");
  }
  return res;
}
async function updateTemplate(id: string, data: FormData) {
  const res = await fetch(`/api/admin/event/${id}`, {
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
  const res = await fetch(`/api/admin/event/${id}`, {
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
    if (id) {
      const response = await updateTemplate(id, data);
      if (response.ok) {
        const json = await response.json();
        router.push(`/event/edit/${json?.id}`);
      }
    } else {
      const response = await createTemplate(data);
      if (response.ok) {
        const json = await response.json();
        form.reset();
        toast.success("Create Event successfully");
        router.push(`/event/edit/${json?.id}`);
      }
    }
    setLoading(false);
  };
  return (
    <div className="p-6 border rounded-md  bg-white  mx-auto">
      <div>
        <h2 className="text-xl font-bold pb-2">
          {id ? "Edit" : "Create"} Event
        </h2>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <ImageUpload
            label="Cover Image (1920x1080)"
            folder="/event/cover"
            {...form.register("image")}
            value={form.watch("image")}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputTextField
            label="Name"
            name="name"
            placeholder="រៀបអាពាហ៍ពិពាហ៍ សុវណ្ណ.."
            form={form}
            disabled={loading}
          />
          {form.getValues("type") != "wedding" && (
            <InputTextField
              label="Owner"
              name="owner"
              placeholder="សុុវណ្ណ"
              form={form}
              disabled={loading}
            />
          )}
          {form.getValues("type") === "wedding" && (
            <>
              <InputTextField
                label="Groom"
                name="groom"
                placeholder="សុុវណ្ណ"
                form={form}
                disabled={loading}
              />
              <InputTextField
                label="Bride"
                name="bride"
                placeholder="បុប្ផា"
                form={form}
                disabled={loading}
              />
            </>
          )}
          <SelectField
            label="Choose Template Type"
            name="type"
            placeholder="Choose Template Type"
            disabled={id != null}
            options={[
              { label: "Wedding", value: "wedding" },
              { label: "Housewarming", value: "housewarming" },
              { label: "Birthday", value: "birthday" },
              { label: "Anniversary", value: "anniversary" },
            ]}
            form={form}
          />
          <TextareaField
            label="Description"
            name="description"
            placeholder="Enter description"
            form={form}
            disabled={loading}
          />
          <TextareaField
            label="Location"
            name="location"
            placeholder="Enter location"
            form={form}
            disabled={loading}
          />
          <DatePickerField
            label="Event Date"
            name="startTime"
            placeholder="Select event date"
            form={form}
          />
          <DatePickerField
            label="End Date"
            name="endTime"
            placeholder="Select event date"
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
        <div className="pt-2 flex gap-2 items-center justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/event")}
          >
            Cancel
          </Button>
          <SubmitButton loading={loading} entityId={id} />
        </div>
      </form>
    </div>
  );
}
