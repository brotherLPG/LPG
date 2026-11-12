function formatRs(value) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function priceMatches(current, target) {
  return Math.abs((Number(current) || 0) - (Number(target) || 0)) < 0.02;
}

function SaleRateHint({ suggestion, tip, unitPrice, onPick }) {
  if (!suggestion) return null;

  const exactOn = priceMatches(unitPrice, suggestion.exact);
  const profitableOn = priceMatches(unitPrice, suggestion.profitable);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] text-slate-500">
        Purchase rate Rs {formatRs(suggestion.averageCostPerKg)}/kg
      </span>
      <button
        type="button"
        onClick={() => onPick(suggestion.exact)}
        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
          exactOn
            ? "border-slate-700 bg-slate-800 text-white"
            : "border-slate-300 bg-white text-slate-700 hover:border-[#008951] hover:text-[#008951]"
        }`}
      >
        Exact Rs {formatRs(suggestion.exact)}
      </button>
      <button
        type="button"
        onClick={() => onPick(suggestion.profitable)}
        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
          profitableOn
            ? "border-emerald-700 bg-emerald-700 text-white"
            : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
        }`}
      >
        Profitable Rs {formatRs(suggestion.profitable)}
      </button>
      {tip ? (
        <span
          className={`text-[11px] font-medium ${
            tip.level === "loss" ? "text-rose-600" : "text-amber-700"
          }`}
        >
          {tip.message}
        </span>
      ) : null}
    </div>
  );
}

export default SaleRateHint;
