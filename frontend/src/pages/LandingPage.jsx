import React, { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Trophy, BookOpen, Zap, Star, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WorkflowSection from '@/components/WorkflowSection';
import Reveal from '@/components/ui/Reveal';
import Magnetic from '@/components/ui/Magnetic';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  // Smoother animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const features = [
    { icon: Calendar, title: "Event Discovery", description: "Find hackathons, seminars, tech fests, and competitions across your campus" },
    { icon: Users, title: "Easy Registration", description: "Register for events with unique links and manage your participation" },
    { icon: BookOpen, title: "Speaker Profiles", description: "Explore detailed bios and backgrounds of event speakers" },
    { icon: Zap, title: "Auto Certificates", description: "Download personalized certificates after attending events" },
    { icon: Star, title: "Role-Based Access", description: "Tailored experiences for students, faculty, and administrators" },
    { icon: Bell, title: "Real-Time Notifications", description: "Get instant updates about event approvals, reminders, and changes" },

  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  return (
    <>
      <Helmet>
        <title>CampusBuzz - Discover Amazing College Events</title>
        <meta name="description" content="Join CampusBuzz to discover, register, and participate in exciting college events." />
      </Helmet>

      <div className="w-full bg-white transition-all cursor-none" onMouseMove={handleMouseMove}>
        {/* Hero Section with Background Image */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 px-4">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <motion.div 
              style={{
                x: mouseX.get() / 50,
                y: mouseY.get() / 50,
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src="https://media.istockphoto.com/id/2149035292/pt/foto/state-college-penn-state-university-pennsylvania-students-walk-the-paths-to-class.jpg?s=612x612&w=0&k=20&c=lUx9pmNlZXCo2GaClddyRQ5508ySOnT6MtHC1gUQa9Y="
                alt="Campus Life"
                className="w-full h-full object-cover scale-110"
              />
            </motion.div>
            {/* Dark/Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <motion.div 
              {...fadeIn}
              style={{
                x: mouseX.get() / 30,
                y: mouseY.get() / 30,
              }}
            >
              <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
                Campus<span className="text-indigo-400">Buzz</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-100 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                Your ultimate college event aggregator. Discover, register, and excel in events across your campus.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Magnetic>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95"
                    onClick={() => navigate('/login')}
                  >
                    Get Started
                  </Button>
                </Magnetic>
                <Magnetic>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-xl px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    onClick={() => navigate('/features')}
                  >
                    Learn More
                  </Button>
                </Magnetic>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Clean White Background */}
        <section id="features" className="py-32 px-4 md:px-8 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight">
                Why Choose <span className="text-gradient">CampusBuzz</span>?
              </h2>
              <div className="h-2 w-24 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto rounded-full mb-8"></div>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                Powerful features designed to make campus life more engaging, organized, and rewarding.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <Card className="border-slate-100 shadow-sm hover-lift rounded-3xl h-full border-t-8 border-t-indigo-600/10 group overflow-hidden transition-all duration-500 hover:border-t-indigo-600">
                    <CardHeader className="pb-4">
                      <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-600/30">
                        <feature.icon className="h-10 w-10 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                      </div>
                      <CardTitle className="text-2xl font-black text-slate-900 mb-2">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-500 text-lg leading-relaxed font-medium">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <WorkflowSection />

        {/* CTA Section */}
        <section className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
              <Reveal width="100%">
                <div className="bg-slate-950 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl group border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700"></div>
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-600/10 blur-[100px] rounded-full group-hover:bg-violet-600/20 transition-all duration-700"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight">
                      Ready to Transform <br className="hidden md:block" />
                      <span className="text-gradient-white">Your Campus?</span>
                    </h2>
                    <p className="text-slate-400 mb-12 text-xl max-w-2xl mx-auto font-medium">
                      Join thousands of students and faculty already using CampusBuzz to build a more connected community.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                      <Button
                        size="lg"
                        className="bg-white text-slate-950 hover:bg-slate-100 px-16 py-8 text-xl font-black rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                        onClick={() => navigate('/login')}
                      >
                        Start Your Journey
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;