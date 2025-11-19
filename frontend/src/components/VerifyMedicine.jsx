import React, { useState } from "react";
import { patientAPI } from "../api/api";
import { CheckCircle, Pill, Building2, Factory } from "lucide-react";
import { Link } from "react-router-dom";

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
      if (!error && data.isVerified!==undefined) setResult(data);
      else setResult({ isVerified: false });
    } catch (err) {
      setResult({ isVerified: false });
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
        <div className={`mt-4 p-4 rounded-lg border ${
          result.isVerified ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
        }`}>
          <p className="font-semibold text-lg flex items-center gap-2">
            {/* Note: changed 'valid' to 'isVerified' */}
            {result.isVerified ? "✅ VERIFIED - AUTHENTIC" : "❌ NOT VERIFIED - FAKE/UNCERTAIN"}
          </p>
          <p className="text-sm mt-1">
            {result.isVerified 
              ? `This medicine batch was successfully tracked and sold to patient PA1001.` 
              : "This medicine batch was not sold to patient PA1001 or data is missing. Exercise caution."
            }
          </p>
          
          {/* **(NEW DETAILS DISPLAY)** */}
          {result.medicineName && (
            <div className="mt-4 border-t pt-3 space-y-2">
              <h3 className="font-bold text-base text-gray-700">Medicine Details:</h3>
              <p><span className="font-medium">Name:</span> {result.medicineName}</p>
              <p><span className="font-medium">Brand:</span> {result.medicineBrand}</p>
              <p><span className="font-medium">Price:</span> ₹{result.medicinePrice}</p>
              <p><span className="font-medium">Status:</span> <span className={`font-semibold ${result.medicineStatus === 'Sold' ? 'text-red-500' : 'text-green-500'}`}>{result.medicineStatus}</span></p>
              
              {/* **(NEW FIELDS)** */}
              <p><span className="font-medium">Manufacture Date:</span> <span className="font-mono">{result.manufactureDate}</span></p>
              <p><span className="font-medium">Expiry Date:</span> <span className="font-mono text-red-600 font-bold">{result.expiryDate}</span></p>
              <p><span className="font-medium">Composition:</span> {result.composition}</p>

              <h3 className="font-bold text-base text-gray-700 mt-3 flex items-center gap-1">
                <Factory className="w-4 h-4"/> Manufacturer Code:
              </h3>
              <p className='text-sm font-mono p-1 bg-gray-200 rounded'>{result.manufacturerCode}</p>
              
              <h3 className="font-bold text-base text-gray-700 mt-3 flex items-center gap-1">
                <Building2 className="w-4 h-4"/> Pharmacy Code (Sold From):
              </h3>
              <p className='text-sm font-mono p-1 bg-gray-200 rounded'>{result.pharmacyCode}</p>
              
              {/* **(NEW COMPLAINT LINK)** */}
              <Link 
                to="/patient/submit-complaint" 
                state={{ batch: medicineBatch }} // Optional: Pass batch number to complaint form
                className="mt-3 w-full block text-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm font-semibold transition"
              >
                File a Complaint
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default VerifyMedicine;