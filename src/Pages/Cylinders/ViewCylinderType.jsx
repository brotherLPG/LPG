import { ArrowLeft, Edit, Package, DollarSign, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCylinderTypeById } from "../../queries/cylinderTypes/cylinderTypes.queries";

function ViewCylinderType() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: cylinderTypeData, isLoading, isError } = useCylinderTypeById(id);

  const cylinderData = cylinderTypeData?.data?._doc;

  if (isLoading) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-500">Loading cylinder type details...</div>
        </div>
      </main>
    );
  }

  if (isError || !cylinderData) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">Error loading cylinder type details</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
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
              <span className="font-semibold text-slate-600">View Cylinder Type</span>
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {cylinderData.typeName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{cylinderData.typeCode}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/cylinders/edit-type/${id}`)}
              className="rounded-lg bg-[#008951] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545] transition-colors"
            >
              <Edit className="h-4 w-4 inline mr-2" />
              Edit Cylinder Type
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <Package className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Capacity</p>
              <p className="text-xl font-bold text-slate-900">{cylinderData.capacityKg} KG</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Selling Price</p>
              <p className="text-xl font-bold text-slate-900">
                Rs. {cylinderData.sellingPricePerCylinder?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Purchase Price</p>
              <p className="text-xl font-bold text-slate-900">
                Rs. {cylinderData.purchasePriceAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${cylinderData.isActive ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {cylinderData.isActive ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Status</p>
              <p className="text-xl font-bold text-slate-900">
                {cylinderData.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Cylinder Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Type Code</label>
              <p className="text-sm font-semibold text-slate-900">{cylinderData.typeCode || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Type Name</label>
              <p className="text-sm font-semibold text-slate-900">{cylinderData.typeName || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Category</label>
              <p className="text-sm font-semibold text-slate-900 capitalize">{cylinderData.cylinderCategory || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Capacity (KG)</label>
              <p className="text-sm font-semibold text-slate-900">{cylinderData.capacityKg || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Tare Weight (KG)</label>
              <p className="text-sm font-semibold text-slate-900">{cylinderData.tareWeightKg || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Color Code</label>
              <p className="text-sm font-semibold text-slate-900 capitalize">{cylinderData.colorCode || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Valve Type</label>
              <p className="text-sm font-semibold text-slate-900 capitalize">{cylinderData.valveType || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Material</label>
              <p className="text-sm font-semibold text-slate-900 capitalize">{cylinderData.material || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Safety Certification</label>
              <p className="text-sm font-semibold text-slate-900">{cylinderData.safetyCertificationNumber || "—"}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
              <p className="text-sm font-semibold text-slate-900">{cylinderData.description || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Pricing Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Selling Price</label>
              <p className="text-sm font-semibold text-slate-900">
                Rs. {cylinderData.sellingPricePerCylinder?.toLocaleString() || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Purchase Price</label>
              <p className="text-sm font-semibold text-slate-900">
                Rs. {cylinderData.purchasePriceAmount?.toLocaleString() || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Refill Price</label>
              <p className="text-sm font-semibold text-slate-900">
                Rs. {cylinderData.refillPriceAmount?.toLocaleString() || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Security Deposit</label>
              <p className="text-sm font-semibold text-slate-900">
                Rs. {cylinderData.securityDepositAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Timestamps</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-500">Created At</p>
                <p className="text-sm font-semibold text-slate-900">
                  {cylinderData.createdAt ? new Date(cylinderData.createdAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-500">Last Updated</p>
                <p className="text-sm font-semibold text-slate-900">
                  {cylinderData.updatedAt ? new Date(cylinderData.updatedAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewCylinderType;
