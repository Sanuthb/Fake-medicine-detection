import React, { useEffect, useState } from "react";
import { adminAPI } from "../../api/api";
import { UserStar, LogOut, Pill, Hospital, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewMedicines from "../../components/ViewMedicines";
import ViewPharmacies from "../../components/ViewPharmacies";
import AddPharmacy from "../../components/AddPharmacy";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalMedicines: 0, totalPharmacies: 0 });
  const [activeTab, setActiveTab] = useState("viewpharmacy");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const medRes = await adminAPI.viewMedicines();
      const pharmRes = await adminAPI.viewPharmacies();
      setStats({
        totalMedicines: medRes.data?.length || 0,
        totalPharmacies: pharmRes.data?.length || 0,
      });
    };
    fetchData();
  }, []);

  return (
    <div className="w-full bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 mb-6 flex items-center justify-between gap-2 shadow rounded-lg">
        <div className="flex items-center gap-2">
          <UserStar />
          <h2 className="font-bold text-xl">Admin Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <h1>Welcome Admin!</h1>
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer bg-red-400 text-white flex gap-2 p-2 rounded-xl"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow w-full md:w-1/2 flex items-center justify-between">
          <p className="flex items-center gap-2">
            <Pill className="text-blue-500" /> Total Medicines
          </p>
          <p className="text-3xl font-bold">{stats.totalMedicines}</p>
        </div>
        <div className="bg-white p-4 rounded shadow w-full md:w-1/2 flex items-center justify-between">
          <p className="flex items-center gap-2">
            <Hospital className="text-blue-500" /> Total Pharmacies
          </p>
          <p className="text-3xl font-bold">{stats.totalPharmacies}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("viewpharmacy")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === "viewpharmacy" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <Hospital /> View Pharmacies
          </button>
          <button
            onClick={() => setActiveTab("viewmedicine")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === "viewmedicine" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <Pill /> View Medicines
          </button>
          <button
            onClick={() => setActiveTab("addpharmacy")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === "addpharmacy" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <PlusCircle /> Add Pharmacy
          </button>
        </div>

        {/* Render Component */}
        <div>
          {activeTab === "viewpharmacy" && <ViewPharmacies />}
          {activeTab === "viewmedicine" && <ViewMedicines />}
          {activeTab === "addpharmacy" && <AddPharmacy />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
