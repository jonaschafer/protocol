'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'info':
        return 'bg-blue-600';
      default:
        return 'bg-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${getBackgroundColor()} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-[90vw]`}
    >
      <span className="text-xl">{getIcon()}</span>
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}

// Toast container component
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ marginTop: `${index * 70}px` }}
            className="pointer-events-auto"
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => onRemove(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
