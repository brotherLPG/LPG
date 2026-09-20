import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Receipt,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Recentsales from "../../components/Dashbord/RecentSales/RecentSales";
import RecentPayments from "../../components/Dashbord/RecentPayments/RecentPayments";
import RecentNotifications from "../../components/Dashbord/RecentNotifications/RecentNotifications";
import SalesPaymentTrend from "../../components/Dashbord/SalesPaymentTrend/SalesPaymentTrend";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchDashboard } from "../../queries/prefetchDashboard";
import {
  DEFAULT_INVENTORY_ALERTS_PARAMS,
  DEFAULT_OPERATIONS_PARAMS,
  useInventoryAlerts,
  useOperationsOverview,
} from "../../queries/dashboard/dashboard.queries";

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: operationsResponse,
    isLoading,
    error,
  } = useOperationsOverview(DEFAULT_OPERATIONS_PARAMS);
  const {
    data: inventoryAlertsResponse,
    isLoading: isAlertsLoading,
    error: alertsError,
  } = useInventoryAlerts(DEFAULT_INVENTORY_ALERTS_PARAMS);

  useEffect(() => {
    prefetchDashboard(queryClient);
  }, [queryClient]);

  const overview = operationsResponse?.data;
  const inventoryAlerts = inventoryAlertsResponse?.data;
  const kpis = overview?.kpis;
  const periodDays = kpis?.periodDays || DEFAULT_OPERATIONS_PARAMS.days;

  const todayLabel =
    overview?.asOfDateLabel ||
    new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatChange = (metric) => {
    if (!metric || metric.changePercent == null) return null;
    const sign = metric.changePercent > 0 ? "+" : "";
    return `${sign}${metric.changePercent}%`;
  };

  const kpiCards = [
    {
      label: kpis?.totalSales?.label || "Total Sales",
      value: kpis?.totalSales?.formattedAmount || "Rs. 0",
      hint: `vs. previous ${periodDays} days`,
      change: formatChange(kpis?.totalSales),
      trend: kpis?.totalSales?.trend || "flat",
      icon: ShoppingCart,
      cardClass: "bg-[#EEF4FF]",
      iconClass: "bg-[#2563EB] text-white",
      valueClass: "text-[#1E3A8A]",
    },
    {
      label: kpis?.totalReceivedPayment?.label || "Total Received Payment",
      value: kpis?.totalReceivedPayment?.formattedAmount || "Rs. 0",
      hint: `vs. previous ${periodDays} days`,
      change: formatChange(kpis?.totalReceivedPayment),
      trend: kpis?.totalReceivedPayment?.trend || "flat",
      icon: Wallet,
      cardClass: "bg-[#ECFDF5]",
      iconClass: "bg-[#22C55E] text-white",
      valueClass: "text-[#166534]",
    },
    {
      label: kpis?.outstandingReceivable?.label || "Outstanding Receivable",
      value: kpis?.outstandingReceivable?.formattedAmount || "Rs. 0",
      hint: kpis?.outstandingReceivable?.description || "Sales minus received",
      icon: Receipt,
      cardClass: "bg-[#FEF2F2]",
      iconClass: "bg-[#EF4444] text-white",
      valueClass: "text-[#991B1B]",
    },
  ];

  const lowStockAlerts = (inventoryAlerts?.items || []).map((alert) => ({
    id: alert.itemId || alert.itemCode,
    title: alert.itemName || alert.itemCode || "Inventory item",
    remaining: alert.currentQuantity ?? 0,
    minimum: alert.minimumStockLevel ?? 0,
    remainingLabel: alert.remainingLabel,
    progressPercent: alert.progressPercent,
    type: alert.alertSeverity === "critical" ? "danger" : "warning",
  }));

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <p className="text-tertiary">Loading operations overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <p className="text-error">
          Error loading dashboard:{" "}
          {error?.response?.data?.message || error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-4 py-6 md:px-6 lg:px-8">
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
              {overview?.title || "Operations Overview"}
            </h1>
            <p className="mt-1 text-sm text-tertiary">
              {overview?.subtitle ||
                "Monitor live sales, collections, filling activity, and inventory alerts for the plant in one place."}
            </p>
          </div>

          <div className="mt-2 mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">{todayLabel}</span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isDown = card.trend === "down";
            const TrendIcon = isDown ? TrendingDown : TrendingUp;
            const trendClass = isDown
              ? "text-[#DC2626]"
              : "text-[#16A34A]";

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
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>
                  <p
                    className={`truncate text-xl font-bold tracking-tight ${card.valueClass}`}
                  >
                    {card.value}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    {card.change ? (
                      <>
                        <TrendIcon className={`h-3.5 w-3.5 ${trendClass}`} />
                        <span className={`font-semibold ${trendClass}`}>
                          {card.change}
                        </span>
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
            <SalesPaymentTrend trend={overview?.salesPaymentTrend} />
          </div>

          <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-BLUE-dark">
                  {inventoryAlerts?.title || "Low-Stock Alerts"}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Items below minimum threshold
                </p>
              </div>
              <span className="rounded-full bg-[#FEF2F2] px-2.5 py-1 text-xs font-semibold text-[#DC2626]">
                {inventoryAlerts?.alertCount ?? lowStockAlerts.length} alerts
              </span>
            </div>

            <div className="flex-1 space-y-3">
              {isAlertsLoading ? (
                <div className="flex h-full min-h-40 items-center justify-center text-sm text-slate-400">
                  Loading alerts...
                </div>
              ) : alertsError ? (
                <div className="flex h-full min-h-40 items-center justify-center text-sm text-red-500">
                  {alertsError?.response?.data?.message ||
                    alertsError.message ||
                    "Failed to load alerts."}
                </div>
              ) : lowStockAlerts.length === 0 ? (
                <div className="flex h-full min-h-40 items-center justify-center text-sm text-slate-400">
                  No low-stock alerts.
                </div>
              ) : (
                lowStockAlerts.map((alert) => {
                  const percent = Math.min(
                    100,
                    Math.round(
                      alert.progressPercent ??
                        (alert.minimum > 0
                          ? (alert.remaining / alert.minimum) * 100
                          : 0)
                    )
                  );
                  const isDanger = alert.type === "danger";

                  return (
                    <div
                      key={alert.id}
                      className={`rounded-xl border px-3 py-3 ${
                        isDanger
                          ? "border-red-100 bg-red-50/70"
                          : "border-amber-100 bg-amber-50/70"
                      }`}
                    >
                      <div className="mb-2 flex items-start gap-2">
                        <AlertTriangle
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            isDanger ? "text-red-500" : "text-amber-500"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-BLUE-dark">
                            {alert.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {alert.remainingLabel ||
                              `${alert.remaining} remaining · Min ${alert.minimum}`}
                          </p>
                        </div>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
                        <div
                          className={`h-full rounded-full ${
                            isDanger ? "bg-red-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
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
          <Recentsales sales={overview?.recentSales} />
          <RecentPayments payments={overview?.recentPayments} />
        </div>

        <RecentNotifications />
      </div>
    </div>
  );
}

export default Dashboard;
