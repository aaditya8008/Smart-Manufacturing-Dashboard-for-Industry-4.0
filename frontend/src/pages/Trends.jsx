import React, { useEffect, useState } from "react";
import { getTrends } from "../services/api";

export default function Trends() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState("latest");

  // Fetch news from backend 
  async function loadTrends() {
    try {
      const res = await getTrends("industry 4.0 OR manufacturing OR smart factory", 20);
      setTrends(res.items || []);
    } catch (err) {
      console.error("Error loading trends:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrends();
    const interval = setInterval(loadTrends, 120000); // refresh every 2 mins
    return () => clearInterval(interval);
  }, []);

  // Sorting logic
  const sortArticles = (items) => {
    const sorted = [...items];
    switch (sortMode) {
      case "latest":
        sorted.sort(
          (a, b) =>
            new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0)
        );
        break;
      case "relevance":
        const keywords = ["industry 4.0", "smart", "factory", "manufacturing"];
        sorted.sort((a, b) => {
          const aScore = keywords.filter((k) =>
            (a.title || "").toLowerCase().includes(k)
          ).length;
          const bScore = keywords.filter((k) =>
            (b.title || "").toLowerCase().includes(k)
          ).length;
          return bScore - aScore;
        });
        break;
      default:
        break;
    }
    return sorted;
  };

  const sortedTrends = sortArticles(trends);

  // Handle clicking an article 
  const openLink = (url) => {
    if (!url) {
      alert("No external link available for this article.");
      return;
    }
    const finalUrl = url.startsWith("http") ? url : "https://" + url;
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-7xl mx-auto text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Industry 4.0 Trends</h2>
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:ring-blue-400 focus:outline-none"
        >
          <option value="latest">Sort by: Latest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="relevance">Sort by: Relevance</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-600 text-center py-20">Loading latest news...</div>
      ) : sortedTrends.length === 0 ? (
        <div className="text-gray-600 text-center py-20">No trends available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedTrends.map((item, i) => {
            const summary = item.summary
              ? item.summary.replace(/<[^>]+>/g, "")
              : "";
            const date = item.publishedAt ? new Date(item.publishedAt) : null;

            return (
              <div
                key={i}
                onClick={() => openLink(item.url)}
                className="cursor-pointer block bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transform transition-all duration-300 p-5"
              >
                <div className="flex flex-col h-full">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                      {summary.length > 180
                        ? summary.slice(0, 180) + "..."
                        : summary}
                    </p>
                  </div>

                  <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
                    <span>{item.source ?? "Unknown Source"}</span>
                    <span>
                      {date
                        ? date.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
