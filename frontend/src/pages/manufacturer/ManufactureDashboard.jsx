import React, { useState } from "react";
import { LogOut, UserStar, PlusCircle, Eye, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddMedicine from "../../components/AddMedicine";
import ViewMedicines from "../../components/ViewMedicines";
import Selltopharmacy from "../../components/Selltopharmacy";

const ManufactureDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("view");

  return (
    <div className="w-full bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 mb-6 flex items-center justify-between gap-2 shadow rounded-lg">

        <div className="flex items-center gap-2">
          <UserStar className="w-6 h-6" />
          <h2 className="font-bold text-xl">Manufacturer Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="font-medium">Welcome Manufacturer!</h1>
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("view")}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg font-medium transition ${
            activeTab === "view"
              ? "bg-blue-500 text-white shadow"
              : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          <Eye className="w-5 h-5" /> View Medicines
        </button>

        <button
          onClick={() => setActiveTab("add")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition ${
            activeTab === "add"
              ? "bg-blue-500 text-white shadow"
              : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          <PlusCircle className="w-5 h-5" /> Add Medicine
        </button>

        <button
          onClick={() => setActiveTab("sell")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
            activeTab === "sell"
              ? "bg-blue-500 text-white shadow"
              : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          <Truck className="w-5 h-5" /> Sell to Pharmacy
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-white shadow-md rounded-lg p-6 transition">
          {activeTab === "view" ? (
            <ViewMedicines />
          ) : activeTab === "sell" ? (
            <Selltopharmacy />
          ) : (
            <AddMedicine />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManufactureDashboard;
