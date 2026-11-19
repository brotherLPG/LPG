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
      className: "px-1 py-2 text-left text-xs font-semibold text-slate-500 dark:text-gray-400",
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
      className: "px-2 py-2 text-left text-xs font-semibold text-slate-500 dark:text-gray-400",
      cellClassName: "px-2 py-2.5 text-[12px] text-slate-600 dark:text-gray-400",
    },
    {
      key: "paymentAmount",
      label: "Amount",
      className: "px-2 py-2 text-left text-xs font-semibold text-slate-500 dark:text-gray-400",
      cellClassName: "px-2 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-gray-300",
    },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 dark:border-gray-800 px-5 py-4">
        <div>
          <h3 className="text-[16px] font-bold text-BLUE-dark">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-500">{subtitle}</p>
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
        <div className="px-5 py-8 text-center text-sm text-slate-400 dark:text-gray-500">
          No recent payments found.
        </div>
      ) : (
        <section className='min-w-0 overflow-hidden rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 [&_.overflow-x-auto]:overflow-x-hidden! [&_.min-w-300]:min-w-0! [&_.min-w-300]:w-full! [&_table]:w-full! [&_table]:table-fixed'>
        <GlobalTable
          columns={paymentColumns}
          data={items}
          ariaLabel="Recent payments"
          className=""
          rowClassName="border-b border-slate-100 dark:border-gray-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-gray-800"
        />
        </section>
      )}
    </section>
  );
}

export default RecentPayments;
