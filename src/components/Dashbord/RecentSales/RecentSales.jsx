import { useNavigate } from "react-router-dom";
import GlobalTable from "../../../utils/GlobalTable";

function RecentSales({ sales }) {
  const navigate = useNavigate();

  const title = sales?.title || "Recent Sales";
  const subtitle = sales?.subtitle || "Latest invoices from distributors";
  const viewAllPath = sales?.viewAllPath || "/sales";

  const items = (sales?.items || []).map((sale) => ({
    id: sale.saleId || sale.invoiceNumber,
    saleId: sale.saleId,
    invoiceNumber: sale.invoiceNumber || "—",
    customerName: sale.customerName || "—",
    totalAmount:
      sale.formattedTotalAmount ||
      `Rs. ${Number(sale.totalAmount || 0).toLocaleString("en-US")}`,
  }));

  const salesColumns = [
    {
      key: "invoiceNumber",
      label: "Invoice #",
      isRowHeader: true,
      className: "px-1 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-1 py-2.5",
      renderCell: (item) => (
        <button
          type="button"
          onClick={() =>
            item.saleId && navigate(`/sales/view/${item.saleId}`)
          }
          className="text-left text-[12px] font-semibold text-BLUE-dark hover:text-accent-blue hover:underline"
        >
          {item.invoiceNumber}
        </button>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      className: "px-2 py-2 text-left text-xs font-semibold text-slate-500",
      cellClassName: "px-2 py-2.5 text-[12px] text-slate-600",
    },
    {
      key: "totalAmount",
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
          No recent sales found.
        </div>
      ) : (
        <section className='min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white [&_.overflow-x-auto]:overflow-x-hidden! [&_.min-w-300]:min-w-0! [&_.min-w-300]:w-full! [&_table]:w-full! [&_table]:table-fixed'>
          <GlobalTable
            columns={salesColumns}
            data={items}
            ariaLabel="Recent sales"
            className=""
            rowClassName="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
          />
        </section>
      )}
    </section>
  );
}

export default RecentSales;
