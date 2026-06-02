import React, { useState } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { useToast } from '../../hooks/useToast';
import { ExternalLink, HardDrive, Video, Link as LinkIcon, Plus, FileText } from 'lucide-react';

interface MaterialsTabProps {
  courseId: string;
}

export const MaterialsTab: React.FC<MaterialsTabProps> = ({ courseId }) => {
  const { materials, createMaterial, currentUser } = useAcuarelaStore();
  const { success, error } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'link' | 'drive' | 'youtube'>('link');

  if (!currentUser) return null;
  const isTeacher = currentUser.role === 'PROFESOR_ADMIN';

  const courseMaterials = materials.filter((m) => m.courseId === courseId);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      error('Por favor complete todos los campos.');
      return;
    }
    createMaterial(courseId, title.trim(), url.trim(), type);
    success('Material publicado correctamente.');
    setTitle('');
    setUrl('');
    setType('link');
    setShowAddForm(false);
  };

  const getIcon = (matType: typeof type) => {
    switch (matType) {
      case 'drive': return <HardDrive className="w-5 h-5 text-emerald-500" />;
      case 'youtube': return <Video className="w-5 h-5 text-rose-500" />;
      default: return <LinkIcon className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Compose header / Add button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" />
          Recursos de Aprendizaje
        </h2>
        {isTeacher && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Compartir Enlace
          </button>
        )}
      </div>

      {/* Add form */}
      {isTeacher && showAddForm && (
        <form onSubmit={handleAdd} className="glass-panel border-purple-500/10 rounded-2xl p-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Título del recurso..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100"
              required
            />
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100"
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/20 text-gray-800 dark:text-slate-100 cursor-pointer"
            >
              <option value="link">Enlace General</option>
              <option value="drive">Google Drive</option>
              <option value="youtube">Video de YouTube</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            >
              Publicar
            </button>
          </div>
        </form>
      )}

      {/* Materials List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courseMaterials.length > 0 ? (
          courseMaterials.map((mat) => (
            <a
              key={mat.id}
              href={mat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel border-gray-200/40 dark:border-slate-800/40 rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-white dark:hover:bg-slate-900/50 glass-card-hover group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-850/50 shrink-0">
                  {getIcon(mat.type)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 dark:text-slate-200 line-clamp-1">
                    {mat.title}
                  </span>
                  <span className="text-[10px] text-gray-400 capitalize">
                    {mat.type === 'link' ? 'enlace web' : mat.type}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </a>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 sm:col-span-2">
            No hay recursos o enlaces publicados en esta materia.
          </div>
        )}
      </div>
    </div>
  );
};
