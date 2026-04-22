import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Users, Trophy, BookOpen, Zap, Star, ShieldCheck, BarChart2, MessageSquare } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

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
      icon: BookOpen,
      title: "Detailed Speaker & Event Profiles",
      description: "Get to know event speakers through detailed bios and access comprehensive event information before you attend.",
    },
    {
      icon: Zap,
      title: "Certificate Generation",
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
      <div className="bg-transparent py-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Reveal>
              <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tight">
                Platform <span className="text-indigo-600">Features</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                Everything you need to revolutionize the campus event experience, all in one place.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featureList.map((feature, index) => (
              <Reveal key={index} delay={index * 0.1} direction={index % 2 === 0 ? "left" : "right"}>
                <Card className="bg-white border-slate-200/60 h-full shadow-xl shadow-slate-200/20 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 group">
                  <CardHeader className="items-center text-center p-8 pb-4">
                    <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl w-fit mb-6 group-hover:scale-110 transition-transform duration-500">
                      <feature.icon className="h-10 w-10 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-10">
                    <CardDescription className="text-slate-500 text-center text-base font-medium leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesPage;