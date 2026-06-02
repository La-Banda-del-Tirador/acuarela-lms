import React, { useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ isOpen, onClose, courseId }) => {
  const { createAssignment } = useAcuarelaStore();
  const { success, error } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxPoints, setMaxPoints] = useState(100);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !dueDate) {
      error('Por favor complete todos los campos.');
      return;
    }
    if (maxPoints <= 0) {
      error('El puntaje máximo debe ser mayor a 0.');
      return;
    }

    createAssignment({
      courseId,
      title: title.trim(),
      description: description.trim(),
      maxPoints,
      dueDate: new Date(dueDate).toISOString()
    });

    success('Tarea creada exitosamente.');
    setTitle('');
    setDescription('');
    setMaxPoints(100);
    setDueDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Tarea">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Título de la Tarea
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100"
            placeholder="Ej: Análisis del Layout en Dispositivos"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Instrucciones / Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100 h-20 resize-none"
            placeholder="Describe las instrucciones paso a paso..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Puntos Máximos
            </label>
            <input
              type="number"
              value={maxPoints}
              onChange={(e) => setMaxPoints(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Fecha Límite
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100 cursor-pointer"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
        >
          Crear Tarea
        </button>
      </form>
    </Modal>
  );
};
