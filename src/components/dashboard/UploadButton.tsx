import React, { useState, useRef, useEffect } from "react";
import { Upload, Plus, FileUp, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { uploadFile, initializeStorage } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize storage bucket when component mounts
  useEffect(() => {
    initializeStorage().catch((err) => {
      console.error("Failed to initialize storage:", err);
      setError("Failed to initialize storage. Please try again later.");
    });
  }, []);

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
    if (!user) {
      setError("Please log in to upload files");
      return;
    }

    setError(null);
    // Limit the number of files
    const filesToUpload = files.slice(0, maxFiles);
    setUploadingFiles(filesToUpload);

    // Upload each file to Supabase storage
    filesToUpload.forEach((file) => {
      uploadFileToStorage(file);
    });

    // Call the onUpload callback
    onUpload(filesToUpload);
  };

  const uploadFileToStorage = async (file: File) => {
    if (!user) return;

    const fileId = file.name + Date.now();
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

    try {
      // Start progress animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress >= 90) {
          clearInterval(interval);
        }
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
      }, 200);

      // Actual upload
      const { path, error } = await uploadFile(file, user.id);

      clearInterval(interval);

      if (error) {
        throw error;
      }

      // Complete the progress
      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

      // After a delay, remove the file from the uploading list
      setTimeout(() => {
        setUploadingFiles((prev) =>
          prev.filter((f) => f.name + Date.now() !== fileId),
        );
      }, 2000);

      console.log("File uploaded successfully:", path);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(`Failed to upload ${file.name}. Please try again.`);
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
    }
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
