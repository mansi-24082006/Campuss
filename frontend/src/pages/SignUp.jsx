import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, User, Mail, Lock, Phone, Building2, Briefcase, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { roleData } from "@/lib/roles.js";
import api from "@/lib/axios";
import AnimatedSwitch from "@/components/ui/AnimatedSwitch";
import { Check } from "lucide-react";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [department, setDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("student");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { user, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) {
      const from = location.state?.from?.pathname || `/${user.role}`;
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !collegeName || !phoneNumber || !agreedToTerms) {
      toast({
        title: "Incomplete Form",
        description: !agreedToTerms ? "Please agree to the Terms and Conditions" : "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", {
        fullName,
        email,
        password,
        collegeName,
        department,
        phoneNumber,
        role: activeRole
      });

      login(data.user, data.token);

      toast({
        title: "Signup Successful!",
        description: `Welcome to CampusBuzz, ${fullName}!`,
      });

      const from = location.state?.from?.pathname || `/${activeRole}`;
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentRoleInfo = roleData.find(r => r.key === activeRole);

  return (
    <>
      <Helmet>
        <title>Sign Up | CampusBuzz</title>
      </Helmet>

      <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[100px] animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-2xl"
        >
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-white/40 dark:border-slate-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden border">
            <CardHeader className="text-center pt-10 pb-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mx-auto w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-6 border border-slate-100 dark:border-slate-800"
              >
                <img src="/favicon.png" alt="Logo" className="w-10 h-10 object-contain" />
              </motion.div>
              <CardTitle className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Create Account
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-2">
                Join the <span className="text-indigo-600 dark:text-indigo-400 font-semibold">CampusBuzz</span> community
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 sm:px-12 pb-12">
              <form onSubmit={handleSignup} className="space-y-6 mt-6">

                {/* Role Tabs */}
                <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
                  <TabsList className="grid grid-cols-3 bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl h-auto min-h-[3.5rem]">
                    {roleData.map((role) => (
                      <TabsTrigger
                        key={role.key}
                        value={role.key}
                        className="rounded-xl py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-md transition-all duration-300 font-bold text-[10px] sm:text-xs uppercase tracking-tight sm:tracking-wider flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
                      >
                        <role.icon className="h-4 w-4" />
                        {role.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-12 h-13 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all dark:text-white"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-13 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all dark:text-white"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative group md:col-span-2">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-13 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* College Name */}
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="text"
                      placeholder="College Name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="pl-12 h-13 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all dark:text-white"
                    />
                  </div>

                  {/* Department */}
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Department (e.g. CSE, EEE)"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="pl-12 h-13 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all dark:text-white"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative group md:col-span-2">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12 h-13 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all dark:text-white"
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3 px-1 py-1">
                  <AnimatedSwitch
                    checked={agreedToTerms}
                    onChange={setAgreedToTerms}
                    iconOn={<Check size={12} />}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400 leading-snug cursor-pointer">
                    By creating an account, you agree to our <button type="button" onClick={() => toast({ title: "Terms of Service", description: "This feature is coming soon." })} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Terms of Service</button> and <button type="button" onClick={() => toast({ title: "Privacy Policy", description: "This feature is coming soon." })} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Privacy Policy</button>.
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 rounded-2xl bg-gradient-to-r ${currentRoleInfo?.color || 'from-indigo-600 to-blue-600'} text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/25 dark:hover:shadow-indigo-500/10 hover:scale-[1.01] transition-all duration-300 active:scale-[0.98] mt-4`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating your profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign up as {currentRoleInfo?.label}</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>

                <p className="text-center text-slate-600 dark:text-slate-400 font-medium">
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline underline-offset-4">
                    Log in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;