import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "../layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface ProfileFormData {
  fullName: string;
  email: string;
  avatarUrl?: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue } = useForm<ProfileFormData>({
    defaultValues: {
      fullName:
        user?.user_metadata?.full_name ||
        (user?.email ? getNameFromEmail(user.email) : ""),
      email: user?.email || "",
      avatarUrl: user?.user_metadata?.avatar_url || "",
    },
  });

  React.useEffect(() => {
    if (user) {
      setValue(
        "fullName",
        user.user_metadata?.full_name ||
          (user.email ? getNameFromEmail(user.email) : ""),
      );
      setValue("email", user.email || "");
      setValue("avatarUrl", user.user_metadata?.avatar_url || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          avatar_url: data.avatarUrl,
        },
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getNameFromEmail = (email: string) => {
    if (!email) return "";
    // Extract name part before @ symbol and convert to title case
    const namePart = email.split("@")[0];
    // Replace dots, underscores, numbers with spaces and capitalize each word
    return namePart
      .replace(/[._\d]/g, " ")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal information and how others see you on the
              platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {getInitials(
                      user?.user_metadata?.full_name ||
                        (user?.email ? getNameFromEmail(user.email) : "Guest"),
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" type="button">
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      {...register("email")}
                      disabled
                      placeholder="Your email address"
                    />
                    <p className="text-sm text-muted-foreground">
                      Your email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      {...register("avatarUrl")}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>

                <Button type="submit" className="mt-6">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
