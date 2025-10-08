"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Simple VisuallyHidden wrapper using Tailwind
function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

interface PhotoGalleryProps {
  photos: string[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === "ArrowLeft") navigatePrevious();
      else if (e.key === "ArrowRight") navigateNext();
      else if (e.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentIndex]);

  const navigateNext = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(photos[nextIndex]);
  };

  const navigatePrevious = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(photos[prevIndex]);
  };

  const openImage = (photo: string, index: number) => {
    setSelectedImage(photo);
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-2 px-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`animate-fade-in-up animation-delay-${
              300 + index * 200
            }`}
          >
            <Image
              src={photo || "/placeholder.svg"}
              alt={`Photo ${index + 1}`}
              width={200}
              height={150}
              onClick={() => openImage(photo, index)}
              className="aspect-[9/16] object-cover object-center cursor-pointer hover:scale-110 hover:rotate-2 transition-all duration-300 rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 bg-white/70 backdrop-blur-md border-none shadow-2xl">
          {/* DialogTitle for accessibility */}
          <DialogTitle>
            <VisuallyHidden>Image Preview</VisuallyHidden>
          </DialogTitle>

          <DialogHeader className="p-0">
            {/* Close button */}
            <DialogClose className="absolute top-4 right-2 z-50 bg-white hover:bg-white rounded-full p-2 transition-all duration-200 hover:scale-110 shadow-lg">
              <X className="h-5 w-5 text-gray-800" />
            </DialogClose>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 bg-white/90 rounded-full px-4 py-2 shadow-lg">
              <span className="text-sm font-medium text-gray-800">
                {currentIndex + 1} / {photos.length}
              </span>
            </div>
          </DialogHeader>

          {selectedImage && (
            <div className="relative w-full h-[85vh] flex items-center justify-center p-4 md:p-8">
              {/* Previous button */}
              {photos.length > 1 && (
                <button
                  onClick={navigatePrevious}
                  className="absolute left-2 md:left-4 z-50 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg group"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800 group-hover:text-black" />
                </button>
              )}

              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt={`Preview ${currentIndex + 1}`}
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>

              {/* Next button */}
              {photos.length > 1 && (
                <button
                  onClick={navigateNext}
                  className="absolute right-2 md:right-4 z-50 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg group"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800 group-hover:text-black" />
                </button>
              )}
            </div>
          )}

          {/* Keyboard hint */}
          {/* <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white/90 rounded-full px-4 py-2 shadow-lg">
              <span className="text-xs text-gray-600">
                Use ← → arrow keys to navigate
              </span>
            </div>
          </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
