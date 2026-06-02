export type UserRole = 'PROFESOR_ADMIN' | 'ESTUDIANTE';
export type SubmissionStatus = 'PENDIENTE' | 'ENTREGADO_A_TIEMPO' | 'ENTREGADO_CON_RETRASO' | 'CALIFICADO';

export interface User {
  id: string; // UUID o string único
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string; // Código autogenerado para inscripción (ej: AC-4892)
  description: string;
  schedule: string; // Horario de la materia
  teacherId: string; // Relación con User (Role: PROFESOR_ADMIN)
}

export interface Enrollment {
  id: string;
  courseId: string; // Relación con Course
  studentId: string; // Relación con User (Role: ESTUDIANTE)
  enrollmentDate: string;
}

export interface Announcement {
  id: string;
  courseId: string; // Relación con Course
  content: string;
  createdAt: string; // Orden cronológico inverso para vigencia
}

export interface Assignment {
  id: string;
  courseId: string; // Relación con Course
  title: string;
  description: string;
  maxPoints: number;
  dueDate: string; // ISO String (Fecha y hora límite de entrega)
}

export interface Submission {
  id: string;
  assignmentId: string; // Relación con Assignment
  studentId: string; // Relación con User (Role: ESTUDIANTE)
  fileRef: {
    name: string; // Ej: "Tarea_Matematicas.pdf"
    sizeBytes: number;
    extension: string; // pdf, docx, png, zip, etc.
  };
  grade?: number; // Nota asignada por el profesor
  feedback?: string; // Comentario privado del docente
  submittedAt?: string; // ISO String de la fecha de entrega real
  status: SubmissionStatus;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  url: string;
  type: 'link' | 'drive' | 'youtube';
  createdAt: string;
}

export type AppView = 
  | { type: 'dashboard' }
  | { type: 'pending' }
  | { type: 'course'; courseId: string };

