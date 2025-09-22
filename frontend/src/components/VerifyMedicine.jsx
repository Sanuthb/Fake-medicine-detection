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
      // ✅ Using consistent patient placeholder
      const patientCode = "PA1001";
      const { data, error } = await patientAPI.verifyMedicine({ 
        medicineBatch, 
        patientCode 
      });
      if (!error) setResult(data);
      else setResult({ valid: false });
    } catch (err) {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5" /> Verify Medicine (Patient: PA1001)
      </h2>
      
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Pill className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Enter medicine batch number"
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
          {loading ? "Verifying..." : "Verify Medicine"}
        </button>
      </form>
      
      {result && (
        <div className={`mt-4 p-4 rounded-lg ${
          result.valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          <p className="font-semibold">
            {result.valid ? "✅ VERIFIED" : "❌ NOT VERIFIED"}
          </p>
          <p className="text-sm mt-1">
            {result.valid 
              ? "This medicine is authentic and was purchased by PA1001" 
              : "This medicine batch was not sold to patient PA1001 or doesn't exist"
            }
          </p>
        </div>
      )}
    </div>
  );
};


export default VerifyMedicine;