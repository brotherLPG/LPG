import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

function AddInventoryItem() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
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
            onClick={() => navigate("/inventory")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Inventory
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Add Inventory Item</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Inventory Item
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Register a new inventory item and set stock levels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Item Information (Left) */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900">Item Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Item Code
              </label>
              <input
                type="text"
                disabled
                placeholder="VALVE-KIT-12KG"
                className="w-full rounded-lg border border-gray-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Standard Brass Valves 12KG"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="Spare Parts"
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="Filled Cylinder">Filled Cylinder</option>
                    <option value="Empty Cylinder">Empty Cylinder</option>
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Consumables">Consumables</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cylinder Volume
                </label>
                <div className="relative">
                  <select
                    defaultValue="N/A"
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="N/A">N/A</option>
                    <option value="3.0 KG">3.0 KG</option>
                    <option value="5.0 KG">5.0 KG</option>
                    <option value="11.8 KG">11.8 KG</option>
                    <option value="22.0 KG">22.0 KG</option>
                    <option value="45.0 KG">45.0 KG</option>
                    <option value="50.0 KG">50.0 KG</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description / Notes
              </label>
              <textarea
                rows="3"
                placeholder="Enter item specifications, compatibility details, or storage instructions..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status Toggle
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                    isActive ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>Active Item</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Stock & Threshold (Right) */}
        <div className="lg:col-span-1 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-fit">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900">Stock & Threshold</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Current Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Minimum Stock Level <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="30"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Maximum Stock Level
              </label>
              <input
                type="number"
                placeholder="150"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit of Measure <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  defaultValue="Sets"
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Sets">Sets</option>
                  <option value="Units">Units</option>
                  <option value="KG">KG</option>
                  <option value="Liters">Liters</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Reorder Quantity
              </label>
              <input
                type="number"
                placeholder="100"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Supplier & Pricing */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900">Supplier & Pricing</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Preferred Supplier
              </label>
              <div className="relative">
                <select
                  defaultValue="MetalCorp Pakistan Ltd"
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="MetalCorp Pakistan Ltd">MetalCorp Pakistan Ltd</option>
                  <option value="Karachi Engineering">Karachi Engineering</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit Purchase Price (Rs.)
              </label>
              <input
                type="text"
                placeholder="1,250"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit Selling Price (Rs.)
              </label>
              <input
                type="text"
                placeholder="1,850"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Last Purchase Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-02-15"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 [color-scheme:light]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Storage Location */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900">Storage Location</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Warehouse / Storage Area
              </label>
              <div className="relative">
                <select
                  defaultValue="Sector I-9 Warehouse A"
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Sector I-9 Warehouse A">Sector I-9 Warehouse A</option>
                  <option value="Sector I-9 Warehouse B">Sector I-9 Warehouse B</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Rack / Bay Number
              </label>
              <input
                type="text"
                placeholder="Rack 12, Shelf C"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Storage Notes
            </label>
            <input
              type="text"
              placeholder="Environmental or handling constraints (e.g. Keep away from heat)"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/inventory")}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => navigate("/inventory")}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Save Item
        </button>
      </div>

    </main>
  );
}

export default AddInventoryItem;
