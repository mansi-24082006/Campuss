import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold">Platform Analytics</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle>Event Participation Trends</CardTitle>
            <CardDescription>Monthly participation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
              <p className="text-gray-600">Participation trend chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Platform user acquisition over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
              <p className="text-gray-600">User growth chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>Distribution of event types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
              <p className="text-gray-600">Category distribution chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Event Success Rate:</span>
                <span className="font-bold text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">User Satisfaction:</span>
                <span className="font-bold text-blue-600">4.7/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Certificate Completion:</span>
                <span className="font-bold text-purple-600">83.6%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform Uptime:</span>
                <span className="font-bold text-green-600">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;