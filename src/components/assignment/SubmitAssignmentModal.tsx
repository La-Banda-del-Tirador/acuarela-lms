import React, { useState, useRef } from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';
import { UploadCloud, File } from 'lucide-react';

interface SubmitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
}

export const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({ isOpen, onClose, assignmentId }) => {
  const { submitAssignment, currentUser } = useAcuarelaStore();
  const { success, error } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

  const validateAndSelectFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      error("El archivo excede el límite máximo de 20MB configurado para la infraestructura de servidores");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    submitAssignment(assignmentId, currentUser.id, selectedFile.name, selectedFile.size);
    success('Tarea entregada exitosamente.');
    setSelectedFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entregar Evidencia">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            dragActive 
              ? 'border-purple-500 bg-purple-500/10' 
              : selectedFile 
                ? 'border-emerald-500/50 bg-emerald-500/5' 
                : 'border-gray-300/40 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />
          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <File className="w-12 h-12 text-emerald-500" />
              <span className="text-sm font-bold text-gray-800 dark:text-slate-200 line-clamp-1">
                {selectedFile.name}
              </span>
              <span className="text-xs text-gray-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
              <UploadCloud className="w-12 h-12 text-purple-500/70" />
              <span className="text-sm font-bold">Arrastra tu archivo aquí o haz clic para buscar</span>
              <span className="text-xs text-gray-400">Límite de tamaño: 20MB</span>
            </div>
          )}
        </div>

        {selectedFile && (
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 cursor-pointer"
          >
            Confirmar Entrega
          </button>
        )}
      </form>
    </Modal>
  );
};
