import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = 'text-blue-500';
        let borderColor = 'border-blue-500/30';
        let bgGradient = 'from-blue-50/90 to-sky-50/80 dark:from-blue-950/40 dark:to-sky-950/30';

        switch (toast.type) {
          case 'success':
            Icon = CheckCircle2;
            iconColor = 'text-emerald-500';
            borderColor = 'border-emerald-500/30';
            bgGradient = 'from-emerald-50/90 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/30';
            break;
          case 'error':
            Icon = AlertCircle;
            iconColor = 'text-rose-500';
            borderColor = 'border-rose-500/30';
            bgGradient = 'from-rose-50/90 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/30';
            break;
          case 'warning':
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
            borderColor = 'border-amber-500/30';
            bgGradient = 'from-amber-50/90 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/30';
            break;
        }

        return (
          <div
            key={toast.id}
            className={`glass-panel bg-gradient-to-r ${bgGradient} border ${borderColor} rounded-2xl p-4 flex items-start gap-3 shadow-lg transform transition-all duration-300 animate-slide-in`}
            style={{
              animation: 'slideIn 0.3s ease-out forwards'
            }}
          >
            <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
            <div className="flex-1 text-sm font-medium pr-2">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
