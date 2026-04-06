import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, Phone, Building, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarUrl } from "@/lib/avatar";
import api from "@/lib/axios";

const ProfileSection = ({ toast }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    department: user?.department || "",
    collegeName: user?.collegeName || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.patch("/users/profile", editData);
      updateUser(data);
      setIsEditing(false);
      toast({ title: "Profile Updated!", description: "Faculty details saved successfully." });
    } catch (error) {
      toast({ 
        title: "Update Failed", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="bg-white border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
                <AvatarImage src={getAvatarUrl(user)} />
                <AvatarFallback className="bg-indigo-600 text-white text-2xl font-bold">
                  {user?.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">
                  {isEditing ? (
                    <Input 
                      value={editData.fullName}
                      onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                      className="text-lg font-bold h-10 w-full bg-white border-indigo-200"
                    />
                  ) : (
                    `Prof. ${user?.fullName}`
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-indigo-100 text-indigo-700 border-0 text-[10px] uppercase font-black tracking-widest px-2.5 py-1">
                    {user?.role}
                  </Badge>
                  <span className="text-slate-400 text-xs flex items-center gap-1.5 font-bold">
                    <ShieldCheck size={14} className="text-indigo-400" /> Verified Faculty Account
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100"
                  >
                    {loading ? "Saving..." : <><Save size={16} className="mr-2" /> Save</>}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl text-slate-500 font-bold"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl border-slate-200 text-slate-600 font-bold h-10 px-6 hover:bg-slate-50"
                >
                  <Edit2 size={16} className="mr-2" /> Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Official Details</h4>
              
              <div className="space-y-4">
                {[
                  { label: "Department", value: user?.department, icon: Building, field: "department" },
                  { label: "Phone Number", value: user?.phoneNumber, icon: Phone, field: "phoneNumber" },
                  { label: "College", value: user?.collegeName, icon: ShieldCheck, field: "collegeName" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <item.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      {isEditing ? (
                        <Input 
                          value={editData[item.field]}
                          onChange={(e) => setEditData({...editData, [item.field]: e.target.value})}
                          className="h-8 mt-1 border-indigo-200 bg-white text-sm font-semibold"
                        />
                      ) : (
                        <p className="font-bold text-slate-800">{item.value || "Not Set"}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8">Account Management</h4>
                 <div className="space-y-6">
                   <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                       <Mail size={24} />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-indigo-200/60 uppercase">Login Email</p>
                       <p className="font-black text-lg">{user?.email}</p>
                     </div>
                   </div>

                   <p className="text-slate-400 text-xs leading-relaxed font-medium">
                     Your faculty role allows you to conduct events, track attendance, and issue certificates. 
                     Keep your contact details updated so students can reach you for queries.
                   </p>
                 </div>
               </div>
               {/* Abstract background shapes */}
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl opacity-50" />
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[100px] opacity-30" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSection;
