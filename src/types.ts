/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CitizenProfile {
  id: string;
  lastName: string;
  postName: string;
  firstName: string;
  gender: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  originProvince: string;
  currentAddress: string;
  currentCity: string;
  currentProvince: string;
  phone: string;
  email: string;
  justificationDoc: 'ACTE_NAISSANCE' | 'JUGEMENT_SUPPLETIF' | 'CERTIFICAT_NATIONALITE' | 'ATTESTATION_NOTORIETE';
  justificationDocName: string;
  photoUrl: string;
  qrCodeData: string;
  preEnrolledAt: string;
  appointmentCenter: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface BiometricData {
  leftFingerprints: boolean[]; // index, major, ring, pinky
  rightFingerprints: boolean[];
  irisScanned: boolean;
  facialMatchScore: number;
  biometricsValidatedAt?: string;
}

export type EnrollmentStatus = 
  | 'AWAITING_BIOMETRICS' // Step 1: Pre-enrolled, needs physical validation
  | 'DEDUPLICATING'      // Step 2-3: Checking duplicates on ABIS central
  | 'COMPLETED'          // Step 4: Enrolled, cards generated
  | 'REJECTED';          // Flagged as fraud/duplicate

export interface EnrollmentRecord {
  id: string;
  citizen: CitizenProfile;
  status: EnrollmentStatus;
  nin?: string;            // National Identification Number (ONIP)
  voterCardNumber?: string; // CENI Voter Registration number
  biometrics?: BiometricData;
  enrolledAt?: string;
  isOfflineRecord?: boolean;
  notes?: string;
}

export interface KitStatus {
  id: string;
  province: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE_ACTIVE' | 'SYNCING' | 'MAINTENANCE';
  batteryLevel: number;
  solarCharging: boolean;
  solarPowerWatts: number;
  pendingSyncCount: number;
  lastSyncTime?: string;
}

export interface SystemLogs {
  id: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  source: 'ABIS' | 'KIT' | 'ONIP' | 'CENI';
  message: string;
}
