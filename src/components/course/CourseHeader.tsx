import React from 'react';
import type { Course } from '../../types';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { ArrowLeft, Calendar } from 'lucide-react';

interface CourseHeaderProps {
  course: Course;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => {
  const { setCurrentView, users } = useAcuarelaStore();
  
  const teacher = users.find(u => u.id === course.teacherId);

  return (
    <div className="glass-panel relative bg-gradient-to-r from-purple-100/50 to-indigo-100/30 dark:from-purple-950/20 dark:to-indigo-950/10 border border-purple-500/10 rounded-3xl p-6 md:p-8 overflow-hidden">
      {/* Background watercolor glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-pink-400/20 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => setCurrentView({ type: 'dashboard' })}
        className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-slate-200 mb-4 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Volver al Tablero
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-xs font-bold uppercase tracking-wider bg-purple-600 text-white px-3 py-1 rounded-full shadow-sm">
              {course.code}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {course.schedule}
            </span>
          </div>

          <h1 className="font-display font-black text-2xl md:text-3xl text-gray-800 dark:text-slate-100 leading-snug">
            {course.name}
          </h1>

          <p className="text-sm text-gray-600 dark:text-slate-300 mt-2.5 max-w-3xl leading-relaxed">
            {course.description}
          </p>
        </div>

        {teacher && (
          <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-900/50 border border-gray-200/40 dark:border-slate-800/40 p-3 rounded-2xl shrink-0">
            <img 
              src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={teacher.name}
              className="w-10 h-10 rounded-full border border-purple-500/20 object-cover"
            />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">Docente</span>
              <span className="text-sm font-bold text-gray-800 dark:text-slate-100">{teacher.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
