"use client";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../composable/button/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect, useState } from "react";
import { InputTextField } from "../composable/input/input-text-field";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/LoadingContext";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  price: z.string().min(1, "Price is required"),
});

type FormData = z.infer<typeof formSchema>;

async function createPlan(data: FormData) {
  const res = await fetch("/api/admin/plan", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    toast.success("Create Plan successfully");
  } else {
    toast.error("Error create plan");
  }
  return res;
}
async function updatePlan(id: string, data: FormData) {
  const res = await fetch(`/api/admin/plan/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    toast.success("Update Plan successfully");
  } else {
    toast.error("Error update plan");
  }
  return res;
}
async function getEditPlan(id: string) {
  const res = await fetch(`/api/admin/plan/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return res.json();
  } else {
    toast.error("Error get plan");
  }
}

export function CreateEditForm({ id }: { id?: string }) {
  const { setOverlayLoading } = useLoading();
  const { t } = useTranslation("common");

  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  });
  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
      setOverlayLoading(true);

      const res = await getEditPlan(id);
      if (res) {
        form.reset(res);
        setOverlayLoading(false);
      }
    };
    fetchPlan();
  }, [id, form]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    if (id) {
      const response = await updatePlan(id, data);
      if (response.ok) {
        const json = await response.json();
        router.push(`/plan/edit/${json?.id}`);
      }
    } else {
      const response = await createPlan(data);
      if (response.ok) {
        const json = await response.json();
        form.reset();
        toast.success("Create Plan successfully");
        router.push(`/plan/edit/${json?.id}`);
      }
    }
    setLoading(false);
  };
  return (
    <div className="p-6 border rounded-md  bg-white  mx-auto max-w-5xl">
      <div>
        <h2 className="text-xl font-bold pb-2">
          {id ? "Edit" : "Create"} Plan
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
            label="Price"
            name="price"
            placeholder="Enter price"
            form={form}
            disabled={loading}
          />
        </div>
        <div className="pt-2 flex gap-2 items-center justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/plan")}
          >
            <X/>
            Cancel
          </Button>
          <SubmitButton loading={loading} entityId={id} />
        </div>
      </form>
    </div>
  );
}
