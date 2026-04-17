import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Trophy, BookOpen, Zap, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WorkflowSection from '@/components/WorkflowSection';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Calendar,
      title: "Event Discovery",
      description: "Find hackathons, seminars, tech fests, and competitions across your campus"
    },
    {
      icon: Users,
      title: "Easy Registration",
      description: "Register for events with unique links and manage your participation"
    },
    {
      icon: Trophy,
      title: "Dynamic Scoreboard",
      description: "Track your performance with real-time rankings and achievements"
    },
    {
      icon: BookOpen,
      title: "Speaker Profiles",
      description: "Explore detailed bios and backgrounds of event speakers"
    },
    {
      icon: Zap,
      title: "Auto Certificates",
      description: "Download personalized certificates after attending events"
    },
    {
      icon: Star,
      title: "Role-Based Access",
      description: "Tailored experiences for students, faculty, and administrators"
    }
  ];

  return (
    <>
      <Helmet>
        <title>CampusBuzz - Discover Amazing College Events</title>
        <meta name="description" content="Join CampusBuzz to discover, register, and participate in exciting college events. Connect with peers, learn from experts, and showcase your skills." />
      </Helmet>

      <div className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 md:pt-40 pb-20 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-5"></div>
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 bg-clip-text text-transparent animate-gradient-x">
                CampusBuzz
              </h1>

              <p className="text-lg md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed px-4">
                Your ultimate college event aggregator. Discover, register, and excel in hackathons, seminars, tech fests, and competitions across your campus.
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-6 text-lg font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:scale-105 transition-all"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-10 py-6 text-lg font-bold rounded-2xl transition-all"
                  onClick={() => navigate('/features')}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 md:px-8 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">
                Why Choose CampusBuzz?
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Experience the future of college event management with our comprehensive, state-of-the-art platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group relative glass-effect border-white/20 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] overflow-hidden">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-2xl shadow-lg ring-4 ring-indigo-500/10 group-hover:rotate-6 transition-transform">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-600 text-center text-base leading-relaxed px-2">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <WorkflowSection />

        {/* CTA Section */}
        <section className="py-24 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative p-10 md:p-20 bg-gradient-to-br from-indigo-700 via-violet-800 to-indigo-900 rounded-[3rem] overflow-hidden text-center shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <h2 className="text-3xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                Ready to Transform Your <br /> Campus Experience?
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-medium">
                Join thousands of students and faculty already using CampusBuzz to build the hub of college hubs.
              </p>
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-slate-50 px-12 py-7 text-xl font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                onClick={() => navigate('/login')}
              >
                Start Your Journey
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;