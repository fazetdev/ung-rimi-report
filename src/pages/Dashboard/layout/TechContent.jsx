import React from "react";
import UserManagementPanel from "../roles/UserManagementPanel";
import RoleAssignmentPanel from "../roles/RoleAssignmentPanel";
import FormMasterAssignment from "../roles/FormMasterAssignment";
import StudentEnrollment from "../roles/StudentEnrollment";
import ClassManager from "../roles/ClassManager";

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

    // Map ALL module IDs to working components
    const componentMap = {
      // Admin modules
      'user_management': UserManagementPanel,
      'class_management': ClassManager,
      'subject_management': () => (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Subject Management</h2>
          <p className="text-gray-600">Create and manage subjects for the curriculum.</p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Subject Setup</h3>
            <p>Create new subjects and manage existing ones.</p>
            <button
              onClick={() => alert("Subject management interface coming soon")}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Manage Subjects
            </button>
          </div>
        </div>
      ),
      'role_assignment': RoleAssignmentPanel,
      
      // Vice Principal Admin modules
      'form_master_assignment': FormMasterAssignment,
      'subject_assignments': () => (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Assign Teachers to Subjects & Classes</h2>
          <p className="text-gray-600">Assign subjects and classes to teachers for teaching.</p>
          <button
            onClick={() => alert("Subject assignment interface coming soon")}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Assign Subjects
          </button>
        </div>
      ),
      
      // Form Master modules
      'add_students': StudentEnrollment,
      
      // Common modules for all roles
      'score_entry': () => (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Score Entry</h2>
          <p className="text-gray-600">Enter scores for assigned subjects.</p>
          <button
            onClick={() => alert("Score entry interface coming soon")}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Enter Scores
          </button>
        </div>
      ),
      'exambank': () => (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Exam Bank</h2>
          <p className="text-gray-600">Access examination materials and resources.</p>
          <button
            onClick={() => alert("Exam bank interface coming soon")}
            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Access Exam Bank
          </button>
        </div>
      ),
      
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
