import React, { useState, useEffect } from "react";

export default function ClassListManager({ className }) {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(className || '');
  const [availableClasses, setAvailableClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClasses();
    if (selectedClass) loadClassStudents();
  }, [selectedClass]);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classes = Object.keys(classLists);
    setAvailableClasses(classes);
    if (!selectedClass && classes.length > 0) setSelectedClass(classes[0]);
  };

  const loadClassStudents = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classStudents = classLists[selectedClass] || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const enrichedStudents = classStudents.map(student => {
      const userDetails = users.find(u => u.id === student.id || u.studentId === student.studentId);
      return {
        ...student,
        studentId: student.studentId || userDetails?.studentId || "-",
        fullName: student.fullName || userDetails?.fullName || "-",
        gender: student.gender || userDetails?.gender || "-",
        dateOfBirth: student.dateOfBirth || userDetails?.dateOfBirth || "-",
        parentPhone: student.parentPhone || userDetails?.parentPhone || "-",
        parentEmail: student.parentEmail || userDetails?.parentEmail || "-",
        emergencyContact: student.emergencyContact || userDetails?.emergencyContact || "-",
        medicalInfo: student.medicalInfo || userDetails?.medicalInfo || "-"
      };
    });
    setStudents(enrichedStudents);
  };

  const filteredStudents = students.filter(student =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editStudent = (index) => {
    alert(`Edit feature coming soon for ${students[index].fullName}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Class Student List</h2>
          <p className="text-gray-600 text-sm">Manage student data easily</p>
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Class</option>
          {availableClasses.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Search by name or ID..."
        className="w-full p-2 mb-3 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-2 border">Student ID</th>
              <th className="p-2 border sticky left-0 bg-gray-100 z-10">Name</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Date of Birth</th>
              <th className="p-2 border">Parent Phone</th>
              <th className="p-2 border">Parent Email</th>
              <th className="p-2 border">Emergency Contact</th>
              <th className="p-2 border">Medical Info</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">{s.studentId}</td>
                  <td className="p-2 border sticky left-0 bg-white z-10">{s.fullName}</td>
                  <td className="p-2 border">{s.gender}</td>
                  <td className="p-2 border">{s.dateOfBirth}</td>
                  <td className="p-2 border">{s.parentPhone}</td>
                  <td className="p-2 border">{s.parentEmail}</td>
                  <td className="p-2 border">{s.emergencyContact}</td>
                  <td className="p-2 border">{s.medicalInfo}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => editStudent(i)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-3 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
