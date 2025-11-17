import React from "react";

export default function ChartCard({title, children}){
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
