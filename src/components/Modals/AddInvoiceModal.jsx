import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

function AddInvoiceModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    customer: "",
    ref: "",
    description: "",
    subtotal: 0,
    tax: 0,
    terms: "Immediate",
    date: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const sub = Number(formData.subtotal) || 0;
    const taxAmt = sub * (Number(formData.tax) / 100);
    return sub + taxAmt;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      subtotal: Number(formData.subtotal),
      tax: Number(formData.tax),
      total: calculateTotal(),
      date: formData.date || new Date().toISOString().split('T')[0]
    });
    setFormData({
      customer: "",
      ref: "",
      description: "",
      subtotal: 0,
      tax: 0,
      terms: "Immediate",
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
          <h2 className="text-xl font-bold text-slate-800">Create Invoice</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name</label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Invoice Reference #</label>
              <input
                type="text"
                name="ref"
                value={formData.ref}
                onChange={handleInputChange}
                placeholder="Leave blank to auto-generate"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Item Description / Cylinders</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              placeholder="e.g. 5x 11KG LPG Refill"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subtotal (PKR)</label>
              <input
                type="number"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tax %</label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Terms & Due Date</label>
              <select
                name="terms"
                value={formData.terms}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              >
                <option value="Immediate">Immediate</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Invoice Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          {/* Auto Calculation Preview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-medium text-slate-700">PKR {Number(formData.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
              <span className="text-slate-500">Tax ({formData.tax}%):</span>
              <span className="font-medium text-slate-700">PKR {(Number(formData.subtotal) * (Number(formData.tax) / 100)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-bold">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">PKR {calculateTotal().toLocaleString()}</span>
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
              Generate Invoice
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddInvoiceModal;
