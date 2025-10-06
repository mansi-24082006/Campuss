import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, BarChart3 } from 'lucide-react';

const SettingsTab = ({ toast }) => {
  const settingsButtons = [
    { label: "General Settings", feature: "Platform settings" },
    { label: "Email Configuration", feature: "Email configuration" },
    { label: "Security Settings", feature: "Security settings" }
  ];

  const maintenanceButtons = [
    { label: "Database Backup", feature: "Database backup" },
    { label: "View System Logs", feature: "System logs" },
    { label: "Clear Cache", feature: "Cache management" }
  ];

  const handleButtonClick = (feature) => {
    toast({
      title: `🚧 ${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold">System Settings</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
            <CardDescription>General system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settingsButtons.map((btn) => (
              <Button 
                key={btn.label}
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleButtonClick(btn.feature)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {btn.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>Database and system operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceButtons.map((btn) => (
              <Button 
                key={btn.label}
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleButtonClick(btn.feature)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {btn.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SettingsTab;