import  Preview  from "@/components/template/preview";
import { toast } from "sonner";



export default async function PreviewTemplate({params,}: {params: Promise<{ id: string }>}) {
  const { id } = await params;

  return (
    <div className="p-5">
      <Preview id={id} />
    </div>
  );
}