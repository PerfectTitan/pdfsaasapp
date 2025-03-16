import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Pencil, Type, Upload, Check, X, Download } from "lucide-react";

interface SignatureToolsProps {
  onApplySignature?: (signatureData: string) => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

const SignatureTools = ({
  onApplySignature = () => {},
  onCancel = () => {},
  isOpen = true,
}: SignatureToolsProps) => {
  const [activeTab, setActiveTab] = useState("draw");
  const [signatureData, setSignatureData] = useState<string>("");
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");
  const [typedSignatureFont, setTypedSignatureFont] = useState("cursive");

  // Mock function for canvas drawing
  const initializeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    setCanvasRef(canvas);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext("2d");
    if (ctx) {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef) return;
    const ctx = canvasRef.getContext("2d");
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!canvasRef) return;
    setIsDrawing(false);
    // In a real implementation, we would convert the canvas to an image
    // For this mock, we'll just set some placeholder data
    setSignatureData("drawn-signature-data");
  };

  const clearCanvas = () => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      setSignatureData("");
    }
  };

  const handleTypeSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedSignature(e.target.value);
    setSignatureData(`typed-${e.target.value}`);
  };

  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, we would handle the file upload
      // For this mock, we'll just set some placeholder data
      setSignatureData(`uploaded-${file.name}`);
    }
  };

  const handleApplySignature = () => {
    onApplySignature(signatureData);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add Your Signature</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="mb-4" />

      <Tabs defaultValue="draw" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="draw" className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Draw
          </TabsTrigger>
          <TabsTrigger value="type" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Type
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="draw" className="space-y-4">
          <div className="border rounded-md p-1 bg-gray-50">
            <canvas
              ref={initializeCanvas}
              width={350}
              height={150}
              className="border border-dashed border-gray-300 rounded-md bg-white w-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={clearCanvas}>
              Clear
            </Button>
            <Button
              onClick={handleApplySignature}
              disabled={!signatureData}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Apply Signature
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="type" className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Type your name"
              value={typedSignature}
              onChange={handleTypeSignature}
              className="mb-2"
            />
            <div className="flex gap-2 mb-4">
              <Button
                variant={
                  typedSignatureFont === "cursive" ? "default" : "outline"
                }
                onClick={() => setTypedSignatureFont("cursive")}
                className="flex-1"
              >
                Cursive
              </Button>
              <Button
                variant={typedSignatureFont === "serif" ? "default" : "outline"}
                onClick={() => setTypedSignatureFont("serif")}
                className="flex-1"
              >
                Serif
              </Button>
              <Button
                variant={
                  typedSignatureFont === "sans-serif" ? "default" : "outline"
                }
                onClick={() => setTypedSignatureFont("sans-serif")}
                className="flex-1"
              >
                Sans
              </Button>
            </div>
          </div>

          <div className="border rounded-md p-4 h-24 flex items-center justify-center bg-gray-50">
            {typedSignature ? (
              <p
                className={cn(
                  "text-2xl",
                  typedSignatureFont === "cursive" && "font-signature",
                  typedSignatureFont === "serif" && "font-serif",
                  typedSignatureFont === "sans-serif" && "font-sans",
                )}
              >
                {typedSignature}
              </p>
            ) : (
              <p className="text-gray-400 italic">
                Your signature will appear here
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleApplySignature}
              disabled={!typedSignature}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Apply Signature
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your signature image here
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Supports PNG, JPG, or GIF (max 5MB)
            </p>
            <Button variant="outline" className="relative">
              Choose File
              <Input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleUploadSignature}
              />
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleApplySignature}
              disabled={!signatureData.startsWith("uploaded-")}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Apply Signature
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-4" />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleApplySignature}
          disabled={!signatureData}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Apply to Document
        </Button>
      </div>
    </div>
  );
};

export default SignatureTools;
