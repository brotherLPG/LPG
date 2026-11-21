import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  Landmark,
  MapPin,
  Package,
  UserRound,
  Wallet,
  Hash,
  Tag,
  Factory,
  Barcode,
  CheckCircle2,
  CreditCard,
  TrendingDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssetById } from "../../queries/assets/assets.queries";
import { usePermissions } from "../../contexts/PermissionContext";

const META_KEYS = new Set([
  "$__",
  "$isNew",
  "$locals",
  "$op",
  "errors",
  "isNew",
  "_doc",
  "form",
  "message",
  "success",
]);

const flattenAsset = (raw) => {
  if (!raw || typeof raw !== "object") return {};
  const doc = raw._doc && typeof raw._doc === "object" ? raw._doc : {};
  const next = { ...doc };
  Object.entries(raw).forEach(([key, value]) => {
    if (META_KEYS.has(key) || value === undefined) return;
    next[key] = value;
  });
  return next;
};

const textValue = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "object") {
    return (
      value.label ||
      value.fullName ||
      value.accountName ||
      value.assetName ||
      ""
    );
  }
  return String(value);
};

const formatLabel = (str) => {
  const value = textValue(str);
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatRs = (amount) => ` ${Number(amount || 0).toLocaleString()}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyles = {
  "in-use": "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  idle: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "under-maintenance": "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  disposed: "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
};

function Field({ label, value, icon: Icon }) {
  return (
    <div>
      <div className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-gray-800 bg-linear-to-br from-slate-50 to-white dark:from-gray-800/60 dark:to-gray-900/40 px-4 py-3 transition hover:border-blue-200 dark:hover:border-blue-800">
        {Icon && (
          <div className="mt-0.5 shrink-0 rounded-lg bg-blue-100/80 dark:bg-blue-900/50 p-1.5">
            <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
        {label}
          </p>
          <p className="mt-0.5 wrap-break-word text-sm font-semibold text-slate-800 dark:text-gray-200">{textValue(value) || "-"}</p>
        </div>
      </div>
      <div
        
        
        
        className="hidden"
      />
    </div>
  );
}

function SummaryCard({ label, value, hint, icon: Icon, iconClass, iconWrapClass, cardClass, valueClass }) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${cardClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">{label}</p>
          <p className={`mt-1 text-2xl font-extrabold ${valueClass}`}>{value}</p>
          {hint ? <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">{hint}</p> : null}
        </div>
        <div className={`rounded-lg p-2 ${iconWrapClass}`}>
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
      </div>
    </div>
  );
}

function ViewAsset() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();
  const { data, isLoading, error } = useAssetById(id);
  const asset = flattenAsset(data?.data);

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-[#F8FAFC] dark:bg-gray-950 p-8 text-sm text-slate-500 dark:text-gray-400">
        Loading asset details...
      </main>
    );
  }

  if (error || (!asset._id && !asset.assetCode && !asset.assetName)) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-[#F8FAFC] dark:bg-gray-950 p-8 text-sm text-red-500 dark:text-red-400">
        <p>Unable to load asset details.</p>
        <button
          type="button"
          onClick={() => navigate("/assets")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 font-semibold text-slate-600 dark:text-gray-400 shadow-sm hover:bg-slate-50 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Assets
        </button>
      </main>
    );
  }

  const purchaseCost = Number(asset.purchaseCostAmount || 0);
  const bookValue = Number(asset.currentBookValueAmount || 0);
  const depreciation = Math.max(purchaseCost - bookValue, 0);
  const remainingPct = purchaseCost > 0 ? Math.min(100, Math.max(0, (bookValue / purchaseCost) * 100)) : 0;

  const employee =
    asset.assignedEmployeeId && typeof asset.assignedEmployeeId === "object"
      ? asset.assignedEmployeeId
      : null;

  const account =
    asset.accountId && typeof asset.accountId === "object" ? asset.accountId : null;

  const accountValue = account
    ? account.label ||
      [account.accountCode, account.accountName].filter(Boolean).join(" – ") ||
      ""
    : textValue(asset.accountName);

  const paymentMethodValue = textValue(asset.paymentMethodLabel) || formatLabel(asset.paymentMethod);
  const statusKey = asset.assetStatus || "in-use";

  return (
    <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Dashboard
            </button>
            <span className="px-1 text-slate-400 dark:text-gray-500">/</span>
            <button
              type="button"
              onClick={() => navigate("/assets")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Fixed Assets
            </button>
            <span className="px-1 text-slate-400 dark:text-gray-500">/</span>
            <span className="font-semibold">Asset Details</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              {asset.assetName || "Untitled Asset"}
            </h1>
            <span className="rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-gray-400">
              {asset.assetCode || "-"}
            </span>
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                statusStyles[statusKey] || "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700"
              }`}
            >
              {formatLabel(statusKey)}
            </span>
          </div>
          <p className="mt-1 text-sm text-tertiary">
            Specifications, valuation, payment, and current assignment
          </p>
        </div>
        <div className="flex gap-2">
        
          {can("assets", "update") && (
            <button
              type="button"
              onClick={() => navigate(`/assets/edit/${asset._id}`)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545]"
            >
              <Edit3 className="h-4 w-4" /> Edit Asset
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          label="Purchase Cost"
          value={formatRs(purchaseCost)}
          hint={formatDate(asset.purchaseDate)}
          icon={Wallet}
          cardClass="border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40" iconWrapClass="bg-blue-200/70 dark:bg-blue-800/60" valueClass="text-blue-700 dark:text-blue-300"
          iconClass="text-blue-600 dark:text-blue-400"
        />
        <SummaryCard
          label="Current Book Value"
          value={formatRs(bookValue)}
          hint={`${remainingPct.toFixed(0)}% of purchase cost remaining`}
          icon={Landmark}
          cardClass="border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40" iconWrapClass="bg-emerald-200/70 dark:bg-emerald-800/60" valueClass="text-emerald-700 dark:text-emerald-300"
          iconClass="text-emerald-600 dark:text-emerald-400"
        />
        <SummaryCard
          label="Accumulated Depreciation"
          value={formatRs(depreciation)}
          hint={formatLabel(asset.depreciationMethod)}
          icon={Package}
          cardClass="border-slate-200 dark:border-gray-700 bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900" iconWrapClass="bg-slate-200/70 dark:bg-gray-700" valueClass="text-slate-900 dark:text-gray-100"
          iconClass="text-slate-600 dark:text-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2"><Package className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h2 className="text-[16px] font-bold text-BLUE-dark">Asset Information</h2></div>
            </div>
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <Field label="Asset Code" value={asset.assetCode} icon={Hash} />
              <Field label="Asset Name" value={asset.assetName} icon={Package} />
              <Field label="Category" value={formatLabel(asset.assetCategory)} icon={Tag} />
              <Field label="Location" value={asset.locationName} icon={MapPin} />
              <Field label="Manufacturer" value={asset.manufacturerName} icon={Factory} />
              <Field label="Model Number" value={asset.modelNumber} icon={Barcode} />
              <Field label="Serial Number" value={asset.serialNumber} icon={Hash} />
              <Field label="Status" value={formatLabel(asset.assetStatus)} icon={CheckCircle2} />
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><h2 className="text-[16px] font-bold text-BLUE-dark">Purchase & Payment</h2></div>
            </div>
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <Field label="Purchase Date" value={formatDate(asset.purchaseDate)} icon={CalendarDays} />
              <Field label="Payment Method" value={paymentMethodValue} icon={CreditCard} />
              <Field label="Account" value={accountValue} icon={Landmark} />
              <Field label="Depreciation Method" value={formatLabel(asset.depreciationMethod)} icon={TrendingDown} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" /><h2 className="text-[16px] font-bold text-BLUE-dark">Valuation</h2></div>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-gray-400">Purchase Cost</span>
                <span className="font-medium text-slate-900 dark:text-gray-100">{formatRs(purchaseCost)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-gray-400">Depreciation</span>
                <span className="font-medium text-slate-900 dark:text-gray-100">{formatRs(depreciation)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-BLUE-dark">Book Value</span>
                <span className="text-lg font-extrabold text-accent-blue">{formatRs(bookValue)}</span>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                  <span>Remaining value</span>
                  <span>{remainingPct.toFixed(0)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-[#008951]"
                    style={{ width: `${remainingPct}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h2 className="text-[16px] font-bold text-BLUE-dark">Assignment</h2></div>
            </div>
            <div className="p-5">
              {employee ? (
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-slate-100 dark:bg-gray-800 p-2">
                    <UserRound className="h-5 w-5 text-slate-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                      {employee.fullName || "-"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                      {employee.employeeCode || "EMP"}
                      {employee.jobTitle ? ` · ${employee.jobTitle}` : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-gray-400">Not assigned to an employee</p>
              )}
              <div className="mt-4 flex items-center gap-2 rounded-md border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 px-3 py-2 text-sm text-slate-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                {asset.locationName || "No location"}
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 px-3 py-2 text-sm text-slate-700 dark:text-gray-300">
                <CalendarDays className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                Purchased {formatDate(asset.purchaseDate)}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ViewAsset;
