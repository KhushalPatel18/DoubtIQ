import React from 'react'
import { Route, Routes, Navigate,BrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing'
import AuthForm from './pages/AuthForm.jsx'
import Dashboard from './pages/Dashboard.jsx'

// ✅ SIMPLE INLINE AUTH CHECK
const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/authform" element={<AuthForm />} />
        <Route path="/dashboard" element={ isAuthenticated() ? <Dashboard /> : <Navigate to="/authform" replace /> } />
      </Routes>
    </div>
  )
}

export default App
