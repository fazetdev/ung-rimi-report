import React, { useState, useEffect } from "react";

const RoleAssignmentPanel = ({ user, dashboardData }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("teacher");

  // Check if current user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>Only Admin can access role assignment.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    // Filter only teacher-role users (those created by admin)
    const adminCreatedUsers = storedUsers.filter(u => 
      u.role === 'teacher' && 
      u.id && 
      u.id.startsWith('teacher-') && // Only users created through admin panel
      u.email !== 'admin@school.edu' // Exclude default admin
    );
    
    setUsers(adminCreatedUsers);
  }, []);

  const handleRoleAssignment = (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert("Please select a user");
      return;
    }

    // Update localStorage
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const finalUsers = allUsers.map(u => 
      u.id === selectedUser ? { ...u, role: selectedRole } : u
    );
    
    localStorage.setItem("users", JSON.stringify(finalUsers));
    
    // Update local state and reset form
    const updatedUsers = users.map(u => 
      u.id === selectedUser ? { ...u, role: selectedRole } : u
    );
    setUsers(updatedUsers);
    setSelectedUser("");
    setSelectedRole("teacher");
    alert(`Role updated to ${selectedRole} successfully!`);
  };

  const availableRoles = [
    { value: "teacher", label: "Teacher" },
    { value: "form_master", label: "Form Master" },
    { value: "exam_officer", label: "Exam Officer" },
    { value: "senior_master", label: "Senior Master" },
    { value: "principal", label: "Principal" },
    { value: "vp_admin", label: "VP Admin" },
    { value: "vp_academic", label: "VP Academic" }
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Role Assignment</h2>
        
        {users.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">No Teachers Available</h3>
            <p className="text-yellow-700">
              Create some teachers first in the User Management section, then come back here to assign them roles.
            </p>
          </div>
        ) : (
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Assign Role to Teacher</h3>
            <form onSubmit={handleRoleAssignment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Teacher:</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Choose a teacher</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Assign Role:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Assign Role
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Note:</strong> {users.length} teacher(s) available for role assignment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleAssignmentPanel;
