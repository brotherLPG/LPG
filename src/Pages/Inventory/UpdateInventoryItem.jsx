import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useUpdateInventoryItem, useInventoryItemById, useInventoryFormOptions } from "../../queries/inventory/inventory.queries";
import { useToast } from "../../utils/GlobalToast";

function UpdateInventoryItem() {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const updateMutation = useUpdateInventoryItem();
  const { data: formOptions, isLoading: optionsLoading } = useInventoryFormOptions();
  
  const { data: inventoryData, isLoading: itemLoading } = useInventoryItemById(id);
  const item = inventoryData?.data;
  
  const [formData, setFormData] = useState({
    itemName: "",
    itemCategory: "",
    unitOfMeasure: "",
    cylinderTypeId: "",
    description: "",
    currentQuantity: 0,
    minimumStockLevel: 0,
    maximumStockLevel: 0,
    reorderQuantity: 0,
    preferredSupplierId: "",
    unitPurchasePriceAmount: 0,
    unitSellingPriceAmount: 0,
    lastPurchaseDate: "",
    rackBayNumber: "",
    storageNotes: "",
    isActive: true
  });

  const categories = formOptions?.data?.categories || [];
  const unitsOfMeasure = formOptions?.data?.unitsOfMeasure || [];
  const suppliers = formOptions?.data?.suppliers || [];
  const cylinderTypes = formOptions?.data?.cylinderTypes || [];

  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName || "",
        itemCategory: item.itemCategory || "",
        unitOfMeasure: item.unitOfMeasure || "",
        cylinderTypeId: item.cylinderTypeId || "",
        description: item.description || "",
        currentQuantity: item.currentQuantity || 0,
        minimumStockLevel: item.minimumStockLevel || 0,
        maximumStockLevel: item.maximumStockLevel || 0,
        reorderQuantity: item.reorderQuantity || 0,
        preferredSupplierId: item.preferredSupplierId || "",
        unitPurchasePriceAmount: item.unitPurchasePriceAmount || 0,
        unitSellingPriceAmount: item.unitSellingPriceAmount || 0,
        lastPurchaseDate: item.lastPurchaseDate ? item.lastPurchaseDate.split('T')[0] : "",
        rackBayNumber: item.rackBayNumber || "",
        storageNotes: item.storageNotes || "",
        isActive: item.isActive !== undefined ? item.isActive : true
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      itemName: formData.itemName,
      itemCategory: formData.itemCategory,
      unitOfMeasure: formData.unitOfMeasure,
      cylinderTypeId: formData.cylinderTypeId || null,
      description: formData.description,
      currentQuantity: formData.currentQuantity,
      minimumStockLevel: formData.minimumStockLevel,
      maximumStockLevel: formData.maximumStockLevel,
      reorderQuantity: formData.reorderQuantity,
      preferredSupplierId: formData.preferredSupplierId || null,
      unitPurchasePriceAmount: formData.unitPurchasePriceAmount,
      unitSellingPriceAmount: formData.unitSellingPriceAmount,
      lastPurchaseDate: formData.lastPurchaseDate || null,
      rackBayNumber: formData.rackBayNumber,
      storageNotes: formData.storageNotes,
      isActive: formData.isActive
    };

    updateMutation.mutate({ id, data: payload }, {
      onSuccess: () => {
        toast.success("Inventory item updated successfully");
        navigate("/inventory");
      },
      onError: (error) => {
        console.error("Error updating inventory item:", error);
        toast.error("Failed to update inventory item");
      }
    });
  };

  if (itemLoading) {
    return (
      <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-slate-500">Loading inventory item...</p>
        </div>
      </main>
    );
  }

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
          <span className="font-semibold text-slate-600">Update Inventory Item</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Update Inventory Item
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Edit inventory item details and stock levels
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
                value={item?.itemCode || ""}
                className="w-full rounded-lg border border-gray-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
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
                    name="itemCategory"
                    value={formData.itemCategory}
                    onChange={handleChange}
                    disabled={optionsLoading}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cylinder Type
                </label>
                <div className="relative">
                  <select
                    name="cylinderTypeId"
                    value={formData.cylinderTypeId || ""}
                    onChange={handleChange}
                    disabled={optionsLoading}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
                  >
                    <option value="">Select Cylinder Type</option>
                    {cylinderTypes.map((type) => (
                      <option key={type._id} value={type._id}>{type.label}</option>
                    ))}
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
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                    formData.isActive ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${formData.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>Active Item</span>
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
                name="currentQuantity"
                value={formData.currentQuantity}
                onChange={handleChange}
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
                name="minimumStockLevel"
                value={formData.minimumStockLevel}
                onChange={handleChange}
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
                name="maximumStockLevel"
                value={formData.maximumStockLevel}
                onChange={handleChange}
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
                  name="unitOfMeasure"
                  value={formData.unitOfMeasure}
                  onChange={handleChange}
                  disabled={optionsLoading}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
                >
                  <option value="">Select Unit</option>
                  {unitsOfMeasure.map((unit) => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
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
                name="reorderQuantity"
                value={formData.reorderQuantity}
                onChange={handleChange}
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
                  name="preferredSupplierId"
                  value={formData.preferredSupplierId}
                  onChange={handleChange}
                  disabled={optionsLoading}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>{supplier.supplierName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit Purchase Price (Rs.)
              </label>
              <input
                type="number"
                name="unitPurchasePriceAmount"
                value={formData.unitPurchasePriceAmount}
                onChange={handleChange}
                placeholder="1,250"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit Selling Price (Rs.)
              </label>
              <input
                type="number"
                name="unitSellingPriceAmount"
                value={formData.unitSellingPriceAmount}
                onChange={handleChange}
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
                  name="lastPurchaseDate"
                  value={formData.lastPurchaseDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 scheme-light"
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
                name="rackBayNumber"
                value={formData.rackBayNumber}
                onChange={handleChange}
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
              name="storageNotes"
              value={formData.storageNotes}
              onChange={handleChange}
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
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending ? 'Updating...' : 'Update Item'}
        </button>
      </div>

    </main>
  );
}

export default UpdateInventoryItem;
