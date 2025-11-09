// Utility to assign scoring function to users who need it
export const assignScoringToTeachers = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  let updatedCount = 0;
  
  // Roles that typically need scoring access
  const teachingRoles = ['Teacher', 'Subject Teacher', 'Form Master', 'VP Academic', 'Principal', 'Admin'];
  
  const updatedUsers = users.map(user => {
    if (teachingRoles.includes(user.role)) {
      // Check if user already has scoring function
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
    console.log(`✅ Assigned scoring function to ${updatedCount} users`);
  }
  
  return updatedCount;
};

// Run this to fix missing scoring functions
export const fixScoringAccess = () => {
  const fixedCount = assignScoringToTeachers();
  if (fixedCount > 0) {
    alert(`Fixed scoring access for ${fixedCount} users. Please refresh the page.`);
  } else {
    alert('All teaching staff already have scoring access.');
  }
};
