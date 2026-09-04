import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useToast } from "../../utils/GlobalToast";
import { useCreateLpgReceipt } from "../../queries/lpgReceipts/lpgReceipts.queries";
import { useSuppliers } from "../../queries/suppliers/suppliers.queries";
import { useEmployees } from "../../queries/employees/employees.queries";

function ReceiveLpg() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [receivedByEmployeeId, setReceivedByEmployeeId] = useState("");
  const [storageTankId, setStorageTankId] = useState("");
  const [truckReg, setTruckReg] = useState("");
  const [supplierInvoice, setSupplierInvoice] = useState("");
  const [receivedAt, setReceivedAt] = useState("");
  const [remarks, setRemarks] = useState("Tanker inspected for seals and pressure values. Found normal. Decanting approved.");

  const toast = useToast();
  const createMutation = useCreateLpgReceipt();
  const { data: suppliersData } = useSuppliers({ search: "", isActive: undefined, page: 1, limit: 100 });
  const suppliers = suppliersData?.data?.items || [];
  const { data: employeesData } = useEmployees({ search: "", employmentStatus: "active", page: 1, limit: 100 });
  const employees = employeesData?.data?.items || [];

  // default to first supplier if none selected
  useEffect(() => {
    if (!supplierId && suppliers.length) setSupplierId(suppliers[0]._id);
  }, [suppliers]);

  useEffect(() => {
    if (!receivedByEmployeeId && employees.length) {
      setReceivedByEmployeeId(employees[0]._id);
    }
  }, [employees, receivedByEmployeeId]);
  
  const totalCost = (parseFloat(quantity || 0) * parseFloat(rate || 0)).toLocaleString();
  const formattedQuantity = parseFloat(quantity || 0).toLocaleString();

   const handleSubmit = async (e) => {
     e.preventDefault();

 const payload = {
   supplierId,
   receivedByEmployeeId,
   storageTankId,
   receivedQuantityKg: parseFloat(quantity) || 0,
   purchaseRatePerKg: parseFloat(rate) || 0,
   truckRegistrationNumber: truckReg,
   receivedAt: receivedAt
     ? new Date(receivedAt).toISOString()
     : new Date().toISOString(),
   supplierInvoiceNumber: supplierInvoice,
   remarks,
 };

 try {
   await createMutation.mutateAsync(payload);
   toast.success("LPG receipt created successfully.");
   navigate("/lpg-receipts");
 } catch (err) {
   toast.error("Failed to create LPG receipt. Please try again.");
 }
   };

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <p className="text-xs mb-2">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/lpg-receipts")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            LPG Receipts
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Receive LPG</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Receive LPG Shipment
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Record newly arrived bulk LPG tanker deliveries and update inventory ledgers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Shipment & Logistics Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Shipment & Logistics Information
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Receipt Number (Auto)
                </label>
                <input
                  type="text"
                  disabled
                  value="REC-2026-0089"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier Dropdown <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>{s.supplierName || s.name || s.supplierCode}</option>
                      ))}
                    </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Truck Registration Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  // defaultValue="LEA-4521"
                  value={truckReg}
                  onChange={(e) => setTruckReg(e.target.value)}
                  placeholder="LEA-4521"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier Invoice Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  // defaultValue="PP-INV-88421"
                  placeholder="PP-INV-88421"
                  value={supplierInvoice}
                  onChange={(e) => setSupplierInvoice(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Receiving Details & Storage Tank Routing */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Receiving Details & Storage Tank Routing
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Route to Storage Tank <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={storageTankId}
                    onChange={(e) => setStorageTankId(e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select Tank</option>
                    <option value="6a93dee2f8dc7b4205bdcb5f">TNK-001 — Main Bulk (12,500 / 50,000 KG)</option>
                    <option value="6a93dee2f8dc7b4205bdcb60">TNK-002 — Secondary Bulk (0 / 50,000 KG)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Received Quantity (KG) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Purchase Rate per KG (Rs.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Received By (Employee) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                        value={receivedByEmployeeId}
                        onChange={(e) => setReceivedByEmployeeId(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.fullName || employee.employeeCode}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Received At (Date & Time)
                  </label>
                  <input
                    type="datetime-local"
                    value={receivedAt}
                    onChange={(e) => setReceivedAt(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Remarks / Quality Inspection Notes
                </label>
                <textarea
                  rows="2"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 3: LPG Transaction Summary Card */}
          <div className="rounded-2xl border-2 border-[#1a56db]/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#1a56db] mb-4">
              LPG Transaction Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Received Quantity</span>
                <span className="font-bold text-slate-900">{formattedQuantity} KG</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Decanting Rate / KG</span>
                <span className="font-bold text-slate-900">Rs. {parseFloat(rate || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Total Purchase Cost</span>
              <span className="text-2xl font-extrabold text-[#1a56db]">Rs. {totalCost}</span>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-xs font-medium leading-relaxed text-emerald-900">
                Routing will instantly update TNK-001 bulk storage from 12,500 KG to {Number(12500) + Number(quantity || 0)} KG (75% Full).
              </p>
            </div>
          </div>

          {/* Card 4: Actions Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <button
              onClick={handleSubmit}
              isloading={createMutation.isPending}
              className="w-full rounded-xl bg-[#00a862] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#008951]"
            >
              {createMutation.isPending ? "Processing..." : "Confirm & Receive LPG"}
            </button>
            {/* <button
              onClick={() => navigate("/lpg-receipts")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              Save as Draft
            </button> */}
            <div className="pt-1 text-center">
              <span
                onClick={() => navigate("/lpg-receipts")}
                className="cursor-pointer text-sm font-medium text-rose-500 hover:text-rose-700"
              >
                Cancel
              </span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default ReceiveLpg;
