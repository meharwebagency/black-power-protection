"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ImageUploadProps {
  images: File[];
  previews: string[];
  onImagesChange: React.Dispatch<React.SetStateAction<File[]>>;
  onPreviewsChange: React.Dispatch<React.SetStateAction<string[]>>;
  maxImages?: number;
  locale: "ar" | "en";
}

export function ImageUpload({
  images,
  previews,
  onImagesChange,
  onPreviewsChange,
  maxImages = 20,
  locale,
}: ImageUploadProps) {
  const isArabic = locale === "ar";
  const remaining = maxImages - images.length;

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const remaining = maxImages - images.length;
      const newFiles = acceptedFiles.slice(0, remaining);

      onImagesChange([...images, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          onPreviewsChange((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    },
    [images, maxImages, onImagesChange, onPreviewsChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".webp", ".avif", ".jpeg", ".jpg", ".png"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: remaining,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onImagesChange(newImages);
    onPreviewsChange(newPreviews);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {remaining > 0 && (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <Upload
            className={cn(
              "mb-3 h-10 w-10",
              isDragActive ? "text-primary" : "text-muted-foreground"
            )}
          />
          <p className="text-sm font-medium text-foreground">
            {isArabic
              ? "اسحب وأفلت الصور هنا أو انقر للتحميل"
              : "Drag & drop images here or click to upload"}
          </p>
          <p className="mt-1 text-body-xs text-muted-foreground">
            {isArabic
              ? `بحد أقصى ${maxImages} صورة، كل صورة 5MB`
              : `Max ${maxImages} images, 5MB each`}
          </p>
        </div>
      )}

      {/* Image previews */}
      <AnimatePresence mode="popLayout">
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {previews.map((preview, index) => (
              <motion.div
                key={preview}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40">
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="gold" size="sm">
                        <Star className="h-3 w-3" />
                        {isArabic ? "رئيسية" : "Primary"}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Image count */}
      {images.length > 0 && (
        <p className="text-body-xs text-muted-foreground">
          {isArabic
            ? `${images.length} من ${maxImages} صورة`
            : `${images.length} of ${maxImages} images`}
        </p>
      )}
    </div>
  );
}
