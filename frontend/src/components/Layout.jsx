import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = ({ user, onLogout }) => {
  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2>Pharma DApp</h2>
        <ul>
          {user.role === "manufacturer" && (
            <>
              <li><Link to="/manufacturer/add-medicine">Add Medicine</Link></li>
              <li><Link to="/manufacturer/medicines">View Medicines</Link></li>
              <li><Link to="/manufacturer/sell">Sell to Pharmacy</Link></li>
            </>
          )}
          {user.role === "pharmacy" && (
            <>
              <li><Link to="/pharmacy/inventory">Inventory</Link></li>
              <li><Link to="/pharmacy/sell">Sell Medicine</Link></li>
            </>
          )}
          {user.role === "patient" && (
            <>
              <li><Link to="/patient/verify">Verify Medicine</Link></li>
              <li><Link to="/patient/history">Purchase History</Link></li>
            </>
          )}
          {user.role === "admin" && (
            <>
              <li><Link to="/admin/dashboard">Dashboard</Link></li>
              <li><Link to="/admin/medicines">View Medicines</Link></li>
              <li><Link to="/admin/pharmacies">View Pharmacies</Link></li>
            </>
          )}
        </ul>
        <button onClick={onLogout}>Logout</button>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
