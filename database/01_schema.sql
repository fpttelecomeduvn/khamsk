-- ============================================================================
-- DATABASE SCHEMA: HEALTH EXAMINATION SYSTEM (HIS-HealthCheck)
-- PostgreSQL 14+
-- Sử dụng JSONB cho dữ liệu lâm sàn động, Range Partitioning theo năm
-- ============================================================================

-- ============ 1. CREATE EXTENSION ============
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============ 2. CREATE SCHEMAS ============
CREATE SCHEMA IF NOT EXISTS health_check;

-- ============ 3. ENUM TYPES ============
CREATE TYPE health_check.examination_type AS ENUM ('CIVIL', 'POLICE', 'DRUG_REHAB');
CREATE TYPE health_check.health_rank AS ENUM ('RANK_I', 'RANK_II', 'RANK_III', 'RANK_IV', 'RANK_V', 'FAILED');
CREATE TYPE health_check.user_role AS ENUM ('ADMIN', 'DOCTOR', 'TECHNICIAN', 'RECEPTIONIST', 'CHIEF_DOCTOR');
CREATE TYPE health_check.gender AS ENUM ('male', 'female');

-- ============ 4. USERS TABLE ============
CREATE TABLE health_check.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role health_check.user_role NOT NULL DEFAULT 'DOCTOR',
  full_name VARCHAR(255),
  specialties TEXT[], -- ARRAY OF SPECIALTY NAMES
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_username ON health_check.users(username);
CREATE INDEX idx_users_role ON health_check.users(role);

-- ============ 5. PATIENTS TABLE (CORE) ============
CREATE TABLE health_check.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender health_check.gender NOT NULL,
  id_number VARCHAR(20) UNIQUE, -- CMND/CCCD
  insurance_card VARCHAR(50),
  phone VARCHAR(20),
  company VARCHAR(255),
  "position" VARCHAR(100),
  address TEXT,
  metadata JSONB, -- Cho dữ liệu bổ sung không cấu trúc
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_phone CHECK (phone ~ '^\d{9,11}$' OR phone IS NULL)
);

CREATE INDEX idx_patients_id_number ON health_check.patients(id_number);
CREATE INDEX idx_patients_full_name ON health_check.patients USING gin(to_tsvector('vietnamese', full_name));
CREATE INDEX idx_patients_created_at ON health_check.patients(created_at);

-- ============ 6. BATCHES (ĐỢT KHÁM) ============
CREATE TABLE health_check.batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_name VARCHAR(255) NOT NULL,
  batch_date DATE NOT NULL,
  examination_type health_check.examination_type NOT NULL,
  total_patients INT DEFAULT 0,
  completed_count INT DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  locked_by UUID REFERENCES health_check.users(id),
  locked_at TIMESTAMP,
  created_by UUID NOT NULL REFERENCES health_check.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_batches_batch_date ON health_check.batches(batch_date);
CREATE INDEX idx_batches_examination_type ON health_check.batches(examination_type);

-- ============ 7. HEALTH_CHECK_SESSIONS (PARTITIONED TABLE) ============
-- MAIN TABLE (UNPARTITIONED INITIALLY)
CREATE TABLE health_check.health_check_sessions (
  id UUID NOT NULL,
  patient_id UUID NOT NULL REFERENCES health_check.patients(id),
  batch_id UUID NOT NULL REFERENCES health_check.batches(id),
  examination_type health_check.examination_type NOT NULL,
  checkup_date DATE NOT NULL,
  clinical_data JSONB, -- DYNAMIC: { "internal": {...}, "ophthalmology": {...}, ...}
  specialty_ranks JSONB, -- { "internal": 2, "ophthalmology": 3, ... }
  final_rank health_check.health_rank,
  override_reason TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES health_check.users(id),
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CONSTRAINT valid_checkup_date CHECK (checkup_date <= CURRENT_DATE)
) PARTITION BY RANGE (DATE_TRUNC('year', checkup_date));

-- CREATE PARTITIONS
CREATE TABLE health_check.health_check_sessions_2024 PARTITION OF health_check.health_check_sessions
  FOR VALUES FROM ('2024-01-01'::timestamp) TO ('2025-01-01'::timestamp);

CREATE TABLE health_check.health_check_sessions_2025 PARTITION OF health_check.health_check_sessions
  FOR VALUES FROM ('2025-01-01'::timestamp) TO ('2026-01-01'::timestamp);

CREATE TABLE health_check.health_check_sessions_2026 PARTITION OF health_check.health_check_sessions
  FOR VALUES FROM ('2026-01-01'::timestamp) TO ('2027-01-01'::timestamp);

CREATE TABLE health_check.health_check_sessions_2027 PARTITION OF health_check.health_check_sessions
  FOR VALUES FROM ('2027-01-01'::timestamp) TO ('2028-01-01'::timestamp);

-- INDEXES trên MAIN TABLE (sẽ kế thừa xuống partitions)
CREATE INDEX idx_hcs_patient_id ON health_check.health_check_sessions(patient_id);
CREATE INDEX idx_hcs_batch_id ON health_check.health_check_sessions(batch_id);
CREATE INDEX idx_hcs_checkup_date ON health_check.health_check_sessions(checkup_date);
CREATE INDEX idx_hcs_examination_type ON health_check.health_check_sessions(examination_type);
CREATE INDEX idx_hcs_final_rank ON health_check.health_check_sessions(final_rank);
CREATE INDEX idx_hcs_is_completed ON health_check.health_check_sessions(is_completed);
CREATE INDEX idx_hcs_clinical_data_gin ON health_check.health_check_sessions USING gin(clinical_data);

-- PRIMARY KEY constraint trên partitioned table
ALTER TABLE health_check.health_check_sessions
  ADD PRIMARY KEY (id, checkup_date);

-- ============ 8. AUDIT_LOGS (KHÔNG XÓA - APPEND ONLY) ============
CREATE TABLE health_check.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES health_check.users(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE, OVERRIDE
  old_value JSONB,
  new_value JSONB,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity ON health_check.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON health_check.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON health_check.audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON health_check.audit_logs(action);

-- ============ 9. FORM_SCHEMAS (CẤU HÌNH BIỂU MẪU ĐỘNG) ============
CREATE TABLE health_check.form_schemas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialty VARCHAR(100) NOT NULL,
  schema_version INT NOT NULL DEFAULT 1,
  schema_config JSONB NOT NULL, -- array of FormSchema
  created_by UUID REFERENCES health_check.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(specialty, schema_version)
);

-- ============ 10. RANK_CONFIGS (CẤU HÌNH XẾPLỌẠI) ============
CREATE TABLE health_check.rank_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  examination_type health_check.examination_type NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  thresholds JSONB NOT NULL, -- cấu hình ngưỡng cho từng specialty
  knockout_criteria JSONB, -- Công an: các tiêu chuẩn loại trừ
  created_by UUID REFERENCES health_check.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(examination_type, specialty)
);

-- ============ 11. REPORTS (BÁO CÁO TỔNG HỢP) ============
CREATE TABLE health_check.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES health_check.batches(id),
  report_type VARCHAR(50), -- 'COMPANY_SUMMARY', 'INDIVIDUAL', 'STATISTICS'
  report_data JSONB, -- dữ liệu báo cáo
  generated_by UUID NOT NULL REFERENCES health_check.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_batch_id ON health_check.reports(batch_id);

-- ============ 12. TEMPORARY_TABLES ============
CREATE TABLE health_check.import_staging (
  id SERIAL PRIMARY KEY,
  batch_id UUID,
  full_name VARCHAR(255),
  date_of_birth DATE,
  gender VARCHAR(10),
  id_number VARCHAR(20),
  insurance_card VARCHAR(50),
  phone VARCHAR(20),
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ 13. VIEWS ============

-- VIEW: Danh sách bệnh nhân cần khám
CREATE OR REPLACE VIEW health_check.vw_pending_examinations AS
SELECT
  p.id,
  p.full_name,
  p.id_number,
  b.batch_name,
  b.examination_type,
  hcs.id AS session_id,
  hcs.is_completed,
  hcs.checkup_date
FROM health_check.patients p
JOIN health_check.health_check_sessions hcs ON p.id = hcs.patient_id
JOIN health_check.batches b ON hcs.batch_id = b.id
WHERE NOT hcs.is_completed
  AND b.is_locked = FALSE
ORDER BY hcs.checkup_date, p.full_name;

-- VIEW: Thống kê xếp loại theo công ty
CREATE OR REPLACE VIEW health_check.vw_company_health_stats AS
SELECT
  p.company,
  hcs.final_rank,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM health_check.health_check_sessions WHERE p.company = p.company), 2) AS percentage
