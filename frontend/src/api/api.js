const API_BASE_URL = "http://localhost:5000";

// Helper function for API requests
async function apiRequest(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    console.error("API Error:", err);
    return { data: null, error: err.message };
  }
}

// Manufacturer APIs
export const manufacturerAPI = {
  addMedicine: (data) =>
    apiRequest("/addMedicine", { method: "POST", body: JSON.stringify(data) }),
  viewMedicines: () => apiRequest("/viewMedicineItems"),
  sellToPharmacy: (data) =>
    apiRequest("/manufacturerSellMedicine", { method: "POST", body: JSON.stringify(data) }),
  // ✅ Updated to fetch pharmacies for a specific manufacturer
  getPharmacies: () =>
    apiRequest(`/viewPharmacies`),
};


// Pharmacy APIs
export const pharmacyAPI = {
  viewPharmacies: () => apiRequest("/viewPharmacies"),
  sellToPatient: (data) =>
    apiRequest("/pharmacySellMedicine", { method: "POST", body: JSON.stringify(data) }),
  getMedicinesDetail: (pharmacyCode) =>
    apiRequest(`/queryMedicines/pharmacy/${pharmacyCode}`),
  // ✅ NEW: Get only detailed info (status, expiry, composition)
  getMedicinesDetailInfo: (pharmacyCode) =>
    apiRequest(`/queryMedicinesDetailInfo/${pharmacyCode}`),
};

// Patient APIs
export const patientAPI = {
  verifyMedicine: (data) =>
    apiRequest("/verifyMedicine", { method: "POST", body: JSON.stringify(data) }),
  getPurchaseHistory: (patientCode) =>
    apiRequest(`/getPurchaseHistory/${patientCode}`),
};

// Admin APIs
export const adminAPI = {
  viewMedicines: () => apiRequest("/viewMedicineItems"),
  viewPharmacies: () => apiRequest("/viewPharmacies"),
  addPharmacy: (data) =>
    apiRequest("/addPharmacy", { method: "POST", body: JSON.stringify(data) }),
};

// Auth (mock)
export const authAPI = {
  login: ({ username, password, role }) => {
    if (username && password) {
      return { data: { user: { username, role }, token: "mock-token" }, error: null };
    }
    return { data: null, error: "Invalid credentials" };
  },
  logout: () => ({ data: { message: "Logged out" }, error: null }),
};