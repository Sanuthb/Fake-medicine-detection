import React, { useState, useEffect } from "react";
import { adminAPI } from "../api/api";
import { AlertTriangle, FileText } from "lucide-react";

// Assuming a helper function to decode bytes32 if needed, otherwise displays raw string
const decodeBytes32 = (bytes) => bytes.replace(/["\x00]/g, "").trim(); 

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      
      // NOTE: This call must be made by the admin's wallet address for the 'onlyAdmin' modifier to pass on the blockchain.
      try {
        const { data, error } = await adminAPI.viewComplaints();
        if (error) {
          setError(`Error fetching complaints: ${error}`);
        } else {
          // Assuming the backend returns an array of complaint objects like:
          // [{ id, medicineBatch, patientCode, reason }, ...]
          setComplaints(data);
        }
      } catch (err) {
        setError("Failed to connect to the backend/blockchain.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div className="text-center py-8">Loading complaints...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold text-red-600 mb-6 flex gap-2 items-center">
        <FileText /> All Customer Complaints
      </h3>
      
      {complaints.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">✅ No active complaints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{decodeBytes32(c.medicineBatch)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{decodeBytes32(c.patientCode)}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-red-700 font-semibold">{decodeBytes32(c.reason)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;