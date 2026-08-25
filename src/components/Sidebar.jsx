import { 
  LayoutDashboard, 
  Package, 
  ShieldCheck, 
  DollarSign,
  Users,
  Truck,
  Warehouse,
  Receipt,
  Layers,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../assets/Images/logo.jpeg";

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
      icon: Users,
      label: "Users & Roles",
      path: "/users-roles",
    },
    {
      icon: Users,
      label: "Customers",
      path: "/customers",
    },
    {
      icon: Truck,
      label: "Suppliers",
      path: "/suppliers",
    },
    {
      icon: Package,
      label: "Cylinder Types",
      path: "/cylinder-types",
    },
    {
      icon: Warehouse,
      label: "Storage Tanks",
      path: "/storage-tanks",
    },
    {
      icon: Receipt,
      label: "LPG Receipts",
      path: "/lpg-receipts",
    },
    {
      icon: Layers,
      label: "Filling Batches",
      path: "/filling-batches",
    },
    {
      icon: Package,
      label: "Inventory",
      path: "/inventory",
    },
    {
      icon: DollarSign,
      label: "Sales",
      path: "/sales",
    },
    {
      icon: DollarSign,
      label: "Payments",
      path: "/payments",
    },
    {
      icon: Users,
      label: "Employees",
      path: "/employees",
    },
    {
      icon: CreditCard,
      label: "Expenses",
      path: "/expenses",
    },
    {
      icon: ShieldCheck,
      label: "Audit Logs",
      path: "/audit-logs",
    },
  ];

  return (
    <div className="h-screen flex flex-col w-64 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out bg-gradient-primary-vertical">
      {/* Logo Section */}
      <div className="p-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1">
          <div className="bg-white/20 p-1 rounded-xl backdrop-blur-sm">
            <img src={logo} alt="Logo" className="h-12 w-12 border rounded-sm" />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold">Brother LPG</h1>
            <p className="text-white/50 text-xs">ERP Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}
                  />
                  <span className="flex-1 font-medium text-sm">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* User Section */}
      <div className="p-2 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              Admin User
            </p>
            <p className="text-white/50 text-xs truncate">admin@lpgplant.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
