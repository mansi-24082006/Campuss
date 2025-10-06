import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { roleData } from '@/lib/roles.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeRole, setActiveRole] = useState('student');

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both email and password',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        email,
        role: activeRole,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };

      login(userData);

      toast({
        title: 'Welcome to CampusBuzz!',
        description: `Successfully logged in as ${activeRole}`
      });

      navigate(`/${activeRole}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Login - CampusBuzz</title>
        <meta
          name="description"
          content="Login to CampusBuzz to access your personalized dashboard and manage your college events."
        />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-blue-100/30 to-pink-100/30"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <Card className="glass-effect border-0 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold gradient-text mb-2">Welcome Back</CardTitle>
              <CardDescription>Choose your role to login</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Tabs defaultValue="student" value={activeRole} onValueChange={setActiveRole}>
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
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-full mt-4 bg-gradient-to-r ${role.color} hover:opacity-90 text-white`}
                      >
                        {loading ? 'Signing In...' : `Login as ${role.label}`}
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-purple-600 hover:underline">Sign up</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;