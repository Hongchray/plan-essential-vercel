"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

// Simple visually hidden wrapper for accessibility
function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

interface SingleImagePreviewProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function SingleImagePreview({
  src,
  alt = "Preview Image",
  width = 500,
  height = 450,
}: SingleImagePreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="animate-zoom-in animation-delay-300 cursor-pointer">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="hover:scale-105 transition-transform duration-300 rounded-lg"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* Dialog for image preview */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-3xl p-0 bg-white/70 backdrop-blur-md border-none shadow-2xl">
          <DialogTitle>
            <VisuallyHidden>{alt}</VisuallyHidden>
          </DialogTitle>

          {/* Close button */}
          <DialogClose
            className="absolute top-4 right-2 z-50 bg-white hover:bg-white rounded-full p-2 transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-800" />
          </DialogClose>

          {/* Image */}
          <div className="relative w-full h-[85vh] flex items-center justify-center p-4 md:p-8">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
