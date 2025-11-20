import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast({ message: "", type: "", visible: false });
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast.visible && (
        <div
          className={`
            fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white 
            transition-all duration-300 
            ${toast.type === "success" ? "bg-green-600" : ""}
            ${toast.type === "error" ? "bg-red-600" : ""}
            ${toast.type === "warning" ? "bg-yellow-600" : ""}
            ${toast.type === "info" ? "bg-blue-600" : ""}
          `}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
