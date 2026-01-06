/**
 * Sample Data - Dữ liệu mẫu để demo hệ thống
 */

import { Patient, ExaminationRecord } from '../types/database'

export const SAMPLE_PATIENTS: Patient[] = [
  {
    id: 'patient_001',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    insuranceNumber: 'BH2024001',
    phoneNumber: '0912345678',
    address: '123 Đường Trần Hưng Đạo, TP HCM',
    email: 'nguyenvana@email.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'patient_002',
    fullName: 'Trần Thị B',
    dateOfBirth: '1985-08-22',
    gender: 'female',
    insuranceNumber: 'BH2024002',
    phoneNumber: '0923456789',
    address: '456 Đường Lê Văn Sỹ, Hà Nội',
    email: 'tranthib@email.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'patient_003',
    fullName: 'Lê Hoàng C',
    dateOfBirth: '1995-12-03',
    gender: 'male',
    insuranceNumber: 'BH2024003',
    phoneNumber: '0934567890',
    address: '789 Đường Nguyễn Hữu Cảnh, Đà Nẵng',
    email: 'lehoangc@email.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  }
]

export const SAMPLE_EXAMINATION_RECORDS: Omit<ExaminationRecord, 'id'>[] = [
  {
    patientId: 'patient_001',
    patientName: 'Nguyễn Văn A',
    createdDate: new Date().toISOString().split('T')[0],
    completionStatus: {
      mainExamination: true,
      xrayTest: true,
      ecgTest: false,
      ultrasoundTest: false,
      hematologyTest: false,
      biochemistryTest: false,
      urinalysisTest: false,
      conclusion: false
    },
    examinationData: {
      mainExamination: {
        date: new Date().toISOString().split('T')[0],
        height: 175,
        weight: 70,
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 37.0,
        respiratoryRate: 16,
        generalCondition: 'Bình thường',
        skinExamination: 'Bình thường',
        cardiacExamination: 'Bình thường',
        pulmonaryExamination: 'Bình thường',
        abdominalExamination: 'Bình thường',
        neurologicalExamination: 'Bình thường',
        notes: 'Sức khỏe tổng quát tốt',
        doctorName: 'BS. Trần Minh Đức',
        status: 'completed'
      },
      xrayTest: {
        date: new Date().toISOString().split('T')[0],
        type: 'chest',
        bodyPart: 'Ngực',
        findings: 'Tim bình thường, phổi không bất thường',
        conclusion: 'Không có tổn thương',
        recommendations: 'Tái khám định kỳ',
        doctorName: 'BS. Phạm Anh Tuấn',
        status: 'completed'
      }
    }
  }
]

/**
 * Tính năng để tạo patient object mới
 */
export function createNewPatient(
  fullName: string,
  dateOfBirth: string,
  gender: 'male' | 'female' | 'other',
  insuranceNumber?: string,
  phoneNumber?: string,
  address?: string,
  email?: string
): Patient {
  return {
    id: `patient_${Date.now()}`,
    fullName,
    dateOfBirth,
    gender,
    insuranceNumber,
    phoneNumber,
    address,
    email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  }
}

/**
 * Tính năng để tạo examination record object mới
 */
export function createNewExaminationRecord(
  patientId: string,
  patientName: string
): Omit<ExaminationRecord, 'id'> {
  return {
    patientId,
    patientName,
    createdDate: new Date().toISOString().split('T')[0],
    completionStatus: {
      mainExamination: false,
      xrayTest: false,
      ecgTest: false,
      ultrasoundTest: false,
      hematologyTest: false,
      biochemistryTest: false,
      urinalysisTest: false,
      conclusion: false
    },
    examinationData: {}
  }
}
