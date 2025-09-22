import React, { useState } from "react";
import { pharmacyAPI } from "../api/api";
import { Pill, User, Send } from "lucide-react";

const SellMedicine = () => {
  const [medicineBatch, setMedicineBatch] = useState("");
  const [patientCode, setPatientCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const { data, error } = await pharmacyAPI.sellToPatient({
        medicineBatch,
        patientCode,
      });

      if (error) setMsg(`❌ ${error}`);
      else setMsg(`✅ Medicine sold! Tx: ${data.txHash}`);
    } catch (err) {
      setMsg(`❌ Error: ${err.message || "Failed to sell medicine"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
        <Send className="w-5 h-5" /> Sell Medicine to Patient
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine Batch */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Medicine Batch
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Pill className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Enter batch number"
              value={medicineBatch}
              onChange={(e) => setMedicineBatch(e.target.value)}
              required
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Patient Code */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Patient Code
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <User className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Enter patient code"
              value={patientCode}
              onChange={(e) => setPatientCode(e.target.value)}
              required
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          {loading ? "Processing..." : "Sell Medicine"}
        </button>
      </form>

      {msg && (
        <p
          className={`mt-4 text-center font-medium ${
            msg.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
};

export default SellMedicine;
