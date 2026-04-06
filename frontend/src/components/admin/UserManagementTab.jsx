import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  UserCog,
  Mail,
  Calendar,
  ShieldCheck,
  UserCheck,
  Trash2,
  Lock,
} from "lucide-react";
import { getAvatarUrl } from "@/lib/avatar";
import api from "@/lib/axios";

const UserManagementTab = ({ users, onRefresh, toast }) => {
  const handleRoleToggle = async (user) => {
    const roles = ["student", "faculty", "admin"];
    const currentIndex = roles.indexOf(user.role);
    const nextRole = roles[(currentIndex + 1) % roles.length];

    try {
      await api.patch(`/users/${user._id}/role`, { role: nextRole });
      toast({
        title: "Role Updated",
        description: `${user.fullName}'s role changed to ${nextRole}`,
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${userId}`);
        toast({
          title: "User Deleted",
          description: "The user has been removed from the system.",
        });
        onRefresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const getRoleStyles = (role) => {
    const styles = {
      student:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      faculty:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      admin:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return (
      styles[role] ||
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
    );
  };

  const getStatusStyles = (status) => {
    return status === "active"
      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500"
      : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            User Directory
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor and manage access levels for students and faculty
          </p>
        </div>
        <Button
          onClick={() => toast({ title: "Note", description: "Use the signup page to add new users for now!" })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </Button>
      </div>

      {/* Main Container */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-3">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col lg:flex-row items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all gap-4"
              >
                {/* Profile Info */}
                <div className="flex items-center space-x-4 w-full lg:w-auto">
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-white dark:border-slate-700 shadow-sm">
                      <AvatarImage
                        src={getAvatarUrl(user)}
                      />
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                        {user.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white dark:border-slate-800 ${user.status === "active"
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                        }`}
                    />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 dark:text-white leading-none">
                      {user.fullName}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1.5">
                      <div className="flex items-center text-xs text-slate-500">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {user.joinDate || "Jan 2026"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges and Actions */}
                <div className="flex items-center justify-between w-full lg:w-auto lg:space-x-6 gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getRoleStyles(
                        user.role
                      )} rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider border-0`}
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                    <Badge
                      className={`${getStatusStyles(
                        user.status
                      )} rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider border-0`}
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      {user.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRoleToggle(user)}
                      className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 font-bold text-xs"
                    >
                      <UserCog className="h-3.5 w-3.5 mr-2" />
                      Role
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteUser(user._id)}
                      className="rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer System Info */}
      <div className="flex items-center justify-center py-4 opacity-50">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          User Database v2.1.0 • All connections encrypted
        </p>
      </div>
    </motion.div>
  );
};

export default UserManagementTab;
