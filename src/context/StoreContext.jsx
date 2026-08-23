import React, { createContext, useContext, useState } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  // --- Data States ---
  
  const [cylinders, setCylinders] = useState([
    { id: "LPG-2456", barcode: "BC-789456", owner: "Customer A", type: "LPG", status: "Filled", location: "Branch 1", lastFill: "2026-01-15" },
    { id: "LPG-2457", barcode: "BC-789457", owner: "Customer B", type: "LPG", status: "Empty", location: "Branch 1", lastFill: "2026-01-10" },
    { id: "LPG-2458", barcode: "BC-789458", owner: "Customer C", type: "Oxygen", status: "Filled", location: "Branch 2", lastFill: "2026-01-14" },
    { id: "LPG-2459", barcode: "BC-789459", owner: "Customer D", type: "LPG", status: "In Inspection", location: "Branch 1", lastFill: "2026-01-08" },
    { id: "LPG-2460", barcode: "BC-789460", owner: "Customer E", type: "LPG", status: "Filled", location: "Branch 3", lastFill: "2026-01-16" },
  ]);

  const [registrations, setRegistrations] = useState([
    { id: "REG-101", customer: "Customer A", phone: "0300-1234567", cnic: "35202-1234567-1", cylinderId: "LPG-2456", barcode: "BC-789456", type: "11 KG", tareWeight: "11.5", branch: "Branch 1", date: "2026-01-10" }
  ]);

  const [sales, setSales] = useState([
    { id: "SAL-001", invoiceId: "INV-2026-0456", customer: "Ahmed Khan", type: "Cash", amount: 12500, date: "2026-01-15", items: 5 },
    { id: "SAL-002", invoiceId: "INV-2026-0457", customer: "Fatima Ali", type: "Credit", amount: 25000, date: "2026-01-15", items: 10 },
    { id: "SAL-003", invoiceId: "INV-2026-0458", customer: "Usman Ahmed", type: "Cash", amount: 7500, date: "2026-01-14", items: 3 },
    { id: "SAL-004", invoiceId: "INV-2026-0459", customer: "Bilal Khan", type: "Credit", amount: 50000, date: "2026-01-14", items: 20 },
  ]);

  const [invoices, setInvoices] = useState([
    { id: "INV-2026-0456", date: "2026-01-15", customer: "Ahmed Khan", amount: 12500, status: "Paid" },
    { id: "INV-2026-0457", date: "2026-01-15", customer: "Fatima Ali", amount: 25000, status: "Unpaid" },
  ]);

  const [transactions, setTransactions] = useState([
    { id: "TRX-1001", type: "Credit", category: "Sales Income", method: "Cash in Hand", amount: 12500, date: "2026-01-15", remarks: "INV-2026-0456" },
    { id: "TRX-1002", type: "Debit", category: "Plant Utility", method: "Bank Account", amount: 150000, date: "2026-01-14", remarks: "Electricity Bill" },
  ]);

  const [branches, setBranches] = useState([
    { id: "BR-01", name: "Main Plant", manager: "Ali Raza", phone: "042-35111111", email: "plant1@lpg.com", location: "Lahore", status: "Active" },
    { id: "BR-02", name: "Distribution Hub", manager: "Omer Farooq", phone: "042-35222222", email: "hub1@lpg.com", location: "Multan", status: "Active" },
    { id: "BR-03", name: "Retail Outlet 1", manager: "Zain Ahmed", phone: "042-35333333", email: "retail1@lpg.com", location: "Islamabad", status: "Inactive" },
  ]);


  // --- Actions ---

  const addCylinder = (formData) => {
    const newCylinder = {
      ...formData,
      id: `LPG-${2456 + cylinders.length + 1}`,
      barcode: `BC-${789456 + cylinders.length + 1}`,
      lastFill: formData.lastFill || new Date().toISOString().split('T')[0]
    };
    setCylinders(prev => [newCylinder, ...prev]);
  };

  const addRegistration = (formData) => {
    const newReg = {
      ...formData,
      id: `REG-${101 + registrations.length}`,
    };
    setRegistrations(prev => [newReg, ...prev]);
  };

  const addSale = (formData) => {
    const newSale = {
      ...formData,
      id: `SAL-00${sales.length + 1}`,
      invoiceId: `INV-2026-${456 + sales.length}`,
      amount: formData.quantity * formData.unitRate
    };
    setSales(prev => [newSale, ...prev]);

    // Also auto-generate an invoice
    addInvoice({
      customer: formData.customer,
      ref: newSale.invoiceId,
      description: `${formData.quantity} x ${formData.type} Cylinders`,
      subtotal: newSale.amount,
      tax: 0,
      total: newSale.amount,
      terms: formData.type === "Cash" ? "Immediate" : "Net 30"
    });
  };

  const addInvoice = (formData) => {
    const newInvoice = {
      id: formData.ref || `INV-2026-099${invoices.length}`,
      date: new Date().toISOString().split('T')[0],
      customer: formData.customer,
      amount: formData.total,
      status: formData.terms === "Immediate" ? "Paid" : "Unpaid"
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const addTransaction = (formData) => {
    const newTrx = {
      ...formData,
      id: `TRX-${1001 + transactions.length}`,
    };
    setTransactions(prev => [newTrx, ...prev]);
  };

  const addBranch = (formData) => {
    const newBranch = {
      ...formData,
      id: `BR-0${branches.length + 1}`,
    };
    setBranches(prev => [newBranch, ...prev]);
  };


  return (
    <StoreContext.Provider value={{
      cylinders, addCylinder,
      registrations, addRegistration,
      sales, addSale,
      invoices, addInvoice,
      transactions, addTransaction,
      branches, addBranch
    }}>
      {children}
    </StoreContext.Provider>
  );
};
