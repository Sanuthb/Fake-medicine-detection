import React, { useState } from "react";
import { manufacturerAPI } from "../api/api";
import { Tablets } from "lucide-react";

const AddMedicine = () => {
  const [form, setForm] = useState({
    manufacturerID: "",
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
      const { data } = await manufacturerAPI.addMedicine(payload);
      setMsg(`Medicine "${form.medicineName}" added! Tx: ${data.txHash}`);
    } catch (err) {
      setMsg(`Error: ${err.message || "Failed to add medicine"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex gap-2"><Tablets /> Add Medicine</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Manufacturer ID"
          value={form.manufacturerID}
          onChange={(e) => handleChange("manufacturerID", e.target.value)}
          required
        />
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Medicine Name"
          value={form.medicineName}
          onChange={(e) => handleChange("medicineName", e.target.value)}
          required
        />
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Batch Number"
          value={form.medicineBatch}
          onChange={(e) => handleChange("medicineBatch", e.target.value)}
          required
        />
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Brand"
          value={form.medicineBrand}
          onChange={(e) => handleChange("medicineBrand", e.target.value)}
          required
        />
        <input
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Price"
          type="number"
          value={form.medicinePrice}
          onChange={(e) => handleChange("medicinePrice", e.target.value)}
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
          placeholder="Composition"
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
          {loading ? "Adding..." : "Add Medicine"}
        </button>
      </form>
      {msg && (
        <p
          className={`mt-4 p-2 rounded ${
            msg.startsWith("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
};

export default AddMedicine;
