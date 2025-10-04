import React, { useState } from "react";
import { Upload, X, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VideoUploadProps {
  label: string;
  folder: string;
  onChange: (event: { target: { value: string } }) => void;
  value: string;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export default function VideoUpload({
  label,
  folder,
  onChange,
  value,
  acceptedFormats = [".mp4", ".webm", ".mov", ".avi"],
  maxSizeMB = 100,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [error, setError] = useState<string>("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!acceptedFormats.includes(fileExtension)) {
      setError(
        `Invalid file format. Accepted formats: ${acceptedFormats.join(", ")}`
      );
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Replace with your actual upload API endpoint
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const videoUrl = data.url || data.path;

      setPreviewUrl(videoUrl);
      onChange({ target: { value: videoUrl } });
    } catch (err) {
      setError("Failed to upload video. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onChange({ target: { value: "" } });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
    onChange({ target: { value: url } });
  };

  return (
    <div className="space-y-2">
      {/* File Upload Button */}
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {label}
                </>
              )}
            </span>
          </Button>
        </label>
      </div>

      {/* Or use URL input */}
      <div>
        <Input
          type="url"
          placeholder="Or paste video URL"
          value={previewUrl}
          onChange={handleUrlChange}
          className="w-full"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Video Preview */}
      {previewUrl && (
        <div className="relative border rounded-lg overflow-hidden bg-gray-50">
          <video
            src={previewUrl}
            controls
            className="w-full h-48 object-contain"
          >
            Your browser does not support the video tag.
          </video>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* File Info */}
      <p className="text-xs text-gray-500">
        Accepted formats: {acceptedFormats.join(", ")} | Max size: {maxSizeMB}
        MB
      </p>
    </div>
  );
}
