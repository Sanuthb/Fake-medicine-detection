import React, { useEffect, useState } from "react";
import { adminAPI } from "../api/api";

const ViewPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await adminAPI.viewPharmacies();
        if (data) setPharmacies(data);
      } catch (err) {
        console.error("Error fetching pharmacies:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Pharmacy Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">License</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Code</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Pharmatist</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Address</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.length > 0 ? (
              pharmacies.map((ph, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-6 py-3 text-sm text-gray-700">{ph.pharmacyId}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {ph.pharmacyName}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">{ph.pharmacyLicense}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{ph.pharmacyCode}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{ph.pharmacyPhone}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{ph.pharmacistName}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{ph.pharmacyAddress}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  No pharmacies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPharmacies;
