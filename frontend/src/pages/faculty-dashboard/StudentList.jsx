import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StudentList = ({ students }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-semibold mb-6">Student List</h2>

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
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`}
                  />
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
  );
};

export default StudentList;
