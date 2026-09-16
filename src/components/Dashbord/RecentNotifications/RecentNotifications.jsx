import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentNotifications() {
  const navigate = useNavigate();

  const notifications = [
    {
      title: "Critical Storage Low: Storage Tank D",
      message: "Pressure below safe range; capacity is down to 15% (940 KG).",
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
      message: "Invoice INV-2026-0459 from Pakistan Petroleum Ltd. for 25,000 KG LPG.",
      time: "4 hours ago",
      type: "info",
    },
  ];

  const typeStyles = {
    danger: {
      wrap: "bg-red-50 text-red-500",
      Icon: AlertTriangle,
    },
    success: {
      wrap: "bg-emerald-50 text-emerald-500",
      Icon: CheckCircle,
    },
    info: {
      wrap: "bg-blue-50 text-blue-500",
      Icon: Info,
    },
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-[16px] font-bold text-BLUE-dark">Recent Notifications</h3>
          <p className="mt-0.5 text-xs text-slate-400">Plant alerts and operational updates</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="text-[12px] font-semibold text-accent-blue hover:underline"
        >
          View all
        </button>
      </header>

      <div>
        {notifications.map((notification) => {
          const style = typeStyles[notification.type] || typeStyles.info;
          const Icon = style.Icon;

          return (
            <div
              key={notification.title}
              className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 last:border-0 hover:bg-slate-50"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.wrap}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-BLUE-dark">
                  {notification.title}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {notification.message}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                {notification.time}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RecentNotifications;
