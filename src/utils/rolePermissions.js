// Simplified role permissions - Report Focused System
export const rolePermissions = {
  admin: [
    'user_management', 'class_management', 'subject_management', 
    'role_assignment', 'system_settings', 'exambank'
  ],
  vp_admin: [
    'form_master_assignment', 'subject_assignments', 'exambank'
  ],
  vp_academic: [
    'academic_oversight', 'curriculum_management', 'exambank'
  ],
  principal: [
    'teacher_directory', 'exambank'
  ],
  senior_master: [
    'duty_master', 'score_entry', 'exambank'
  ],
  exam_officer: [
    'bulk_reports', 'report_cards', 'exambank'
  ],
  form_master: [
    'student_enrollment', 'exambank'
  ],
  teacher: [
    'score_entry', 'exambank'
  ]
};

// Check if user has permission
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  return rolePermissions[user.role]?.includes(permission) || false;
};

// Get all permissions for role
export const getRolePermissions = (role) => {
  return rolePermissions[role] || [];
};
