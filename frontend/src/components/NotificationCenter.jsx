import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, ExternalLink, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-indigo-200 transition-all group active:scale-95">
          <Bell className="text-slate-500 group-hover:text-indigo-600 transition-colors" size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-indigo-600/20 animate-in fade-in zoom-in duration-300">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white rounded-2xl shadow-2xl border-slate-200 overflow-hidden" align="end">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-10 text-center">
              <Bell className="mx-auto text-slate-200 mb-3" size={32} />
              <p className="text-sm text-slate-400">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`p-4 transition-colors ${n.read ? "bg-white" : "bg-indigo-50/30"}`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${n.read ? "bg-transparent" : "bg-indigo-500"}`} />
                    <div className="flex-1">
                      <p className={`text-sm ${n.read ? "text-slate-600" : "text-slate-900 font-medium"}`}>
                        {n.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                        <div className="flex gap-2">
                          {!n.read && (
                            <button 
                              onClick={() => markAsRead(n._id)}
                              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          {n.link && (
                            <Link 
                              to={n.link} 
                              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                              title="Go to link"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">CampusBuzz Alerts</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
