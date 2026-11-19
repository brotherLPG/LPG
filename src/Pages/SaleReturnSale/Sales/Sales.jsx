import { useState } from "react";
import { Search, CirclePlus, ArrowLeft, Eye, Edit3, Printer, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Tooltip } from "@heroui/react";
import GlobalTable from "../../../utils/GlobalTable";
import SearchableCustomerSelect from "../../../components/SearchableCustomerSelect";
import { useGetSaleFormOptions, useSales, useSalesLatestFirst } from "../../../queries/sales/sales.queries";
import { queryKeys } from "../../../queries/queryKeys";
import { discardPendingSale } from "../../../offline/repository";
import Returnsales from "../ReturnSales/Returnsales";
import { usePermissions } from "../../../contexts/PermissionContext";
import { usePrint } from "../../../utils/usePrint";
import { useToast } from "../../../utils/GlobalToast";
import { useConfirmation } from "../../../utils/GlobalConfirmation";

const isOfflineSale = (item) =>
  item?.provisional === true
  || item?.syncStatus === "pending"
  || item?.syncStatus === "failed"
  || String(item?.invoiceNumber || "").startsWith("OFF-")
  || String(item?._id || item?.id || "").startsWith("local_");

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const saleOutstanding = (sale) => {
  if (sale.outstandingAmount !== undefined && sale.outstandingAmount !== null && sale.outstandingAmount !== "") {
    return Number(sale.outstandingAmount) || 0;
  }
  return (
    (Number(sale.totalAmount) || 0)
    - (Number(sale.returnedAmount) || 0)
    - (Number(sale.paidAmount) || 0)
  );
};

