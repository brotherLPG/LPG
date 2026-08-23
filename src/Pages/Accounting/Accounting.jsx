import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, TrendingDown, Wallet, Search, ArrowDownRight, ArrowUpRight } from "lucide-react";

import { useStore } from "../../context/StoreContext";
import AddTransactionModal from "../../components/Modals/AddTransactionModal";

function Accounting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { transactions, addTransaction } = useStore();

  const filteredTransactions = transactions.filter(txn =>
    (txn.remarks && txn.remarks.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (txn.category && txn.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddTransaction = (formData) => {
    addTransaction(formData);
    setIsModalOpen(false);
  };
  
  const totalIncome = transactions.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpenses;

  return (
    <div className="flex min-h-screen bg-linear-to-br from-emerald-50 to-blue-100 w-full">
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Accounting Ledger</h1>
          <p className="text-slate-500">Complete accounting ledger with income and expense tracking</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg"><Wallet className="w-5 h-5 text-emerald-600" /></div>
              <span className="text-slate-500 text-sm">Current Balance</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR {currentBalance.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
              <span className="text-slate-500 text-sm">Total Income</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR {totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-lg"><TrendingDown className="w-5 h-5 text-red-600" /></div>
              <span className="text-slate-500 text-sm">Total Expenses</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR {totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg"><Calculator className="w-5 h-5 text-blue-600" /></div>
              <span className="text-slate-500 text-sm">Net Profit</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR {currentBalance.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r not-first: from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30">
            <Calculator className="w-5 h-5" /> Add Transaction
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Transaction ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{txn.id}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        txn.type === 'Credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {txn.type === 'Credit' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{txn.category}</td>
                    <td className="px-6 py-4 text-slate-600">{txn.remarks}</td>
                    <td className={`px-6 py-4 font-medium ${txn.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'Credit' ? '+' : '-'}PKR {txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      </div>
    </div>
  );
}

export default Accounting;
