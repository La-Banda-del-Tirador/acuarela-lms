import React, { useState } from 'react';
import { useAcuarelaStore } from '../store/useAcuarelaStore';
import { SubmitAssignmentModal } from '../components/assignment/SubmitAssignmentModal';
import { Clock, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Assignment } from '../types';

export const PendingAssignmentsPage: React.FC = () => {
  const { assignments, submissions, enrollments, courses, currentUser, setCurrentView } = useAcuarelaStore();
  const [activeAsgId, setActiveAsgId] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== 'ESTUDIANTE') return null;

  // Cursos inscritos por el alumno
  const enrolledCourseIds = enrollments
    .filter((e) => e.studentId === currentUser.id)
    .map((e) => e.courseId);

  const studentCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  // Tareas de los cursos inscritos
  const allStudentAssignments = assignments.filter((a) => enrolledCourseIds.includes(a.courseId));

  // Separar pendientes de completadas
  const pendingAssignments = allStudentAssignments
    .filter((asg) => !submissions.some((s) => s.assignmentId === asg.id && s.studentId === currentUser.id))
    // Ordenadas por fecha de vencimiento más cercana
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const completedAssignments = allStudentAssignments.filter((asg) =>
    submissions.some((s) => s.assignmentId === asg.id && s.studentId === currentUser.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-3xl tracking-tight bg-gradient-to-r from-gray-800 to-gray-500 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
          <Clock className="w-8 h-8 text-purple-500" />
          Mis Pendientes
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Revisa las tareas por entregar ordenadas por su fecha de vencimiento más urgente.
        </p>
      </div>

      {/* Sección Pendientes */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-purple-600 pl-1">
          Por Entregar ({pendingAssignments.length})
        </h2>
        {pendingAssignments.length > 0 ? (
          pendingAssignments.map((asg) => {
            const course = studentCourses.find((c) => c.id === asg.courseId);
            const isOverdue = new Date() > new Date(asg.dueDate);
            return (
              <div 
                key={asg.id} 
                className={`glass-panel rounded-2xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                  isOverdue ? 'border-rose-500/20 bg-rose-500/5' : 'border-gray-200/40 dark:border-slate-800/40'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wide">
                    {course?.name}
                  </span>
                  <h3 className="font-bold text-sm text-gray-800 dark:text-slate-200">{asg.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Límite: {new Date(asg.dueDate).toLocaleDateString('es-ES', { 
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                    {isOverdue && <span className="text-rose-500 font-bold ml-1">(Fuera de fecha)</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentView({ type: 'course', courseId: asg.courseId })}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 flex items-center gap-0.5 cursor-pointer"
                  >
                    Ver Aula <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => setActiveAsgId(asg.id)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Entregar
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-panel border-dashed border-2 border-gray-300/40 dark:border-slate-800/40 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            ¡Excelente! No tienes tareas pendientes.
          </div>
        )}
      </div>

      {/* Sección Completadas */}
      {completedAssignments.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 pl-1">
            Entregadas ({completedAssignments.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAssignments.map((asg) => {
              const course = studentCourses.find((c) => c.id === asg.courseId);
              return (
                <div 
                  key={asg.id} 
                  className="glass-panel border-emerald-500/10 bg-emerald-500/[0.02] rounded-2xl p-4 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{course?.name}</span>
                    <h4 className="font-bold text-gray-800 dark:text-slate-200 line-clamp-1">{asg.title}</h4>
                  </div>
                  <span className="flex items-center gap-1 font-bold text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" /> Entregado
                  </span>
                </div>
              );
            })}
          </div>
        </div>
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
