import { useNavigate } from "react-router-dom";
import GlobalTable from "../../../utils/GlobalTable";

function RecentPayments({ payments }) {
  const navigate = useNavigate();

  const title = payments?.title || "Recent Payments";
  const subtitle =
    payments?.subtitle || "Latest collections and supplier payments";
  const viewAllPath = payments?.viewAllPath || "/payments";

  const items = (payments?.items || []).map((payment) => ({
    id: payment.paymentId || payment.receiptNumber,
    paymentId: payment.paymentId,
    receiptNumber: payment.receiptNumber || payment.paymentNumber || "—",
    payeeAccountName: payment.payeeAccountName || payment.partyName || "—",
    paymentAmount:
      payment.formattedPaymentAmount ||
      `Rs. ${Number(payment.paymentAmount || 0).toLocaleString("en-US")}`,
  }));

  const paymentColumns = [
    {
      key: "receiptNumber",
      label: "Receipt #",
      isRowHeader: true,
      className: "px-1 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-1 py-2.5",
      renderCell: (item) => (
        <button
          type="button"
          onClick={() =>
            item.paymentId && navigate(`/payments/view/${item.paymentId}`)
          }
          className="text-left text-[12px] font-semibold text-BLUE-dark hover:text-accent-blue hover:underline"
        >
          {item.receiptNumber}
        </button>
      ),
    },
    {
      key: "payeeAccountName",
      label: "Payee / Account",
      className: "px-2 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-2 py-2.5 text-[12px] text-slate-600",
    },
    {
      key: "paymentAmount",
      label: "Amount",
      className: "px-2 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-2 py-2.5 text-[12px] font-semibold text-slate-700",
    },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-[16px] font-bold text-BLUE-dark">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(viewAllPath)}
          className="text-[12px] font-semibold text-accent-blue hover:underline"
        >
          View all
        </button>
      </header>

      {items.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-400">
          No recent payments found.
        </div>
      ) : (
        <GlobalTable
          columns={paymentColumns}
          data={items}
          ariaLabel="Recent payments"
          className=""
          rowClassName="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
        />
      )}
    </section>
  );
}

export default RecentPayments;
