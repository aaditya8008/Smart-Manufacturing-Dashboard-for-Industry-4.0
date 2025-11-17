import React from "react";
export default function TrendCard({item}){
  return (
    <a href={item.url} target="_blank" rel="noreferrer" className="card block hover:shadow-lg transition">
      <div className="text-sm text-slate-300">{item.source} • {item.publishedAt}</div>
      <h4 className="text-white font-medium mt-2">{item.title}</h4>
      <p className="text-slate-400 mt-2 line-clamp-3">{item.summary}</p>
    </a>
  );
}
