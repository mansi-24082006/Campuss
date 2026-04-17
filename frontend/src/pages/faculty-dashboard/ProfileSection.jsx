import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarUrl } from "@/lib/avatar";
import api from "@/lib/axios";

const ProfileSection = ({ toast }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    department: "",
    collegeName: "",
    state: "",
  });

  useEffect(() => {
    if (user) {
      setEditData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        department: user.department || "",
        collegeName: user.collegeName || "",
        state: user.state || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.patch("/users/profile", editData);
      updateUser(data);
      setIsEditing(false);
      toast?.({
        title: "Profile Updated",
        description: "Your details have been saved successfully.",
      });
    } catch (error) {
      toast?.({
        title: "Update Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", key: "fullName" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Department", key: "department" },
    { label: "College", key: "collegeName" },
    { label: "State", key: "state" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-md border rounded-2xl">
        <CardContent className="p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Profile</h2>

            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Save"}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 size={16} className="mr-2" />
                Edit
              </Button>
            )}
          </div>

          {/* Profile Top */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={getAvatarUrl(user)} />
              <AvatarFallback>
                {user?.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-lg font-medium">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Info Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-sm text-gray-500">
                  {field.label}
                </label>

                {isEditing ? (
                  <Input
                    value={editData[field.key]}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        [field.key]: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="font-medium text-gray-800">
                    {user?.[field.key] || "-"}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t text-sm text-gray-500">
            Joined on{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "-"}
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;