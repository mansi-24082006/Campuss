import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, UserCheck, Award, BarChart3 } from 'lucide-react';

const statItems = [
  { icon: Users, key: 'totalUsers', label: 'Total Users', color: 'text-blue-600' },
  { icon: Calendar, key: 'totalEvents', label: 'Total Events', color: 'text-green-600' },
  { icon: TrendingUp, key: 'activeEvents', label: 'Active Events', color: 'text-purple-600' },
  { icon: UserCheck, key: 'totalParticipations', label: 'Participations', color: 'text-orange-600' },
  { icon: Award, key: 'certificatesIssued', label: 'Certificates', color: 'text-yellow-600' },
  { icon: BarChart3, key: 'averageRating', label: 'Avg Rating', color: 'text-pink-600' }
];

const AdminStats = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
    >
      {statItems.map((item) => (
        <Card key={item.key} className="glass-effect border-0">
          <CardContent className="p-4 text-center">
            <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
            <div className={`text-2xl font-bold ${item.color}`}>{stats[item.key] || 0}</div>
            <p className="text-xs text-gray-600">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};

export default AdminStats;