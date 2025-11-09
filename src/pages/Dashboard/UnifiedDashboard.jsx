import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import TechHeader from "./layout/TechHeader";
import TechNavigation from "./layout/TechNavigation";
import TechContent from "./layout/TechContent";
import { getDashboardConfig } from "../../config/dashboardConfig";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState("overview");
  const [dashboardData, setDashboardData] = useState({ users: [] });

  // Get config based on user role from dashboardConfig
  const getDashboardConfigForUser = () => {
    if (!user?.role) return null;
    
    const modules = getDashboardConfig(user.role);
    
    return {
      title: getRoleTitle(user.role),
      modules: modules
    };
  };

  const getRoleTitle = (role) => {
    const roleTitles = {
      'admin': 'Admin Dashboard',
      'vice principal admin': 'Vice Principal Admin Dashboard',
      'vice principal academic': 'Vice Principal Academic Dashboard', 
      'principal': 'Principal Dashboard',
      'senior master': 'Senior Master Dashboard',
      'exam officer': 'Exam Officer Dashboard',
      'form master': 'Form Master Dashboard',
      'teacher': 'Teacher Dashboard'
    };
    return roleTitles[role] || `${role} Dashboard`;
  };

  const roleConfig = getDashboardConfigForUser();

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
