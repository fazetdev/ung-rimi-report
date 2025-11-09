import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import TechHeader from "./layout/TechHeader";
import TechNavigation from "./layout/TechNavigation";
import TechContent from "./layout/TechContent";
import { roleMenus } from "../../data/roleMenus";
import { getUserMenuItems } from "../../data/functionMenus";
import DutyDisplay from "./roles/DutyDisplay";
                                             
export default function UnifiedDashboard() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState("overview");
  const [dashboardData, setDashboardData] = useState({ users: [] });

  // Helper to extract the last path segment (which should be the component ID)
  // Handles paths like '/dashboard/users' -> 'users'
  const extractModuleId = (path) => {
    // Ensure the path is not just a single '/'
    if (path === '/') return 'overview'; 
    const segments = path.split('/').filter(Boolean); // Filter(Boolean) removes empty strings
    return segments.pop() || 'overview';
  };

  // Helper to safely get the icon (assumes the name starts with the icon/emoji)
  const extractIcon = (name) => {
    return name.split(' ')[0] || '⭐'; // Default to a star if no icon is found
  };
  
  // Get config based on user role - Admin uses roleMenus, others use function-based
  const getDashboardConfig = () => {
    if (user?.role === 'Admin' || user?.role === 'admin') {
      // Admin uses the 4-button menu from roleMenus
      const adminModules = (roleMenus.Admin || []).map(menuItem => ({
        // IMPROVED: Use helper for robust ID extraction
        id: extractModuleId(menuItem.path), 
        name: menuItem.name,
        path: menuItem.path,
        // IMPROVED: Use helper for robust icon extraction
        icon: extractIcon(menuItem.name)
      }));

      return {
        title: "Admin Dashboard",
        modules: adminModules
      };
    } else {
      // All other users use function-based menus
      const userFunctions = user?.functions || [];
      const menuItemsByCategory = getUserMenuItems(userFunctions);

      // Flatten all menu items for navigation
      const allMenuItems = [];
      Object.values(menuItemsByCategory).forEach(categoryItems => {
        categoryItems.forEach(item => {
          allMenuItems.push({
            // IMPROVED: Use helper for robust ID extraction
            id: extractModuleId(item.path),
            name: item.name,
            path: item.path,
            // IMPROVED: Use helper for robust icon extraction
            icon: extractIcon(item.name)
          });
        });
      });

      return {
        title: `${user?.role} Dashboard`,
        modules: allMenuItems
      };
    }
  };

  const roleConfig = getDashboardConfig();

  useEffect(() => {
    if (user) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
      setDashboardData({ users, classLists });
    }
  }, [user]);

  if (!user || !roleConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <TechHeader config={roleConfig} user={user} />
      <DutyDisplay />
      <div className="container mx-auto px-4 py-6">
        <TechNavigation
          config={roleConfig}
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
        <TechContent
          config={roleConfig}
          activeModule={activeModule}
          user={user}
          dashboardData={dashboardData}
        />
      </div>
    </div>
  );
}
