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
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
    <div className="h-screen flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ease-in-out bg-gradient-primary-vertical">
      <div className="p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-xl font-bold">LPG Plant ERP</h1>
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
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="transition-transform hover:scale-110 active:scale-95">
                    <Icon
                      className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}
                    />
                  </div>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.notification && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {item.notification}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
