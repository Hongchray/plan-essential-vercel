import SetPasswordPage from "@/components/auth/setup-new-password";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-accent">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <SetPasswordPage />
        </Suspense>
      </div>
    </div>
  );
}
