// Simplified function menus for report-focused system
export const functionMenus = {
  user_management: {
    title: 'User Management',
    description: 'Register users and assign roles',
    component: 'UserManagementPanel'
  },
  class_management: {
    title: 'Class Management', 
    description: 'Create and manage classes',
    component: 'ClassManager'
  },
  subject_management: {
    title: 'Subject Management',
    description: 'Create and manage subjects', 
    component: 'SubjectManager'
  },
  form_master_assignment: {
    title: 'Assign Form Masters',
    description: 'Assign form masters to classes',
    component: 'FormMasterAssignment'
  },
  subject_assignments: {
    title: 'Assign Teacher Subjects',
    description: 'Assign subjects to teachers',
    component: 'SubjectAssignments'  
  },
  teacher_directory: {
    title: 'Teacher Directory',
    description: 'View all teachers and their assignments',
    component: 'TeacherDirectory'
  },
  duty_master: {
    title: 'Duty Master',
    description: 'Manage school duties',
    component: 'DutyMaster'
  },
  student_enrollment: {
    title: 'Student Enrollment',
    description: 'Add students to your class',
    component: 'StudentEnrollment'
  },
  score_entry: {
    title: 'Score Entry',
    description: 'Enter scores for your subjects',
    component: 'ScoreEntry'
  },
  bulk_reports: {
    title: 'Bulk Reports',
    description: 'Generate reports in bulk',
    component: 'BulkReportCenter'
  },
  report_cards: {
    title: 'Report Cards', 
    description: 'Generate individual report cards',
    component: 'ReportCardDashboard'
  },
  exambank: {
    title: 'Exam Bank',
    description: 'Access examination materials',
    component: 'ExamBank'
  }
};
