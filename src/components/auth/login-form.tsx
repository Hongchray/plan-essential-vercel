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
import { signIn } from "next-auth/react";
import { PasswordInput } from "@/components/composable/password-field";
import TelegramLoginButton from "@/components/telegram-login-button"; // Import the new component

// Define validation schema
const loginSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<LoginFormData> & { message?: string }
  >({});

  const validateForm = (): boolean => {
    try {
      loginSchema.parse({ phone, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        phone,
        password,
      });

      if (result?.error) {
        toast.error(result.error);
        setErrors({ message: result.error });
      } else {
        toast.success("Authentication successful");
        router.push("/dashboard");
      }
    } catch {
      toast.error("An unexpected error occurred");
      setErrors({ message: "An unexpected error occurred" });
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
            placeholder="blur"
            blurDataURL="https://focuzsolution.com/logo.png"
            priority
            alt="logo"
            width={150}
            height={50}
            className="py-2"
          />
          <CardTitle className="text-xl">Login Account</CardTitle>
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
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              <div className="grid gap-2">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />
                <div className="flex items-center">
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
              {/* Replace the old button with the new TelegramLoginButton component */}
              <TelegramLoginButton />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center py-2">
        <span className="text-muted-foreground text-sm text-center ">
          Version 1.0.0
        </span>
      </div>
    </div>
  );
}
