import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Phone, Mail, Users, Search, Plus } from "lucide-react";

function Branches() {
  const [searchTerm, setSearchTerm] = useState("");

  const branches = [
    { id: "BR-001", name: "Main Branch - Lahore", location: "123 Main Road, Lahore", manager: "Ali Hassan", phone: "042-XXXXXXX", email: "lahore@gasflow.com", staff: 25, status: "Active" },
    { id: "BR-002", name: "Karachi Branch", location: "456 Shahrah-e-Faisal, Karachi", manager: "Sara Ahmed", phone: "021-XXXXXXX", email: "karachi@gasflow.com", staff: 30, status: "Active" },
    { id: "BR-003", name: "Islamabad Branch", location: "789 Blue Area, Islamabad", manager: "Usman Khan", phone: "051-XXXXXXX", email: "islamabad@gasflow.com", staff: 20, status: "Active" },
    { id: "BR-004", name: "Faisalabad Branch", location: "321 Clock Tower, Faisalabad", manager: "Bilal Ahmed", phone: "041-XXXXXXX", email: "faisalabad@gasflow.com", staff: 15, status: "Active" },
    { id: "BR-005", name: "Multan Branch", location: "654 Bosan Road, Multan", manager: "Tariq Mehmood", phone: "060-XXXXXXX", email: "multan@gasflow.com", staff: 18, status: "Active" },
  ];

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-linear-to-br from-emerald-50 to-blue-100 w-full">
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Branch Management</h1>
          <p className="text-slate-500">Monitor and manage multiple branches with central owner-level control</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg"><Building2 className="w-5 h-5 text-emerald-600" /></div>
              <span className="text-slate-500 text-sm">Total Branches</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">5</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg"><Building2 className="w-5 h-5 text-green-600" /></div>
              <span className="text-slate-500 text-sm">Active</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">5</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
              <span className="text-slate-500 text-sm">Total Staff</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">108</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-2 rounded-lg"><MapPin className="w-5 h-5 text-teal-600" /></div>
              <span className="text-slate-500 text-sm">Cities Covered</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">5</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search branches..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition" />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30">
            <Plus className="w-5 h-5" /> Add Branch
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Branch ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Manager</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Phone</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Staff</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBranches.map((branch) => (
                  <tr key={branch.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{branch.id}</td>
                    <td className="px-6 py-4 text-slate-600">{branch.name}</td>
                    <td className="px-6 py-4 text-slate-600">{branch.location}</td>
                    <td className="px-6 py-4 text-slate-600">{branch.manager}</td>
                    <td className="px-6 py-4 text-slate-600">{branch.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{branch.email}</td>
                    <td className="px-6 py-4 text-slate-600">{branch.staff}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${branch.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{branch.status}</span>
                    </td>
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

export default Branches;
