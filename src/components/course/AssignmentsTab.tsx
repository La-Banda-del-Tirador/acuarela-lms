import React from 'react';
import { useAcuarelaStore } from '../../store/useAcuarelaStore';
import { StudentAssignments } from './StudentAssignments';
import { TeacherAssignments } from './TeacherAssignments';

interface AssignmentsTabProps {
  courseId: string;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ courseId }) => {
  const { currentUser } = useAcuarelaStore();

  if (!currentUser) return null;

  return currentUser.role === 'PROFESOR_ADMIN' ? (
    <TeacherAssignments courseId={courseId} />
  ) : (
    <StudentAssignments courseId={courseId} />
  );
};
