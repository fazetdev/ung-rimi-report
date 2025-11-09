// Simplified role permissions - Report Focused System
export const rolePermissions = {
  admin: [
    'user_management', 'class_management', 'subject_management', 
    'role_assignment', 'system_settings', 'exambank'
  ],
  'vice principal admin': [
    'form_master_assignment', 'subject_assignments', 'score_entry', 'exambank'
  ],
  'vice principal academic': [
    'academic_records', 'score_entry', 'exambank'
  ],
  principal: [
    'teacher_directory', 'class_lists', 'score_entry', 'exambank'
  ],
  'senior master': [
    'duty_roster', 'score_entry', 'exambank'
  ],
  'exam officer': [
    'print_reports', 'score_entry', 'exambank'
  ],
  'form master': [
    'add_students', 'score_entry', 'exambank'
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
