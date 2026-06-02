import React from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { ShieldCheck, GraduationCap } from 'lucide-react';

interface MembersTabProps {
  courseId: string;
}

export const MembersTab: React.FC<MembersTabProps> = ({ courseId }) => {
  const { courses, enrollments, users } = useAcuarelaStore();

  const course = courses.find((c) => c.id === courseId);
  if (!course) return <div className="text-center py-6 text-gray-500">Curso no encontrado.</div>;

  const teacher = users.find((u) => u.id === course.teacherId);
  
  // Obtener estudiantes inscritos
  const courseEnrollments = enrollments.filter((e) => e.courseId === courseId);
  const enrolledStudents = users
    .filter((u) => u.role === 'ESTUDIANTE' && courseEnrollments.some((e) => e.studentId === u.id))
    // Ordenar alfabéticamente
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      {/* Docente / Administrador */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 pl-1">
          Docente Asignado
        </h3>
        {teacher ? (
          <div className="glass-panel border-purple-500/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                alt={teacher.name}
                className="w-10 h-10 rounded-full border border-purple-500/20 object-cover"
              />
              <div>
                <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                  {teacher.name}
                </span>
                <p className="text-[10px] text-gray-400 font-semibold">{teacher.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-3 py-1 rounded-full border border-rose-500/10 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              Titular
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 pl-1">Profesor no asignado.</div>
        )}
      </div>

      {/* Compañeros de Clase */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 pl-1">
          Compañeros de Clase ({enrolledStudents.length})
        </h3>
        
        {enrolledStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrolledStudents.map((stud) => (
              <div 
                key={stud.id} 
                className="glass-panel border-gray-200/40 dark:border-slate-800/40 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={stud.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                    alt={stud.name}
                    className="w-9 h-9 rounded-full border border-purple-500/10 object-cover"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                      {stud.name}
                    </span>
                    <p className="text-[10px] text-gray-400 font-semibold">{stud.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-500/10 shrink-0 uppercase">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Alumno
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 glass-panel border-dashed border-gray-300/40 dark:border-slate-800/40 rounded-2xl text-gray-500 dark:text-gray-400 text-sm">
            No hay estudiantes inscritos en esta materia aún.
          </div>
        )}
      </div>
    </div>
  );
};
