import { motion } from "framer-motion";
import { BarChart3, CalendarDays, Download, FileText, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";

function Reports() {
  const reports = [
    { id: 1, title: "Daily Safety Summary", description: "Safety violations, compliance score, and resolved alerts.", period: "20 July 2026", type: "Safety" },
    { id: 2, title: "Weekly Camera Performance", description: "Camera uptime, connection quality, and device health.", period: "14–20 July 2026", type: "System" },
    { id: 3, title: "Monthly Incident Report", description: "All access and safety incidents recorded this month.", period: "July 2026", type: "Incident" },
    { id: 4, title: "PPE Compliance Report", description: "Helmet and safety-equipment detection results by area.", period: "July 2026", type: "Compliance" }
  ];

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">ANALYTICS & INSIGHTS</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">Reports</h1>
          <p className="mt-2 text-slate-500">Track safety performance and export important system data.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"><Download className="h-4 w-4" /> Export Report</button>
      </motion.div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Safety Score</p><ShieldCheck className="h-5 w-5 text-green-500" /></div><p className="mt-2 text-3xl font-bold text-slate-800">94%</p><p className="mt-1 flex items-center gap-1 text-sm text-green-600"><TrendingUp className="h-4 w-4" /> 3% from last month</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Total Incidents</p><BarChart3 className="h-5 w-5 text-orange-500" /></div><p className="mt-2 text-3xl font-bold text-slate-800">37</p><p className="mt-1 flex items-center gap-1 text-sm text-green-600"><TrendingDown className="h-4 w-4" /> 12% from last month</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Reports Generated</p><FileText className="h-5 w-5 text-blue-500" /></div><p className="mt-2 text-3xl font-bold text-slate-800">18</p><p className="mt-1 text-sm text-slate-500">This month</p></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-bold text-slate-800">Available Reports</h2><button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"><CalendarDays className="h-4 w-4" /> Select Date Range</button></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reports.map((report, index) => (
            <motion.article key={report.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-4 rounded-2xl border border-slate-100 p-5 transition-shadow hover:shadow-lg">
              <div className="h-fit rounded-xl bg-blue-100 p-3"><FileText className="h-6 w-6 text-blue-600" /></div>
              <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h3 className="font-bold text-slate-800">{report.title}</h3><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{report.type}</span></div><p className="mt-2 text-sm text-slate-500">{report.description}</p><div className="mt-4 flex items-center justify-between"><p className="text-xs font-medium text-slate-400">{report.period}</p><button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"><Download className="h-4 w-4" /> Download</button></div></div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Reports;
