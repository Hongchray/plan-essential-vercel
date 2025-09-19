import { CreateEditForm } from "@/components/plan/create-edit";

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
