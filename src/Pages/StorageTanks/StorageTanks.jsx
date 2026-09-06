import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Edit, History } from "lucide-react";
import StorageTanksimage from "../../assets/Images/StorageTanks.jpg"
import GlobalTable from "../../utils/GlobalTable"
import { useStorageTankDashboard } from "../../queries/storageTanks/storageTanks.queries"

function StorageTanks() {
  const navigate = useNavigate();
  const { data: tankData, isLoading, error } = useStorageTankDashboard();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <p className="text-tertiary">Loading tank data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <p className="text-error">Error loading tank data: {error.message}</p>
      </div>
    );
  }

  const tankParameters = {
    tankCode: tankData?.data?.tankCode || "N/A",
    installationDate: tankData?.data?.installationDate ? formatDate(tankData.data.installationDate) : "N/A",
    maxSafeCapacity: `${formatNumber(tankData?.data?.maximumSafeQuantityKg)} KG`,
    location: tankData?.data?.locationDescription || "N/A",
    minSafeQuantity: `${formatNumber(tankData?.data?.minimumSafeQuantityKg)} KG`,
    totalRatedVolume: `${formatNumber(tankData?.data?.capacityKg)} KG`,
  };

  const currentStock = {
    amount: `${formatNumber(tankData?.data?.currentQuantityKg)} KG`,
    percentage: tankData?.data?.fillPercent || 0,
    warning: tankData?.data?.stockAlert || "Stock status normal",
  };

  const recentReceipts = tankData?.data?.recentReceipts?.map(receipt => ({
    receipt: receipt.receiptNumber,
    supplier: receipt.supplierName,
    quantity: `${formatNumber(receipt.receivedQuantityKg)} KG`,
    date: receipt.receivedAt
  })) || [];

  const fillingBatches = tankData?.data?.recentFillingBatches?.map(batch => ({
    batch: batch.batchNumber,
    description: batch.typeName,
    typeName: batch.typeName,
    units: `${batch.cylinderCount} units`,
    quantity: batch.cylinderDescription,
    date: batch.fillingDate
  })) || [];

  // Column definitions for receipts table
  const receiptColumns = [
    {
      key: "receipt",
      label: "Receipt ID",
      isRowHeader: true,
      className: "px-0 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-0 py-2",
      renderCell: (item) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-6th-color">{item.receipt}</span>
          <span className="text-4th-color text-[10px] font-regular">{formatDate(item.date)}</span>
        </div>
      ),
    },
    {
      key: "supplier",
      label: "Supplier",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-2 py-2 text-[12px] text-tertiary",
    },
    {
      key: "quantity",
      label: "Quantity",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-2 py-2 text-[12px] font-bold text-BLUE-dark",
    },
  ];

  // Column definitions for filling batches table
  const batchColumns = [
    {
      key: "batch",
      label: "Batch ID",
      isRowHeader: true,
      className: "px-0 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-0 py-2",
      renderCell: (item) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-6th-color">{item.batch}</span>
          <span className="text-4th-color text-[10px] font-regular">{formatDate(item.date)}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-2 py-2 text-[12px] text-tertiary",
    },
    {
      key: "typeName",
      label: "Type Name",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-2 py-2 text-[12px] text-tertiary",
    },
    {
      key: "units",
      label: "Units",
      className: "px-2 py-1.5 text-left font-bold text-tertiary",
      cellClassName: "px-2 py-2 text-[12px] font-bold text-BLUE-dark",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-3">
        {/* =========================================
            BREADCRUMB
        ========================================= */}
        <div className="text-xs">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Dashboard
          </span>

          <span className="mx-1">/</span>

          <span
            onClick={() => navigate("/storage-tanks")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200 px-1"
          >
            Storage Tanks
          </span>

          <span className="mx-1">/</span>

          <span>{tankData?.data?.tankName || 'Tank'}</span>
        </div>

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="pb-2 my-1">
          <h1 className=" text-2xl font-bold tracking-tight text-BLUE-dark">
            {tankData?.data?.tankName || 'Tank'}
          </h1>

          <p className="text-sm text-tertiary">
            Real-time storage telemetry, capacity status, and operational logs
          </p>
        </div>

        {/* =========================================
            IMAGE BANNER
        ========================================= */}
        <div className="relative bg-white border border-slate-200 rounded-md mb-2 overflow-hidden">
          <img
            src={StorageTanksimage}
            alt="Storage Tank"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0  from-black/60 to-transparent p-4">
            <div className="flex justify-between">
              <h5 className="text-white text-lg font-bold">
                {tankData?.data?.tankName || 'Tank'}
              </h5>
              <p className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                tankData?.data?.tankStatus === 'operational'
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-red-100 text-red-700 border-red-300'
              }`}>
                {tankData?.data?.tankStatusLabel || 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            TANK PARAMETERS + CAPACITY GAUGE
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
          {/* Tank Parameters */}
          <div className="bg-white border border-slate-200 rounded-md px-4 py-3">
            <h3 className="border-b border-slate-100 py-2 text-[16px] font-bold text-BLUE-dark">
              Tank Parameters
            </h3>

            <div className="grid grid-cols-2 gap-4 py-3">
              <div className="space-y-3">
                <div>
                  <p className="text-[12px] text-tertiary font-semibold text-4th-color">
                    TANK CODE
                  </p>
                  <p className="text-[15px] font-bold text-BLUE-dark">
                    {tankParameters.tankCode}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-tertiary font-semibold text-4th-color">
                    INSTALLATION DATE
                  </p>
                  <p className="text-[15px] font-bold text-BLUE-dark">
                    {tankParameters.installationDate}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-tertiary font-semibold text-4th-color">
                    MAX SAFE CAPACITY
                  </p>
                  <p className="text-[15px] font-bold text-5th-color">
                    {tankParameters.maxSafeCapacity}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[12px] text-tertiary font-semibold text-4th-color">
                    LOCATION
                  </p>
                  <p className="text-[15px] font-bold text-BLUE-dark">
                    {tankParameters.location}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-tertiary font-semibold text-4th-color">
                    MIN SAFE QUANTITY
                  </p>
                  <p className="text-[15px] font-bold text-error">
                    {tankParameters.minSafeQuantity}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-tertiary font-semibold text-4th-color">
                    TOTAL RATED VOLUME
                  </p>
                  <p className="text-[15px] font-bold text-BLUE-dark">
                    {tankParameters.totalRatedVolume}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="flex gap-2 mt-4">
              <button className="flex items-center gap-1 text-[13px] font-semibold text-tertiary px-3 py-2 border border-accent-blue rounded hover:bg-blue-50 transition">
                <Edit className="w-4 h-4" />
                Edit Tank Specs
              </button>
              <button className="flex items-center gap-1 text-[13px] font-semibold text-tertiary px-3 py-2 border border-accent-blue rounded hover:bg-blue-50 transition">
                <History className="w-4 h-4" />
                View Maintenance History
              </button>
            </div> */}
          </div>

          {/* Capacity Level Gauge */}
          <div className="bg-white border border-slate-200 rounded-md px-4 py-3">
            <h3 className="border-b border-slate-100 py-2 text-[16px] font-bold text-BLUE-dark">
              Capacity Level Gauge
            </h3>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[12px] text-tertiary font-semibold">
                  Current Bulk Stock
                </span>
                <span className="text-[12px] font-bold text-slate-700">
                  {currentStock.amount}
                </span>
              </div>

              <div className="w-full h-6 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${currentStock.percentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-[12px] text-tertiary">0 KG</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-semibold rounded-full border border-orange-300">
                  {currentStock.percentage}% Filled
                </span>
                <span className="text-[12px] text-tertiary">{formatNumber(tankData?.data?.capacityKg)} KG</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 font-medium">
                {currentStock.warning}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            RECEIPTS + FILLING BATCHES TABLES
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
          {/* Recent Bulk LPG Receipts */}
          <section className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white">
            <header className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
              <h3 className="border-b border-slate-100 py-2 text-[16px] font-bold text-BLUE-dark">
                Recent Bulk LPG Receipts
              </h3>
            </header>

            <GlobalTable
              columns={receiptColumns}
              data={recentReceipts}
              ariaLabel="Recent receipts"
            />
          </section>

          {/* Recent Cylinder Filling Batches */}
          <section className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white">
            <header className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
              <h3 className="border-b border-slate-100 py-2 text-[16px] font-bold text-BLUE-dark">
                Recent Cylinder Filling Batches
              </h3>
            </header>

            <GlobalTable
              columns={batchColumns}
              data={fillingBatches}
              ariaLabel="Recent filling batches"
              // pagination={true}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default StorageTanks;
