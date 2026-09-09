import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  useExpenseById,
  useUpdateExpense,
} from "../../queries/expenses/expenses.queries";
import { useToast } from "../../utils/GlobalToast";

function UpdateExpenses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: expenseResponse, isLoading, error } = useExpenseById(id);
  const updateMutation = useUpdateExpense();

  const expense = expenseResponse?.data;

  // Form options from get-by-id response (includes form object)
  const formOptions = expense?.form || {};
  const categories = formOptions.categories || [];
  const paymentMethods = formOptions.paymentMethods || [];
  const accounts = formOptions.accounts || [];
  const statuses = formOptions.statuses || [];

  // Form state
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [vendorPayeeName, setVendorPayeeName] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("");
  const [isApproved, setIsApproved] = useState(true);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paidFromAccountId, setPaidFromAccountId] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (expense) {
      setExpenseCategoryId(expense.expenseCategoryId || "");
      if (expense.expenseDate) {
        const d = new Date(expense.expenseDate);
        if (!isNaN(d.getTime())) setExpenseDate(d.toISOString().split("T")[0]);
      }
      setVendorPayeeName(expense.vendorPayeeName || "");
      setExpenseDescription(expense.expenseDescription || "");
      setExpenseStatus(expense.expenseStatus || "");
      setIsApproved(expense.isApproved ?? true);
      setExpenseAmount(expense.expenseAmount !== undefined ? String(expense.expenseAmount) : "");
      setPaymentMethod(expense.paymentMethod || "");
      setPaidFromAccountId(expense.paidFromAccountId || "");
      setReferenceNumber(expense.referenceNumber || "");
      if (expense.paymentDate) {
        const pd = new Date(expense.paymentDate);
        if (!isNaN(pd.getTime())) setPaymentDate(pd.toISOString().split("T")[0]);
      }
      setRemarks(expense.remarks || "");
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expenseCategoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!expenseDate) {
      toast.error("Please select an expense date");
      return;
    }
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!paidFromAccountId) {
      toast.error("Please select a source account");
      return;
    }

    const payload = {
      expenseCategoryId,
      expenseStatus: expenseStatus || undefined,
      expenseDate,
      vendorPayeeName: vendorPayeeName.trim() || undefined,
      expenseDescription: expenseDescription.trim() || undefined,
      isApproved,
      expenseAmount: Number(expenseAmount) || 0,
      paymentMethod,
      paidFromAccountId,
      referenceNumber: referenceNumber.trim() || undefined,
      paymentDate: paymentDate || undefined,
      remarks: remarks.trim() || undefined,
    };

    try {
      await updateMutation.mutateAsync({ id, data: payload });
      toast.success("Expense updated successfully");
      navigate("/expenses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update expense. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading expense details...</p>
      </main>
    );
  }

  if (error || !expense) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <p className="text-red-500 text-sm">Failed to load expense details.</p>
        <button
          onClick={() => navigate("/expenses")}
          className="mt-4 rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
        >
          Back to Expenses
        </button>
      </main>
    );
  }

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
            <span className="font-semibold text-slate-600">Edit Expense</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Edit Expense ({expense.expenseNumber})
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Update expense details, payment information and categorization
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
                {/* Expense Number (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Expense Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={expense.expenseNumber || ""}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={expenseCategoryId}
                      onChange={(e) => setExpenseCategoryId(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
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
                    placeholder="Describe the expense..."
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={expenseStatus}
                      onChange={(e) => setExpenseStatus(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select status</option>
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
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
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Source Account */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Source Account <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={paidFromAccountId}
                      onChange={(e) => setPaidFromAccountId(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select source account</option>
                      {accounts.map((acc) => (
                        <option key={acc._id} value={acc._id}>
                          {acc.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
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
        <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={updateMutation.isPending}
            onClick={handleSubmit}
            className="rounded-lg bg-[#008951] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#007545] disabled:opacity-50"
          >
            {updateMutation.isPending ? "Updating..." : "Update Expense"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default UpdateExpenses;
