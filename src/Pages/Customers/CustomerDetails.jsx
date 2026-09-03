import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerById } from "../../queries/customers/customers.queries";

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="mt-1 wrap-break-word text-sm text-slate-700">{value || "-"}</dd>
    </div>
  );
}

function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useCustomerById(id);
  const customer = data?.data;

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">
        Loading customer...
      </main>
    );
  }

  if (error || !customer) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
        <p>Unable to load customer.</p>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs">
            <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 hover:text-slate-600">
              Dashboard
            </button>
            <span className="px-1 text-slate-400">/</span>
            <button type="button" onClick={() => navigate("/customers")} className="font-medium text-slate-400 hover:text-slate-600">
              Customers
            </button>
            <span className="px-1 text-slate-400">/</span>
            <span className="font-semibold text-slate-600">Customer Details</span>
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{customer.customerName}</h1>
          <p className="mt-1 text-sm text-slate-500">Customer profile, contact details, and credit information</p>
        </div>
        <div className="flex gap-2">
        
          <button type="button" onClick={() => navigate(`/customers/edit/${customer._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <Pencil className="h-4 w-4" /> Edit Customer
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Customer Information</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Customer Code" value={customer.customerCode} />
            <DetailItem label="Customer Name" value={customer.customerName} />
            <DetailItem label="Contact Person" value={customer.contactPersonName} />
            <DetailItem label="Status" value={customer.isActive ? "Active" : "Inactive"} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Contact Details</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Phone Number" value={customer.phoneNumber} />
            <DetailItem label="Email Address" value={customer.emailAddress} />
            <div className="sm:col-span-2"><DetailItem label="Billing Address" value={customer.billingAddress} /></div>
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Credit &amp; Tax</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-3">
            <DetailItem label="Credit Limit" value={customer.creditLimitAmount?.toLocaleString()} />
            <DetailItem label="Payment Term" value={customer.paymentTermDays ? `${customer.paymentTermDays} days` : undefined} />
            <DetailItem label="Opening Balance" value={customer.openingBalanceAmount?.toLocaleString()} />
            <DetailItem label="Tax Registration Number" value={customer.taxRegistrationNumber} />
          </dl>
        </section>
      </div>
    </main>
  );
}

export default CustomerDetails;