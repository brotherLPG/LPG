import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScanBarcode, Plus, Search, QrCode } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import AddRegistrationModal from "../../components/Modals/AddRegistrationModal";

function Registration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { registrations, addRegistration } = useStore();

  const filteredRegistrations = registrations.filter(reg =>
    (reg.cylinderId && reg.cylinderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (reg.barcode && reg.barcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (reg.customer && reg.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddRegistration = (formData) => {
    addRegistration(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-emerald-50 to-blue-100 w-full">
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Cylinder Registration</h1>
          <p className="text-slate-500">Register new cylinders with barcode tracking system</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg"><ScanBarcode className="w-5 h-5 text-emerald-600" /></div>
              <span className="text-slate-500 text-sm">Total Registered</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{registrations.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg"><QrCode className="w-5 h-5 text-blue-600" /></div>
              <span className="text-slate-500 text-sm">Barcodes Generated</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{registrations.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-2 rounded-lg"><Plus className="w-5 h-5 text-teal-600" /></div>
              <span className="text-slate-500 text-sm">Pending Approval</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search by cylinder ID, barcode, or customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30">
            <Plus className="w-5 h-5" /> New Registration
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Reg ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Cylinder ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Barcode</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Phone</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Address</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{reg.id}</td>
                    <td className="px-6 py-4 text-slate-600">{reg.cylinderId}</td>
                    <td className="px-6 py-4 text-slate-600">{reg.barcode}</td>
                    <td className="px-6 py-4 text-slate-600">{reg.customerName}</td>
                    <td className="px-6 py-4 text-slate-600">{reg.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{reg.address}</td>
                    <td className="px-6 py-4 text-slate-600">{reg.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reg.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{reg.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        <AddRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddRegistration}
        />
      </div>
    </div>
  );
}

export default Registration;
