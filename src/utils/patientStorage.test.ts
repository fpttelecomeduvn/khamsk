import { describe, it, expect, beforeEach, vi } from 'vitest';
import { savePatientData, getPatientData, getAllPatientData } from './patientStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Patient Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save patient data', () => {
    const patientData = {
      id: 'test-001',
      fullName: 'John Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      insuranceCard: 'LS12345678',
      phone: '0123456789',
      mainExamination: {},
      xrayExamination: {},
      ecgExamination: {},
      ultrasoundExamination: {},
      labTestExamination: {},
      conclusion: {},
    };

    savePatientData(patientData);
    const retrieved = getPatientData('test-001');
    
    expect(retrieved).toBeDefined();
    expect(retrieved?.fullName).toBe('John Doe');
  });

  it('should handle getting all patient data', () => {
    const data = getAllPatientData();
    expect(Array.isArray(data)).toBe(true);
  });
});
