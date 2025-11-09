import React from "react";
import { hasFunction, canAccessFinance } from "../../../utils/functionPermissions";
import UserManagementPanel from "../roles/UserManagementPanel";
import RoleAssignmentPanel from "../roles/RoleAssignmentPanel";
import FormMasterAssignment from "../roles/FormMasterAssignment";
import SubjectAssignments from "../roles/SubjectAssignments";
import ClassManager from "../roles/ClassManager";
import SubjectManager from "../roles/SubjectManager";
import StudentEnrollment from "../roles/StudentEnrollment";

const TechContent = ({ config, activeModule, user, dashboardData }) => {
  const renderModuleContent = () => {
    const { modules } = config;
    const activeModuleConfig = modules.find(module => module.id === activeModule);

    if (!activeModuleConfig) {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Welcome to {config.title}</h2>
          <p className="text-gray-600">Select a module from the navigation to get started.</p>
        </div>
      );
    }

    // Map module IDs to components
    const componentMap = {
      // Admin modules
      'user_management': UserManagementPanel,
      'class_management': ClassManager,
      'subject_management': SubjectManager,
      'role_assignment': RoleAssignmentPanel,
      
      // VP Admin modules
      'form_master_assignment': FormMasterAssignment,
      'subject_assignments': SubjectAssignments,
      
      // Form Master modules
      'student_enrollment': StudentEnrollment,
      
      // Default fallback
      'overview': () => (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Welcome to {config.title}</h2>
          <p className="text-gray-600">Select a module from the navigation to get started.</p>
        </div>
      )
    };

    const Component = componentMap[activeModule] || componentMap.overview;

    return <Component user={user} dashboardData={dashboardData} />;
  };

  return (
    <div className="tech-content">
      {renderModuleContent()}
    </div>
  );
};

export default TechContent;
