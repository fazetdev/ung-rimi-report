import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import TechHeader from "./layout/TechHeader";
import TechNavigation from "./layout/TechNavigation";
import TechContent from "./layout/TechContent";
import { roleMenus } from "../../data/roleMenus";
import { getUserMenuItems } from "../../data/functionMenus";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState("user_management"); // Start with first module
  const [dashboardData, setDashboardData] = useState({ users: [] });

  // Helper to extract module ID from path
  const extractModuleId = (path) => {
    if (path === '/') return 'overview'; 
    const segments = path.split('/').filter(Boolean);
    return segments.pop() || 'overview';
  };

  // Helper to safely get the icon
  const extractIcon = (name) => {
    return name.split(' ')[0] || '⭐';
  };

  // Get config based on user role
  const getDashboardConfig = () => {
    if (user?.role === 'admin') {
      const adminModules = (roleMenus.admin || []).map(menuItem => {
        // Use consistent IDs that match the function names
        const moduleId = menuItem.path.includes('user_management') ? 'user_management' :
                        menuItem.path.includes('class_management') ? 'class_management' :
                        menuItem.path.includes('subject_management') ? 'subject_management' :
                        menuItem.path.includes('role_assignment') ? 'role_assignment' : 'overview';
        
        return {
          id: moduleId,
          name: menuItem.name,
          path: menuItem.path,
          icon: extractIcon(menuItem.name)
        };
      });

      return {
        title: "Admin Dashboard",
        modules: adminModules
      };
    } else {
      // All other users use function-based menus
      const userFunctions = user?.functions || [];
      const menuItemsByCategory = getUserMenuItems(userFunctions);

      const allMenuItems = [];
      Object.values(menuItemsByCategory).forEach(categoryItems => {
        categoryItems.forEach(item => {
          allMenuItems.push({
            id: extractModuleId(item.path),
            name: item.name,
            path: item.path,
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
