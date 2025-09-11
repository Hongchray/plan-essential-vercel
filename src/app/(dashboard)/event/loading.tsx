import { Loading } from "@/components/composable/loading/loading";
export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Loading variant="circle" size="lg" />
    </div>
  );
}
