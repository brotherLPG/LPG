import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, UserRound, LogOut, Bell, Menu, X, Search, Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Header({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('Rawalpindi Plant');

  const plants = [
    'Rawalpindi Plant',
    'Islamabad Plant',
    'Lahore Plant',
    'Karachi Plant'
  ];

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
        {/* Left Side - Menu Toggle & Search */}
        {/* <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

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
          <div className="relative">
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
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                1
              </span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                    <p className="text-sm text-slate-800 font-medium">
                      Cylinder inspection due
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      LPG-2459 needs safety check
                    </p>
                    <p className="text-xs text-slate-400 mt-1">2 min ago</p>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-200">
                  <button className="w-full text-sm font-medium hover:underline text-accent-blue">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-200 bg-gradient-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Muhammad Ahmad</p>
                      <p className="text-white/70 text-xs">
                        System Administrator
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserRound className="h-4 w-4 text-slate-400" /> Profile
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => navigate("/")}
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
              <span className="text-sm font-medium">Muhammad Ahmad</span>
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
