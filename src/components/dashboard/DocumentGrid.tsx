import React, { useState } from "react";
import {
  Grid,
  List,
  SlidersHorizontal,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import DocumentCard from "./DocumentCard";
import UploadButton from "./UploadButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Document {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  dateModified: string;
}

interface DocumentGridProps {
  documents?: Document[];
  onDocumentClick?: (id: string) => void;
  onUpload?: (files: File[]) => void;
}

const DocumentGrid = ({
  documents = [
    {
      id: "doc-1",
      title: "Project Proposal",
      type: "PDF",
      thumbnail:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
      dateModified: "2023-09-15",
    },
    {
      id: "doc-2",
      title: "Financial Report",
      type: "XLSX",
      thumbnail:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&q=80",
      dateModified: "2023-09-10",
    },
    {
      id: "doc-3",
      title: "Marketing Strategy",
      type: "DOCX",
      thumbnail:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&q=80",
      dateModified: "2023-09-05",
    },
    {
      id: "doc-4",
      title: "Client Presentation",
      type: "PPTX",
      thumbnail:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&q=80",
      dateModified: "2023-08-28",
    },
    {
      id: "doc-5",
      title: "Team Photo",
      type: "JPG",
      thumbnail:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&q=80",
      dateModified: "2023-08-20",
    },
  ],
  onDocumentClick = (id) => console.log(`Document ${id} clicked`),
  onUpload = (files) => {
    console.log(`Uploading ${files.length} files`);
    // The actual upload is now handled in the UploadButton component
  },
}: DocumentGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem checked>
                PDF Documents
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Word Documents
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Spreadsheets
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Presentations
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Images
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="type">File Type</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Document grid */}
      <div
        className={`
        ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-4"}
      `}
      >
        {/* Upload button card */}
        <UploadButton onUpload={onUpload} />

        {/* Document cards */}
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            title={doc.title}
            type={doc.type}
            thumbnail={doc.thumbnail}
            dateModified={doc.dateModified}
            onClick={() => onDocumentClick(doc.id)}
          />
        ))}

        {/* If no documents match search */}
        {documents.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
            <SlidersHorizontal className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium">No documents found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentGrid;
