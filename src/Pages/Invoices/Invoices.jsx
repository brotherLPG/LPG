import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Search, Printer, Share2 } from "lucide-react";

function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    { id: "INV-2026-0456", customer: "Ahmed Khan", type: "Tax Invoice", amount: 12500, status: "Paid", date: "2026-01-15", dueDate: "2026-01-30" },
    { id: "INV-2026-0457", customer: "Fatima Ali", type: "Tax Invoice", amount: 25000, status: "Pending", date: "2026-01-15", dueDate: "2026-01-30" },
    { id: "INV-2026-0458", customer: "Usman Ahmed", type: "Credit Invoice", amount: 7500, status: "Paid", date: "2026-01-14", dueDate: "2026-01-29" },
    { id: "INV-2026-0459", customer: "Bilal Khan", type: "Tax Invoice", amount: 50000, status: "Overdue", date: "2026-01-10", dueDate: "2026-01-25" },
  ];

  const filteredInvoices = invoices.filter(inv =>
    inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-linear-to-br from-emerald-50 to-blue-100 w-full">
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Tax Invoices</h1>
          <p className="text-slate-500">Generate and manage tax invoices for all sales</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg"><FileText className="w-5 h-5 text-emerald-600" /></div>
              <span className="text-slate-500 text-sm">Total Invoices</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">456</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg"><FileText className="w-5 h-5 text-green-600" /></div>
              <span className="text-slate-500 text-sm">Paid</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">398</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-2 rounded-lg"><FileText className="w-5 h-5 text-orange-600" /></div>
              <span className="text-slate-500 text-sm">Pending</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">42</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-lg"><FileText className="w-5 h-5 text-red-600" /></div>
              <span className="text-slate-500 text-sm">Overdue</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">16</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search by customer or invoice ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition" />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30">
            <FileText className="w-5 h-5" /> Generate Invoice
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Invoice ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Due Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{inv.id}</td>
                    <td className="px-6 py-4 text-slate-600">{inv.customer}</td>
                    <td className="px-6 py-4 text-slate-600">{inv.type}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">PKR {inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        inv.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>{inv.status}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{inv.date}</td>
                    <td className="px-6 py-4 text-slate-600">{inv.dueDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Download"><Download className="w-4 h-4 text-slate-400" /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Print"><Printer className="w-4 h-4 text-slate-400" /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Share"><Share2 className="w-4 h-4 text-slate-400" /></button>
                      </div>
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

export default Invoices;
