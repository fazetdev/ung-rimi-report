export const dashboardConfig = {
  admin: [
    { id: 'user_management', title: 'User Management', icon: '👥', path: '/dashboard/admin?view=user_management' },
    { id: 'class_management', title: 'Class Setup', icon: '🏫', path: '/dashboard/admin?view=class_management' },
    { id: 'subject_management', title: 'Subject Setup', icon: '📚', path: '/dashboard/admin?view=subject_management' },
    { id: 'role_assignment', title: 'Role Assignment', icon: '🎯', path: '/dashboard/admin?view=role_assignment' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  vp_admin: [
    { id: 'form_master_assignment', title: 'Assign Form Masters', icon: '👨‍🏫', path: '/dashboard/vp-admin?view=form_master_assignment' },
    { id: 'subject_assignments', title: 'Assign Teacher Subjects', icon: '📋', path: '/dashboard/vp-admin?view=subject_assignments' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  vp_academic: [
    { id: 'academic_oversight', title: 'Academic Oversight', icon: '📊', path: '/dashboard/vp-academic?view=academic_oversight' },
    { id: 'curriculum_management', title: 'Curriculum Management', icon: '📖', path: '/dashboard/vp-academic?view=curriculum_management' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  principal: [
    { id: 'teacher_directory', title: 'Teacher Directory', icon: '👥', path: '/dashboard/principal?view=teacher_directory' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  senior_master: [
    { id: 'duty_master', title: 'Duty Master', icon: '⭐', path: '/dashboard/senior-master?view=duty_master' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' },
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' }
  ],
  exam_officer: [
    { id: 'bulk_reports', title: 'Bulk Reports', icon: '🖨️', path: '/dashboard/bulk-reports' },
    { id: 'report_cards', title: 'Report Cards', icon: '📄', path: '/dashboard/exam-officer/report-cards' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  form_master: [
    { id: 'student_enrollment', title: 'Add Students', icon: '🎓', path: '/dashboard/form-master?view=student_enrollment' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  teacher: [
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ]
};

// Helper function to get dashboard config for a role
export const getDashboardConfig = (role) => {
  return dashboardConfig[role] || [];
};
