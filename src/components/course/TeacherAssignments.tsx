import React, { useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { CreateAssignmentModal } from '../assignment/CreateAssignmentModal';
import { GradeSubmissionModal } from '../assignment/GradeSubmissionModal';
import { Calendar, FileText, CheckCircle2, AlertCircle, Plus, FileSpreadsheet } from 'lucide-react';
import type { Assignment, Submission } from '../../types';

interface TeacherAssignmentsProps {
  courseId: string;
}

export const TeacherAssignments: React.FC<TeacherAssignmentsProps> = ({ courseId }) => {
  const { assignments, submissions, enrollments, users } = useAcuarelaStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<Submission | null>(null);
  const [activeAsgPoints, setActiveAsgPoints] = useState(100);

  const courseAssignments = assignments.filter((a) => a.courseId === courseId);
  const studentsEnrolled = users.filter((u) => 
    u.role === 'ESTUDIANTE' && enrollments.some((e) => e.courseId === courseId && e.studentId === u.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-purple-500" />
          Tareas Asignadas
        </h3>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Crear Tarea
        </button>
      </div>

      <div className="space-y-6">
        {courseAssignments.length > 0 ? (
          courseAssignments.map((asg) => (
            <div key={asg.id} className="glass-panel border-gray-200/40 dark:border-slate-800/40 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h4 className="font-bold text-base text-gray-800 dark:text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" /> {asg.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Límite: {new Date(asg.dueDate).toLocaleDateString('es-ES', { 
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-500/10 rounded-full shrink-0">
                  Máximo: {asg.maxPoints} pts
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">{asg.description}</p>

              {/* Submissions list for this assignment */}
              <div className="border-t border-gray-200/20 dark:border-slate-800/20 pt-3 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 pl-1">Entregas de Alumnos</span>
                {studentsEnrolled.map((student) => {
                  const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === student.id);
                  return (
                    <div key={student.id} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/40 dark:bg-slate-900/20 border border-gray-200/30 dark:border-slate-800/30 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <img src={student.avatarUrl} alt={student.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold text-gray-700 dark:text-slate-300">{student.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {sub ? (
                          <>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              sub.status === 'CALIFICADO'
                                ? 'bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'
                                : sub.status === 'ENTREGADO_CON_RETRASO'
                                  ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                                  : 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600'
                            }`}>
                              {sub.status === 'CALIFICADO' 
                                ? `Nota: ${sub.grade}/${asg.maxPoints}` 
                                : sub.status === 'ENTREGADO_CON_RETRASO' 
                                  ? 'Retrasado' 
                                  : 'A tiempo'}
                            </span>
                            <button
                              onClick={() => {
                                setActiveSub(sub);
                                setActiveAsgPoints(asg.maxPoints);
                              }}
                              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold cursor-pointer"
                            >
                              {sub.status === 'CALIFICADO' ? 'Editar' : 'Calificar'}
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-gray-300" /> Sin entregar
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">No hay tareas creadas para esta materia.</div>
        )}
      </div>

      <CreateAssignmentModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} courseId={courseId} />
      {activeSub && (
        <GradeSubmissionModal 
          isOpen={!!activeSub} 
          onClose={() => setActiveSub(null)} 
          submission={activeSub} 
          maxPoints={activeAsgPoints} 
        />
      )}
    </div>
  );
};
