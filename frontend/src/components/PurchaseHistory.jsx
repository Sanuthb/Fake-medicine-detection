import React, { useEffect, useState } from "react";
import { patientAPI } from "../api/api";

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      // ✅ Use a placeholder for the patientCode
      const patientCode = "YOUR_PATIENT_CODE_HERE";
      const { data, error } = await patientAPI.getPurchaseHistory(patientCode);
      if (!error) setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Purchase History</h2>
      {loading ? (
        <p className="text-gray-600">Loading purchase history...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-600">No purchase records found.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 border">Batch</th>
              <th className="px-4 py-2 border">Pharmacy</th>
              <th className="px-4 py-2 border">Manufacturer</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-2 border">{item.medicineBatch}</td>
                <td className="px-4 py-2 border">{item.pharmacyCode}</td>
                <td className="px-4 py-2 border">{item.manufacturerCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchaseHistory;