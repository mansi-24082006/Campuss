import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Trophy, BookOpen, Zap, Star } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

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
        <section className="relative overflow-hidden pt-28 pb-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-blue-100/50 to-pink-100/50"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-2"></div>
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                CampusBuzz
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Your ultimate college event aggregator. Discover, register, and excel in hackathons, seminars, tech fests, and competitions.
              </p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-x-4"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg pulse-glow"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg"
                  onClick={() => navigate('/features')}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Why Choose CampusBuzz?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of college event management with our comprehensive platform
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-hover glass-effect border-0 h-full">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-fit">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 text-center">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Campus Experience?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students, faculty, and administrators already using CampusBuzz
              </p>
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
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
