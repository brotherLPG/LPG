import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

function FillingBatches() {
  const navigate = useNavigate();

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
            Filling Batches
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage automated LPG gas cylinder refilling process batch runs. (This page is currently a placeholder).
          </p>
        </div>
        <button
          onClick={() => navigate("/filling-batches/create")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
        >
          <Plus className="h-4 w-4" strokeWidth={3} /> Create Batch
        </button>
      </div>
    </main>
  );
}

export default FillingBatches;
