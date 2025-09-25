import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";
import { Loading } from "@/components/composable/loading/loading";
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-accent">
      <div className="w-full max-w-sm">
        <Suspense fallback={<Loading variant="circle" size="lg" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
