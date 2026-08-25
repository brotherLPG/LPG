import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmationContext = createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmationProvider");
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState(null);

  const confirm = useCallback(
    ({ title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
      return new Promise((resolve) => {
        setConfirmation({
          title,
          message,
          confirmText,
          cancelText,
          type,
          onConfirm: () => {
            setConfirmation(null);
            resolve(true);
          },
          onCancel: () => {
            setConfirmation(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  const value = {
    confirm,
  };

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
      {confirmation && <ConfirmationDialog confirmation={confirmation} />}
    </ConfirmationContext.Provider>
  );
};

const ConfirmationDialog = ({ confirmation }) => {
  const { title, message, confirmText, cancelText, type, onConfirm, onCancel } = confirmation;

  const typeStyles = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      iconBg: "bg-red-100",
      confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      iconBg: "bg-yellow-100",
      confirmBtn: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    info: {
      icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
      iconBg: "bg-blue-100",
      confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    success: {
      icon: <AlertTriangle className="h-6 w-6 text-green-500" />,
      iconBg: "bg-green-100",
      confirmBtn: "bg-green-600 hover:bg-green-700 text-white",
    },
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${style.iconBg} mb-4`}>
          {style.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-sm text-slate-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${style.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationProvider;
