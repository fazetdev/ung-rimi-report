import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import TechHeader from "./layout/TechHeader";
import TechNavigation from "./layout/TechNavigation";
import TechContent from "./layout/TechContent";
import { getDashboardConfig } from "../../config/dashboardConfig";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState("overview");
  const [dashboardData, setDashboardData] = useState({ users: [], classLists: {} });

  const getRoleTitle = (role) => {
    const roleTitles = {
      admin: "Admin Dashboard",
      "vice principal admin": "VP Admin Dashboard",
      "vice principal academic": "VP Academic Dashboard",
      principal: "Principal Dashboard",
      "senior master": "Senior Master Dashboard",
      "exam officer": "Exam Officer Dashboard",
      "form master": "Form Master Dashboard",
      teacher: "Teacher Dashboard",
    };
    return roleTitles[role] || `${role} Dashboard`;
  };

  const getDashboardConfigForUser = () => {
    if (!user?.role) return { title: "Dashboard", modules: [] };
    const modules = getDashboardConfig(user.role);
    console.log("Dashboard config for role:", user.role, modules);
    return { title: getRoleTitle(user.role), modules };
  };

  const roleConfig = getDashboardConfigForUser();

  useEffect(() => {
    if (user) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
      setDashboardData({ users, classLists });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  console.log("Rendering UnifiedDashboard with:", { user, roleConfig });

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
