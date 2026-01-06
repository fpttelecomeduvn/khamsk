# 🚀 BLUEPRINT XÂY DỰNG HỆ THỐNG KHAMSK - PHIÊN BẢN 2.0

## Hiện tại đã hoàn tất:
- ✅ Shared Types (shared/types.ts)
- ✅ Database Schema (database/01_schema.sql)  
- ✅ Backend Package.json (backend/package.json)
- ✅ Backend Main Structure (backend/src/main.ts, app.module.ts)
- ✅ Health Rank Engine (backend/src/modules/clinical/health-rank.engine.ts)

## CHỈ NGẮN: Tiến hành với những bước tiếp theo

### BƯỚC 3: HOÀN THIỆN BACKEND (NestJS)

#### 3.1. Patient Module
**File**: `backend/src/modules/patient/`

```bash
# Tạo entities
- patient.entity.ts       # Entity PatientRecord mapped to DB
- batch.entity.ts         # Entity Batch

# Tạo DTOs  
- create-patient.dto.ts   # DTO cho POST /patients
- update-patient.dto.ts   
- batch-import.dto.ts     # DTO cho bulk import

# Tạo services
- patient.service.ts      # Business logic
- batch.service.ts

# Tạo controllers
- patient.controller.ts   # REST endpoints
- batch.controller.ts

# Module
- patient.module.ts
```

**Copilot Prompt cho Patient Service:**
```
Act as a NestJS Expert. Generate a PatientService class:
- Constructor: inject PatientRepository
- Method: createPatient(dto: CreatePatientDto): Promise<Patient>
- Method: findById(id: string): Promise<Patient>
- Method: findByIdNumber(idNumber: string): Promise<Patient | null>
- Method: getPatientHistory(patientId: string): Promise<HealthCheckSession[]>
- Method: bulkImport(batchId: string, patients: CreatePatientDto[]): Promise<{ created: number, errors: string[] }>
- Use TypeORM Repository pattern
```

#### 3.2. Clinical Module (XÉT NGHIỆM)
**File**: `backend/src/modules/clinical/`

```bash
- health-check-session.entity.ts  # Main entity
- clinical.service.ts             # Logic tính xếp loại
- clinical.controller.ts          # Endpoints: POST, GET, PUT
- form-schema.service.ts          # Quản lý schema động
- form-schema.controller.ts
- clinical.module.ts
```

**Copilot Prompt cho Clinical Controller:**
```
Act as a NestJS Controller Expert. Generate ClinicalController:
- Route prefix: /clinical
- POST /sessions/:sessionId/specialty/:specialty
  - Body: { fieldName: value, ... }
  - Save clinical_data JSONB
- GET /sessions/:sessionId - Retrieve full session with calculated rank
- PUT /sessions/:sessionId/override
  - Body: { finalRank: number, reason: string }
  - Log to audit_logs
- GET /form-schemas/:specialty - Return FormSchema for dynamic UI
- All routes need JWT authentication + role-based access
```

#### 3.3. Visit Module (ĐỢT KHÁM)
**File**: `backend/src/modules/visit/`

```bash
- visit.service.ts
- visit.controller.ts
- visit.module.ts
```

#### 3.4. Reporting Module (BÁO CÁO)
**File**: `backend/src/modules/reporting/`

```bash
- report.service.ts       # Generate tổng kết
- report.controller.ts
- report.module.ts
```

**Features:**
- Tổng hợp theo công ty
- Thống kê theo xếp loại
- Export PDF/Excel

#### 3.5 Auth Module
**File**: `backend/src/modules/auth/`

```bash
- jwt.strategy.ts
- jwt.guard.ts
- role.guard.ts
- auth.service.ts
- auth.controller.ts
- auth.module.ts
```

---

### BƯỚC 4: MIGRATE FRONTEND CÓ SẴN

**Move các file src/ vào frontend/:**
```bash
cd frontend/
cp -r ../src/* ./src/
cp ../package.json ./
cp ../index.html ./
cp ../vite.config.ts ./
```

**Cấu trúc Frontend mới:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── DynamicForm.tsx          # ⭐ Component mới
│   │   ├── FormField.tsx            # ⭐ Component mới
│   │   └── [các component cũ]
│   ├── pages/
│   │   ├── reception/               # ⭐ Refactor
│   │   ├── examination/             # ⭐ Refactor
│   │   ├── paraclinical/            # ⭐ Refactor
│   │   ├── conclusion/              # ⭐ Refactor
│   │   └── history/                 # ⭐ Refactor
│   ├── hooks/
│   │   ├── useHealthCheckSession.ts # ⭐ Mới
│   │   ├── useBatchImport.ts        # ⭐ Mới
│   │   └── useFormSchemas.ts        # ⭐ Mới
│   ├── services/
│   │   └── api.ts                   # API client
│   └── types/
│       └── index.ts                 # Re-export từ shared
```

#### 4.1 Dynamic Form Component
**File**: `frontend/src/components/DynamicForm.tsx`

**Copilot Prompt:**
```
Act as a React Expert. Generate DynamicForm component:
- Props: { schema: FormSchema[], onSubmit: (data: any) => void, defaultValues?: any }
- Use react-hook-form + Controller
- Use Zod for validation
- Render FormField component for each schema item
- Support types: text, number, select, checkbox, textarea, date
- Features: 
  - Required fields validation
  - Dynamic error messages
  - Conditional rendering (optional)
- Return typed object matching JSONB structure
```

#### 4.2 Bulk Import Component
**File**: `frontend/src/pages/reception/BulkImportForm.tsx`

**Features:**
- Upload Excel file
- Parse tại client (xlsx library)
- Validate data trước submit
- Show error/success toast

---

### BƯỚC 5: DOCKER & DEPLOYMENT

**File**: `docker-compose.yml` (root)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: khamsk
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/01_schema.sql:/docker-entrypoint-initdb.d/01_schema.sql
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/khamsk
      JWT_SECRET: your-secret-key
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000/api

volumes:
  postgres_data:
```

**Dockerfile Backend**: `backend/Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

**Dockerfile Frontend**: `frontend/Dockerfile`

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### BƯỚC 6: GIT COMMIT & PUSH

```bash
# Initialize git cho backend & frontend
cd backend && git init
cd ../frontend && git init

# Commit chính
git add .
git commit -m "v2.0: Full-stack architecture with NestJS backend, PostgreSQL JSONB, Dynamic Forms"
git push origin main --force
```

---

## ⚡ QUICK REFERENCE: Câu lệnh Copilot tối ưu

### 1. Cho Patient Entity
```
Generate TypeORM Entity for Patient table in PostgreSQL:
- Fields: id (UUID), fullName, dateOfBirth, gender, idNumber, insuranceCard, phone, company, position, address, metadata (JSONB), timestamps
- Ensure proper types and validations
- Add FindOptions for queries
```

### 2. Cho Health Check Session Entity
```
Generate TypeORM Entity for HealthCheckSession:
- Partitioned structure mapping (PostgreSQL)
- clinical_data: JSONB column
- specialty_ranks: JSONB
- final_rank: ENUM
- Relations to Patient and Batch
- Indexes on important columns
```

### 3. Cho API Gateway
```
Generate NestJS Authentication:
- JwtStrategy using passport-jwt
- JwtAuthGuard
- RolesGuard for role-based access
- User entity with hashed password
```

---

## 📝 TEMPLATE: Environment Variables

**File**: `.env.local` (root)

```
# Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=khamsk
DATABASE_SCHEMA=health_check
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# API
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Storage
FILE_UPLOAD_PATH=./uploads

# Logging
LOG_LEVEL=debug
```

---

## ✅ VALIDATION CHECKLIST

- [ ] All NestJS modules created with controllers, services, entities
- [ ] All DTOs defined with validation decorators
- [ ] Rule Engine thoroughly tested for all 3 examination types
- [ ] Dynamic Form working with API schema
- [ ] Bulk import functionality tested
- [ ] Auth/JWT working correctly
- [ ] Database migrations run successfully
- [ ] Docker containers start without errors
- [ ] Frontend API calls working
- [ ] Tests passing (Jest for backend, Vitest for frontend)

---

## 🎯 NEXT PHASE: ADVANCED

Once core is complete:
1. **Integration Testing**: E2E tests with Playwright
2. **Performance Tuning**: Query optimization for 20k records
3. **Monitoring**: Prometheus metrics + ELK logging
4. **Advanced Reporting**: D3.js/Recharts for visualizations
5. **Mobile**: React Native or PWA version
