// src/app/(dashboard)/user/page.tsx
import { Suspense } from "react";
import UserClientPage from "./components/user-client-page";
import { Loading } from "@/components/composable/loading/loading";

export default function UserPage() {
  return (
    <Suspense fallback={<Loading variant="circle" size="lg" />}>
      <UserClientPage />
    </Suspense>
  );
}
