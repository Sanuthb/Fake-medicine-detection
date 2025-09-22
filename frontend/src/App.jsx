import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './pages/admin/Dashboard'
import LoginForm from './components/LoginForm'
import AddMedicine from './components/AddMedicine'
import ManufactureDashboard from './pages/manufacturer/ManufactureDashboard'
import Inventory from './pages/pharmacy/Inventory'
import PatientDashboard from './pages/patient/PatientDashboard'

const App = () => {
  return (
    <Routes>
      <Route path='/admin/dashboard' element={<Dashboard/>} />
      <Route path='/manufacture/add-medicine' element={<AddMedicine/>} />
      <Route path='/manufacture/manufacture-dashboard' element={<ManufactureDashboard/>} />
      <Route path='/pharmacy/inventory' element={<Inventory/>} />
      <Route path='/patient/patient-dashboard' element={<PatientDashboard/>} />
      <Route path='/' element={<LoginForm/>} />
    </Routes>
  )
}

export default App