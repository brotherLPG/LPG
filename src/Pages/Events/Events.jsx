import { motion } from "framer-motion";
import { Calendar, Camera, CheckCircle2, Clock, Filter, MapPin, Search, ShieldAlert } from "lucide-react";

function Events() {
  const events = [
    { id: 1, title: "No Helmet Detected", camera: "IP Camera 2", location: "Production Area 1", time: "Today, 10:30:18", status: "Open", tone: "red" },
    { id: 2, title: "Safety Inspection Completed", camera: "IP Camera 1", location: "Assembly Line A", time: "Today, 10:20:30", status: "Completed", tone: "green" },
    { id: 3, title: "Unauthorized Access", camera: "IP Camera 3", location: "Gate 2", time: "Today, 10:15:42", status: "Investigating", tone: "orange" },
    { id: 4, title: "Helmet Detected", camera: "IP Camera 4", location: "Warehouse", time: "Today, 09:48:12", status: "Completed", tone: "green" },
    { id: 5, title: "Restricted Zone Entry", camera: "IP Camera 1", location: "Maintenance Bay", time: "Today, 09:30:06", status: "Open", tone: "red" }
  ];

  const statusClasses = {
    red: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    green: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">MONITORING HISTORY</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800 dark:text-gray-100">Events</h1>
        <p className="mt-2 text-slate-500 dark:text-gray-400">Review safety, access, and system events from all cameras.</p>
      </motion.div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Today&apos;s Events</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-gray-100">24</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Open Events</p>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">5</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Resolved Today</p>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">19</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white dark:bg-gray-900 p-5 shadow-xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">Event Log</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-gray-700 px-3 py-2 text-sm text-slate-500 dark:text-gray-400">
              <Search className="h-4 w-4" />
              <input className="w-full outline-none sm:w-48" placeholder="Search events" />
            </label>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800">
              <Filter className="h-4 w-4" /> Filter
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col gap-4 rounded-xl border border-slate-100 dark:border-gray-800 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 md:flex-row md:items-center"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${event.tone === "red" ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400" : event.tone === "orange" ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400" : "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"}`}>
                {event.tone === "green" ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 dark:text-gray-100">{event.title}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Camera className="h-3.5 w-3.5" />{event.camera}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{event.time}</span>
                </div>
              </div>
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClasses[event.tone]}`}>{event.status}</span>
            </motion.div>
          ))}
        </div>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-gray-700 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
          <Calendar className="h-4 w-4" /> Load More Events
        </button>
      </motion.div>
    </div>
  );
}

export default Events;
