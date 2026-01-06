import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import PatientList from './pages/PatientList'
import ExaminationForm from './pages/ExaminationForm'
import ExaminationHistory from './pages/ExaminationHistory'
import XrayPage from './pages/XrayPage'
import XrayFormPage from './pages/XrayFormPage'
import ECGFormPage from './pages/ECGFormPage'
import UltrasoundFormPage from './pages/UltrasoundFormPage'
import LabTestFormPage from './pages/LabTestFormPage'
import ConclusionPageSimple from './pages/ConclusionPageSimple'
import ExaminationResults from './pages/ExaminationResults'
import { initializeSampleData } from './utils/initializeData'

function App() {
  useEffect(() => {
    // Khởi tạo dữ liệu mẫu nếu chưa có
    initializeSampleData()
  }, [])

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/examination" element={<ExaminationForm />} />
            <Route path="/patient-list" element={<PatientList />} />
            <Route path="/examination-menu" element={<Home />} />
            <Route path="/history" element={<ExaminationHistory />} />
            <Route path="/xray" element={<XrayPage />} />
            <Route path="/xray-form" element={<XrayFormPage />} />
            <Route path="/ecg-form" element={<ECGFormPage />} />
            <Route path="/ultrasound-form" element={<UltrasoundFormPage />} />
            <Route path="/lab-test-form" element={<LabTestFormPage />} />
            <Route path="/conclusion" element={<ConclusionPageSimple />} />
            <Route path="/examination-results/:patientName" element={<ExaminationResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
