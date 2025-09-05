"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Card, CardHeader } from "../ui/card";

export default function VerifyOtp() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState<number>(120);
  const { t } = useTranslation("common");

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

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
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
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const otp_code = otp.join("");
    if (!otp_code || !phone) {
      toast.error(t("error_phone_otp_required"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp_code }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Translate the API's error key
        throw new Error(t(data.error || "otp_verification.error_server"));
      }

      toast.success(
        t(data.message || "otp_verification.success_phone_verified")
      );
      router.push(`/signup/set-password?phone=${phone}`);
    } catch (err: any) {
      toast.error(t(err.message || "otp_verification.error_server"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone) {
      toast.error(t("otp_verification.error_phone_required"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "register" }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || t("otp_verification.error_resend_otp_failed")
        );

      toast.success(t("otp_verification.success_otp_resent"));
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
      setCountdown(120);
    } catch (err: any) {
      toast.error(err.message || t("otp_verification.error_resend_otp_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <Card>
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
            {t("otp_verification.verify_otp")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("otp_verification.otp_sent_to")} {phone}
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit: string, index: number) => (
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
              placeholder="0"
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
            ? t("otp_verification.verifying")
            : t("otp_verification.verify_otp")}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {t("otp_verification.didnt_receive_code")}{" "}
            <button
              onClick={handleResend}
              disabled={isLoading || countdown > 0}
              className={`text-primary hover:underline bg-transparent p-0 m-0 border-0 cursor-pointer ${
                isLoading || countdown > 0
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              {isLoading
                ? t("sending")
                : countdown > 0
                ? t("otp_verification.resend_in", { seconds: countdown })
                : t("otp_verification.resend_otp")}
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
}
