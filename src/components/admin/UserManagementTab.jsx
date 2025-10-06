import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

const UserManagementTab = ({ users, toast }) => {
  const handleManageUser = (userId) => {
    toast({
      title: "🚧 User management isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      'student': 'bg-blue-100 text-blue-800',
      'faculty': 'bg-green-100 text-green-800',
      'admin': 'bg-purple-100 text-purple-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button 
          onClick={() => handleManageUser('new')}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <Card className="glass-effect border-0">
        <CardContent className="p-6">
          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Joined: {user.joinDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {user.status}
                  </Badge>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleManageUser(user.id)}
                  >
                    Manage
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserManagementTab;