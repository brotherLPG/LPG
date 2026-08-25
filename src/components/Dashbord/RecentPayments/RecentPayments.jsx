import { useNavigate } from "react-router-dom";
import GlobalTable from "../../../utils/GlobalTable";

function RecentPayments() {
  const navigate = useNavigate();

  const recentPayments = [
    { receipt: "PAY-1121", payer: "Sui Southern Gas Co.", amount: "750,000", method: "Bank Wire" },
    { receipt: "PAY-1120", payer: "Pak Petroleum Ltd.", amount: "450,000", method: "Bank Wire" },
    { receipt: "PAY-1119", payer: "Islamabad Gas Agency", amount: "50,000", method: "Cash" },
    { receipt: "PAY-1118", payer: "Faisalabad Fuel Co.", amount: "120,000", method: "Cheque" },
    { receipt: "PAY-1117", payer: "Sui Northern Gas Co.", amount: "320,000", method: "Bank Wire" },
  ];

  // Column definitions for recent payments table
  const paymentColumns = [
    {
      key: "receipt",
      label: "Receipt #",
      isRowHeader: true,
      className: "px-0 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-0 py-2 text-[10px] font-semibold text-BLUE-dark",
    },
    {
      key: "payer",
      label: "Payee / Account",
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
      key: "method",
      label: "Method",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-0 py-2 text-[10px] text-slate-600",
    },
  ];
  
  return (
    <>
      <section className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white">
        <header className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
          <h3 className="text-[16px] font-bold text-BLUE-dark">
            Recent Payments
          </h3>
          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="text-[12px] font-semibold text-accent-blue hover:underline"
          >
            View All Payments
          </button>
        </header>

        <GlobalTable
          columns={paymentColumns}
          data={recentPayments}
          ariaLabel="Recent payments"
          className=""
          rowClassName="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
        />
      </section>
    </>
  );
}

export default RecentPayments;
