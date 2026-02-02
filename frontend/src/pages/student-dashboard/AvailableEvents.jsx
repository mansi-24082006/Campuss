import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const AvailableEvents = ({ events = [] }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Hackathon: "bg-purple-100 text-purple-800",
      Seminar: "bg-blue-100 text-blue-800",
      "Tech Fest": "bg-green-100 text-green-800",
      Competition: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            {/* Category Badge */}
            <Badge
              className={`absolute top-4 right-4 z-10 ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </Badge>

            {/* Event Image */}
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-80 object-cover"
            />

            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {event.date}
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {event.time}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>

              <Button className="w-full mt-3">Register Now</Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AvailableEvents;
