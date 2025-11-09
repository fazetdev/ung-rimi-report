import React, { useState, useEffect } from "react";

const UserManagementPanel = ({ user, dashboardData }) => {
  const [teachers, setTeachers] = useState([]);
  const [bulkData, setBulkData] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "", 
    password: ""
  });
  const [openSections, setOpenSections] = useState({
    single: false,
    bulk: false,
    list: false
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const staffUsers = storedUsers.filter(u => 
      ["teacher", "form_master", "exam_officer", "senior_master", "principal", "vp_admin", "admin"].includes(u.role)
    );
    setTeachers(staffUsers);
  };

  const toggleUserStatus = (userId, currentStatus) => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, status: currentStatus === "active" ? "inactive" : "active" } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    loadTeachers();
    alert(`User ${currentStatus === "active" ? "deactivated" : "activated"} successfully!`);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSingleCreate = (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill all fields");
      return;
    }

    const userToCreate = {
      id: `teacher-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: "teacher",
      status: "active",
      createdAt: new Date().toISOString()
    };

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const finalUsers = [...allUsers, userToCreate];
    localStorage.setItem("users", JSON.stringify(finalUsers));
    
    setNewUser({ name: "", email: "", password: "" });
    loadTeachers();
    alert("Teacher created successfully!");
  };

  const handleBulkCreate = (e) => {
    e.preventDefault();
    
    if (!bulkData.trim()) {
      alert("Please enter teacher data");
      return;
    }

    const lines = bulkData.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newUsers = lines.map((line, index) => {
      const parts = line.split(',');
      return {
        id: `teacher-${Date.now()}-${index}`,
        name: parts[0]?.trim() || `Teacher ${index + 1}`,
        email: parts[1]?.trim() || `teacher${index + 1}@school.edu`,
        password: parts[2]?.trim() || `teacher${index + 1}`,
        role: "teacher",
        status: "active", 
        createdAt: new Date().toISOString()
      };
    });

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const finalUsers = [...allUsers, ...newUsers];
    localStorage.setItem("users", JSON.stringify(finalUsers));
    
    setBulkData("");
    loadTeachers();
    alert(`Created ${newUsers.length} teachers successfully!`);
  };

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Staff Management</h2>
        
        {/* Single Create Section - Collapsible */}
        <div className="mb-6 border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('single')}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 text-left font-bold text-lg md:text-xl flex justify-between items-center"
          >
            <span>👤 Create Single Teacher</span>
            <span className="text-2xl">{openSections.single ? '−' : '+'}</span>
          </button>
          
          {openSections.single && (
            <div className="p-6 bg-green-50">
              <form onSubmit={handleSingleCreate} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Full Name:</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full border-2 border-gray-300 p-3 rounded-xl text-lg focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Email:</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="john@school.edu"
                      className="w-full border-2 border-gray-300 p-3 rounded-xl text-lg focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Password:</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Set password"
                      className="w-full border-2 border-gray-300 p-3 rounded-xl text-lg focus:border-green-500"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                >
                  Create Teacher
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bulk Create Section - Collapsible */}
        <div className="mb-6 border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('bulk')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 text-left font-bold text-lg md:text-xl flex justify-between items-center"
          >
            <span>👥 Bulk Create Teachers</span>
            <span className="text-2xl">{openSections.bulk ? '−' : '+'}</span>
          </button>
          
          {openSections.bulk && (
            <div className="p-6 bg-blue-50">
              <form onSubmit={handleBulkCreate} className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-gray-700">
                    Teacher Data (CSV format - name,email,password):
                  </label>
                  <textarea
                    value={bulkData}
                    onChange={(e) => setBulkData(e.target.value)}
                    placeholder="John Doe,john@school.edu,john123&#10;Jane Smith,jane@school.edu,jane123&#10;Mike Johnson,mike@school.edu,mike123"
                    className="w-full h-48 border-2 border-gray-300 p-4 rounded-2xl resize-vertical text-lg focus:border-blue-500"
                    required
                  />
                  <p className="text-base text-gray-600 mt-3 bg-yellow-50 p-3 rounded-lg">
                    <strong>Format:</strong> name,email,password (one teacher per line)<br/>
                    <strong>Example:</strong> John Doe,john@school.edu,john123
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                >
                  Create Multiple Teachers
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Staff List Section - Collapsible */}
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('list')}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 text-left font-bold text-lg md:text-xl flex justify-between items-center"
          >
            <span>📋 Staff List ({teachers.length})</span>
            <span className="text-2xl">{openSections.list ? '−' : '+'}</span>
          </button>
          
          {openSections.list && (
            <div className="p-6 bg-purple-50">
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-purple-500 to-purple-600">
                      <tr>
                        <th className="px-4 md:px-6 py-4 text-left font-bold text-white text-lg">Name</th>
                        <th className="px-4 md:px-6 py-4 text-left font-bold text-white text-lg">Email</th>
                        <th className="px-4 md:px-6 py-4 text-left font-bold text-white text-lg">Role</th>
                        <th className="px-4 md:px-6 py-4 text-left font-bold text-white text-lg">Status</th>
                        <th className="px-4 md:px-6 py-4 text-left font-bold text-white text-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((staff, index) => (
                        <tr 
                          key={staff.id} 
                          className={`border-t border-gray-100 hover:bg-purple-50 ${
                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <td className="px-4 md:px-6 py-4 text-lg font-medium text-gray-800">
                            {staff.name}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-lg text-gray-700">
                            {staff.email}
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-base font-semibold">
                              {staff.role.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className={`px-3 py-2 rounded-lg text-base font-semibold ${
                              staff.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {staff.status?.toUpperCase() || "ACTIVE"}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <button
                              onClick={() => toggleUserStatus(staff.id, staff.status)}
                              className={`px-4 py-2 rounded-lg font-semibold text-white ${
                                staff.status === "active" 
                                  ? "bg-red-500 hover:bg-red-600" 
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                            >
                              {staff.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPanel;
