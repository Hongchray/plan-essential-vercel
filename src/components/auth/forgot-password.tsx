"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR mismatch
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "forgot" }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(t(data.message)); // ✅ success key
        router.push(`/forgot-password/verify-otp?phone=${phone}`);
      } else {
        toast.error(t(data.error || "forgot_password.error_generic")); // ✅ error key
      }
    } catch {
      toast.error(t("forgot_password.error_generic"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center  p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
          {t("forgot_password.forgot_password_title")}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          {t("forgot_password.forgot_password_description")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">{t("forgot_password.phone_label")}</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("forgot_password.phone_placeholder")}
              className="rounded-md"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin h-5 w-5" />}
            {loading
              ? t("forgot_password.sending_button")
              : t("forgot_password.send_verification_button")}
          </Button>
        </form>
      </div>
    </div>
  );
}
