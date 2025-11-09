import React, { useState, useEffect } from "react";
import { useBulkPrint } from "../context/BulkPrintContext";
import PDFExportManager from "./PDFExportManager";

const BulkPrintManager = () => {
  const { selectedStudents, clearSelection } = useBulkPrint();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBulkPrint = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select students first");
      return;
    }

    setIsGenerating(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Generated reports for ${selectedStudents.length} students`);
      clearSelection();
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Bulk Report Generation</h2>
        <div className="text-sm text-gray-600">
          {selectedStudents.length} students selected
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p className="text-blue-800">
          Select students from the class list to generate their reports in bulk.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleBulkPrint}
          disabled={isGenerating || selectedStudents.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isGenerating ? "Generating..." : `Generate ${selectedStudents.length} Reports`}
        </button>
        
        {selectedStudents.length > 0 && (
          <button
            onClick={clearSelection}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Selection
          </button>
        )}
      </div>

      <PDFExportManager />
    </div>
  );
};

export default BulkPrintManager;
