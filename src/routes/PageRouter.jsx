
import React from 'react'
import { Route, Routes } from "react-router-dom";
import Dashboard from '../Pages/Dashboard/Dashboard';
import Events from '../Pages/Events/Events';
import Reports from '../Pages/Reports/Reports';
import Settings from '../Pages/Settings/Settings';
import Login from '../Pages/Login/Login';
import Cylinders from '../Pages/Cylinders/Cylinders';
import Registration from '../Pages/Registration/Registration';
import Sales from '../Pages/Sales/Sales';
import AddSales from '../Pages/Sales/AddSales';
import CreateReturn from '../Pages/Sales/CreateReturn';
import Invoices from '../Pages/Invoices/Invoices';
import Accounting from '../Pages/Accounting/Accounting';
import Branches from '../Pages/Branches/Branches';
import Notifications from '../Pages/Notifications/Notifications';
import UsersRoles from '../Pages/UsersRoles/UsersRoles';
import RolePermissions from '../Pages/UsersRoles/RolePermissions';
import AddUser from '../Pages/UsersRoles/AddUser';
import Customers from '../Pages/Customers/Customers';
import AddCustomers from '../Pages/Customers/addCustomers';
import Suppliers from '../Pages/Suppliers/Suppliers';
import CylinderTypes from '../Pages/Cylinders/CylinderTypes';
import Employees from '../Pages/Employees/Employees';
import AuditLogs from '../Pages/AuditLogs/AuditLogs';
import StorageTanks from '../Pages/StorageTanks/StorageTanks';
import Expenses from '../Pages/Expenses/Expenses';
import AddExpenses from '../Pages/Expenses/addExpenses';
import AddEmployee from '../Pages/Employees/addEmployee';
import AddSupplier from '../Pages/Suppliers/addSupplier';
import AddCylinderType from '../Pages/Cylinders/addCylinderType';
import Inventory from '../Pages/Inventory/inventory';
import AddInventoryItem from '../Pages/Inventory/AddInventoryItem';
import LpgReceipts from '../Pages/LPGReceipts/LpgReceipts';
import ReceiveLpg from '../Pages/LPGReceipts/ReceiveLpg';
import Payments from '../Pages/Payments/Payments';
import AddPayment from '../Pages/Payments/addPayment';

function PageRouter() {
  // Router container
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
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/cylinders" element={<Cylinders />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/sales/add" element={<AddSales />} />
        <Route path="/sales/return" element={<CreateReturn />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/add" element={<AddCustomers />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/add" element={<AddSupplier />} />
        <Route path="/cylinder-types" element={<CylinderTypes />} />
        <Route path="/cylinders/add-type" element={<AddCylinderType />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/add" element={<AddInventoryItem />} />
        <Route path="/lpg-receipts" element={<LpgReceipts />} />
        <Route path="/lpg-receipts/receive" element={<ReceiveLpg />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/add" element={<AddExpenses />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/payments/add" element={<AddPayment />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/storage-tanks" element={<StorageTanks />} />
      </Routes>
    </div>
  );
}

export default PageRouter;