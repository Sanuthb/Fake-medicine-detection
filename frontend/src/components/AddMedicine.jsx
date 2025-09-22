import React, { useState } from "react";
import { manufacturerAPI } from "../api/api";
import { Tablets } from "lucide-react";

const AddMedicine = () => {
  const [form, setForm] = useState({
    manufacturerID: "MC1001", // Default manufacturer
    medicineName: "",
    medicineBatch: "",
    medicineBrand: "",
    medicinePrice: "",
    expiryDate: "",
    composition: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const payload = {
      manufacturerID: form.manufacturerID,
      medicineName: form.medicineName,
      medicineBatch: form.medicineBatch,
      medicineBrand: form.medicineBrand,
      medicinePrice: Number(form.medicinePrice),
      expiryDate: form.expiryDate,
      composition: form.composition,
    };

    try {
      const { data, error } = await manufacturerAPI.addMedicine(payload);
      if (error) {
        setMsg(`❌ Error: ${error}`);
      } else {
        setMsg(`✅ Medicine "${form.medicineName}" added successfully! Tx: ${data.txHash}`);
        // Reset form except manufacturer ID
        setForm({
          manufacturerID: "MC1001",
          medicineName: "",
          medicineBatch: "",
          medicineBrand: "",
          medicinePrice: "",
          expiryDate: "",
          composition: "",
        });
      }
    } catch (err) {
      setMsg(`❌ Error: ${err.message || "Failed to add medicine"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex gap-2">
        <Tablets /> Add Medicine (Manufacturer: MC1001)
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none bg-gray-100"
          placeholder="Manufacturer ID"
          value={form.manufacturerID}
          readOnly
        />
        
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Medicine Name (e.g., Paracetamol)"
          value={form.medicineName}
          onChange={(e) => handleChange("medicineName", e.target.value)}
          required
        />
        
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Batch Number (e.g., BTH001)"
          value={form.medicineBatch}
          onChange={(e) => handleChange("medicineBatch", e.target.value)}
          required
        />
        
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Brand (e.g., Cipla)"
          value={form.medicineBrand}
          onChange={(e) => handleChange("medicineBrand", e.target.value)}
          required
        />
        
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Price (₹)"
          type="number"
          value={form.medicinePrice}
          onChange={(e) => handleChange("medicinePrice", e.target.value)}
          required
        />
        
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Expiry Date"
          type="date"
          value={form.expiryDate}
          onChange={(e) => handleChange("expiryDate", e.target.value)}
          required
        />
        
        <textarea
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Composition (e.g., Acetaminophen 500mg)"
          value={form.composition}
          onChange={(e) => handleChange("composition", e.target.value)}
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded-lg font-semibold text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding Medicine..." : "Add Medicine"}
        </button>
      </form>
      
      {msg && (
        <p className={`mt-4 p-2 rounded ${
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

export default AddMedicine;