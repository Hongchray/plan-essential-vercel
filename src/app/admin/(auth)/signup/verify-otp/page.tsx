// src/app/admin/(auth)/signup/verify-otp/page.tsx
"use client";

import { Suspense } from "react";
import VerifyOtp from "@/components/auth/verify-otp";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtp />
      </Suspense>
    </div>
  );
}
