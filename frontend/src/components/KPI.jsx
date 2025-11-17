import React from "react";

export default function KPI({title, value, sub}) {
  return (
    <div className="kpi flex flex-col gap-2">
      <div className="text-slate-300 text-sm">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );
}
