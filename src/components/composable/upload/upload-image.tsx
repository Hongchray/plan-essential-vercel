import React, { useState, useCallback, useEffect } from "react";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "react-i18next";
interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  defaultValue?: string;
  label?: string;
  maxSizeMB?: number;
  folder?: string;
  type?: string;
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      type,
      onChange,
      value,
      name,
      label = "Upload Image",
      defaultValue,
      maxSizeMB = 5,
      folder = "",
      ...props
    },
    ref
  ) => {
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation("common");
    // Set initial preview from either value or defaultValue
    useEffect(() => {
      if (value) {
        setPreview(value);
      } else if (defaultValue) {
        setPreview(defaultValue);
      }
    }, [value, defaultValue]);

    const handleUpload = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset states
        setError("");
        setUploading(true);

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          setError(`File size exceeds ${maxSizeMB}MB limit`);
          setUploading(false);
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        try {
          // Create FormData
          const formData = new FormData();
          formData.append("file", file);

          // Generate a unique file path prefix (you can customize this as needed)
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 10);
          const filePrefix = `/${timestamp}-${randomString}`;
          formData.append("filePrefix", filePrefix);
          formData.append("folder", folder);

          // Upload to DigitalOcean Spaces via your API route
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error || data.details || t("component.upload_image.error")
            );
          }

          // Create a synthetic event object for React Hook Form
          const syntheticEvent = {
            target: {
              name,
              value: data.url,
            },
          };

          // Call onChange with the synthetic event
          if (onChange) {
            onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
          }
        } catch (err: unknown) {
          // Handle error as an instance of Error
          if (err instanceof Error) {
            setError(err.message || t("component.upload_image.error"));
          } else {
            setError(t("component.upload_image.error"));
          }

          setPreview("");

          // Clear form value on error
          if (onChange) {
            onChange({
              target: {
                name,
                value: "",
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        } finally {
          setUploading(false);
        }
      },
      [onChange, name, maxSizeMB, folder]
    );

    // Clear image handler
    const handleClear = useCallback(() => {
      setPreview("");
      setError("");

      // Clear form value
      if (onChange) {
        onChange({
          target: {
            name,
            value: "",
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }, [onChange, name]);
    const isEvent = type === "event";
    return (
      <div
        className={`flex flex-col items-start gap-4 ${
          isEvent ? "w-full md:w-[376px] h-[159px]" : "w-[180px]"
        }`}
      >
        {/* Preview Area */}
        <div className="w-full h-[150px] aspect-video relative flex items-center justify-center border-2 border-dashed rounded-lg overflow-hidden bg-gray-50">
          {preview ? (
            <Image
              src={preview} // ensure src is not empty
              alt="Preview"
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <ImageIcon className="h-6 w-6 text-gray-400" />
              <span className="text-gray-500 text-xs">{label}</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-4 md:w-full">
          <Button
            variant="outline"
            className="relative w-full"
            disabled={uploading}
            type="button"
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleUpload}
              accept="image/*"
              disabled={uploading}
              name={name}
              ref={ref}
              {...props}
            />
            <Upload className="h-4 w-4 mr-2" />
            {uploading
              ? t("component.upload_image.uploading")
              : t("component.upload_image.upload")}
          </Button>
          <Button
            size="icon"
            className="px-4"
            variant="destructive"
            onClick={handleClear}
            disabled={!preview || uploading}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
