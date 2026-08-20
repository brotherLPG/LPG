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
  Building2
} from "lucide-react";

function Dashboard() {
  // LPG Management Stats
  const stats = [
    {
      title: "Total Cylinders",
      value: "2,456",
      loading: false,
      change: "+124",
      changeType: "positive",
      icon: Package,
      color: "emerald",
      description: "Registered cylinders",
    },
    {
      title: "Today's Sales",
      value: "PKR 125,000",
      loading: false,
      change: "+15%",
      changeType: "positive",
      icon: DollarSign,
      color: "blue",
      description: "Cash + Credit sales",
    },
    {
      title: "Pending Inspections",
      value: "48",
      change: "-8",
      changeType: "positive",
      icon: ShieldCheck,
      color: "teal",
      description: "Safety approvals",
    },
    {
      title: "Active Branches",
      value: "5",
      change: "+1",
      changeType: "positive",
      icon: Building2,
      color: "cyan",
      description: "Operating locations",
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
      emerald: {
        bg: "bg-emerald-50",
        iconBg: "bg-emerald-500",
        text: "text-emerald-600"
      },
      blue: {
        bg: "bg-blue-50",
        iconBg: "bg-blue-500",
        text: "text-blue-600"
      },
      teal: {
        bg: "bg-teal-50",
        iconBg: "bg-teal-500",
        text: "text-teal-600"
      },
      cyan: {
        bg: "bg-cyan-50",
        iconBg: "bg-cyan-500",
        text: "text-cyan-600"
      }
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-emerald-50 to-blue-100 w-full">
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-500">
            LPG Gas Management System - Cylinder tracking, sales & accounting
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${colors.bg} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-1">
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Recent Activity
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === "success"
                      ? "bg-green-100"
                      : "bg-blue-100"
                  }`}
                >
                  {activity.type === "success" && (
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  )}
                  {activity.type === "info" && (
                    <FileText className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">
                    {activity.message}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
        >
          <div className="bg-linear-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">
                  Today's Filling
                </p>
                <p className="text-3xl font-bold">156</p>
              </div>
              <Package className="w-12 h-12 text-emerald-200" />
            </div>
            <p className="text-emerald-200 text-sm mt-3">
              ↑ 12% from yesterday
            </p>
          </div>

          <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Revenue Today
                </p>
                <p className="text-3xl font-bold">PKR 125K</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-200" />
            </div>
            <p className="text-blue-200 text-sm mt-3">↑ 8.5% this week</p>
          </div>

          <div className="bg-linear-to-r from-teal-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium mb-1">
                  Inspections Done
                </p>
                <p className="text-3xl font-bold">42</p>
              </div>
              <ShieldCheck className="w-12 h-12 text-teal-200" />
            </div>
            <p className="text-teal-200 text-sm mt-3">98.5% pass rate</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
