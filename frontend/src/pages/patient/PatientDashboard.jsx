import React, { useState } from "react";
import { LogOut, UserStar, Archive, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PurchaseHistory from "../../components/PurchaseHistory";
import VerifyMedicine from "../../components/VerifyMedicine";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="w-full bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 mb-4 flex items-center justify-between rounded-lg shadow">
        <div className="flex items-center gap-2">
          <UserStar className="w-6 h-6" />
          <h2 className="font-bold text-xl">Patient Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="font-medium">Welcome Patient!</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 hover:bg-red-600 flex items-center gap-2 px-4 py-2 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "history"
              ? "bg-blue-500 text-white shadow"
              : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          <Archive className="w-5 h-5" /> Purchase History
        </button>

        <button
          onClick={() => setActiveTab("verify")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "verify"
              ? "bg-blue-500 text-white shadow"
              : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          <CheckCircle className="w-5 h-5" /> Verify Medicine
        </button>
      </div>

      {/* Content */}
      <div className="p-4 bg-white rounded-lg shadow">
        {activeTab === "history" ? <PurchaseHistory /> : <VerifyMedicine />}
      </div>
    </div>
  );
};

export default PatientDashboard;
