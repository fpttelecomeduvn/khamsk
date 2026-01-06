/**
 * API CLIENT - Tất cả calls tới backend
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor: Thêm token vào mỗi request
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Interceptor: Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );

    // Load token từ localStorage
    this.token = localStorage.getItem('accessToken');
  }

  // ============ AUTH ============

  async signUp(data: any) {
    const res = await this.client.post('/auth/signup', data);
    this.setToken(res.data.accessToken);
    return res.data;
  }

  async signIn(username: string, password: string) {
    const res = await this.client.post('/auth/signin', { username, password });
    this.setToken(res.data.accessToken);
    return res.data;
  }

  async getCurrentUser() {
    return this.client.get('/auth/me').then((res) => res.data);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return this.client.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  // ============ PATIENTS ============

  async createPatient(data: any) {
    return this.client.post('/patients', data).then((res) => res.data);
  }

  async getPatient(id: string) {
    return this.client.get(`/patients/${id}`).then((res) => res.data);
  }

  async getPatients(page = 1, limit = 20) {
    return this.client
      .get('/patients', { params: { page, limit } })
      .then((res) => res.data);
  }

  async searchPatients(query: string, page = 1, limit = 20) {
    return this.client
      .get('/patients/search', { params: { q: query, page, limit } })
      .then((res) => res.data);
  }

  async updatePatient(id: string, data: any) {
    return this.client.put(`/patients/${id}`, data).then((res) => res.data);
  }

  async getPatientHistory(id: string) {
    return this.client.get(`/patients/${id}/history`).then((res) => res.data);
  }

  // ============ BATCHES ============

  async createBatch(data: any) {
    return this.client.post('/patients/batches', data).then((res) => res.data);
  }

  async getBatch(id: string) {
    return this.client.get(`/patients/batches/${id}`).then((res) => res.data);
  }

  async getPendingPatients(batchId: string) {
    return this.client
      .get(`/patients/batches/${batchId}/pending`)
      .then((res) => res.data);
  }

  async lockBatch(batchId: string) {
    return this.client
      .post(`/patients/batches/${batchId}/lock`, {})
      .then((res) => res.data);
  }

  async bulkImportPatients(data: any) {
    return this.client
      .post('/patients/bulk-import', data)
      .then((res) => res.data);
  }

  // ============ CLINICAL ============

  async getSession(sessionId: string) {
    return this.client
      .get(`/clinical/sessions/${sessionId}`)
      .then((res) => res.data);
  }

  async updateClinicalData(sessionId: string, data: any) {
    return this.client
      .put(`/clinical/sessions/${sessionId}/data`, data)
      .then((res) => res.data);
  }

  async calculateHealthRank(sessionId: string) {
    return this.client
      .post(`/clinical/sessions/${sessionId}/calculate-rank`, {})
      .then((res) => res.data);
  }

  async overrideHealthRank(sessionId: string, data: any) {
    return this.client
      .post(`/clinical/sessions/${sessionId}/override-rank`, data)
      .then((res) => res.data);
  }

  async completeSession(sessionId: string) {
    return this.client
      .post(`/clinical/sessions/${sessionId}/complete`, {})
      .then((res) => res.data);
  }

  async getPatientSessions(patientId: string) {
    return this.client
      .get(`/clinical/patients/${patientId}/sessions`)
      .then((res) => res.data);
  }

  async getIncompleteSessions(batchId: string) {
    return this.client
      .get(`/clinical/batches/${batchId}/incomplete`)
      .then((res) => res.data);
  }

  async getHealthStatistics(batchId: string) {
    return this.client
      .get(`/clinical/batches/${batchId}/statistics`)
      .then((res) => res.data);
  }

  // ============ VISITS ============

  async createSession(patientId: string, batchId: string) {
    return this.client
      .post('/visits/sessions', { patientId, batchId })
      .then((res) => res.data);
  }

  async getSession(sessionId: string) {
    return this.client
      .get(`/visits/sessions/${sessionId}`)
      .then((res) => res.data);
  }

  async getPatientVisits(patientId: string) {
    return this.client
      .get(`/visits/patients/${patientId}/sessions`)
      .then((res) => res.data);
  }

  async getBatchVisits(batchId: string) {
    return this.client
      .get(`/visits/batches/${batchId}/sessions`)
      .then((res) => res.data);
  }

  async updateSessionClinicalData(sessionId: string, specialty: string, data: Record<string, any>) {
    return this.client
      .put(`/visits/sessions/${sessionId}/clinical-data`, { specialty, data })
      .then((res) => res.data);
  }

  async updateSessionSpecialtyRank(sessionId: string, specialty: string, rank: number) {
    return this.client
      .put(`/visits/sessions/${sessionId}/specialty-rank`, { specialty, rank })
      .then((res) => res.data);
  }

  async completeVisitSession(sessionId: string, finalRank: string) {
    return this.client
      .put(`/visits/sessions/${sessionId}/complete`, { finalRank })
      .then((res) => res.data);
  }

  async cancelVisitSession(sessionId: string) {
    return this.client
      .delete(`/visits/sessions/${sessionId}`)
      .then((res) => res.data);
  }

  async getVisitStatistics(batchId: string) {
    return this.client
      .get(`/visits/batches/${batchId}/statistics`)
      .then((res) => res.data);
  }

  // ============ FORM SCHEMAS ============

  async getFormSchema(specialty: string, examinationType: string) {
    return this.client
      .get(`/form-schemas/${specialty}/${examinationType}`)
      .then((res) => res.data);
  }

  async getFormSchemasByType(examinationType: string) {
    return this.client
      .get(`/form-schemas/exam/${examinationType}`)
      .then((res) => res.data);
  }

  // ============ UTILITY ============

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  clearAuth() {
    this.token = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const api = new ApiClient();
