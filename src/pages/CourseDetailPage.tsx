import React, { useState } from 'react';
import { useAcuarelaStore } from '../store/useAcuarelaStore';
import { CourseHeader } from '../components/course/CourseHeader';
import { AnnouncementsTab } from '../components/course/AnnouncementsTab';
import { AssignmentsTab } from '../components/course/AssignmentsTab';
import { MaterialsTab } from '../components/course/MaterialsTab';
import { MembersTab } from '../components/course/MembersTab';
import { Megaphone, FileText, FileSpreadsheet, Users } from 'lucide-react';

interface CourseDetailPageProps {
  courseId: string;
}

type TabType = 'cartelera' | 'tareas' | 'materiales' | 'compañeros';

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId }) => {
  const { courses } = useAcuarelaStore();
  const [activeTab, setActiveTab] = useState<TabType>('cartelera');

  const course = courses.find((c) => c.id === courseId);
  if (!course) return <div className="text-center py-10">Materia no encontrada.</div>;

  const tabItems = [
    { id: 'cartelera', label: 'Cartelera', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'tareas', label: 'Tareas', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'materiales', label: 'Materiales', icon: <FileText className="w-4 h-4" /> },
    { id: 'compañeros', label: 'Compañeros', icon: <Users className="w-4 h-4" /> }
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tareas':
        return <AssignmentsTab courseId={courseId} />;
      case 'materiales':
        return <MaterialsTab courseId={courseId} />;
      case 'compañeros':
        return <MembersTab courseId={courseId} />;
      case 'cartelera':
      default:
        return <AnnouncementsTab courseId={courseId} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <CourseHeader course={course} />

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200/40 dark:border-slate-800/40 overflow-x-auto gap-2 pb-px scrollbar-none">
        {tabItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-sm font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Area Content */}
      <div className="py-2">
        {renderTabContent()}
      </div>
    </div>
  );
};
