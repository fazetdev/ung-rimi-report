import React, { useState, useEffect } from 'react';

export default function StudentEnrollment() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newStudent, setNewStudent] = useState({
    studentId: '',
    fullName: '',
    class: '',
    gender: '',
    dateOfBirth: '',
    parentPhone: ''
  });
  const [idConfig, setIdConfig] = useState({ prefix: '', nextNumber: 1, active: false });
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);

  useEffect(() => {
    loadClasses();
    loadStudents();
  }, []);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));
  };

  const loadStudents = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const allStudents = Object.values(classLists).flat();
    
    // Sort alphabetically by name and capitalize
    const sortedStudents = allStudents
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

  const setupIdAutoGeneration = (firstId) => {
    const numbers = firstId.match(/\d+$/);
    if (numbers) {
      const numberPart = numbers[0];
      const prefix = firstId.slice(0, -numberPart.length);
      const nextNum = parseInt(numberPart) + 1;
      
      setIdConfig({
        prefix: prefix,
        nextNumber: nextNum,
        active: true
      });
      
      const nextId = prefix + nextNum.toString().padStart(numberPart.length, '0');
      setNewStudent(prev => ({ ...prev, studentId: nextId }));
    }
  };

  const handleBulkImport = () => {
    if (!bulkNames.trim() || !newStudent.class) {
      alert('Please select a class and enter names');
      return;
    }

    const names = bulkNames.split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      alert('No valid names found');
      return;
    }

    if (!idConfig.active && !newStudent.studentId) {
      alert('Please set up ID pattern first (enter first ID like STU001)');
      return;
    }

    let currentId = idConfig.active ? 
      `${idConfig.prefix}${idConfig.nextNumber.toString().padStart(3, '0')}` : 
      newStudent.studentId;

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let successCount = 0;

    names.forEach((name, index) => {
      const studentId = idConfig.active ? 
        `${idConfig.prefix}${(idConfig.nextNumber + index).toString().padStart(3, '0')}` :
        incrementId(currentId, index);

      // Check if student ID exists
      const allStudents = Object.values(classLists).flat();
      if (allStudents.find(s => s.studentId === studentId)) {
        console.log(`Skipping ${studentId} - already exists`);
        return;
      }

      const student = {
        id: `student-${Date.now()}-${index}`,
        studentId: studentId,
        fullName: capitalizeName(name),
        class: newStudent.class,
        gender: newStudent.gender || 'Male',
        dateOfBirth: newStudent.dateOfBirth || '-',
        parentPhone: newStudent.parentPhone || '-',
        status: 'approved',
        enrolledAt: new Date().toISOString()
      };

      // Add to class list
      classLists[newStudent.class] = classLists[newStudent.class] || [];
      classLists[newStudent.class].push(student);

      // Add to users
      users.push({
        ...student,
        role: 'Student',
        email: `${studentId}@school.edu`,
        password: 'student123'
      });

      successCount++;
    });

    localStorage.setItem('classLists', JSON.stringify(classLists));
    localStorage.setItem('users', JSON.stringify(users));

    // Update ID config for next operations
    if (idConfig.active) {
      setIdConfig(prev => ({
        ...prev,
        nextNumber: prev.nextNumber + names.length
      }));
      setNewStudent(prev => ({
        ...prev,
        studentId: `${idConfig.prefix}${(idConfig.nextNumber + names.length).toString().padStart(3, '0')}`
      }));
    }

    alert(`✅ Successfully imported ${successCount} students!`);
    setBulkNames('');
    setShowBulkImport(false);
    loadStudents();
  };

  const incrementId = (baseId, increment) => {
    const numbers = baseId.match(/\d+$/);
    if (numbers) {
      const numberPart = numbers[0];
      const prefix = baseId.slice(0, -numberPart.length);
      const newNum = parseInt(numberPart) + increment;
      return prefix + newNum.toString().padStart(numberPart.length, '0');
    }
    return baseId;
  };

  const handleEnroll = () => {
    if (!newStudent.studentId || !newStudent.fullName || !newStudent.class) {
      alert('Please fill in all required fields');
      return;
    }

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    
    const allStudents = Object.values(classLists).flat();
    const existingStudent = allStudents.find(s => 
      s.studentId === newStudent.studentId && 
      (!editingStudent || s.id !== editingStudent.id)
    );
    
    if (existingStudent) {
      alert(`Student ID ${newStudent.studentId} already exists!`);
      return;
    }

    if (!classLists[newStudent.class]) {
      alert(`Class ${newStudent.class} doesn't exist! Create class first.`);
      return;
    }

    if (editingStudent) {
      updateStudent();
    } else {
      createStudent();
    }
  };

  const createStudent = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const student = {
      id: Date.now().toString(),
      studentId: newStudent.studentId,
      fullName: capitalizeName(newStudent.fullName),
      class: newStudent.class,
      gender: newStudent.gender,
      dateOfBirth: newStudent.dateOfBirth,
      parentPhone: newStudent.parentPhone,
      status: 'approved',
      enrolledAt: new Date().toISOString()
    };

    classLists[newStudent.class] = classLists[newStudent.class] || [];
    classLists[newStudent.class].push(student);
    localStorage.setItem('classLists', JSON.stringify(classLists));

    users.push({
      ...student,
      role: 'Student',
      email: `${newStudent.studentId}@school.edu`,
      password: 'student123'
    });
    localStorage.setItem('users', JSON.stringify(users));

    alert(`✅ ${newStudent.fullName} enrolled!`);

    if (idConfig.active) {
      const nextNum = idConfig.nextNumber + 1;
      const nextId = idConfig.prefix + nextNum.toString().padStart(3, '0');
      
      setIdConfig(prev => ({ ...prev, nextNumber: nextNum }));
      setNewStudent(prev => ({
        ...prev,
        studentId: nextId,
        fullName: '',
        dateOfBirth: '',
        parentPhone: ''
      }));
    } else {
      setupIdAutoGeneration(newStudent.studentId);
      setNewStudent(prev => ({
        ...prev,
        fullName: '',
        dateOfBirth: '',
        parentPhone: ''
      }));
    }

    loadStudents();
  };

  const updateStudent = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];

    Object.keys(classLists).forEach(className => {
      classLists[className] = classLists[className].filter(s => s.id !== editingStudent.id);
    });

    const updatedStudent = {
      ...editingStudent,
      studentId: newStudent.studentId,
      fullName: capitalizeName(newStudent.fullName),
      class: newStudent.class,
      gender: newStudent.gender,
      dateOfBirth: newStudent.dateOfBirth,
      parentPhone: newStudent.parentPhone
    };

    classLists[newStudent.class] = classLists[newStudent.class] || [];
    classLists[newStudent.class].push(updatedStudent);
    localStorage.setItem('classLists', JSON.stringify(classLists));

    const updatedUsers = users.map(user => 
      user.id === editingStudent.id 
        ? { ...user, ...updatedStudent, email: `${newStudent.studentId}@school.edu` }
        : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert(`✅ ${newStudent.fullName} updated!`);
    cancelEdit();
    loadStudents();
  };

  const editStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      studentId: student.studentId,
      fullName: student.fullName,
      class: student.class,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      parentPhone: student.parentPhone
    });
    setIdConfig({ prefix: '', nextNumber: 1, active: false });
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setNewStudent({
      studentId: '',
      fullName: '',
      class: '',
      gender: '',
      dateOfBirth: '',
      parentPhone: ''
    });
    setIdConfig({ prefix: '', nextNumber: 1, active: false });
  };

  const deleteStudent = (student) => {
    if (!confirm(`Delete student ${student.fullName} (${student.studentId})? This cannot be undone.`)) {
      return;
    }

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];

    Object.keys(classLists).forEach(className => {
      classLists[className] = classLists[className].filter(s => s.id !== student.id);
    });
    localStorage.setItem('classLists', JSON.stringify(classLists));

    const updatedUsers = users.filter(user => user.id !== student.id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert(`🗑️ ${student.fullName} deleted`);
    loadStudents();
  };

  const resetAutoId = () => {
    setIdConfig({ prefix: '', nextNumber: 1, active: false });
    setNewStudent(prev => ({ ...prev, studentId: '' }));
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">
        {editingStudent ? '✏️ Edit Student' : 'Student Enrollment'}
      </h2>

      <div className="mb-6 p-4 bg-blue-50 rounded border">
        <h3 className="font-semibold text-blue-800 mb-2">
          {idConfig.active ? '🚀 Auto-ID Mode' : editingStudent ? '✏️ Edit Mode' : '📝 Manual Mode'}
        </h3>
        <p className="text-blue-700 text-sm">
          {idConfig.active 
            ? `Auto-generating: ${idConfig.prefix}XXX • Next: ${idConfig.prefix}${idConfig.nextNumber.toString().padStart(3, '0')}`
            : editingStudent
            ? 'Editing student record'
            : 'Enter first ID (e.g., STU001) to start auto-generation'
          }
        </p>
      </div>

      {/* Bulk Import Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowBulkImport(!showBulkImport)}
          className={`px-4 py-2 rounded ${
            showBulkImport ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {showBulkImport ? '❌ Cancel Bulk Import' : '📥 Bulk Import Names'}
        </button>
      </div>

      {/* Bulk Import Form */}
      {showBulkImport && (
        <div className="mb-6 p-4 bg-purple-50 rounded border">
          <h3 className="font-semibold text-purple-800 mb-3">📥 Bulk Import Students</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Names (one per line)
              </label>
              <textarea
                value={bulkNames}
                onChange={(e) => setBulkNames(e.target.value)}
                className="w-full p-3 border rounded h-32"
                placeholder="John Doe&#10;Jane Smith&#10;Mike Brown&#10;Sarah Johnson"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Paste names from Excel/Word (one name per line)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <select
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Gender
                </label>
                <select
                  value={newStudent.gender}
                  onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleBulkImport}
              disabled={!bulkNames.trim() || !newStudent.class}
              className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              🚀 Import {bulkNames.split('\n').filter(n => n.trim()).length} Students
            </button>
          </div>
        </div>
      )}

      {/* Single Student Form */}
      {!showBulkImport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID *
            </label>
            <input
              type="text"
              value={newStudent.studentId}
              onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
              readOnly={idConfig.active && !editingStudent}
              className={`w-full p-2 border rounded ${(idConfig.active && !editingStudent) ? 'bg-gray-100' : ''}`}
              placeholder="STU001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={newStudent.fullName}
              onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <select
              value={newStudent.class}
              onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Class</option>
              {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={newStudent.gender}
              onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={newStudent.dateOfBirth}
              onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Phone
            </label>
            <input
              type="tel"
              value={newStudent.parentPhone}
              onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="080XXXXXXXX"
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              onClick={handleEnroll}
              className={`flex-1 text-white p-2 rounded ${
                editingStudent ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {editingStudent ? '💾 Update Student' : '🎓 Enroll Student'}
            </button>
            
            {editingStudent ? (
              <button
                onClick={cancelEdit}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                ❌ Cancel
              </button>
            ) : idConfig.active ? (
              <button
                onClick={resetAutoId}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                🔄 Reset ID
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Students List with Professional Table Design */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <h3 className="text-lg font-semibold">
            Enrolled Students ({filteredStudents.length})
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-full md:w-64"
            />
            <span className="absolute right-2 top-2 text-gray-400">🔍</span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            {searchTerm ? 'No students match your search' : 'No students enrolled yet'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 border-b text-left font-semibold sticky left-0 bg-gray-50 z-10 min-w-[150px]">Name</th>
                  <th className="py-3 px-4 border-b text-left font-semibold min-w-[100px]">Student ID</th>
                  <th className="py-3 px-4 border-b text-left font-semibold min-w-[100px]">Class</th>
                  <th className="py-3 px-4 border-b text-left font-semibold min-w-[80px]">Gender</th>
                  <th className="py-3 px-4 border-b text-left font-semibold min-w-[120px]">Date of Birth</th>
                  <th className="py-3 px-4 border-b text-left font-semibold min-w-[130px]">Parent Phone</th>
                  <th className="py-3 px-4 border-b text-left font-semibold min-w-[100px]">Actions</th>
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
                    <td className="py-3 px-4 min-w-[100px]">{student.class}</td>
                    <td className="py-3 px-4 min-w-[80px]">{student.gender}</td>
                    <td className="py-3 px-4 min-w-[120px]">{student.dateOfBirth || '-'}</td>
                    <td className="py-3 px-4 min-w-[130px]">{student.parentPhone || '-'}</td>
                    <td className="py-3 px-4 min-w-[100px]">
                      <div className="flex gap-1">
                        <button
                          onClick={() => editStudent(student)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteStudent(student)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
