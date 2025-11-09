import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExam } from "../../context/ExamContext";

export default function ExamBank() {
  const { user } = useAuth() || {};
  const { examData, updateScore, canUserEditSubject } = useExam();

  const [selectedClass, setSelectedClass] = useState(user?.classes?.[0] || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    setAllClasses(Object.keys(classLists));

    const schoolSubjects = JSON.parse(localStorage.getItem("schoolSubjects")) || [];
    setAllSubjects(schoolSubjects);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    setAllUsers(users);
  }, []);

  if (!user) return <p>Loading...</p>;

  const getClassStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    return classLists[className] || [];
  };

  // Helper: convert a name to Title Case safely
  const capitalizeName = (name = "") => {
    return name
      .toString()
      .trim()
      .split(/\s+/)
      .map((part) => {
        if (!part) return "";
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(" ");
  };

  // Load, capitalize and sort students for display only.
  const rawStudents = getClassStudents(selectedClass);
  const classStudents = (rawStudents || [])
    .map((s) => {
      // do not mutate original objects from storage; create a shallow copy
      return {
        ...s,
        fullName: capitalizeName(s.fullName || s.name || ""),
      };
    })
    .sort((a, b) => {
      const nA = (a.fullName || "").toLowerCase();
      const nB = (b.fullName || "").toLowerCase();
      if (nA < nB) return -1;
      if (nA > nB) return 1;
      return 0;
    });

  const filteredClasses = allClasses.filter((cls) =>
    cls.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentIdentifier = (student, className) => {
    if (!student) return "";
    // keep identifier logic unchanged (uses id and className)
    return `${student.id}-${className}`;
  };

  const getSubjectTeacherName = (subject) => {
    const subjectTeachers = allUsers.filter((teacherUser) => {
      const teacherSubjects = teacherUser.assignedSubjects || [];
      const teacherClasses = teacherUser.assignedClasses || [];
      return teacherSubjects.includes(subject) && teacherClasses.includes(selectedClass);
    });

    if (subjectTeachers.length > 0) {
      const teacher = subjectTeachers[0];
      return teacher.name || teacher.fullName || "Assigned Teacher";
    }

    const subjectOnlyTeachers = allUsers.filter((teacherUser) => {
      const teacherSubjects = teacherUser.assignedSubjects || [];
      return teacherSubjects.includes(subject);
    });

    if (subjectOnlyTeachers.length > 0) {
      const teacher = subjectOnlyTeachers[0];
      return `${teacher.name || teacher.fullName} (Not assigned to ${selectedClass})`;
    }

    return "No Teacher Assigned";
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-[100vw] overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-6">Exam Bank - Score Management</h2>

      <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
        <p className="text-blue-800 text-sm sm:text-base">
          <strong>Welcome, {user.fullName || user.name}!</strong>
          {user.role === "Teacher" && user.assignedSubjects && (
            <span> - Teaching: {user.assignedSubjects.join(", ")}</span>
          )}
        </p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Classes:</label>
            <input
              type="text"
              placeholder="Type to search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Choose a class</option>
              {filteredClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {searchTerm === "" && allClasses.length > 0 && (
          <div className="pt-2">
            <p className="text-sm text-gray-600 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {allClasses.slice(0, 6).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1 rounded text-sm transition ${
                    selectedClass === cls
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!selectedClass ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center text-blue-800 text-lg">
          👆 Select a class above to view scores
        </div>
      ) : classStudents.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-yellow-800">
          <strong>No students found in {selectedClass}.</strong>
          <br />
          VP Admin needs to enroll students first.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow border p-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              📊 {selectedClass} - Score Overview
            </h3>
            <p className="text-gray-600 text-sm">
              {classStudents.length} students • {allSubjects.length} subjects
            </p>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-w-[100vw] max-h-[80vh] bg-white rounded-lg shadow border">
            <table className="min-w-full text-sm sm:text-base">
              <thead className="bg-gray-100 sticky top-0 z-20">
                <tr>
                  <th className="p-3 text-left font-semibold border-b sticky left-0 bg-gray-100 z-30">
                    Student Name
                  </th>
                  {allSubjects.map((subject) => (
                    <th
                      key={subject}
                      className="p-3 text-center font-semibold border-b border-l min-w-[150px]"
                      colSpan="3"
                    >
                      <div>
                        {subject}
                        <div className="text-xs font-normal text-gray-600 mt-1 whitespace-nowrap">
                          {getSubjectTeacherName(subject)}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="p-2 border-b sticky left-0 bg-gray-100 z-30"></th>
                  {allSubjects.map((subject) => (
                    <React.Fragment key={subject}>
                      <th className="p-2 text-xs font-medium border-b border-l">CA</th>
                      <th className="p-2 text-xs font-medium border-b">Exam</th>
                      <th className="p-2 text-xs font-medium border-b">Total</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student) => {
                  const sid = getStudentIdentifier(student, selectedClass);
                  return (
                    <tr key={sid} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-medium sticky left-0 bg-white border-r whitespace-nowrap">
                        {student.fullName}
                      </td>
                      {allSubjects.map((subject) => {
                        const scores = examData[sid]?.[subject] || {
                          ca: "",
                          exam: "",
                          total: 0,
                        };
                        const editable = canUserEditSubject(user, subject);
                        return (
                          <React.Fragment key={`${sid}_${subject}`}>
                            <td className="p-1 border-l text-center">
                              <input
                                type="number"
                                min="0"
                                max="40"
                                value={scores.ca}
                                onChange={(e) => updateScore(sid, subject, "ca", e.target.value)}
                                disabled={!editable}
                                className="w-14 sm:w-16 p-1 border rounded text-center disabled:bg-gray-100 focus:ring-2 focus:ring-blue-300"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-1 text-center">
                              <input
                                type="number"
                                min="0"
                                max="60"
                                value={scores.exam}
                                onChange={(e) =>
                                  updateScore(sid, subject, "exam", e.target.value)
                                }
                                disabled={!editable}
                                className="w-14 sm:w-16 p-1 border rounded text-center disabled:bg-gray-100 focus:ring-2 focus:ring-blue-300"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-2 text-center font-medium bg-blue-50">
                              <span
                                className={`px-2 py-1 rounded text-xs sm:text-sm ${
                                  scores.total >= 70
                                    ? "bg-green-100 text-green-800"
                                    : scores.total >= 50
                                    ? "bg-blue-100 text-blue-800"
                                    : scores.total >= 40
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {scores.total || 0}
                              </span>
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 md:hidden bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-orange-700 text-sm">
              💡 <strong>Mobile Tip:</strong> Swipe sideways to view all subjects
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• VP Academic creates subjects and assigns teachers</li>
              <li>• VP Admin enrolls students</li>
              <li>• Teachers enter scores instantly visible</li>
              <li>• Teacher names shown above each subject</li>
              <li>• CA: 0-40 | Exam: 0-60 | Total: 0-100</li>
              <li>• Colors: 🟢 70+ | 🔵 50-69 | 🟡 40-49 | 🔴 Below 40</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
