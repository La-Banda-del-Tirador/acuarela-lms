import React, { useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { useToast } from '../../hooks/useToast';
import { Megaphone, Send, Clock, User } from 'lucide-react';

interface AnnouncementsTabProps {
  courseId: string;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ courseId }) => {
  const { announcements, createAnnouncement, currentUser, users } = useAcuarelaStore();
  const { success, error } = useToast();
  const [content, setContent] = useState('');

  if (!currentUser) return null;

  const isTeacher = currentUser.role === 'PROFESOR_ADMIN';
  
  // Filtrar anuncios por materia y ordenar de forma descendente (el más reciente primero)
  const courseAnnouncements = announcements
    .filter((a) => a.courseId === courseId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      error('El contenido del anuncio no puede estar vacío.');
      return;
    }
    
    createAnnouncement(courseId, content.trim());
    success('Anuncio publicado en la cartelera virtual.');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Compose Announcement (Teacher Only) */}
      {isTeacher && (
        <form onSubmit={handlePost} className="glass-panel border-purple-500/10 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex gap-2 items-center text-sm font-bold text-purple-600 dark:text-purple-400">
            <Megaphone className="w-4 h-4 text-purple-500 animate-pulse" />
            Publicar Aviso Importante
          </div>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe un anuncio para la clase..."
              className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100 resize-none pr-12"
              required
            />
            <button
              type="submit"
              className="absolute right-3 bottom-3 p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-md hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Announcements Muro */}
      <div className="space-y-4">
        {courseAnnouncements.length > 0 ? (
          courseAnnouncements.map((ann) => {
            const author = users.find((u) => u.role === 'PROFESOR_ADMIN'); // En el mock, es el profesor
            return (
              <div 
                key={ann.id} 
                className="glass-panel border-gray-200/40 dark:border-slate-800/40 rounded-2xl p-5 hover:bg-white/90 dark:hover:bg-slate-900/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={author?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                      alt={author?.name}
                      className="w-8 h-8 rounded-full border border-purple-500/20 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 dark:text-slate-200 leading-tight">
                        {author?.name || 'Docente'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Docente</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(ann.createdAt).toLocaleDateString('es-ES', { 
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-1">
                  {ann.content}
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No hay avisos publicados en este curso.
          </div>
        )}
      </div>
    </div>
  );
};
