// Test utility for student identifier
export const testStudentIdentifier = () => {
  const testStudent = { id: '123', fullName: 'John Doe' };
  const testStudent2 = { fullName: 'Jane Smith' };
  
  const identifier1 = getStudentIdentifier(testStudent, 'Class1');
  const identifier2 = getStudentIdentifier(testStudent2, 'Class1');
  
  console.log('Test Student 1 ID:', identifier1); // Should be "123"
  console.log('Test Student 2 ID:', identifier2); // Should be "Class1_Jane_Smith"
  
  return { identifier1, identifier2 };
};