FROM health_check.health_check_sessions hcs
JOIN health_check.patients p ON hcs.patient_id = p.id
WHERE hcs.is_completed = TRUE
GROUP BY p.company, hcs.final_rank
ORDER BY p.company, hcs.final_rank;

-- ============ 14. FUNCTIONS ============

-- Function: Cập nhật updated_at tự động
CREATE OR REPLACE FUNCTION health_check.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger trên patients
CREATE TRIGGER trg_patients_update_timestamp
BEFORE UPDATE ON health_check.patients
FOR EACH ROW
EXECUTE FUNCTION health_check.update_timestamp();

-- Trigger trên health_check_sessions
CREATE TRIGGER trg_hcs_update_timestamp
BEFORE UPDATE ON health_check.health_check_sessions
FOR EACH ROW
EXECUTE FUNCTION health_check.update_timestamp();

-- Function: Log mỗi thay đổi vào audit_logs
CREATE OR REPLACE FUNCTION health_check.log_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO health_check.audit_logs (
    entity_type,
    entity_id,
    action,
    old_value,
    new_value,
    reason
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    TO_JSONB(OLD),
    TO_JSONB(NEW),
    NULL
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============ 15. GRANTS (PHÂN QUYỀN) ============
-- Nên tạo role-specific privileges tùy theo yêu cầu
-- VD: Bác sĩ Mắt chỉ được sửa ophthalmology data, không được sửa internal data

-- ============ 16. INITIAL DATA ============

-- Insert admin user (password: admin123 - cần hash trong thực tế!)
INSERT INTO health_check.users (username, email, password_hash, role, full_name)
VALUES (
  'admin',
  'admin@khamsk.local',
  crypt('admin123', gen_salt('bf')),
  'ADMIN'::health_check.user_role,
  'System Administrator'
);

-- Insert sample form schemas
INSERT INTO health_check.form_schemas (specialty, schema_version, schema_config)
VALUES (
  'internal',
  1,
  '[
    {"fieldName": "heartRate", "label": "Nhịp tim (lần/phút)", "type": "number", "required": true, "validationRules": {"min": 40, "max": 150}},
    {"fieldName": "bpSystolic", "label": "Huyết áp tâm thu (mmHg)", "type": "number", "required": true},
    {"fieldName": "bpDiastolic", "label": "Huyết áp tâm trương (mmHg)", "type": "number", "required": true},
    {"fieldName": "temperature", "label": "Nhiệt độ (°C)", "type": "number", "required": true},
    {"fieldName": "lungAuscultation", "label": "Phổi", "type": "select", "required": true, "options": [{"label": "Bình thường", "value": "normal"}, {"label": "Có rale", "value": "rale"}]},
    {"fieldName": "cardiacAuscultation", "label": "Tim", "type": "select", "required": true, "options": [{"label": "Bình thường", "value": "normal"}, {"label": "Có tâm âm bất thường", "value": "abnormal"}]},
    {"fieldName": "abdominalExamination", "label": "Bụng", "type": "textarea", "required": false}
  ]'::jsonb
);

INSERT INTO health_check.form_schemas (specialty, schema_version, schema_config)
VALUES (
  'ophthalmology',
  1,
  '[
    {"fieldName": "visLeftUncorrected", "label": "Thị lực trái (không kính)", "type": "number", "required": true},
    {"fieldName": "visRightUncorrected", "label": "Thị lực phải (không kính)", "type": "number", "required": true},
    {"fieldName": "visLeftCorrected", "label": "Thị lực trái (có kính)", "type": "number", "required": false},
    {"fieldName": "visRightCorrected", "label": "Thị lực phải (có kính)", "type": "number", "required": false},
    {"fieldName": "colorBlindness", "label": "Mù màu", "type": "checkbox", "required": true, "defaultValue": false},
    {"fieldName": "intraocularPressure", "label": "Áp lực nội nhãn (mmHg)", "type": "number", "required": false},
    {"fieldName": "fundoscopicFindings", "label": "Đáy mắt", "type": "textarea", "required": false}
  ]'::jsonb
);

-- ============ 17. PARTITION MANAGEMENT VIEWS ============
CREATE OR REPLACE VIEW health_check.vw_partition_info AS
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename LIKE 'health_check_sessions_%'
  AND schemaname = 'health_check'
ORDER BY tablename DESC;

-- ============ PERMISSIONS ============
-- Tất cả table được grant cho application role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA health_check TO postgres;
GRANT USAGE ON SCHEMA health_check TO postgres;
