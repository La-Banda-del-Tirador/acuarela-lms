import React, { useState } from 'react';
import { useAcuarelaStore } from '../store/useAcuarelaStore';
import { CourseCard } from '../components/dashboard/CourseCard';
import { CreateCourseModal } from '../components/dashboard/CreateCourseModal';
import { JoinCourseModal } from '../components/dashboard/JoinCourseModal';
import { Plus, UserPlus, BookOpen } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser, courses, enrollments } = useAcuarelaStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  if (!currentUser) return null;

  const isTeacher = currentUser.role === 'PROFESOR_ADMIN';

  // Filtrar los cursos basados en el rol del usuario
  const filteredCourses = isTeacher
    ? courses.filter((c) => c.teacherId === currentUser.id)
    : courses.filter((c) =>
        enrollments.some((e) => e.courseId === c.id && e.studentId === currentUser.id)
      );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight bg-gradient-to-r from-gray-800 to-gray-500 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Tus Materias
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isTeacher 
              ? 'Administra las clases que impartes y revisa el progreso de tus alumnos.' 
              : 'Accede a tus salones de clase virtuales, tareas pendientes y contenidos de estudio.'}
          </p>
        </div>

        <div>
          {isTeacher ? (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nueva Materia
            </button>
          ) : (
            <button
              onClick={() => setIsJoinOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-md hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Inscribirse a Materia
            </button>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="glass-panel border-dashed border-2 border-gray-300/40 dark:border-slate-800/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500 dark:text-purple-400 mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-gray-800 dark:text-slate-200">No hay materias registradas</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
            {isTeacher 
              ? 'Haz clic en el botón de arriba para crear tu primer salón de clases virtual.' 
              : 'Aún no te has inscrito en ninguna materia. Usa el código proporcionado por tu profesor.'}
          </p>
        </div>
      )}

      {/* Modals */}
      <CreateCourseModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <JoinCourseModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
    </div>
  );
};
