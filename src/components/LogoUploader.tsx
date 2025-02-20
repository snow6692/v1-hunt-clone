"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface LogoUploaderProps {
  onChange: (url?: string) => void;
  endpoint: "productLogo" | "productImages";
}

export const LogoUploader = ({ onChange, endpoint }: LogoUploaderProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast(error.message, { position: "top-center" });
      }}
    />
  );
};
