import React, { useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';
import { File, Check } from 'lucide-react';
import type { Submission } from '../../types';

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission;
  maxPoints: number;
}

export const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({ 
  isOpen, onClose, submission, maxPoints 
}) => {
  const { gradeSubmission, users } = useAcuarelaStore();
  const { success, error } = useToast();
  const [grade, setGrade] = useState<number>(submission.grade ?? maxPoints);
  const [feedback, setFeedback] = useState<string>(submission.feedback ?? '');

  const student = users.find(u => u.id === submission.studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (grade < 0 || grade > maxPoints) {
      error(`La calificación debe estar entre 0 y ${maxPoints} puntos.`);
      return;
    }

    gradeSubmission(submission.id, grade, feedback.trim());
    success('Entrega calificada exitosamente.');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Calificar entrega: ${student?.name || 'Estudiante'}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        {/* File Metadatos */}
        <div className="bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/10 rounded-2xl p-4 flex items-center gap-3">
          <File className="w-8 h-8 text-purple-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 dark:text-slate-100 truncate">
              {submission.fileRef.name}
            </p>
            <p className="text-xs text-gray-400">
              Tamaño: {(submission.fileRef.sizeBytes / (1024 * 1024)).toFixed(2)} MB | Ext: .{submission.fileRef.extension}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Nota Numérica (Máx: {maxPoints})
            </label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              max={maxPoints}
              min={0}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100"
              required
            />
          </div>
          <div className="text-xs text-gray-400 pb-3">
            Puntos sobre {maxPoints}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Retroalimentación Privada
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100 h-24 resize-none"
            placeholder="Escribe comentarios de retroalimentación para el alumno..."
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          Guardar Calificación
        </button>
      </form>
    </Modal>
  );
};
