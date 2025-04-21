// components/ImageUpload.tsx
"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_upload_preset");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      onChange(data.secure_url);
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group">
          <div className="relative h-64 w-full rounded-md overflow-hidden">
            <Image
              src={value}
              alt="Property image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onChange("")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors h-64"
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <ImagePlus className="h-10 w-10 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                Drag & drop an image here, or click to select
              </p>
              <Button type="button" variant="outline" className="mt-4">
                Select Image
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}