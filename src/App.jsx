import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ExamProvider } from "./context/ExamContext";
import { BulkPrintProvider } from "./context/BulkPrintContext";
import { initializeSystem } from "./utils/ensureAdminUser";

// Lazy load components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const DashboardLayout = lazy(() => import("./pages/Dashboard/DashboardLayout"));
const UnifiedDashboard = lazy(() => import("./pages/Dashboard/UnifiedDashboard"));
const ExamBank = lazy(() => import("./pages/Dashboard/ExamBank"));
const ScoreCenter = lazy(() => import("./pages/Dashboard/ScoreCenter"));
const ProfileCard = lazy(() => import("./pages/Dashboard/ProfileCard"));
const ReportCardDashboard = lazy(() => import("./pages/Dashboard/ReportCardDashboard"));
const BulkReportCenter = lazy(() => import("./pages/Dashboard/BulkReportCenter"));
const TeachingPortal = lazy(() => import("./pages/Dashboard/TeachingPortal"));

// Async initialization
const initializeAppData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Initialize users first
      initializeSystem();

      if (!localStorage.getItem('classLists')) {
        localStorage.setItem('classLists', JSON.stringify({}));
      }
      if (!localStorage.getItem('attendanceData')) {
        localStorage.setItem('attendanceData', JSON.stringify({}));
      }
      if (!localStorage.getItem('schoolFinanceData')) {
        localStorage.setItem('schoolFinanceData', JSON.stringify({
          feePayments: [],
          feeStructure: {},
          staffSalaries: [],
          expenses: [],
          deductionSettings: { lateComing: 500, absence: 2000 },
          financePassword: 'school123'
        }));
      }
      if (!localStorage.getItem('schoolStaff')) {
        localStorage.setItem('schoolStaff', JSON.stringify([]));
      }

      resolve(true);
    }, 100);
  });
};

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    initializeAppData().then(() => {
      setAppInitialized(true);
    });
  }, []);

  if (!appInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="profile" element={<ProfileCard />} />
            <Route path="exambank" element={<ExamBank />} />
            <Route path="score-center" element={<ScoreCenter />} />
            <Route path="bulk-reports" element={<BulkReportCenter />} />
            <Route path="exam-officer/report-cards" element={<ReportCardDashboard />} />
            <Route path="teaching-portal" element={<TeachingPortal />} />
            <Route path="principal" element={<UnifiedDashboard />} />
            <Route path="vp-admin" element={<UnifiedDashboard />} />
            <Route path="vp-academic" element={<UnifiedDashboard />} />
            <Route path="senior-master" element={<UnifiedDashboard />} />
            <Route path="exam-officer" element={<UnifiedDashboard />} />
            <Route path="form-master" element={<UnifiedDashboard />} />
            <Route path="teacher" element={<UnifiedDashboard />} />
            <Route path="admin" element={<UnifiedDashboard />} />
            <Route index element={<UnifiedDashboard />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-blue-600 hover:text-blue-800 underline">Return to Home</a>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ExamProvider>
          <BulkPrintProvider>
            <AppContent />
          </BulkPrintProvider>
        </ExamProvider>
      </AuthProvider>
    </Router>
  );
}
