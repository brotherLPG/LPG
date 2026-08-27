import React from 'react';

export default function GlobalTable({ emptyContent }) {
  return (
    <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
      {emptyContent || "No data available."}
      <p className="text-xs mt-2 text-rose-500">Note: GlobalTable component was missing on this branch. This is a temporary placeholder.</p>
    </div>
  );
}
