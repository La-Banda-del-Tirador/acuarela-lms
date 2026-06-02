import React from 'react';
import { useAcuarelaStore } from './store/useAcuarelaStore';
import { Navbar } from './components/layout/Navbar';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { ToastContainer } from './components/ui/ToastContainer';
import { DashboardPage } from './pages/DashboardPage';
import { PendingAssignmentsPage } from './pages/PendingAssignmentsPage';
import { CourseDetailPage } from './pages/CourseDetailPage';

function App() {
  const { currentView } = useAcuarelaStore();

  const renderContent = () => {
    switch (currentView.type) {
      case 'pending':
        return <PendingAssignmentsPage />;
      case 'course':
        return <CourseDetailPage courseId={currentView.courseId} />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Watercolor fluids blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="watercolor-blob w-[500px] h-[500px] -top-40 -left-40 bg-[var(--watercolor-1)]" />
        <div className="watercolor-blob w-[450px] h-[450px] top-1/4 -right-40 bg-[var(--watercolor-2)]" style={{ animationDelay: '-7s' }} />
        <div className="watercolor-blob w-[400px] h-[400px] -bottom-40 left-1/4 bg-[var(--watercolor-4)]" style={{ animationDelay: '-14s' }} />
      </div>

      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {renderContent()}
      </main>

      <RoleSwitcher />
      <ToastContainer />
    </div>
  );
}

export default App;
