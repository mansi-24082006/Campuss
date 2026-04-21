import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("student");

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password, role: activeRole });

      login(data.user, data.token);

      toast({
        title: "Welcome back!",
        description: data.message || `Successfully logged in as ${activeRole}`,
      });

      // Redirect back to intended page or default dashboard
      const from = location.state?.from?.pathname || `/${activeRole}`;
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
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
        <title>Login | CampusBuzz</title>
        <meta
          name="description"
          content="Login to CampusBuzz to access your personalized dashboard."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[5%] w-[30rem] h-[30rem] bg-violet-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md z-10"
        >
          <Card className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_40px_100px_-15px_rgba(79,70,229,0.15)] rounded-[3rem] overflow-hidden">
            <CardHeader className="text-center pt-12 pb-8">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mx-auto w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-600/10 mb-8 border border-slate-100 group transition-all"
              >
                <img src="/favicon.png" alt="Logo" className="w-12 h-12 group-hover:scale-110 transition-transform" />
              </motion.div>
              <CardTitle className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Back</span>
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium text-lg">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 sm:px-12 pb-16">
              <form onSubmit={handleLogin} className="space-y-8">
                {/* Role Tabs */}
                <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
                  <TabsList className="grid grid-cols-3 bg-slate-100/80 p-1.5 rounded-2xl h-auto min-h-[3.5rem] border border-slate-200/50">
                    {roleData.map((role) => (
                      <TabsTrigger
                        key={role.key}
                        value={role.key}
                        className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg transition-all duration-500 flex flex-col sm:flex-row items-center justify-center gap-2"
                      >
                        <role.icon className={`h-4 w-4 transition-transform duration-500 ${activeRole === role.key ? "scale-110" : ""}`} />
                        <span className="font-black text-[10px] uppercase tracking-widest">{role.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-slate-200 focus:ring-[6px] focus:ring-indigo-600/10 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-900 font-medium"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-14 rounded-2xl border-slate-200 focus:ring-[6px] focus:ring-indigo-600/10 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all hover:scale-110 active:scale-90"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                       <input type="checkbox" className="peer w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer opacity-0 absolute" />
                       <div className="w-5 h-5 border-2 border-slate-300 rounded-lg group-hover:border-indigo-600 transition-all peer-checked:bg-indigo-600 peer-checked:border-indigo-600 flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-white scale-0 peer-checked:scale-100 transition-transform" />
                       </div>
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toast({ title: "Forgot Password?", description: "Please contact your system administrator to reset your password.", variant: "default" })}
                    className="text-sm font-black text-indigo-600 hover:text-indigo-700 transition-all hover:underline"
                  >
                    Reset Password
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-[1.25rem] bg-slate-900 hover:bg-indigo-600 text-white font-black text-lg shadow-xl shadow-slate-900/10 hover:shadow-indigo-600/30 transition-all duration-500 active:scale-[0.98] mt-2 group"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="animate-pulse">Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  )}
                </Button>

                <p className="text-center text-slate-400 font-medium pt-4">
                  New member?{" "}
                  <Link to="/signup" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors">
                    Join CampusBuzz
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

export default LoginPage;

