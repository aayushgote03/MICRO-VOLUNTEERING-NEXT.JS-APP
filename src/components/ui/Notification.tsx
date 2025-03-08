"use client"
import { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Add type for notification
interface Notification {
  id: string;
  task_name: string;
  status: string;
  acknowledged: boolean;
  task_id: string;
}

export default function NotificationDropdown({ user }: { user: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const user_email = user;
  console.log(user_email, 'user_email');


  useEffect(()=> {
    const fetchNotifications = async () => {
      const response = await fetch(`/api/getnotification`, {
        method: 'POST',
        body: JSON.stringify({ user_email }),
      });
      const data = await response.json();
      console.log(data, 'data');
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  // Get unacknowledged notifications
  const unreadNotifications = notifications.filter(n => !n.acknowledged);

  const acknowledgeNotification = async (id: string, task_id: string) => {
    console.log(id, 'id');
    setNotifications(notifications.filter(item => item.id !== id));
    const response = await fetch(`/api/getnotification`, {
      method: 'DELETE',
      body: JSON.stringify({ notification_id: id, user_email: user_email, task_id: task_id }),
    });
    const data = await response.json();
    console.log(data, 'data');
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        onClick={() => setOpen(!open)}
        className="relative hover:bg-purple-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-purple-600" />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            {unreadNotifications.length}
          </span>
        )}
      </Button>
      
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card className="backdrop-blur-md bg-white/90 border-2 border-purple-200 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 flex justify-between items-center">
                <h3 className="text-white font-semibold">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setOpen(false)}
                  className="hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-3 max-h-[70vh] overflow-y-auto">
                <AnimatePresence>
                  {unreadNotifications.length > 0 ? (
                    unreadNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-2 last:mb-0"
                      >
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100 hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-purple-700">{notification.task_name}</span>
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                              {notification.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Just now</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => acknowledgeNotification(notification.id, notification.task_id)}
                              className="hover:bg-purple-200 text-purple-600"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Mark as read
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center py-8 text-gray-500"
                    >
                      <Bell className="w-12 h-12 mb-3 text-purple-200" />
                      <p className="text-center">All caught up! No new notifications</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
