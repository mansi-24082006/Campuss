import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { roleData } from "@/lib/roles.js";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("student");

  const { login } = useAuth(); // mock login after signup
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async () => {
    if (!fullName || !email || !password || !collegeName || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        email,
        role: activeRole,
        name: fullName,
        college: collegeName,
        phone: phoneNumber,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      login(newUser);

      toast({
        title: "Signup Successful!",
        description: `Account created as ${activeRole}`,
      });

      navigate(`/${activeRole}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - CampusBuzz</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-blue-100/30 to-pink-100/30" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <Card className="glass-effect border-0 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold gradient-text mb-2">
                Create an Account
              </CardTitle>
              <CardDescription>Choose your role to sign up</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password with eye toggle */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <Input
                  type="text"
                  placeholder="College Name"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                />

                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />

                {/* Role Tabs */}
                <Tabs value={activeRole} onValueChange={setActiveRole}>
                  <TabsList className="grid grid-cols-3 bg-white/60">
                    {roleData.map((role) => (
                      <TabsTrigger key={role.key} value={role.key}>
                        <role.icon className="h-4 w-4 mr-1" />
                        {role.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {roleData.map((role) => (
                    <TabsContent key={role.key} value={role.key}>
                      <Button
                        onClick={handleSignup}
                        disabled={loading}
                        className={`w-full mt-4 bg-gradient-to-r ${role.color} text-white`}
                      >
                        {loading
                          ? "Creating Account..."
                          : `Sign up as ${role.label}`}
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>

                <p className="text-sm text-center text-gray-500">
                  Already have an account?{" "}
                  <a href="/login" className="text-purple-600 hover:underline">
                    Log in
                  </a>
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
