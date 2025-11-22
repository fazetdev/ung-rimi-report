import React from "react";
import UserManagementPanel from "../roles/UserManagementPanel";
import RoleAssignmentPanel from "../roles/RoleAssignmentPanel";
import FormMasterAssignment from "../roles/FormMasterAssignment";
import StudentEnrollment from "../roles/StudentEnrollment";
import ClassManager from "../roles/ClassManager";
import SubjectManager from "../roles/SubjectManager";
import SubjectAssignments from "../roles/SubjectAssignments";
import ExamBank from "../ExamBank";
import ScoreEntryTable from "../../../components/scoring/ScoreEntryTable";

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

    const componentMap = {
      user_management: UserManagementPanel,
      class_management: ClassManager,
      subject_management: SubjectManager,
      role_assignment: RoleAssignmentPanel,
      form_master_assignment: FormMasterAssignment,
      subject_assignments: SubjectAssignments,
      add_students: StudentEnrollment,
      score_entry: ScoreEntryTable,
      exambank: ExamBank,
      overview: () => (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Welcome to {config.title}</h2>
          <p className="text-gray-600">Select a module from the navigation to get started.</p>
        </div>
      ),
    };

    const Component = componentMap[activeModule] || componentMap.overview;
    return <Component user={user} dashboardData={dashboardData} />;
  };

  return <div className="tech-content">{renderModuleContent()}</div>;
};

export default TechContent;
