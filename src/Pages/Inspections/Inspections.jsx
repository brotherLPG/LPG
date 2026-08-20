import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react";

function Inspections() {
  const [searchTerm, setSearchTerm] = useState("");

  const inspections = [
    { id: "INS-001", cylinderId: "LPG-2456", inspector: "Ali Hassan", type: "Safety Check", date: "2026-01-15", result: "Passed", notes: "No issues found" },
    { id: "INS-002", cylinderId: "LPG-2457", inspector: "Sara Ahmed", type: "Safety Check", date: "2026-01-14", result: "Failed", notes: "Valve leak detected" },
    { id: "INS-003", cylinderId: "LPG-2458", inspector: "Ali Hassan", type: "Pressure Test", date: "2026-01-13", result: "Passed", notes: "Pressure within limits" },
    { id: "INS-004", cylinderId: "LPG-2459", inspector: "Bilal Khan", type: "Safety Check", date: "2026-01-12", result: "Pending", notes: "Awaiting results" },
  ];

  const filteredInspections = inspections.filter(insp =>
    insp.cylinderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insp.inspector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-linear-to-br from-emerald-50 to-blue-100 w-full">
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Safety Inspections</h1>
          <p className="text-slate-500">Manage cylinder safety inspections and approvals</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg"><ShieldCheck className="w-5 h-5 text-emerald-600" /></div>
              <span className="text-slate-500 text-sm">Total Inspections</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">1,245</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
              <span className="text-slate-500 text-sm">Passed</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">1,180</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-lg"><XCircle className="w-5 h-5 text-red-600" /></div>
              <span className="text-slate-500 text-sm">Failed</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">48</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-2 rounded-lg"><AlertTriangle className="w-5 h-5 text-orange-600" /></div>
              <span className="text-slate-500 text-sm">Pending</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">17</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search by cylinder ID or inspector..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition" />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-5 h-5" /> New Inspection
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Inspection ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Cylinder ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Inspector</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Result</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.map((insp) => (
                  <tr key={insp.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{insp.id}</td>
                    <td className="px-6 py-4 text-slate-600">{insp.cylinderId}</td>
                    <td className="px-6 py-4 text-slate-600">{insp.inspector}</td>
                    <td className="px-6 py-4 text-slate-600">{insp.type}</td>
                    <td className="px-6 py-4 text-slate-600">{insp.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        insp.result === 'Passed' ? 'bg-green-100 text-green-700' :
                        insp.result === 'Failed' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>{insp.result}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{insp.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Inspections;
