import React, { useEffect, useState } from "react";
import { manufacturerAPI } from "../api/api";

const Selltopharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        // Get medicines
        const medRes = await manufacturerAPI.viewMedicines();
        if (!medRes.error) setMedicines(medRes.data || []);

        // Get all pharmacies (since we're using demo data)
        const pharmRes = await manufacturerAPI.getPharmacies();
        if (!pharmRes.error) setPharmacies(pharmRes.data || []);
        
      } catch (err) {
        setMsg(`❌ Failed to fetch data: ${err.message}`);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedicine || !selectedPharmacy) return;
    
    setLoading(true);
    setMsg("");
    
    try {
      const { data, error } = await manufacturerAPI.sellToPharmacy({
        medicineBatch: selectedMedicine,
        pharmacyCode: selectedPharmacy,
      });
      
      if (error) setMsg(`❌ ${error}`);
      else setMsg(`✅ Medicine sent to pharmacy successfully! Tx: ${data.txHash}`);
      
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredPharmacies = pharmacies.filter((ph) =>
    ph.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (fetching) return <p className="text-center mt-4">Loading data...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Sell Medicine to Pharmacy (Manufacturer: MC1001)
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Medicine Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Medicine
          </label>
          <select
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
            required
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Choose a medicine...</option>
            {medicines.map((med, idx) => (
              <option key={idx} value={med.medicineBatch}>
                {med.medicineName} (Batch: {med.medicineBatch}) - ₹{med.medicinePrice}
              </option>
            ))}
          </select>
        </div>

        {/* Pharmacy Search */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Search Pharmacy
          </label>
          <input
            type="text"
            placeholder="Search for a pharmacy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Pharmacy Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Pharmacy
          </label>
          <select
            value={selectedPharmacy}
            onChange={(e) => setSelectedPharmacy(e.target.value)}
            required
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Choose a pharmacy...</option>
            {filteredPharmacies.map((ph, idx) => (
              <option key={idx} value={ph.pharmacyCode}>
                {ph.pharmacyName} ({ph.pharmacyCode}) - {ph.pharmacyAddress}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedMedicine || !selectedPharmacy}
          className={`p-2 rounded-lg font-semibold text-white cursor-pointer ${
            loading || !selectedMedicine || !selectedPharmacy
              ? "bg-gray-400" 
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send to Pharmacy"}
        </button>
      </form>
      
      {msg && (
        <p className={`mt-4 p-2 rounded text-center ${
          msg.startsWith("✅")
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {msg}
        </p>
      )}
    </div>
  );
};

export default Selltopharmacy;