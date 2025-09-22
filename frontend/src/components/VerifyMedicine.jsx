import React, { useState } from "react";
import { patientAPI } from "../api/api";
import { CheckCircle, Pill } from "lucide-react";

const VerifyMedicine = () => {
  const [medicineBatch, setMedicineBatch] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // ✅ Use a placeholder for the patientCode
      const patientCode = "YOUR_PATIENT_CODE_HERE";
      const { data, error } = await patientAPI.verifyMedicine({ medicineBatch, patientCode });
      if (!error) setResult(data);
    } catch (err) {
      setResult({ verified: false, manufacturer: "-", pharmacy: "-" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5" /> Verify Medicine
      </h2>
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Pill className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Enter medicine batch"
            value={medicineBatch}
            onChange={(e) => setMedicineBatch(e.target.value)}
            required
            className="w-full outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      {result && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            result.valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          <p>
            Verified: {result.valid ? "Yes ✅" : "No ❌"}
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyMedicine;