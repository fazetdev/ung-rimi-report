// Simplified Admin-only menus
export const roleMenus = {
  'admin': [
    { name: "👥 User Management", path: "/dashboard/admin?view=user_management" },
    { name: "🏫 Class Setup", path: "/dashboard/admin?view=class_management" },
    { name: "📚 Subject Setup", path: "/dashboard/admin?view=subject_management" },
    { name: "🎯 Role Assignment", path: "/dashboard/admin?view=role_assignment" }
  ]
  // No other roles - they use function-based access
};
