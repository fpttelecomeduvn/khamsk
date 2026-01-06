import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReceptionPage from './pages/ReceptionPage';
import ClinicalExamPage from './pages/ClinicalExamPage';
import ConclusionPage from './pages/ConclusionPage';
import HistoryPage from './pages/HistoryPage';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import ExaminationHistory from './pages/ExaminationHistory';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/history" element={<ExaminationHistory />} />

        {/* Examination Workflow */}
        <Route path="/reception" element={<ReceptionPage />} />
        <Route path="/clinical/:batchId" element={<ClinicalExamPage />} />
        <Route path="/conclusion/:batchId" element={<ConclusionPage />} />
        <Route path="/history/:batchId" element={<HistoryPage />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
