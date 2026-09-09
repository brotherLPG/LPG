import {
  ArrowLeft,
  Edit3,
  Tag,
  Calendar,
  DollarSign,
  CreditCard,
  Landmark,
  FileText,
  User,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useExpenseById } from "../../queries/expenses/expenses.queries";

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
        {label}
      </dt>
      <dd className="text-sm text-slate-800 font-medium">{value || "-"}</dd>
    </div>
  );
}

function ViewExpense() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: expenseResponse, isLoading, error } = useExpenseById(id);
  const expense = expenseResponse?.data;

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">
        Loading expense details...
      </main>
    );
  }

  if (error || !expense) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
        <p>Unable to load expense details.</p>
        <button
          type="button"
          onClick={() => navigate("/expenses")}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Expenses
        </button>
      </main>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header & Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs mb-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Dashboard
              </button>
              <span className="px-1 text-slate-400">/</span>
              <button
                type="button"
                onClick={() => navigate("/expenses")}
                className="font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Expenses
              </button>
              <span className="px-1 text-slate-400">/</span>
              <span className="font-semibold text-slate-600">Expense Details</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Expense #{expense.expenseNumber || expense._id}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Complete expense record including payment and categorization details
            </p>
          </div>
          <div className="flex gap-2">
            {/* <button
              type="button"
              onClick={() => navigate("/expenses")}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button> */}
            <button
              type="button"
              onClick={() => navigate(`/expenses/edit/${expense._id}`)}
              className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" /> Edit Expense
            </button>
          </div>
        </div>

        {/* Status & Amount Banner */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Status</p>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeStyle(expense.expenseStatus)}`}>
                {expense.expenseStatus === "paid"
                  ? <CheckCircle className="h-4 w-4" />
                  : <Clock className="h-4 w-4" />}
                {expense.expenseStatusLabel || expense.expenseStatus || "-"}
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block" />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Approved</p>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${expense.isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-50 text-slate-600 border border-slate-200"}`}>
                {expense.isApproved ? "Yes" : "No"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Expense Amount</p>
            <p className="text-3xl font-extrabold text-slate-900">
              Rs. {(expense.expenseAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Card 1: Expense Info */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#008951]" /> Expense Information
            </h2>
            <dl className="grid gap-5 p-5 sm:grid-cols-2">
              <DetailItem label="Expense Number" value={expense.expenseNumber} icon={Tag} />
              <DetailItem label="Category" value={expense.categoryName} icon={Tag} />
              <DetailItem label="Expense Date" value={formatDate(expense.expenseDate)} icon={Calendar} />
              <DetailItem label="Vendor / Payee" value={expense.vendorPayeeName || "—"} icon={User} />
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Description
                </dt>
                <dd className="text-sm text-slate-800 font-medium bg-slate-50 rounded-md p-3 border border-slate-100">
                  {expense.expenseDescription || "No description provided."}
                </dd>
              </div>
              {expense.remarks && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    Remarks
                  </dt>
                  <dd className="text-sm text-slate-800 font-medium bg-slate-50 rounded-md p-3 border border-slate-100">
                    {expense.remarks}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Card 2: Payment Info */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#008951]" /> Payment Information
            </h2>
            <dl className="grid gap-5 p-5 sm:grid-cols-2">
              <DetailItem
                label="Amount"
                value={`Rs. ${(expense.expenseAmount || 0).toLocaleString()}`}
                icon={DollarSign}
              />
              <DetailItem
                label="Payment Method"
                value={expense.paymentMethodLabel || expense.paymentMethod}
                icon={CreditCard}
              />
              <DetailItem
                label="Source Account"
                value={expense.paidFromAccountName}
                icon={Landmark}
              />
              <DetailItem
                label="Reference Number"
                value={expense.referenceNumber || "—"}
                icon={Tag}
              />
              <DetailItem
                label="Payment Date"
                value={formatDate(expense.paymentDate)}
                icon={Calendar}
              />
            </dl>
          </section>

          {/* Card 3: Audit Info (Full Width) */}
          <section className="lg:col-span-2 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="h-4 w-4 text-[#008951]" /> Recorded & Approval Info
            </h2>
            <dl className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem
                label="Recorded By"
                value={expense.recordedByName}
                icon={User}
              />
              <DetailItem
                label="Approved By"
                value={expense.approvedByName || "—"}
                icon={User}
              />
              <DetailItem
                label="Created At"
                value={expense.createdAt ? new Date(expense.createdAt).toLocaleString() : "-"}
                icon={Calendar}
              />
              <DetailItem
                label="Last Updated"
                value={expense.updatedAt ? new Date(expense.updatedAt).toLocaleString() : "-"}
                icon={Calendar}
              />
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ViewExpense;
