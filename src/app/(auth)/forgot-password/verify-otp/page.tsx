import VerifyOtp from "@/components/auth/forgot-verify-otp";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtp />
      </Suspense>
    </div>
  );
}
