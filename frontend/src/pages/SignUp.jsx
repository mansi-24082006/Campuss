import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Eye, EyeOff, User, Mail, Lock, Phone,
  Building2, Briefcase, ArrowRight, Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { roleData } from "@/lib/roles.js";
import api from "@/lib/axios";
import { DEPARTMENTS } from "@/lib/departments";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    collegeName: "",
    department: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("student");

  const { user, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!authLoading && user) {
      navigate(location.state?.from?.pathname || `/${user.role}`, { replace: true });
    }
  }, [user, authLoading]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", { ...formData, role: activeRole });
      login(data.user, data.token);
      toast({ title: "Success", description: "Account created!" });
    } catch (error) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Create Account | CampusBuzz</title></Helmet>

      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
        {/* Animated Background Elements */}
        <div className="absolute top-[-5%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-violet-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[500px] z-10"
        >
          {/* Top Icon */}
          <div className="flex justify-center mb-8">
            <motion.div 
               whileHover={{ scale: 1.1, rotate: -5 }}
               className="p-4 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <img src="/favicon.png" alt="Logo" className="w-10 h-10" />
            </motion.div>
          </div>

          <Card className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_40px_100px_-15px_rgba(79,70,229,0.12)] rounded-[3rem] p-2 overflow-hidden">
            <CardContent className="pt-12 px-8 sm:px-12 pb-14">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create <span className="text-gradient">Account</span></h1>
                <p className="text-slate-500 font-medium text-lg">Join the campus ecosystem today</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">

                {/* Role Tabs */}
                <Tabs value={activeRole} onValueChange={setActiveRole} className="mb-8">
                  <TabsList className="grid grid-cols-3 bg-slate-100/80 p-1.5 rounded-2xl h-auto min-h-[3.5rem] border border-slate-200/50">
                    {roleData.map((role) => (
                      <TabsTrigger
                        key={role.key}
                        value={role.key}
                        className="rounded-xl py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg transition-all duration-500"
                      >
                        {role.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* Input Group */}
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input name="fullName" placeholder="Full Name" onChange={handleInputChange} className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[6px] focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium" />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input name="email" type="email" placeholder="Email Address" onChange={handleInputChange} className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[6px] focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium" />
                  </div>

                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input name="collegeName" placeholder="College Name" onChange={handleInputChange} className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[6px] focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium" />
                  </div>

                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                    <Select onValueChange={(v) => setFormData({ ...formData, department: v })}>
                      <SelectTrigger className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl text-slate-500 font-medium">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl shadow-indigo-600/5">
                        {DEPARTMENTS.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input name="phoneNumber" type="tel" placeholder="Phone Number" onChange={handleInputChange} className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[6px] focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium" />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input name="password" type={showPassword ? "text" : "password"} placeholder="Secure Password" onChange={handleInputChange} className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[6px] focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all hover:scale-110 active:scale-90">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 mt-6 rounded-[1.25rem] bg-slate-900 hover:bg-indigo-600 text-white font-black text-lg shadow-xl shadow-slate-900/10 hover:shadow-indigo-600/30 transition-all duration-500 active:scale-[0.98] group"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>Create Account</span>
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-slate-400 font-medium">
                  Already a member?{" "}
                  <Link to="/login" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors">Sign In</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;