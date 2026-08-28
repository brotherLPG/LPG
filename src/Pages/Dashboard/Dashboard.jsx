import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CirclePlus,
  AlertTriangle,
} from "lucide-react";
import Recentsales from "../../components/Dashbord/RecentSales/RecentSales";
import RecentPayments from "../../components/Dashbord/RecentPayments/RecentPayments";
import RecentNotifications from "../../components/Dashbord/RecentNotifications/RecentNotifications";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchDashboard } from "../../queries/prefetchDashboard";
function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    prefetchDashboard(queryClient);
  }, [queryClient]);

  // -----------------------------
  // Dashboard Data
  // -----------------------------

  const salesData = [
    { day: "Mon", value: 400 },
    { day: "Tue", value: 260 },
    { day: "Wed", value: 320 },
    { day: "Thu", value: 220 },
    { day: "Fri", value: 410 },
    { day: "Sat", value: 380 },
    { day: "Sun", value: 520 },
  ];

  const lowStockAlerts = [
    {
      id: 1,
      title: "FILLED-CYLINDER-15KG",
      message: "15 remaining (Minimum: 50)",
      type: "warning",
    },
    {
      id: 2,
      title: "FILLED-CYLINDER-45KG",
      message: "5 remaining (Minimum: 15)",
      type: "danger",
    },
    {
      id: 3,
      title: "VALVE-REPLACEMENT-KIT",
      message: "10 left (Minimum: 30)",
      type: "warning",
    },
  ];

  // -----------------------------
  // Helpers
  // -----------------------------


  const getAlertClass = (type) => {
    if (type === "danger") {
      return "border-red-300 bg-red-50 text-red-500";
    }

    return "border-amber-300 bg-amber-50 text-amber-500";
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-3">
        {/* =========================================
            BREADCRUMB
        ========================================= */}
        <div className="text-slate-400 mb-1">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer hover:text-primary-dark transition-colors"
          >
            Brother LPG
          </span>

          <span className="mx-1">/</span>

          <span>Dashboard</span>
        </div>

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="flex items-center justify-between  pb-2 my-1">
          <div>
            <h1 className="font-bold text-slate-800 text-[28px]">
              Operations Control Board
            </h1>

            <p className="text-tertiary text-[14px]">
              Operational KPIs, filling statistics, and warning indicators for
              Rawalpindi plant
            </p>
          </div>

          <button
            onClick={() => navigate("/filling-batches/create")}
            className="
              flex
              items-center
              gap-1
              px-3
              py-1.5
              rounded
              bg-gradient-bg-blue
              text-white
              transition
              text-[14px]
            "
          >
            <CirclePlus className="w-5 h-5" />
            New Filling Batch
          </button>
        </div>

        {/* =========================================
            FILLED CYLINDERS
        ========================================= */}
        <div className="bg-white border border-slate-200 rounded-md px-4 py-2 mb-2">
          <p className="text-tertiary font-semibold font-family-inter text-sm my-2">
            Filled Cylinders
          </p>

          <h2 className="text-xl font-extrabold text-orange leading-6 my-2">
            342 units
          </h2>

          <div className="flex items-center gap-1 mt-2">
            <span className="w-1 h-1 rounded-full bg-orange-500" />

            <span className="text-[12px] text-slate-400">
              Low domestic inventory
            </span>
          </div>
        </div>

        {/* =========================================
            SALES + LOW STOCK
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2">
          {/* Weekly Sales */}
          {/* Weekly Sales */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md">
            <div className="px-3 py-2 border-b border-slate-100">
              <h3 className="font-bold text-[16px] text-BLUE-dark">
                Weekly Sales Trend (Rs. in thousands)
              </h3>
            </div>

            <div className="px-4 py-3">
              <div className="flex">
                {/* Y Axis */}
                <div className="w-14 h-44 flex flex-col justify-between text-right pr-2">
                  <span className="text-[11px] text-tertiary font-regular">Rs. 600k</span>

                  <span className="text-[11px] text-tertiary font-regular">Rs. 480k</span>

                  <span className="text-[11px] text-tertiary font-regular">Rs. 360k</span>

                  <span className="text-[11px] text-tertiary font-regular">Rs. 240k</span>

                  <span className="text-[11px] text-tertiary font-regular">Rs. 120k</span>

                  <span className="text-[11px] text-tertiary font-regular">Rs. 0k</span>
                </div>

                {/* Chart */}
                <div className="flex-1">
                  {/* Bars */}
                  <div className="h-48 flex items-end justify-between gap-4 ">
                    {salesData.map((item) => {
                      const height = Math.max((item.value / 600) * 100, 3);

                      return (
                        <div
                          key={item.day}
                          className="flex-1 h-full flex flex-col items-center justify-end"
                        >
                          {/* Bar */}
                          <div className="w-full h-full flex items-end justify-center">
                            <div
                              className="
                      w-5
                      md:w-7
                      bg-gradient-bg-blue
                      rounded-t-sm
                      transition-all
                      duration-300
                      hover:opacity-80
                    "
                              style={{
                                height: `${height}%`,
                              }}
                              title={`Rs. ${item.value}k`}
                            />
                          </div>

                          {/* Day */}
                          <span className="text-[11px] text-tertiary font-regular mt-1">
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white border border-slate-200 rounded-md">
            <div className="px-3 py-2 border-b border-slate-100">
              <h3 className="font-bold text-[16px] text-BLUE-dark">
                Low-Stock Alerts (Minimum Threshold)
              </h3>
            </div>

            <div className="p-3 space-y-1.5">
              {lowStockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`
                    flex
                    items-center
                    gap-2
                    border
                    rounded-lg
                    px-2
                    py-3
                    ${getAlertClass(alert.type)}
                  `}
                >
                  <AlertTriangle className="w-5 h-5 shrink-0" />

                  <div>
                    <p className="text-[12px] font-bold">{alert.title}</p>

                    <p className="text-[11px] font-regular">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            RECENT SALES + PAYMENTS
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
          {/* Recent Sales */}
          <Recentsales/>

          {/* Recent Payments */}
          <RecentPayments />
        </div>

        {/* =========================================
            RECENT NOTIFICATIONS
        ========================================= */}
       <RecentNotifications/>
      </div>
    </div>
  );
}

export default Dashboard;
