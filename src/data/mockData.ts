/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnrollmentRecord, KitStatus, SystemLogs } from '../types';

export const CONGO_PROVINCES = [
  'Kinshasa',
  'Nord-Kivu',
  'Sud-Kivu',
  'Haut-Katanga',
  'Kongo-Central',
  'Lualaba',
  'Tshopo',
  'Kasai-Oriental',
  'Ituri',
  'Équateur',
  'Kwilu',
  'Maniema'
];

export const ENROLLMENT_CENTERS: Record<string, string[]> = {
  'Kinshasa': ['Gombe - Maison Civile', 'Limete - Maison Commune', 'Nsele - Kit Biométrique Mobile 01', 'Bandalungwa - Foyer Social'],
  'Nord-Kivu': ['Goma - Centre Don Bosco', 'Beni - Hôtel de Ville', 'Butembo - Lycée Nyakasanza', 'Masisi - Kit Mobile Solaire 04'],
  'Sud-Kivu': ['Bukavu - Collège Alfajiri', 'Uvira - Maison du Citoyen', 'Fizi - Antenne Mobile Solaire 12'],
  'Haut-Katanga': ['Lubumbashi - Place Royale', 'Likasi - Bureau du Territoire', 'Kasumbalesa - Poste Frontière'],
  'Kongo-Central': ['Matadi - Port Autonome', 'Boma - Bureau ONIP', 'Mbanza-Ngungu - Salle Paroissiale'],
  'Lualaba': ['Kolwezi - Hôtel du Gouvernement', 'Dilolo - Poste Frontière'],
  'Tshopo': ['Kisangani - Alliance Française', 'Isangi - Antenne Mobile Solaire 02']
};

export const MOCK_CITIZENS: EnrollmentRecord[] = [
  {
    id: 'REC-2026-001',
    status: 'AWAITING_BIOMETRICS',
    citizen: {
      id: 'CIT-10932',
      lastName: 'KABAMBA',
      postName: 'MULUMBA',
      firstName: 'Merveille',
      gender: 'F',
      birthDate: '1998-04-12',
      birthPlace: 'Kinshasa',
      originProvince: 'Kasai-Oriental',
      currentAddress: 'Avenue de la Justice, N° 45',
      currentCity: 'Gombe, Kinshasa',
      currentProvince: 'Kinshasa',
      phone: '+243 812 345 678',
      email: 'm.kabamba@gamil.cd',
      justificationDoc: 'ACTE_NAISSANCE',
      justificationDocName: 'acte_de_naissance_merveille.pdf',
      photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=80',
      qrCodeData: 'IDCONGO:KABAMBA:MULUMBA:Merveille:F:1998-04-12:Kinshasa:ACTE_NAISSANCE:HASH90812F98D',
      preEnrolledAt: '2026-07-05T10:14:22Z',
      appointmentCenter: 'Gombe - Maison Civile',
      appointmentDate: '2026-07-07',
      appointmentTime: '10:00 - 10:30'
    }
  },
  {
    id: 'REC-2026-002',
    status: 'COMPLETED',
    nin: 'NIN-1985-COD-89472019',
    voterCardNumber: 'CENI-VOTE-9082348',
    enrolledAt: '2026-06-28T09:15:00Z',
    citizen: {
      id: 'CIT-08472',
      lastName: 'BARAKA',
      postName: 'MAHESHE',
      firstName: 'Abraham',
      gender: 'M',
      birthDate: '1985-11-23',
      birthPlace: 'Lubumbashi',
      originProvince: 'Haut-Katanga',
      currentAddress: 'Quartier Golf, Rue des Écrivains, N° 12',
      currentCity: 'Lubumbashi',
      currentProvince: 'Haut-Katanga',
      phone: '+243 998 765 432',
      email: 'abraham.baraka@maheshe.cd',
      justificationDoc: 'CERTIFICAT_NATIONALITE',
      justificationDocName: 'certificat_nationalite_baraka.pdf',
      photoUrl: '/assets/images/mon_profil.jpg.png',
      qrCodeData: 'IDCONGO:BARAKA:MAHESHE:Abraham:M:1985-11-23:Lubumbashi:CERTIFICAT_NATIONALITE:HASH78239A',
      preEnrolledAt: '2026-06-25T14:20:00Z',
      appointmentCenter: 'Lubumbashi - Place Royale',
      appointmentDate: '2026-06-28',
      appointmentTime: '09:00 - 09:30'
    },
    biometrics: {
      leftFingerprints: [true, true, true, true],
      rightFingerprints: [true, true, true, true],
      irisScanned: true,
      facialMatchScore: 98,
      biometricsValidatedAt: '2026-06-28T09:12:44Z'
    }
  },
  {
    id: 'REC-2026-003',
    status: 'AWAITING_BIOMETRICS',
    citizen: {
      id: 'CIT-23849',
      lastName: 'MWAMBA',
      postName: 'NGALULA',
      firstName: 'Sarah',
      gender: 'F',
      birthDate: '1992-07-30',
      birthPlace: 'Goma',
      originProvince: 'Nord-Kivu',
      currentAddress: 'Avenue du Lac, N° 88',
      currentCity: 'Goma',
      currentProvince: 'Nord-Kivu',
      phone: '+243 854 991 231',
      email: 'sarah.mwamba@goma.org',
      justificationDoc: 'ACTE_NAISSANCE',
      justificationDocName: 'acte_naissance_sarah.png',
      photoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop&q=80',
      qrCodeData: 'IDCONGO:MWAMBA:NGALULA:Sarah:F:1992-07-30:Goma:ACTE_NAISSANCE:HASH12389BC82',
      preEnrolledAt: '2026-07-06T08:30:15Z',
      appointmentCenter: 'Goma - Centre Don Bosco',
      appointmentDate: '2026-07-08',
      appointmentTime: '11:00 - 11:30'
    }
  },
  {
    // Simulate a fraud attempt (someone registering again under a false name, but having BARAKA's fingerprints)
    id: 'REC-2026-FRAUD',
    status: 'AWAITING_BIOMETRICS',
    citizen: {
      id: 'CIT-99999',
      lastName: 'ILUNGA',
      postName: 'KABEYA',
      firstName: 'Alphonse',
      gender: 'M',
      birthDate: '1987-01-15',
      birthPlace: 'Mwene-Ditu',
      originProvince: 'Lomami',
      currentAddress: 'Avenue Kasavubu, N° 192',
      currentCity: 'Limete, Kinshasa',
      currentProvince: 'Kinshasa',
      phone: '+243 821 111 222',
      email: 'alphonse.ilunga@yahoo.fr',
      justificationDoc: 'ATTESTATION_NOTORIETE',
      justificationDocName: 'attestation_notoriete_ilunga.pdf',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      qrCodeData: 'IDCONGO:ILUNGA:KABEYA:Alphonse:M:1987-01-15:Mwene-Ditu:ATTESTATION_NOTORIETE:FRAUDHASH78239A',
      preEnrolledAt: '2026-07-06T12:00:00Z',
      appointmentCenter: 'Gombe - Maison Civile',
      appointmentDate: '2026-07-07',
      appointmentTime: '14:00 - 14:30'
    },
    notes: 'ATTENTION : Ce profil sert à simuler la détection de doublons biométriques (ABIS). Ses empreintes correspondront à celles de Abraham BARAKA.'
  }
];

