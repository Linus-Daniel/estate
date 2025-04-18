"use client";
import { useState } from "react";
import { Bell, BellOff, Check, X, AlertTriangle, Info, Mail, Calendar, MessageSquare } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info" | "message" | "event";
  time: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export default function Notification() {
  const [activeFilter, setActiveFilter] = useState<"all" | Notification["type"]>("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Payment Received",
      message: "Your monthly subscription payment of $29.99 has been received.",
      type: "success",
      time: "2 mins ago",
      read: false,
      action: {
        label: "View Invoice",
        onClick: () => console.log("View invoice clicked")
      }
    },
    {
      id: "2",
      title: "Server Down",
      message: "Our monitoring system detected an outage in US-East-1 region.",
      type: "error",
      time: "15 mins ago",
      read: false
    },
    {
      id: "3",
      title: "Scheduled Maintenance",
      message: "There will be scheduled maintenance this weekend from 2-4 AM GMT.",
      type: "warning",
      time: "1 hour ago",
      read: true
    },
    {
      id: "4",
      title: "New Feature Available",
      message: "Check out our new analytics dashboard with enhanced reporting.",
      type: "info",
      time: "3 hours ago",
      read: true,
      action: {
        label: "Try Now",
        onClick: () => console.log("Try now clicked")
      }
    },
    {
      id: "5",
      title: "New Message",
      message: "You have received a new message from Sarah Williams in your inbox.",
      type: "message",
      time: "5 hours ago",
      read: false
    },
    {
      id: "6",
      title: "Team Meeting",
      message: "Don't forget about the quarterly planning meeting tomorrow at 10 AM.",
      type: "event",
      time: "1 day ago",
      read: true
    },
    {
      id: "7",
      title: "Account Verified",
      message: "Your account verification has been completed successfully.",
      type: "success",
      time: "2 days ago",
      read: true
    }
  ]);

  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const filteredNotifications = activeFilter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return <Check className="h-5 w-5 text-green-500" />;
      case "error": return <X className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      case "message": return <Mail className="h-5 w-5 text-purple-500" />;
      case "event": return <Calendar className="h-5 w-5 text-indigo-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-800";
      case "error": return "bg-red-100 text-red-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "info": return "bg-blue-100 text-blue-800";
      case "message": return "bg-purple-100 text-purple-800";
      case "event": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative">
              <Bell className="h-8 w-8 text-indigo-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold ml-3">Notifications</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDoNotDisturb(!doNotDisturb)}
              className={`flex items-center text-sm font-medium px-3 py-1.5 rounded-full ${
                doNotDisturb ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-700"
              }`}
            >
              {doNotDisturb ? (
                <>
                  <BellOff className="h-4 w-4 mr-1" />
                  Do Not Disturb
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-1" />
                  Notifications On
                </>
              )}
            </button>
            
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 bg-indigo-50 rounded-full"
            >
              Mark all as read
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full mr-2 ${
              activeFilter === "all" 
                ? "bg-indigo-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {(["success", "error", "warning", "info", "message", "event"] as Notification["type"][]).map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full mr-2 capitalize flex items-center ${
                activeFilter === type 
                  ? `${getTypeColor(type)} bg-opacity-100` 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {type === "message" ? (
                <Mail className="h-4 w-4 mr-1" />
              ) : type === "event" ? (
                <Calendar className="h-4 w-4 mr-1" />
              ) : (
                getNotificationIcon(type)
              )}
              {type}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="h-10 w-10 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeFilter === "all" 
                  ? "You don't have any notifications yet." 
                  : `You don't have any ${activeFilter} notifications.`}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`px-4 py-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? "text-gray-900" : "text-gray-600"
                        }`}>
                          {notification.title}
                        </p>
                        <div className="flex space-x-2">
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.action && (
                        <div className="mt-2">
                          <button
                            onClick={() => {
                              notification.action?.onClick();
                              markAsRead(notification.id);
                            }}
                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            {notification.action.label}
                            <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Actions */}
        {filteredNotifications.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setNotifications([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all notifications
            </button>
            <div className="text-sm text-gray-500">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
          </div>
        )}
      </div>
    </div>
  );
}