import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useToast } from "../../utils/GlobalToast";
import { useLpgReceiptById, useUpdateLpgReceipt } from "../../queries/lpgReceipts/lpgReceipts.queries";
import { useSuppliers } from "../../queries/suppliers/suppliers.queries";
import { useEmployees } from "../../queries/employees/employees.queries";

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function UpdateLpgReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data, isLoading: isFetching } = useLpgReceiptById(id);
  const updateMutation = useUpdateLpgReceipt();

  const [supplierId, setSupplierId] = useState("");
  const [receivedByEmployeeId, setReceivedByEmployeeId] = useState("");
  const [storageTankId, setStorageTankId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [rate, setRate] = useState(0);
  const [truckReg, setTruckReg] = useState("");
  const [supplierInvoice, setSupplierInvoice] = useState("");
  const [receivedAt, setReceivedAt] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (data?.data) {
      const s = data.data;
      setSupplierId(s.supplierId?._id || s.supplierId || s.supplier?._id || "");
      setStorageTankId(s.storageTankId?._id || "");
      setQuantity(s.receivedQuantityKg || 0);
      setRate(s.purchaseRatePerKg || 0);
      setTruckReg(s.truckRegistrationNumber || "");
      setSupplierInvoice(s.supplierInvoiceNumber || "");
      setReceivedAt(toDateTimeLocal(s.receivedAt));
      setReceivedByEmployeeId(
        s.receivedByEmployeeId?._id || s.receivedByEmployeeId || s.receivedBy?._id || "",
      );
      console.log(s);
      
      setRemarks(s.remarks || "");
    }
  }, [data]);

  const { data: suppliersData } = useSuppliers({ search: "", isActive: undefined, page: 1, limit: 100 });
  const suppliers = suppliersData?.data?.items || [];
  const receiptSupplier = data?.data?.supplierId;
  const receiptSupplierId = receiptSupplier?._id || receiptSupplier || data?.data?.supplier?._id || "";
  const receiptSupplierName =
    data?.data?.supplierName ||
    receiptSupplier?.supplierName ||
    data?.data?.supplier?.supplierName ||
    data?.data?.supplierCode ||
    "Selected Supplier";
  const supplierOptions = suppliers.some((supplier) => supplier._id === receiptSupplierId)
    ? suppliers
    : receiptSupplierId
      ? [{ _id: receiptSupplierId, supplierName: receiptSupplierName }, ...suppliers]
      : suppliers;
  const { data: employeesData } = useEmployees({ search: "", employmentStatus: "active", page: 1, limit: 100 });
  const employees = employeesData?.data?.items || [];

  // useEffect(() => {
  //   if (!supplierId && suppliers.length) {
  //     // if supplier not set from API, default to first
  //     setSupplierId(suppliers[0]._id);
  //   }
  // }, [suppliers]);

  // useEffect(() => {
  //   if (!receivedByEmployeeId && employees.length) {
  //     setReceivedByEmployeeId(employees[0]._id);
  //   }
  // }, [employees, receivedByEmployeeId]);

  if (isFetching) {
    return (
      <div className="p-8 flex items-center justify-center">
        <svg className="animate-spin h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const handleSave = async () => {
    const payload = {
      supplierId,
      receivedByEmployeeId,
      // storageTankId,
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
      await updateMutation.mutateAsync({ id, data: payload });
      toast.success('LPG receipt updated successfully.');
      navigate('/lpg-receipts');
    } catch (err) {
      toast.error('Failed to update LPG receipt. Please try again.');
    }
  };

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {/* Header */}
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
          <span className="font-semibold text-slate-600">Edit Receipt</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit LPG Receipt
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                  value={data?.data?.receiptNumber || ""}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select Supplier</option>
                    {supplierOptions.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.supplierName || s.supplierCode || s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Truck Registration Number{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={truckReg}
                  onChange={(e) => setTruckReg(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier Invoice Number{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={supplierInvoice}
                  onChange={(e) => setSupplierInvoice(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Receiving Details & Storage Tank Routing
              </h2>
            </div>
            <div className="p-5 space-y-5">
              {/* <div>
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
                    <option value="6a93dee2f8dc7b4205bdcb5f">
                      TNK-001 — Main Bulk (12,500 / 50,000 KG)
                    </option>
                  </select>
                </div>
              </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Received Quantity (KG){" "}
                    <span className="text-rose-500">*</span>
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
                    Purchase Rate per KG (Rs.){" "}
                    <span className="text-rose-500">*</span>
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
                    Received By (Employee){" "}
                    <span className="text-rose-500">*</span>
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

        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border-2 border-[#1a56db]/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#1a56db] mb-4">
              LPG Transaction Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Received Quantity
                </span>
                <span className="font-bold text-slate-900">
                  {Number(quantity || 0).toLocaleString()} KG
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Decanting Rate / KG
                </span>
                <span className="font-bold text-slate-900">
                  Rs. {parseFloat(rate || 0).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Total Purchase Cost
              </span>
              <span className="text-2xl font-extrabold text-[#1a56db]">
                Rs.{" "}
                {(Number(quantity || 0) * Number(rate || 0)).toLocaleString()}
              </span>
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-xs font-medium leading-relaxed text-emerald-900">
                Updating this record will modify tank inventory accordingly.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full rounded-xl bg-[#00a862] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#008951]"
            >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => navigate("/lpg-receipts")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UpdateLpgReceipt;
