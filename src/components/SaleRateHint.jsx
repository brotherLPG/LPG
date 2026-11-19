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
    <div className="flex w-full max-w-[680px] flex-wrap items-center gap-x-2 gap-y-1">
      <span className="text-[11px] text-slate-500 dark:text-gray-400">
        Purchase rate Rs {formatRs(suggestion.averageCostPerKg)}/kg
      </span>
      <button
        type="button"
        onClick={() => onPick(suggestion.exact)}
        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
          exactOn
            ? "border-slate-700 bg-slate-800 text-white"
            : "border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-300 hover:border-[#008951] hover:text-[#008951] dark:hover:text-emerald-400"
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
            : "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900"
        }`}
      >
        Profitable Rs {formatRs(suggestion.profitable)}
      </button>
      {tip ? (
        <span
          className={`text-[11px] font-medium ${
            tip.level === "loss" ? "text-rose-600 dark:text-rose-400" : "text-amber-700 dark:text-amber-300"
          }`}
        >
          {tip.message}
        </span>
      ) : null}
    </div>
  );
}

export default SaleRateHint;
