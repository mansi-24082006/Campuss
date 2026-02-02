import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const MyEvents = ({ registeredEvents }) => {
  return (
    <div className="space-y-4">
      {registeredEvents.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-4 flex justify-between">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p>{event.date}</p>
              <Badge>{event.status}</Badge>
            </div>
            {event.certificate && (
              <Button size="sm">
                <Download className="h-4 w-4 mr-1" /> Certificate
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyEvents;
