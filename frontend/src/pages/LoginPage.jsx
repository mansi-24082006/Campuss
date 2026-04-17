import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

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

      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50/50">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-15%] left-[5%] w-[30rem] h-[30rem] bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-700" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <Card className="bg-white border border-slate-200/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden">
            <CardHeader className="text-center pt-10 pb-6">
              <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-5 border border-slate-100">
                <img src="/favicon.png" alt="Logo" className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">
                Choose your role and enter credentials
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 sm:px-10 pb-12">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Role Tabs */}
                <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
                  <TabsList className="grid grid-cols-3 bg-slate-100/50 p-1 rounded-2xl h-auto min-h-[3rem]">
                    {roleData.map((role) => (
                      <TabsTrigger
                        key={role.key}
                        value={role.key}
                        className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
                      >
                        <role.icon className="h-4 w-4" />
                        <span className="font-bold text-[10px] sm:text-xs uppercase tracking-tight sm:tracking-normal">{role.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-900"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 rounded-xl border-slate-200 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-colors" />
                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toast({ title: "Forgot Password?", description: "Please contact your system administrator to reset your password.", variant: "default" })}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 transition-all duration-300 active:scale-[0.98] mt-2`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>

                <p className="text-center text-slate-500 font-medium pt-2">
                  New to CampusBuzz?{" "}
                  <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
                    Create account
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

