import React from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { useToast } from '../../hooks/useToast';
import { UserCheck, Shuffle } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRoleSimulated } = useAcuarelaStore();
  const { success } = useToast();

  if (!currentUser) return null;

  const handleToggleRole = () => {
    const nextRole = currentUser.role === 'PROFESOR_ADMIN' ? 'ESTUDIANTE' : 'PROFESOR_ADMIN';
    switchRoleSimulated(nextRole);
    success(`Rol cambiado a: ${nextRole === 'PROFESOR_ADMIN' ? 'Profesor' : 'Estudiante'}`);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <div className="glass-panel bg-white/70 dark:bg-slate-900/70 border border-purple-500/20 rounded-2xl p-3 shadow-xl flex items-center gap-3">
        <div className="relative">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full border-2 border-purple-500/40 object-cover"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
            currentUser.role === 'PROFESOR_ADMIN' ? 'bg-rose-500' : 'bg-emerald-500'
          }`} />
        </div>
        
        <div className="flex flex-col pr-1">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Simulación Activa</span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">{currentUser.name}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
            currentUser.role === 'PROFESOR_ADMIN' ? 'text-rose-500' : 'text-emerald-500'
          }`}>
            {currentUser.role === 'PROFESOR_ADMIN' ? 'Docente' : 'Estudiante'}
          </span>
        </div>

        <button
          onClick={handleToggleRole}
          className="p-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-purple-500/20 transition-all duration-300"
          title="Cambiar de Rol Simulado"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
