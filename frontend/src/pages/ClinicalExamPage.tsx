import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import DynamicForm from '../components/DynamicForm';
import './ClinicalExamPage.css';

interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  gender: string;
}

interface Specialty {
  id: string;
  name: string;
  isActive: boolean;
}

const ClinicalExamPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  const specialties = [
    'Internal Medicine',
    'Ophthalmology',
    'Dentistry',
    'Laboratory',
    'X-Ray',
    'ECG',
    'Ultrasound',
    'Drug Rehabilitation Assessment',
  ];

  // Load batch and patients
  useEffect(() => {
    if (!batchId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [batchData, patientsData, statsData] = await Promise.all([
          api.getBatch(batchId),
          api.getPendingPatients(batchId),
          api.getVisitStatistics(batchId),
        ]);

        setBatch(batchData);
        setPatients(patientsData);
        setStatistics(statsData);

        if (patientsData.length > 0) {
          // Create first session
          await createSession(patientsData[0].id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [batchId]);

  // Create session for patient
  const createSession = async (patientId: string) => {
    try {
      const session = await api.createSession(patientId, batchId!);
      setSessionId(session.id);
      setSelectedSpecialty(''); // Reset specialty selection
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo phiên khám');
    }
  };

  // Handle form submission (save clinical data)
  const handleSubmitData = async (formData: any) => {
    if (!sessionId || !selectedSpecialty) return;

    try {
      setSubmitting(true);
      setError(null);

      // Save clinical data for specialty
      await api.updateSessionClinicalData(sessionId, selectedSpecialty, formData);

      // Calculate health rank for specialty
      const calculatedRank = calculateRank(selectedSpecialty, formData);
      await api.updateSessionSpecialtyRank(sessionId, selectedSpecialty, calculatedRank);

      setSuccessMessage(`✓ Lưu dữ liệu khám ${selectedSpecialty} thành công`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset form
      setSelectedSpecialty('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate health rank based on specialty and data
  const calculateRank = (specialty: string, data: any): number => {
    // This is a simplified calculation
    // In production, this would be done on the backend via HealthRankEngine

    if (specialty === 'Internal Medicine') {
      const bpSystolic = parseInt(data.bpSystolic) || 0;
      const bpDiastolic = parseInt(data.bpDiastolic) || 0;

      if (bpSystolic >= 160 || bpDiastolic >= 100) return 5; // RANK_V
      if (bpSystolic >= 140 || bpDiastolic >= 90) return 4; // RANK_IV
      if (bpSystolic >= 130 || bpDiastolic >= 85) return 3; // RANK_III
      return 1; // RANK_I
    }

    // Default to lowest rank
    return 1;
  };

  // Move to next patient
  const handleNextPatient = () => {
    if (currentPatientIndex < patients.length - 1) {
      const nextIndex = currentPatientIndex + 1;
      setCurrentPatientIndex(nextIndex);
      createSession(patients[nextIndex].id);
    } else {
      // All patients done - go to conclusion page
      navigate(`/conclusion/${batchId}`);
    }
  };

  // Move to previous patient
  const handlePreviousPatient = () => {
    if (currentPatientIndex > 0) {
      const prevIndex = currentPatientIndex - 1;
      setCurrentPatientIndex(prevIndex);
      createSession(patients[prevIndex].id);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  const currentPatient = patients[currentPatientIndex];

  return (
    <div className="clinical-exam-page">
      <div className="page-header">
        <h1>Bước 2: Khám Chuyên Khoa</h1>
        {batch && <p className="batch-info">Phiên khám: {batch.name}</p>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="exam-layout">
        {/* Left Panel: Patient List & Info */}
        <div className="patient-panel">
          <h2>Danh Sách Bệnh Nhân</h2>
          <div className="patient-counter">
            {currentPatientIndex + 1} / {patients.length}
          </div>

          {currentPatient && (
            <div className="patient-info-card">
              <h3>{currentPatient.fullName}</h3>
              <div className="info-row">
                <label>CMND:</label>
                <span>{currentPatient.idNumber}</span>
              </div>
              <div className="info-row">
                <label>Ngày Sinh:</label>
                <span>{new Date(currentPatient.dateOfBirth).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="info-row">
                <label>Giới Tính:</label>
                <span>{currentPatient.gender === 'M' ? 'Nam' : 'Nữ'}</span>
              </div>
            </div>
          )}

          <div className="patient-navigation">
            <button
              onClick={handlePreviousPatient}
              disabled={currentPatientIndex === 0}
              className="btn-nav"
            >
              ← Trước
            </button>
            <button
              onClick={handleNextPatient}
              disabled={currentPatientIndex === patients.length - 1 && !selectedSpecialty}
              className="btn-nav"
            >
              Tiếp → 
            </button>
          </div>

          {statistics && (
            <div className="statistics-card">
              <h3>Tiến Độ</h3>
              <div className="stat-row">
                <span>Hoàn thành:</span>
                <strong>{statistics.completed}</strong>
              </div>
              <div className="stat-row">
                <span>Đang khám:</span>
                <strong>{statistics.inProgress}</strong>
              </div>
              <div className="stat-row">
                <span>Chưa khám:</span>
                <strong>{statistics.pending}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Form */}
        <div className="exam-form-panel">
          <h2>Chọn Chuyên Khoa</h2>

          <div className="specialty-selector">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`specialty-btn ${selectedSpecialty === specialty ? 'active' : ''}`}
              >
                {specialty}
              </button>
            ))}
          </div>

          {selectedSpecialty && (
            <div className="form-container">
              <h3>Nhập Kết Quả Khám: {selectedSpecialty}</h3>
              <DynamicForm
                specialty={selectedSpecialty}
                examinationType={batch?.examinationType || 'CIVIL'}
                onSubmit={handleSubmitData}
                loading={submitting}
              />
            </div>
          )}

          {!selectedSpecialty && (
            <div className="empty-state">
              <p>👆 Chọn chuyên khoa để bắt đầu nhập dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalExamPage;
