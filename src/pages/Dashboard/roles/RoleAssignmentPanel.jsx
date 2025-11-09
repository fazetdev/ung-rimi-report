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
    
    // Show only STAFF users (not students)
    const staffRoles = [
      'teacher', 'form master', 'exam officer', 'senior master', 
      'principal', 'vice principal admin', 'vice principal academic',
      'vp admin', 'vp_admin' // Include old role formats
    ];
    
    const staffUsers = storedUsers.filter(u => 
      u.role !== 'admin' && 
      u.email !== 'admin@school.edu' && // Exclude default admin
      staffRoles.includes(u.role?.toLowerCase()) // Only staff roles
    );
    
    setUsers(staffUsers);
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
    { value: "form master", label: "Form Master" },
    { value: "exam officer", label: "Exam Officer" },
    { value: "senior master", label: "Senior Master" },
    { value: "principal", label: "Principal" },
    { value: "vice principal admin", label: "Vice Principal Admin" },
    { value: "vice principal academic", label: "Vice Principal Academic" }
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Role Assignment</h2>
        
        {users.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">No Staff Available</h3>
            <p className="text-yellow-700">
              Create some staff members first in the User Management section, then come back here to assign them roles.
            </p>
          </div>
        ) : (
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Assign Role to Staff Member</h3>
            <form onSubmit={handleRoleAssignment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Staff:</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Choose a staff member</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email}) - Current: {user.role}
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
              <p><strong>Note:</strong> {users.length} staff member(s) available for role assignment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleAssignmentPanel;
