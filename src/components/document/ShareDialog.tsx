import React, { useState } from "react";
import { Copy, Mail, Link2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShareDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  documentName?: string;
  documentId?: string;
}

const ShareDialog = ({
  isOpen = true,
  onClose = () => {},
  documentName = "Sample Document.pdf",
  documentId = "doc-123456",
}: ShareDialogProps) => {
  const [shareLink, setShareLink] = useState(
    `https://docfly.com/share/${documentId}`,
  );
  const [emailInput, setEmailInput] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("viewer");
  const [invitedUsers, setInvitedUsers] = useState([
    { email: "john.doe@example.com", permission: "editor" },
    { email: "jane.smith@example.com", permission: "viewer" },
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    // In a real app, you would show a toast notification here
    console.log("Link copied to clipboard");
  };

  const handleInviteUser = () => {
    if (emailInput && selectedPermission) {
      setInvitedUsers([
        ...invitedUsers,
        { email: emailInput, permission: selectedPermission },
      ]);
      setEmailInput("");
      // In a real app, you would send an invitation email here
    }
  };

  const permissionOptions = [
    { value: "viewer", label: "Can view" },
    { value: "editor", label: "Can edit" },
    { value: "signer", label: "Can sign" },
    { value: "admin", label: "Full access" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Document</DialogTitle>
          <DialogDescription>
            Share "{documentName}" with others
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">
              <Link2 className="mr-2 h-4 w-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="invite">
              <Mail className="mr-2 h-4 w-4" />
              Invite People
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="flex flex-col space-y-2 mt-4">
              <label className="text-sm font-medium">Permission</label>
              <Select defaultValue="viewer">
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  {permissionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} className="flex-shrink-0">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4">
            <div className="flex items-end space-x-2 mt-4">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <div className="w-32">
                <label className="text-sm font-medium block mb-2">
                  Permission
                </label>
                <Select
                  value={selectedPermission}
                  onValueChange={setSelectedPermission}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Permission" />
                  </SelectTrigger>
                  <SelectContent>
                    {permissionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInviteUser} className="mb-0.5">
                Invite
              </Button>
            </div>

            {invitedUsers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">People with access</h3>
                <div className="space-y-3">
                  {invitedUsers.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-gray-500" />
                        </div>
                        <span>{user.email}</span>
                      </div>
                      <Select defaultValue={user.permission}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {permissionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-gray-500">
            Changes are saved automatically
          </div>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
