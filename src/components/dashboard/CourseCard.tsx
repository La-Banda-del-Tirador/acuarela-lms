import React from 'react';
import type { Course } from '../../types';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { Calendar, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { setCurrentView, users } = useAcuarelaStore();
  
  const teacher = users.find(u => u.id === course.teacherId);

  // Generar gradientes aleatorios fijos por ID para darle estética "acuarela"
  const getGradient = (id: string) => {
    const gradients = [
      'from-pink-400/20 to-purple-400/20 dark:from-pink-900/30 dark:to-purple-900/30 border-pink-500/20',
      'from-purple-400/20 to-indigo-400/20 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-500/20',
      'from-blue-400/20 to-teal-400/20 dark:from-blue-900/30 dark:to-teal-900/30 border-blue-500/20',
      'from-rose-400/20 to-orange-400/20 dark:from-rose-900/30 dark:to-orange-900/30 border-rose-500/20'
    ];
    const index = id.charCodeAt(id.length - 1) % gradients.length;
    return gradients[index];
  };

  return (
    <div 
      className={`glass-panel bg-gradient-to-br ${getGradient(course.id)} border rounded-3xl p-6 flex flex-col justify-between h-64 glass-card-hover`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider bg-white/60 dark:bg-slate-950/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-500/10">
            {course.code}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {course.schedule}
          </span>
        </div>

        <h3 className="font-display font-bold text-lg text-gray-800 dark:text-slate-100 line-clamp-2 leading-snug">
          {course.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4 border-t border-gray-200/20 dark:border-slate-800/20 pt-4">
        {teacher && (
          <div className="flex items-center gap-2">
            <img 
              src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={teacher.name}
              className="w-6 h-6 rounded-full border border-white dark:border-slate-800 object-cover"
            />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 line-clamp-1">
              {teacher.name}
            </span>
          </div>
        )}
        
        <button
          onClick={() => setCurrentView({ type: 'course', courseId: course.id })}
          className="flex items-center gap-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 group cursor-pointer"
        >
          Ver Aula
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
