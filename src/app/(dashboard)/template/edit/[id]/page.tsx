import { CreateEditForm } from "@/components/template/create-edit";
import { useLoading } from "@/contexts/LoadingContext";

export default async function CreateTemplate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-5">
      <CreateEditForm id={id} />
    </div>
  );
}
