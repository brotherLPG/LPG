import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useToast } from "../../utils/GlobalToast";
import SearchableCustomerSelect from "../../components/SearchableCustomerSelect";
import {
  useCylinderTypeById,
  useUpdateCylinderType,
  useCylinderTypeFormOptions,
} from "../../queries/cylinderTypes/cylinderTypes.queries";

function UpdateCylinderType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Refs for required fields
  const typeNameRef = useRef(null);
  const categoryRef = useRef(null);
  const capacityKgRef = useRef(null);
  const tareWeightKgRef = useRef(null);
  const sellingPriceRef = useRef(null);

  // Error states
  const [typeNameError, setTypeNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [capacityKgError, setCapacityKgError] = useState("");
  const [tareWeightKgError, setTareWeightKgError] = useState("");
  const [sellingPriceError, setSellingPriceError] = useState("");

  const { data, isLoading: isFetching } = useCylinderTypeById(id);
  const updateMutation = useUpdateCylinderType();
  const { data: formOptionsResponse, isLoading: optionsLoading } =
    useCylinderTypeFormOptions();
  const formOptions = formOptionsResponse?.data || {};
  const categories = formOptions.categories || [];
  const colorCodes = formOptions.colorCodes || [];
  const valveTypes = formOptions.valveTypes || [];
  const materials = formOptions.materials || [];
  const statuses = formOptions.statuses || [];

  const toOptions = (items) =>
    (items || []).map((item) => ({ _id: item.value, label: item.label }));
  const categoryOptions = toOptions(categories);
  const colorCodeOptions = toOptions(colorCodes);
  const valveTypeOptions = toOptions(valveTypes);
  const materialOptions = toOptions(materials);

  const activeLabel =
    statuses.find((status) => status.value === true)?.label || "Active Type";
  const inactiveLabel =
    statuses.find((status) => status.value === false)?.label || "Inactive Type";

  const cylinderData = data?.data?._doc || data?.data;

  const [typeName, setTypeName] = useState("");
  const [category, setCategory] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [tareWeightKg, setTareWeightKg] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sellingPrice, setSellingPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [refillPrice, setRefillPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [description, setDescription] = useState("");
  const [valveType, setValveType] = useState("");
  const [material, setMaterial] = useState("");
  const [safetyCert, setSafetyCert] = useState("");

  useEffect(() => {
    if (cylinderData) {
      setTypeName(cylinderData.typeName || "");
      setCategory(cylinderData.cylinderCategory || "");
      setCapacityKg(cylinderData.capacityKg ?? "");
      setTareWeightKg(cylinderData.tareWeightKg ?? "");
      setColorCode(cylinderData.colorCode || "");
      setIsActive(typeof cylinderData.isActive === "boolean" ? cylinderData.isActive : true);
      setSellingPrice(cylinderData.sellingPricePerCylinder ?? "");
      setPurchasePrice(cylinderData.purchasePriceAmount ?? "");
      setRefillPrice(cylinderData.refillPriceAmount ?? "");
      setSecurityDeposit(cylinderData.securityDepositAmount ?? "");
      setDescription(cylinderData.description || "");
      setValveType(cylinderData.valveType || "");
      setMaterial(cylinderData.material || "");
      setSafetyCert(cylinderData.safetyCertificationNumber || "");
    }
  }, [cylinderData]);

  const validateForm = () => {
    let hasError = false;

    if (!typeName.trim() || typeName.trim().length < 2) {
      setTypeNameError("Type name must contain at least 2 characters");
      typeNameRef.current?.focus();
      hasError = true;
    } else {
      setTypeNameError("");
    }

    if (!category) {
      setCategoryError("Category is required");
      if (!hasError) categoryRef.current?.focus();
      hasError = true;
    } else {
      setCategoryError("");
    }

    if (!capacityKg || parseFloat(capacityKg) <= 0) {
      setCapacityKgError("Capacity must be greater than 0");
      if (!hasError) capacityKgRef.current?.focus();
      hasError = true;
    } else {
      setCapacityKgError("");
    }

    if (!tareWeightKg || parseFloat(tareWeightKg) <= 0) {
      setTareWeightKgError("Tare weight must be greater than 0");
      if (!hasError) tareWeightKgRef.current?.focus();
      hasError = true;
    } else {
      setTareWeightKgError("");
    }

    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      setSellingPriceError("Selling price must be greater than 0");
      if (!hasError) sellingPriceRef.current?.focus();
      hasError = true;
    } else {
      setSellingPriceError("");
    }

    return !hasError;
  };

  const clearError = (setErrorFn) => {
    setErrorFn("");
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    const payload = {
      typeName,
      cylinderCategory: category,
      capacityKg: parseFloat(capacityKg) || 0,
      tareWeightKg: parseFloat(tareWeightKg) || 0,
      colorCode,
      isActive,
      sellingPricePerCylinder: parseFloat(sellingPrice) || 0,
      purchasePriceAmount: parseFloat(purchasePrice) || 0,
      refillPriceAmount: parseFloat(refillPrice) || 0,
      securityDepositAmount: parseFloat(securityDeposit) || 0,
      description,
      valveType,
      material,
      safetyCertificationNumber: safetyCert,
    };

    try {
      await updateMutation.mutateAsync({ id, data: payload });
      toast.success("Cylinder type updated successfully.");
      navigate("/cylinder-types");
    } catch (err) {
      const firstError = err?.response?.data?.errors?.[0];
      const mainMessage = err?.response?.data?.message;
      const errorMessage = firstError
        ? `${firstError.path}: ${firstError.message}`
        : mainMessage || "Failed to update cylinder type. Please try again.";
      toast.error(errorMessage);
    }
  };

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

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
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
            onClick={() => navigate("/cylinder-types")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Cylinder Types
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Edit Cylinder Type</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Cylinder Type</h1>
        <p className="mt-1 text-sm text-slate-500">Update cylinder specification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">Cylinder Specification</h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type Code</label>
                <input type="text" disabled value={cylinderData?.typeCode || ""} className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type Name <span className="text-rose-500">*</span></label>
                <input
                  ref={typeNameRef}
                  type="text"
                  placeholder="e.g. Commercial LPG 11KG"
                  value={typeName}
                  onChange={(e) => {
                    setTypeName(e.target.value);
                    clearError(setTypeNameError);
                  }}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${
                    typeNameError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
                  }`}
                />
                {typeNameError && (
                  <p className="mt-1.5 text-xs text-rose-500">{typeNameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category <span className="text-rose-500">*</span></label>
                <SearchableCustomerSelect
                  customers={categoryOptions}
                  value={category}
                  onChange={(option) => {
                    setCategory(option?._id || "");
                    clearError(setCategoryError);
                  }}
                  triggerRef={categoryRef}
                  disabled={optionsLoading}
                  error={!!categoryError}
                  placeholder={optionsLoading ? "Loading..." : "Select Category"}
                  getLabel={(option) => option.label}
                  getSearchText={(option) => option.label.toLowerCase()}
                  emptyText="No category found"
                />
                {categoryError && (
                  <p className="mt-1.5 text-xs text-rose-500">{categoryError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity (KG) <span className="text-rose-500">*</span></label>
                <input
                  ref={capacityKgRef}
                  type="text"
                  placeholder="e.g. 11.0"
                  value={capacityKg}
                  onChange={(e) => {
                    setCapacityKg(e.target.value);
                    clearError(setCapacityKgError);
                  }}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${
                    capacityKgError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
                  }`}
                />
                {capacityKgError && (
                  <p className="mt-1.5 text-xs text-rose-500">{capacityKgError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tare Weight (KG) <span className="text-rose-500">*</span></label>
                <input
                  ref={tareWeightKgRef}
                  type="text"
                  placeholder="e.g. 8.5"
                  value={tareWeightKg}
                  onChange={(e) => {
                    setTareWeightKg(e.target.value);
                    clearError(setTareWeightKgError);
                  }}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${
                    tareWeightKgError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
                  }`}
                />
                {tareWeightKgError && (
                  <p className="mt-1.5 text-xs text-rose-500">{tareWeightKgError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Color Code</label>
                <SearchableCustomerSelect
                  customers={colorCodeOptions}
                  value={colorCode}
                  onChange={(option) => setColorCode(option?._id || "")}
                  disabled={optionsLoading}
                  placeholder={optionsLoading ? "Loading..." : "Select Color Identification"}
                  getLabel={(option) => option.label}
                  getSearchText={(option) => option.label.toLowerCase()}
                  emptyText="No color code found"
                />
                <p className="mt-1.5 text-xs text-slate-400">Color identification for cylinder body status/brand</p>
              </div>

              <div className="md:col-span-2 mt-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? "bg-[#10b981]" : "bg-slate-200"}`} role="switch" aria-checked={isActive}>
                    <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                  <span className={`text-sm font-semibold ${isActive ? "text-[#008951]" : "text-error"}`}>
                    {isActive ? activeLabel : inactiveLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">Pricing & Rates</h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Selling Price (Rs.) <span className="text-rose-500">*</span></label>
                <input
                  ref={sellingPriceRef}
                  type="text"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) => {
                    setSellingPrice(e.target.value);
                    clearError(setSellingPriceError);
                  }}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${
                    sellingPriceError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
                  }`}
                />
                {sellingPriceError && (
                  <p className="mt-1.5 text-xs text-rose-500">{sellingPriceError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Purchase Price (Rs.)</label>
                <input type="text" placeholder="0.00" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Refill Price (Rs.)</label>
                <input type="text" placeholder="0.00" value={refillPrice} onChange={(e) => setRefillPrice(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Security Deposit (Rs.)</label>
                <input type="text" placeholder="0.00" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Additional Details</h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description / Notes</label>
              <textarea rows="2" placeholder="Enter cylinder maintenance rules, storage details, or descriptive notes here..." className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Valve Type</label>
                <SearchableCustomerSelect
                  customers={valveTypeOptions}
                  value={valveType}
                  onChange={(option) => setValveType(option?._id || "")}
                  disabled={optionsLoading}
                  placeholder={optionsLoading ? "Loading..." : "Select Valve Type"}
                  getLabel={(option) => option.label}
                  getSearchText={(option) => option.label.toLowerCase()}
                  emptyText="No valve type found"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Material</label>
                <SearchableCustomerSelect
                  customers={materialOptions}
                  value={material}
                  onChange={(option) => setMaterial(option?._id || "")}
                  disabled={optionsLoading}
                  placeholder={optionsLoading ? "Loading..." : "Select Material"}
                  getLabel={(option) => option.label}
                  getSearchText={(option) => option.label.toLowerCase()}
                  emptyText="No material found"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Safety Certification Number</label>
                <input type="text" placeholder="e.g. ISO-9001 / DOT-4BA" value={safetyCert} onChange={(e) => setSafetyCert(e.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button onClick={() => navigate("/cylinder-types")} className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending || optionsLoading}
          className={`rounded-lg px-6 py-2 text-sm font-medium text-white transition ${updateMutation.isPending || optionsLoading ? "bg-emerald-300 pointer-events-none" : "bg-[#008951] hover:bg-[#007545]"}`}
        >
          {updateMutation.isPending ? "Updating..." : "Update Cylinder Type"}
        </button>
      </div>
    </main>
  );
}

export default UpdateCylinderType;
