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
  CreditCard,
  Building,
  Loader,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/Images/logo.jpeg";
import { useCurrentUser } from "../queries/auth/auth.queries";
import { useRoleById } from "../queries/roles/roles.queries";

const isAllowedAccess = (permission) => {
  const access = String(permission?.access || "").trim().toLowerCase();
  const label = String(permission?.accessLabel || "").trim().toLowerCase();

  // Explicitly hide none / no access
  if (
    !access ||
    access === "none" ||
    access === "no" ||
    access === "no-access" ||
    access === "no_access" ||
    label === "no access" ||
    label.includes("no access")
  ) {
    return false;
  }

  // Only full and view appear in the sidebar
  return (
    access === "full" ||
    access === "view" ||
    label.includes("full") ||
    label.includes("view")
  );
};

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/Dashboard",
    // Always visible — no module gate
    modules: null,
  },
  {
    icon: Users,
    label: "Users & Roles",
    path: "/users-roles",
    modules: ["users", "roles"],
  },
  {
    icon: Users,
    label: "Customers",
    path: "/customers",
    modules: ["customers"],
  },
  {
    icon: Truck,
    label: "Suppliers",
    path: "/suppliers",
    modules: ["suppliers"],
  },
  {
    icon: Package,
    label: "Cylinder Types",
    path: "/cylinder-types",
    activePrefixes: [
      "/cylinders/add-type",
      "/cylinders/edit-type",
      "/cylinders/view-type",
    ],
    modules: ["cylinder-types"],
  },
  {
    icon: Warehouse,
    label: "Storage Tanks",
    path: "/storage-tanks",
    modules: ["storage-tanks"],
  },
  {
    icon: Receipt,
    label: "LPG Receipts",
    path: "/lpg-receipts",
    modules: ["lpg-receipts"],
  },
  {
    icon: Layers,
    label: "Filling Batches",
    path: "/filling-batches",
    modules: ["filling-batches"],
  },
  {
    icon: Package,
    label: "Inventory",
    path: "/inventory",
    modules: ["inventory-items"],
  },
  {
    icon: DollarSign,
    label: "Accounting",
    path: "/accounting",
    modules: ["accounts"],
  },
  {
    icon: DollarSign,
    label: "Sales",
    path: "/sales",
    modules: ["sales"],
  },
  {
    icon: DollarSign,
    label: "Payments",
    path: "/payments",
    modules: ["payments"],
  },
  {
    icon: Building,
    label: "Fixed Assets",
    path: "/assets",
    activePrefixes: ["/maintenance-records", "/maintenance-assets"],
    modules: ["assets"],
  },
  {
    icon: Users,
    label: "Employees",
    path: "/employees",
    modules: ["employees"],
  },
  {
    icon: CreditCard,
    label: "Expenses",
    path: "/expenses",
    modules: ["expenses"],
  },
  {
    icon: ShieldCheck,
    label: "Audit Logs",
    path: "/audit-logs",
    modules: ["audit-logs"],
  },
];

const canShowMenuItem = (item, allowedModules) => {
  if (!item.modules) return true;
  if (!allowedModules?.size) return false;

  return item.modules.some((moduleName) => allowedModules.has(moduleName));
};

const normalizePath = (path) => path.replace(/\/+$/, "") || "/";

const isMenuItemActive = (item, pathname) => {
  const current = normalizePath(pathname).toLowerCase();
  const prefixes = [item.path, ...(item.activePrefixes || [])];

  return prefixes.some((prefix) => {
    const base = normalizePath(prefix).toLowerCase();
    return current === base || current.startsWith(`${base}/`);
  });
};

const Sidebar = () => {
  const location = useLocation();
  const {
    data: currentUserResponse,
    isLoading: isUserLoading,
  } = useCurrentUser();
  const currentUser = currentUserResponse?.data;
  const roleId = currentUser?.roleId || currentUser?.role?._id;

  const {
    data: roleResponse,
    isLoading: isRoleLoading,
  } = useRoleById(roleId);
  const role = roleResponse?.data?.role || roleResponse?.data;
  const permissionsPreview = role?.permissionsPreview || [];

  const isSidebarLoading = isUserLoading || (!!roleId && isRoleLoading);

  // Only modules with access "full" or "view" — never "none"
  const allowedModules = new Set(
    permissionsPreview
      .filter(isAllowedAccess)
      .map((permission) => permission.moduleName)
      .filter(Boolean)
  );

  const visibleMenuItems = menuItems.filter((item) =>
    canShowMenuItem(item, allowedModules)
  );

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
        {isSidebarLoading ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3">
            <Loader className="h-7 w-7 animate-spin text-white/80" />
            <p className="text-xs text-white/50">Loading menu...</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isMenuItemActive(item, location.pathname);
              return (
                <li key={item.path}>
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
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
