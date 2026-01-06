import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './ConclusionPage.css';

interface Session {
  id: string;
  patientId: string;
  patient: {
    fullName: string;
    idNumber: string;
  };
  specialtyRanks: Record<string, number>;
  finalRank: string | null;
  status: string;
}

const rankNames: Record<string, string> = {
  RANK_I: 'Loại I - Hoàn toàn đủ sức khỏe',
  RANK_II: 'Loại II - Đủ sức khỏe',
  RANK_III: 'Loại III - Sức khỏe chưa đạt',
  RANK_IV: 'Loại IV - Cần chữa trị',
  RANK_V: 'Loại V - Mất sức khỏe lao động',
  FAILED: '❌ Không đạt',
};

const rankColors: Record<string, string> = {
  RANK_I: 'rank-1',
  RANK_II: 'rank-2',
  RANK_III: 'rank-3',
  RANK_IV: 'rank-4',
  RANK_V: 'rank-5',
  FAILED: 'rank-failed',
};

const ConclusionPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [selectedRank, setSelectedRank] = useState<string>('');

  // Load batch and sessions
  useEffect(() => {
    if (!batchId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [batchData, sessionsData] = await Promise.all([
          api.getBatch(batchId),
          api.getBatchVisits(batchId),
        ]);

        setBatch(batchData);
        setSessions(sessionsData.filter((s: any) => s.finalRank)); // Only completed sessions
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [batchId]);

  const handleOverrideRank = async () => {
    if (!selectedRank || !overrideReason) {
      alert('Vui lòng chọn loại khám và nhập lý do');
      return;
    }

    const currentSession = sessions[currentSessionIndex];
    if (!currentSession) return;

    try {
      await api.updateSessionSpecialtyRank(
        currentSession.id,
        'Override',
        getRankValue(selectedRank),
      );

      // Update local state
      const updatedSessions = [...sessions];
      updatedSessions[currentSessionIndex].finalRank = selectedRank;
      setSessions(updatedSessions);

      setShowOverrideForm(false);
      setOverrideReason('');
      setSelectedRank('');
    } catch (err: any) {
      alert('Lỗi khi cập nhật loại khám');
    }
  };

  const getRankValue = (rankName: string): number => {
    const rankMap: Record<string, number> = {
      RANK_I: 1,
      RANK_II: 2,
      RANK_III: 3,
      RANK_IV: 4,
      RANK_V: 5,
      FAILED: 99,
    };
    return rankMap[rankName] || 1;
  };

  const handleNextSession = () => {
    if (currentSessionIndex < sessions.length - 1) {
      setCurrentSessionIndex(currentSessionIndex + 1);
      setShowOverrideForm(false);
    } else {
      // All done - go to completion page
      navigate(`/history/${batchId}`);
    }
  };

  const handlePreviousSession = () => {
    if (currentSessionIndex > 0) {
      setCurrentSessionIndex(currentSessionIndex - 1);
      setShowOverrideForm(false);
    }
  };

  const handleFinish = async () => {
    try {
      // Lock and mark batch as completed
      await api.lockBatch(batchId!);
      navigate(`/history/${batchId}`);
    } catch (err: any) {
      alert('Lỗi khi hoàn thành phiên khám');
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="conclusion-page">
        <div className="empty-message">
          <p>Không có phiên khám nào để hiển thị kết quả</p>
          <button onClick={() => navigate(`/clinical/${batchId}`)}>
            ← Quay lại khám chuyên khoa
          </button>
        </div>
      </div>
    );
  }

  const currentSession = sessions[currentSessionIndex];
  const rankClass = rankColors[currentSession.finalRank || 'RANK_I'];

  return (
    <div className="conclusion-page">
      <h1>Bước 4: Kết Luận Khám Sức Khỏe</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="conclusion-layout">
        {/* Left: Session Navigation */}
        <div className="session-nav-panel">
          <h2>Danh Sách Bệnh Nhân</h2>
          <div className="session-counter">
            {currentSessionIndex + 1} / {sessions.length}
          </div>

          <div className="session-list">
            {sessions.map((session, index) => (
              <button
                key={session.id}
                onClick={() => setCurrentSessionIndex(index)}
                className={`session-item ${index === currentSessionIndex ? 'active' : ''}`}
              >
                <span className="session-name">{session.patient.fullName}</span>
                <span className={`rank-badge ${rankColors[session.finalRank || 'RANK_I']}`}>
                  {session.finalRank || '-'}
                </span>
              </button>
            ))}
          </div>

          <div className="nav-buttons">
            <button
              onClick={handlePreviousSession}
              disabled={currentSessionIndex === 0}
              className="btn-nav"
            >
              ← Trước
            </button>
            <button
              onClick={handleNextSession}
              disabled={currentSessionIndex === sessions.length - 1}
              className="btn-nav"
            >
              Tiếp →
            </button>
          </div>
        </div>

        {/* Right: Session Details & Override Form */}
        <div className="session-details-panel">
          <div className="patient-header">
            <h2>{currentSession.patient.fullName}</h2>
            <p className="patient-id">CMND: {currentSession.patient.idNumber}</p>
          </div>

          {/* Specialty Results */}
          <div className="specialty-results">
            <h3>Kết Quả Chuyên Khoa</h3>
            <div className="results-grid">
              {Object.entries(currentSession.specialtyRanks).map(([specialty, rank]) => (
                <div key={specialty} className={`result-card ${rankColors[`RANK_${Roman(rank)}`] || ''}`}>
                  <div className="specialty-name">{specialty}</div>
                  <div className="rank-value">Loại {Roman(rank as number)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Rank */}
          <div className={`final-rank-card ${rankClass}`}>
            <h2>Kết Luận Cuối Cùng</h2>
            <div className="rank-display">
              <div className={`rank-number ${rankClass}`}>{currentSession.finalRank}</div>
              <div className="rank-description">{rankNames[currentSession.finalRank || 'RANK_I']}</div>
            </div>
          </div>

          {/* Override Form */}
          <div className="override-section">
            <button
              onClick={() => setShowOverrideForm(!showOverrideForm)}
              className="btn-override"
            >
              ⚙ {showOverrideForm ? 'Hủy Ghi Đè' : 'Ghi Đè Kết Quả'}
            </button>

            {showOverrideForm && (
              <div className="override-form">
                <p className="form-note">
                  ⚠ Chỉ Trưởng Phòng hoặc quản trị viên có thể ghi đè kết quả
                </p>

                <div className="form-group">
                  <label>Loại Khám Mới</label>
                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="form-control"
                  >
                    <option value="">-- Chọn --</option>
                    <option value="RANK_I">Loại I</option>
                    <option value="RANK_II">Loại II</option>
                    <option value="RANK_III">Loại III</option>
                    <option value="RANK_IV">Loại IV</option>
                    <option value="RANK_V">Loại V</option>
                    <option value="FAILED">Không Đạt</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Lý Do Ghi Đè</label>
                  <textarea
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Nhập lý do ghi đè..."
                    className="form-control"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleOverrideRank}
                  disabled={!selectedRank || !overrideReason}
                  className="btn-submit"
                >
                  Xác Nhận Ghi Đè
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={() => navigate(`/clinical/${batchId}`)}
              className="btn-secondary"
            >
              ← Quay Lại Khám
            </button>
            <button
              onClick={handleFinish}
              className="btn-primary"
            >
              ✓ Hoàn Thành Phiên Khám
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert number to Roman numerals
function Roman(num: number): string {
  const romanMap: Record<number, string> = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
  };
  return romanMap[num] || `${num}`;
}

export default ConclusionPage;
