import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Course, Enrollment, Announcement, Assignment, Submission, Material, UserRole, SubmissionStatus, AppView } from '../types';

export const ACUARELA_MOCK_USERS: User[] = [
  { id: "usr_prof_1", name: "Lic. Carmen Flores", email: "carmen.flores@acuarela.edu.bo", role: "PROFESOR_ADMIN", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: "usr_stud_1", name: "Alejandro Arce", email: "ale.arce@estudiantes.edu.bo", role: "ESTUDIANTE", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" }
];

export const ACUARELA_MOCK_COURSES: Course[] = [
  { id: "crs_1", name: "FZ_3A26_08:55A_SPS 1-2", code: "AC-7741", description: "Curso avanzado de desarrollo de interfaces interactivas.", schedule: "Lunes y Miércoles 08:55 AM", teacherId: "usr_prof_1" }
];

export const ACUARELA_MOCK_ENROLLMENTS: Enrollment[] = [
  { id: "enr_1", courseId: "crs_1", studentId: "usr_stud_1", enrollmentDate: new Date().toISOString() }
];

export const ACUARELA_MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann_1", courseId: "crs_1", content: "Carmen Flores publicó una nueva tarea: WB p.42. Por favor revisar los pendientes de la siguiente sesión.", createdAt: new Date().toISOString() }
];

export const ACUARELA_MOCK_ASSIGNMENTS: Assignment[] = [
  { id: "asg_1", courseId: "crs_1", title: "Workbook páginas 41 y 42", description: "Completar los ejercicios prácticos de la unidad 3 sobre layouts responsivos y subir la captura o el archivo PDF.", maxPoints: 100, dueDate: new Date(Date.now() + 86400000 * 2).toISOString() } // Vence en 2 días
];

export const ACUARELA_MOCK_MATERIALS: Material[] = [
  { id: "mat_1", courseId: "crs_1", title: "Carpeta de Materiales en Google Drive", url: "https://drive.google.com", type: "drive", createdAt: new Date().toISOString() },
  { id: "mat_2", courseId: "crs_1", title: "Video Introducción a React 19 y Tailwind v4", url: "https://youtube.com", type: "youtube", createdAt: new Date().toISOString() }
];

interface AcuarelaState {
  // Datos Globales
  currentUser: User | null;
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  announcements: Announcement[];
  assignments: Assignment[];
  submissions: Submission[];
  materials: Material[];

  // Acciones de Sesión y Simulación
  setCurrentUser: (user: User | null) => void;
  switchRoleSimulated: (role: UserRole) => void;

  // Acciones: Módulo 1 (Comunidades / Materias)
  createCourse: (courseData: Omit<Course, 'id' | 'code'>) => void;
  createMaterial: (courseId: string, title: string, url: string, type: 'link' | 'drive' | 'youtube') => void;
  
  // Acciones: Módulo 3 (Anuncios)
  createAnnouncement: (courseId: string, content: string) => void;

  // Acciones: Módulo 4 (Tareas y Entregas)
  createAssignment: (assignmentData: Omit<Assignment, 'id'>) => void;
  submitAssignment: (assignmentId: string, studentId: string, fileName: string, sizeBytes: number) => void;
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  
  // Inscripción por código
  enrollInCourse: (studentId: string, code: string) => { success: boolean; error?: string };

