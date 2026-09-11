import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, UserRound, LogOut, Bell, Search, MapPin, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useNotifications,
  useMarkNotificationAsRead,
} from '../queries/Notification/notificationQueries';

function formatRelativeTime(value) {
  if (!value) return '—';

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getHeaderNotificationType(type) {
  const normalized = String(type || '').toLowerCase();

  if (['inventory', 'stock', 'alert', 'warning', 'maintenance'].includes(normalized)) {
    return 'warning';
  }

  if (['payment', 'filling', 'batch'].includes(normalized)) {
    return 'success';
  }

  return 'info';
}

function Header({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('Peshware Plant');
  const [user, setUser] = useState(null);
  
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const plantDropdownRef = useRef(null);

  const plants = [
    'Peshware Plant',
  ];

  const { data: notificationsResponse, isLoading: areNotificationsLoading } = useNotifications(1, 10);
  const markAsReadMutation = useMarkNotificationAsRead();
  const notificationData = notificationsResponse?.data || {};
  const notifications = notificationData.items || [];
  const unreadCount = notificationData.unreadCount || 0;

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
    setIsNotificationOpen(false);
    navigate('/notifications', { state: { selectedNotification: notification } });
  };

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (plantDropdownRef.current && !plantDropdownRef.current.contains(event.target)) {
        setIsPlantDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.header
      animate={{
        x: isSidebarOpen ? 0 : 0,
        opacity: isSidebarOpen ? 1 : 0.95,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="shadow-lg bg-white"
    >
      <div className="flex items-center justify-between px-6 py-3">

          {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions, cylinders, or customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-[#E5E7EB] border border-text-tertiary text-tertiary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-white/30  w-96 text-sm"
          />
        </div>
        {/* </div> */}

        {/* Right Side - Plant Selection, Notifications & User */}
        <div className="flex items-center gap-3">
          {/* Plant Selection */}
          <div className="relative" ref={plantDropdownRef}>
            <button
              onClick={() => setIsPlantDropdownOpen(!isPlantDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-accent-blue text-sm font-medium"
            >
              {/* <Building2 className="w-4 h-4" /> */}
              <MapPin className="w-4 h-4" />
              <span>{selectedPlant}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isPlantDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isPlantDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                {plants.map((plant) => (
                  <button
                    key={plant}
                    onClick={() => {
                      setSelectedPlant(plant);
                      setIsPlantDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {plant}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>
                  <span className="text-xs text-slate-500">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {areNotificationsLoading && (
                    <p className="p-4 text-sm text-slate-500">Loading notifications...</p>
                  )}

                  {!areNotificationsLoading && notifications.length === 0 && (
                    <p className="p-4 text-sm text-slate-500">No notifications found</p>
                  )}

                  {notifications.map((notification) => {
                    const type = getHeaderNotificationType(notification.notificationType);

                    return (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-colors ${
                          !notification.isRead ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              type === "success"
                                ? "bg-green-100"
                                : type === "warning"
                                  ? "bg-orange-100"
                                  : "bg-blue-100"
                            }`}
                          >
                            {type === "success" && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {type === "warning" && (
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                            )}
                            {type === "info" && (
                              <Info className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800">
                              {notification.notificationTitle}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {notification.notificationMessage}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatRelativeTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => {
                      setIsNotificationOpen(false);
                      navigate("/notifications");
                    }}
                    className="w-full text-sm font-medium text-accent-blue hover:text-blue-700 transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-200 bg-gradient-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user?.fullName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{user?.fullName || 'User'}</p>
                      <p className="text-white/70 text-xs">
                        {user?.role?.roleName || 'User'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/settings");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserRound className="h-4 w-4 text-slate-400" /> Profile And
                    settings
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('refreshToken');
                      localStorage.removeItem('user');
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-expanded={isProfileMenuOpen}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/20 transition-colors"
            >
              {/* <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-white font-bold text-sm">M</span>
              </div> */}
              <span className="text-sm font-medium">{user?.fullName || 'User'}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
