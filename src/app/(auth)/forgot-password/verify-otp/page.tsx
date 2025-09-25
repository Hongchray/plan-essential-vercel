import VerifyOtp from "@/components/auth/forgot-verify-otp";
import { Suspense } from "react";
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
