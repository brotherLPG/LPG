
import React from 'react'
import { Route, Routes } from "react-router-dom";
import Alert from '../Pages/Alerts/Alert';
import AlertDetail from '../Pages/Alerts/AlertDetail';
import Dashboard from '../Pages/Dashboard/Dashboard';
import LiveView from '../Pages/LiveView/LiveView';
import CameraDetail from '../Pages/LiveView/CameraDetail';
import Events from '../Pages/Events/Events';
import Devices from '../Pages/Devices/Devices';
import Reports from '../Pages/Reports/Reports';
import Settings from '../Pages/Settings/Settings';
import Login from '../Pages/Login/Login';
import Email from '../Pages/Email/Email';
import WhatsApp from '../Pages/WhatsApp/WhatsApp';
import Cylinders from '../Pages/Cylinders/Cylinders';
import Registration from '../Pages/Registration/Registration';
import Inspections from '../Pages/Inspections/Inspections';
import Sales from '../Pages/Sales/Sales';
import Invoices from '../Pages/Invoices/Invoices';
import Accounting from '../Pages/Accounting/Accounting';
import Branches from '../Pages/Branches/Branches';

function PageRouter() {
  return (
    <div className="flex-1 overflow-y-auto">
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Alert" element={<Alert />} />
        <Route path="/alert/:alertId" element={<AlertDetail />} />
        <Route path="/live-view" element={<LiveView />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/email" element={<Email />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/camera/:cameraId" element={<CameraDetail />} />
        <Route path="/cylinders" element={<Cylinders />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/inspections" element={<Inspections />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/branches" element={<Branches />} />
      </Routes>
    </div>
  );
}

export default PageRouter
