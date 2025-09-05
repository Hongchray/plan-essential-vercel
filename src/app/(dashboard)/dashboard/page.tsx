import Dashboard from "@/components/dashboard/dashboard";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="w-full  bg-muted/30 p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
