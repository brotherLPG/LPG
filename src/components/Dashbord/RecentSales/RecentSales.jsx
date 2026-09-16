import { useNavigate } from "react-router-dom";
import GlobalTable from "../../../utils/GlobalTable";

function RecentSales() {
  const navigate = useNavigate();

  const recentSales = [
    {
      invoice: "INV-9982",
      customer: "Islamabad Gas Agency",
      amount: "125,000",
      status: "Delivered",
    },
    {
      invoice: "INV-9981",
      customer: "Karachi LPG Distributors",
      amount: "210,000",
      status: "Delivered",
    },
    {
      invoice: "INV-9980",
      customer: "Lahore Fuel Traders",
      amount: "85,000",
      status: "Pending Filling",
    },
    {
      invoice: "INV-9979",
      customer: "Khyber Gas Supply",
      amount: "340,000",
      status: "Delivered",
    },
    {
      invoice: "INV-9978",
      customer: "Faisalabad Cylinder Co.",
      amount: "115,000",
      status: "Cancelled",
    },
  ];

  const statusClass = {
    Delivered: "bg-emerald-50 text-emerald-600",
    "Pending Filling": "bg-amber-50 text-amber-600",
    Cancelled: "bg-red-50 text-red-500",
  };

  const salesColumns = [
    {
      key: "invoice",
      label: "Invoice #",
      isRowHeader: true,
      className: "px-1 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-1 py-2.5 text-[12px] font-semibold text-BLUE-dark",
    },
    {
      key: "customer",
      label: "Customer",
      className: "px-2 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-2 py-2.5 text-[12px] text-slate-600",
    },
    {
      key: "amount",
      label: "Amount (Rs.)",
      className: "px-2 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-2 py-2.5 text-[12px] font-semibold text-slate-700",
    },
    {
      key: "status",
      label: "Status",
      className: "px-2 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-1 py-2.5",
      renderCell: (item) => (
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClass[item.status]}`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-[16px] font-bold text-BLUE-dark">Recent Sales</h3>
          <p className="mt-0.5 text-xs text-slate-400">Latest invoices from distributors</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/sales")}
          className="text-[12px] font-semibold text-accent-blue hover:underline"
        >
          View all
        </button>
      </header>

      <GlobalTable
        columns={salesColumns}
        data={recentSales}
        ariaLabel="Recent sales"
        className=""
        rowClassName="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
      />
    </section>
  );
}

export default RecentSales;
