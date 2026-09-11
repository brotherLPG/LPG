import { useState } from "react";
import { Building2, Coins, Layout, Bell, Shield, Database, KeyRound, ChevronRight, Save, Eye, EyeOff } from "lucide-react";
import { Switch } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useChangePassword, useCurrentUser } from "../../queries/auth/auth.queries";
import { useUpdateUser } from "../../queries/users/users.queries";
import { queryKeys } from "../../queries/queryKeys";
import { useToast } from "../../utils/GlobalToast";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Settings() {
  const [activeTab, setActiveTab] = useState("company");
  const [autoBackup, setAutoBackup] = useState(true);
  const [editedFields, setEditedFields] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: currentUserResponse, isLoading, error } = useCurrentUser();
  const updateMutation = useUpdateUser();
  const changePasswordMutation = useChangePassword();
  const user = currentUserResponse?.data;
  const form = {
    fullName: editedFields.fullName ?? user?.fullName ?? "",
    email: editedFields.email ?? user?.emailAddress ?? "",
    phone: user?.phoneNumber ?? "",
    cnic: user?.cnicNumber ?? "",
    username: user?.username ?? "",
    role: user?.role?.roleName ?? "",
  };

  const updateField = (key) => (event) =>
    setEditedFields((current) => ({ ...current, [key]: event.target.value }));

  const updatePasswordField = (key) => (event) =>
    setPasswordForm((current) => ({ ...current, [key]: event.target.value }));

  const togglePasswordVisibility = (key) =>
    setShowPasswords((current) => ({ ...current, [key]: !current[key] }));

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!user?._id) return;

    try {
      await updateMutation.mutateAsync({
        id: user._id,
        data: {
          fullName: form.fullName,
          emailAddress: form.email,
          roleId: user.roleId || user.role?._id,
          employeeId: user.employeeId?._id || user.employeeId || "",
          isActive: Boolean(user.isActive),
        },
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser(),
      });
      setEditedFields({});
      toast.success("Profile updated successfully!");
    } catch (updateError) {
      toast.error(
        updateError.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Current password and new password are required.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully!");
    } catch (passwordError) {
      toast.error(
        passwordError.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    }
  };

  const tabs = [
    { id: "company", icon: Building2, label: "Company Information" },
    // { id: "currency", icon: Coins, label: "Currency & Units" },
    // { id: "invoice", icon: Layout, label: "Invoice Layouts" },
    // { id: "notification", icon: Bell, label: "Notification Channels" },
    // { id: "security", icon: Shield, label: "Security & Roles" },
    { id: "password", icon: KeyRound, label: "Change Password" },
    // { id: "backup", icon: Database, label: "Database Backups" },
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
              {activeTab !== "password" && (
              <form
                onSubmit={handleUpdateProfile}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Account Profile Details
                </h2>

                {isLoading && (
                  <p className="py-6 text-sm text-slate-500">Loading current user...</p>
                )}

                {error && !isLoading && (
                  <p className="py-6 text-sm text-red-500">
                    Unable to load current user.
                  </p>
                )}

                {!isLoading && !error && user && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={updateField("fullName")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          value={form.username}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-slate-50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Official Email Address
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={updateField("email")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Phone
                        </label>
                        <input
                          type="text"
                          value={form.phone}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-slate-50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CNIC Number
                        </label>
                        <input
                          type="text"
                          value={form.cnic}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-slate-50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assigned Role
                        </label>
                        <input
                          type="text"
                          value={form.role}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-slate-50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <input
                          type="text"
                          value={user.isActive ? "Active" : "Inactive"}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-slate-50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Login
                        </label>
                        <input
                          type="text"
                          value={formatDate(user.lastLoginAt)}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-slate-50 outline-none"
                        />
                      </div>
                    </div>

                   
                  </>
                )}
              </form>
              )}

              {activeTab === "password" && (
              <form
                onSubmit={handleChangePassword}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Change Password
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your current password and choose a new one.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <span className="relative block">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={updatePasswordField("currentPassword")}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </div>

                  <div className="hidden md:block" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <span className="relative block">
                      <input
                        type={showPasswords.next ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={updatePasswordField("newPassword")}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("next")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPasswords.next ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <span className="relative block">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={updatePasswordField("confirmPassword")}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="flex items-center gap-2 bg-gradient-bg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {changePasswordMutation.isPending
                      ? "Updating..."
                      : "Change Password"}
                  </button>
                </div>
              </form>
              )}

              {activeTab !== "password" && (
              <>
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
                    Last Settings update by {user?.fullName || "—"}
                    {user?.username ? ` (${user.username})` : ""} on{" "}
                    {formatDate(user?.updatedAt)}
                  </p>
                  <button className="flex items-center gap-2 bg-[#10B981] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Save className="h-4 w-4" />
                    Save Config
                  </button>
                </div>
              </div>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
