import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useToast } from "../../utils/GlobalToast";
import { useCreateCylinderType, useCylinderTypes } from "../../queries/cylinderTypes/cylinderTypes.queries";

function AddCylinderType() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const toast = useToast();

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
  const { data: cylinderTypesData } = useCylinderTypes({ limit: 1 });

  const meta = cylinderTypesData?.data?.meta;


     const handleSubmit = async (e) => {
       e.preventDefault();

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
         toast.error(
           error.response?.data?.message ||
             "Failed to create Cylinder type. Please try again.",
         );
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
                  value="CYL-008"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Type Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Commercial LPG 11KG"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue=""
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {meta?.categories?.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Capacity (KG) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 11.0"
                  value={capacityKg}
                  onChange={(e) => setCapacityKg(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tare Weight (KG) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8.5"
                  value={tareWeightKg}
                  onChange={(e) => setTareWeightKg(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Color Code
                </label>
                <div className="relative">
                  <select
                    defaultValue=""
                    value={colorCode}
                    onChange={(e) => setColorCode(e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>
                      Select Color Identification
                    </option>
                    {meta?.colorCodes?.map((color) => (
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
                    {isActive ? "Active Type" : "InActive Type"}
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
                  type="text"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
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
                    defaultValue=""
                    value={valveType}
                    onChange={(e) => setValveType(e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>
                      Select Valve Type
                    </option>
                    {meta?.valveTypes?.map((valve) => (
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
                    defaultValue=""
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>
                      Select Material
                    </option>
                    {meta?.materials?.map((mat) => (
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
          disabled={createMutation.isLoading}
          className={`rounded-lg px-6 py-2 text-sm font-medium text-white transition ${createMutation.isLoading ? "bg-emerald-300 pointer-events-none" : "bg-[#008951] hover:bg-[#007545]"}`}
        >
        
          {createMutation.isPending ? "Saving..." : "Save Cylinder Type"}
        </button>
      </div>
    </main>
  );
}

export default AddCylinderType;
