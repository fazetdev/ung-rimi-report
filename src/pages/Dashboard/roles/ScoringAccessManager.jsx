import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const ScoringAccessManager = () => {
  const { user } = useAuth();

  const assignScoringToTeachers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let updatedCount = 0;
    
    const teachingRoles = ['Teacher', 'Subject Teacher', 'Form Master', 'VP Academic', 'Principal', 'Admin'];
    
    const updatedUsers = users.map(user => {
      if (teachingRoles.includes(user.role)) {
        const hasScoring = user.functions?.includes('scoring_enter');
        if (!hasScoring) {
          updatedCount++;
          return {
            ...user,
            functions: [...(user.functions || []), 'scoring_enter']
          };
        }
      }
      return user;
    });
    
    if (updatedCount > 0) {
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert(`✅ Assigned scoring function to ${updatedCount} users. Please refresh the page.`);
    } else {
      alert('All teaching staff already have scoring access.');
    }
  };

  if (user?.role !== 'Admin') {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Scoring Access Manager</h3>
      <p className="text-gray-600 mb-4">
        This utility will assign the scoring function to all teaching staff roles.
      </p>
      <button
        onClick={assignScoringToTeachers}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        🔧 Assign Scoring to All Teachers
      </button>
    </div>
  );
};

export default ScoringAccessManager;
