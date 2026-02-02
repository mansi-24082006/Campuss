import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProfileSection = ({ user, toast }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle>Faculty Profile</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-xl font-semibold">Prof. {user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Faculty</Badge>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => toast({ title: "Profile editing not implemented." })}>
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSection;
