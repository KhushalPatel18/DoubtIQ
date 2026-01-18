import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import AuthForm from './pages/AuthForm.jsx'
import Dashboard from './pages/Dashboard.jsx'

// ✅ PROTECTED ROUTE COMPONENT - Checks auth dynamically
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true/false = checked

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsAuth(Boolean(token));
  }, []);

  // While checking, don't render anything (or show loading)
  if (isAuth === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // If authenticated, show the dashboard
  if (isAuth) {
    return children;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/authform" replace />;
};

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/authform" element={<AuthForm />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  )
}

export default App
