import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Zap, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Reveal from '@/components/ui/Reveal';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Shruti Shekhda",
      role: "Founder & CEO",
      image: "img2.jpg",
      bio: "Visionary leader passionate about connecting campus communities through technology.",
    },
    {
      name: "Mansi Vaghasiya",
      role: "Lead Developer",
      image: "img1.jpg",
      bio: "The architectural mastermind behind our seamless and robust platform.",
    },
    {
      name: "Mital Mistry",
      role: "UI/UX Designer",
      image: "img3.jpg",
      bio: "Creator of the beautiful and intuitive interfaces you love to use.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - CampusBuzz</title>
        <meta name="description" content="Learn about the mission, vision, and the team behind CampusBuzz, the ultimate college event aggregator." />
      </Helmet>

      <div className="bg-transparent py-20 px-4 transition-colors duration-300 min-h-screen">

        {/* --- Hero Section (Centered) --- */}
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-24">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
              Connecting Every Corner of <span className="text-indigo-600">Campus Life</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
              CampusBuzz was born from a simple idea: to create a single, dynamic hub for all college events, empowering communities through technology.
            </p>
          </Reveal>
        </div>

        {/* Mission & Vision */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-32">
          <Reveal direction="left">
            <Card className="h-full bg-white border-slate-200/60 p-10 text-center rounded-[3rem] shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 hover:-translate-y-2">
              <div className="p-5 bg-indigo-50 rounded-3xl w-fit mx-auto mb-6 border border-indigo-100">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Our Mission</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                To empower students, faculty, and administrators by providing an intuitive platform for seamless event discovery and participation.
              </p>
            </Card>
          </Reveal>

          <Reveal direction="right">
            <Card className="h-full bg-white border-slate-200/60 p-10 text-center rounded-[3rem] shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-violet-500/5 transition-all duration-500 hover:-translate-y-2">
              <div className="p-5 bg-violet-50 rounded-3xl w-fit mx-auto mb-6 border border-violet-100">
                <Target className="h-8 w-8 text-violet-600" />
              </div>
              <h2 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Our Vision</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                To be the essential digital companion for every college campus, fostering a vibrant and engaged student community globally.
              </p>
            </Card>
          </Reveal>
        </div>

        {/* --- Team Section (Centered Header) --- */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <Reveal>
              <div className="p-4 bg-emerald-50 rounded-3xl w-fit mx-auto mb-6 border border-emerald-100">
                <Users className="h-10 w-10 text-emerald-600" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-slate-900 tracking-tight">
                Meet the Team
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl text-slate-500 font-medium max-w-2xl">
                The passionate team working behind the scenes to build the future of campus interaction.
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <Reveal key={index} delay={index * 0.1} direction="up">
                <Card className="bg-white border-slate-200/60 text-center p-10 rounded-[3rem] shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 ease-out group overflow-hidden h-full flex flex-col transform hover:-translate-y-3 hover:scale-[1.02] hover:rotate-[0.5deg]">

                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-600/10 rounded-full scale-110 blur-xl group-hover:scale-150 transition-all duration-500" />
                    <Avatar className="w-40 h-40 mx-auto relative border-4 border-white shadow-xl">
                      <AvatarImage
                        src={member.image}
                        alt={member.name}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-3xl">
                        {member.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <CardHeader className="p-0 flex-grow">
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-indigo-600">
                      {member.name}
                    </CardTitle>
                    <div className="mt-2">
                      <CardDescription className="text-indigo-600 font-black uppercase text-xs tracking-[0.2em] bg-indigo-50 inline-block px-4 py-1.5 rounded-full">
                        {member.role}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 mt-6">
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {member.bio}
                    </p>
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

export default AboutPage;
