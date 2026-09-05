import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useInventoryItemById } from "../../queries/inventory/inventory.queries";

function DetailItem({ label, value }) {
    return (
        <div>
            <dt className="text-xs font-semibold text-slate-400">{label}</dt>
            <dd className="mt-1 text-sm text-slate-700">{value || "-"}</dd>
        </div>
    );
}

function ViewInventoryItem() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading, error } = useInventoryItemById(id);
    const item = data?.data;

    if (isLoading) {
        return <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">Loading inventory item...</main>;
    }

    if (error || !item) {
        return (
            <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
                <p>Unable to load inventory item.</p>
                <button type="button" onClick={() => navigate("/inventory")} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Inventory
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
                        <button type="button" onClick={() => navigate("/inventory")} className="font-medium text-slate-400 hover:text-slate-600">Inventory</button>
                        <span className="px-1 text-slate-400">/</span>
                        <span className="font-semibold text-slate-600">Inventory Item Details</span>
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{item.itemName}</h1>
                    <p className="mt-1 text-sm text-slate-500">Inventory item details, stock levels, and supplier information</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => navigate(`/inventory/edit/${item._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                        <Pencil className="h-4 w-4" /> Edit Item
                    </button>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Item Information</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Item Code" value={item.itemCode} />
                        <DetailItem label="Item Name" value={item.itemName} />
                        <DetailItem label="Category" value={item.categoryLabel} />
                        <DetailItem label="Cylinder Type" value={item.cylinderTypeName || "N/A"} />
                        <DetailItem label="Unit of Measure" value={item.unitOfMeasureLabel} />
                        <DetailItem label="Status" value={item.stockStatusLabel} />
                        <DetailItem label="Active" value={item.isActive ? "Yes" : "No"} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Stock Levels</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Current Quantity" value={item.currentQuantity} />
                        <DetailItem label="Minimum Stock Level" value={item.minimumStockLevel} />
                        <DetailItem label="Maximum Stock Level" value={item.maximumStockLevel} />
                        <DetailItem label="Reorder Quantity" value={item.reorderQuantity} />
                        <DetailItem label="Cylinder Volume" value={item.cylinderVolume} />
                        <DetailItem label="Capacity (KG)" value={item.capacityKg || "N/A"} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Pricing</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Unit Purchase Price" value={`Rs. ${item.unitPurchasePriceAmount}`} />
                        <DetailItem label="Unit Selling Price" value={`Rs. ${item.unitSellingPriceAmount}`} />
                        <DetailItem label="Last Purchase Date" value={item.lastPurchaseDate ? new Date(item.lastPurchaseDate).toLocaleDateString() : "N/A"} />
                        <DetailItem label="Preferred Supplier" value={item.preferredSupplierName} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Storage Information</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Rack / Bay Number" value={item.rackBayNumber} />
                        <DetailItem label="Storage Notes" value={item.storageNotes} />
                    </dl>
                </section>

                <section className="lg:col-span-2 rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Description</h2>
                    <div className="p-5">
                        <p className="text-sm text-slate-700">{item.description || "No description provided."}</p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ViewInventoryItem;
