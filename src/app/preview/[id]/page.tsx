import  Preview  from "@/components/template/preview";
export default async function PreviewTemplate({params,}: {params: Promise<{ id: string }>}) {
  const { id } = await params;

  return (
    <div className="">
      <Preview id={id} />
    </div>
  );
}