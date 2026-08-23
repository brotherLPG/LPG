import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, CreditCard, Search, Plus, TrendingUp } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import AddSaleModal from "../../components/Modals/AddSaleModal";

function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { sales, addSale } = useStore();

  const filteredSales = sales.filter(sale =>
    (sale.customer && sale.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sale.invoiceId && sale.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSale = (formData) => {
    addSale(formData);
    setIsModalOpen(false);
  };
  
  // Calculate today's sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date === today).reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-emerald-50 to-blue-100 w-full">
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Sales Management</h1>
          <p className="text-slate-500">Track cash and credit sales for LPG and other gases</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
              <span className="text-slate-500 text-sm">Today's Sales</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR {todaySales.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg"><CreditCard className="w-5 h-5 text-blue-600" /></div>
              <span className="text-slate-500 text-sm">Credit Sales</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR 75K</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-teal-600" /></div>
              <span className="text-slate-500 text-sm">This Month</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR 3.2M</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-purple-600" /></div>
              <span className="text-slate-500 text-sm">Pending Credit</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR 450K</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search by customer or invoice ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition shadow-lg shadow-emerald-500/30">
            <Plus className="w-5 h-5" /> New Sale
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Sale ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Invoice ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Items</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{sale.id}</td>
                    <td className="px-6 py-4 text-slate-600">{sale.invoiceId}</td>
                    <td className="px-6 py-4 text-slate-600">{sale.customer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sale.type === 'Cash' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{sale.type}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">PKR {sale.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{sale.items}</td>
                    <td className="px-6 py-4 text-slate-600">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        <AddSaleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddSale}
        />
      </div>
    </div>
  );
}

export default Sales;
