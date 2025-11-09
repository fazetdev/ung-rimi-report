import React, { useState, useEffect } from "react";

const ClassManager = ({ user, dashboardData }) => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    setClasses(Object.keys(classLists));
  };

  const createClass = (e) => {
    e.preventDefault();
    
    if (!newClassName.trim()) {
      alert("Please enter a class name");
      return;
    }

    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    
    if (classLists[newClassName]) {
      alert("Class already exists!");
      return;
    }

    classLists[newClassName] = [];
    localStorage.setItem("classLists", JSON.stringify(classLists));
    
    setNewClassName("");
    loadClasses();
    alert(`Class "${newClassName}" created successfully!`);
  };

  const deleteClass = (className) => {
    if (!confirm(`Are you sure you want to delete class "${className}"?`)) return;

    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    delete classLists[className];
    localStorage.setItem("classLists", JSON.stringify(classLists));
    
    loadClasses();
    alert(`Class "${className}" deleted successfully!`);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Class Management</h2>
        
        {/* Create Class Form */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Create New Class</h3>
          <form onSubmit={createClass} className="flex gap-4">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Enter class name (e.g., JSS1A, SS2B)"
              className="flex-1 border p-2 rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Class
            </button>
          </form>
        </div>

        {/* Classes List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Existing Classes ({classes.length})
          </h3>
          
          {classes.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
              <p className="text-yellow-800">No classes created yet. Create your first class above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map(className => (
                <div key={className} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg">{className}</h4>
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
