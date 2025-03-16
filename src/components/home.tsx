import React, { useState } from "react";
import AppLayout from "./layout/AppLayout";
import DocumentGrid from "./dashboard/DocumentGrid";
import DocumentPreview from "./document/DocumentPreview";
import AuthModal from "./auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

interface HomeProps {
  isAuthenticated?: boolean;
}

const Home = ({ isAuthenticated = false }: HomeProps) => {
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  // Mock document data
  const documents = [
    {
      id: "doc-1",
      title: "Project Proposal",
      type: "PDF",
      thumbnail:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
      dateModified: "2023-09-15",
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    },
    {
      id: "doc-2",
      title: "Financial Report",
      type: "XLSX",
      thumbnail:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&q=80",
      dateModified: "2023-09-10",
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    },
    {
      id: "doc-3",
      title: "Marketing Strategy",
      type: "DOCX",
      thumbnail:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&q=80",
      dateModified: "2023-09-05",
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    },
    {
      id: "doc-4",
      title: "Client Presentation",
      type: "PPTX",
      thumbnail:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&q=80",
      dateModified: "2023-08-28",
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    },
    {
      id: "doc-5",
      title: "Team Photo",
      type: "JPG",
      thumbnail:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&q=80",
      dateModified: "2023-08-20",
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    },
  ];

  const handleDocumentClick = (id: string) => {
    setSelectedDocument(id);
    setShowDocumentPreview(true);
  };

  const handleUpload = (files: File[]) => {
    console.log(`Uploading ${files.length} files`);
    // In a real app, this would handle file upload to a server
  };

  const handleClosePreview = () => {
    setShowDocumentPreview(false);
    setSelectedDocument(null);
  };

  const handleAuthModalClose = () => {
    // In a real app, this would check if the user is authenticated
    // For now, we'll just close the modal
    setShowAuthModal(false);
  };

  // Find the selected document
  const selectedDocumentData = selectedDocument
    ? documents.find((doc) => doc.id === selectedDocument) || null
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          open={showAuthModal}
          onOpenChange={handleAuthModalClose}
          defaultTab="login"
        />
      )}

      {/* Main Layout */}
      <AppLayout>
        {/* Quick Action Buttons */}
        <div className="flex justify-end mb-6 gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>

        {/* Document Grid */}
        <DocumentGrid
          documents={documents}
          onDocumentClick={handleDocumentClick}
          onUpload={handleUpload}
        />

        {/* Document Preview Modal */}
        {showDocumentPreview && selectedDocumentData && (
          <DocumentPreview
            isOpen={showDocumentPreview}
            onClose={handleClosePreview}
            document={{
              id: selectedDocumentData.id,
              title: selectedDocumentData.title,
              url: selectedDocumentData.url,
              type: selectedDocumentData.type,
              dateModified: selectedDocumentData.dateModified,
            }}
          />
        )}
      </AppLayout>
    </div>
  );
};

export default Home;
