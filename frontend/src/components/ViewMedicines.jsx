import React, { useEffect, useState } from "react";
import { manufacturerAPI } from "../api/api";

const ViewMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await manufacturerAPI.viewMedicines();
        if (data) setMedicines(data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  return (
    <div className="w-full">

      {loading ? (
        <p className="text-gray-500 italic">Loading medicines...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Batch</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Brand</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length > 0 ? (
                medicines.map((med, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-6 py-3 text-sm text-gray-700">{med.medicineId}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {med.medicineName}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{med.medicineBatch}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{med.medicineBrand}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">₹{med.medicinePrice}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{med.expiryDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500 italic"
                  >
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewMedicines;
