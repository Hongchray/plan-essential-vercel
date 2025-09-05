"use client";

import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Image
        src="/laoding-heart.gif" // place your gif inside /public
        alt="Loading..."
        width={80}
        height={80}
        unoptimized // important for gifs
        priority
      />
    </div>
  );
}
