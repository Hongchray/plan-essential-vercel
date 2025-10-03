import Preview from "@/components/template/preview";
export default async function PreviewTemplate({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="">
      <Preview slug={slug} />
    </div>
  );
}
