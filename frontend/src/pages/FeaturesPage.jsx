import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Users, Trophy, BookOpen, Zap, Star, ShieldCheck, BarChart2, MessageSquare } from 'lucide-react';

const FeaturesPage = () => {
  const featureList = [
    {
      icon: Calendar,
      title: "Comprehensive Event Discovery",
      description: "Easily find and filter events by category, date, or organizer. Never miss an opportunity on campus again.",
    },
    {
      icon: Users,
      title: "Seamless Registration",
      description: "One-click registration for events with unique, shareable links. Manage all your sign-ups in one place.",
    },
    {
      icon: Trophy,
      title: "Dynamic & Gamified Scoreboard",
      description: "Track your performance in competitions with a live, LeetCode-style scoreboard. Earn points and climb the ranks!",
    },
    {
      icon: BookOpen,
      title: "Detailed Speaker & Event Profiles",
      description: "Get to know event speakers through detailed bios and access comprehensive event information before you attend.",
    },
    {
      icon: Zap,
      title: "Automated Certificate Generation",
      description: "Instantly receive and download personalized, verifiable certificates upon successful event completion.",
    },
    {
      icon: Star,
      title: "Role-Based Dashboards",
      description: "Customized dashboards for students, faculty, and administrators, providing tailored tools and insights.",
    },
     {
      icon: ShieldCheck,
      title: "Secure Admin Controls",
      description: "Admins have full control over event creation, user management, and platform-wide settings for a secure environment.",
    },
    {
      icon: BarChart2,
      title: "Advanced Analytics",
      description: "Faculty and admins can access detailed analytics on event attendance, student performance, and engagement.",
    },
    {
      icon: MessageSquare,
      title: "Event Proposals",
      description: "Student associations can propose new events directly through the platform for admin approval and management.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Features - CampusBuzz</title>
        <meta name="description" content="Explore the powerful features of CampusBuzz, designed to enhance the college event experience for everyone." />
      </Helmet>
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
              Platform Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to revolutionize the campus event experience, all in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureList.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover glass-effect border-0 h-full shadow-lg">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-fit mb-4">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-800">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center text-base">
                      {feature.description}
                    </CardDescription>
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

export default FeaturesPage;