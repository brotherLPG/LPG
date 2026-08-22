import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  ShieldCheck,
  Clock,
  Package,
  DollarSign,
  FileText,
  Building2,
  Truck,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  Settings,
  LogOut
} from "lucide-react";

function Dashboard() {
  // LPG Management Stats
  const stats = [
    {
      title: "Total Cylinders",
      value: "2,456",
      change: "+124",
      changeType: "positive",
      icon: Package,
      color: "blue",
      description: "Registered cylinders",
    },
    {
      title: "Today's Sales",
      value: "PKR 125,000",
      change: "+15%",
      changeType: "positive",
      icon: DollarSign,
      color: "green",
      description: "Cash + Credit sales",
    },
    {
      title: "Pending Inspections",
      value: "48",
      change: "-8",
      changeType: "positive",
      icon: ShieldCheck,
      color: "orange",
      description: "Safety approvals",
    },
    {
      title: "Active Branches",
      value: "5",
      change: "+1",
      changeType: "positive",
      icon: Building2,
      color: "purple",
      description: "Operating locations",
    },
    {
      title: "Total Revenue",
      value: "PKR 2.5M",
      change: "+23%",
      changeType: "positive",
      icon: TrendingUp,
      color: "blue",
      description: "Monthly revenue",
    },
    {
      title: "Deliveries Today",
      value: "156",
      change: "+12%",
      changeType: "positive",
      icon: Truck,
      color: "green",
      description: "Completed deliveries",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "success",
      message: "Cylinder #LPG-2456 registered with barcode",
      time: "2 min ago",
      severity: "low"
    },
    {
      id: 2,
      type: "info",
      message: "Safety inspection approved for Batch #789",
      time: "5 min ago",
      severity: "low"
    },
    {
      id: 3,
      type: "success",
      message: "Tax invoice INV-2026-0456 generated",
      time: "12 min ago",
      severity: "low"
    },
    {
      id: 4,
      type: "info",
      message: "LPG filling completed - 50 cylinders",
      time: "25 min ago",
      severity: "low"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        iconBg: "bg-blue-500",
        text: "text-blue-600"
      },
      green: {
        bg: "bg-green-50",
        iconBg: "bg-green-500",
        text: "text-green-600"
      },
      orange: {
        bg: "bg-orange-50",
        iconBg: "bg-orange-500",
        text: "text-orange-600"
      },
      purple: {
        bg: "bg-purple-50",
        iconBg: "bg-purple-500",
        text: "text-purple-600"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex min-h-screen bg-slate-100 w-full">
      <div className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-dark">Dashboard</h1>
              <p className="text-slate-500 mt-1">
                Welcome back! Here's what's happening with your LPG plant today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - 6 cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow border border-slate-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${colors.bg} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-1 text-primary-dark">
                  {stat.value}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Section - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-dark">
                Revenue Overview
              </h2>
              <select className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            {/* Placeholder for chart */}
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Chart visualization will be added here</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-dark">
                Recent Activity
              </h2>
              <button className="font-medium text-sm hover:underline text-accent-blue">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "success"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {activity.type === "success" && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {activity.type === "info" && (
                      <FileText className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 font-medium text-sm truncate">
                      {activity.message}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-dark">
                Alerts & Notifications
              </h2>
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">3 New</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium text-sm">Low Stock Alert</p>
                  <p className="text-red-600 text-xs mt-1">Cylinder stock below threshold at Branch #2</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-700 font-medium text-sm">Inspection Due</p>
                  <p className="text-orange-600 text-xs mt-1">12 cylinders require safety inspection</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <Bell className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-700 font-medium text-sm">System Update</p>
                  <p className="text-blue-600 text-xs mt-1">New features available in dashboard</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-primary rounded-2xl shadow-sm p-6 text-white"
          >
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <Package className="w-6 h-6" />
                <span className="text-sm font-medium">Add Cylinder</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <Truck className="w-6 h-6" />
                <span className="text-sm font-medium">New Delivery</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-sm font-medium">Inspection</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <FileText className="w-6 h-6" />
                <span className="text-sm font-medium">Generate Report</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
