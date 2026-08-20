import { motion } from "framer-motion";
import { Camera, CheckCircle2, CircleAlert, MapPin, MonitorCog, MoreHorizontal, Plus, Search, Wifi } from "lucide-react";

function Devices() {
  const devices = [
    { id: 1, name: "IP Camera 1", location: "Production Area 1", status: "Online", lastSeen: "Live now", alerts: 0 },
    { id: 2, name: "IP Camera 2", location: "Production Area 2", status: "Online", lastSeen: "Live now", alerts: 2 },
    { id: 3, name: "IP Camera 3", location: "Main Gate", status: "Attention", lastSeen: "3 min ago", alerts: 1 },
    { id: 4, name: "IP Camera 4", location: "Warehouse", status: "Online", lastSeen: "Live now", alerts: 0 },
    { id: 5, name: "IP Camera 5", location: "Assembly Line A", status: "Offline", lastSeen: "27 min ago", alerts: 0 },
    { id: 6, name: "IP Camera 6", location: "Parking Area", status: "Online", lastSeen: "Live now", alerts: 0 }
  ];

  const statusClass = {
    Online: "bg-green-100 text-green-700",
    Attention: "bg-orange-100 text-orange-700",
    Offline: "bg-slate-200 text-slate-600"
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">SYSTEM MANAGEMENT</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">Devices</h1>
          <p className="mt-2 text-slate-500">Monitor and manage your connected cameras and sensors.</p>
        </div>
        {/* <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Device
        </button> */}
      </motion.div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">Total Devices</p><p className="mt-2 text-3xl font-bold text-slate-800">24</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">Online</p><p className="mt-2 text-3xl font-bold text-green-600">21</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">Require Attention</p><p className="mt-2 text-3xl font-bold text-orange-600">3</p></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-800">Connected Devices</h2>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input className="w-full outline-none sm:w-52" placeholder="Search devices" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((device, index) => (
            <motion.article key={device.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-slate-100 p-5 transition-shadow hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-3"><Camera className="h-6 w-6 text-blue-600" /></div>
                  <div><h3 className="font-bold text-slate-800">{device.name}</h3><p className="text-sm text-slate-500">Security camera</p></div>
                </div>
                <button aria-label={`More options for ${device.name}`} className="text-slate-400 hover:text-slate-700"><MoreHorizontal className="h-5 w-5" /></button>
              </div>
              <div className="mt-5 space-y-2 text-sm text-slate-500">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{device.location}</p>
                <p className="flex items-center gap-2"><Wifi className="h-4 w-4" />Last seen: {device.lastSeen}</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[device.status]}`}>{device.status}</span>
                {device.alerts > 0 ? <span className="flex items-center gap-1 text-xs font-semibold text-red-600"><CircleAlert className="h-4 w-4" />{device.alerts} alert{device.alerts > 1 ? "s" : ""}</span> : <span className="flex items-center gap-1 text-xs font-semibold text-green-600"><CheckCircle2 className="h-4 w-4" />Healthy</span>}
              </div>
            </motion.article>
          ))}
        </div>
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"><MonitorCog className="h-4 w-4" /> Manage All Devices</button>
      </motion.div>
    </div>
  );
}

export default Devices;
