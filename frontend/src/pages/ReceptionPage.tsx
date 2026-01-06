import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './ReceptionPage.css';

interface BatchFormData {
  batchName: string;
  batchDate: string;
  examinationType: 'CIVIL' | 'POLICE' | 'DRUG_REHAB';
}

interface PatientRow {
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  gender: 'M' | 'F';
  phone: string;
  address: string;
}

const ReceptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'create' | 'import'>('create');
  const [batchForm, setBatchForm] = useState<BatchFormData>({
    batchName: '',
    batchDate: new Date().toISOString().split('T')[0],
    examinationType: 'CIVIL',
  });
  const [batchId, setBatchId] = useState<string | null>(null);
  const [patientRows, setPatientRows] = useState<PatientRow[]>([
    { fullName: '', dateOfBirth: '', idNumber: '', gender: 'M', phone: '', address: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ========== Step 1: Create Batch ==========
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newBatch = await api.createBatch(
        batchForm.batchName,
        batchForm.batchDate,
        batchForm.examinationType,
      );
      setBatchId(newBatch.id);
      setSuccessMessage(`✓ Tạo phiên khám "${batchForm.batchName}" thành công`);
      setStep('import');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo phiên khám');
    } finally {
      setLoading(false);
    }
  };

  // ========== Step 2: Bulk Import Patients ==========
  const handleAddRow = () => {
    setPatientRows([
      ...patientRows,
      { fullName: '', dateOfBirth: '', idNumber: '', gender: 'M', phone: '', address: '' },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setPatientRows(patientRows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: keyof PatientRow, value: string) => {
    const newRows = [...patientRows];
    newRows[index] = {
      ...newRows[index],
      [field]: value,
    };
    setPatientRows(newRows);
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) {
      setError('Phiên khám không được tìm thấy');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate patients
      const validPatients = patientRows.filter(
        (p) => p.fullName && p.idNumber && p.dateOfBirth && p.gender,
      );

      if (validPatients.length === 0) {
        setError('Vui lòng nhập ít nhất 1 bệnh nhân hợp lệ');
        setLoading(false);
        return;
      }

      // Bulk import
      const result = await api.bulkImportPatients({
        batchId,
        batchName: batchForm.batchName,
        batchDate: batchForm.batchDate,
        examinationType: batchForm.examinationType,
        patients: validPatients.map((p) => ({
          ...p,
          dateOfBirth: new Date(p.dateOfBirth).toISOString().split('T')[0],
        })),
      });

      setSuccessMessage(
        `✓ Nhập ${result.created} bệnh nhân thành công. Sai: ${result.failed || 0}`,
      );

      // Redirect to clinical exam page
      setTimeout(() => {
        navigate(`/clinical/${batchId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi nhập bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Simple CSV/Excel parsing (requires additional library for production)
      // For now, just show message
      setSuccessMessage('Tính năng import file sẽ được kích hoạt');
    } finally {
      setLoading(false);
    }
  };

  const examTypes = [
    { value: 'CIVIL', label: 'Khám sức khỏe định kỳ (Circular 14/2013)' },
    { value: 'POLICE', label: 'Khám sức khỏe cảnh sát (Circular 62/2023)' },
    { value: 'DRUG_REHAB', label: 'Khám tái hòa nhập (Rehab)' },
  ];

  return (
    <div className="reception-page">
      <h1>Bước 1: Tiếp Nhận Bệnh Nhân</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Step 1: Create Batch */}
      {step === 'create' && (
        <form onSubmit={handleCreateBatch} className="form-section">
          <h2>Tạo Phiên Khám Mới</h2>

          <div className="form-group">
            <label htmlFor="batchName">Tên Phiên Khám *</label>
            <input
              id="batchName"
              type="text"
              placeholder="VD: Khám công ty ABC - T1/2026"
              value={batchForm.batchName}
              onChange={(e) => setBatchForm({ ...batchForm, batchName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="batchDate">Ngày Khám *</label>
            <input
              id="batchDate"
              type="date"
              value={batchForm.batchDate}
              onChange={(e) => setBatchForm({ ...batchForm, batchDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="examinationType">Loại Khám *</label>
            <select
              id="examinationType"
              value={batchForm.examinationType}
              onChange={(e) =>
                setBatchForm({
                  ...batchForm,
                  examinationType: e.target.value as any,
                })
              }
              required
            >
              {examTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang tạo...' : '➜ Tiếp Tục Nhập Bệnh Nhân'}
          </button>
        </form>
      )}

      {/* Step 2: Bulk Import Patients */}
      {step === 'import' && batchId && (
        <form onSubmit={handleBulkImport} className="form-section">
          <h2>Nhập Danh Sách Bệnh Nhân</h2>

          <div className="import-options">
            <button type="button" className="btn-import">
              📁 Tải từ file Excel
            </button>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleImportFromFile}
              style={{ display: 'none' }}
            />
          </div>

          <div className="patients-table-wrapper">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Họ Tên</th>
                  <th>Ngày Sinh</th>
                  <th>CMND/Passport</th>
                  <th>Giới Tính</th>
                  <th>Điện Thoại</th>
                  <th>Địa Chỉ</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {patientRows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        placeholder="Họ và tên"
                        value={row.fullName}
                        onChange={(e) => handleRowChange(index, 'fullName', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={row.dateOfBirth}
                        onChange={(e) => handleRowChange(index, 'dateOfBirth', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="123456789"
                        value={row.idNumber}
                        onChange={(e) => handleRowChange(index, 'idNumber', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        value={row.gender}
                        onChange={(e) => handleRowChange(index, 'gender', e.target.value)}
                      >
                        <option value="M">Nam</option>
                        <option value="F">Nữ</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="tel"
                        placeholder="0987654321"
                        value={row.phone}
                        onChange={(e) => handleRowChange(index, 'phone', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Địa chỉ"
                        value={row.address}
                        onChange={(e) => handleRowChange(index, 'address', e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className="btn-remove"
                        title="Xóa dòng"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={handleAddRow} className="btn-add-row">
            + Thêm Bệnh Nhân
          </button>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setStep('create')}
              className="btn-secondary"
              disabled={loading}
            >
              ← Quay Lại
            </button>
            <button
              type="submit"
              disabled={loading || patientRows.every((p) => !p.fullName)}
              className="btn-primary"
            >
              {loading ? 'Đang nhập...' : '✓ Hoàn Thành & Khám Chuyên Khoa'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReceptionPage;
