import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Plus,
  UserCog,
  Mail,
  Calendar,
  ShieldCheck,
  UserCheck,
  Trash2,
  AlertTriangle,
  Search,
  UserMinus
} from "lucide-react";
import { getAvatarUrl } from "@/lib/avatar";
import { useAuth } from "@/contexts/AuthContext"; // Assuming you have this to prevent self-deletion
import api from "@/lib/axios";

const UserManagementTab = ({ users = [], onRefresh, toast }) => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search
  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (user) => {
    if (user._id === currentUser?._id) {
      return toast({ title: "Action Denied", description: "You cannot delete your own account.", variant: "destructive" });
    }

    if (window.confirm(`Permanently delete ${user.fullName}? This cannot be undone.`)) {
      try {
        await api.delete(`/users/${user._id}`);
        toast({ title: "User Deleted", description: "Account successfully purged." });
        onRefresh();
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
      }
    }
  };

  const handleFlagUser = async (user) => {
    const reason = window.prompt(`Reason for flagging ${user.fullName}:`);
    if (!reason) return;
    try {
      await api.post(`/users/${user._id}/flag`, { reason });
      toast({ title: "User Flagged", description: "Admin review requested." });
      onRefresh();
    } catch (error) {
      toast({ title: "Error", description: "Failed to flag user", variant: "destructive" });
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      await api.patch(`/users/${user._id}/status`, { status: nextStatus });
      toast({ title: "Status Updated", description: `${user.fullName} is now ${nextStatus}` });
      onRefresh();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const getRoleStyles = (role) => {
    const styles = {
      student: "bg-blue-50 text-blue-700 border-blue-100",
      faculty: "bg-emerald-50 text-emerald-700 border-emerald-100",
      admin: "bg-purple-600 text-white border-purple-700",
    };
    return styles[role] || "bg-slate-50 text-slate-700 border-slate-100";
  };

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h2>
          <p className="text-sm text-slate-500 font-medium">Control access and system roles.</p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 focus:ring-indigo-500"
            />
          </div>
          <Button
            onClick={() => toast({ title: "Note", description: "Use the signup page to add new users!" })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-4 shadow-md font-bold flex items-center gap-2 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add User</span>
          </Button>
        </div>
      </div>

      {/* User List */}
      <Card className="bg-white border-slate-200/60 rounded-[2.5rem] shadow-xl shadow-slate-200/20 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3">
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <div
                key={user._id}
                className="group flex flex-col lg:flex-row items-center justify-between p-5 bg-slate-50/40 border border-slate-100 rounded-[1.75rem] hover:bg-white hover:border-indigo-200 hover:shadow-lg transition-all duration-300 gap-4"
              >
                {/* Left: Identity */}
                <div className="flex items-center space-x-4 w-full lg:w-auto">
                  <div className="relative">
                    <Avatar className={`h-14 w-14 border-2 border-white shadow-sm ${user.status === 'pending' ? 'animate-pulse' : ''}`}>
                      <AvatarImage src={getAvatarUrl(user)} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 font-black">
                        {user.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${user.status === "active" ? "bg-emerald-500" : user.status === "pending" ? "bg-amber-500" : "bg-rose-500"
                      }`} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 leading-tight flex items-center gap-2">
                      {user.fullName}
                      {user.flags?.length > 0 && (
                        <Badge variant="destructive" className="h-4 px-1 text-[8px] animate-bounce">FLAGGED</Badge>
                      )}
                    </p>
                    <div className="flex items-center text-xs text-slate-400 font-medium mt-1">
                      <Mail className="h-3 w-3 mr-1 text-indigo-400" />
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-auto">
                  <Badge className={`${getRoleStyles(user.role)} rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider border shadow-sm`}>
                    {user.role}
                  </Badge>

                  <div className="h-8 w-[1px] bg-slate-200 hidden lg:block mx-2" />

                  <div className="flex items-center gap-2">
                    {user.status === "pending" ? (
                      <Button
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4"
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(user)}
                        className={`rounded-lg h-9 px-3 text-xs font-bold ${user.status === 'active' ? 'text-slate-500' : 'text-emerald-600 bg-emerald-50'
                          }`}
                      >
                        {user.status === 'active' ? <UserMinus className="h-4 w-4 mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRoleToggle(user)}
                      className="rounded-lg border-slate-200 hover:border-indigo-300 font-bold text-xs h-9 px-3"
                    >
                      <UserCog className="h-4 w-4 mr-2 text-indigo-500" />
                      Role
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleFlagUser(user)}
                      className="rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 h-9 w-9 p-0"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteUser(user)}
                      className="rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-9 w-9 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center">
                <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-300 h-8 w-8" />
                </div>
                <p className="text-slate-500 font-bold">No users found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200/60 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase">Total Users</p>
          <p className="text-xl font-black text-slate-900">{users.length}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
          <p className="text-[10px] font-black text-emerald-500 uppercase">Active</p>
          <p className="text-xl font-black text-emerald-700">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
          <p className="text-[10px] font-black text-amber-500 uppercase">Pending</p>
          <p className="text-xl font-black text-amber-700">{users.filter(u => u.status === 'pending').length}</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center">
          <p className="text-[10px] font-black text-rose-500 uppercase">Flagged</p>
          <p className="text-xl font-black text-rose-700">{users.filter(u => u.flags?.length > 0).length}</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTab;