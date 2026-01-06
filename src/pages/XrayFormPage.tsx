import { useState } from 'react'
import xrayTemplates from '../data/xrayTemplates.json'
import { updateXrayTest } from '../utils/examinationDataManager'
import '../styles/XrayFormPage.css'

interface XrayTemplate {
  id: string
  name: string
  category: string
  templates: Array<{
    id: string
    title: string
    description: string
    conclusion: string
  }>
}

interface XrayFormData {
  // PHẦN 1: CHỈ ĐỊNH (Nhập Kết Y Lệnh)
  selectedIndications: string[]
  customIndication: string
  additionalIndications: string
  newIndication: string  // Chỉ định mới để bổ sung
  useOtherIndication: boolean  // Sử dụng "Khác"
  
  // PHẦN 2: MỌ TẢ
  description: string
  selectedResults: string[]
  additionalResults: string
  newResult: string  // Kết quả mới để bổ sung
  useOtherResult: boolean  // Sử dụng "Khác"
  
  // PHẦN 3: KẾT LUẬN
  conclusion: string
  recommendations: string
  instructions: string
  
  // Người thực hiện
  technician: string
  radiologist: string
  signature: string
  signatureType: 'manual' | 'digital' | 'none'
  examinationDate: string
  
  // Loại X-quang
  selectedXrayType: string
  selectedTemplate: string
  
  // Thông tin bệnh nhân (để lưu)
  patientId: string
  insuranceNumber: string
  patientName: string
}

const INDICATION_OPTIONS = [
  { value: 'tb_screening', label: 'Sàng lọc lao' },
  { value: 'follow_up', label: 'Theo dõi' },
  { value: 'cough', label: 'Ho kéo dài' },
  { value: 'chest_pain', label: 'Đau ngực' },
  { value: 'shortness_breath', label: 'Khó thở' },
  { value: 'heart_disease', label: 'Bệnh tim' },
  { value: 'pneumonia', label: 'Viêm phổi' },
]

const RESULT_OPTIONS = [
  { value: 'no_abnormality', label: 'Không phát hiện bất thường' },
  { value: 'tb_suspected', label: 'Nghi ngờ lao' },
  { value: 'pneumonia', label: 'Viêm phổi' },
  { value: 'pleural_effusion', label: 'Tràn dịch màng phổi' },
  { value: 'cardiomegaly', label: 'Quá sức tim' },
  { value: 'atelectasis', label: 'Xẹp phổi' },
  { value: 'pulmonary_edema', label: 'Phù phổi' },
]

