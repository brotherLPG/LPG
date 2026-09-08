import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "@heroui/react";
import { useReturnSaleFormOptions } from "../../../queries/returnsales/returnsales.queries";

function CreateReturn() {
  const navigate = useNavigate();
  const { data: formOptions, isLoading } = useReturnSaleFormOptions();
  const [returnedItems, setReturnedItems] = useState([
    { id: 1, itemName: "", originalQty: "", returnQty: "", unitPrice: "", returnAmount: "" }
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState("");
  const [inspectionNotes, setInspectionNotes] = useState("");

  const customers = formOptions?.data?.customers || [];
  const returnReasons = formOptions?.data?.returnReasons || [];
  const actionType = formOptions?.data?.actionType;
  const nextReturnNumber = formOptions?.data?.nextReturnNumber;

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <p className="text-xs mb-2">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/sales?tab=returns")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Sales
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold">Process Sales Return</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
          Process Sales Return
        </h1>
        <p className="text-sm text-tertiary">
          Process customer returns and issue credit notes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Return Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Return Information
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Return Reference No
                  </label>
                  <input
                    type="text"
                    disabled
                    value={nextReturnNumber || "(Loading...)"}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Return Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Customer entity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Original Sale / Invoice Reference */}
          <div className="rounded-xl border border-slate-200  shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4 bg-white">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Original Sale / Invoice Reference
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Original Invoice Number{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={originalInvoiceNumber}
                  onChange={(e) => setOriginalInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-2026-0456"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-sm font-medium text-4th-color">
                    Original customer
                  </label>
                  <p className="text-BLUE-dark text-[13px] font-semibold">
                    Karachi LPG Distributors
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-4th-color">
                    Original Date
                  </label>
                  <p className="text-BLUE-dark text-[13px] font-semibold">
                    02 Aug 2026
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-4th-color">
                    Original Invoice Total
                  </label>
                  <p className="text-accent-blue text-[13px] font-semibold">
                    Rs. 210,000
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-4th-color">
                    Supplied Items Summary
                  </label>
                  <p className="text-BLUE-dark text-[13px] font-semibold">
                    02 Aug 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Returned Items Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4 flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Returned Items Details
              </h2>
            </div>
            <div className="p-5">
              <Table aria-label="Returned items table">
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header className="w-full">
                      <Table.Column className="text-xs font-semibold text-slate-600">
                        Item Name
                      </Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">
                        Original Invoice Qty
                      </Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">
                        Return Qty
                      </Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">
                        Unit Price (Rs.)
                      </Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">
                        Return Amount (Rs.)
                      </Table.Column>
                    </Table.Header>
                    <Table.Body items={returnedItems}>
                      {(item) => (
                        <Table.Row key={item.id}>
                          <Table.Cell>Filled Cylinder 11KG</Table.Cell>
                          <Table.Cell>50</Table.Cell>
                          <Table.Cell>10</Table.Cell>
                          <Table.Cell>2,500</Table.Cell>
                          <Table.Cell>25,000</Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 4: Adjustment Summary */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Adjustment Summary
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Reason for Return <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select Reason</option>
                  {returnReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-4th-color">
                  Action Type
                </label>
                <p className="text-sm BLUE-dark font-medium">
                  {actionType?.label || "Credit to Customer Ledger Account"}
                </p>
              </div>
              <div className="flex flex-row justify-between my-auto items-center">
                <label className="block text-[14px] font-bold text-BLUE-dark">
                  Return Value
                </label>
                <p className="text-2xl text-error font-extrabold">Rs. 49,000</p>
              </div>
            </div>
          </div>

          {/* Card 5: Quality Control Notes */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Quality Control Notes
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Inspection Notes
                </label>
                <textarea
                  rows="4"
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Document quality control findings and inspection results..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/sales")}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => navigate("/sales")}
          className="rounded-lg bg-gradient-bg-blue  px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545]"
        >
          Process Return (Issue Credit)
        </button>
      </div>
    </main>
  );
}

export default CreateReturn;
