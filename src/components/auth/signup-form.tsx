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
import { useTranslation } from "react-i18next";
import TelegramLoginButton from "@/components/telegram-login-button";
import { useEffect } from "react";
type SignUpFormData = {
  phone: string;
};

export function SignUpForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  const [errors, setErrors] = useState<
    Partial<SignUpFormData> & { message?: string }
  >({});

  const signUpSchema = z.object({
    phone: z
      .string()
      .min(1, { message: t("signup.error_phone_required") })
      .regex(/^\d{8,15}$/, { message: t("signup.error_invalid_phone") }),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
      const response = await fetch("/api/auth/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "register" }),
      });
      const data = await response.json();
      if (!response.ok) {
        // Handle dynamic OTP already sent error
        if (data.error.includes("signup.error_otp_already_sent")) {
          throw new Error(
            t("signup.error_otp_already_sent", {
              seconds: data.error.split("_").pop(),
            })
          );
        }
        throw new Error(t(data.error || "signup.error_failed_to_send_otp"));
      }
      toast.success(t(data.message || "signup.success_otp_sent"));
      router.push(`/signup/verify-otp?phone=${phone}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(t(error.message || "signup.error_server"));
        setErrors({ message: error.message });
      } else {
        toast.error(t("signup.error_server"));
        setErrors({ message: t("signup.error_server") });
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
          <CardTitle className="text-xl">
            {t("signup.register_account")}
          </CardTitle>
          <CardDescription>{t("signup.register_description")}</CardDescription>
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
                <Label htmlFor="phone">{t("signup.phone")}</Label>
                <Input
                  id="phone"
                  placeholder={t("signup.enter_phone")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />{" "}
                    {t("signup.sending_otp")}
                  </>
                ) : (
                  t("signup.sign_up")
                )}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  {t("signup.or")}
                </span>
              </div>

              <TelegramLoginButton />
            </div>

            <div className="mt-4 text-center text-sm">
              {t("signup.already_have_account")}{" "}
              <Link href="/login" className="underline underline-offset-4">
                {t("signup.login")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center py-2">
        <span className="text-muted-foreground text-sm text-center">
          {t("signup.version")} {process.env.NEXT_PUBLIC_APP_VERSION}
        </span>
      </div>
    </div>
  );
}
