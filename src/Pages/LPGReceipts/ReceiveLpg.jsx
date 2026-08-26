import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronDown } from "lucide-react";

function ReceiveLpg() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("25000");
  const [rate, setRate] = useState("285");
  
  const totalCost = (parseFloat(quantity || 0) * parseFloat(rate || 0)).toLocaleString();
  const formattedQuantity = parseFloat(quantity || 0).toLocaleString();

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
            onClick={() => navigate("/lpg-receipts")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            LPG Receipts
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Receive LPG</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Receive LPG Shipment
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Record newly arrived bulk LPG tanker deliveries and update inventory ledgers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Shipment & Logistics Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Shipment & Logistics Information
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Receipt Number (Auto)
                </label>
                <input
                  type="text"
                  disabled
                  value="REC-2026-0089"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier Dropdown <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="Pakistan Petroleum Ltd."
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="Pakistan Petroleum Ltd.">Pakistan Petroleum Ltd.</option>
                    <option value="Sui Northern Gas Pipelines">Sui Northern Gas Pipelines</option>
                    <option value="Attock Refinery Ltd.">Attock Refinery Ltd.</option>
                    <option value="Byco Petroleum Pakistan">Byco Petroleum Pakistan</option>
                    <option value="Parco LPG Division">Parco LPG Division</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Truck Registration Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="LEA-4521"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier Invoice Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="PP-INV-88421"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Receiving Details & Storage Tank Routing */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Receiving Details & Storage Tank Routing
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Route to Storage Tank <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="TNK-001 — Main Bulk (12,500 / 50,000 KG)"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="TNK-001 — Main Bulk (12,500 / 50,000 KG)">TNK-001 — Main Bulk (12,500 / 50,000 KG)</option>
                    <option value="TNK-002 — Secondary Bulk (0 / 50,000 KG)">TNK-002 — Secondary Bulk (0 / 50,000 KG)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Received Quantity (KG) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Purchase Rate per KG (Rs.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Received By (Employee) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      defaultValue="Asif Afridi (Plant Supervisor)"
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="Asif Afridi (Plant Supervisor)">Asif Afridi (Plant Supervisor)</option>
                      <option value="Ahmad Hassan (Operations)">Ahmad Hassan (Operations)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Received At (Date & Time)
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue="18 May 2026 - 11:30 AM"
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Remarks / Quality Inspection Notes
                </label>
                <textarea
                  rows="2"
                  defaultValue="Tanker inspected for seals and pressure values. Found normal. Decanting approved."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 3: LPG Transaction Summary Card */}
          <div className="rounded-2xl border-2 border-[#1a56db]/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#1a56db] mb-4">
              LPG Transaction Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Received Quantity</span>
                <span className="font-bold text-slate-900">{formattedQuantity} KG</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Decanting Rate / KG</span>
                <span className="font-bold text-slate-900">Rs. {parseFloat(rate || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Total Purchase Cost</span>
              <span className="text-2xl font-extrabold text-[#1a56db]">Rs. {totalCost}</span>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-xs font-medium leading-relaxed text-emerald-900">
                Routing will instantly update TNK-001 bulk storage from 12,500 KG to {Number(12500) + Number(quantity || 0)} KG (75% Full).
              </p>
            </div>
          </div>

          {/* Card 4: Actions Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <button
              onClick={() => navigate("/lpg-receipts")}
              className="w-full rounded-xl bg-[#00a862] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#008951]"
            >
              Confirm & Receive LPG
            </button>
            <button
              onClick={() => navigate("/lpg-receipts")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              Save as Draft
            </button>
            <div className="pt-1 text-center">
              <span
                onClick={() => navigate("/lpg-receipts")}
                className="cursor-pointer text-sm font-medium text-rose-500 hover:text-rose-700"
              >
                Cancel
              </span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default ReceiveLpg;
