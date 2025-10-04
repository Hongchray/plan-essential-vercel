import { CreateEditForm } from "@/components/template/create-edit";
import { useLoading } from "@/hooks/LoadingContext";

export default async function CreateTemplate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-2">
      <CreateEditForm id={id} />
    </div>
  );
}
