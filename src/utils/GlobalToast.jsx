import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";

const DEFAULT_TOAST_DURATION = 15000;

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = DEFAULT_TOAST_DURATION) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => addToast(message, "success", duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, "error", duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, "info", duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, "warning", duration), [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const { id, message, type, duration = DEFAULT_TOAST_DURATION } = toast;

  useEffect(() => {
    if (!duration) return undefined;
    const timer = setTimeout(() => onRemove(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    info: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
  };

  const bgColors = {
    success: "bg-white dark:bg-gray-900 border-green-200 dark:border-green-800",
    error: "bg-white dark:bg-gray-900 border-red-200 dark:border-red-800",
    warning: "bg-white dark:bg-gray-900 border-yellow-200 dark:border-yellow-800",
    info: "bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800",
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in fade-in duration-300 ${bgColors[type]}`}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-slate-800 dark:text-gray-100">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ToastProvider;
