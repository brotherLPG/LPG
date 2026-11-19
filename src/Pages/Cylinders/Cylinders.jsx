import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Plus, Filter, MoreVertical, ScanBarcode } from "lucide-react";
import AddCylinderModal from "../../components/Cylinder/AddCylinderModal";
  
function Cylinders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cylinders, setCylinders] = useState([
    { id: "LPG-2456", barcode: "BC-789456", owner: "Customer A", type: "LPG", status: "Filled", location: "Branch 1", lastFill: "2026-01-15" },
    { id: "LPG-2457", barcode: "BC-789457", owner: "Customer B", type: "LPG", status: "Empty", location: "Branch 1", lastFill: "2026-01-10" },
    { id: "LPG-2458", barcode: "BC-789458", owner: "Customer C", type: "Oxygen", status: "Filled", location: "Branch 2", lastFill: "2026-01-14" },
    { id: "LPG-2459", barcode: "BC-789459", owner: "Customer D", type: "LPG", status: "In Inspection", location: "Branch 1", lastFill: "2026-01-08" },
    { id: "LPG-2460", barcode: "BC-789460", owner: "Customer E", type: "LPG", status: "Filled", location: "Branch 3", lastFill: "2026-01-16" },
  ]);

  const filteredCylinders = cylinders.filter(cyl =>
    cyl.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cyl.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cyl.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCylinder = (formData) => {
    const newCylinder = {
      ...formData,
      id: `LPG-${2456 + cylinders.length + 1}`,
      barcode: `BC-${789456 + cylinders.length + 1}`,
      lastFill: formData.lastFill || new Date().toISOString().split('T')[0]
    };
    setCylinders([...cylinders, newCylinder]);
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-gray-100 mb-2">
            Cylinder Management
          </h1>
          <p className="text-slate-500 dark:text-gray-400">
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-slate-500 dark:text-gray-400 text-sm">Total Cylinders</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-gray-100">2,456</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <ScanBarcode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-slate-500 dark:text-gray-400 text-sm">Registered</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-gray-100">2,408</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-lg">
                <Package className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-slate-500 dark:text-gray-400 text-sm">Filled</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-gray-100">1,890</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-slate-500 dark:text-gray-400 text-sm">Empty</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-gray-100">566</p>
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, barcode, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-5 h-5" />
            Add Cylinder
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </motion.div>

        {/* Cylinders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-400">
                    Cylinder ID
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-400">
                    Barcode
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-400">
                    Owner
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-400">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-400">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-400">
                    Last Fill
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCylinders.map((cylinder, index) => (
                  <tr
                    key={cylinder.id}
                    className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-gray-100">
                      {cylinder.id}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
                      {cylinder.barcode}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
                      {cylinder.owner}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
                      {cylinder.type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cylinder.status === "Filled"
                            ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                            : cylinder.status === "Empty"
                              ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                              : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        }`}
                      >
                        {cylinder.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
                      {cylinder.location}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
                      {cylinder.lastFill}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition">
                        <MoreVertical className="w-5 h-5 text-slate-400 dark:text-gray-500" />
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
