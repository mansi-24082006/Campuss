import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProfileSection = ({ user }) => {
  return (
    <Card className="shadow-sm border rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
        <CardDescription className="text-sm">
          Manage your account details and preferences
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        
        {/* Profile Top Section */}
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 ring-2 ring-primary/30 shadow">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl">{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-2xl font-semibold leading-tight">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge className="mt-2 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
              Student
            </Badge>
          </div>
        </div>

        {/* Stats + Preferences Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Statistics */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <h4 className="font-medium text-sm mb-2">Statistics</h4>
            <p className="text-sm">Events Attended: <span className="font-semibold">9</span></p>
            <p className="text-sm">Certificates: <span className="font-semibold">7</span></p>
          </div>

          {/* Preferences */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <h4 className="font-medium text-sm mb-3">Preferences</h4>
            <Button 
              variant="outline" 
              className="w-full rounded-lg font-medium"
            >
              Edit Profile
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
