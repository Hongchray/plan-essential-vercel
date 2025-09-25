import Preview from "@/components/template/preview";
export default async function PreviewTemplate({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>;
}) {
  const { id, eventId } = await params;

  return (
    <div className="">
      <Preview templateId={id} eventId={eventId} />
    </div>
  );
}
