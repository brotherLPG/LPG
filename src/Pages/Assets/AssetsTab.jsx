import { CirclePlus } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Assets from './Assets';
import MaintenanceAssets from '../MaintenanceAssets/MaintenanceAssets';
import MaintenanceRecords from '../MaintenanceAssets/MaintenanceRecords';
import { usePermissions } from '../../contexts/PermissionContext';


const tabs = [
  {
    key: "assets",
    label: "Assets",
  },

  // {
  //   key: "maintenance-assets",
  //   label: "Maintenance Assets",
  // },
  {
    key: "maintenance-records",
    label: "Maintenance Records",
  },
];

function AssetsTab() {

  // const [activeTab, setActiveTab] = useState("assets");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "assets";

  const navigate = useNavigate();
  const { can } = usePermissions();
  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <section>
        {activeTab === "assets" ? (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs">
                  <span
                    onClick={() => navigate("/dashboard")}
                    className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
                  >
                    Dashboard
                  </span>{" "}
                  <span className="px-1 text-slate-400">/</span>{" "}
                  <span className="font-semibold ">Fixed Assets</span>
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
                  Fixed Assets
                </h1>
                <p className="text-sm text-tertiary">
                  Track and manage company fixed assets and depreciation
                </p>
              </div>
              {can("assets", "create") && (
              <button
                type="button"
                onClick={() => navigate("/assets/add")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
              >
                <CirclePlus className="h-4 w-4" strokeWidth={3} /> Add Asset
              </button>
              )}
            </div>
          </>
        )
          // :
          //  activeTab === "maintenance-assets" ? (
          //   <>
          //     <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          //       <div>
          //         <p className="text-xs">
          //           <span
          //             onClick={() => navigate("/dashboard")}
          //             className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          //           >
          //             Dashboard
          //           </span>{" "}
          //           <span className="px-1 text-slate-400">/</span>{" "}
          //           <span className="font-semibold">Maintenance Assets</span>
          //         </p>

          //         <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
          //           Maintenance Assets
          //         </h1>

          //         <p className="text-sm text-tertiary">
          //           Track assets currently under maintenance
          //         </p>
          //       </div>

          //       <button
          //         type="button"
          //         onClick={() => navigate("/maintenance-assets/log")}
          //         className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          //       >
          //         <CirclePlus className="h-4 w-4" strokeWidth={3} />
          //         Add Maintenance Asset
          //       </button>
          //     </div>
          //   </>
          // )
          : activeTab === "maintenance-records" ? (
            <>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs">
                    <span
                      onClick={() => navigate("/dashboard")}
                      className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
                    >
                      Dashboard
                    </span>{" "}
                    <span className="px-1 text-slate-400">/</span>{" "}
                    <span className="font-semibold">Maintenance Records</span>
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
                    Maintenance Records
                  </h1>

                  <p className="text-sm text-tertiary">
                    Track and manage asset maintenance records
                  </p>
                </div>

                {can("maintenance-records", "create") && (
                <button
                  type="button"
                  onClick={() => navigate("/maintenance-records/add")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
                >
                  <CirclePlus className="h-4 w-4" strokeWidth={3} />
                  Add Maintenance Record
                </button>
                )}
              </div>
            </>
          ) : null}
        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200 ">
          <div className="flex items-center gap-6 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSearchParams({ tab: tab.key })}
                  className={`
            relative whitespace-nowrap pb-3 text-sm font-semibold
            transition-colors duration-200
            ${isActive
                      ? "text-[#008951]"
                      : "text-slate-500 hover:text-slate-800"
                    }
          `}
                >
                  {tab.label}

                  {isActive && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-[#008951]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "assets" ? (
          <>
            <Assets />
          </>
        )
          //  : activeTab === "maintenance-assets" ? (
          //   <>
          //   <MaintenanceAssets/>
          //   </>
          //   ) 
          : activeTab === "maintenance-records" ? (
            <>
              <MaintenanceRecords />
            </>
          ) : null
        }

      </section>
    </main>
  );
}

export default AssetsTab