import React, { useState } from "react";
import { Hospital } from "lucide-react";
  import { Navigate, useNavigate } from 'react-router-dom';
 
const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("manufacturer1");
  const [password, setPassword] = useState("manufacturer1");
  const [role, setRole] = useState("manufacturer");
  const Navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(username == "manufacturer1"){
      Navigate("/manufacture/manufacture-dashboard");
    } else if(username == "pharmacy1"){
      Navigate("/pharmacy/inventory");
    }
    else if(username == "patient1"){
      Navigate("/patient/patient-dashboard");
    }
    else if(username == "admin"){
      Navigate("/admin/dashboard");
    }
    else{
      Navigate("/page-not-found");
    }
    
  };

  const handlechanges=(e)=>{
    setRole(e.target.value);
    if(e.target.value==="manufacturer"){
      setUsername("manufacturer1");
      setPassword("manufacturer1");
    }
    else if(e.target.value==="pharmacy"){
      setUsername("pharmacy1");
      setPassword("pharmacy1");
    }
    else if(e.target.value==="patient"){

      setUsername("patient1");
      setPassword("patient1");
    }
    else{
      setUsername("admin");
      setPassword("admin");
    }
  }

  return (
    <div className="bg-gray-200 h-screen w-full flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <div className="flex flex-col items-center mb-6">
          <Hospital size={40} className="text-blue-500"/>
          <h2 className="text-center font-bold text-2xl uppercase tracking-wide">{role} Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center">
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="focus:outline-none border-b-2 border-gray-300 pb-2 font-semibold w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="focus:outline-none border-b-2 border-gray-300 pb-2 font-semibold w-full"
          />
          <select value={role} onChange={e =>handlechanges(e)} className="w-full focus:outline-none border-b-2 border-gray-300 pb-2">
            <option value="manufacturer">Manufacturer</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="patient">Patient</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="cursor-pointer bg-blue-500 text-white rounded-lg shadow shadow-blue-50 w-fit p-2">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
