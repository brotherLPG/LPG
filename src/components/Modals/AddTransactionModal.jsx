import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

function AddTransactionModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type: "Debit",
    category: "Plant Utility",
    method: "Cash in Hand",
    amount: "",
    date: "",
    remarks: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      date: formData.date || new Date().toISOString().split('T')[0]
    });
    setFormData({
      type: "Debit",
      category: "Plant Utility",
      method: "Cash in Hand",
      amount: "",
      date: "",
      remarks: ""
    });
  };

  if (!isOpen) return null;

  const debitCategories = ["Plant Utility", "Maintenance", "Salary", "Fuel", "LPG Bulk Purchase", "Other Expense"];
  const creditCategories = ["Sales Income", "Investment", "Loan Received", "Other Income"];

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
          <h2 className="text-xl font-bold text-slate-800">Add Accounting Transaction</h2>
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Transaction Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-4 outline-none transition ${formData.type === 'Credit' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 focus:border-emerald-500 focus:ring-emerald-100' : 'border-red-200 bg-red-50 text-red-800 focus:border-red-500 focus:ring-red-100'}`}
              >
                <option value="Debit">Debit / Expense</option>
                <option value="Credit">Credit / Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              >
                {(formData.type === 'Debit' ? debitCategories : creditCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Account / Payment Method</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              >
                <option value="Cash in Hand">Cash in Hand</option>
                <option value="Bank Account">Bank Account</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (PKR)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                placeholder="e.g. 5000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Reference / Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              placeholder="Add details about this transaction..."
            />
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
              className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddTransactionModal;
