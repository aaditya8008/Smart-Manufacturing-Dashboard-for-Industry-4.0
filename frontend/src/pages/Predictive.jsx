import React, { useEffect, useRef, useState } from "react";
import { getHistory } from "../services/api";
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

export default function Predictive() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRefs = useRef([]);

  useEffect(() => {
    async function load() {
      try {
        const h = await getHistory(300);

        const series = h.series || [];
        const unique = [];
        const seen = new Set();

        for (const item of series) {
          if (!seen.has(item.timestamp)) {
            seen.add(item.timestamp);
            unique.push(item);
          }
        }

        setHistory(unique);
        setLoading(false);
      } catch (err) {
        console.error("Error loading ThingSpeak data:", err);
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

 
  const latest = history[history.length - 1];
  const isRealtime = latest?.status === "active";

  const limitedHistory = history.slice(-25);
  const labels = limitedHistory.map((r) =>
    new Date(r.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  const generateData = (label, key, color) => ({
    labels,
    datasets: [
      {
        label,
        data: limitedHistory.map((r) => r[key]),
        borderColor: color,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  });

  const chartOptions = (label) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1f2937" } },
    },
    scales: {
      y: {
        title: { display: true, text: label, color: "#1f2937" },
        ticks: { color: "#1f2937" },
      },
      x: { ticks: { color: "#1f2937" } },
    },
  });

  const anomalyData = {
    labels,
    datasets: [
      {
        label: "Anomaly Score",
        data: limitedHistory.map((r) => r.anomaly_score ?? 0),
        borderColor: "#f97316",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: limitedHistory.map((r) =>
          r.anomaly ? "#dc2626" : "#facc15"
        ),
      },
    ],
  };

  const anomalyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1f2937" } },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        title: { display: true, text: "Anomaly Score", color: "#1f2937" },
        ticks: { color: "#1f2937" },
      },
      x: { ticks: { color: "#1f2937" } },
    },
  };

  return (
    <div className="max-w-7xl mx-auto text-gray-900 relative">

      {/*  STATUS DISPLAY */}
      <div className="absolute top-0 right-0 mt-1 mr-2 text-sm font-medium">
        <span className="text-black">Status: </span>
        <span className={isRealtime ? "text-green-600" : "text-blue-600"}>
          {isRealtime ? "Realtime" : "Simulating"}
        </span>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Predictive Maintenance Analytics
      </h2>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { title: "Temperature Trend (°C)", key: "temperature", color: "#ef4444", label: "Temperature (°C)" },
          { title: "Humidity Trend (%)", key: "humidity", color: "#3b82f6", label: "Humidity (%)" },
          { title: "Pressure Trend (hPa)", key: "pressure", color: "#22c55e", label: "Pressure (hPa)" },
          { title: "Rain Trend (mm/hr)", key: "rain", color: "#eab308", label: "Rain (mm/hr)" },
          { title: "Wind Trend (m/s)", key: "wind", color: "#8b5cf6", label: "Wind (m/s)" },
        ].map(({ title, key, color, label }, index) => (
          <ChartCard key={key} title={title}>
            {loading ? (
              <div className="h-66 flex items-center justify-center text-gray-500">
                Loading data...
              </div>
            ) : history.length > 0 ? (
              <div
                className="h-66 overflow-x-auto overflow-y-hidden pb-2"
                ref={(el) => (scrollRefs.current[index] = el)}
              >
                <div className="min-w-[800px] h-64">
                  <Line
                    data={generateData(label, key, color)}
                    options={chartOptions(label)}
                  />
                </div>
              </div>
            ) : (
              <div className="h-66 flex items-center justify-center text-gray-500">
                Waiting for live data...
              </div>
            )}
          </ChartCard>
        ))}

        {/* Anomaly Score Chart */}
        <ChartCard title="Anomaly Score Over Time">
          {loading ? (
            <div className="h-66 flex items-center justify-center text-gray-500">
              Loading anomaly data...
            </div>
          ) : history.length > 0 ? (
            <div
              className="h-66 overflow-x-auto overflow-y-hidden pb-2"
              ref={(el) => (scrollRefs.current[5] = el)}
            >
              <div className="min-w-[800px] h-64">
                <Line data={anomalyData} options={anomalyOptions} />
              </div>
            </div>
          ) : (
            <div className="h-66 flex items-center justify-center text-gray-500">
              Waiting for anomaly data...
            </div>
          )}
        </ChartCard>
      </div>

      {/* Table Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Recent Sensor Readings">
          <div className="h-80 overflow-auto">
            <table className="w-full text-sm text-center">
  <thead>
    <tr className="text-gray-700 border-b border-gray-300">
      <th className="py-1 text-center">Time</th>
      <th className="py-1 text-center">Temp (°C)</th>
      <th className="py-1 text-center">Humidity (%)</th>
      <th className="py-1 text-center">Pressure (hPa)</th>
      <th className="py-1 text-center">Rain (mm/hr)</th>
      <th className="py-1 text-center">Wind (m/s)</th>
      <th className="py-1 text-center">Anomaly</th>
      <th className="py-1 text-center">Anomaly Score</th>
    </tr>
  </thead>

  <tbody>
    {history.slice(-80).reverse().map((r, i) => (
      <tr
        key={i}
        className={`border-t border-gray-300 hover:bg-gray-100 ${
          r.anomaly ? "bg-red-100" : "bg-white"
        }`}
      >
        <td className="text-center">
          {new Date(r.timestamp).toLocaleTimeString()}
        </td>
        <td className="text-center">{r.temperature?.toFixed(2)}</td>
        <td className="text-center">{r.humidity?.toFixed(2)}</td>
        <td className="text-center">{r.pressure?.toFixed(2)}</td>
        <td className="text-center">{r.rain?.toFixed(2)}</td>
        <td className="text-center">{r.wind?.toFixed(2)}</td>

        <td
          className={`text-center ${
            r.anomaly
              ? "text-red-600 font-semibold"
              : "text-green-600"
          }`}
        >
          {r.anomaly ? "Yes" : "No"}
        </td>

        <td
          className="text-center"
          style={{
            color:
              r.anomaly_score > 0.7
                ? "#dc2626"
                : r.anomaly_score > 0.4
                ? "#f97316"
                : "#16a34a",
            fontWeight: "500",
          }}
        >
          {r.anomaly_score?.toFixed(2) ?? "--"}
        </td>
      </tr>
    ))}
  </tbody>
</table>
          </div>
        </ChartCard>

        <ChartCard title="Model Information">
          <div className="space-y-2 text-gray-800 text-sm">
            <p>
              <span className="font-semibold text-black">Model:</span> Isolation Forest (server-side)
            </p>
            <p>
              <span className="font-semibold text-black">Last Retrained:</span> See backend logs
            </p>
            <p>
              <span className="font-semibold text-black">Input Features:</span> Temperature, Humidity, Pressure, Rain, Wind
            </p>
            <p>
              <span className="font-semibold text-black">Update Rate:</span> Every 10 seconds
            </p>
            <p className="text-gray-600">
              The model continuously monitors sensor values via ThingSpeak and flags anomalies in real time.
            </p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
