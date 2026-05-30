import React from 'react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white/95 border-emerald-500/30 text-eco-emerald shadow-lg shadow-emerald-500/5',
          icon: <CheckCircle className="w-5 h-5 text-eco-emerald" />,
        };
      case 'rose':
      case 'error':
        return {
          bg: 'bg-white/95 border-red-500/30 text-red-600 shadow-lg shadow-red-500/5',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        };
      case 'warning':
        return {
          bg: 'bg-white/95 border-orange-500/30 text-orange-600 shadow-lg shadow-orange-500/5',
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        };
      default:
        return {
          bg: 'bg-white/95 border-eco-emerald/30 text-eco-sage shadow-lg shadow-emerald-500/5',
          icon: <Info className="w-5 h-5 text-eco-emerald" />,
        };
    }
  };

  const styles = getStyles(toastMessage.type);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`flex items-center space-x-3.5 px-5 py-4 rounded-2xl border pointer-events-auto backdrop-blur-md max-w-sm font-semibold text-sm ${styles.bg}`}
        >
          <div className="shrink-0">{styles.icon}</div>
          <div className="text-slate-700 flex-1 leading-normal text-xs">{toastMessage.text}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
