import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './dashboards/AdminDashboard';
import LogisticsManagerDashboard from './dashboards/LogisticsManagerDashboard';
import WarehouseStaffDashboard from './dashboards/WarehouseStaffDashboard';
import DeliveryDriverDashboard from './dashboards/DeliveryDriverDashboard';
import AuthService from '../services/authService';

const DashboardRouter = () => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Convert role to lowercase for comparison
  const userRole = currentUser.role.toLowerCase();

  // Return appropriate dashboard based on user role
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'logistics_manager':
      return <LogisticsManagerDashboard />;
    case 'warehouse_staff':
      return <WarehouseStaffDashboard />;
    case 'delivery_driver':
      return <DeliveryDriverDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

export default DashboardRouter; 