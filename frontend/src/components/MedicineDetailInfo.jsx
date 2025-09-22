import React, { useEffect, useState } from "react";
import { pharmacyAPI } from "../api/api";
import { Calendar, Pill, FileText, Search, AlertCircle } from "lucide-react";

const MedicineDetailInfo = () => {
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pharmacyCode, setPharmacyCode] = useState("PH1001"); // Default pharmacy
  const [error, setError] = useState("");

  const fetchMedicineDetails = async (code) => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await pharmacyAPI.getMedicinesDetailInfo(code);
      
      if (error) {
        setError(`Failed to fetch details: ${error}`);
        setMedicineDetails([]);
      } else {
        setMedicineDetails(data || []);
        if (data?.length === 0) {
          setError(`No medicines found for pharmacy ${code}`);
        }
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      setMedicineDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicineDetails(pharmacyCode);
  }, []);

  const handleSearch = () => {
    if (pharmacyCode.trim()) {
      fetchMedicineDetails(pharmacyCode);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0; // Expires within 30 days
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Medicine Detail Information
        </h2>
        
        {/* Search Bar */}
        <div className="flex gap-2 max-w-md">
          <div className="flex-1 flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Enter pharmacy code (e.g., PH1001)"
              value={pharmacyCode}
              onChange={(e) => setPharmacyCode(e.target.value)}
              className="w-full outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading medicine details...</p>
        </div>
      )}

      {/* Medicine Details Grid */}
      {!loading && medicineDetails.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {medicineDetails.map((detail, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Medicine Status */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Status</span>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    detail.medicineStatus
                  )}`}
                >
                  {detail.medicineStatus || "Unknown"}
                </span>
              </div>

              {/* Expiry Date */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-700">Expiry Date</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900">
                    {detail.expiryDate || "Not specified"}
                  </span>
                  {detail.expiryDate && isExpired(detail.expiryDate) && (
                    <span className="text-red-600 text-sm font-medium">⚠️ EXPIRED</span>
                  )}
                  {detail.expiryDate && isExpiringSoon(detail.expiryDate) && !isExpired(detail.expiryDate) && (
                    <span className="text-yellow-600 text-sm font-medium">⚠️ Expires soon</span>
                  )}
                </div>
              </div>

              {/* Composition */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-700">Composition</span>
                </div>
                <p className="text-gray-900 text-sm leading-relaxed">
                  {detail.composition || "Not specified"}
                </p>
              </div>

              {/* Index indicator */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">Medicine #{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Data State */}
      {!loading && medicineDetails.length === 0 && !error && (
        <div className="text-center py-8">
          <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No medicine details found.</p>
          <p className="text-sm text-gray-500 mt-1">
            Try searching for a different pharmacy code.
          </p>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">About Medicine Details</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• <strong>Status:</strong> Shows if medicine is Available, Sold, or Expired</p>
          <p>• <strong>Expiry Date:</strong> Manufacturing expiry date with alerts for expired/expiring medicines</p>
          <p>• <strong>Composition:</strong> Active ingredients and dosage information</p>
          <p>• <strong>Search:</strong> Enter any pharmacy code (PH1001, PH1002, etc.) to view their medicine details</p>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailInfo;