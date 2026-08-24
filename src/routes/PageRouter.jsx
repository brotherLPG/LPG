
import { Route, Routes } from "react-router-dom";
import Dashboard from '../Pages/Dashboard/Dashboard';
import Events from '../Pages/Events/Events';
import Devices from '../Pages/Devices/Devices';
import Reports from '../Pages/Reports/Reports';
import Settings from '../Pages/Settings/Settings';
import Login from '../Pages/Login/Login';
import Cylinders from '../Pages/Cylinders/Cylinders';
import Registration from '../Pages/Registration/Registration';
import Inspections from '../Pages/Inspections/Inspections';
import Sales from '../Pages/Sales/Sales';
import Invoices from '../Pages/Invoices/Invoices';
import Accounting from '../Pages/Accounting/Accounting';
import Branches from '../Pages/Branches/Branches';
import Notifications from '../Pages/Notifications/Notifications';
import UsersRoles from '../Pages/UsersRoles/UsersRoles';
import RolePermissions from '../Pages/UsersRoles/RolePermissions';
import AddUser from '../Pages/UsersRoles/AddUser';

function PageRouter() {
  return (
    <div className="flex-1 overflow-y-auto">
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/users-roles" element={<UsersRoles />} />
        <Route path="/users-roles/add-user" element={<AddUser />} />
        <Route path="/users-roles/Permissions" element={<RolePermissions />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/cylinders" element={<Cylinders />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/inspections" element={<Inspections />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </div>
  );
}

export default PageRouter
