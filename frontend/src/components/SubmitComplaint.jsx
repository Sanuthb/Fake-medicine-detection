import React, { useState } from "react";
import { patientAPI } from "../api/api";
import { AlertTriangle, Send } from "lucide-react";

const SubmitComplaint = () => {
  const [form, setForm] = useState({
    medicineBatch: "",
    patientCode: "PA1001", // Placeholder, ideally fetched from context
    reason: "",
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
      const { data, error } = await patientAPI.submitComplaint(form);
      if (error) {
        setMsg(`❌ Error submitting complaint: ${error}`);
      } else {
        setMsg(`✅ Complaint submitted successfully! ID: ${data.complaintId || 'N/A'}`);
        setForm({ ...form, medicineBatch: "", reason: "" }); // Clear form fields
      }
    } catch (err) {
      setMsg(`❌ Error: ${err.message || "Failed to submit complaint"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 border-t-4 border-red-500">
      <h2 className="text-3xl font-bold text-red-600 mb-6 flex gap-3 items-center">
        <AlertTriangle className="w-7 h-7" /> Submit Medicine Complaint
      </h2>
      <p className="text-gray-600 mb-6">
        Use this form to report issues like expired medicine or incorrect quantity.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-100"
          placeholder="Patient Code (PA1001)"
          value={form.patientCode}
          readOnly
        />
        
        <input
          className="border p-3 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          placeholder="Medicine Batch Number (e.g., BTH001)"
          value={form.medicineBatch}
          onChange={(e) => handleChange("medicineBatch", e.target.value)}
          required
        />
        
        <textarea
          className="border p-3 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          placeholder="Reason for Complaint (e.g., 'Expired medicine received', 'Less quantity than advertised')"
          rows="4"
          value={form.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className={`p-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition ${
            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Submitting..." : <> <Send className="w-5 h-5"/> Submit Complaint </>}
        </button>
      </form>
      
      {msg && (
        <p className={`mt-4 p-3 rounded-lg font-medium ${
          msg.startsWith("✅")
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300"
        }`}>
          {msg}
        </p>
      )}
    </div>
  );
};

export default SubmitComplaint;