import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Trophy, Download, Users, Clock, MapPin, LogOut } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Load mock data
    const mockEvents = [
      {
        id: 1,
        title: "TechFest 2025",
        category: "Tech Fest",
        date: "2025-03-15",
        time: "10:00 AM",
        location: "Main Auditorium",
        description: "Annual technology festival with competitions and workshops",
        speaker: "Dr. Sarah Johnson",
        speakerBio: "AI Research Scientist at Google",
        registrationLink: "https://techfest2024.com/register",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: 2,
        title: "Startup Pitch Competition",
        category: "Competition",
        date: "2025-03-20",
        time: "2:00 PM",
        location: "Innovation Hub",
        description: "Present your startup ideas to industry experts",
        speaker: "Mark Thompson",
        speakerBio: "Serial Entrepreneur & Venture Capitalist",
        registrationLink: "https://startup-pitch.com/register",
        image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: 3,
        title: "AI & Machine Learning Seminar",
        category: "Seminar",
        date: "2025-03-25",
        time: "11:00 AM",
        location: "Computer Science Building",
        description: "Deep dive into latest AI trends and applications",
        speaker: "Prof. Emily Chen",
        speakerBio: "Head of AI Department, MIT",
        registrationLink: "https://ai-seminar.com/register",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80"
      }
    ];

    const mockRegistered = [
      {
        id: 1,
        title: "Hackathon 2024",
        date: "2024-02-28",
        status: "completed",
        score: 85,
        certificate: true
      },
      {
        id: 2,
        title: "Web Development Workshop",
        date: "2024-03-10",
        status: "upcoming",
        score: null,
        certificate: false
      },
      {
  id: 3,
  title: "AI & Machine Learning Bootcamp",
  date: "2024-06-12",
  status: "completed",
  score: 92,
  certificate: true
},
{
  id: 4,
  title: "Cybersecurity Awareness Seminar",
  date: "2024-07-05",
  status: "completed",
  score: 78,
  certificate: true
},
{
  id: 5,
  title: "Robotics Competition",
  date: "2024-08-18",
  status: "upcoming",
  score: null,
  certificate: false
},
{
  id: 6,
  title: "Cloud Computing Workshop",
  date: "2024-09-02",
  status: "upcoming",
  score: null,
  certificate: false
}

    ];

    const mockLeaderboard = [
      { rank: 1, name: "Alice Johnson", score: 2450, events: 12 },
      { rank: 2, name: "Bob Smith", score: 2380, events: 11 },
      { rank: 3, name: "Charlie Brown", score: 2290, events: 10 },
      { rank: 4, name: user.name, score: 2150, events: 9 },
      { rank: 5, name: "Diana Prince", score: 2100, events: 8 }
    ];

    setEvents(mockEvents);
    setRegisteredEvents(mockRegistered);
    setLeaderboard(mockLeaderboard);
  }, [user.name]);

  const handleRegister = (event) => {
    toast({
      title: "Registration Successful!",
      description: `You've been registered for ${event.title}`,
    });
  };

  const handleDownloadCertificate = (eventTitle) => {
    toast({
      title: "🚧 Certificate download isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Hackathon': 'bg-purple-100 text-purple-800',
      'Seminar': 'bg-blue-100 text-blue-800',
      'Tech Fest': 'bg-green-100 text-green-800',
      'Competition': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Helmet>
        <title>Student Dashboard - CampusBuzz</title>
        <meta name="description" content="Manage your events, view your progress, and discover new opportunities on your student dashboard." />
      </Helmet>
      
      <div className="min-h-screen p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
              <p className="text-gray-600">Ready to explore new events?</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </motion.div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70">
            <TabsTrigger value="events">Available Events</TabsTrigger>
            <TabsTrigger value="registered">My Events</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Available Events */}
          <TabsContent value="events">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="card-hover glass-effect border-0 h-full">
                    <div className="relative">
                      <img  
                        alt={`${event.title} event banner`}
                        className="w-full h-48 object-cover rounded-t-lg"
                        src={event.image} // Now uses event.image from mockEvents
                      />
                      <Badge className={`absolute top-4 right-4 ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-800">Speaker: {event.speaker}</p>
                        <p className="text-xs text-gray-600">{event.speakerBio}</p>
                      </div>
                      
                      <Button 
                        onClick={() => handleRegister(event)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Registered Events */}
          <TabsContent value="registered">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {registeredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass-effect border-0">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.date}</p>
                          <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                        </div>
                        <div className="text-right space-y-2">
                          {event.score && (
                            <div className="text-2xl font-bold text-purple-600">
                              {event.score}/100
                            </div>
                          )}
                          {event.certificate && (
                            <Button 
                              size="sm" 
                              onClick={() => handleDownloadCertificate(event.title)}
                              className="flex items-center space-x-2"
                            >
                              <Download className="h-4 w-4" />
                              <span>Certificate</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <span>Campus Leaderboard</span>
                  </CardTitle>
                  <CardDescription>
                    Top performers across all events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((student, index) => (
                      <motion.div
                        key={student.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          student.name === user.name ? 'bg-purple-100 border-2 border-purple-300' : 'bg-white/50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            student.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-200'
                          }`}>
                            {student.rank}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.events} events</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">{student.score}</p>
                          <p className="text-xs text-gray-500">points</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <Badge className="mt-2">Student</Badge>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Events Attended:</span>
                          <span className="font-medium">9</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Points:</span>
                          <span className="font-medium">2,150</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificates:</span>
                          <span className="font-medium">7</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Rank:</span>
                          <span className="font-medium">#4</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Preferences</h4>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => toast({
                          title: "🚧 Profile editing isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
                        })}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StudentDashboard;
