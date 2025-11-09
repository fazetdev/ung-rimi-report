import React, { useState, useEffect } from "react";

export default function ClassListManager({ className }) {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(className || '');
  const [availableClasses, setAvailableClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadClasses();
    if (selectedClass) {
      loadClassStudents();
    }
  }, [selectedClass]);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classes = Object.keys(classLists);
    setAvailableClasses(classes);
    
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0]);
    }
  };

  const loadClassStudents = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classStudents = classLists[selectedClass] || [];
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const enrichedStudents = classStudents.map(student => {
      const userDetails = users.find(u => u.id === student.id || u.studentId === student.studentId);
      return {
        ...student,
        parentPhone: student.parentPhone || userDetails?.parentPhone || '-',
        parentEmail: student.parentEmail || userDetails?.parentEmail || '-',
        dateOfBirth: student.dateOfBirth || userDetails?.dateOfBirth || '-',
        emergencyContact: student.emergencyContact || userDetails?.emergencyContact || '-',
        medicalInfo: student.medicalInfo || userDetails?.medicalInfo || '-'
      };
    });
    
    // Sort alphabetically by name and capitalize names
    const sortedStudents = enrichedStudents
      .map(student => ({
        ...student,
        fullName: capitalizeName(student.fullName)
      }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
    
    setStudents(sortedStudents);
  };

  const capitalizeName = (name) => {
    return name.replace(/\b\w/g, char => char.toUpperCase());
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.parentPhone && student.parentPhone.includes(searchTerm))
  );

  const copyPhoneNumber = (phone) => {
    if (phone && phone !== '-') {
      navigator.clipboard.writeText(phone);
      alert(`📞 Phone number copied: ${phone}`);
    }
  };

  const startEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      parentPhone: student.parentPhone === '-' ? '' : student.parentPhone,
      parentEmail: student.parentEmail === '-' ? '' : student.parentEmail,
      emergencyContact: student.emergencyContact === '-' ? '' : student.emergencyContact,
      medicalInfo: student.medicalInfo === '-' ? '' : student.medicalInfo
    });
  };

  const saveEdit = () => {
    if (!editingStudent) return;

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Update classLists
    Object.keys(classLists).forEach(className => {
      classLists[className] = classLists[className].map(student =>
        student.id === editingStudent.id
          ? {
              ...student,
              parentPhone: editForm.parentPhone || '-',
              parentEmail: editForm.parentEmail || '-',
              emergencyContact: editForm.emergencyContact || '-',
              medicalInfo: editForm.medicalInfo || '-'
            }
          : student
      );
    });
    localStorage.setItem('classLists', JSON.stringify(classLists));

    // Update users
    const updatedUsers = users.map(user =>
      user.id === editingStudent.id || user.studentId === editingStudent.studentId
        ? {
            ...user,
            parentPhone: editForm.parentPhone || '-',
            parentEmail: editForm.parentEmail || '-',
            emergencyContact: editForm.emergencyContact || '-',
            medicalInfo: editForm.medicalInfo || '-'
          }
        : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert('✅ Student information updated!');
    setEditingStudent(null);
    setEditForm({});
    loadClassStudents();
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setEditForm({});
  };

  const exportToCSV = () => {
    if (filteredStudents.length === 0) {
      alert('No students to export');
      return;
    }

    const headers = ['Name', 'Student ID', 'Gender', 'Date of Birth', 'Parent Phone', 'Parent Email', 'Emergency Contact', 'Medical Info'];
    const csvData = filteredStudents.map(student => [
      student.fullName,
      student.studentId,
      student.gender,
      student.dateOfBirth,
      student.parentPhone,
      student.parentEmail,
      student.emergencyContact,
      student.medicalInfo
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${selectedClass}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert(`📊 Exported ${filteredStudents.length} students to CSV`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">Student Directory</h2>
          <p className="text-gray-600">View student details and parent contact information</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            disabled={filteredStudents.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Class Selection and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose Class</option>
            {availableClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🔍 Search Students
          </label>
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Student Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={editingStudent.fullName}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Name cannot be edited</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Phone
                </label>
                <input
                  type="tel"
                  value={editForm.parentPhone}
                  onChange={(e) => setEditForm({...editForm, parentPhone: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="080XXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Email
                </label>
                <input
                  type="email"
                  value={editForm.parentEmail}
                  onChange={(e) => setEditForm({...editForm, parentEmail: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="parent@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={editForm.emergencyContact}
                  onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Emergency contact details"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Information
                </label>
                <textarea
                  value={editForm.medicalInfo}
                  onChange={(e) => setEditForm({...editForm, medicalInfo: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Medical conditions, allergies, etc."
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={saveEdit}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                💾 Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedClass ? (
        <div className="text-center py-8 bg-yellow-50 rounded border">
          <div className="text-4xl mb-2">🏫</div>
          <h3 className="text-lg font-semibold mb-2">No Class Selected</h3>
          <p className="text-gray-600">Please select a class to view students</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded border">
          <div className="text-4xl mb-2">📝</div>
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? 'No Students Found' : 'No Students in Class'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'No students match your search criteria'
              : `No students enrolled in ${selectedClass} yet`
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b text-left font-semibold sticky left-0 bg-gray-50 z-10 min-w-[150px]">Name</th>
                <th className="py-3 px-4 border-b text-left font-semibold min-w-[100px]">Student ID</th>
                <th className="py-3 px-4 border-b text-left font-semibold min-w-[80px]">Gender</th>
                <th className="py-3 px-4 border-b text-left font-semibold min-w-[120px]">Date of Birth</th>
                <th className="py-3 px-4 border-b text-left font-semibold min-w-[130px]">Parent Phone</th>
                <th className="py-3 px-4 border-b text-left font-semibold min-w-[150px]">Parent Email</th>
                <th className="py-3 px-4 border-b text-left font-semibold min-w-[130px]">Emergency Contact</th>
                <th className="py-3 px-4 border-b text-left font-semibold min-w-[150px]">Medical Info</th>
                <th className="py-3 px-4 border-b text-left font-semibold min-w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 border-b">
                  {/* Sticky Name Column */}
                  <td className="py-3 px-4 font-medium sticky left-0 bg-white z-10 border-r min-w-[150px]">
                    {student.fullName}
                  </td>
                  
                  {/* Scrollable Columns */}
                  <td className="py-3 px-4 font-mono text-gray-600 min-w-[100px]">{student.studentId}</td>
                  <td className="py-3 px-4 min-w-[80px]">{student.gender}</td>
                  <td className="py-3 px-4 min-w-[120px]">{student.dateOfBirth}</td>
                  <td className="py-3 px-4 min-w-[130px]">
                    <div className="flex items-center gap-2">
                      <span className={student.parentPhone === '-' ? 'text-gray-400' : 'text-blue-600'}>
                        {student.parentPhone}
                      </span>
                      {student.parentPhone !== '-' && (
                        <button
                          onClick={() => copyPhoneNumber(student.parentPhone)}
                          className="text-green-600 hover:text-green-800 text-sm"
                          title="Copy phone number"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 min-w-[150px]">{student.parentEmail}</td>
                  <td className="py-3 px-4 min-w-[130px]">{student.emergencyContact}</td>
                  <td className="py-3 px-4 min-w-[150px]">{student.medicalInfo}</td>
                  <td className="py-3 px-4 min-w-[100px]">
                    <button
                      onClick={() => startEdit(student)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Summary */}
          <div className="mt-4 p-3 bg-gray-50 rounded border">
            <div className="flex justify-between items-center text-sm">
              <span>
                📊 Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
                {searchTerm && ' (filtered)'}
              </span>
              <span>
                📞 <strong>
                  {students.filter(s => s.parentPhone && s.parentPhone !== '-').length}
                </strong> students with phone numbers
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
