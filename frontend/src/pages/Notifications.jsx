import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function Notifications() {
  const [numbers, setNumbers] = useState({});
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Load numbers safely
  async function load() {
    try {
      const res = await axios.get(`${BASE_URL}/notifications`);
      setNumbers(res.data.numbers || {});
    } catch (err) {
      console.error("Load error:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Send OTP (ADD FLOW)
  const sendOtp = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/notifications/send-otp`,
        null,
        { params: { phone } }
      );
      alert("OTP sent");
    } catch (err) {
      console.error("OTP error:", err);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify & Add number
  const verifyAdd = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/notifications/verify-add`,
        null,
        { params: { phone, code: otp } }
      );

      alert("Number added successfully");
      setPhone("");
      setOtp("");
      load();
    } catch (err) {
      console.error("Verify error:", err);
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE FLOW
  const verifyRemove = async (phoneNumber) => {
    try {
      setLoading(true);

      // STEP 1: Send OTP
      await axios.post(
        `${BASE_URL}/notifications/send-otp`,
        null,
        { params: { phone: phoneNumber } }
      );

      alert("OTP sent for removal");

      // STEP 2: Ask OTP
      const code = prompt("Enter OTP to confirm removal");

      if (!code) {
        setLoading(false);
        return;
      }

      // STEP 3: Verify and remove
      const res = await axios.post(
        `${BASE_URL}/notifications/verify-remove`,
        null,
        { params: { phone: phoneNumber, code } }
      );

      if (res.data.status === "removed") {
        alert("Number removed successfully");
        load();
      } else {
        alert("Invalid OTP");
      }

    } catch (err) {
      console.error("Remove error:", err);
      alert("Failed to remove number");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-gray-900">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>

      {/* Add Number */}
      <div className="mb-6 p-4 border rounded-lg bg-white shadow">
        <h3 className="font-semibold mb-3">Add Phone Number</h3>

        <div className="flex gap-2 mb-3">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91XXXXXXXXXX"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={sendOtp}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Send OTP
          </button>
        </div>

        <div className="flex gap-2">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={verifyAdd}
            className="bg-green-600 text-white px-4 rounded"
          >
            Verify
          </button>
        </div>
      </div>

      {/* Registered Numbers */}
      <div className="p-4 border rounded-lg bg-white shadow">
        <h3 className="font-semibold mb-3">Registered Numbers</h3>

        {Object.keys(numbers).length === 0 ? (
          <p className="text-gray-500">No numbers added</p>
        ) : (
          <ul className="space-y-2">
            {Object.keys(numbers).map((p) => (
              <li
                key={p}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{p}</span>
                <button
                  onClick={() => verifyRemove(p)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && (
        <p className="mt-4 text-sm text-gray-500">Processing...</p>
      )}
    </div>
  );
}