import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

function AddRegistrationModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = React.useState({
    customer: "",
    phone: "",
    cnic: "",
    cylinderId: "",
    barcode: "",
    type: "11 KG",
    tareWeight: "",
    branch: "Branch 1",
    date: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: formData.date || new Date().toISOString().split('T')[0]
    });
    setFormData({
      customer: "",
      phone: "",
      cnic: "",
      cylinderId: "",
      barcode: "",
      type: "11 KG",
      tareWeight: "",
      branch: "Branch 1",
      date: ""
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">New Registration</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Customer / Owner Name</label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="03XX-XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">CNIC / Tax ID</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="XXXXX-XXXXXXX-X"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Cylinder Serial Number</label>
              <input
                type="text"
                name="cylinderId"
                value={formData.cylinderId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="LPG-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Barcode</label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="BC-XXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Cylinder Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              >
                <option value="11 KG">11 KG</option>
                <option value="22 KG">22 KG</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tare Weight (KG)</label>
              <input
                type="number"
                step="0.1"
                name="tareWeight"
                value={formData.tareWeight}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="e.g. 11.5"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Assigned Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              >
                <option value="Branch 1">Branch 1</option>
                <option value="Branch 2">Branch 2</option>
                <option value="Branch 3">Branch 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Registration Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30"
            >
              Register Customer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddRegistrationModal;
