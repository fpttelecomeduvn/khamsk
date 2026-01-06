# Health Examination System - Technical Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React 18)                       │
│  ├─ ReceptionPage (Step 1: Batch + Bulk Import)                 │
│  ├─ ClinicalExamPage (Step 2: Dynamic Specialty Selection)      │
│  ├─ ConclusionPage (Step 4: Final Ranks + Override)             │
│  ├─ HistoryPage (Step 5: Results + Statistics)                  │
│  ├─ DynamicForm (Zod + React Hook Form)                         │
│  └─ API Client (Axios with JWT)                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                        REST API (NestJS)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                 Backend (NestJS 10.2 + TypeORM)                  │
│  ├─ PatientModule       (CRUD, Bulk Import, Search)             │
│  ├─ VisitModule        (Session Management)                      │
│  ├─ ClinicalModule     (Health Rank Calculation)                │
│  ├─ AuthModule         (JWT, RBAC)                              │
│  ├─ FormSchemaModule   (Dynamic Form Configurations)            │
│  └─ ReportingModule    (Statistics, Export)                     │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL 15 + JSONB)                    │
│  ├─ patients          (demographics)                             │
│  ├─ batches          (examination batches)                       │
│  ├─ health_check_sessions (partitioned by year, JSONB data)     │
│  ├─ form_schemas     (specialty configurations)                  │
│  ├─ users            (RBAC)                                      │
│  └─ audit_logs       (append-only)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend
- **Framework:** NestJS 10.2 (TypeScript)
- **Database:** PostgreSQL 15
- **ORM:** TypeORM 0.3
- **Authentication:** Passport.js + JWT
- **Validation:** class-validator, Zod
- **API Docs:** Swagger (@nestjs/swagger)
- **Testing:** Jest + Vitest

### Frontend
- **Framework:** React 18 + Vite
- **Form Management:** react-hook-form
- **Validation:** Zod
- **HTTP Client:** Axios
- **Styling:** CSS Grid + Responsive Design
- **Routing:** React Router v6
- **State Management:** React Context (minimal)

### Database
- **Engine:** PostgreSQL 15
- **Special Features:**
  - JSONB columns for clinical_data
  - Range Partitioning by year
  - GIN indexes for JSON queries
  - Triggers for updated_at
  - Audit logging (append-only)

---

## API Endpoints

### Authentication
```
POST   /auth/signup              Create new user
POST   /auth/signin              Login & get JWT token
GET    /auth/me                  Get current user info
POST   /auth/change-password     Change password
```

### Patients
```
POST   /patients                 Create patient
GET    /patients                 List patients (paginated)
GET    /patients/:id             Get patient detail
PUT    /patients/:id             Update patient
DELETE /patients/:id             Delete patient
GET    /patients/search          Full-text search
POST   /patients/bulk-import     Import multiple patients
GET    /patients/batches/:batchId/pending  Get pending patients
```

### Batches
```
POST   /patients/batches                    Create batch
GET    /patients/batches/:id               Get batch detail
PUT    /patients/batches/:id               Update batch
POST   /patients/batches/:id/lock          Lock batch (prevent further changes)
GET    /patients/batches/:id/statistics    Get batch statistics
```

### Visits (Health Check Sessions)
```
POST   /visits/sessions                     Create session
GET    /visits/sessions/:id                 Get session
GET    /visits/patients/:patientId/sessions    Get patient sessions
GET    /visits/batches/:batchId/sessions     Get batch sessions
PUT    /visits/sessions/:id/clinical-data    Update clinical data
PUT    /visits/sessions/:id/specialty-rank   Update specialty rank
PUT    /visits/sessions/:id/complete        Complete session
DELETE /visits/sessions/:id                 Cancel session
GET    /visits/batches/:batchId/statistics  Get session statistics
```

### Form Schemas
```
GET    /form-schemas/:specialty/:examinationType      Get schema
GET    /form-schemas/exam/:examinationType           Get all schemas for exam type
POST   /form-schemas                                  Create schema (admin)
PUT    /form-schemas/:id                             Update schema (admin)
DELETE /form-schemas/:id                             Delete schema (admin)
GET    /form-schemas                                 Get all schemas (admin)
```

### Clinical
```
PUT    /clinical/sessions/:id/data                    Update clinical data
POST   /clinical/sessions/:id/calculate-rank         Calculate health rank
POST   /clinical/sessions/:id/override-rank          Override rank (chief doctor)
PUT    /clinical/sessions/:id/complete               Complete session
GET    /clinical/batches/:id/statistics              Get batch statistics
```

---

## Database Schema

### health_check_sessions (JSONB Structure)

```typescript
{
  id: UUID,
  patientId: UUID,
  batchId: UUID,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  clinicalData: {
    "Internal Medicine": {
      heartRate: 72,
      bpSystolic: 120,
      bpDiastolic: 80,
      temperature: 36.8
    },
    "Ophthalmology": {
      visionOD: "20/20",
      visionOS: "20/20",
      colorBlindness: "Normal"
    },
    "Laboratory": {
      hiv: "Negative",
      hbsAg: "Negative",
      syphilis: "Negative",
      glucose: 95
    }
  },
  specialtyRanks: {
    "Internal Medicine": 2,
    "Ophthalmology": 1,
    "Laboratory": 1
  },
  finalRank: 'RANK_II' | 'RANK_III' | ... | 'FAILED',
  overrideReason: string | null,
  overriddenByUserId: UUID | null,
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp | null
}
```

### Form Schemas

```typescript
{
  id: UUID,
  specialty: 'Internal Medicine' | 'Ophthalmology' | 'Laboratory' | ...,
  examinationType: 'CIVIL' | 'POLICE' | 'DRUG_REHAB',
  schema: [
    {
      fieldName: 'heartRate',
      label: 'Heart Rate (bpm)',
      type: 'number',
      required: true,
      hint: 'Normal: 60-100 bpm',
      options?: ['Option1', 'Option2'],
      validationRules?: { min: 0, max: 300 }
    }
  ],
  description: string,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Partitioning Strategy

```sql
-- health_check_sessions is partitioned by year
PARTITION BY RANGE (YEAR(createdAt))
  PARTITION p_2024 VALUES LESS THAN (2025),
  PARTITION p_2025 VALUES LESS THAN (2026),
  PARTITION p_2026 VALUES LESS THAN (2027),
  PARTITION p_2027 VALUES LESS THAN MAXVALUE;
```

**Benefits:**
- Handles 20,000 records/year efficiently
- Fast queries within year ranges
- Easy archival of old data
- Better index performance

---

## Health Rank Calculation Engine

Located at: `backend/src/modules/clinical/health-rank.engine.ts`

### Algorithm Overview

```
Input: examinationType, specialtyRanks (dict)
  ↓
├─ Civil (Circular 14): finalRank = MAX(all specialtyRanks)
├─ Police (Circular 62): 
│  ├─ Check knockout criteria (HIV+, Drug+, Tattoos, etc.) → FAILED
│  └─ Otherwise: finalRank = MAX(all specialtyRanks)
└─ Drug Rehab: Focus on drug test + mental health
  ↓
Output: finalRank (RANK_I through RANK_V or FAILED)
```

### Specialty-Specific Logic

#### Internal Medicine
```
Input: heartRate, bpSystolic, bpDiastolic, temperature
Logic:
  if BP ≥ 160/100 → RANK_V (5)
  if BP ≥ 140/90 → RANK_IV (4)
  if BP ≥ 130/85 → RANK_III (3)
  if HR < 60 or > 100 → RANK_III (3)
  if Temp < 36 or > 37.5 → RANK_II (2)
  default → RANK_I (1)
```

#### Ophthalmology
- **Civil:** Vision ≥ 20/20, No color blindness → RANK_I
- **Police:** Vision ≥ 20/15 each eye, Stricter criteria → RANK_I

#### Laboratory
```
Positive Results:
  - HIV: RANK_V (5)
  - HBsAg: RANK_IV (4)
  - Syphilis: RANK_IV (4)
  - Glucose ≥ 200: RANK_IV (4)
  - Glucose 126-199: RANK_III (3)
  
Police (Circular 62):
  - Drug Positive: FAILED (99)
```

---

## Frontend Components

### DynamicForm
**Location:** `frontend/src/components/DynamicForm.tsx`

**Features:**
- Fetches schema from backend API dynamically
- Zod validation schema generation
- react-hook-form integration
- Dirty state tracking (disabled submit if clean)
- Loading states

**Usage:**
```tsx
<DynamicForm
  specialty="Internal Medicine"
  examinationType="CIVIL"
  onSubmit={(data) => api.updateSessionClinicalData(...)}
  loading={submitting}
/>
```

### FormField
**Location:** `frontend/src/components/FormField.tsx`

**Supported Types:**
- `text` - Text input
- `number` - Number input with coercion
- `date` - Date picker
- `select` - Dropdown with options
- `checkbox` - Boolean checkbox
- `textarea` - Multi-line text
- `radio` - Radio buttons (extensible)

---

## Authentication & Authorization

### JWT Flow
```
1. User logs in with credentials
   → Backend validates password (bcryptjs)
   → JWT token generated (24-hour expiry)
   → Token returned to frontend

2. Frontend stores token in localStorage
   → Axios interceptor adds "Authorization: Bearer {token}"
   → Token sent with every request

3. Backend verifies token
   → JwtStrategy extracts & validates signature
   → Passport attaches user info to request

4. RolesGuard checks user role
   → @Roles('DOCTOR', 'CHIEF_DOCTOR') decorator
   → Returns 403 if unauthorized
```

### Role-Based Access Control (RBAC)

| Endpoint | Receptionist | Doctor | Chief Doctor | Admin |
|----------|--------------|--------|--------------|-------|
| Batch Creation | ✅ | - | ✅ | ✅ |
| Clinical Data Entry | - | ✅ | ✅ | ✅ |
| Rank Override | - | - | ✅ | ✅ |
| User Management | - | - | - | ✅ |
| Form Schema CRUD | - | - | - | ✅ |

---

## Data Flow Example: Clinical Exam

```
User opens ClinicalExamPage
  ↓
