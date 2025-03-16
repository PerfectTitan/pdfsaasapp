import React from "react";
import { Search, Bell, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  username?: string;
  avatarUrl?: string;
  onSearch?: (query: string) => void;
}

const Header = ({
  username = "",
  avatarUrl = "",
  onSearch = () => {},
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Use user data from Supabase if available
  const displayName = user?.user_metadata?.full_name || username || "Guest";
  const userAvatarUrl = user?.user_metadata?.avatar_url || avatarUrl || "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 h-[72px] flex items-center justify-between px-6 w-full">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-1/3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-10 w-full bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => handleNavigate("/account-settings")}
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatarUrl} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigate("/account-settings")}
            >
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigate("/team-management")}
            >
              Team Management
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
