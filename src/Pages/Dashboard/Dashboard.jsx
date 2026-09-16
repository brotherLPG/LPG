import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Recentsales from "../../components/Dashbord/RecentSales/RecentSales";
import RecentPayments from "../../components/Dashbord/RecentPayments/RecentPayments";
import RecentNotifications from "../../components/Dashbord/RecentNotifications/RecentNotifications";
import SalesPaymentTrend from "../../components/Dashbord/SalesPaymentTrend/SalesPaymentTrend";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchDashboard } from "../../queries/prefetchDashboard";

const formatRupees = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-US")}`;

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    prefetchDashboard(queryClient);
  }, [queryClient]);

  const todayLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const kpiCards = [
    // {
    //   label: "Filled Cylinders",
    //   value: "342 units",
    //   hint: "Low domestic inventory",
    //   icon: Flame,
    //   cardClass: "bg-[#FFF7ED]",
    //   iconClass: "bg-[#F59E0B] text-white",
    //   valueClass: "text-[#B45309]",
    // },
    {
      label: "Total Sales",
      value: formatRupees(1250000),
      hint: "vs. previous 7 days",
      change: "+12%",
      icon: ShoppingCart,
      cardClass: "bg-[#EEF4FF]",
      iconClass: "bg-[#2563EB] text-white",
      valueClass: "text-[#1E3A8A]",
    },
    {
      label: "Total Received Payment",
      value: formatRupees(1080000),
      hint: "vs. previous 7 days",
      change: "+10%",
      icon: Wallet,
      cardClass: "bg-[#ECFDF5]",
      iconClass: "bg-[#22C55E] text-white",
      valueClass: "text-[#166534]",
    },
    {
      label: "Outstanding Receivable",
      value: formatRupees(170000),
      hint: "Sales minus received",
      icon: Receipt,
      cardClass: "bg-[#FEF2F2]",
      iconClass: "bg-[#EF4444] text-white",
      valueClass: "text-[#991B1B]",
    },
  ];

  const lowStockAlerts = [
    {
      id: 1,
      title: "15 KG Filled Cylinder",
      remaining: 15,
      minimum: 50,
      type: "warning",
    },
    {
      id: 2,
      title: "45 KG Filled Cylinder",
      remaining: 5,
      minimum: 15,
      type: "danger",
    },
    {
      id: 3,
      title: "Valve Replacement Kit",
      remaining: 10,
      minimum: 30,
      type: "warning",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6">
        <div className="mb-1 text-sm text-slate-400">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer transition-colors hover:text-primary-dark"
          >
            Brother LPG
          </span>
          <span className="mx-1">/</span>
          <span className="font-medium text-slate-600">Dashboard</span>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>

            <h1 className="text-[28px] font-bold tracking-tight text-slate-800">
              Operations Overview
            </h1>
            <p className="mt-1 text-sm text-tertiary">
              Monitor live sales, collections, filling activity, and inventory
              alerts for the plant in one place.
            </p>
          </div>

          <div className='mb-2 flex flex-wrap items-center gap-2 mt-2'>
            <span className='text-xs text-slate-400'>{todayLabel}</span>
          </div>

        </div>


        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`flex items-center gap-4 rounded-2xl px-5 py-2 ${card.cardClass}`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className={`truncate text-xl font-bold tracking-tight ${card.valueClass}`}>
                    {card.value}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    {card.change ? (
                      <>
                        <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" />
                        <span className="font-semibold text-[#16A34A]">{card.change}</span>
                      </>
                    ) : null}
                    {card.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SalesPaymentTrend />
          </div>

          <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-BLUE-dark">
                  Low-Stock Alerts
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Items below minimum threshold
                </p>
              </div>
              <span className="rounded-full bg-[#FEF2F2] px-2.5 py-1 text-xs font-semibold text-[#DC2626]">
                {lowStockAlerts.length} alerts
              </span>
            </div>

            <div className="flex-1 space-y-3">
              {lowStockAlerts.map((alert) => {
                const percent = Math.min(
                  100,
                  Math.round((alert.remaining / alert.minimum) * 100)
                );
                const isDanger = alert.type === "danger";

                return (
                  <div
                    key={alert.id}
                    className={`rounded-xl border px-3 py-3 ${isDanger
                        ? "border-red-100 bg-red-50/70"
                        : "border-amber-100 bg-amber-50/70"
                      }`}
                  >
                    <div className="mb-2 flex items-start gap-2">
                      <AlertTriangle
                        className={`mt-0.5 h-4 w-4 shrink-0 ${isDanger ? "text-red-500" : "text-amber-500"
                          }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-BLUE-dark">
                          {alert.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {alert.remaining} remaining · Min {alert.minimum}
                        </p>
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
                      <div
                        className={`h-full rounded-full ${isDanger ? "bg-red-500" : "bg-amber-500"
                          }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => navigate("/inventory")}
              className="mt-4 text-left text-sm font-semibold text-accent-blue hover:underline"
            >
              View inventory
            </button>
          </section>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Recentsales />
          <RecentPayments />
        </div>

        <RecentNotifications />
      </div>
    </div>
  );
}

export default Dashboard;
