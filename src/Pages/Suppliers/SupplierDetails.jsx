import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSupplierById } from "../../queries/suppliers/suppliers.queries";

function DetailItem({ label, value }) {
    return (
        <div>
            <dt className="text-xs font-semibold text-slate-400">{label}</dt>
            <dd className="mt-1 wrap-break-word text-sm text-slate-700">{value || "-"}</dd>
        </div>
    );
}

function SupplierDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading, error } = useSupplierById(id);
    const supplier = data?.data;

    if (isLoading) {
        return <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">Loading supplier...</main>;
    }

    if (error || !supplier) {
        return (
            <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
                <p>Unable to load supplier.</p>
                <button type="button" onClick={() => navigate("/suppliers")} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Suppliers
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs">
                        <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 hover:text-slate-600">Dashboard</button>
                        <span className="px-1 text-slate-400">/</span>
                        <button type="button" onClick={() => navigate("/suppliers")} className="font-medium text-slate-400 hover:text-slate-600">Suppliers</button>
                        <span className="px-1 text-slate-400">/</span>
                        <span className="font-semibold text-slate-600">Supplier Details</span>
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{supplier.supplierName}</h1>
                    <p className="mt-1 text-sm text-slate-500">Supplier profile, payment terms, address, and bank details</p>
                </div>
                <div className="flex gap-2">
                   
                    <button type="button" onClick={() => navigate(`/suppliers/edit/${supplier._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                        <Pencil className="h-4 w-4" /> Edit Supplier
                    </button>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Supplier Information</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Supplier Code" value={supplier.supplierCode} />
                        <DetailItem label="Supplier Name" value={supplier.supplierName} />
                        <DetailItem label="Contact Person" value={supplier.contactPersonName} />
                        <DetailItem label="Phone Number" value={supplier.phoneNumber} />
                        <DetailItem label="Email Address" value={supplier.emailAddress} />
                        <DetailItem label="Status" value={supplier.isActive ? "Active" : "Inactive"} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Payment &amp; Credit</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Payment Terms" value={supplier.paymentTermDays === 0 ? "Cash on Delivery" : `${supplier.paymentTermDays} days`} />
                        <DetailItem label="Credit Limit" value={supplier.creditLimitAmount?.toLocaleString()} />
                        <DetailItem label="Opening Balance" value={supplier.openingBalanceAmount?.toLocaleString()} />
                        <DetailItem label="Tax Registration Number" value={supplier.taxRegistrationNumber} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Address</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <div className="sm:col-span-2"><DetailItem label="Business Address" value={supplier.businessAddress} /></div>
                        <DetailItem label="City" value={supplier.city} />
                        <DetailItem label="State / Province" value={supplier.stateProvince || supplier.state} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Bank Details</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Bank Name" value={supplier.bankName} />
                        <DetailItem label="Account Title" value={supplier.bankAccountTitle || supplier.accountTitle} />
                        <DetailItem label="Account Number" value={supplier.bankAccountNumber || supplier.accountNumber} />
                        <DetailItem label="IBAN" value={supplier.iban} />
                    </dl>
                </section>
            </div>
        </main>
    );
}

export default SupplierDetails;