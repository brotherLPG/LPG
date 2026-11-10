import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  useExpenseFormOptions,
  useCreateExpense,
} from "../../queries/expenses/expenses.queries";
import { useToast } from "../../utils/GlobalToast";
import SearchableCustomerSelect from "../../components/SearchableCustomerSelect";

function AddExpenses() {
  const navigate = useNavigate();
  const toast = useToast();

  const { data: formOptionsResponse, isLoading: isLoadingOptions } = useExpenseFormOptions();
  const createMutation = useCreateExpense();

  const formOptions = formOptionsResponse?.data || {};
  const categories = formOptions.categories || [];
  const paymentMethods = formOptions.paymentMethods || [];
  const accounts = formOptions.accounts || [];
  const statuses = formOptions.statuses || [];
  const nextExpenseNumber = formOptions.nextExpenseNumber || "Auto-generated";

  const categoryOptions = (categories || []).map((cat) => ({
    _id: cat._id,
    label: cat.categoryName,
    searchText: (cat.categoryName || "").toLowerCase(),
  }));
  const statusOptions = (statuses || []).map((s) => ({ _id: s.value, label: s.label }));
  const paymentMethodOptions = (paymentMethods || []).map((m) => ({ _id: m.value, label: m.label }));
  const accountOptions = (accounts || []).map((acc) => ({
    _id: acc._id,
    label: `${acc.label || `${acc.accountCode} – ${acc.accountName}`} (Rs. ${Number(acc.currentBalanceAmount || 0).toLocaleString()})`,
    searchText: `${acc.label || ""} ${acc.accountCode || ""} ${acc.accountName || ""}`.toLowerCase(),
  }));

  // Form state
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [vendorPayeeName, setVendorPayeeName] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("pending");
  const [isApproved, setIsApproved] = useState(true);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paidFromAccountId, setPaidFromAccountId] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const resetForm = () => {
    setExpenseStatus("pending");
    setExpenseCategoryId("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    setVendorPayeeName("");
    setExpenseDescription("");
    setIsApproved(true);
    setExpenseAmount("");
    setPaymentMethod("");
    setPaidFromAccountId("");
    setReferenceNumber("");
    setPaymentDate("");
    setRemarks("");
  };

  const buildPayload = () => ({
    expenseCategoryId: expenseCategoryId || undefined,
    expenseStatus: expenseStatus || undefined,
    expenseDate: expenseDate || undefined,
    vendorPayeeName: vendorPayeeName.trim() || undefined,
    expenseDescription: expenseDescription.trim() || undefined,
    isApproved,
    expenseAmount: Number(expenseAmount) || 0,
    paymentMethod: paymentMethod || undefined,
    paidFromAccountId: paidFromAccountId || undefined,
    referenceNumber: referenceNumber.trim() || undefined,
    paymentDate: paymentDate || undefined,
    remarks: remarks.trim() || undefined,
  });

  const validate = () => {
    if (!expenseCategoryId) {
      toast.error("Please select a category");
      return false;
    }
    if (!expenseDate) {
      toast.error("Please select an expense date");
      return false;
    }
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return false;
    }
    if (!paidFromAccountId) {
      toast.error("Please select a source account");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createMutation.mutateAsync(buildPayload());
      toast.success("Expense recorded successfully");
      navigate("/expenses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record expense. Please try again.");
    }
  };

  const handleSaveAndAddAnother = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createMutation.mutateAsync(buildPayload());
      toast.success("Expense recorded successfully");
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record expense. Please try again.");
    }
  };

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <section className="max-w-5xl mx-auto">
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
              onClick={() => navigate("/expenses")}
              className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              Expenses
            </span>{" "}
            <span className="px-1 text-slate-400">/</span>{" "}
            <span className="font-semibold text-slate-600">Add Expense</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Expense</h1>
          <p className="mt-1 text-sm text-slate-500">
            Record a new expense and categorize for accounting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Expense Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-800">Expense Details</h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Expense Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Expense Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={isLoadingOptions ? "Loading..." : `${nextExpenseNumber} (Auto-generated)`}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <SearchableCustomerSelect
                    customers={categoryOptions}
                    value={expenseCategoryId}
                    onChange={(option) => setExpenseCategoryId(option?._id || "")}
                    disabled={isLoadingOptions}
                    placeholder={isLoadingOptions ? "Loading categories..." : "Select category"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.searchText || option.label.toLowerCase()}
                    emptyText="No category found"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Vendor / Payee Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Vendor / Payee Name
                  </label>
                  <input
                    type="text"
                    value={vendorPayeeName}
                    onChange={(e) => setVendorPayeeName(e.target.value)}
                    placeholder="e.g. WAPDA Power Corporation"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="Electricity bill for Rawalpindi plant facility for the month of August 2026"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <SearchableCustomerSelect
                    customers={statusOptions}
                    value={expenseStatus}
                    onChange={(option) => setExpenseStatus(option?._id || "")}
                    disabled={isLoadingOptions}
                    placeholder={isLoadingOptions ? "Loading..." : "Select status"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.label.toLowerCase()}
                    emptyText="No status found"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Internal note or additional information..."
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                  />
                </div>

                {/* Approved Toggle */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Approval Status
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsApproved(!isApproved)}
                      className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isApproved ? "bg-[#10b981]" : "bg-slate-200"}`}
                      role="switch"
                      aria-checked={isApproved}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isApproved ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                    <span className={`text-sm font-semibold ${isApproved ? "text-[#008951]" : "text-slate-500"}`}>
                      {isApproved ? "Approved" : "Not Approved"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Information */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-800">Payment Information</h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Amount (Rs.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 65000"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Payment Method <span className="text-rose-500">*</span>
                  </label>
                  <SearchableCustomerSelect
                    customers={paymentMethodOptions}
                    value={paymentMethod}
                    onChange={(option) => setPaymentMethod(option?._id || "")}
                    disabled={isLoadingOptions}
                    placeholder={isLoadingOptions ? "Loading..." : "Select payment method"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.label.toLowerCase()}
                    emptyText="No payment method found"
                  />
                </div>

                {/* Source Account */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Source Account <span className="text-rose-500">*</span>
                  </label>
                  <SearchableCustomerSelect
                    customers={accountOptions}
                    value={paidFromAccountId}
                    onChange={(option) => setPaidFromAccountId(option?._id || "")}
                    disabled={isLoadingOptions}
                    placeholder={isLoadingOptions ? "Loading..." : "Select source account"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.searchText || option.label.toLowerCase()}
                    emptyText="No account found"
                  />
                </div>

                {/* Reference Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Reference / Receipt Number
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. TXN-98230040"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={createMutation.isPending}
            onClick={handleSaveAndAddAnother}
            className="rounded-lg border border-[#1a56db] bg-white px-4 py-2 text-sm font-medium text-[#1a56db] shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            Save & Add Another
          </button>
          <button
            type="button"
            disabled={createMutation.isPending}
            onClick={handleSubmit}
            className="rounded-lg bg-[#008951] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545] disabled:opacity-50"
          >
            {createMutation.isPending ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default AddExpenses;
