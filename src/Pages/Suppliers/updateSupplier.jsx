import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useUpdateSupplier, useSupplierById } from "../../queries/suppliers/suppliers.queries";
import { useToast } from "../../utils/GlobalToast";
import SearchableCustomerSelect from "../../components/SearchableCustomerSelect";

const PAYMENT_TERM_OPTIONS = [
  { _id: "15", label: "Net 15 Days" },
  { _id: "30", label: "Net 30 Days" },
  { _id: "45", label: "Net 45 Days" },
  { _id: "60", label: "Net 60 Days" },
  { _id: "0", label: "Cash on Delivery" },
];

function UpdateSupplier() {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const [isActive, setIsActive] = useState(true);
  const updateSupplierMutation = useUpdateSupplier();

  // Refs for required fields
  const supplierNameRef = useRef(null);
  const contactPersonNameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const paymentTermDaysRef = useRef(null);
  const businessAddressRef = useRef(null);

  // Error states for required fields
  const [supplierNameError, setSupplierNameError] = useState("");
  const [contactPersonNameError, setContactPersonNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const { data: supplierData, isLoading } = useSupplierById(id);
  const supplier =
    supplierData?.data?._doc ||
    supplierData?.data ||
    supplierData?._doc ||
    (supplierData?.supplierName || supplierData?.supplierCode
      ? supplierData
      : null);

  const [formData, setFormData] = useState({
    supplierName: "",
    contactPersonName: "",
    phoneNumber: "",
    emailAddress: "",
    businessAddress: "",
    taxRegistrationNumber: "",
    paymentTermDays: 30,
    openingBalanceAmount: 0,
    city: "",
    stateProvince: "",
    creditLimitAmount: "",
    bankName: "",
    bankAccountTitle: "",
    bankAccountNumber: "",
    iban: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierName: supplier.supplierName || "",
        contactPersonName: supplier.contactPersonName || "",
        phoneNumber: supplier.phoneNumber || "",
        emailAddress: supplier.emailAddress || "",
        businessAddress: supplier.businessAddress || "",
        taxRegistrationNumber: supplier.taxRegistrationNumber || "",
        paymentTermDays: supplier.paymentTermDays || 30,
        openingBalanceAmount: supplier.openingBalanceAmount || 0,
        city: supplier.city || "",
        stateProvince: supplier.stateProvince || supplier.state || "",
        creditLimitAmount: supplier.creditLimitAmount || "",
        bankName: supplier.bankName || "",
        bankAccountTitle: supplier.bankAccountTitle || supplier.accountTitle || "",
        bankAccountNumber: supplier.bankAccountNumber || supplier.accountNumber || "",
        iban: supplier.iban || "",
      });
      setIsActive(supplier.isActive !== undefined ? supplier.isActive : true);
    }
  }, [supplier]);

  const validateRequiredFields = () => {
    let hasError = false;

    if (!formData.supplierName.trim()) {
      setSupplierNameError("Supplier Name is required");
      supplierNameRef.current?.focus();
      hasError = true;
    } else {
      setSupplierNameError("");
    }

    if (!formData.contactPersonName.trim()) {
      setContactPersonNameError("Contact Person is required");
      if (!hasError) contactPersonNameRef.current?.focus();
      hasError = true;
    } else {
      setContactPersonNameError("");
    }

    if (!formData.phoneNumber.trim()) {
      setPhoneNumberError("Phone Number is required");
      if (!hasError) phoneNumberRef.current?.focus();
      hasError = true;
    } else {
      setPhoneNumberError("");
    }

    return !hasError;
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const clearError = (setErrorFn) => {
    setErrorFn("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRequiredFields()) {
      return;
    }

    try {
      const payload = {
        supplierName: formData.supplierName,
        contactPersonName: formData.contactPersonName,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        isActive,
        paymentTermDays: Number(formData.paymentTermDays),
        creditLimitAmount: Number(formData.creditLimitAmount) || 0,
        openingBalanceAmount: Number(formData.openingBalanceAmount) || 0,
        businessAddress: formData.businessAddress,
        city: formData.city,
        stateProvince: formData.stateProvince,
        taxRegistrationNumber: formData.taxRegistrationNumber,
        bankName: formData.bankName,
        bankAccountTitle: formData.bankAccountTitle,
        bankAccountNumber: formData.bankAccountNumber,
        iban: formData.iban,
      };

      await updateSupplierMutation.mutateAsync({ id, data: payload });
      toast.success("Supplier updated successfully!");
      navigate("/suppliers");
    } catch (error) {
      const firstError = error?.response?.data?.errors?.[0];
      const errorMessage = firstError
        ? `${firstError.path}: ${firstError.message}`
        : "Failed to update supplier. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-slate-500">Loading supplier data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <p className="text-xs">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/suppliers")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Suppliers
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Edit Supplier</span>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Edit Supplier
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update supplier profile and purchase account settings
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-800">
                  Supplier Information
                </h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Supplier Code
                  </label>
                  <input
                    type="text"
                    disabled
                    value={supplier?.supplierCode || "N/A"}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Supplier Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={supplierNameRef}
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => {
                      handleInputChange("supplierName", e.target.value);
                      clearError(setSupplierNameError);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, contactPersonNameRef)}
                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${
                      supplierNameError
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                        : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
                    }`}
                    placeholder="Enter supplier name"
                    required
                  />
                  {supplierNameError && (
                    <p className="mt-1.5 text-xs text-rose-500">{supplierNameError}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={contactPersonNameRef}
                    type="text"
                    value={formData.contactPersonName}
                    onChange={(e) => {
                      handleInputChange("contactPersonName", e.target.value);
                      clearError(setContactPersonNameError);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, phoneNumberRef)}
                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${
                      contactPersonNameError
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                        : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
                    }`}
                    placeholder="Enter contact person name"
                    required
                  />
                  {contactPersonNameError && (
                    <p className="mt-1.5 text-xs text-rose-500">{contactPersonNameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={phoneNumberRef}
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      handleInputChange("phoneNumber", e.target.value);
                      clearError(setPhoneNumberError);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, formData.emailAddress ? null : paymentTermDaysRef)}
                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${
                      phoneNumberError
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                        : "border-slate-200 focus:border-[#008951] focus:ring-emerald-100"
                    }`}
                    placeholder="Enter phone number"
                    required
                  />
                  {phoneNumberError && (
                    <p className="mt-1.5 text-xs text-rose-500">{phoneNumberError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) =>
                      handleInputChange("emailAddress", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, paymentTermDaysRef)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status Toggle
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? "bg-[#10b981]" : "bg-slate-200"}`}
                      role="switch"
                      aria-checked={isActive}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                    <span
                      className={`text-sm font-semibold ${isActive ? "text-[#008951]" : "text-[error]"}`}
                    >
                      {isActive ? "Active Supplier" : "Inactive Supplier"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

        
          </div>

          {/* Right Column (lg:col-span-1) */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-800">
                  Payment & Credit Terms
                </h2>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Payment Terms
                  </label>
                  <SearchableCustomerSelect
                    customers={PAYMENT_TERM_OPTIONS}
                    value={String(formData.paymentTermDays)}
                    onChange={(term) =>
                      handleInputChange("paymentTermDays", term?._id || "")
                    }
                    placeholder="Select payment terms"
                    getLabel={(term) => term.label}
                    getSearchText={(term) => term.label.toLowerCase()}
                    emptyText="No payment term found"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Credit Limit (Rs.)
                  </label>
                  <input
                    type="text"
                    value={formData.creditLimitAmount}
                    onChange={(e) =>
                      handleInputChange("creditLimitAmount", e.target.value)
                    }
                    placeholder="e.g. 1,500,000"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Opening Balance (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.openingBalanceAmount}
                    onChange={(e) =>
                      handleInputChange("openingBalanceAmount", e.target.value)
                    }
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    placeholder="Enter opening balance"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Address & Tax Details */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Address & Tax
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Business Address
                </label>
                <textarea
                  ref={businessAddressRef}
                  rows="3"
                  value={formData.businessAddress}
                  onChange={(e) =>
                    handleInputChange("businessAddress", e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                  placeholder="Enter business address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="e.g. Islamabad"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.stateProvince}
                    onChange={(e) => handleInputChange("stateProvince", e.target.value)}
                    placeholder="e.g. Punjab"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tax Registration Number (NTN/STRN)
                  </label>
                  <input
                    type="text"
                    value={formData.taxRegistrationNumber}
                    onChange={(e) =>
                      handleInputChange("taxRegistrationNumber", e.target.value)
                    }
                    placeholder="e.g. 1234567-8"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Card 4: Bank Details */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Bank Details
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  placeholder="e.g. Habib Bank Limited"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Title
                </label>
                <input
                  type="text"
                  value={formData.bankAccountTitle}
                  onChange={(e) =>
                    handleInputChange("bankAccountTitle", e.target.value)
                  }
                  placeholder="e.g. Attock Gas Accounts"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={(e) =>
                    handleInputChange("bankAccountNumber", e.target.value)
                  }
                  placeholder="e.g. 12345678901234"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  IBAN
                </label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => handleInputChange("iban", e.target.value)}
                  placeholder="e.g. PK00 HABB 0000 0012 3456 78"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate("/suppliers")}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateSupplierMutation.isPending}
            className="rounded-lg bg-[#008951] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545] disabled:opacity-60"
          >
            {updateSupplierMutation.isPending
              ? "Updating..."
              : "Update Supplier"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default UpdateSupplier;
