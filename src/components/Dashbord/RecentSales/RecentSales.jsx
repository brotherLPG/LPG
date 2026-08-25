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
    Delivered: "bg-emerald-50 text-emerald-500",
    "Pending Filling": "bg-amber-100 text-amber-500",
    Cancelled: "bg-red-50 text-red-500",
  };

  // Column definitions for recent sales table
  const salesColumns = [
    {
      key: "invoice",
      label: "Invoice #",
      isRowHeader: true,
      className: "px-0 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-0 py-2 text-[10px] font-semibold text-BLUE-dark",
    },
    {
      key: "customer",
      label: "Customer",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-2 py-2 text-[10px] text-slate-600",
    },
    {
      key: "amount",
      label: "Amount (Rs.)",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-2 py-2 text-[10px] font-semibold text-slate-700",
    },
    {
      key: "status",
      label: "Status",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-0 py-2",
      renderCell: (item) => (
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-medium ${statusClass[item.status]}`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
        <h3 className="text-[16px] font-bold text-BLUE-dark">Recent Sales</h3>
        <button
          type="button"
          onClick={() => navigate("/sales")}
          className="text-[12px] font-semibold text-accent-blue hover:underline"
        >
          View All Sales
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
