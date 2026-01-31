
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
import { User, GraduationCap, Shield } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (role) => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        email,
        role,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      login(userData);
      
      toast({
        title: "Welcome to CampusBuzz!",
        description: `Successfully logged in as ${role}`,
      });
      
      // Redirect based on role
      switch (role) {
        case 'student':
          navigate('/student');
          break;
        case 'faculty':
          navigate('/faculty');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
      
      setLoading(false);
    }, 1500);
  };

  const roleData = [
    {
      key: 'student',
      label: 'Student',
      icon: User,
      description: 'Discover and register for exciting campus events',
      color: 'from-blue-500 to-purple-500'
    },
    {
      key: 'faculty',
      label: 'Faculty',
      icon: GraduationCap,
      description: 'Manage events and track student performance',
      color: 'from-green-500 to-blue-500'
    },
    {
      key: 'admin',
      label: 'Admin',
      icon: Shield,
      description: 'Full platform control and event management',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Login - CampusBuzz</title>
        <meta name="description" content="Login to CampusBuzz to access your personalized dashboard and manage your college events." />
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
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-bold gradient-text mb-2">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Choose your role to access CampusBuzz
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/70 border-purple-200 focus:border-purple-400"
                  />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/70 border-purple-200 focus:border-purple-400"
                  />
                </div>

                <Tabs defaultValue="student" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/50">
                    {roleData.map((role) => (
                      <TabsTrigger 
                        key={role.key} 
                        value={role.key}
                        className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                      >
                        <role.icon className="h-4 w-4 mr-1" />
                        {role.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {roleData.map((role) => (
                    <TabsContent key={role.key} value={role.key} className="mt-4">
                      <div className="text-center space-y-4">
                        <div className={`mx-auto p-3 bg-gradient-to-r ${role.color} rounded-full w-fit`}>
                          <role.icon className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {role.description}
                        </p>
                        <Button
                          onClick={() => handleLogin(role.key)}
                          disabled={loading}
                          className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 text-white`}
                        >
                          {loading ? 'Signing In...' : `Login as ${role.label}`}
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Demo credentials: any email/password combination
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
