import React, { useEffect, useState } from "react";
import { getSupplyRisk, postSupplyPredict } from "../services/api";
import ChartCard from "../components/ChartCard";
import KPI from "../components/KPI";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function SupplyChain() {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [predictInput, setPredictInput] = useState({});
  const [predictResult, setPredictResult] = useState(null);

  const loadRisk = async () => {
    try {
      if (!risk) setLoading(true);
      else setUpdating(true);

      const r = await getSupplyRisk();
      setRisk(r);
    } catch (err) {
      console.error("Failed to load supply risk:", err);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadRisk();
    const interval = setInterval(loadRisk, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async () => {
    try {
      const payload = {};

      Object.entries(predictInput).forEach(([key, value]) => {
        if (value === "" || value === undefined) {
          payload[key] = null;
        } else if (!isNaN(value)) {
          payload[key] = Number(value);
        } else {
          payload[key] = value;
        }
      });

      const res = await postSupplyPredict(payload);
      setPredictResult(res);
    } catch {
      alert("Prediction failed. Please verify the input values.");
    }
  };

  const timeseries = {
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

  const numericRegex = /^[0-9]*\.?[0-9]*$/;

  return (
    <div className="max-w-7xl mx-auto px-4 text-gray-800">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        Supply Chain Risk Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPI
          title="Risk Level"
          value={risk?.risk_label ?? "--"}
          sub={
            risk?.risk_probability
              ? Math.round(risk.risk_probability * 100) + "%"
              : ""
          }
        />
        <KPI
          title="Data Source"
          value={risk?.source?.split("\\").slice(-1)[0] ?? "--"}
          sub="Dataset used"
        />
        <KPI
          title="Last Updated"
          value={
            risk?.timestamp
              ? new Date(risk.timestamp).toLocaleString()
              : "--"
          }
          sub="Server timestamp"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Risk Probability Over Time">
          {risk?.timeseries?.length ? (
            <Line data={timeseries} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </ChartCard>

        <ChartCard title="Top Feature Importances">
          <div className="h-72 overflow-y-auto pr-2">
            {(risk?.feature_importances || []).map((f, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{f.feature}</span>
                  <span>{(f.importance * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${f.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-10">
        <ChartCard title="Predict Supply Chain Risk (Manual Input)">
          <div className="border-2 border-gray-300 rounded-xl p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {[
                ["Machine ID", "MCH_101", "machine_id", false],
                ["Temperature (°C)", "65.5", "temperature_C", true],
                ["Vibration Level", "18.2", "vibration_level", true],
                ["Machine Runtime Hours", "42.3", "machine_runtime_hours", true],
                ["Inventory Units", "1200", "inventory_level_units", true],
                ["Pending Orders", "120", "pending_orders", true],
                ["Supplier ID", "SUP_101", "supplier_id", false],
                ["Supplier Lead Time (days)", "4.2", "supplier_lead_time_days", true],
                ["Supplier Quality Score", "91.5", "supplier_quality_score", true],
                ["Supplier Reliability Index", "0.97", "supplier_reliability_index", true],
                ["Fuel Price Index", "1.05", "fuel_price_index", true],
                ["Port Delay (days)", "1.2", "port_delay_days", true],
                ["Market Demand Index", "0.35", "market_demand_index", true],
                ["Weather Disruption Score", "1.1", "weather_disruption_score", true],
              ].map(([label, placeholder, key, isNumber]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {label}
                  </label>

                  <input
                    type="text"
                    inputMode={isNumber ? "decimal" : "text"}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-0 focus:border-blue-600 transition"
                    onChange={(e) => {
                      const value = e.target.value;

                      if (!isNumber || numericRegex.test(value)) {
                        setPredictInput((p) => ({
                          ...p,
                          [key]: value,
                        }));
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handlePredict}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-lg font-semibold"
            >
              Predict Risk
            </button>

            {predictResult && (
              <div className="mt-5 border rounded-lg p-4 bg-gray-50 text-sm">
                <p>
                  <strong>Risk Level:</strong>{" "}
                  {predictResult.risk_label}
                </p>
                <p>
                  <strong>Probability:</strong>{" "}
                  {(predictResult.risk_probability * 100).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
