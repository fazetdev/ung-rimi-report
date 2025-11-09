import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExam } from '../../context/ExamContext';
import { XMarkIcon, CheckCircleIcon, PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const StudentScoreCard = ({ student, index, currentClass, currentSubject, getStudentScore, calculateTotal, updateScore }) => {
  const studentIdentifier = `${student.id}-${currentClass}`;
  const scores = getStudentScore(studentIdentifier);
  const isComplete = scores.ca !== "" && scores.exam !== "";
  const total = calculateTotal(scores.ca, scores.exam);

  const handleScoreChange = (type, val) => {
    let num = val === "" ? "" : parseInt(val);
    if (num !== "" && isNaN(num)) num = 0;
    if (num !== "") {
      if (type === "ca") num = Math.max(0, Math.min(40, num));
      if (type === "exam") num = Math.max(0, Math.min(60, num));
    }
    updateScore(studentIdentifier, currentSubject, type, num);
  };

  const TotalBadge = ({ total }) => {
    let color = total >= 70 ? "bg-green-100 text-green-800"
      : total >= 50 ? "bg-indigo-100 text-indigo-800"
      : total >= 40 ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
    return <span className={`text-lg font-extrabold px-3 py-1 rounded-full ${color}`}>{total}</span>;
  };

  const StatusBadge = ({ isComplete }) => (
    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${isComplete ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
      {isComplete ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : <PencilIcon className="w-4 h-4 mr-1" />}
      {isComplete ? "Completed" : "Action Needed"}
    </span>
  );

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-xl mb-3 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-blue-800 truncate">{index + 1}. {student.fullName}</h3>
        <StatusBadge isComplete={isComplete} />
      </div>
      <div className="grid grid-cols-3 gap-2 items-center">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">CA (0-40)</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="40"
            value={scores.ca === "" ? "" : scores.ca}
            onChange={(e) => handleScoreChange("ca", e.target.value)}
            className="w-full h-10 p-2 border-2 border-gray-300 rounded-lg text-center text-base font-bold focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Exam (0-60)</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="60"
            value={scores.exam === "" ? "" : scores.exam}
            onChange={(e) => handleScoreChange("exam", e.target.value)}
            className="w-full h-10 p-2 border-2 border-gray-300 rounded-lg text-center text-base font-bold focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
        <div className="text-center">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Total</label>
          <div className="flex justify-center items-center h-10">
            <TotalBadge total={total} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ScoreCenter() {
  const { user } = useAuth();
  const { examData, updateScore } = useExam();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const assignedClasses = user?.assignedClasses || [];
  const assignedSubjects = user?.assignedSubjects || [];
  const currentClass = assignedClasses[0] || '';
  const currentSubject = assignedSubjects[0] || '';

  useEffect(() => {
    if (currentClass) {
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      const classStudents = classLists[currentClass] || [];
      const sorted = [...classStudents].sort((a, b) => a.fullName.localeCompare(b.fullName));
      setStudents(sorted);
    }
  }, [currentClass]);

  const filtered = useMemo(() => {
    if (!searchQuery) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(s => s.fullName.toLowerCase().includes(q));
  }, [students, searchQuery]);

  const getStudentScore = (id) => examData[id]?.[currentSubject] || { ca: "", exam: "" };
  const calcTotal = (ca, exam) => Math.min(100, (ca === "" ? 0 : +ca) + (exam === "" ? 0 : +exam));

  if (assignedClasses.length === 0 || assignedSubjects.length === 0)
    return (
      <div className="min-h-screen bg-white p-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="text-red-500 text-5xl mb-3">🚫</div>
          <h1 className="text-xl font-bold mb-2">No Teaching Assignment</h1>
          <p className="text-gray-600">Contact <b>VP Academic</b> to get assigned to classes and subjects.</p>
        </div>
      </div>
    );

  const completed = students.filter(s => {
    const id = `${s.id}-${currentClass}`;
    const sc = getStudentScore(id);
    return sc.ca !== "" && sc.exam !== "";
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border p-3 mb-3 shadow">
          <h1 className="text-lg md:text-2xl font-extrabold text-gray-900 flex items-center">
            <span className="mr-2 text-blue-600">📝</span> Score Entry: {currentSubject}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Class: <b className="text-blue-700">{currentClass}</b>
          </p>
        </div>

        <div className="mb-3 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-base shadow-sm"
          />
          {searchQuery && (
            <p className="text-xs text-gray-600 mt-1 ml-1">
              Showing {filtered.length} of {students.length} students
            </p>
          )}
        </div>

        {students.length === 0 ? (
          <div className="text-center bg-yellow-50 border border-yellow-300 rounded-xl p-6 shadow">
            <div className="text-yellow-500 text-5xl mb-3">⚠️</div>
            <p className="font-bold text-gray-800 mb-2">No Students Found in {currentClass}</p>
            <p className="text-gray-600 text-sm">Contact <b>VP Admin</b> to review the class roster.</p>
          </div>
        ) : (
          <>
            <div className="block lg:hidden space-y-2">
              {filtered.length > 0 ? filtered.map((s, i) => (
                <StudentScoreCard
                  key={`${s.id}-${currentClass}`}
                  student={s}
                  index={students.findIndex(st => st.id === s.id)}
                  currentClass={currentClass}
                  currentSubject={currentSubject}
                  getStudentScore={getStudentScore}
                  calculateTotal={calcTotal}
                  updateScore={updateScore}
                />
              )) : (
                <div className="text-center py-6 bg-white rounded-xl text-gray-600">No students found</div>
              )}
            </div>

            <div className="hidden lg:block bg-white shadow border rounded-xl overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">#</th>
                    <th className="px-4 py-3 text-left font-bold">Student Name</th>
                    <th className="px-4 py-3 text-center font-bold">CA (0-40)</th>
                    <th className="px-4 py-3 text-center font-bold">Exam (0-60)</th>
                    <th className="px-4 py-3 text-center font-bold">Total</th>
                    <th className="px-4 py-3 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => {
                    const id = `${s.id}-${currentClass}`;
                    const sc = getStudentScore(id);
                    const done = sc.ca !== "" && sc.exam !== "";
                    const total = calcTotal(sc.ca, sc.exam);
                    const handle = (t, v) => {
                      let num = v === "" ? "" : parseInt(v);
                      if (num !== "" && isNaN(num)) num = 0;
                      if (num !== "") {
                        if (t === "ca") num = Math.max(0, Math.min(40, num));
                        if (t === "exam") num = Math.max(0, Math.min(60, num));
                      }
                      updateScore(id, currentSubject, t, num);
                    };
                    return (
                      <tr key={id} className="border-b hover:bg-blue-50">
                        <td className="px-4 py-2">{students.findIndex(st => st.id === s.id) + 1}</td>
                        <td className="px-4 py-2 font-bold text-blue-800">{s.fullName}</td>
                        <td className="px-4 py-2 text-center">
                          <input type="number" inputMode="numeric" min="0" max="40"
                            value={sc.ca === "" ? "" : sc.ca}
                            onChange={(e) => handle("ca", e.target.value)}
                            className="w-16 h-8 text-center border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input type="number" inputMode="numeric" min="0" max="60"
                            value={sc.exam === "" ? "" : sc.exam}
                            onChange={(e) => handle("exam", e.target.value)}
                            className="w-16 h-8 text-center border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 text-center font-bold">
                          <span className={`px-2 py-1 rounded-full ${total >= 70 ? 'bg-green-100 text-green-800' : total >= 50 ? 'bg-indigo-100 text-indigo-800' : total >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{total}</span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${done ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
                            {done ? 'Done' : 'Need Score'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-gray-100 border-t mt-3 rounded-xl shadow-sm text-center text-sm font-medium text-gray-700">
              Score Entry Progress: <b className="text-blue-600">{completed}</b> of <b className="text-blue-600">{students.length}</b> students completed.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
