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
import { Calendar, Users, LogOut, Plus, Edit } from 'lucide-react';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "Data Structures Workshop",
        date: "2025-08-15",
        participants: 45,
        status: "active",
        category: "Workshop",
      },
      {
        id: 2,
        title: "Algorithm Design Competition",
        date: "2025-08-20",
        participants: 32,
        status: "upcoming",
        category: "Competition",
      },
      {
        id: 3,
        title: "Machine Learning Seminar",
        date: "2025-07-28",
        participants: 67,
        status: "completed",
        category: "Seminar",
      },
    ];

    const mockStudents = [
      { id: 1, name: "Alice Johnson", email: "alice@university.edu", event: "Data Structures Workshop" },
      { id: 2, name: "Bob Smith", email: "bob@university.edu", event: "Data Structures Workshop" },
      { id: 3, name: "Charlie Brown", email: "charlie@university.edu", event: "Algorithm Design Competition" },
      { id: 4, name: "Diana Prince", email: "diana@university.edu", event: "Machine Learning Seminar" },
    ];

    setEvents(mockEvents);
    setStudents(mockStudents);
  }, []);

  const handleCreateEvent = () => {
    toast({ title: "Event creation isn't implemented yet." });
  };

  const handleEditEvent = () => {
    toast({ title: "Event editing isn't implemented yet." });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      upcoming: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Helmet>
        <title>Faculty Dashboard - CampusBuzz</title>
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
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h1>
              <p className="text-gray-600">Welcome, Prof. {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </motion.div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/70">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="students">Student List</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Events */}
          <TabsContent value="events">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Event Management</h2>
                <Button
                  onClick={handleCreateEvent}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="card-hover glass-effect border-0 h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <CardDescription className="text-sm">{event.date}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{event.participants} participants</span>
                          </div>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditEvent(event.id)}
                          className="w-full flex items-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Students */}
          <TabsContent value="students">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold">Student List</h2>

              <Card className="glass-effect border-0">
                <CardContent className="p-6 space-y-4">
                  {students.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <p className="text-xs text-gray-500">{student.event}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle>Faculty Profile</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">Prof. {user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Faculty</Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => toast({ title: "Profile editing isn't implemented yet." })}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default FacultyDashboard;
