import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Image
        src="/laoding-heart.gif" // put loading.gif inside /public
        alt="Loading..."
        width={300}
        height={300}
        unoptimized
        priority
      />
    </div>
  );
}
