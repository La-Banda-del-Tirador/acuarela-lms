import React, { useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose }) => {
  const { createCourse, currentUser } = useAcuarelaStore();
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!name.trim() || !description.trim() || !schedule.trim()) {
      error('Por favor, rellene todos los campos.');
      return;
    }

    createCourse({
      name: name.trim(),
      description: description.trim(),
      schedule: schedule.trim(),
      teacherId: currentUser.id
    });

    success('Materia creada exitosamente.');
    setName('');
    setDescription('');
    setSchedule('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Materia">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Nombre de la Materia
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100"
            placeholder="Ej: Fisiología Humana, Álgebra Lineal"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Horario
          </label>
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100"
            placeholder="Ej: Lunes y Miércoles 08:55 AM"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Descripción de la Materia
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100 h-24 resize-none"
            placeholder="Detalles sobre el contenido del curso..."
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
        >
          Crear Materia
        </button>
      </form>
    </Modal>
  );
};
