import React from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

function RecentNotifications() {
      const notifications = [
        {
          title: "Critical Storage Low: Storage Tank D",
          message:
            "Pressure below safe range; capacity is down to 15% (940 KG).",
          time: "12 mins ago",
          type: "danger",
        },
        {
          title: "Filling Batch #FB-2026-0233 Completed Successfully",
          message: "Total 342 units of 11 KG cylinders filled and certified.",
          time: "2 hours ago",
          type: "success",
        },
        {
          title: "New Bulk Shipment Invoice Received",
          message:
            "Invoice INV-2026-0459 from Pakistan Petroleum Ltd. for 25,000 KG LPG.",
          time: "4 hours ago",
          type: "info",
        },
      ];
  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100">
        <h3 className="font-bold text-[16px] text-BLUE-dark">
          Recent Notifications
        </h3>
      </div>

      <div>
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  border-b
                  border-slate-50
                  last:border-0
                  hover:bg-slate-50
                "
          >
            {/* Icon */}
            <div
              className={`
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shrink-0
                    ${
                      notification.type === "danger"
                        ? "bg-red-50"
                        : notification.type === "success"
                          ? "bg-emerald-50"
                          : "bg-blue-50"
                    }
                  `}
            >
              {notification.type === "danger" && (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              )}

              {notification.type === "success" && (
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              )}

              {notification.type === "info" && (
                <Info className="w-6 h-6 text-blue-500" />
              )}
            </div>

            {/* Notification */}
            <div className="flex-1 min-w-0 ms-2">
              <p className="text-[12px] font-semibold text-BLUE-dark ">
                {notification.title}
              </p>

              <p className="text-[12px] text-slate-400 text-tertiary">
                {notification.message}
              </p>
            </div>

            {/* Time */}
            <span className="text-[12px] text-4th-color whitespace-nowrap">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentNotifications