import { useNavigate } from "react-router-dom";
import { Table } from "@heroui/react";

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

      <Table className="px-3 pb-3 pt-2 bg-white">
        <Table.ScrollContainer>
          <Table.Content aria-label="Recent sales">
            <Table.Header className="bg-white">
              <Table.Column className="px-0 py-1.5 text-left font-bold text-tertiary">
                Invoice #
              </Table.Column>
              <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                Customer
              </Table.Column>
              <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                Amount (Rs.)
              </Table.Column>
              <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                Status
              </Table.Column>
            </Table.Header>
            <Table.Body items={recentSales}>
              {(sale) => (
                <Table.Row
                  key={sale.invoice}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                >
                  <Table.Cell className="px-0 py-2 text-[10px] font-semibold text-BLUE-dark">
                    {sale.invoice}
                  </Table.Cell>
                  <Table.Cell className="px-2 py-2 text-[10px] text-slate-600">
                    {sale.customer}
                  </Table.Cell>
                  <Table.Cell className="px-2 py-2 text-[10px] font-semibold text-slate-700">
                    {sale.amount}
                  </Table.Cell>
                  <Table.Cell className="px-0 py-2">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-medium ${statusClass[sale.status]}`}
                    >
                      {sale.status}
                    </span>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </section>
  );
}

export default RecentSales;
