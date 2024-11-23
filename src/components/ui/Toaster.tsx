"use client";

import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToasterContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToasterContext = createContext<ToasterContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToasterContext);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      <Toaster toasts={toasts} />
    </ToasterContext.Provider>
  );
}

function Toaster({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`px-4 py-2 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            } text-white`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 