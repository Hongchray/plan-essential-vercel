"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function VerifyOtp() {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(120);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR mismatch

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const otp_code = otp.join("");
    if (!otp_code || !phone) {
      toast.error(t("forgot_password.toast_required"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp_code }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || t("forgot_password.toast_failed") };
      }

      if (!res.ok)
        throw new Error(data.error || t("forgot_password.toast_failed"));

      toast.success(t("forgot_password.toast_verified"));
      router.push(`/forgot-password/set-password?phone=${phone}`);
    } catch (err: any) {
      toast.error(err.message || t("forgot_password.toast_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "register" }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || t("forgot_password.toast_resend_failed"));

      toast.success(t("forgot_password.toast_resend_success"));
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
      setCountdown(120);
    } catch (err: any) {
      toast.error(err.message || t("forgot_password.toast_resend_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus next box if value entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // go back if current is empty
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // focus first empty
    const firstEmpty = newOtp.findIndex((d) => d === "");
    inputRefs.current[firstEmpty === -1 ? 5 : firstEmpty]?.focus();
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="flex gap-2 items-center">
        <Image
          src="https://planessential.com/logo.png"
          placeholder="blur"
          blurDataURL="https://planessential.com/logo.png"
          priority
          alt={t("login.logo_alt")}
          height={50}
          width={50}
          className="py-2"
        />
        <h3 className="text-2xl font-bold text-rose-700">plan essential</h3>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {t("forgot_password.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("forgot_password.subtitle", { phone })}
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-primary"
            placeholder={t("forgot_password.placeholder_digit")}
          />
        ))}
      </div>

      <Button
        onClick={handleVerify}
        disabled={isLoading || !isOtpComplete}
        className="w-full"
        size="lg"
      >
        {isLoading
          ? t("forgot_password.button_verifying")
          : t("forgot_password.button_verify")}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          {t("forgot_password.resend_text")}{" "}
          <button
            onClick={handleResend}
            disabled={isLoading || countdown > 0}
            className={`text-primary hover:underline bg-transparent p-0 m-0 border-0 cursor-pointer ${
              isLoading || countdown > 0 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isLoading
              ? t("forgot_password.resend_sending")
              : countdown > 0
              ? t("forgot_password.resend_wait", { seconds: countdown })
              : t("forgot_password.resend_action")}
          </button>
        </p>
      </div>
    </div>
  );
}