export const MOCK_KITS: KitStatus[] = [
  {
    id: 'KIT-CGO-101',
    province: 'Kongo-Central',
    location: 'Sekebanza (Milieu Rural)',
    status: 'ONLINE',
    batteryLevel: 98,
    solarCharging: true,
    solarPowerWatts: 45,
    pendingSyncCount: 0,
    lastSyncTime: '2026-07-06T13:45:00Z'
  },
  {
    id: 'KIT-NK-402',
    province: 'Nord-Kivu',
    location: 'Masisi (Zone Enclavée)',
    status: 'OFFLINE_ACTIVE',
    batteryLevel: 72,
    solarCharging: true,
    solarPowerWatts: 38,
    pendingSyncCount: 14,
    lastSyncTime: '2026-07-05T17:30:00Z'
  },
  {
    id: 'KIT-SK-508',
    province: 'Sud-Kivu',
    location: 'Kavumu (Zone Rurale)',
    status: 'SYNCING',
    batteryLevel: 85,
    solarCharging: false,
    solarPowerWatts: 0,
    pendingSyncCount: 3,
    lastSyncTime: '2026-07-06T14:15:00Z'
  },
  {
    id: 'KIT-KAT-204',
    province: 'Haut-Katanga',
    location: 'Sakania (Brousse)',
    status: 'OFFLINE_ACTIVE',
    batteryLevel: 42,
    solarCharging: true,
    solarPowerWatts: 55,
    pendingSyncCount: 22,
    lastSyncTime: '2026-07-04T12:00:00Z'
  },
  {
    id: 'KIT-TSH-303',
    province: 'Tshopo',
    location: 'Yatolema (Forêt Équatoriale)',
    status: 'ONLINE',
    batteryLevel: 100,
    solarCharging: true,
    solarPowerWatts: 60,
    pendingSyncCount: 0,
    lastSyncTime: '2026-07-06T14:00:00Z'
  }
];

export const INITIAL_LOGS: SystemLogs[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-07-06T13:58:12Z',
    type: 'SUCCESS',
    source: 'ABIS',
    message: 'Déduplication en temps réel complétée pour REC-2026-002 (Aucun doublon trouvé. NIN généré).'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-07-06T14:00:00Z',
    type: 'INFO',
    source: 'KIT',
    message: 'Kit KIT-TSH-303 (Tshopo - Yatolema) connecté avec succès par liaison satellite. Lancement de la synchronisation.'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-07-06T14:02:15Z',
    type: 'SUCCESS',
    source: 'CENI',
    message: 'Fichier électoral de la circonscription Lubumbashi-Ville mis à jour (+1 électeur).'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-07-06T14:05:00Z',
    type: 'WARNING',
    source: 'KIT',
    message: 'Kit KIT-NK-402 (Masisi) est déconnecté (Fonctionnement hors-ligne autonome actif). 14 enregistrements chiffrés en attente de synchronisation.'
  }
];
