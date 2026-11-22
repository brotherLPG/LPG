import {  Edit, Package, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCylinderTypeById } from "../../queries/cylinderTypes/cylinderTypes.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function ViewCylinderType() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();

  const { data: cylinderTypeData, isLoading, isError } = useCylinderTypeById(id);

  const cylinderData = cylinderTypeData?.data?._doc;

  if (isLoading) {
    return (
      <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-500 dark:text-gray-400">Loading cylinder type details...</div>
        </div>
      </main>
    );
  }

  if (isError || !cylinderData) {
    return (
      <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500 dark:text-red-400">Error loading cylinder type details</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs mb-2">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400 dark:text-gray-500">/</span>{" "}
              <span
                onClick={() => navigate("/cylinder-types")}
                className="cursor-pointer font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors duration-200"
              >
                Cylinder Types
              </span>{" "}
              <span className="px-1 text-slate-400 dark:text-gray-500">/</span>{" "}
              <span className="font-semibold text-slate-600 dark:text-gray-400">View Cylinder Type</span>
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
              {cylinderData.typeName}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{cylinderData.typeCode}</p>
          </div>
          <div className="flex gap-2">
            {can("cylinder-types", "update") && (
            <button
              onClick={() => navigate(`/cylinders/edit-type/${id}`)}
              className="rounded-lg bg-[#008951] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545] transition-colors"
            >
              <Edit className="h-4 w-4 inline mr-2" />
              Edit Cylinder Type
            </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 dark:bg-gray-800 p-2">
              <Package className="h-5 w-5 text-slate-700 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Capacity</p>
              <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{cylinderData.capacityKg} KG</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900 p-2">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Selling Price</p>
              <p className="text-xl font-bold text-slate-900 dark:text-gray-100">
                 {cylinderData.sellingPricePerCylinder?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Purchase Price</p>
              <p className="text-xl font-bold text-slate-900 dark:text-gray-100">
                 {cylinderData.purchasePriceAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${cylinderData.isActive ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-red-100 dark:bg-red-900'}`}>
              {cylinderData.isActive ? (
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Status</p>
              <p className="text-xl font-bold text-slate-900 dark:text-gray-100">
                {cylinderData.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">Cylinder Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Type Code</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">{cylinderData.typeCode || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Type Name</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">{cylinderData.typeName || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Category</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100 capitalize">{cylinderData.cylinderCategory || "—"}</p>
            </div>

         

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Tare Weight (KG)</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">{cylinderData.tareWeightKg || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Color Code</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100 capitalize">{cylinderData.colorCode || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Valve Type</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100 capitalize">{cylinderData.valveType || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Material</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100 capitalize">{cylinderData.material || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Safety Certification</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">{cylinderData.safetyCertificationNumber || "—"}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Description</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">{cylinderData.description || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">Pricing Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Selling Price</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                 {cylinderData.sellingPricePerCylinder?.toLocaleString() || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Purchase Price</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                {cylinderData.purchasePriceAmount?.toLocaleString() || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Refill Price</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                 {cylinderData.refillPriceAmount?.toLocaleString() || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Security Deposit</label>
              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                {cylinderData.securityDepositAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewCylinderType;
