import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, CheckCircle2 } from "lucide-react";

function CreateBatch() {
  const navigate = useNavigate();

  const [runCount, setRunCount] = useState("250");
  const [fillWeight, setFillWeight] = useState("11.0");

  const currentTankLevel = 37500;
  
  // Computations
  const parsedRunCount = parseFloat(runCount) || 0;
  const parsedFillWeight = parseFloat(fillWeight) || 0;
  const expectedConsumption = parsedRunCount * parsedFillWeight;
  const levelAfterFilling = currentTankLevel - expectedConsumption;
  const remainingCapacity = 50000 - levelAfterFilling; // Based on 50,000 max capacity

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
            onClick={() => navigate("/filling-batches")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Filling Batches
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Create Batch</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Filling Batch
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Initialize a new automated LPG gas cylinder refilling process batch run
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Form Cards (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Batch Identification & Tank Sourcing */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="bg-slate-100 font-bold text-slate-800 text-sm px-3 py-1.5 rounded-md inline-block mb-4">
              Batch Identification & Tank Sourcing
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Batch Number (Auto)
                </label>
                <input
                  type="text"
                  disabled
                  value="FB-2026-0234"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Filling Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="18 May 2026"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="18 May 2026">18 May 2026</option>
                    <option value="19 May 2026">19 May 2026</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Source Storage Tank <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="TNK-001 — Main Bulk (37,500 / 50,000 KG)"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="TNK-001 — Main Bulk (37,500 / 50,000 KG)">TNK-001 — Main Bulk (37,500 / 50,000 KG)</option>
                    <option value="TNK-002 — Secondary Bulk (10,000 / 50,000 KG)">TNK-002 — Secondary Bulk (10,000 / 50,000 KG)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Cylinder Configuration */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="bg-slate-100 font-bold text-slate-800 text-sm px-3 py-1.5 rounded-md inline-block mb-4">
              Cylinder Configuration
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Target Cylinder Type <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="11 KG Domestic Cylinder"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="11 KG Domestic Cylinder">11 KG Domestic Cylinder</option>
                    <option value="22 KG Commercial Cylinder">22 KG Commercial Cylinder</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cylinder Target Run Count <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={runCount}
                  onChange={(e) => setRunCount(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Target Fill Weight per Cylinder <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fillWeight}
                  onChange={(e) => setFillWeight(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Assigned Batch Operator (Employee) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="Tariq Mahmood (Senior Operator)"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Tariq Mahmood (Senior Operator)">Tariq Mahmood (Senior Operator)</option>
                    <option value="Ali Raza (Operator)">Ali Raza (Operator)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Created By (Auto-filled)
                </label>
                <input
                  type="text"
                  disabled
                  value="Muhammad Ahmad (Plant Admin)"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Batch Execution Notes / Safety Checks
                </label>
                <textarea
                  rows="2"
                  defaultValue="Ensure manifold pressure does not exceed 15 bar. Recalibrate digital filling scales before initiation."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Calculations & Action Panel (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 3: Filling Batch Calculations */}
          <div className="rounded-xl border border-emerald-400 bg-white shadow-sm p-6">
            <h2 className="text-base font-bold text-emerald-600 mb-5">
              Filling Batch Calculations
            </h2>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Expected LPG Consumption</span>
                <span className="font-bold text-slate-900">{expectedConsumption.toLocaleString()} KG</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Current Sourced Tank Level</span>
                <span className="font-bold text-slate-900">{currentTankLevel.toLocaleString()} KG</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Tank Level After Filling</span>
                <span className="font-bold text-slate-900">{levelAfterFilling.toLocaleString()} KG</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Remaining Tank Capacity</span>
                <span className="font-bold text-slate-900">{remainingCapacity.toLocaleString()} KG</span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-xs leading-relaxed text-slate-700">
                Calculations validated. Tank level is well above the safety minimum threshold limits.
              </p>
            </div>
          </div>

          {/* Card 4: Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <button
              onClick={() => navigate("/filling-batches")}
              className="w-full rounded-lg bg-[#059669] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              Create Filling Batch
            </button>
            <button
              onClick={() => navigate("/filling-batches")}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default CreateBatch;
