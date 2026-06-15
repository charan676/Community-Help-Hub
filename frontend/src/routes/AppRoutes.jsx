import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Emergency from '../pages/Emergency';
import Healthcare from '../pages/Healthcare';
import Schemes from '../pages/Schemes';
import Education from '../pages/Education';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/healthcare" element={<Healthcare />} />
      <Route path="/schemes" element={<Schemes />} />
      <Route path="/education" element={<Education />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute restrictToAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<div style={{ padding: '60px', textAlign: 'center' }}><h2>Page Not Found (404)</h2></div>} />
    </Routes>
  );
};

export default AppRoutes;
