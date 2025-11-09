export const dashboardConfig = {
  admin: [
    { id: 'user_management', title: 'User Management', icon: '👥', path: '/dashboard/admin?view=user_management' },
    { id: 'class_management', title: 'Class Setup', icon: '🏫', path: '/dashboard/admin?view=class_management' },
    { id: 'subject_management', title: 'Subject Setup', icon: '📚', path: '/dashboard/admin?view=subject_management' },
    { id: 'role_assignment', title: 'Role Assignment', icon: '🎯', path: '/dashboard/admin?view=role_assignment' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  'vice principal admin': [
    { id: 'form_master_assignment', title: 'Assign Form Masters to Classes', icon: '👨‍🏫', path: '/dashboard/vice-principal-admin?view=form_master_assignment' },
    { id: 'subject_assignments', title: 'Assign Teachers to Subjects & Classes', icon: '📋', path: '/dashboard/vice-principal-admin?view=subject_assignments' },
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  'vice principal academic': [
    { id: 'academic_records', title: 'Academic Records', icon: '📊', path: '/dashboard/vice-principal-academic?view=academic_records' },
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  principal: [
    { id: 'teacher_directory', title: 'Teacher Directory', icon: '👥', path: '/dashboard/principal?view=teacher_directory' },
    { id: 'class_lists', title: 'View Class Lists', icon: '📋', path: '/dashboard/principal?view=class_lists' },
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  'senior master': [
    { id: 'duty_roster', title: 'Duty Roster Generator', icon: '⭐', path: '/dashboard/senior-master?view=duty_roster' },
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  'exam officer': [
    { id: 'print_reports', title: 'Print Reports', icon: '🖨️', path: '/dashboard/exam-officer?view=print_reports' },
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  'form master': [
    { id: 'add_students', title: 'Add Students to Class', icon: '🎓', path: '/dashboard/form-master?view=add_students' },
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ],
  teacher: [
    { id: 'score_entry', title: 'Score Entry', icon: '📊', path: '/dashboard/score-center' },
    { id: 'exambank', title: 'Exam Bank', icon: '📝', path: '/dashboard/exambank' }
  ]
};

export const getDashboardConfig = (role) => {
  return dashboardConfig[role] || [];
};
