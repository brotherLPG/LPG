import { 
  ChevronUp,
  LayoutDashboard, 
  Package, 
  ScanBarcode, 
  ShieldCheck, 
  DollarSign, 
  FileText,
  Calculator,
  Building2,
  Settings,
  LogOut,
  UserRound,
  Languages
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/Dashboard",
    },
    {
      icon: Package,
      label: "Cylinders",
      path: "/cylinders",
    },
    {
      icon: ScanBarcode,
      label: "Registration",
      path: "/registration",
    },
    {
      icon: ShieldCheck,
      label: "Inspections",
      path: "/inspections",
    },
    {
      icon: DollarSign,
      label: "Sales",
      path: "/sales",
    },
    {
      icon: FileText,
      label: "Invoices",
      path: "/invoices",
    },
    {
      icon: Calculator,
      label: "Accounting",
      path: "/accounting",
    },
    {
      icon: Building2,
      label: "Branches",
      path: "/branches",
    },
    {
      icon: FileText,
      label: "Reports",
      path: "/reports",
    },
  ];

  return (
    <div className=" h-screen bg-linear-to-b from-emerald-900 to-blue-900 flex flex-col shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-emerald-700 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-r from-emerald-500 to-blue-500 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-xl font-bold">GasFlow ERP</h1>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-800/50 text-emerald-100 hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Languages className="w-4 h-4" />
            {language === 'en' ? 'EN' : 'اردو'}
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-linear-to-r from-emerald-600 to-blue-600 text-white shadow-lg shadow-emerald-500/30"
                      : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon
                      className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-emerald-200 group-hover:text-white"}`}
                    />
                  </motion.div>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.notification && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                    >
                      {item.notification}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative p-2 border-t border-emerald-700 shrink-0">
        {isProfileMenuOpen && (
          <div className="absolute bottom-[calc(100%-0.5rem)] left-4 right-4 mb-2 overflow-hidden rounded-xl border border-emerald-600 bg-emerald-900 shadow-2xl">
            <button onClick={() => { setIsProfileMenuOpen(false); navigate('/settings'); }} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-emerald-100 hover:bg-emerald-800">
              <UserRound className="h-4 w-4" /> Profile & Settings
            </button>
            <button onClick={() => navigate('/')} className="flex w-full items-center gap-3 border-t border-emerald-700 px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-emerald-800">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
        <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} aria-expanded={isProfileMenuOpen} className="flex w-full items-center gap-3 rounded-xl bg-emerald-800/50 p-4 text-left transition-colors hover:bg-emerald-800">
            <div className="w-10 h-10 bg-linear-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Admin User</p>
              <p className="text-emerald-200 text-xs">System Administrator</p>
            </div>
            <ChevronUp className={`h-4 w-4 text-emerald-300 transition-transform ${isProfileMenuOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
