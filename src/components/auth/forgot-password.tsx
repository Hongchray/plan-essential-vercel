"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        toast.success("OTP code sent to your phone number.");
        router.push(`/forgot-password/verify-otp?phone=${phone}`);
      } else {
        toast.error(data.error || "Failed to send OTP.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          Forgot Password
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your phone number to receive a verification code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0123456789"
              className="rounded-md"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin h-5 w-5" />}
            {loading ? "Sending..." : "Send Verification Code"}
          </Button>
        </form>
      </div>
    </div>
  );
}