useEffect fetches batch + patients
  → api.getBatch(batchId) → GET /patients/batches/:id
  → api.getPendingPatients(batchId) → GET /patients/batches/:id/pending
  → api.getVisitStatistics(batchId) → GET /visits/batches/:id/statistics
  ↓
User selects specialty
  ↓
DynamicForm mounts
  → useEffect calls api.getFormSchema(specialty, examinationType)
  → GET /form-schemas/:specialty/:examinationType
  → Server returns FormSchema[] array
  → Zod validation schema generated
  → Form fields rendered
  ↓
User fills form + submits
  ↓
handleSubmitData called
  → api.updateSessionClinicalData(sessionId, specialty, formData)
  → PUT /visits/sessions/:id/clinical-data
  → Backend merges specialty data into JSONB
  ↓
Calculate rank
  → HealthRankEngine.calculateFinalRank() runs
  → api.updateSessionSpecialtyRank(sessionId, specialty, rank)
  → PUT /visits/sessions/:id/specialty-rank
  ↓
Session saved ✓
User can proceed to next specialty or next patient
```

---

## Performance Optimizations

### Database
- **JSONB with GIN Index:** O(log N) queries on nested JSON
- **Range Partitioning:** Queries on single year partition (faster scans)
- **Composite Indexes:** On (batchId, status), (patientId, createdAt)
- **N+1 Prevention:** TypeORM relations with eager loading

### Frontend
- **Code Splitting:** Lazy load page components
- **Form Caching:** Schema cached after first fetch
- **Memoization:** useMemo on expensive calculations
- **Debouncing:** Search queries debounced

### API
- **Pagination:** patients endpoint supports page/limit
- **Filtering:** Batch list filters by status
- **Compression:** Gzip enabled for responses

---

## Error Handling

### Backend
```
1xx: Not configured (shouldn't happen)
2xx: Success
3xx: Redirect (not used in API)
4xx: Client error
  - 400: Invalid input (validation errors)
  - 401: Unauthorized (missing/invalid token)
  - 403: Forbidden (insufficient permissions)
  - 404: Resource not found
  - 409: Conflict (duplicate CMND, etc.)
500: Server error (log and alert admin)
```

### Frontend
```
Try-catch on all API calls
  → Display error message to user
  → Log error to console (dev)
  → Auto-logout on 401
  → Retry button for failed requests
```

---

## Testing Strategy

### Unit Tests (to be added)
- HealthRankEngine: Test each specialty calculation
- ValidationSchemas: Test Zod schema generation
- API service: Mock axios responses

### Integration Tests (to be added)
- Patient CRUD workflow
- Clinical exam workflow (end-to-end)
- Auth & permission checks

### Test Example (Health Rank Engine)
```typescript
describe('HealthRankEngine', () => {
  it('should calculate RANK_V for BP ≥ 160/100', () => {
    const engine = new HealthRankEngine();
    const rank = engine.calculateFinalRank('CIVIL', {
      'Internal Medicine': engine.calculateInternalMedicineRank({
        bpSystolic: 165,
        bpDiastolic: 105
      })
    });
    expect(rank).toBe(5); // RANK_V
  });
});
```

---

## Deployment

### Docker Setup (to be added)
```dockerfile
# Backend
FROM node:18-alpine
WORKDIR /app
COPY backend .
RUN npm install && npm run build
CMD npm run start:prod

# Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY frontend .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Environment Variables

**Production:**
```
DATABASE_HOST=prod-postgres.rds.amazonaws.com
DATABASE_PASSWORD=<strong-password>
JWT_SECRET=<very-long-random-string>
NODE_ENV=production
```

---

## Maintenance

### Regular Tasks
- **Daily:** Monitor error logs, backup database
- **Weekly:** Review audit logs, performance metrics
- **Monthly:** Archive old batches, update form schemas
- **Quarterly:** Security audit, dependency updates

### Monitoring
- Error rate dashboard
- API response time tracking
- Database query performance
- User activity logs

---

## Security Considerations

- ✅ Passwords hashed with bcryptjs (salt rounds = 10)
- ✅ JWT tokens with expiry
- ✅ HTTPS enforced in production
- ✅ CORS configured for allowed domains
- ✅ SQL injection prevented via ORM
- ✅ Input validation on all endpoints
- ⚠️ TODO: Rate limiting on auth endpoints
- ⚠️ TODO: API key authentication for third-party integrations

---

## FAQ

**Q: How do I add a new specialty?**
A: Create FormSchemaEntity record with specialty name and form schema. DynamicForm will automatically support it on next app reload.

**Q: Can I bulk import via Excel file?**
A: Yes, use the file upload in ReceptionPage. (Implementation pending)

**Q: How long are JWT tokens valid?**
A: 24 hours. After expiry, user must login again.

**Q: Can I undo a rank override?**
A: No, but it's logged in audit_logs table for review.

---

## References

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [React Router v6](https://reactrouter.com)
- [Zod Validation](https://zod.dev)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/15/datatype-json.html)

---

**Last Updated:** January 2026  
**Maintainer:** Hospital A IT Team
