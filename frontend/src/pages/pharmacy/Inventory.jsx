import React, { useEffect, useState } from "react";
import { pharmacyAPI } from "../../api/api";
import { LogOut, UserStar, Pill, Send, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [medicineBatch, setMedicineBatch] = useState("");
  const [patientCode, setPatientCode] = useState("PA1001"); // Default patient
  const [sellMsg, setSellMsg] = useState("");
  const [selling, setSelling] = useState(false);

  const navigate = useNavigate();

  // Fetch inventory for pharmacy PH1001
  useEffect(() => {
    const fetchMedicines = async () => {
      const { data, error } = await pharmacyAPI.getMedicinesDetail("PH1001");
      if (!error) setMedicines(data || []);
      setLoading(false);
    };
    fetchMedicines();
  }, []);

  // Sell medicine handler
  const handleSell = async (e) => {
    e.preventDefault();
    setSellMsg("");
    setSelling(true);

    try {
      const { data, error } = await pharmacyAPI.sellToPatient({
        medicineBatch,
        patientCode,
      });
      
      if (error) setSellMsg(`❌ ${error}`);
      else {
        setSellMsg(`✅ Medicine sold to ${patientCode}! Tx: ${data.txHash}`);
        // Refresh inventory after successful sale
        const { data: updatedData } = await pharmacyAPI.getMedicinesDetail("PH1001");
        if (updatedData) setMedicines(updatedData);
      }
    } catch (err) {
      setSellMsg(`❌ Error: ${err.message || "Failed to sell medicine"}`);
    } finally {
      setSelling(false);
      setMedicineBatch("");
    }
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 mb-6 flex items-center justify-between gap-2 shadow rounded-lg">
        <div className="flex items-center gap-2">
          <UserStar className="w-6 h-6" />
          <h2 className="font-bold text-xl">Pharmacy Dashboard (PH1001)</h2>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="font-medium">Welcome Pharmacy!</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 cursor-pointer flex items-center gap-2 p-2 rounded-xl transition hover:bg-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" /> Pharmacy Inventory
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading inventory...</p>
        ) : medicines.length === 0 ? (
          <p className="text-gray-600">No medicines available in PH1001 inventory.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="px-4 py-2 border">Medicine Name</th>
                  <th className="px-4 py-2 border">Batch</th>
                  <th className="px-4 py-2 border">Brand</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2 border font-medium">{med.medicineName}</td>
                    <td className="px-4 py-2 border">{med.medicineBatch}</td>
                    <td className="px-4 py-2 border">{med.medicineBrand}</td>
                    <td className="px-4 py-2 border">₹{med.medicinePrice}</td>
                    <td className="px-4 py-2 border">
                      <span className={`px-2 py-1 rounded text-xs ${
                        med.medicineStatus === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {med.medicineStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">{med.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sell Medicine Form */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5" /> Sell Medicine to Patient
        </h2>

        <form onSubmit={handleSell} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Medicine Batch Number
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Pill className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter batch number from inventory"
                value={medicineBatch}
                onChange={(e) => setMedicineBatch(e.target.value)}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Patient Code
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                required
                className="w-full outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Default: PA1001 (demo patient)</p>
          </div>

          <button
            type="submit"
            disabled={selling}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg transition"
          >
            {selling ? "Processing Sale..." : "Sell Medicine"}
          </button>
        </form>

        {sellMsg && (
          <p className={`mt-4 font-medium ${
            sellMsg.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}>
            {sellMsg}
          </p>
        )}
      </div>
    </div>
  );
};



export default Inventory;