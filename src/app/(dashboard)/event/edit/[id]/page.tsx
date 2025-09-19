import { CreateEditForm } from "@/components/event/create-edit";

export default async function CreateTemplate({params,}: {params: Promise<{ id: string }>}) {
  const { id } = await params;

  return (
    <div className="p-2 md:p-5">
      <CreateEditForm id={id} />
    </div>
  );
}