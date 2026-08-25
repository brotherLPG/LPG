import React from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "@heroui/react";
import { AlertTriangle, Edit, History } from "lucide-react";
import StorageTanksimage from "../../assets/Images/StorageTanks.jpg"

function StorageTanks() {
  const navigate = useNavigate();

  const tankParameters = {
    tankCode: "TNK-001",
    installationDate: "15 Mar 2022",
    maxSafeCapacity: "48,000 KG",
    location: "Zone-A, Main Yard",
    minSafeQuantity: "5,000 KG",
    totalRatedVolume: "50,000 KG",
  };

  const currentStock = {
    amount: "12,500 KG",
    percentage: 25,
    warning: "Tank approaching minimum safe threshold level of 5,000 KG.",
  };

  const recentReceipts = [
    { receipt: "REC-2026-001", supplier: "Pakistan Petroleum Ltd.", quantity: "15,000 KG", amount: "4,275,000" },
    { receipt: "REC-2026-002", supplier: "Sui Southern Gas Co.", quantity: "12,000 KG", amount: "3,420,000" },
    { receipt: "REC-2026-003", supplier: "Pak Petroleum Ltd.", quantity: "18,000 KG", amount: "5,130,000" },
    { receipt: "REC-2026-004", supplier: "OGDCL", quantity: "10,000 KG", amount: "2,850,000" },
    { receipt: "REC-2026-005", supplier: "Pakistan Petroleum Ltd.", quantity: "14,500 KG", amount: "4,132,500" },
  ];

  const fillingBatches = [
    { batch: "FD-2026-0122", description: "11.8 KG Domestic", units: "100 units", quantity: "2,124 KG" },
    { batch: "FD-2026-0121", description: "45.4 KG Commercial", units: "50 units", quantity: "2,890 KG" },
    { batch: "FD-2026-0120", description: "11.8 KG Domestic", units: "150 units", quantity: "3,186 KG" },
    { batch: "FD-2026-0119", description: "15 KG Domestic", units: "80 units", quantity: "1,840 KG" },
    { batch: "FD-2026-0118", description: "11.8 KG Domestic", units: "120 units", quantity: "2,548 KG" },
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

          <span>Tank-A (Main Bulk)</span>
        </div>

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="pb-2 my-1">
          <h1 className=" text-2xl font-bold tracking-tight text-BLUE-dark">
            Tank-A (Main Bulk Storage)
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
                Tank-A (Main Bulk Storage)
              </h5>
              <p className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300">
                Operational
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

            <div className="flex gap-2 mt-4">
              <button className="flex items-center gap-1 text-[13px] font-semibold text-tertiary px-3 py-2 border border-accent-blue rounded hover:bg-blue-50 transition">
                <Edit className="w-4 h-4" />
                Edit Tank Specs
              </button>
              <button className="flex items-center gap-1 text-[13px] font-semibold text-tertiary px-3 py-2 border border-accent-blue rounded hover:bg-blue-50 transition">
                <History className="w-4 h-4" />
                View Maintenance History
              </button>
            </div>
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
                <span className="text-[12px] text-tertiary">50,000 KG</span>
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

            <Table className="px-3 pb-3 pt-2 bg-white">
              <Table.ScrollContainer>
                <Table.Content aria-label="Recent receipts">
                  <Table.Header className="bg-white">
                    <Table.Column
                      isRowHeader
                      className="px-0 py-1.5 text-left font-bold text-tertiary"
                    >
                      Receipt ID
                    </Table.Column>
                    <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                      Supplier
                    </Table.Column>
                    <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                      Quantity
                    </Table.Column>
                    <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                      Amount (Rs.)
                    </Table.Column>
                  </Table.Header>
                  <Table.Body items={recentReceipts}>
                    {(receipt) => (
                      <Table.Row
                        key={receipt.receipt}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      >
                        <Table.Cell className="px-0 py-2">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-6th-color">
                              {receipt.receipt}
                            </span>
                            <span className="text-4th-color  text-[10px] font-regular">
                              10 May 2026
                            </span>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="px-2 py-2 text-[12px] text-tertiary">
                          {receipt.supplier}
                        </Table.Cell>
                        <Table.Cell className="px-2 py-2 text-[12px] font-bold text-BLUE-dark">
                          {receipt.quantity}
                        </Table.Cell>
                        <Table.Cell className="px-2 py-2 text-[12px] font-bold text-5th-color">
                          {receipt.amount}
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </section>

          {/* Recent Cylinder Filling Batches */}
          <section className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white">
            <header className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
              <h3 className="border-b border-slate-100 py-2 text-[16px] font-bold text-BLUE-dark">
                Recent Cylinder Filling Batches
              </h3>
            </header>

            <Table className="px-3 pb-3 pt-2 bg-white">
              <Table.ScrollContainer>
                <Table.Content aria-label="Recent filling batches">
                  <Table.Header className="bg-white">
                    <Table.Column
                      isRowHeader
                      className="px-0 py-1.5 text-left font-bold text-tertiary"
                    >
                      Batch ID
                    </Table.Column>
                    <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                      Description
                    </Table.Column>
                    <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                      Units
                    </Table.Column>
                    <Table.Column className="px-2 py-1.5 text-left font-bold text-tertiary">
                      Quantity
                    </Table.Column>
                  </Table.Header>
                  <Table.Body items={fillingBatches}>
                    {(batch) => (
                      <Table.Row
                        key={batch.batch}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      >
                        <Table.Cell className="px-0 py-2">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-6th-color">
                              {batch.batch}
                            </span>
                            <span className="text-4th-color  text-[10px] font-regular">
                              10 May 2026
                            </span>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="px-2 py-2 text-[12px] text-tertiary">
                          {batch.description}
                        </Table.Cell>
                        <Table.Cell className="px-2 py-2 text-[12px] font-bold text-BLUE-dark">
                          {batch.units}
                        </Table.Cell>
                        <Table.Cell className="px-2 py-1.5 text-left font-bold text-error">
                          {batch.quantity}
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </section>
        </div>
      </div>
    </div>
  );
}

export default StorageTanks;
