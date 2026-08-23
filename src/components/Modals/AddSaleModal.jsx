import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

function AddSaleModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    customer: "",
    type: "11 KG",
    quantity: 1,
    unitRate: 3000,
    emptyExchange: true,
    paymentType: "Cash",
    date: ""
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Auto-calculate logic if type changes
    if (name === "type") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: newValue,
        unitRate: newValue === "11 KG" ? 3000 : (newValue === "22 KG" ? 5800 : 8000)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      unitRate: Number(formData.unitRate),
      date: formData.date || new Date().toISOString().split('T')[0]
    });
    setFormData({
      customer: "",
      type: "11 KG",
      quantity: 1,
      unitRate: 3000,
      emptyExchange: true,
      paymentType: "Cash",
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">New Sale Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Selection</label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              placeholder="Search Customer..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Unit Rate (PKR)</label>
              <input
                type="number"
                name="unitRate"
                value={formData.unitRate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Type</label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              >
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="emptyExchange"
              name="emptyExchange"
              checked={formData.emptyExchange}
              onChange={handleInputChange}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
            />
            <label htmlFor="emptyExchange" className="text-sm font-semibold text-slate-700">
              Empty Cylinder Exchanged
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sale Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
          </div>

          {/* Auto Calculation Preview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Total Amount:</span>
              <span className="text-lg font-bold text-slate-800">PKR {(formData.quantity * formData.unitRate).toLocaleString()}</span>
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
              Complete Sale
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddSaleModal;
