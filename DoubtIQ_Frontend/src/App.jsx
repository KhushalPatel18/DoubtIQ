import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthForm from './pages/AuthForm.jsx';
import Dashboard from './pages/Dashboard.jsx';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#020617]"></div>;
  }
  return isAuthenticated ? children : <Navigate to="/authform" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/authform" element={<AuthForm />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
