import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useToast } from "../../utils/GlobalToast";
import {
  useCreateCylinderType,
  useCylinderTypeFormOptions,
} from "../../queries/cylinderTypes/cylinderTypes.queries";

function AddCylinderType() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
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

  const [typeName, setTypeName] = useState("");
  const [category, setCategory] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [tareWeightKg, setTareWeightKg] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [refillPrice, setRefillPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [description, setDescription] = useState("");
  const [valveType, setValveType] = useState("");
  const [material, setMaterial] = useState("");
  const [safetyCert, setSafetyCert] = useState("");

  const createMutation = useCreateCylinderType();
  const { data: formOptionsResponse, isLoading: optionsLoading } =
    useCylinderTypeFormOptions();
  const formOptions = formOptionsResponse?.data || {};
  const nextTypeCode = formOptions.nextTypeCode || "";
  const categories = formOptions.categories || [];
  const colorCodes = formOptions.colorCodes || [];
  const valveTypes = formOptions.valveTypes || [];
  const materials = formOptions.materials || [];
  const statuses = formOptions.statuses || [];
  const activeLabel =
    statuses.find((status) => status.value === true)?.label || "Active Type";
  const inactiveLabel =
    statuses.find((status) => status.value === false)?.label || "Inactive Type";


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

     const handleSubmit = async (e) => {
       e.preventDefault();

       if (!validateForm()) {
         return;
       }

       try {
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

         await createMutation.mutateAsync(payload);
          toast.success("Cylinder type created successfully.");
          navigate("/cylinder-types");
       } catch (error) {
         const firstError = error?.response?.data?.errors?.[0];
         const mainMessage = error?.response?.data?.message;
         const errorMessage = firstError
           ? `${firstError.path}: ${firstError.message}`
           : mainMessage || "Failed to create Cylinder type. Please try again.";
         toast.error(errorMessage);
       }
     };


  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
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
            onClick={() => navigate("/cylinder-types")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Cylinder Types
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">
            Add Cylinder Type
          </span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Cylinder Type
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Define a new cylinder specification and set pricing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Cylinder Specification */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Cylinder Specification
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Type Code
                </label>
                <input
                  type="text"
                  disabled
                  value={
                    optionsLoading
                      ? "Loading..."
                      : nextTypeCode
                        ? `${nextTypeCode} (Auto-generated)`
                        : "Auto-generated on save"
                  }
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Type Name <span className="text-rose-500">*</span>
                </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    ref={categoryRef}
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      clearError(setCategoryError);
                    }}
                    disabled={optionsLoading}
                    className={`w-full appearance-none rounded-md border bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:ring-2 ${
                      categoryError
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                        : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
                    } disabled:bg-slate-100 disabled:cursor-not-allowed`}
                  >
                    <option value="" disabled>
                      {optionsLoading ? "Loading..." : "Select Category"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {categoryError && (
                  <p className="mt-1.5 text-xs text-rose-500">{categoryError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Capacity (KG) <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={capacityKgRef}
                  type="number"
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tare Weight (KG) <span className="text-rose-500">*</span>
                </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Color Code
                </label>
                <div className="relative">
                  <select
                    value={colorCode}
                    onChange={(e) => setColorCode(e.target.value)}
                    disabled={optionsLoading}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      {optionsLoading ? "Loading..." : "Select Color Identification"}
                    </option>
                    {colorCodes.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  Color identification for cylinder body status/brand
                </p>
              </div>

              <div className="md:col-span-2 mt-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  {/* <Switch
                    isSelected={isActive}
                    onValueChange={setIsActive}
                    classNames={{
                      wrapper: isActive ? "bg-[#008951]" : "bg-slate-200",
                    }}
                    size="sm"
                  /> */}
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? "bg-[#10b981]" : "bg-slate-200"}`}
                    role="switch"
                    aria-checked={isActive}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                  <span
                    className={`text-sm font-semibold ${isActive ? "text-[#008951]" : "text-error"}`}
                  >
                    {isActive ? activeLabel : inactiveLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1">
          {/* Card 2: Pricing & Rates */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Pricing & Rates
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Selling Price (Rs.) <span className="text-rose-500">*</span>
                </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Purchase Price (Rs.)
                </label>
                <input
                  type="text"
                  placeholder="0.00"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Refill Price (Rs.)
                </label>
                <input
                  type="text"
                  placeholder="0.00"
                  value={refillPrice}
                  onChange={(e) => setRefillPrice(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Security Deposit (Rs.)
                </label>
                <input
                  type="text"
                  placeholder="0.00"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Additional Details */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Additional Details
            </h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description / Notes
              </label>
              <textarea
                rows="2"
                placeholder="Enter cylinder maintenance rules, storage details, or descriptive notes here..."
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Valve Type
                </label>
                <div className="relative">
                  <select
                    value={valveType}
                    onChange={(e) => setValveType(e.target.value)}
                    disabled={optionsLoading}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      {optionsLoading ? "Loading..." : "Select Valve Type"}
                    </option>
                    {valveTypes.map((valve) => (
                      <option key={valve.value} value={valve.value}>
                        {valve.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Material
                </label>
                <div className="relative">
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    disabled={optionsLoading}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      {optionsLoading ? "Loading..." : "Select Material"}
                    </option>
                    {materials.map((mat) => (
                      <option key={mat.value} value={mat.value}>
                        {mat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Safety Certification Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. ISO-9001 / DOT-4BA"
                  value={safetyCert}
                  onChange={(e) => setSafetyCert(e.target.value)}
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
          onClick={() => navigate("/cylinder-types")}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={createMutation.isPending || optionsLoading}
          className={`rounded-lg px-6 py-2 text-sm font-medium text-white transition ${createMutation.isPending || optionsLoading ? "bg-emerald-300 pointer-events-none" : "bg-[#008951] hover:bg-[#007545]"}`}
        >
          {createMutation.isPending ? "Saving..." : "Save Cylinder Type"}
        </button>
      </div>
    </main>
  );
}

export default AddCylinderType;
