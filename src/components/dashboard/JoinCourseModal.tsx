import React, { useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';

interface JoinCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinCourseModal: React.FC<JoinCourseModalProps> = ({ isOpen, onClose }) => {
  const { enrollInCourse, currentUser } = useAcuarelaStore();
  const { success, error } = useToast();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!code.trim()) {
      error('Por favor, ingresa el código de la materia.');
      return;
    }

    const result = enrollInCourse(currentUser.id, code.trim());
    if (result.success) {
      success('Te has inscrito en la materia correctamente.');
      setCode('');
      onClose();
    } else {
      error(result.error || 'No se pudo completar la inscripción.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inscribirse a Materia">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Código de Inscripción (6 caracteres)
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100 uppercase tracking-widest font-mono text-center text-lg"
            placeholder="AC-XXXX"
            maxLength={7} // AC-1234 represents 7 chars including hyphen
            required
          />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
          Pídele al docente de la materia el código de 6 caracteres (ejemplo: <code className="font-mono bg-purple-50 dark:bg-purple-950/20 px-1 py-0.5 rounded text-purple-600 dark:text-purple-300">AC-7741</code>) para poder acceder a los contenidos del curso.
        </p>

        <button
          type="submit"
          className="mt-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
        >
          Unirse a la Materia
        </button>
      </form>
    </Modal>
  );
};
