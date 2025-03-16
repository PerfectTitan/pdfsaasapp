import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Share2, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  id?: string;
  title?: string;
  type?: string;
  thumbnail?: string;
  dateModified?: string;
  onClick?: () => void;
}

const DocumentCard = ({
  id = "doc-1",
  title = "Project Proposal",
  type = "PDF",
  thumbnail = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
  dateModified = "2023-09-15",
  onClick = () => console.log("Document clicked"),
}: DocumentCardProps) => {
  return (
    <Card className="w-[220px] h-[280px] overflow-hidden transition-all duration-200 hover:shadow-md bg-white">
      <div
        className="h-[180px] overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>

      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="overflow-hidden">
            <h3 className="font-medium text-sm truncate" title={title}>
              {title}
            </h3>
            <p className="text-xs text-gray-500">
              {type} • {dateModified}
            </p>
          </div>
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More options</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
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
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
