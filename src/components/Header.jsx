import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, UserRound, LogOut, Bell, Menu, X, Search, Building2, MapPin, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Header({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('Rawalpindi Plant');
  const [user, setUser] = useState(null);
  
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const plantDropdownRef = useRef(null);

  const plants = [
    'Rawalpindi Plant',
    'Islamabad Plant',
    'Lahore Plant',
    'Karachi Plant'
  ];

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Cylinder Registered Successfully',
      message: 'LPG-2459 has been registered with barcode',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Cylinder stock below threshold at Branch #2',
      time: '15 min ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New Invoice Generated',
      message: 'INV-2026-0460 has been created',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Payment Received',
      message: 'PKR 25,000 received from customer #1234',
      time: '2 hours ago',
      read: true
    },
  ];

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
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold text-white">
                2
              </span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>
                  <span className="text-xs text-slate-500">2 unread</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-colors ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            notification.type === "success"
                              ? "bg-green-100"
                              : notification.type === "warning"
                                ? "bg-orange-100"
                                : "bg-blue-100"
                          }`}
                        >
                          {notification.type === "success" && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {notification.type === "warning" && (
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                          )}
                          {notification.type === "info" && (
                            <Info className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
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
