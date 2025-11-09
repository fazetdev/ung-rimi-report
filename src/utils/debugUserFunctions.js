// Debug utility to check user functions
export const debugUserFunctions = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  
  console.log('=== DEBUG USER FUNCTIONS ===');
  console.log('All users:', users);
  console.log('Current user:', currentUser);
  console.log('Current user functions:', currentUser.functions);
  
  // Check if scoring_enter is in functions
  const hasScoring = currentUser.functions?.includes('scoring_enter');
  console.log('Has scoring_enter:', hasScoring);
  
  // Test both menu functions
  const { getUserMenuItems: getMenu1 } = await import('../data/functionMenus');
  const { getUserMenuItems: getMenu2 } = await import('./functionPermissions');
  
  const menu1 = getMenu1(currentUser.functions || []);
  const menu2 = getMenu2(currentUser);
  
  console.log('Menu from functionMenus.js:', menu1);
  console.log('Menu from functionPermissions.js:', menu2);
  
  return { currentUser, hasScoring, menu1, menu2 };
};

// Run this in browser console
window.debugUserFunctions = debugUserFunctions;