function Sales() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { confirm } = useConfirmation();
  const { can } = usePermissions();
  const { printContent, getQRCodeImg } = usePrint();
  // const [activeTab, setActiveTab] = useState("sales");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "sales";
  const [searchTerm, setSearchTerm] = useState("");
  const [saleType, setSaleType] = useState("");
  const [saleStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [openViewMenuId, setOpenViewMenuId] = useState(null);

  const { data: formOptionsResponse } = useGetSaleFormOptions();
  const formOptions = formOptionsResponse?.data || {};
  const customers = formOptions.customers || [];
  const saleTypes = formOptions.saleTypes || [];

  const params = {
    page,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
    ...(saleType && { saleType }),
    ...(saleStatus && { saleStatus }),
    ...(paymentStatus && { paymentStatus }),
    ...(customerId && { customerId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data: salesData, isLoading } = useSalesLatestFirst(params);
  const { data: cardSalesData } = useSales({
    page: 1,
    limit: 1,
    ...(customerId && { customerId }),
  });

  const sales = (salesData?.data?.items || []).map((sale) => ({
    ...sale,
    id: sale.id || sale._id,
  }));
  const pagination = salesData?.data?.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 };
  const summary = cardSalesData?.data?.summary || salesData?.data?.summary || {};
  const meta = salesData?.data?.meta || {
    saleTypes: [],
    paymentStatuses: [],
    saleStatuses: [],
  };

  const cardSales = cardSalesData?.data?.items || sales;
  const cardTotal = cardSalesData?.data?.pagination?.total ?? pagination.total ?? 0;
  const cardsCoverAllSales = cardSales.length > 0 && cardSales.length >= cardTotal;
  const pendingFromSales = Math.round(
    cardSales.reduce((sum, sale) => {
      if (sale.saleStatus === "cancelled" || sale.saleStatus === "draft") return sum;
      return sum + saleOutstanding(sale);
    }, 0) * 100
  ) / 100;
  const totalsFromPage = cardSales.reduce(
    (totals, sale) => {
      if (sale.saleStatus === "cancelled" || sale.saleStatus === "draft") return totals;
      const amount = Number(sale.totalAmount) || 0;
      const isCredit = sale.saleType === "credit" || sale.type === "credit";
      totals.total += amount;
      totals.totalCount += 1;
      if (!isCredit) {
        totals.cash += amount;
        totals.cashCount += 1;
      }
      return totals;
    },
    { total: 0, totalCount: 0, cash: 0, cashCount: 0 }
  );
  const hasAllTimeSummary = summary.totalSalesAmount != null;
  const summaryStats = {
    total: hasAllTimeSummary
      ? summary.totalSalesAmount
      : cardsCoverAllSales
        ? totalsFromPage.total
        : summary.todaySalesAmount || 0,
    cash: hasAllTimeSummary
      ? summary.cashSalesAmount
      : cardsCoverAllSales
        ? totalsFromPage.cash
        : summary.cashSalesAmount || 0,
    pendingCredit: cardsCoverAllSales
      ? pendingFromSales
      : summary.pendingCreditAmount || 0,
    totalCount: hasAllTimeSummary
      ? summary.totalSalesCount
      : cardsCoverAllSales
        ? totalsFromPage.totalCount
        : summary.todaySalesCount || 0,
    cashCount: hasAllTimeSummary
      ? summary.cashSalesCount
      : cardsCoverAllSales
        ? totalsFromPage.cashCount
        : summary.cashSalesCount || 0,
  };

  const hasFilters = Boolean(
    searchTerm || customerId || saleType || paymentStatus || startDate || endDate
  );

  const clearFilters = () => {
    setSearchTerm("");
    setCustomerId("");
    setSaleType("");
    setPaymentStatus("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handlePrintSale = (item) => {
    const saleDate = new Date(item.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const qrData = [
      `Sale: ${item.saleNumber}`,
      `Invoice: ${item.invoiceNumber || 'N/A'}`,
      `Customer: ${item.customerName}`,
      `Type: ${item.saleTypeLabel}`,
      `Amount: PKR ${item.totalAmount?.toLocaleString()}`,
      `Paid: PKR ${item.paidAmount?.toLocaleString() || 0}`,
      `Date: ${saleDate}`,
      `Payment Status: ${item.paymentStatusLabel}`,
      `Sale Status: ${item.saleStatusLabel}`,
    ].join('\n');

    const statusClass = item.paymentStatusLabel === 'Paid' ? 'active' : 'inactive';

    const content = `
      <!-- Top Row -->
      <div class="receipt-top">
        <div>
          <p style="font-size: 15px; font-weight: 700; color: #1e293b; margin: 0;">
            ${item.saleNumber}
          </p>
          <p style="font-size: 13px; color: #64748b; margin: 4px 0 0;">
            Invoice: <strong style="color: #1e293b;">${item.invoiceNumber || 'N/A'}</strong>
            &nbsp;•&nbsp; ${item.customerName}
          </p>
          <p style="margin: 8px 0 0;">
            <span class="status-badge ${statusClass}">${item.paymentStatusLabel}</span>
          </p>
        </div>
        ${getQRCodeImg(qrData)}
      </div>

      <!-- Sale Details -->
      <div class="delivery-section">
        <h3 style="font-size: 14px; color: #1e293b; margin-bottom: 4px;">Sale Details</h3>
        <table class="spec-table">
          <tr><th>Sale Number</th><td>${item.saleNumber}</td></tr>
          <tr><th>Invoice Number</th><td>${item.invoiceNumber || 'N/A'}</td></tr>
          <tr><th>Customer</th><td>${item.customerName}</td></tr>
          <tr><th>Sale Type</th><td>${item.saleTypeLabel}</td></tr>
          <tr><th>Items</th><td>${item.itemCount}</td></tr>
          <tr><th>Total Amount</th><td><strong>PKR ${item.totalAmount?.toLocaleString()}</strong></td></tr>
          <tr><th>Paid Amount</th><td>PKR ${(item.paidAmount || 0).toLocaleString()}</td></tr>
          <tr><th>Returned Amount</th><td>PKR ${(item.returnedAmount || 0).toLocaleString()}</td></tr>
          <tr><th>Date</th><td>${saleDate}</td></tr>
          <tr><th>Payment Status</th><td>${item.paymentStatusLabel}</td></tr>
          <tr><th>Sale Status</th><td>${item.saleStatusLabel}</td></tr>
        </table>
      </div>
    `;

    printContent({
      title: `Sale - ${item.saleNumber}`,
      content,
    });
  };

  const handleDeleteOfflineSale = async (item) => {
    const saleId = item._id || item.id;
    if (!String(saleId || "").startsWith("local_")) return;
    const approved = await confirm({
      title: "Delete offline sale",
      message: `Remove ${item.invoiceNumber || item.saleNumber || "this sale"} from this computer? It has not been saved on the server.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });
    if (!approved) return;
    const removed = await discardPendingSale(saleId);
    if (!removed) {
      toast.error("This sale is already on the server and cannot be deleted.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
    toast.success("Offline sale removed.");
  };

  const getSaleMenuData = (item) => {
    const saleId = item.id || item._id;
    const customerIdValue =
      typeof item.customerId === "object" && item.customerId !== null
        ? item.customerId._id
        : item.customerId;
    return { saleId, customerIdValue };
  };

  const renderViewMenu = (item, align = "right", menuKey = null) => {
    const { saleId, customerIdValue } = getSaleMenuData(item);
    const key = menuKey || saleId;
    if (openViewMenuId !== key) return null;
    return (
      <>
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenViewMenuId(null)}
        />
        <div
          className={`absolute ${align === "left" ? "left-0" : "right-0"} top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1 shadow-lg`}
        >
          <button
            type="button"
            onClick={() => {
              setOpenViewMenuId(null);
              navigate(`/sales/view/${saleId}`);
            }}
            className="block w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800"
          >
            View Sale
          </button>
          {customerIdValue && (
            <button
              type="button"
              onClick={() => {
                setOpenViewMenuId(null);
                navigate(`/customers/view/${customerIdValue}`);
              }}
              className="block w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800"
            >
              View Customer
            </button>
          )}
        </div>
      </>
    );
  };

  // Column definitions for sales table
  const salesColumns = [
    {
      key: "saleNumber",
      label: "Sale Number",
      isRowHeader: true,
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 dark:text-slate-500 text-[13px]">
          {item.saleNumber}
        </span>
      ),
    },
    {
      key: "invoiceNumber",
      label: "Invoice Number",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap text-nowrap",
    },
    {
      key: "customerName",
      label: "Customer",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const { saleId } = getSaleMenuData(item);
        const menuKey = `name-${saleId}`;
        const isMenuOpen = openViewMenuId === menuKey;
        return (
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setOpenViewMenuId(isMenuOpen ? null : menuKey)}
              className="font-semibold text-[#1a56db] dark:text-blue-400 hover:underline text-[13px]"
            >
              {item.customerName}
            </button>
            {renderViewMenu(item, "left", menuKey)}
          </div>
        );
      },
    },
    {
      key: "saleTypeLabel",
      label: "Type",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const typeStyles = {
          Cash: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900",
          Credit: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeStyles[item.saleTypeLabel] || "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-100 dark:border-gray-800"}`}
          >
            {item.saleTypeLabel}
          </span>
        );
      },
    },
    {
      key: "totalAmount",
      label: "Amount",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="text-slate-900 dark:text-slate-500 font-semibold text-[13px] tabular-nums tracking-tight">
          {formatMoney(item.totalAmount)}
        </span>
      ),
    },
    {
      key: "itemCount",
      label: "Items",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap text-nowrap",
    },
    {
      key: "paidAmount",
      label: "Paid Amount",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[13px] tabular-nums tracking-tight">
          {formatMoney(item.paidAmount)}
        </span>
      ),
    },
    {
      key: "returnedAmount",
      label: "Returned Amount",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="text-orange-600 dark:text-orange-400 font-semibold text-[13px] tabular-nums tracking-tight">
          {formatMoney(item.returnedAmount)}
        </span>
      ),
    },
    {
      key: "invoiceDate",
      label: "Date",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const date = new Date(item.invoiceDate);
        return date.toLocaleDateString();
      },
    },
    {
      key: "paymentStatusLabel",
      label: "Payment Status",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const statusStyles = {
          Paid: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900",
          Partial: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900",
          Unpaid: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900",
          "Refund Due": "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.paymentStatusLabel] || "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-100 dark:border-gray-800"}`}
          >
            {item.paymentStatusLabel}
          </span>
        );
      },
    },
    {
      key: "saleStatusLabel",
      label: "Sale Status",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const statusStyles = {
          Confirmed: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900",
          Draft: "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-100 dark:border-gray-800",
          "Partially Returned":
            "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900",
          Returned: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900",
          Cancelled: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.saleStatusLabel] || "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-100 dark:border-gray-800"}`}
          >
            {item.saleStatusLabel}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-right pr-6",
      cellClassName: "px-4 py-4 pr-6",
      renderCell: (item) => {
        const { saleId } = getSaleMenuData(item);
        const isMenuOpen = openViewMenuId === saleId;
        return (
        <div className="flex items-center justify-end gap-3">
          {can("sales", "read") && (
            <div className="relative">
              <Tooltip delay={0}>
                <Button
                  onClick={() => setOpenViewMenuId(isMenuOpen ? null : saleId)}
                  aria-label={`View ${item.saleNumber}`}
                  className="text-[#1a56db] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-transparent min-w-0 px-1"
                >
                  <Eye className="h-4 w-4" strokeWidth={2.5} />
                </Button>
                <Tooltip.Content>
                  <p>View</p>
                </Tooltip.Content>
              </Tooltip>
              {renderViewMenu(item)}
            </div>
          )}
          {can("sales", "update") && (
            <Tooltip delay={0}>
              <Button
                onClick={() => navigate(`/sales/edit/${item._id}`)}
                aria-label={`Edit ${item.saleNumber}`}
                className="text-[#008951] dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors bg-transparent min-w-0 px-1"
              >
                <Edit3 className="h-4 w-4" strokeWidth={2.5} />
              </Button>
              <Tooltip.Content>
                <p>Update Sale</p>
              </Tooltip.Content>
            </Tooltip>
          )}
          <Tooltip delay={0}>
            <Button
              onClick={() => handlePrintSale(item)}
              aria-label={`Print ${item.saleNumber}`}
              className="text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 transition-colors bg-transparent min-w-0 px-1"
            >
              <Printer className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            <Tooltip.Content>
              <p>Print Sale</p>
            </Tooltip.Content>
          </Tooltip>
          {String(item._id || item.id || "").startsWith("local_") && (
            <Tooltip delay={0}>
              <Button
                onClick={() => handleDeleteOfflineSale(item)}
                aria-label={`Delete ${item.saleNumber}`}
                className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors bg-transparent min-w-0 px-1"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2.5} />
              </Button>
              <Tooltip.Content>
                <p>Delete offline sale</p>
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>
        );
      },
    },
  ];

  return (
    <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <section>
        {/* Header & Breadcrumbs */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400 dark:text-gray-500">/</span>{" "}
              <span className="font-semibold">
                {activeTab === "sales" ? "Sales" : "Return Sales"}
              </span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              {activeTab === "sales"
                ? "Sales Management"
                : "Return Sales Management"}
            </h1>
            <p className="text-sm text-tertiary">
              {activeTab === "sales"
                ? "Track cash and credit sales for LPG and other gases"
                : "Track and manage customer returns and credit notes"}
            </p>
          </div>
          <div className="flex gap-3">
            {activeTab === "sales" && can("sales", "create") && (
              <button
                type="button"
                onClick={() => navigate("/sales/add")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
              >
                <CirclePlus className="h-4 w-4" strokeWidth={3} /> Add Sales
              </button>
            )}
            {can("sales-returns", "create") && (
              <button
                type="button"
                onClick={() => navigate("/sales/return")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" /> Create Return
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex border-b border-slate-200 dark:border-gray-700">
          <button
            type="button"
            // onClick={() => setActiveTab("sales")}
            onClick={() => setSearchParams({ tab: "sales" })}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${activeTab === "sales" ? "border-blue-600 text-blue-700 dark:text-blue-300" : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"}`}
          >
            Sales
          </button>
          <button
            type="button"
            // onClick={() => setActiveTab("returns")}
            onClick={() => setSearchParams({ tab: "returns" })}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${activeTab === "returns" ? "border-blue-600 text-blue-700 dark:text-blue-300" : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"}`}
          >
            Return Sales
          </button>
        </div>

        {activeTab === "sales" && (
          <>
            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Total Sales",
                  amount: summaryStats.total,
                  hint: `${summaryStats.totalCount} sales`,
                  card: "border-slate-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900",
                  labelClass: "text-slate-500 dark:text-gray-400",
                  valueClass: "text-slate-900 dark:text-gray-100",
                  hintClass: "text-slate-400 dark:text-gray-500",
                },
                {
                  label: "Cash Sales",
                  amount: summaryStats.cash,
                  hint: `${summaryStats.cashCount} sales`,
                  card: "border-emerald-100 dark:border-emerald-900 bg-white dark:bg-gray-900",
                  labelClass: "text-emerald-700/80",
                  valueClass: "text-emerald-600 dark:text-emerald-400",
                  hintClass: "text-slate-400 dark:text-gray-500",
                },
                {
                  label: "Pending Credit",
                  amount: summaryStats.pendingCredit,
                  hint: "Outstanding",
                  card: "border-violet-200 dark:border-violet-800 bg-violet-50/80",
                  labelClass: "text-violet-700 dark:text-violet-500",
                  valueClass: "text-violet-600 dark:text-violet-500",
                  hintClass: "text-violet-400 dark:text-violet-600",
                },
              ].map((card) => (
                <article
                  key={card.label}
                  className={`rounded-2xl border px-5 py-4 shadow-sm ${card.card}`}
                >
                  <p
                    className={`text-[13px] font-medium tracking-wide ${card.labelClass}`}
                  >
                    {card.label}
                  </p>
                  <p
                    className={`mt-2.5 text-[1.7rem] font-semibold leading-none tracking-tight tabular-nums ${card.valueClass}`}
                  >
                    {formatMoney(card.amount)}
                  </p>
                  <p className={`mt-2.5 text-xs font-medium ${card.hintClass}`}>
                    {card.hint}
                  </p>
                </article>
              ))}
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
                <label className="relative flex-1 col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 h-4 w-4" />
                  <input
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50 py-2.5 pl-10 pr-3 text-sm text-slate-700 dark:text-gray-300 outline-none transition placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                    placeholder="Search by customer or invoice ID..."
                  />
                </label>
                <SearchableCustomerSelect
                  customers={customers}
                  value={customerId}
                  placeholder="Customer: All"
                  onChange={(customer) => {
                    setCustomerId(customer?._id || "");
                    setPage(1);
                  }}
                />
                <div className="relative">
                  <select
                    value={saleType}
                    onChange={(event) => {
                      setSaleType(event.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951]"
                  >
                    <option value="">Type: All</option>
                    {saleTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowLeft className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-gray-400 rotate-180 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={paymentStatus}
                    onChange={(event) => {
                      setPaymentStatus(event.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951]"
                  >
                    <option value="">Payment Status: All</option>
                    {meta.paymentStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <ArrowLeft className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-gray-400 rotate-180 pointer-events-none" />
                </div>
                <div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => {
                      setStartDate(event.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951]"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => {
                      setEndDate(event.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951]"
                  />
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasFilters}
                  className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-gray-300 transition hover:bg-slate-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:text-slate-400 dark:disabled:text-gray-500 disabled:hover:bg-white dark:disabled:hover:bg-gray-900"
                >
                  Clear Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
              <GlobalTable
                columns={salesColumns}
                data={sales}
                highlightFirstRow={!isOfflineSale(sales[0])}
                ariaLabel="Sales Table"
                className=""
                rowClassName={(item) =>
                  isOfflineSale(item)
                    ? "sales-offline-row border-b border-rose-100 last:border-0 whitespace-nowrap text-nowrap"
                    : "border-b border-slate-100 dark:border-gray-800 last:border-0 transition-colors whitespace-nowrap text-nowrap hover:bg-slate-50 dark:hover:bg-gray-800"
                }
                // rowClassName="border-b border-slate-100 dark:border-gray-800 last:border-0 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap text-nowrap first:bg-emerald-50 dark:first:bg-emerald-950! first:border-emerald-100 dark:first:border-emerald-900"
                emptyContent={
                  isLoading ? "Loading sales..." : "No sales match your search."
                }
                pagination={true}
                rowsPerPage={pagination.limit || 10}
                totalCount={pagination.total}
                page={page}
                onPageChange={setPage}
              />
            </div>
          </>
        )}

        {activeTab === "returns" && <Returnsales />}
      </section>
    </main>
  );
}

export default Sales;
