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
    <div className=" h-screen bg-linear-to-b from-emerald-900 to-blue-900 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-6 border-b border-emerald-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-r from-emerald-500 to-blue-500 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-xl font-bold">GasFlow ERP</h1>
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
                  <div className="transition-transform hover:scale-110 active:scale-95">
                    <Icon
                      className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-emerald-200 group-hover:text-white"}`}
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