function XrayFormPage() {
  const [formData, setFormData] = useState<XrayFormData>({
    selectedIndications: [],
    customIndication: 'Chụp X-quang tim phổi thẳng',
    additionalIndications: '',
    newIndication: '',
    useOtherIndication: false,
    description: '',
    selectedResults: [],
    additionalResults: '',
    newResult: '',
    useOtherResult: false,
    conclusion: '',
    recommendations: '',
    instructions: '',
    technician: '',
    radiologist: '',
    signature: '',
    signatureType: 'none',
    examinationDate: new Date().toISOString().split('T')[0],
    selectedXrayType: '',
    selectedTemplate: '',
    patientId: '',
    insuranceNumber: '',
    patientName: ''
  })

  const getAvailableXrayTypes = () => {
    return (xrayTemplates as { xrayTemplates: XrayTemplate[] }).xrayTemplates
  }

  const getTemplatesForType = () => {
    if (!formData.selectedXrayType) return []
    const xrayType = getAvailableXrayTypes().find(x => x.id === formData.selectedXrayType)
    return xrayType?.templates || []
  }

  const applyTemplate = (templateId: string) => {
    if (!formData.selectedXrayType) return
    const xrayType = getAvailableXrayTypes().find(x => x.id === formData.selectedXrayType)
    const template = xrayType?.templates.find(t => t.id === templateId)
    
    if (template) {
      setFormData(prev => ({
        ...prev,
        selectedTemplate: templateId,
        description: template.description,
        conclusion: template.conclusion,
        customIndication: xrayType?.name || prev.customIndication
      }))
    }
  }

  const handleToggleIndication = (value: string) => {
    setFormData(prev => ({
      ...prev,
      selectedIndications: prev.selectedIndications.includes(value)
        ? prev.selectedIndications.filter(i => i !== value)
        : [...prev.selectedIndications, value]
    }))
  }

  const handleToggleResult = (value: string) => {
    setFormData(prev => ({
      ...prev,
      selectedResults: prev.selectedResults.includes(value)
        ? prev.selectedResults.filter(r => r !== value)
        : [...prev.selectedResults, value]
    }))
  }

  const handleSaveXrayResult = () => {
    // Kiểm tra thông tin bệnh nhân
    if (!formData.insuranceNumber && !formData.patientId) {
      alert('⚠️ Vui lòng nhập Mã Bảo Hiểm Y Tế hoặc ID Bệnh Nhân để lưu kết quả!')
      return
    }

    if (!formData.insuranceNumber) {
      alert('⚠️ Vui lòng nhập Mã Bảo Hiểm Y Tế để lưu kết quả!')
      return
    }

    try {
      // Lưu bằng examinationDataManager
      updateXrayTest(formData.insuranceNumber, {
        status: 'completed',
        date: formData.examinationDate,
        type: formData.selectedXrayType || 'Chụp X-quang',
        description: formData.description,
        conclusion: formData.conclusion,
        result: {
          id: `xray_${formData.insuranceNumber}_${new Date().getTime()}`,
          customIndication: formData.customIndication,
          selectedIndications: formData.selectedIndications,
          additionalIndications: formData.additionalIndications,
          newIndication: formData.newIndication,
          useOtherIndication: formData.useOtherIndication,
          selectedResults: formData.selectedResults,
          additionalResults: formData.additionalResults,
          newResult: formData.newResult,
          useOtherResult: formData.useOtherResult,
          recommendations: formData.recommendations,
          instructions: formData.instructions,
          technician: formData.technician,
          radiologist: formData.radiologist,
          signature: formData.signature,
          signatureType: formData.signatureType
        }
      })

      // Cập nhật patient record trong allPatients (backward compatibility)
      const allPatients = JSON.parse(localStorage.getItem('allPatients') || '[]')
      const patientIndex = allPatients.findIndex((p: any) => p.insuranceNumber === formData.insuranceNumber)
      
      if (patientIndex !== -1) {
        allPatients[patientIndex] = {
          ...allPatients[patientIndex],
          xrayTest: {
            status: 'completed',
            date: formData.examinationDate
          },
          lastModified: new Date().toISOString()
        }
        localStorage.setItem('allPatients', JSON.stringify(allPatients))
      }

      // Hiển thị thông báo thành công
      alert(`✅ Đã lưu kết quả X-Quang cho bệnh nhân: ${formData.patientName || formData.insuranceNumber}`)

    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error)
      alert(`❌ Lỗi khi lưu dữ liệu: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`)
    }
  }


  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Kết Quả X-Quang</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
              color: #333;
              background: white;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
            }
            .exam-date {
              color: #666;
              font-size: 13px;
              margin-top: 10px;
            }
            .section {
              margin: 20px 0;
              page-break-inside: avoid;
            }
            .section-title {
              font-weight: bold;
              font-size: 14px;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .row {
              display: flex;
              margin: 10px 0;
              padding: 8px 0;
              border-bottom: 1px dotted #ddd;
            }
            .label {
              width: 35%;
              font-weight: bold;
            }
            .value {
              width: 65%;
            }
            .box {
              border: 1px solid #ddd;
              padding: 12px;
              border-radius: 4px;
              margin: 10px 0;
              background: #f9f9f9;
            }
            .signature-area {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-top: 50px;
            }
            .signature-block {
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #333;
              margin-top: 40px;
              padding-top: 5px;
              font-size: 12px;
            }
            .list-item {
              margin-left: 20px;
              margin-bottom: 5px;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>BIÊN BẢN KẾT QUẢ CHỤP X-QUANG</h1>
              <div class="exam-date">Ngày thực hiện: ${new Date(formData.examinationDate).toLocaleDateString('vi-VN')}</div>
              <div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 12px; text-align: left; font-size: 13px;">
                <div style="margin: 5px 0;"><strong>Bệnh nhân:</strong> ${formData.patientName || '(Chưa cập nhật)'}</div>
                <div style="margin: 5px 0;"><strong>Mã bảo hiểm:</strong> ${formData.insuranceNumber || '(Chưa cập nhật)'}</div>
                ${formData.patientId ? `<div style="margin: 5px 0;"><strong>ID bệnh nhân:</strong> ${formData.patientId}</div>` : ''}
              </div>
            </div>

            <div class="section">
              <div class="section-title">I. CHỈ ĐỊNH CHỤP X-QUANG (Nhập Kết Y Lệnh)</div>
              <div class="box">
                <strong>Chỉ định chính:</strong> ${formData.customIndication || '(Không có)'}
                <div style="margin-top: 10px;">
                  ${formData.selectedIndications.length > 0 
                    ? `<strong>Chỉ định khác:</strong><br/>${formData.selectedIndications.map(ind => {
                        const option = INDICATION_OPTIONS.find(o => o.value === ind)
                        return `<div class="list-item">• ${option?.label || ind}</div>`
                      }).join('')}`
                    : ''
                  }
                </div>
                ${formData.additionalIndications ? `
                  <div style="margin-top: 10px;">
                    <strong>Chỉ định bổ sung:</strong><br/>${formData.additionalIndications.split('\n').map(line => `<div class="list-item">${line}</div>`).join('')}
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="section">
              <div class="section-title">II. MỌ TẢ KẾT QUẢ CHỤP</div>
              <div class="box">
                <strong>Mô tả chi tiết:</strong><br/>
                <div style="margin-top: 10px; white-space: pre-wrap;">${formData.description || '(Không có mô tả)'}</div>
                ${formData.selectedResults.length > 0 
                  ? `<div style="margin-top: 10px;">
                      <strong>Kết quả tiêu chuẩn:</strong><br/>
                      ${formData.selectedResults.map(res => {
                        const option = RESULT_OPTIONS.find(o => o.value === res)
                        return `<div class="list-item">• ${option?.label || res}</div>`
                      }).join('')}
                    </div>`
                  : ''
                }
                ${formData.additionalResults ? `
                  <div style="margin-top: 10px;">
                    <strong>Kết quả bổ sung:</strong><br/>
                    ${formData.additionalResults.split('\n').map(line => `<div class="list-item">${line}</div>`).join('')}
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="section">
              <div class="section-title">III. KẾT LUẬN VÀ KHUYẾN CÁO</div>
              <div class="box" style="background: #fffacd;">
                ${formData.conclusion ? `
                  <div style="margin-bottom: 15px;">
                    <strong>Kết luận chẩn đoán:</strong><br/>
                    <div style="margin-top: 8px; white-space: pre-wrap;">${formData.conclusion}</div>
                  </div>
                ` : ''}
                ${formData.recommendations ? `
                  <div style="margin-bottom: 15px;">
                    <strong>Khuyến cáo hướng điều trị:</strong><br/>
                    <div style="margin-top: 8px; white-space: pre-wrap;">${formData.recommendations}</div>
                  </div>
                ` : ''}
                ${formData.instructions ? `
                  <div>
                    <strong>Lời dặn:</strong><br/>
                    <div style="margin-top: 8px; white-space: pre-wrap;">${formData.instructions}</div>
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="section">
              <div class="section-title">IV. NGƯỜI THỰC HIỆN</div>
              <div class="row">
                <div class="label">Kỹ thuật viên:</div>
                <div class="value">${formData.technician || '..............................'}</div>
              </div>
              <div class="row">
                <div class="label">Bác sĩ Chuẩn đoán:</div>
                <div class="value">${formData.radiologist || '..............................'}</div>
              </div>
            </div>

            <div class="signature-area">
              <div class="signature-block">
                <div style="margin-bottom: 30px;">Kỹ thuật viên</div>
                <div class="signature-line"></div>
              </div>
              <div class="signature-block">
                <div style="margin-bottom: 30px;">Bác sĩ Chuẩn đoán</div>
                <div class="signature-line"></div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
      printWindow.document.write(printContent)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  return (
    <div className="xray-form-page">
      <div className="xray-form-container">
        <div className="form-header">
          <h2>📷 BIÊN BẢN KẾT QUẢ CHỤP X-QUANG</h2>
          <p className="form-subtitle">Nhập thông tin và kết quả chụp X-quang</p>
        </div>

        <form className="xray-form">
          {/* Ngày thực hiện */}
          <div className="form-section">
            <h3>📅 Ngày Thực Hiện</h3>
            <div className="form-group">
              <input
                type="date"
                value={formData.examinationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, examinationDate: e.target.value }))}
                className="date-input"
              />
            </div>
          </div>

          {/* Chọn mẫu X-quang */}
          <div className="form-section">
            <h3>🔍 Chọn Mẫu X-Quang Chuẩn</h3>
            <div className="form-group">
              <label htmlFor="xrayType">Loại X-Quang:</label>
              <select
                id="xrayType"
                value={formData.selectedXrayType}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  selectedXrayType: e.target.value,
                  selectedTemplate: ''
                }))}
                className="input"
              >
                <option value="">-- Chọn loại X-quang --</option>
                {getAvailableXrayTypes().map(xrayType => (
                  <option key={xrayType.id} value={xrayType.id}>
                    {xrayType.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.selectedXrayType && getTemplatesForType().length > 0 && (
              <div className="form-group">
                <label htmlFor="template">Chọn Mẫu Kết Quả:</label>
                <select
                  id="template"
                  value={formData.selectedTemplate}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="input"
                >
                  <option value="">-- Chọn mẫu --</option>
                  {getTemplatesForType().map(template => (
                    <option key={template.id} value={template.id}>
                      {template.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.selectedTemplate && (
              <div className="template-preview">
                <div className="preview-section">
                  <strong>📋 Mô Tả:</strong>
                  <div className="preview-content">{formData.description}</div>
                </div>
                <div className="preview-section">
                  <strong>✓ Kết Luận:</strong>
                  <div className="preview-content">{formData.conclusion}</div>
                </div>
                <button 
                  type="button"
                  className="btn-apply-template"
                  onClick={() => applyTemplate(formData.selectedTemplate)}
                >
                  ✓ Áp dụng mẫu này
                </button>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PHẦN 1: CHỈ ĐỊNH (NHẬP KẾT Y LỆnh) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="form-section xray-section-1">
            <h3 className="section-heading">📋 PHẦN 1: CHỈ ĐỊNH CHỤP X-QUANG (Nhập Kết Y Lệnh)</h3>
            <div className="section-divider"></div>
            
            <div className="form-group">
              <label htmlFor="customIndication">Chỉ Định Chính:</label>
              <input
                id="customIndication"
                type="text"
                value={formData.customIndication}
                onChange={(e) => setFormData(prev => ({ ...prev, customIndication: e.target.value }))}
                placeholder="Ví dụ: Chụp X-quang tim phổi thẳng"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="section-label">Chỉ Định Khác (Đánh Dấu Nếu Có):</label>
              <div className="checkbox-grid">
                {INDICATION_OPTIONS.map(option => (
                  <div key={option.value} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`indication_${option.value}`}
                      checked={formData.selectedIndications.includes(option.value)}
                      onChange={() => handleToggleIndication(option.value)}
                    />
                    <label htmlFor={`indication_${option.value}`}>{option.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="additionalIndications">Chỉ Định Bổ Sung:</label>
              <textarea
                id="additionalIndications"
                value={formData.additionalIndications}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalIndications: e.target.value }))}
                placeholder="Nhập thêm các chỉ định khác nếu có..."
                rows={3}
                className="textarea"
              />
            </div>

            <hr style={{ margin: '20px 0', borderColor: '#e0e0e0' }} />

            {/* Thêm chỉ định mới */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.useOtherIndication}
                  onChange={(e) => setFormData(prev => ({ ...prev, useOtherIndication: e.target.checked }))}
                />
                ✏️ Thêm Chỉ Định Mới (Để Bổ Sung Dữ Liệu Cho Lần Sau)
              </label>
              {formData.useOtherIndication && (
                <textarea
                  value={formData.newIndication}
                  onChange={(e) => setFormData(prev => ({ ...prev, newIndication: e.target.value }))}
                  placeholder="Nhập chỉ định mới để bổ sung vào dữ liệu cho những lần kiểm tra tiếp theo..."
                  rows={3}
                  className="textarea"
                  style={{ marginTop: '10px', backgroundColor: '#e3f2fd' }}
                />
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.useOtherIndication && formData.newIndication === 'OTHER'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({ ...prev, useOtherIndication: true, newIndication: 'OTHER' }))
                    } else {
                      setFormData(prev => ({ ...prev, newIndication: '' }))
                    }
                  }}
                />
                🔸 Khác (Bệnh nhân không thuộc các trường hợp trên)
              </label>
              {formData.useOtherIndication && formData.newIndication === 'OTHER' && (
                <textarea
                  value={formData.additionalIndications}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalIndications: e.target.value }))}
                  placeholder="Mô tả chi tiết tình trạng khác của bệnh nhân..."
                  rows={3}
                  className="textarea"
                  style={{ marginTop: '10px', backgroundColor: '#fff3e0' }}
                />
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PHẦN 2: MỌ TẢ (DESCRIPTION) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="form-section xray-section-2">
            <h3 className="section-heading">📝 PHẦN 2: MỌ TẢ KẾT QUẢ CHỤP</h3>
            <div className="section-divider"></div>

            <div className="form-group">
              <label htmlFor="description">Mô Tả Chi Tiết Kết Quả:</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả chi tiết kết quả tìm thấy từ chụp X-quang..."
                rows={4}
                className="textarea large"
              />
            </div>

            <div className="form-group">
              <label className="section-label">Kết Quả Tiêu Chuẩn (Đánh Dấu Nếu Có):</label>
              <div className="checkbox-grid">
                {RESULT_OPTIONS.map(option => (
                  <div key={option.value} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`result_${option.value}`}
                      checked={formData.selectedResults.includes(option.value)}
                      onChange={() => handleToggleResult(option.value)}
                    />
                    <label htmlFor={`result_${option.value}`}>{option.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="additionalResults">Kết Quả Bổ Sung:</label>
              <textarea
                id="additionalResults"
                value={formData.additionalResults}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalResults: e.target.value }))}
                placeholder="Nhập thêm các kết quả khác nếu có..."
                rows={3}
                className="textarea"
              />
            </div>

            <hr style={{ margin: '20px 0', borderColor: '#e0e0e0' }} />

            {/* Thêm kết quả mới */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.useOtherResult}
                  onChange={(e) => setFormData(prev => ({ ...prev, useOtherResult: e.target.checked }))}
                />
                ✏️ Thêm Kết Quả Mới (Để Bổ Sung Dữ Liệu Cho Lần Sau)
              </label>
              {formData.useOtherResult && (
                <textarea
                  value={formData.newResult}
                  onChange={(e) => setFormData(prev => ({ ...prev, newResult: e.target.value }))}
                  placeholder="Nhập kết quả mới để bổ sung vào dữ liệu cho những lần kiểm tra tiếp theo..."
                  rows={3}
                  className="textarea"
                  style={{ marginTop: '10px', backgroundColor: '#e3f2fd' }}
                />
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.useOtherResult && formData.newResult === 'OTHER'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({ ...prev, useOtherResult: true, newResult: 'OTHER' }))
                    } else {
                      setFormData(prev => ({ ...prev, newResult: '' }))
                    }
                  }}
                />
                🔸 Khác (Kết quả không thuộc các trường hợp trên)
              </label>
              {formData.useOtherResult && formData.newResult === 'OTHER' && (
                <textarea
                  value={formData.additionalResults}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalResults: e.target.value }))}
                  placeholder="Mô tả chi tiết kết quả khác của chụp X-quang..."
                  rows={3}
                  className="textarea"
                  style={{ marginTop: '10px', backgroundColor: '#fff3e0' }}
                />
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PHẦN 3: KẾT LUẬN (CONCLUSION) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="form-section xray-section-3">
            <h3 className="section-heading">✓ PHẦN 3: KẾT LUẬN VÀ KHUYẾN CÁO</h3>
            <div className="section-divider"></div>

            <div className="form-group">
              <label htmlFor="conclusion">Kết Luận Chẩn Đoán:</label>
              <textarea
                id="conclusion"
                value={formData.conclusion}
                onChange={(e) => setFormData(prev => ({ ...prev, conclusion: e.target.value }))}
                placeholder="Kết luận chẩn đoán dựa trên kết quả chụp X-quang..."
                rows={3}
                className="textarea important"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recommendations">Khuyến Cáo Hướng Điều Trị:</label>
              <textarea
                id="recommendations"
                value={formData.recommendations}
                onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                placeholder="Khuyến cáo hướng điều trị tiếp theo..."
                rows={3}
                className="textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="instructions">Lời Dặn / Hướng Dẫn:</label>
              <textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Lời dặn và hướng dẫn cho bệnh nhân..."
                rows={3}
                className="textarea"
              />
            </div>
          </div>

          {/* Thông tin người thực hiện */}
          <div className="form-section">
            <h3>👨‍⚕️ Thông Tin Người Thực Hiện</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="technician">Kỹ Thuật Viên:</label>
                <input
                  type="text"
                  id="technician"
                  value={formData.technician}
                  onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
                  placeholder="Nhập tên kỹ thuật viên"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="radiologist">Bác Sĩ Chuẩn Đoán:</label>
                <input
                  type="text"
                  id="radiologist"
                  value={formData.radiologist}
                  onChange={(e) => setFormData(prev => ({ ...prev, radiologist: e.target.value }))}
                  placeholder="Nhập tên bác sĩ"
                  className="input"
                />
              </div>
            </div>

            {/* Chữ ký */}
            <div className="form-group">
              <label>Chữ Ký / Xác Nhận:</label>
              <div className="signature-options">
                <label className="signature-option">
                  <input
                    type="radio"
                    name="signatureType"
                    value="none"
                    checked={formData.signatureType === 'none'}
                    onChange={() => setFormData(prev => ({ ...prev, signatureType: 'none' }))}
                  />
                  <span>Không có</span>
                </label>
                <label className="signature-option">
                  <input
                    type="radio"
                    name="signatureType"
                    value="manual"
                    checked={formData.signatureType === 'manual'}
                    onChange={() => setFormData(prev => ({ ...prev, signatureType: 'manual' }))}
                  />
                  <span>Chữ ký tay</span>
                </label>
                <label className="signature-option">
                  <input
                    type="radio"
                    name="signatureType"
                    value="digital"
                    checked={formData.signatureType === 'digital'}
                    onChange={() => setFormData(prev => ({ ...prev, signatureType: 'digital' }))}
                  />
                  <span>Chữ ký số</span>
                </label>
              </div>

              {formData.signatureType === 'manual' && (
                <div className="form-group">
                  <label htmlFor="signature">Chữ Ký Số / Tên:</label>
                  <input
                    type="text"
                    id="signature"
                    value={formData.signature}
                    onChange={(e) => setFormData(prev => ({ ...prev, signature: e.target.value }))}
                    placeholder="Nhập chữ ký hoặc tên"
                    className="input"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PHẦN 4: THÔNG TIN BỆNH NHÂN (ĐỂ LƯU DỮ LIỆU) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="form-section" style={{ backgroundColor: '#f5f5f5', borderColor: '#9c27b0' }}>
            <h3 className="section-heading">👤 PHẦN 4: THÔNG TIN BỆNH NHÂN (ĐỂ LƯU KẾT QUẢ)</h3>
            <div className="section-divider"></div>

            <div className="form-group">
              <label htmlFor="insuranceNumber">Mã Bảo Hiểm Y Tế:</label>
              <input
                id="insuranceNumber"
                type="text"
                value={formData.insuranceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, insuranceNumber: e.target.value }))}
                placeholder="Nhập mã bảo hiểm y tế của bệnh nhân"
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="patientName">Tên Bệnh Nhân:</label>
              <input
                id="patientName"
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                placeholder="Nhập tên bệnh nhân"
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="patientId">ID Bệnh Nhân (Tùy Chọn):</label>
              <input
                id="patientId"
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                placeholder="ID bệnh nhân hoặc số ID khác (nếu có)"
                className="input"
              />
            </div>
          </div>

          {/* Nút lưu và in */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-print"
              style={{ backgroundColor: '#4caf50', borderColor: '#45a049' }}
              onClick={handleSaveXrayResult}
            >
              💾 Lưu Kết Quả X-Quang
            </button>
            <button
              type="button"
              className="btn-print"
              onClick={handlePrint}
            >
              🖨️ In Biên Bản
            </button>
            <button
              type="reset"
              className="btn-reset"
              onClick={() => {
                setFormData({
                  selectedIndications: [],
                  customIndication: 'Chụp X-quang tim phổi thẳng',
                  additionalIndications: '',
                  newIndication: '',
                  useOtherIndication: false,
                  description: '',
                  selectedResults: [],
                  additionalResults: '',
                  newResult: '',
                  useOtherResult: false,
                  conclusion: '',
                  recommendations: '',
                  instructions: '',
                  technician: '',
                  radiologist: '',
                  signature: '',
                  signatureType: 'none',
                  examinationDate: new Date().toISOString().split('T')[0],
                  selectedXrayType: '',
                  selectedTemplate: '',
                  patientId: '',
                  insuranceNumber: '',
                  patientName: ''
                })
              }}
            >
              ↻ Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default XrayFormPage
