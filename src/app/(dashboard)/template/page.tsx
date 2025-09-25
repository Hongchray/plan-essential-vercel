// src/app/(dashboard)/template/page.tsx
import { Suspense } from "react";
import TemplateClientPage from "./components/template-client-page";
import { Loading } from "@/components/composable/loading/loading"; // optional spinner

export default function TemplatePage() {
  return (
    <Suspense fallback={<Loading variant="circle" />}>
      <TemplateClientPage />
    </Suspense>
  );
}