  // Navegación (Routing ligero)
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const useAcuarelaStore = create<AcuarelaState>()(
  persist(
    (set, get) => ({
      currentUser: ACUARELA_MOCK_USERS[0], // Iniciar con Carmen Flores por defecto
      users: ACUARELA_MOCK_USERS,
      courses: ACUARELA_MOCK_COURSES,
      enrollments: ACUARELA_MOCK_ENROLLMENTS,
      announcements: ACUARELA_MOCK_ANNOUNCEMENTS,
      assignments: ACUARELA_MOCK_ASSIGNMENTS,
      submissions: [],
      materials: ACUARELA_MOCK_MATERIALS,
      currentView: { type: 'dashboard' },

      setCurrentView: (view) => set({ currentView: view }),
      setCurrentUser: (user) => set({ currentUser: user }),
      
      switchRoleSimulated: (role) => set((state) => {
        if (!state.currentUser) return {};
        // Cambiar rol de Carmen o cambiar el usuario completo para mejor simulación
        const matchingUser = state.users.find(u => u.role === role);
        if (matchingUser) {
          return { currentUser: matchingUser };
        }
        return { currentUser: { ...state.currentUser, role } };
      }),

      createCourse: (courseData) => set((state) => {
        const newCourse: Course = {
          ...courseData,
          id: `crs_${Date.now()}`,
          code: `AC-${Math.floor(1000 + Math.random() * 9000)}`
        };
        return { courses: [...state.courses, newCourse] };
      }),

      createMaterial: (courseId, title, url, type) => set((state) => {
        const newMaterial: Material = {
          id: `mat_${Date.now()}`,
          courseId,
          title,
          url,
          type,
          createdAt: new Date().toISOString()
        };
        return { materials: [newMaterial, ...state.materials] };
      }),

      createAnnouncement: (courseId, content) => set((state) => {
        const newAnnouncement: Announcement = {
          id: `ann_${Date.now()}`,
          courseId,
          content,
          createdAt: new Date().toISOString()
        };
        return { announcements: [newAnnouncement, ...state.announcements] }; // El más reciente primero
      }),

      createAssignment: (assignmentData) => set((state) => {
        const newAssignment: Assignment = {
          ...assignmentData,
          id: `asg_${Date.now()}`
        };
        return { assignments: [...state.assignments, newAssignment] };
      }),

      submitAssignment: (assignmentId, studentId, fileName, sizeBytes) => set((state) => {
        const targetAssignment = state.assignments.find(a => a.id === assignmentId);
        if (!targetAssignment) return {};

        const now = new Date();
        const dueDate = new Date(targetAssignment.dueDate);
        const isLate = now > dueDate;
        const status: SubmissionStatus = isLate ? 'ENTREGADO_CON_RETRASO' : 'ENTREGADO_A_TIEMPO';

        const newSubmission: Submission = {
          id: `sub_${Date.now()}`,
          assignmentId,
          studentId,
          fileRef: {
            name: fileName,
            sizeBytes,
            extension: fileName.split('.').pop() || 'unknown'
          },
          submittedAt: now.toISOString(),
          status
        };

        // Eliminar entrega previa si existía para evitar duplicados
        const cleanSubmissions = state.submissions.filter(
          s => !(s.assignmentId === assignmentId && s.studentId === studentId)
        );

        return { submissions: [...cleanSubmissions, newSubmission] };
      }),

      gradeSubmission: (submissionId, grade, feedback) => set((state) => ({
        submissions: state.submissions.map((s) =>
          s.id === submissionId ? { ...s, grade, feedback, status: 'CALIFICADO' } : s
        )
      })),

      enrollInCourse: (studentId, code) => {
        const state = get();
        const course = state.courses.find(c => c.code.toLowerCase() === code.trim().toLowerCase());
        if (!course) {
          return { success: false, error: 'Código de inscripción no válido.' };
        }
        
        const alreadyEnrolled = state.enrollments.some(
          e => e.courseId === course.id && e.studentId === studentId
        );
        if (alreadyEnrolled) {
          return { success: false, error: 'Ya estás inscrito en esta materia.' };
        }

        const newEnrollment: Enrollment = {
          id: `enr_${Date.now()}`,
          courseId: course.id,
          studentId,
          enrollmentDate: new Date().toISOString()
        };

        set({ enrollments: [...state.enrollments, newEnrollment] });
        return { success: true };
      }
    }),
    {
      name: 'acuarela-lms-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
