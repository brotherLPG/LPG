import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Package,
  FileText,
  CreditCard,
  Settings,
  UserPlus,
  Wrench,
  Truck,
  Receipt,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const [selectedTab, setSelectedTab] = useState("all");
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "warning",
      category: "alerts",
      title: "Low Stock Alert - Cylinder",
      message:
        "Empty 11KG cylinder stock has fallen to 45 units, below minimum threshold of 100. Reorder recommended.",
      time: "5 min ago",
      action: "View Inventory",
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: "maintenance",
      category: "alerts",
      title: "Maintenance Overdue: Bulk Storage Compressor",
      message:
        "Scheduled maintenance for M-002 was due on 18 Aug 2026. Asset currently under maintenance.",
      time: "1 hour ago",
      action: "View Asset",
      icon: Wrench,
    },
    {
      id: 3,
      type: "success",
      category: "transactions",
      title: "Payment Received: Rs. 50,000",
      message:
        "Customer payment PAY-2026-0312 received from Islamabad Gas Agency via Bank Transfer.",
      time: "2 hours ago",
      action: "View Payment",
      icon: CreditCard,
    },
    {
      id: 4,
      type: "info",
      category: "transactions",
      title: "New LPG Shipment Received",
      message:
        "Receipt REC-2026-0089: 25,000 KG received from Pakistan Petroleum Ltd. Tank TNK-001 updated.",
      time: "3 hours ago",
      action: "View Receipt",
      icon: Truck,
    },
    {
      id: 5,
      type: "warning",
      category: "alerts",
      title: "Invoice Overdue: INV-9741",
      message:
        "Invoice for Lahore Fuel Traders (Rs. 74,000) is 15 days past due date.",
      time: "5 hours ago",
      action: "View Invoice",
      icon: Receipt,
    },
    {
      id: 6,
      type: "system",
      category: "system",
      title: "Filling Batch Completed",
      message: "Batch FB-2026-0233: 2000 units of 11KG filled successfully.",
      time: "Yesterday",
      icon: CheckCircle,
    },
    {
      id: 7,
      type: "system",
      category: "system",
      title: "System Backup Completed",
      message: "Daily backup completed successfully at 02:00 AM.",
      time: "Yesterday",
      icon: Settings,
    },
    {
      id: 8,
      type: "system",
      category: "system",
      title: "New Employee Added",
      message: "Sana Parvez (HR Officer) profile created.",
      time: "2 days ago",
      icon: UserPlus,
    },
  ];

  const tabs = [
    {
      key: "all",
      label: "All Notifications",
    },
    {
      key: "unread",
      label: "Unread",
      count: 3,
    },
    {
      key: "alerts",
      label: "Stock Alerts",
    },
    {
      key: "transactions",
      label: "Transactions",
    },
    {
      key: "system",
      label: "System Logs",
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedTab === "all") return true;

    if (selectedTab === "unread") {
      return notification.id <= 3;
    }

    return notification.category === selectedTab;
  });

  const getNotificationStyles = (type) => {
    switch (type) {
      case "warning":
        return {
          border: "border-l-orange-500",
          dot: "bg-orange-500",
          iconBg: "bg-orange-50",
          iconColor: "text-orange-600",
        };

      case "success":
        return {
          border: "border-l-emerald-500",
          dot: "bg-emerald-500",
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
        };

      case "maintenance":
        return {
          border: "border-l-red-500",
          dot: "bg-red-500",
          iconBg: "bg-red-50",
          iconColor: "text-red-600",
        };

      case "info":
        return {
          border: "border-l-blue-500",
          dot: "bg-blue-500",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
        };

      case "system":
      default:
        return {
          border: "border-l-slate-400",
          dot: "bg-slate-400",
          iconBg: "bg-slate-100",
          iconColor: "text-slate-600",
        };
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full px-5 py-4 md:px-7 lg:px-8">
        <div className="mb-1 text-[11px] text-slate-400">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="mx-1">/</span> Notifications
        </div>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-[18px] md:text-[20px] font-bold text-slate-800">
              Notification Center
            </h1>

            <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
              Critical storage warnings, transaction logs, and inventory
              triggers
            </p>
          </div>

          <button
            className="
              px-3 py-1.5
              text-[10px] font-medium
              text-slate-600
              bg-white
              border border-slate-200
              rounded
              hover:bg-slate-50
              transition
            "
          >
            Mark All as Read
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const active = selectedTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`
                  flex items-center gap-1.5
                  whitespace-nowrap
                  px-3 py-1.5
                  rounded-md
                  text-[11px]
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                {tab.label}

                {tab.count && (
                  <span
                    className={`
                      min-w-4.5
                      h-4.5
                      px-1.5
                      flex
                      items-center
                      justify-center
                      rounded-full
                      text-[9px]
                      font-bold
                      ${
                        active
                          ? "bg-white text-blue-600"
                          : "bg-red-500 text-white"
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          {filteredNotifications.map((notification, index) => {
            const styles = getNotificationStyles(notification.type);
            const Icon = notification.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.04,
                }}
                className={`
                  relative
                  bg-white
                  border
                  border-slate-200
                  border-l-4
                  ${styles.border}
                  rounded
                  px-4
                  py-3
                  hover:bg-slate-50
                  transition
                  shadow-sm
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Status Dot */}
                  <div className="pt-1 shrink-0">
                    <div
                      className={`
                        w-2
                        h-2
                        rounded-full
                        ${styles.dot}
                      `}
                    />
                  </div>

                  {/* Icon */}
                  <div
                    className={`
                      flex
                      w-8
                      h-8
                      rounded-lg
                      items-center
                      justify-center
                      shrink-0
                      ${styles.iconBg}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${styles.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs md:text-sm font-semibold text-BLUE-dark leading-tight">
                          {notification.title}
                        </h3>

                        <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed mt-1">
                          {notification.message}
                        </p>

                        {/* Action */}
                        {notification.action && (
                          <button
                            className="
                              mt-2
                              px-2
                              py-1
                              text-[10px]
                              font-medium
                              text-blue-600
                              bg-blue-50
                              border
                              border-blue-200
                              rounded
                              hover:bg-blue-100
                              transition
                            "
                          >
                            {notification.action}
                          </button>
                        )}
                      </div>

                      {/* Time */}
                      <span
                        className="
                          shrink-0
                          text-[10px]
                          text-slate-400
                          whitespace-nowrap
                          pt-0.5
                        "
                      >
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="border border-slate-200 rounded-sm py-12 text-center">
            <Info className="w-7 h-7 text-slate-300 mx-auto mb-2" />

            <p className="text-xs font-medium text-slate-500">
              No notifications found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
