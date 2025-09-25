"use client";

import { Suspense } from "react";
import VerifyOtp from "@/components/auth/verify-otp";
import { Loading } from "@/components/composable/loading/loading";
export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Suspense fallback={<Loading variant="circle" size="lg" />}>
        <VerifyOtp />
      </Suspense>
    </div>
  );
}
