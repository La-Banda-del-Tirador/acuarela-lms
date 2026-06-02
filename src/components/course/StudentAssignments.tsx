import React, { useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { SubmitAssignmentModal } from '../assignment/SubmitAssignmentModal';
import { Calendar, FileText, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import type { Assignment, Submission } from '../../types';

interface StudentAssignmentsProps {
  courseId: string;
}

export const StudentAssignments: React.FC<StudentAssignmentsProps> = ({ courseId }) => {
  const { assignments, submissions, currentUser } = useAcuarelaStore();
  const [activeAsgId, setActiveAsgId] = useState<string | null>(null);

  if (!currentUser) return null;

  const courseAssignments = assignments.filter((a) => a.courseId === courseId);

  const getStatusBadge = (asg: Assignment, sub?: Submission) => {
    if (!sub) {
      const isOverdue = new Date() > new Date(asg.dueDate);
      return (
        <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border ${
          isOverdue 
            ? 'bg-rose-50 border-rose-500/10 text-rose-500 dark:bg-rose-950/20' 
            : 'bg-amber-50 border-amber-500/10 text-amber-500 dark:bg-amber-950/20'
        }`}>
          <AlertCircle className="w-3.5 h-3.5" />
          {isOverdue ? 'Atrasado' : 'Pendiente'}
        </span>
      );
    }

    if (sub.status === 'CALIFICADO') {
      return (
        <span className="text-xs font-bold bg-purple-50 border border-purple-500/10 text-purple-500 dark:bg-purple-950/20 px-3 py-1 rounded-full flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          Calificado: {sub.grade} / {asg.maxPoints}
        </span>
      );
    }

    const isLate = sub.status === 'ENTREGADO_CON_RETRASO';
    return (
      <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border ${
        isLate 
          ? 'bg-orange-50 border-orange-500/10 text-orange-500 dark:bg-orange-950/20' 
          : 'bg-emerald-50 border-emerald-500/10 text-emerald-500 dark:bg-emerald-950/20'
      }`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        {isLate ? 'Entregado con retraso' : 'Entregado'}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {courseAssignments.length > 0 ? (
        courseAssignments.map((asg) => {
          const submission = submissions.find(
            (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
          );
          return (
            <div key={asg.id} className="glass-panel border-gray-200/40 dark:border-slate-800/40 rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-gray-800 dark:text-slate-200">{asg.title}</h3>
                </div>
                {getStatusBadge(asg, submission)}
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 pl-7 leading-relaxed">{asg.description}</p>
              <div className="flex flex-wrap justify-between items-center gap-3 pt-2 pl-7 border-t border-gray-200/10 dark:border-slate-800/10">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Límite: {new Date(asg.dueDate).toLocaleDateString('es-ES', { 
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
                {!submission && (
                  <button
                    onClick={() => setActiveAsgId(asg.id)}
                    className="px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Subir Tarea
                  </button>
                )}
              </div>
              {submission?.feedback && (
                <div className="mt-3 pl-7 p-3 bg-purple-500/5 rounded-xl border border-purple-500/5 text-xs text-purple-600 dark:text-purple-300">
                  <strong>Retroalimentación:</strong> {submission.feedback}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">No hay tareas creadas para este curso.</div>
      )}
      {activeAsgId && (
        <SubmitAssignmentModal
          isOpen={!!activeAsgId}
          onClose={() => setActiveAsgId(null)}
          assignmentId={activeAsgId}
        />
      )}
    </div>
  );
};
