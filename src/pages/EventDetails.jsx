
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading event details
    setTimeout(() => {
      const mockEvent = {
        id: parseInt(id),
        title: "TechFest 2024 - Innovation Summit",
        category: "Tech Fest",
        date: "2024-03-15",
        time: "10:00 AM - 6:00 PM",
        location: "Main Auditorium, University Campus",
        description: "Join us for the biggest technology festival of the year! TechFest 2024 brings together students, faculty, and industry experts for a day of innovation, learning, and networking. Experience cutting-edge technology demonstrations, participate in coding competitions, attend insightful workshops, and connect with like-minded individuals passionate about technology.",
        longDescription: "TechFest 2024 is more than just an event - it's a celebration of innovation and technology that brings together the brightest minds from across the campus and beyond. This year's theme focuses on 'Technology for Tomorrow' with special emphasis on AI, sustainability, and digital transformation. The event features multiple tracks including competitive programming, hackathons, tech talks, startup pitches, and interactive workshops led by industry professionals.",
        speaker: {
          name: "Dr. Sarah Johnson",
          title: "AI Research Scientist at Google",
          bio: "Dr. Sarah Johnson is a leading AI researcher with over 15 years of experience in machine learning and artificial intelligence. She has published over 50 research papers and holds multiple patents in the field of neural networks. Currently leading Google's AI Ethics team, she is passionate about responsible AI development and its applications in solving real-world problems.",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
          linkedin: "https://linkedin.com/in/sarahjohnson",
          twitter: "https://twitter.com/sarahjohnsonai"
        },
        organizer: "Computer Science Department",
        registrationLink: "https://techfest2024.com/register",
        maxParticipants: 500,
        currentParticipants: 342,
        tags: ["AI", "Machine Learning", "Innovation", "Technology", "Networking"],
        schedule: [
          { time: "10:00 AM", activity: "Registration & Welcome Coffee" },
          { time: "11:00 AM", activity: "Keynote: Future of AI by Dr. Sarah Johnson" },
          { time: "12:30 PM", activity: "Tech Demos & Exhibitions" },
          { time: "2:00 PM", activity: "Lunch & Networking" },
          { time: "3:00 PM", activity: "Hackathon Begins" },
          { time: "5:00 PM", activity: "Startup Pitch Competition" },
          { time: "6:00 PM", activity: "Awards & Closing Ceremony" }
        ],
        requirements: [
          "Laptop with development environment setup",
          "University ID for entry",
          "Enthusiasm for technology and innovation"
        ],
        prizes: [
          "1st Place: $5,000 + Internship Opportunity",
          "2nd Place: $3,000 + Tech Gadgets",
          "3rd Place: $1,000 + Certificates"
        ]
      };
      setEvent(mockEvent);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleRegister = () => {
    toast({
      title: "Registration Successful!",
      description: `You've been registered for ${event.title}`,
    });
  };

  const handleExternalLink = (url) => {
    toast({
      title: "🚧 External links aren't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{event.title} - CampusBuzz</title>
        <meta name="description" content={event.description} />
      </Helmet>
      
      <div className="min-h-screen p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-effect border-0 overflow-hidden">
              <div className="relative">
                <img  
                  alt={`${event.title} main banner`}
                  className="w-full h-64 md:h-80 object-cover"
                 src="https://images.unsplash.com/photo-1695480497603-381a2bee1c05" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {event.category}
                    </Badge>
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                  <p className="text-lg opacity-90">Organized by {event.organizer}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Details */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle>About This Event</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                    <p className="text-gray-700 leading-relaxed">{event.longDescription}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Speaker Profile */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle>Featured Speaker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img  
                          alt={`${event.speaker.name} profile photo`}
                          className="w-32 h-32 rounded-full object-cover"
                         src="https://images.unsplash.com/photo-1674566114911-cd9b71354d39" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">{event.speaker.name}</h3>
                          <p className="text-purple-600 font-medium">{event.speaker.title}</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{event.speaker.bio}</p>
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExternalLink(event.speaker.linkedin)}
                            className="flex items-center space-x-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>LinkedIn</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExternalLink(event.speaker.twitter)}
                            className="flex items-center space-x-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Twitter</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle>Event Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-3 bg-white/50 rounded-lg">
                          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium min-w-fit">
                            {item.time}
                          </div>
                          <p className="text-gray-700">{item.activity}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-effect border-0 sticky top-6">
                  <CardHeader>
                    <CardTitle>Event Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-700">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span>{event.currentParticipants}/{event.maxParticipants} registered</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>

                    <Button 
                      onClick={handleRegister}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      size="lg"
                    >
                      Register Now
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => handleExternalLink(event.registrationLink)}
                      className="w-full flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>External Registration</span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span className="text-gray-700 text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Prizes */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle>Prizes & Awards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {event.prizes.map((prize, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-600 mt-1">🏆</span>
                          <span className="text-gray-700 text-sm">{prize}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
