import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Download,
  Share,
  Trash2,
  ZoomIn,
  ZoomOut,
  Pencil,
  X,
} from "lucide-react";

interface SignatureToolsProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApply?: (signatureData: string) => void;
}

const SignatureTools = ({
  isOpen = true,
  onClose = () => {},
  onApply = () => {},
}: SignatureToolsProps) => {
  const [signatureType, setSignatureType] = useState<
    "draw" | "type" | "upload"
  >("draw");
  const [signatureData, setSignatureData] = useState<string>("");

  const handleApply = () => {
    onApply(signatureData || "Sample Signature");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Signature</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex space-x-2 border-b pb-4">
            <Button
              variant={signatureType === "draw" ? "default" : "outline"}
              onClick={() => setSignatureType("draw")}
            >
              Draw
            </Button>
            <Button
              variant={signatureType === "type" ? "default" : "outline"}
              onClick={() => setSignatureType("type")}
            >
              Type
            </Button>
            <Button
              variant={signatureType === "upload" ? "default" : "outline"}
              onClick={() => setSignatureType("upload")}
            >
              Upload
            </Button>
          </div>

          {signatureType === "draw" && (
            <div className="border-2 border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">Draw your signature here</p>
            </div>
          )}

          {signatureType === "type" && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Type your signature"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => setSignatureData(e.target.value)}
              />
              <div className="border rounded-md p-4 h-20 flex items-center justify-center">
                <p className="text-xl italic">
                  {signatureData || "Your Signature"}
                </p>
              </div>
            </div>
          )}

          {signatureType === "upload" && (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded-md h-32 flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-500 mb-2">
                  Drop your signature image here
                </p>
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Signature</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ShareDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  documentId?: string;
  documentTitle?: string;
}

const ShareDialog = ({
  isOpen = true,
  onClose = () => {},
  documentId = "doc-123",
  documentTitle = "Document",
}: ShareDialogProps) => {
  const [permission, setPermission] = useState<
    "view" | "edit" | "sign" | "admin"
  >("view");
  const [email, setEmail] = useState<string>("");
  const [shareLink, setShareLink] = useState<string>(
    `https://docfly.example.com/share/${documentId}`,
  );

  const handleInvite = () => {
    console.log("Inviting user with email:", email, "permission:", permission);
    setEmail("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    console.log("Link copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{documentTitle}"</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Invite people</h3>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 p-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={permission}
                onChange={(e) => setPermission(e.target.value as any)}
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
                <option value="sign">Can sign</option>
                <option value="admin">Full access</option>
              </select>
            </div>
            <Button onClick={handleInvite} disabled={!email}>
              Invite
            </Button>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium">Get a shareable link</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <Button variant="outline" onClick={handleCopyLink}>
                Copy
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DocumentPreviewProps {
  isOpen?: boolean;
  onClose?: () => void;
  document?: {
    id: string;
    title: string;
    url: string;
    type: string;
    dateModified: string;
  };
}

const DocumentPreview = ({
  isOpen = true,
  onClose = () => {},
  document = {
    id: "doc-123",
    title: "Project Proposal.pdf",
    url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    type: "pdf",
    dateModified: "2023-06-15",
  },
}: DocumentPreviewProps) => {
  const [zoom, setZoom] = useState<number>(100);
  const [showSignatureTools, setShowSignatureTools] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleSignatureClick = () => {
    setShowSignatureTools(true);
  };

  const handleShareClick = () => {
    setShowShareDialog(true);
  };

  const handleDelete = () => {
    // This would typically trigger a confirmation dialog and then delete the document
    console.log("Delete document", document.id);
    onClose();
  };

  const handleDownload = () => {
    // This would typically trigger the download of the document
    console.log("Download document", document.id);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] flex flex-col bg-white">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
            <DialogTitle className="text-xl font-semibold">
              {document.title}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom Out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="w-32">
                <Slider
                  value={[zoom]}
                  min={50}
                  max={200}
                  step={10}
                  onValueChange={handleZoomChange}
                />
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom In</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <span className="text-sm text-gray-500">{zoom}%</span>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSignatureClick}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Signature</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShareClick}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-4 bg-gray-100">
            <div
              className="mx-auto bg-white shadow-md rounded-md overflow-hidden transition-all duration-200 ease-in-out"
              style={{
                width: `${zoom}%`,
                maxWidth: "1200px",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <img
                src={document.url}
                alt={document.title}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <div className="border-t pt-2 px-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Last modified: {document.dateModified}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleSignatureClick}>Add Signature</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showSignatureTools && (
        <SignatureTools
          isOpen={showSignatureTools}
          onClose={() => setShowSignatureTools(false)}
          onApply={(signatureData) => {
            console.log("Signature applied", signatureData);
            setShowSignatureTools(false);
          }}
        />
      )}

      {showShareDialog && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          documentId={document.id}
          documentTitle={document.title}
        />
      )}
    </>
  );
};

export default DocumentPreview;
