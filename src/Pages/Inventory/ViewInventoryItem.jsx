import { ArrowLeft, Pencil, Package, Tag, Fuel, Scale, CheckCircle2, BadgeCheck, Boxes, TrendingDown, TrendingUp, RefreshCw, Container, Weight, Wallet, Banknote, CalendarDays, Building2, MapPin, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useInventoryItemById } from "../../queries/inventory/inventory.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function DetailItem({ label, value, icon: Icon }) {
    return (
        <div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-gray-800 bg-linear-to-br from-slate-50 to-white dark:from-gray-800/60 dark:to-gray-900/40 px-4 py-3 transition hover:border-blue-200 dark:hover:border-blue-800">
              {Icon && (
                <div className="mt-0.5 shrink-0 rounded-lg bg-blue-100/80 dark:bg-blue-900/50 p-1.5">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">{label}</p>
                <p className="mt-0.5 wrap-break-word text-sm font-semibold text-slate-800 dark:text-gray-200">{value || "-"}</p>
              </div>
            </div>
        </div>
    );
}

function ViewInventoryItem() {
    const navigate = useNavigate();
    const { can } = usePermissions();
    const { id } = useParams();
    const { data, isLoading, error } = useInventoryItemById(id);
    const item = data?.data;

    if (isLoading) {
        return <main className="flex min-h-full items-center justify-center bg-slate-50 dark:bg-gray-800 p-8 text-sm text-slate-500 dark:text-gray-400">Loading inventory item...</main>;
    }

    if (error || !item) {
        return (
            <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-gray-800 p-8 text-sm text-red-500 dark:text-red-400">
                <p>Unable to load inventory item.</p>
                <button type="button" onClick={() => navigate("/inventory")} className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-gray-900 px-3 py-2 font-semibold text-slate-600 dark:text-gray-400 shadow-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Inventory
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-full bg-slate-50 dark:bg-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs">
                        <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">Dashboard</button>
                        <span className="px-1 text-slate-400 dark:text-gray-500">/</span>
                        <button type="button" onClick={() => navigate("/inventory")} className="font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">Inventory</button>
                        <span className="px-1 text-slate-400 dark:text-gray-500">/</span>
                        <span className="font-semibold text-slate-600 dark:text-gray-400">Inventory Item Details</span>
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">{item.itemName}</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Inventory item details, stock levels, and supplier information</p>
                </div>
                <div className="flex gap-2">
                    {can("inventory-items", "update") && (
                    <button type="button" onClick={() => navigate(`/inventory/edit/${item._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                        <Pencil className="h-4 w-4" /> Edit Item
                    </button>
                    )}
                </div>
            </div>

            <div className="mb-6 rounded-2xl border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-200/70 dark:bg-blue-800/60">
                            <Package className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">Inventory Item</p>
                            <p className="text-xl font-extrabold text-blue-800 dark:text-blue-200">{item.itemName || "—"}</p>
                            <p className="mt-0.5 text-sm text-slate-600 dark:text-gray-400">{item.itemCode || "—"}{item.categoryLabel ? ` • ${item.categoryLabel}` : ""}</p>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" /> {item.stockStatusLabel || "Unknown"}
                    </span>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-200/70 dark:bg-blue-800/60 p-2">
                            <Boxes className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Current Quantity</p>
                            <p className="mt-1 text-2xl font-extrabold text-blue-700 dark:text-blue-300">{item.currentQuantity ?? "-"}</p>
                            <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">{item.unitOfMeasureLabel || "Units"} in stock</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-amber-200/70 dark:bg-amber-800/60 p-2">
                            <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Minimum Stock Level</p>
                            <p className="mt-1 text-2xl font-extrabold text-amber-700 dark:text-amber-300">{item.minimumStockLevel ?? "-"}</p>
                            <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Reorder threshold</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-emerald-200/70 dark:bg-emerald-800/60 p-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Maximum Stock Level</p>
                            <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{item.maximumStockLevel ?? "-"}</p>
                            <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Storage capacity limit</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><Package className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Item Information</h2></div>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        
                        <DetailItem label="Item Name" value={item.itemName} icon={Package} />
                        <DetailItem label="Category" value={item.categoryLabel} icon={Tag} />
                        <DetailItem label="Cylinder Type" value={item.cylinderTypeName || "N/A"} icon={Fuel} />
                        <DetailItem label="Unit of Measure" value={item.unitOfMeasureLabel} icon={Scale} />
                        <DetailItem label="Active" value={item.isActive ? "Yes" : "No"} icon={BadgeCheck} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><Boxes className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Stock Levels</h2></div>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        
                        
                        
                        <DetailItem label="Reorder Quantity" value={item.reorderQuantity} icon={RefreshCw} />
                        <DetailItem label="Cylinder Volume" value={item.cylinderVolume} icon={Container} />
                        <DetailItem label="Capacity (KG)" value={item.capacityKg || "N/A"} icon={Weight} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Pricing</h2></div>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Unit Purchase Price" value={`Rs. ${item.unitPurchasePriceAmount}`} icon={Wallet} />
                        <DetailItem label="Unit Selling Price" value={`Rs. ${item.unitSellingPriceAmount}`} icon={Banknote} />
                        <DetailItem label="Last Purchase Date" value={item.lastPurchaseDate ? new Date(item.lastPurchaseDate).toLocaleDateString() : "N/A"} icon={CalendarDays} />
                        <DetailItem label="Preferred Supplier" value={item.preferredSupplierName} icon={Building2} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Storage Information</h2></div>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Rack / Bay Number" value={item.rackBayNumber} icon={MapPin} />
                        <DetailItem label="Storage Notes" value={item.storageNotes} icon={FileText} />
                    </dl>
                </section>

                <section className="lg:col-span-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Description</h2></div>
                    <div className="p-5">
                        <p className="text-sm text-slate-700 dark:text-gray-300">{item.description || "No description provided."}</p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ViewInventoryItem;
