import React, { useEffect, useRef, useState } from "react";
import { getLiveData, getHistory, getTrends } from "../services/api";
import KPI from "../components/KPI";
import ChartCard from "../components/ChartCard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

export default function Dashboard() {
  const [live, setLive] = useState(null);
  const [history, setHistory] = useState([]);
  const [risk, setRisk] = useState(null);
  const [trends, setTrends] = useState([]);
  const scrollRefs = useRef([]);

  useEffect(() => {
    async function loadAll() {
      try {
        const [l, h, t] = await Promise.all([
          getLiveData(),
          getHistory(150),
          getTrends("industry 4.0 OR manufacturing OR smart factory", 5),
        ]);
        // remove setRisk(r)
        
        setLive(l.data || {});
        setHistory(h.series || []);
      
        setTrends(t.items || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    }

    loadAll();
    const interval = setInterval(loadAll, 120000);
    return () => clearInterval(interval);
  }, []);

 

  const limitedHistory = history.slice(-25);
  const labels = limitedHistory.map((r) =>
    new Date(r.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  const combinedData = {
    labels,
    datasets: [
      { label: "Temperature (°C)", data: limitedHistory.map((r) => r.temperature), borderColor: "#ef4444", borderWidth: 2, tension: 0.3 },
      { label: "Humidity (%)", data: limitedHistory.map((r) => r.humidity), borderColor: "#3b82f6", borderWidth: 2, tension: 0.3 },
      { label: "Rain (mm/hr)", data: limitedHistory.map((r) => r.rain), borderColor: "#eab308", borderWidth: 2, tension: 0.3 },
    ],
  };

  const combinedOptions = {
    plugins: { legend: { position: "top", labels: { color: "#1f2937" } } },
    scales: { y: { ticks: { color: "#1f2937" } }, x: { ticks: { color: "#1f2937" } } },
    maintainAspectRatio: false,
  };

  const pressureData = {
    labels,
    datasets: [{ label: "Pressure (hPa)", data: limitedHistory.map((r) => r.pressure), borderColor: "#22c55e", borderWidth: 2, tension: 0.3 }],
  };

  const windData = {
    labels,
    datasets: [{ label: "Wind (m/s)", data: limitedHistory.map((r) => r.wind), borderColor: "#8b5cf6", borderWidth: 2, tension: 0.3 }],
  };

  const anomalyData = {
    labels,
    datasets: [
      {
        label: "Anomaly Score",
        data: limitedHistory.map((r) => r.anomaly_score ?? 0),
        borderColor: "#f97316",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2,
        pointBackgroundColor: limitedHistory.map((r) => (r.anomaly ? "#dc2626" : "#facc15")),
      },
    ],
  };

  const riskChart = {
    labels: (risk?.timeseries || []).map((p) =>
      new Date(parseInt(p.date, 10) * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Average Risk Probability",
        data: (risk?.timeseries || []).map((p) => p.avg_risk),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto text-gray-900">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        Smart Manufacturing Dashboard
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPI title="Temperature" value={live?.temperature ?? "--"} sub="°C (Current)" />
        <KPI title="Humidity" value={live?.humidity ?? "--"} sub="% (Current)" />
        <KPI
          title="Anomaly Score"
          value={live?.anomaly_score ?? "--"}
          sub={live?.anomaly ? "⚠️ Anomaly Detected" : "Normal"}
        />
        
      </div>

      {/* Charts and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
          {/* Combined Chart */}
          <ChartCard title="Temperature, Humidity & Rain (Combined)">
            <div
              className="h-66 overflow-x-auto overflow-y-hidden pb-2"
              ref={(el) => (scrollRefs.current[0] = el)}
            >
              <div className="min-w-[800px] h-64">
                {history.length > 0 ? (
                  <Line data={combinedData} options={combinedOptions} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Waiting for live data...
                  </div>
                )}
              </div>
            </div>
          </ChartCard>

          {/* Pressure Chart */}
          <ChartCard title="Pressure Trend (hPa)">
            <div
              className="h-66 overflow-x-auto overflow-y-hidden pb-2"
              ref={(el) => (scrollRefs.current[1] = el)}
            >
              <div className="min-w-[800px] h-64">
                {history.length > 0 ? (
                  <Line data={pressureData} options={combinedOptions} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Waiting for data...
                  </div>
                )}
              </div>
            </div>
          </ChartCard>

          {/* Wind Chart */}
          <ChartCard title="Wind Trend (m/s)">
            <div
              className="h-66 overflow-x-auto overflow-y-hidden pb-2"
              ref={(el) => (scrollRefs.current[2] = el)}
            >
              <div className="min-w-[800px] h-64">
                {history.length > 0 ? (
                  <Line data={windData} options={combinedOptions} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Waiting for data...
                  </div>
                )}
              </div>
            </div>
          </ChartCard>

          {/* Anomaly Chart */}
          <ChartCard title="Anomaly Scores Over Time">
            <div
              className="h-66 overflow-x-auto overflow-y-hidden pb-2"
              ref={(el) => (scrollRefs.current[3] = el)}
            >
              <div className="min-w-[800px] h-64">
                {history.length > 0 ? (
                  <Line data={anomalyData} options={combinedOptions} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Waiting for data...
                  </div>
                )}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Sidebar with Latest News */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
            Latest Industry 4.0 News
          </h3>
          {trends.length === 0 ? (
            <p className="text-sm text-gray-500">Loading news...</p>
          ) : (
            <ul className="space-y-3">
              {trends.slice(0, 5).map((t, i) => (
                <li
                  key={i}
                  onClick={() => window.open(t.url, "_blank", "noopener")}
                  className="cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {t.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.source ?? "Unknown Source"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      

      <p className="text-right text-xs text-gray-500 mt-4">
        Last refreshed: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
