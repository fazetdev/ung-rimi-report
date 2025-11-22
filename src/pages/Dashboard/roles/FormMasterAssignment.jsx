import React, { useState, useEffect } from 'react';

export default function FormMasterAssignment() {
  const [staff, setStaff] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignedClass, setAssignedClass] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load ALL staff (including teachers and other roles)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const allStaff = users.filter(u =>
      u.role && u.role !== 'admin' && u.email !== 'admin@school.edu'
    );
    setStaff(allStaff);

    // Load classes from the correct key
    const schoolClasses = JSON.parse(localStorage.getItem('schoolClasses')) || [];
    const classNames = Array.isArray(schoolClasses) 
      ? schoolClasses.map(cls => cls.name || cls.className || "").filter(Boolean)
      : Object.keys(schoolClasses);
    setClasses(classNames);
  };

  const assignFormMaster = () => {
    if (!selectedStaff || !assignedClass) {
      alert('Please select both Staff Member and Class');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const selectedUser = users.find(u => u.id === selectedStaff);

    if (!selectedUser) {
      alert('Staff member not found');
      return;
    }

    // Check if class is already assigned to another staff
    const existingAssignment = users.find(u =>
      u.assignedClass === assignedClass && u.id !== selectedStaff
    );

    if (existingAssignment) {
      alert(`Class ${assignedClass} is already assigned to ${existingAssignment.name}`);
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === selectedStaff
        ? {
            ...user,
            assignedClass: assignedClass,
            role: user.role === 'teacher' ? 'form master' : user.role // Only upgrade teachers to form master
          }
        : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert(`${selectedUser.name} assigned as Form Master for ${assignedClass} successfully!`);

    // Reset form and reload data
    setSelectedStaff('');
    setAssignedClass('');
    loadData();
  };

  const removeAssignment = (staffId) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const staffMember = users.find(u => u.id === staffId);

    const updatedUsers = users.map(user =>
      user.id === staffId
        ? {
            ...user,
            assignedClass: '',
            role: user.role === 'form master' ? 'teacher' : user.role // Only downgrade form masters to teachers
          }
        : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert(`${staffMember?.name} removed from Form Master assignment!`);
    loadData();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Assign Form Masters to Classes</h2>

      {/* Assignment Form */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">Assign Form Master</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Staff Member
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="">Choose Staff Member</option>
              {staff.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name} - {person.role} {person.assignedClass ? `(Currently: ${person.assignedClass})` : ''}
                </option>
              ))}
            </select>
            {staff.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ No staff members available. Admin needs to create staff first.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={assignedClass}
              onChange={(e) => setAssignedClass(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="">Choose Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            {classes.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ No classes available. Admin needs to create classes first.
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={assignFormMaster}
          disabled={!selectedStaff || !assignedClass}
          className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-base font-medium"
        >
          ✅ Assign Form Master
        </button>
      </div>

      {/* Current Assignments */}
      <div>
        <h3 className="font-semibold mb-3 text-lg">Current Form Masters</h3>
        {staff.filter(person => person.assignedClass).length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">👨‍🏫</div>
            <p className="text-gray-500">No Form Masters assigned to classes yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {staff.filter(person => person.assignedClass).map(person => (
              <div key={person.id} className="p-4 border rounded-lg bg-green-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{person.name}</div>
                    <div className="text-sm text-gray-600">
                      Role: {person.role} • Class: {person.assignedClass}
                    </div>
                  </div>
                  <button
                    onClick={() => removeAssignment(person.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
