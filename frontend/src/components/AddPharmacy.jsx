import React, { useState } from "react";
import { adminAPI } from "../api/api";

const AddPharmacy = () => {
  const [form, setForm] = useState({
    manufacturerID: "",
    pharmacyName: "",
    pharmacyLicense: "",
    pharmacyCode: "",
    pharmacyPhone: "",
    pharmacistName: "",
    pharmacyAddress: "",
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

    try {
      const { data } = await adminAPI.addPharmacy(form);
      setMsg(`✅ Pharmacy "${form.pharmacyName}" added! Tx: ${data.txHash}`);
      setForm({
        manufacturerID: "",
        pharmacyName: "",
        pharmacyLicense: "",
        pharmacyCode: "",
        pharmacyPhone: "",
        pharmacistName: "",
        pharmacyAddress: "",
      });
    } catch (err) {
      setMsg(`❌ Error: ${err.message || "Failed to add pharmacy"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Add Pharmacy</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Manufacturer ID"
          value={form.manufacturerID}
          onChange={(e) => handleChange("manufacturerID", e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Pharmacy Name"
          value={form.pharmacyName}
          onChange={(e) => handleChange("pharmacyName", e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Pharmacy License"
          value={form.pharmacyLicense}
          onChange={(e) => handleChange("pharmacyLicense", e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Pharmacy Code"
          value={form.pharmacyCode}
          onChange={(e) => handleChange("pharmacyCode", e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Pharmacy Phone"
          value={form.pharmacyPhone}
          onChange={(e) => handleChange("pharmacyPhone", e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Pharmacist Name"
          value={form.pharmacistName}
          onChange={(e) => handleChange("pharmacistName", e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Pharmacy Address"
          value={form.pharmacyAddress}
          onChange={(e) => handleChange("pharmacyAddress", e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Pharmacy"}
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
};

export default AddPharmacy;
