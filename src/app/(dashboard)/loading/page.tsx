import { Loading } from "@/components/composable/loading/loading";

export default async function EventPage() {
  return (
    <div className="h-full flex-1 flex-col gap-4 p-4">
      <Loading variant="circle" size="lg" />
    </div>
  );
}
