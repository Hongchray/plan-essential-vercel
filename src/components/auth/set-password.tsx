"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { PasswordInput } from "@/components/composable/password-field";
import { signIn } from "next-auth/react";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
    name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<PasswordFormData> & { message?: string }
  >({});

  const validateForm = (): boolean => {
    try {
      passwordSchema.parse({
        password,
        confirm_password: confirmPassword,
        name,
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<PasswordFormData> = {};
        err.errors.forEach((e) => {
          if (e.path[0])
            fieldErrors[e.path[0] as keyof PasswordFormData] = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Phone is missing");
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          password,
          name: name || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Account created successfully!");

      // Automatically sign in the user after setting password
      const signInRes = await signIn("credentials", {
        redirect: true, // Let NextAuth handle the redirect
        phone,
        password,
        callbackUrl: "/admin/dashboard",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to set password");
      setErrors({ message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-center items-center pb-5">
        <Image
          src="https://focuzsolution.com/logo.png"
          placeholder="blur"
          blurDataURL="https://focuzsolution.com/logo.png"
          priority
          alt="logo"
          width={150}
          height={50}
          className="py-2"
        />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">Set Your Password</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message}</p>
        )}

        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </div>

        <div className="flex flex-col gap-1">
          <PasswordInput
            label="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // ✅ FIXED
            error={errors.confirm_password}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="mt-4 w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : "Set Password"}
        </Button>
      </form>
    </div>
  );
}
