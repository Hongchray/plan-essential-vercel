"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { MessageAlert } from "../composable/message-alert";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9]{8,15}$/, "Please enter a valid phone number"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<SignUpFormData> & { message?: string }
  >({});

  const validateForm = (): boolean => {
    try {
      signUpSchema.parse({ phone });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<SignUpFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      // API request to send OTP
      const response = await fetch("/api/auth/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      toast.success("OTP sent successfully!");
      router.push(`/admin/signup/verify-otp?phone=${phone}`);

      // TODO: Navigate to OTP verification step
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        setErrors({ message: error.message });
      } else {
        toast.error("An unexpected error occurred");
        setErrors({ message: "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Image
            src="https://focuzsolution.com/logo.png"
            alt="logo"
            width={150}
            height={50}
            className="py-2"
          />
          <CardTitle className="text-xl">Register Account</CardTitle>
          <CardDescription>
            Secure and easy access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {errors.message && (
              <div className="py-2">
                <MessageAlert
                  variant="destructive"
                  className="bg-red-50 border-red-200 p-3"
                  description={errors.message}
                />
              </div>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? "Sending OTP..." : "Sign Up"}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>

              <Button variant="outline" className="w-full" type="button">
                <Image
                  src="/telegram-icon-free-png.webp"
                  alt="telegram"
                  width={20}
                  height={20}
                  className="py-2"
                />
                Continue with Telegram
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/admin/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center py-2">
        <span className="text-muted-foreground text-sm text-center">
          Version 1.0.0
        </span>
      </div>
    </div>
  );
}
