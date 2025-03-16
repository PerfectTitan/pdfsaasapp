import React, { useState, useRef } from "react";
import { Upload, Plus, FileUp, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

interface UploadButtonProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
}

const UploadButton = ({
  onUpload = () => {},
  maxFiles = 10,
  acceptedFileTypes = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",
}: UploadButtonProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    // Limit the number of files
    const filesToUpload = files.slice(0, maxFiles);
    setUploadingFiles(filesToUpload);

    // Simulate upload progress
    filesToUpload.forEach((file) => {
      simulateFileUpload(file);
    });

    // Call the onUpload callback
    onUpload(filesToUpload);
  };

  const simulateFileUpload = (file: File) => {
    let progress = 0;
    const fileId = file.name + Date.now();

    setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));

    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
    }, 300);
  };

  const cancelUpload = (file: File) => {
    setUploadingFiles((prev) => prev.filter((f) => f !== file));
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`w-[220px] h-[280px] flex flex-col justify-center items-center p-4 relative bg-white ${isDragging ? "border-primary border-2" : "border border-dashed"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center h-full w-full p-0">
        {uploadingFiles.length > 0 ? (
          <div className="w-full space-y-4">
            <h3 className="text-sm font-medium text-center mb-2">
              Uploading {uploadingFiles.length} file(s)
            </h3>

            <div className="max-h-[180px] overflow-y-auto space-y-3">
              {uploadingFiles.map((file, index) => {
                const fileId = file.name + Date.now();
                const progress = uploadProgress[fileId] || 0;

                return (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => cancelUpload(file)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleButtonClick}
            >
              <Plus className="h-4 w-4 mr-2" /> Add More
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Files</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Drag & drop files or click to browse
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleButtonClick}>
                    <FileUp className="h-4 w-4 mr-2" /> Select Files
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload documents to your workspace</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          accept={acceptedFileTypes}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default UploadButton;
