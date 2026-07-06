/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl min-w-[300px] border ${
                toast.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800   ' 
                  : toast.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800   '
                  : 'bg-blue-50 border-blue-200 text-blue-800   '
              } backdrop-blur-md`}
            >
              <div className="text-xl flex-shrink-0">
                {toast.type === 'success' && <FaCheckCircle className="text-green-600 " />}
                {toast.type === 'error' && <FaExclamationCircle className="text-red-600 " />}
                {toast.type === 'info' && <FaInfoCircle className="text-blue-600 " />}
              </div>
              
              <div className="flex-1 font-medium text-sm sm:text-base">
                {toast.message}
              </div>
              
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600  :text-gray-300 transition-colors"
              >
                <FaTimes />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
