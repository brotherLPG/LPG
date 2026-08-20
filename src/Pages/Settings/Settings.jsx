import { motion } from "framer-motion";
import { Bell, Building2, ChevronRight, Globe2, KeyRound, LockKeyhole, Mail, Save, ShieldCheck, UserRound } from "lucide-react";

function Settings() {
  const settings = [
    { icon: Bell, title: "Alert Notifications", description: "Receive alerts for safety and access events.", enabled: true },
    { icon: Mail, title: "Email Reports", description: "Send the daily safety report to administrators.", enabled: true },
    { icon: Globe2, title: "System Time Zone", description: "Asia/Karachi (GMT+5)", action: "Change" },
    { icon: Building2, title: "Organization Details", description: "GTRACK-MES Manufacturing Facility", action: "Edit" }
  ];

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm font-semibold text-blue-600">SYSTEM MANAGEMENT</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800">Settings</h1>
        <p className="mt-2 text-slate-500">Manage your account, notifications, and system preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-6 shadow-xl xl:col-span-2">
          <div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3"><UserRound className="h-6 w-6 text-blue-600" /></div><div><h2 className="font-bold text-slate-800">Profile Settings</h2><p className="text-sm text-slate-500">Your administrator account details.</p></div></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Full Name<input defaultValue="Admin User" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" /></label>
            <label className="text-sm font-medium text-slate-700">Email Address<input defaultValue="admin@gtrack-mes.com" type="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Role<input defaultValue="System Administrator" disabled className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-500" /></label>
          </div>
          <button className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"><Save className="h-4 w-4" /> Save Profile</button>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
          <ShieldCheck className="h-10 w-10 text-blue-400" />
          <h2 className="mt-5 text-xl font-bold">Security Status</h2>
          <p className="mt-2 text-sm text-slate-400">Your account and connected devices are protected.</p>
          <div className="mt-6 rounded-xl bg-slate-800 p-4"><p className="text-sm font-medium text-slate-300">Two-factor authentication</p><p className="mt-1 text-sm font-bold text-green-400">Enabled</p></div>
          <button className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"><KeyRound className="h-4 w-4" /> Manage security</button>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white p-6 shadow-xl xl:col-span-3">
          <h2 className="mb-1 text-xl font-bold text-slate-800">Preferences</h2><p className="mb-5 text-sm text-slate-500">Configure how GTRACK-MES communicates with you.</p>
          <div className="divide-y divide-slate-100">
            {settings.map((setting) => {
              const Icon = setting.icon;
              return <div key={setting.title} className="flex items-center gap-4 py-4"><div className="rounded-xl bg-slate-100 p-3"><Icon className="h-5 w-5 text-slate-600" /></div><div className="flex-1"><h3 className="font-semibold text-slate-800">{setting.title}</h3><p className="text-sm text-slate-500">{setting.description}</p></div>{typeof setting.enabled === "boolean" ? <button aria-label={`Toggle ${setting.title}`} className={`relative h-7 w-12 rounded-full transition-colors ${setting.enabled ? "bg-blue-600" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${setting.enabled ? "translate-x-6" : "translate-x-1"}`} /></button> : <button className="flex items-center gap-1 text-sm font-semibold text-blue-600">{setting.action}<ChevronRight className="h-4 w-4" /></button>}</div>;
            })}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-red-100 bg-white p-6 shadow-xl xl:col-span-3"><div className="flex items-start gap-4"><div className="rounded-xl bg-red-100 p-3"><LockKeyhole className="h-5 w-5 text-red-600" /></div><div><h2 className="font-bold text-slate-800">Password & Access</h2><p className="mt-1 text-sm text-slate-500">Change your password or manage access permissions for your account.</p><button className="mt-4 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Change Password</button></div></div></motion.section>
      </div>
    </div>
  );
}

export default Settings;
