import React, { useEffect, useState } from "react";
import { Upload, X, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AudioUploadProps {
  label: string;
  folder: string;
  onChange: (event: { target: { value: string } }) => void;
  value: string;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export default function AudioUpload({
  label,
  folder,
  onChange,
  value,
  acceptedFormats = [".mp3", ".wav", ".ogg", ".m4a"],
  maxSizeMB = 20,
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);
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
      const audioUrl = data.url || data.path;

      setPreviewUrl(audioUrl);
      onChange({ target: { value: audioUrl } });
    } catch (err) {
      setError("Failed to upload audio. Please try again.");
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
        <label className="cursor-pointer ">
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
          placeholder="Or paste audio URL"
          value={previewUrl}
          onChange={handleUrlChange}
          className="w-full"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Audio Preview */}
      {previewUrl && (
        <div className="relative border rounded-lg overflow-hidden bg-gray-50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Music className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 flex-1 truncate">
              {label}
            </span>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <audio src={previewUrl} controls className="w-full">
            Your browser does not support the audio tag.
          </audio>
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
