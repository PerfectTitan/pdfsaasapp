import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  FolderIcon,
  Clock,
  Users,
  FileBox,
  Trash2,
  Plus,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasChildren?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  active = false,
  hasChildren = false,
  expanded = false,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 text-sm font-medium",
        active ? "bg-secondary" : "hover:bg-secondary/50",
      )}
      onClick={onClick}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {hasChildren &&
        (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
    </Button>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps = {}) => {
  return (
    <div
      className={cn(
        "flex h-full w-[280px] flex-col bg-background border-r",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-[72px] px-6">
        <h1 className="text-xl font-bold">DocFly</h1>
      </div>

      {/* Create New Button */}
      <div className="px-3 mb-4">
        <Button className="w-full justify-start gap-2">
          <Plus size={16} />
          <span>Create New</span>
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3">
        <nav className="flex flex-col gap-1">
          <SidebarItem
            icon={<FolderIcon size={18} />}
            label="My Documents"
            active
          />
          <SidebarItem icon={<Clock size={18} />} label="Recent" />
          <SidebarItem icon={<Users size={18} />} label="Shared with Me" />
          <SidebarItem icon={<FileBox size={18} />} label="Templates" />
          <SidebarItem icon={<Trash2 size={18} />} label="Trash" />
        </nav>

        <Separator className="my-4" />

        {/* Folders Section */}
        <div className="mb-4">
          <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
            FOLDERS
          </h3>
          <nav className="flex flex-col gap-1">
            <SidebarItem
              icon={<FolderIcon size={18} />}
              label="Personal"
              hasChildren
            />
            <SidebarItem
              icon={<FolderIcon size={18} />}
              label="Work"
              hasChildren
              expanded
            />
            <div className="pl-8">
              <SidebarItem icon={<FileText size={18} />} label="Projects" />
              <SidebarItem icon={<FileText size={18} />} label="Contracts" />
            </div>
            <SidebarItem
              icon={<FolderIcon size={18} />}
              label="Archive"
              hasChildren
            />
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t p-3">
        <TooltipProvider>
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Support</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
