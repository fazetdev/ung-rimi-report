import React, { useState, useEffect } from "react";

const ClassManager = ({ user, dashboardData }) => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    const schoolClasses = JSON.parse(localStorage.getItem("schoolClasses")) || [];
    if (Array.isArray(schoolClasses)) {
      const classNames = schoolClasses.map(cls => cls.name || cls.className || "").filter(Boolean);
      setClasses(classNames);
    } else {
      setClasses(Object.keys(schoolClasses));
    }
  };

  const createClass = () => {
    if (!newClassName.trim()) {
      alert("Please enter a class name");
      return;
    }

    const schoolClasses = JSON.parse(localStorage.getItem("schoolClasses")) || [];

    // Check if class already exists
    let classExists = false;
    if (Array.isArray(schoolClasses)) {
      classExists = schoolClasses.some(cls => (cls.name || cls.className) === newClassName);
    } else {
      classExists = schoolClasses.hasOwnProperty(newClassName);
    }

    if (classExists) {
      alert("Class already exists!");
      return;
    }

    // Save as array format
    const updatedClasses = Array.isArray(schoolClasses) 
      ? [...schoolClasses, { name: newClassName, subjects: [] }]
      : [...Object.keys(schoolClasses).map(key => ({ name: key })), { name: newClassName, subjects: [] }];

    localStorage.setItem("schoolClasses", JSON.stringify(updatedClasses));
    setNewClassName("");
    loadClasses();
    alert(`Class "${newClassName}" created successfully!`);
  };

  const deleteClass = (className) => {
    if (!confirm(`Are you sure you want to delete class "${className}"?`)) return;

    const schoolClasses = JSON.parse(localStorage.getItem("schoolClasses")) || [];
    
    let updatedClasses;
    if (Array.isArray(schoolClasses)) {
      updatedClasses = schoolClasses.filter(cls => (cls.name || cls.className) !== className);
    } else {
      updatedClasses = { ...schoolClasses };
      delete updatedClasses[className];
    }

    localStorage.setItem("schoolClasses", JSON.stringify(updatedClasses));
    loadClasses();
    alert(`Class "${className}" deleted successfully!`);
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Class Management</h2>

        {/* Create Class Form - SIMPLIFIED */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-3">Create New Class</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Enter class name (e.g., JSS1A, SS2B)"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={createClass}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium whitespace-nowrap"
            >
              Create Class
            </button>
          </div>
        </div>

        {/* Classes List */}
        <div>
          <h3 className="font-semibold mb-3">
            Existing Classes ({classes.length})
          </h3>

          {classes.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-center">
              <p className="text-yellow-800">No classes created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classes.map(className => (
                <div key={className} className="bg-gray-50 p-3 rounded border">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{className}</h4>
                    <button
                      onClick={() => deleteClass(className)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassManager;
