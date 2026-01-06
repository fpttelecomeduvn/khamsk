import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './HistoryPage.css';

interface Session {
  id: string;
  patientId: string;
  patient: {
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
  };
  specialtyRanks: Record<string, number>;
  finalRank: string;
  status: string;
  completedAt: string;
}

interface BatchStatistics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  rankDistribution: Record<string, number>;
}

const rankNames: Record<string, string> = {
  RANK_I: 'Loại I',
  RANK_II: 'Loại II',
  RANK_III: 'Loại III',
  RANK_IV: 'Loại IV',
  RANK_V: 'Loại V',
  FAILED: 'Không Đạt',
};

const HistoryPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<BatchStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRank, setFilterRank] = useState<string>('ALL');

  useEffect(() => {
    if (!batchId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [batchData, sessionsData, statsData] = await Promise.all([
          api.getBatch(batchId),
          api.getBatchVisits(batchId),
          api.getVisitStatistics(batchId),
        ]);

        setBatch(batchData);
        setSessions(sessionsData.filter((s: any) => s.status === 'COMPLETED'));
        setStats(statsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [batchId]);

  const getRankColor = (rank: string): string => {
    const colorMap: Record<string, string> = {
      RANK_I: 'rank-1',
      RANK_II: 'rank-2',
      RANK_III: 'rank-3',
      RANK_IV: 'rank-4',
      RANK_V: 'rank-5',
      FAILED: 'rank-failed',
    };
    return colorMap[rank] || 'rank-1';
  };

  const filteredSessions =
    filterRank === 'ALL'
      ? sessions
      : sessions.filter((s) => s.finalRank === filterRank);

  const handleExportPDF = () => {
    alert('Tính năng export PDF sẽ được kích hoạt');
  };

  const handleExportExcel = () => {
    alert('Tính năng export Excel sẽ được kích hoạt');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="history-page">
      <h1>Bước 5: Lịch Sử & Thống Kê Khám Sức Khỏe</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {batch && (
        <div className="batch-header">
          <div className="batch-info-card">
            <h2>{batch.name}</h2>
            <div className="info-row">
              <span>Loại Khám:</span>
              <strong>
                {batch.examinationType === 'CIVIL'
                  ? 'Khám Định Kỳ'
                  : batch.examinationType === 'POLICE'
                    ? 'Khám Cảnh Sát'
                    : 'Khám Tái Hòa Nhập'}
              </strong>
            </div>
            <div className="info-row">
              <span>Ngày Khám:</span>
              <strong>{new Date(batch.examinationDate).toLocaleDateString('vi-VN')}</strong>
            </div>
            <div className="info-row">
              <span>Trạng Thái:</span>
              <strong>{batch.isCompleted ? '✓ Hoàn Thành' : 'Đang Khám'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="statistics-section">
          <h2>Thống Kê Khám Sức Khỏe</h2>

          <div className="stats-overview">
            <div className="stat-box stat-total">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Tổng Bệnh Nhân</div>
            </div>
            <div className="stat-box stat-completed">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Hoàn Thành</div>
            </div>
            <div className="stat-box stat-inprogress">
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-label">Đang Khám</div>
            </div>
            <div className="stat-box stat-pending">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Chưa Khám</div>
            </div>
          </div>

          <div className="rank-distribution">
            <h3>Phân Bố Loại Khám</h3>
            <div className="distribution-grid">
              {Object.entries(stats.rankDistribution).map(([rank, count]) => (
                <div key={rank} className={`distribution-item ${getRankColor(rank)}`}>
                  <div className="rank-count">{count}</div>
                  <div className="rank-label">{rankNames[rank] || rank}</div>
                  <div className="rank-percentage">
                    {stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="results-section">
        <div className="results-header">
          <h2>Danh Sách Kết Quả Khám</h2>
          <div className="results-actions">
            <select
              value={filterRank}
              onChange={(e) => setFilterRank(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tất Cả Loại Khám</option>
              <option value="RANK_I">Loại I</option>
              <option value="RANK_II">Loại II</option>
              <option value="RANK_III">Loại III</option>
              <option value="RANK_IV">Loại IV</option>
              <option value="RANK_V">Loại V</option>
              <option value="FAILED">Không Đạt</option>
            </select>

            <button onClick={handleExportPDF} className="btn-export">
              📄 PDF
            </button>
            <button onClick={handleExportExcel} className="btn-export">
              📊 Excel
            </button>
            <button onClick={handlePrint} className="btn-export">
              🖨 In
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Họ Tên</th>
                <th>CMND</th>
                <th>Tuổi</th>
                <th>Loại Khám</th>
                <th>Chuyên Khoa</th>
                <th>Ngày Hoàn Thành</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, index) => (
                <tr key={session.id}>
                  <td>{index + 1}</td>
                  <td className="name-cell">{session.patient.fullName}</td>
                  <td>{session.patient.idNumber}</td>
                  <td>{calculateAge(session.patient.dateOfBirth)}</td>
                  <td>
                    <span className={`rank-badge ${getRankColor(session.finalRank)}`}>
                      {rankNames[session.finalRank]}
                    </span>
                  </td>
                  <td>
                    <div className="specialties-list">
                      {Object.entries(session.specialtyRanks).map(([specialty, rank]) => (
                        <span key={specialty} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{new Date(session.completedAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSessions.length === 0 && (
          <div className="empty-results">
            <p>Không có kết quả nào phù hợp với bộ lọc được chọn</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={() => navigate('/')} className="btn-primary">
          ← Quay Lại Trang Chủ
        </button>
        {batch && !batch.isCompleted && (
          <button onClick={() => navigate(`/clinical/${batchId}`)} className="btn-secondary">
            ↻ Tiếp Tục Khám
          </button>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate age
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default HistoryPage;
