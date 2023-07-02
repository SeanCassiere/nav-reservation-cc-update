import React, { memo, useCallback, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";

import { Button as UIButton } from "@/components/ui/button";
import { AppNavMode } from "@/hooks/logic/useAppNavContext";
import { cn } from "@/utils";

interface Props {
  dragDisplayText: string;
  selectButtonText: string;
  clearButtonText: string;
  onSelectFile?: (file: File) => void;
  onClearFile?: () => void;
  acceptOnly?: Accept;
  initialPreview?: { fileName: string; url: string } | null | undefined;
  navMode: AppNavMode;
}

const ImageDropzoneWithPreview: React.FC<Props> = ({
  dragDisplayText,
  clearButtonText,
  selectButtonText,
  onSelectFile,
  onClearFile,
  acceptOnly = undefined,
  initialPreview = null,
  navMode,
}) => {
  const [previewImage, setPreviewImage] = useState<{ fileName: string; url: string } | null>(initialPreview);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setPreviewImage({ fileName: file.name, url: objectUrl });

      if (onSelectFile) {
        // callBack to lift file to parent state
        onSelectFile(file);
      }
    },
    [onSelectFile]
  );

  const handleClearImage = useCallback(() => {
    if (previewImage) {
      setPreviewImage(null);
      if (navMode === "navigate") {
        URL.revokeObjectURL(previewImage?.url);
      }
    }
    if (onClearFile) onClearFile();
  }, [navMode, onClearFile, previewImage]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    accept: acceptOnly,
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    onDrop,
  });

  return (
    <React.Fragment>
      <div
        {...getRootProps({
          className: cn(
            "flex flex-1 flex-col items-center justify-center p-6 border-2 border-dashed border-primary-foreground rounded outline-none bg-muted-foreground/10 text-primary/75",
            isDragActive ? "border-accent" : undefined,
            isDragAccept ? "border-success" : undefined,
            isDragReject ? "border-destructive" : undefined
          ),
          style: {
            transition: "border .24s ease-in-out",
          },
        })}
      >
        <input {...getInputProps()} />
        {previewImage ? (
          <figure className="flex w-full flex-col items-center">
            <img
              alt={previewImage.fileName}
              src={previewImage.url}
              className="object-contain"
              style={{ height: "130px" }}
            />
            <figcaption className="mt-1 text-xs">{previewImage.fileName}</figcaption>
          </figure>
        ) : (
          <p className="text-sm">{dragDisplayText}</p>
        )}
      </div>
      <div className="mt-2 px-4">
        {previewImage ? (
          <UIButton type="button" variant="secondary" size="sm" className="w-full" onClick={handleClearImage}>
            {clearButtonText}
          </UIButton>
        ) : (
          <UIButton type="button" variant="secondary" size="sm" className="w-full" onClick={open}>
            {selectButtonText}
          </UIButton>
        )}
      </div>
    </React.Fragment>
  );
};

export default memo(ImageDropzoneWithPreview);
