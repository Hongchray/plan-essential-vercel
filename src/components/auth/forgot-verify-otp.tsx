"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
export default function VerifyOtp() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(120);

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

    if (!otp) return;
    console.log("OTP array:", otp);

    const otp_code = otp.join(""); // convert ["1","2","3","4","5","6"] => "123456"
    console.log("OTP code:", otp_code, "Phone:", phone);

    if (!otp_code || !phone) {
      toast.error("Phone and OTP are required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp_code }),
      });

      // Read response as text first
      const text = await res.text();

      // Try parsing JSON safely
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || "Unknown error" };
      }

      if (!res.ok) throw new Error(data.error || "Verification failed");

      toast.success("Phone verified successfully!");
      router.push(`/admin/forgot-password/set-password?phone=${phone}`);
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
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
      if (!res.ok) throw new Error(data.error || "Failed to resend OTP");

      toast.success("A new OTP has been sent to your phone.");
      setOtp(new Array(6).fill("")); // reset input fields
      inputRefs.current[0]?.focus();
      setCountdown(120); // reset countdown after resend
    } catch (err: any) {
      toast.error(err.message || "Could not resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="p-6 max-w-md mx-auto">
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to {phone}
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
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
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={isLoading || countdown > 0}
            className={`text-primary hover:underline bg-transparent p-0 m-0 border-0 cursor-pointer ${
              isLoading || countdown > 0 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isLoading
              ? "Sending..."
              : countdown > 0
              ? `Resend OTP in ${countdown}s`
              : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
}
