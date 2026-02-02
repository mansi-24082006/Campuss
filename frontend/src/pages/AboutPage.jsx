import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Zap, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200",
      bio: "Visionary leader passionate about connecting campus communities through technology.",
    },
    {
      name: "Brenda Smith",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      bio: "The architectural mastermind behind our seamless and robust platform.",
    },
    {
      name: "Charles Davis",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      bio: "Creator of the beautiful and intuitive interfaces you love to use.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - CampusBuzz</title>
        <meta name="description" content="Learn about the mission, vision, and the team behind CampusBuzz, the ultimate college event aggregator." />
      </Helmet>

      <div className="bg-white py-16 px-4">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-4 gradient-text"
          >
            Connecting Every Corner of Campus Life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            CampusBuzz was born from a simple idea: to create a single, dynamic hub for all college events.
          </motion.p>
        </div>

        {/* Mission & Vision */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="h-full glass-effect border-0 p-6 text-center">
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 text-lg">
                To empower students, faculty, and administrators by providing an intuitive platform.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="h-full glass-effect border-0 p-6 text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-700 text-lg">
                To be the essential digital companion for every college campus.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate minds driving CampusBuzz forward.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover glass-effect border-0 text-center p-6">
                  <Avatar className="w-32 h-32 mx-auto mb-5 border-2 border-purple-200">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>

                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl">{member.name}</CardTitle>
                    <CardDescription className="text-purple-600 font-semibold">{member.role}</CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 mt-4">
                    <p className="text-gray-600">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
