import { useState } from "react";
import { Building2, Coins, Layout, Bell, Shield, Database, ChevronRight, Save } from "lucide-react";
import { Switch } from "@heroui/react";

function Settings() {
  const [activeTab, setActiveTab] = useState("company");
  const [autoBackup, setAutoBackup] = useState(true);

  const tabs = [
    { id: "company", icon: Building2, label: "Company Information" },
    { id: "currency", icon: Coins, label: "Currency & Units" },
    { id: "invoice", icon: Layout, label: "Invoice Layouts" },
    { id: "notification", icon: Bell, label: "Notification Channels" },
    { id: "security", icon: Shield, label: "Security & Roles" },
    { id: "backup", icon: Database, label: "Database Backups" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-3">
        <div className="text-xs">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Dashboard
          </span>

          <span className="mx-1">/</span>

          <span>Settings</span>
        </div>
        <div className="pb-2 my-1">
          <h1 className=" text-2xl font-bold tracking-tight text-BLUE-dark">
            System Settings
          </h1>

          <p className="text-sm text-tertiary mt-2">
            Configure global preferences, financial periods, tax rates, and
            backup routines
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full mt-2.5  ">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              System Settings
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Configure your LPG plant settings
            </p>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-3 overflow-y-auto col-span-2">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Company Profile Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Company Profile Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Al-Madina LPG Plant"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Registration No.
                    </label>
                    <input
                      type="text"
                      defaultValue="BR-2024-158-4521"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      National Tax Number (NTN)
                    </label>
                    <input
                      type="text"
                      defaultValue="4521387-9"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      defaultValue="+92-51-4851234"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Physical Office Address
                    </label>
                    <input
                      type="text"
                      defaultValue="Plot 45-B, Industrial Area, Sector 1-9, Islamabad, Pakistan"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@almadina-lpg.pk"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="flex items-center gap-2 bg-gradient-bg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Save className="h-4 w-4" />
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Operational & Financial Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Operational & Financial Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Payment Terms
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                      <option>Net 30 Days</option>
                      <option>Net 15 Days</option>
                      <option>Net 45 Days</option>
                      <option>Net 60 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Financial Year Cycle
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                      <option>July - June</option>
                      <option>January - December</option>
                      <option>April - March</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sales Tax Rate (GST)
                    </label>
                    <input
                      type="text"
                      defaultValue="17%"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Alert Level
                    </label>
                    <input
                      type="text"
                      defaultValue="20% of minimum threshold"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cylinder Auto-Inspection Interval
                    </label>
                    <input
                      type="text"
                      defaultValue="180 Days"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="flex items-center gap-2 bg-gradient-bg-blue  text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </button>
                </div>
              </div>

              {/* Localisation & Automated Systems */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Localisation & Automated Systems
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Formatting
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Zone
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                      <option>Asia/Karachi (PKT +05:00)</option>
                      <option>UTC</option>
                      <option>Asia/Dubai (GST +04:00)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Automated Server Cloud Backups
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Automatically backup SQLite operational databases every
                      night at 02:00 AM
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3">
                      <Switch
                        isSelected={autoBackup}
                        onValueChange={setAutoBackup}
                        classNames={{
                          wrapper: autoBackup ? "bg-[#008951]" : "bg-slate-200",
                        }}
                        size="sm"
                      />
                      <button
                        type="button"
                        onClick={() => setAutoBackup(!autoBackup)}
                        className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoBackup ? "bg-[#10b981]" : "bg-slate-200"}`}
                        role="switch"
                        aria-checked={autoBackup}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoBackup ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center my-auto">
                  <p className="text-[#9CA3AF] text-[11px]">
                    Last Settings update by Admin (Muhammad Ahmad) on 20 Aug
                    2026
                  </p>
                  <button className="flex items-center gap-2 bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Save className="h-4 w-4" />
                    Save Config
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
