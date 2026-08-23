import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Plus, Filter, MoreVertical, ScanBarcode } from "lucide-react";
import AddCylinderModal from "../../components/Cylinder/AddCylinderModal";
import { useStore } from "../../context/StoreContext";

function Cylinders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { cylinders, addCylinder } = useStore();

  const filteredCylinders = cylinders.filter(cyl =>
    cyl.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cyl.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cyl.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCylinder = (formData) => {
    addCylinder(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br  from-emerald-50 to-blue-100 w-full">
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Cylinder Management
          </h1>
          <p className="text-slate-500">
            Track and manage customer-owned cylinders with barcode system
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-slate-500 text-sm">Total Cylinders</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">2,456</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ScanBarcode className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-slate-500 text-sm">Registered</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">2,408</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-slate-500 text-sm">Filled</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">1,890</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-slate-500 text-sm">Empty</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">566</p>
          </div>
        </motion.div>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, barcode, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-5 h-5" />
            Add Cylinder
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </motion.div>

        {/* Cylinders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Cylinder ID
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Barcode
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Owner
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Last Fill
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCylinders.map((cylinder, index) => (
                  <tr
                    key={cylinder.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {cylinder.id}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cylinder.barcode}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cylinder.owner}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cylinder.type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cylinder.status === "Filled"
                            ? "bg-emerald-100 text-emerald-700"
                            : cylinder.status === "Empty"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {cylinder.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cylinder.location}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cylinder.lastFill}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <AddCylinderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddCylinder}
        />
      </div>
    </div>
  );
}

export default Cylinders;
