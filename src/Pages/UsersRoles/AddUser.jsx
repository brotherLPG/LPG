import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

function AddUser() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <p className="text-xs">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/users-roles")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Users & Roles
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Add User</span>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Add User
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a new system user account and assign role permissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: User Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[15px] font-bold text-slate-800">
                User Information
              </h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="Bilal Hassan"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    defaultValue="bilal.hassan@almadina-lpg.pk"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="0321-5678901"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    CNIC Number
                  </label>
                  <input
                    type="text"
                    defaultValue="35201-1234567-9"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                  />
                  <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                    13-digit Pakistani National ID Card number.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Login Credentials */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[15px] font-bold text-slate-800">
                Login Credentials
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="bilal.hassan"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      defaultValue="password123"
                      className="w-full rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      defaultValue="password123"
                      className="w-full rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 3: Role & Security Config */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[15px] font-bold text-slate-800">
                Role & Security Config
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Assigned Role <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="Plant Operator"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                  >
                    <option value="Plant Operator">Plant Operator</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Sales Executive">Sales Executive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Linked Employee
                </label>
                <div className="relative mb-3">
                  <select
                    defaultValue="Bilal Hassan"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                  >
                    <option value="Bilal Hassan">Bilal Hassan</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
                
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-600">Role Description:</span> Manages daily plant operations, filling batches, and cylinder inventory tracking.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#008951]"></div>
                  <select
                    defaultValue="Active"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-7 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Role Permissions Preview */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[15px] font-bold text-slate-800">
                Role Permissions Preview
              </h2>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-slate-100">
                {[
                  { name: "Dashboard", access: "Full Access" },
                  { name: "Storage Tanks", access: "Full Access" },
                  { name: "Filling Batches", access: "Full Access" },
                  { name: "Inventory", access: "Full Access" },
                  { name: "Cylinder Types", access: "View Only" },
                  { name: "Sales", access: "View Only" },
                  { name: "Customers", access: "No Access" },
                  { name: "Accounts", access: "No Access" },
                ].map((item, index) => {
                  let badgeClass = "";
                  if (item.access === "Full Access") {
                    badgeClass = "bg-emerald-50 text-emerald-600";
                  } else if (item.access === "View Only") {
                    badgeClass = "bg-blue-50 text-blue-600";
                  } else {
                    badgeClass = "bg-slate-100 text-slate-500";
                  }

                  return (
                    <li key={index} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                      <span className="text-[13px] font-bold text-slate-700">{item.name}</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badgeClass}`}>
                        {item.access}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/users-roles")}
          className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => navigate("/users-roles")}
          className="rounded-lg bg-[#008951] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#007545]"
        >
          Create User
        </button>
      </div>
    </main>
  );
}

export default AddUser;
