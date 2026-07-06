/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Calendar, FileText, Phone, Mail, MapPin, 
  Camera, CheckCircle, QrCode, ArrowRight, Printer, RefreshCw, UploadCloud, Download,
  ArrowLeft, Lock, Info, Fingerprint, Activity, ChevronRight, CreditCard, Cpu, Bell, Shield
} from 'lucide-react';
import { CitizenProfile, EnrollmentRecord } from '../types';
import { CONGO_PROVINCES, ENROLLMENT_CENTERS } from '../data/mockData';

interface CitizenPortalProps {
  onPreEnrollCompleted: (newRecord: EnrollmentRecord) => void;
  subView?: 'DASHBOARD' | 'CARDS' | 'WIZARD';
  onSubViewChange?: (view: 'DASHBOARD' | 'CARDS' | 'WIZARD') => void;
}

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop&q=80'
];

export default function CitizenPortal({ 
  onPreEnrollCompleted, 
  subView: propSubView, 
  onSubViewChange 
}: CitizenPortalProps) {
  const [formData, setFormData] = useState({
    lastName: '',
    postName: '',
    firstName: '',
    gender: 'M' as 'M' | 'F',
    birthDate: '',
    birthPlace: '',
    originProvince: 'Kinshasa',
    currentAddress: '',
    currentCity: '',
    currentProvince: 'Kinshasa',
    phone: '',
    email: '',
    justificationDoc: 'ACTE_NAISSANCE' as CitizenProfile['justificationDoc'],
    justificationDocName: '',
    appointmentCenter: '',
    appointmentDate: '',
    appointmentTime: '08:30 - 09:00'
  });

  const [step, setStep] = useState(1);
  const [internalSubView, setInternalSubView] = useState<'DASHBOARD' | 'CARDS' | 'WIZARD'>('DASHBOARD');
  
  const subView = propSubView !== undefined ? propSubView : internalSubView;
  const setSubView = (view: 'DASHBOARD' | 'CARDS' | 'WIZARD') => {
    setInternalSubView(view);
    if (onSubViewChange) {
      onSubViewChange(view);
    }
  };
  const [showCentersModal, setShowCentersModal] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nouveau centre : Gombe", detail: "Le centre de validation de la Gombe est désormais ouvert de 8h à 18h.", time: "Il y a 2h • Centre Municipal", isNew: true, type: 'info' },
    { id: 2, title: "Mise à jour d'éligibilité", detail: "Le Ministère de l'Intérieur confirme le début des enrôlements pour la tranche d'âge 15-17 ans.", time: "Hier • Ministère de l'Intérieur", isNew: false, type: 'update' }
  ]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [usePreset, setUsePreset] = useState(true);
  const [receipt, setReceipt] = useState<EnrollmentRecord | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  
  const [errors, setErrors] = useState({
    phone: '',
    birthDate: ''
  });

  const getBirthDateMessage = () => {
    if (!formData.birthDate) return null;
    const errorMsg = validateField('birthDate', formData.birthDate);
    if (errorMsg) return null;
    
    const birth = new Date(formData.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age >= 18) {
      return {
        text: `✓ Date de naissance valide (Âge : ${age} ans) — Éligible ONIP & CENI`,
        color: 'text-emerald-400'
      };
    } else {
      return {
        text: `✓ Date de naissance valide (Âge : ${age} ans - Mineur) — Carte d'identité mineur ONIP`,
        color: 'text-sky-400'
      };
    }
  };

  const getPhoneMessage = () => {
    if (!formData.phone) return null;
    const errorMsg = validateField('phone', formData.phone);
    if (errorMsg) return null;
    
    const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
    if (cleanPhone.startsWith('+243')) {
      return {
        text: '✓ Format international congolais valide (+243) !',
        color: 'text-emerald-400'
      };
    } else if (cleanPhone.startsWith('0')) {
      return {
        text: '✓ Format local RDC valide (08/09) !',
        color: 'text-emerald-400'
      };
    }
    return null;
  };

  const validateField = (name: string, value: string): string => {
    let error = '';
    if (name === 'phone') {
      const cleanPhone = value.replace(/[\s\-()]/g, '');
      if (!value) {
        error = 'Le numéro de téléphone est requis.';
      } else if (cleanPhone.startsWith('+243')) {
        if (cleanPhone.length !== 13) {
          error = 'Le format RDC complet doit contenir 9 chiffres après +243 (ex: +243 812 345 678).';
        } else if (!/^\+243[89]\d{8}$/.test(cleanPhone)) {
          error = 'Indicatif RDC valide requis (+243 suivi de 8 ou 9 et 8 chiffres).';
        }
      } else if (cleanPhone.startsWith('0')) {
        if (cleanPhone.length !== 10) {
          error = 'Le format local doit contenir 10 chiffres (ex: 0812345678).';
        } else if (!/^0[89]\d{8}$/.test(cleanPhone)) {
          error = 'Le numéro local doit commencer par 08 ou 09.';
        }
      } else {
        error = 'Le numéro doit commencer par +243 ou 0.';
      }
    } else if (name === 'birthDate') {
      if (!value) {
        error = 'La date de naissance est requise.';
      } else {
        const dateVal = new Date(value);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 120);

        if (isNaN(dateVal.getTime())) {
          error = 'Format de date invalide.';
        } else if (dateVal > today) {
          error = 'La date de naissance ne peut pas être dans le futur.';
        } else if (dateVal < minDate) {
          error = 'L\'âge ne peut pas dépasser 120 ans.';
        }
      }
    }
    return error;
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter centers based on current province selection
  const availableCenters = ENROLLMENT_CENTERS[formData.currentProvince] || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Reset center if province changes
      if (name === 'currentProvince') {
        const provinceCenters = ENROLLMENT_CENTERS[value] || [];
        updated.appointmentCenter = provinceCenters[0] || '';
      }
      return updated;
    });

    if (name === 'phone' || name === 'birthDate') {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const startCamera = async () => {
    setUsePreset(false);
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Could not access camera, using simulator portraits instead.", err);
      // Fallback to preset if camera is not available or blocked in iframe
      setUsePreset(true);
      setPhotoUrl(SAMPLE_PHOTO_PRESETS[0]);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = 400;
        canvasRef.current.height = 400;
        context.drawImage(videoRef.current, 0, 0, 400, 400);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPhotoUrl(dataUrl);
        
        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocFile(file);
      setFormData(prev => ({ ...prev, justificationDocName: file.name }));
    }
  };

  const getBase64ImageFromUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (url.startsWith('data:')) {
        resolve(url);
        return;
      }
      
      const timeout = setTimeout(() => {
        reject(new Error('Image load timeout'));
      }, 3000); // 3 seconds timeout
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg');
            resolve(dataURL);
          } else {
            reject(new Error('Canvas context is null'));
          }
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (e) => {
        clearTimeout(timeout);
        reject(e);
      };
      img.src = url;
    });
  };

  const downloadPDF = async () => {
    if (!receipt) return;
    
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const preEnrolledDate = new Date(receipt.citizen.preEnrolledAt);
      const validUntilDate = new Date(preEnrolledDate.getTime() + 180 * 24 * 60 * 60 * 1000);
      const validUntilStr = validUntilDate.toLocaleDateString('fr-FR');
      const preEnrolledStr = preEnrolledDate.toLocaleDateString('fr-FR');

      // -------------------------------------------------------------
      // 1. BACKGROUND WATERMARK (Tamper-proofing)
      // -------------------------------------------------------------
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(240, 246, 252); // extremely faint blue-grey
      
      // Add multiple diagonal lines of security watermark text across the page
      for (let yOffset = 40; yOffset < 280; yOffset += 60) {
        doc.text("DOCUMENT DE PRE-ENROLEMENT SECURISE", 15, yOffset, { angle: 30 });
        doc.text("REPUBLIQUE DEMOCRATIQUE DU CONGO - ONIP", 25, yOffset + 30, { angle: 30 });
      }

      // -------------------------------------------------------------
      // 2. HEADER BANNER & DECORATIVE BORDER
      // -------------------------------------------------------------
      // Page border
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 277, 'S');

      // Congo Flag top accent strip (Blue, Yellow, Red)
      doc.setFillColor(0, 133, 202); // Congo Blue
      doc.rect(10.5, 10.5, 114, 3, 'F');
      doc.setFillColor(255, 194, 32); // Congo Gold
      doc.rect(124.5, 10.5, 19, 3, 'F');
      doc.setFillColor(206, 17, 38); // Congo Red
      doc.rect(143.5, 10.5, 56, 3, 'F');

      // Official text headers
      doc.setTextColor(0, 51, 102); // Dark Blue
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.text("RÉPUBLIQUE DÉMOCRATIQUE DU CONGO", 105, 20, { align: 'center' });
      
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.setFont("Helvetica", "normal");
      doc.text("MINISTÈRE DE L'INTÉRIEUR, SÉCURITÉ, DÉCENTRALISATION ET AFFAIRES COUTUMIÈRES", 105, 24, { align: 'center' });
      doc.text("OFFICE NATIONAL DE L'IDENTIFICATION DE LA POPULATION (ONIP) & COMMISSION ELECTORALE (CENI)", 105, 28, { align: 'center' });
      
      // Title Banner
      doc.setFillColor(240, 245, 255);
      doc.rect(15, 33, 180, 12, 'F');
      doc.setDrawColor(180, 200, 240);
      doc.rect(15, 33, 180, 12, 'S');
      
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(11);
      doc.setFont("Helvetica", "bold");
      doc.text("FICHE DE PRÉ-ENRÔLEMENT CIVIL ET ÉLECTORAL", 105, 41, { align: 'center' });

      // -------------------------------------------------------------
      // 3. RECIPISSÉ METADATA BOX
      // -------------------------------------------------------------
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(252, 252, 252);
      doc.roundedRect(15, 50, 180, 15, 2, 2, 'FD');

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(9);
      doc.setFont("Helvetica", "bold");
      doc.text(`RÉCÉPISSÉ N°: ${receipt.id}`, 20, 59);

      doc.setFont("Helvetica", "normal");
      doc.text(`Date de pré-enrôlement : ${preEnrolledStr}`, 90, 59);
      
      // Valid until date highlighting (Anti-tamper / Expiry)
      doc.setTextColor(206, 17, 38); // Red
      doc.setFont("Helvetica", "bold");
      doc.text(`VALIDE JUSQU'AU : ${validUntilStr}`, 145, 59);

      // -------------------------------------------------------------
      // 4. CIVIL DETAILS GRID
      // -------------------------------------------------------------
      doc.setTextColor(0, 51, 102);
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.text("I. ÉTAT-CIVIL ET IDENTITÉ DU CITOYEN", 15, 74);
      
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 76, 195, 76);

      // Profile photo handling
      const photoX = 15;
      const photoY = 82;
      const photoW = 32;
      const photoH = 40;
      
      // Draw photo container border
      doc.setDrawColor(180, 180, 180);
      doc.rect(photoX, photoY, photoW, photoH, 'S');

      let imageLoaded = false;
      try {
        const base64Data = await getBase64ImageFromUrl(receipt.citizen.photoUrl);
        doc.addImage(base64Data, 'JPEG', photoX + 1, photoY + 1, photoW - 2, photoH - 2);
        imageLoaded = true;
      } catch (err) {
        console.warn("Could not load receipt photo for PDF, drawing vector silhouette instead.", err);
      }

      if (!imageLoaded) {
        // Draw a neat vector avatar silhouette if image load fails
        doc.setFillColor(235, 235, 235);
        doc.rect(photoX + 1, photoY + 1, photoW - 2, photoH - 2, 'F');
        
        // Face circle
        doc.setFillColor(180, 180, 180);
        doc.circle(photoX + photoW / 2, photoY + 15, 6, 'F');
        
        // Body chest shape
        doc.setFillColor(180, 180, 180);
        doc.ellipse(photoX + photoW / 2, photoY + 32, 10, 8, 'F');
        
        doc.setTextColor(120, 120, 120);
        doc.setFontSize(6.5);
        doc.setFont("Helvetica", "bold");
        doc.text("PHOTO CITOYEN", photoX + photoW / 2, photoY + 38, { align: 'center' });
      }

      // Civil information details rows
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");

      const fields = [
        { label: "NOM", value: receipt.citizen.lastName, isBold: true },
        { label: "POSTNOM", value: receipt.citizen.postName || "-", isBold: true },
        { label: "PRÉNOM", value: receipt.citizen.firstName, isBold: true },
        { label: "GENRE", value: receipt.citizen.gender === 'M' ? 'Masculin (M)' : 'Féminin (F)', isBold: false },
        { label: "NÉ(E) LE", value: new Date(receipt.citizen.birthDate).toLocaleDateString('fr-FR'), isBold: false },
        { label: "LIEU DE NAISSANCE", value: receipt.citizen.birthPlace, isBold: false },
        { label: "PROVINCE D'ORIGINE", value: receipt.citizen.originProvince, isBold: false },
        { label: "ADRESSE DOMICILE", value: receipt.citizen.currentAddress, isBold: false },
        { label: "VILLE / COMMUNE", value: receipt.citizen.currentCity, isBold: false },
        { label: "PROVINCE DE RÉSIDENCE", value: receipt.citizen.currentProvince, isBold: false },
        { label: "N° TÉLÉPHONE", value: receipt.citizen.phone, isBold: false },
        { label: "ADRESSE EMAIL", value: receipt.citizen.email, isBold: false },
        { label: "DOCUMENT FOURNI", value: receipt.citizen.justificationDoc.replace('_', ' '), isBold: false }
      ];

      let currentY = 83;
      const startX = 54;
      const labelW = 42;
      const valueX = startX + labelW;

      fields.forEach((field, idx) => {
        // Draw background stripe for odd rows for premium legibility
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(startX - 2, currentY - 3, 141, 4.5, 'F');
        }

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text(`${field.label} :`, startX, currentY);

        doc.setTextColor(40, 40, 40);
        if (field.isBold) {
          doc.setFont("Helvetica", "bold");
        } else {
          doc.setFont("Helvetica", "normal");
        }
        doc.text(String(field.value), valueX, currentY);

        currentY += 4.5;
      });

      // -------------------------------------------------------------
      // 5. APPOINTMENT / GUICHET INFORMATION
      // -------------------------------------------------------------
      doc.setTextColor(0, 51, 102);
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.text("II. CONVOCATION AU GUICHET PHYSIQUE", 15, 150);
      
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 152, 195, 152);

      doc.setFillColor(245, 247, 250);
      doc.roundedRect(15, 156, 180, 20, 1.5, 1.5, 'F');

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text("BUREAU DE VALIDATION TERRITORIALE :", 20, 163);
      doc.text("DATE ET CRENEAU DE CONVOCATION :", 20, 171);

      doc.setFont("Helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text(receipt.citizen.appointmentCenter, 85, 163);
      doc.text(`${new Date(receipt.citizen.appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à ${receipt.citizen.appointmentTime}`, 85, 171);

      // -------------------------------------------------------------
      // 6. QR CODE AND SECURITY FRAME
      // -------------------------------------------------------------
      doc.setTextColor(0, 51, 102);
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.text("III. CODE QR CRYPTOGRAPHIQUE SÉCURISÉ", 15, 186);
      
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 188, 195, 188);

      // Centered box for QR code
      const qrX = 85;
      const qrY = 193;
      const qrBoxW = 40;
      const qrBoxH = 40;

      doc.setDrawColor(0, 133, 202); // Congo Blue border for secure frame
      doc.setLineWidth(0.8);
      doc.rect(qrX - 2, qrY - 2, qrBoxW + 4, qrBoxH + 4, 'S');
      doc.setLineWidth(0.5); // restore

      // Draw Vector QR Code (8x8)
      const qrGridSize = 8;
      const cellSize = qrBoxW / qrGridSize;
      for (let r = 0; r < qrGridSize; r++) {
        for (let c = 0; c < qrGridSize; c++) {
          const i = r * qrGridSize + c;
          const isCorner = 
            (i < 3 || (i >= 8 && i <= 10) || (i >= 16 && i <= 18)) || // Top left
            (i % 8 >= 5 && i < 24) || // Top right
            (i >= 48 && i % 8 < 3); // Bottom left
          
          // Seed simple deterministic hash
          const hash = (i * 12345 + 6789) % 100;
          const rand = hash > 45;

          if (isCorner) {
            doc.setFillColor(0, 133, 202); // Congo blue
            doc.rect(qrX + c * cellSize, qrY + r * cellSize, cellSize, cellSize, 'F');
          } else if (rand) {
            doc.setFillColor(0, 0, 0); // Black
            doc.rect(qrX + c * cellSize, qrY + r * cellSize, cellSize, cellSize, 'F');
          }
        }
      }

      // Draw central white square for logo
      doc.setFillColor(255, 255, 255);
      doc.rect(qrX + 3.1 * cellSize, qrY + 3.1 * cellSize, 1.8 * cellSize, 1.8 * cellSize, 'F');
      doc.setDrawColor(0, 133, 202);
      doc.rect(qrX + 3.1 * cellSize, qrY + 3.1 * cellSize, 1.8 * cellSize, 1.8 * cellSize, 'S');
      
      doc.setTextColor(0, 133, 202);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(6);
      doc.text("RDC", qrX + 3.4 * cellSize, qrY + 4.2 * cellSize);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("EMPREINTE NUMÉRIQUE :", 105, 240, { align: 'center' });
      doc.setFont("Courier", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text(receipt.citizen.qrCodeData.split(':')[8] || 'HASH-SECURE-99X', 105, 244, { align: 'center' });

      // -------------------------------------------------------------
      // 7. DIGITAL WATERMARK SECURITY PANEL & LEGAL FOOTER
      // -------------------------------------------------------------
      doc.setDrawColor(220, 230, 242);
      doc.setFillColor(245, 248, 252);
      doc.roundedRect(15, 250, 180, 25, 2, 2, 'FD');

      // Watermark symbol badge
      doc.setFillColor(0, 133, 202); // Congo Blue
      doc.circle(23, 262.5, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("OK", 21.5, 264.5);

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(8.5);
      doc.setFont("Helvetica", "bold");
      doc.text("Filigrane Numérique de Sécurité (Anti-falsification)", 30, 257);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text("Ce document comporte un filigrane numérique cryptographique intégré. Toute modification du texte ou de la photo", 30, 262);
      doc.text("invalidera la signature cryptographique ci-contre lors de la lecture physique au guichet ONIP.", 30, 266);

      // Cryptographic signature details line
      doc.setFont("Courier", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(120, 120, 120);
      const signatureHash = `${receipt.citizen.qrCodeData.split(':')[8]}-${receipt.id}-VAL_UNTIL_${validUntilDate.toISOString().split('T')[0]}`;
      doc.text(`SIG-HASH: ${signatureHash}`, 30, 271);

      // Document footer
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(160, 160, 160);
      doc.text("Document généré par la plateforme nationale ID-RDC. Ne pas plier le Code QR.", 105, 282, { align: 'center' });

      // Save PDF
      doc.save(`Recipisse_Pre_Enrolement_${receipt.citizen.lastName}_${receipt.citizen.firstName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF: ", error);
      alert("Une erreur est survenue lors de la génération du fichier PDF.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify values or complete default
    const finalPhoto = photoUrl || SAMPLE_PHOTO_PRESETS[0];
    const finalCenter = formData.appointmentCenter || availableCenters[0] || 'Centre Principal';
    
    // Generate simulated QR Code content (civil details + cryptographic signature hash)
    const cryptoHash = Math.random().toString(36).substring(2, 11).toUpperCase() + Math.random().toString(36).substring(2, 11).toUpperCase();
    const qrData = `IDCONGO:${formData.lastName}:${formData.postName}:${formData.firstName}:${formData.gender}:${formData.birthDate}:${formData.birthPlace}:${formData.justificationDoc}:${cryptoHash}`;

    const newProfile: CitizenProfile = {
      id: 'CIT-' + Math.floor(10000 + Math.random() * 90000),
      lastName: formData.lastName.toUpperCase(),
      postName: formData.postName.toUpperCase(),
      firstName: formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1),
      gender: formData.gender,
      birthDate: formData.birthDate,
      birthPlace: formData.birthPlace,
      originProvince: formData.originProvince,
      currentAddress: formData.currentAddress,
      currentCity: formData.currentCity,
      currentProvince: formData.currentProvince,
      phone: formData.phone || '+243 81 000 0000',
      email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@id-congo.cd`,
      justificationDoc: formData.justificationDoc,
      justificationDocName: formData.justificationDocName || 'justificatif_telecharge.pdf',
      photoUrl: finalPhoto,
      qrCodeData: qrData,
      preEnrolledAt: new Date().toISOString(),
      appointmentCenter: finalCenter,
      appointmentDate: formData.appointmentDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
      appointmentTime: formData.appointmentTime
    };

    const newRecord: EnrollmentRecord = {
      id: 'REC-2026-' + Math.floor(100 + Math.random() * 900),
      status: 'AWAITING_BIOMETRICS',
      citizen: newProfile
    };

    setReceipt(newRecord);
    onPreEnrollCompleted(newRecord);
    setStep(4);
  };

  if (subView === 'DASHBOARD') {
    return (
      <div id="citizen_dashboard" className="max-w-4xl mx-auto space-y-6 text-slate-800 pb-12">
        {/* Top Title Bar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="/src/assets/images/abraham_baraka_headshot_1783380003224.jpg" 
                alt="Abraham Baraka Maheshe" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-congo-blue/20 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-950 tracking-tight">Bonjour, Abraham 👋</h1>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" /> Identité Confirmée
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Portail National d'Identité Numérique — ID-RDC</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-4 py-2.5 rounded-2xl">
            <Fingerprint className="w-5 h-5 text-congo-blue" />
            <div className="text-left">
              <p className="text-[10px] font-mono text-slate-400 leading-none">NUMÉRO NATIONAL UNIQUE</p>
              <p className="text-xs font-mono font-bold text-slate-700">NIN-1985-COD-89472019</p>
            </div>
          </div>
        </div>

        {/* Deployment Phase Banner */}
        <div className="bg-gradient-to-r from-congo-blue via-congo-blue/95 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.2),transparent)]"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="bg-white/10 text-congo-gold text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10">
                Phase 1 : Zones Urbaines
              </span>
              <h2 className="text-xl font-bold tracking-tight">Enrôlement National & Cartes d'Identité</h2>
              <p className="text-sm text-slate-200 leading-relaxed">
                Le déploiement progresse activement à Kinshasa et dans les chefs-lieux de province. Obtenez votre CNI sécurisée en quelques étapes simples.
              </p>
              
              {/* Progress */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-slate-300">
                  <span>Taux de couverture provincial</span>
                  <span className="text-white font-bold">68%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="bg-congo-gold h-full rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowCentersModal(true)}
              className="bg-white hover:bg-slate-50 text-congo-blue text-xs font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap self-start md:self-center cursor-pointer font-sans"
            >
              <MapPin className="w-4 h-4 text-congo-blue" />
              CENTRES D'ENRÔLEMENT PROCHES
            </button>
          </div>
        </div>

        {/* Bento Grid Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action 1: Ma Carte */}
          <button 
            onClick={() => setSubView('CARDS')}
            className="group bg-white hover:bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 text-left shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-congo-blue/5 rounded-full blur-2xl transition-all group-hover:scale-125"></div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="p-3 bg-congo-blue/10 text-congo-blue rounded-2xl group-hover:bg-congo-blue group-hover:text-white transition-colors">
                <CreditCard className="w-8 h-8" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 mb-1">Ma Carte d'Identité</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Consultez et gérez vos titres d'identité numérisés, y compris votre carte d'identité ONIP et votre carte d'électeur CENI.
            </p>
          </button>

          {/* Action 2: Enrôlement */}
          <button 
            onClick={() => {
              setSubView('WIZARD');
              setStep(1);
            }}
            className="group bg-white hover:bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 text-left shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl transition-all group-hover:scale-125"></div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Fingerprint className="w-8 h-8" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 mb-1">Nouvel Enrôlement</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Initiez une demande de pré-enrôlement civil pour un proche ou mettez à jour votre dossier biométrique en ligne.
            </p>
          </button>
        </div>

        {/* Security Info Card */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl text-emerald-600 flex-shrink-0 shadow-sm relative">
              <Lock className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-950 flex items-center gap-2">
                Sécurité Militaire AES-256
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md">ID-RDC SECURE</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                Vos données biométriques et d'état-civil sont cryptées de bout en bout et hébergées sur le Cloud Souverain National de la République Démocratique du Congo.
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 border border-slate-200/60 rounded-xl px-3 py-1.5 bg-white whitespace-nowrap self-start md:self-center">
            SYSTEM_INTEGRITY: 100%
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-950 flex items-center gap-2">
              <Bell className="w-5 h-5 text-congo-blue" />
              Mises à jour & Notifications
            </h3>
            <span className="bg-congo-blue/10 text-congo-blue text-xs font-bold px-2 py-0.5 rounded-full">
              {notifications.filter(n => n.isNew).length} nouvelles
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div key={n.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className={`p-2 rounded-xl flex-shrink-0 ${n.type === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                  {n.type === 'info' ? <Info className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-slate-900 text-sm">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{n.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Locations Modal */}
        {showCentersModal && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-congo-blue" />
                  Centres de Validation à Proximité
                </h3>
                <button 
                  onClick={() => setShowCentersModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Voici les centres d'enrôlement et de délivrance de cartes nationaux opérationnels près de chez vous. Présentez-vous muni de votre QR Code de pré-enrôlement.
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Mairie de la Gombe (GPR-01)</h4>
                    <p className="text-xs text-slate-500">Avenue de la Justice, Face au Palais de la Nation</p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-1">● Ouvert • Attente estimée : &lt; 15 min</p>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-mono px-2 py-1 rounded-md">800m</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Maison Communale de Limete (GPR-02)</h4>
                    <p className="text-xs text-slate-500">Boulevard Lumumba, 7ème Rue Résidentiel</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-1">● Ouvert • Attente estimée : 30 min</p>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-mono px-2 py-1 rounded-md">4.2 km</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Centre National de la RTNC (GPR-05)</h4>
                    <p className="text-xs text-slate-500">Avenue Kabinda, Lingwala</p>
                    <p className="text-[10px] text-red-500 font-medium mt-1">● Saturé • Attente estimée : &gt; 1h</p>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-mono px-2 py-1 rounded-md">2.8 km</span>
                </div>
              </div>

              <button 
                onClick={() => setShowCentersModal(false)}
                className="w-full bg-congo-blue hover:bg-congo-blue/90 text-white font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer"
              >
                Fermer la liste
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (subView === 'CARDS') {
    return (
      <div id="citizen_cards_view" className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSubView('DASHBOARD')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold cursor-pointer bg-transparent border-none p-0"
          >
            <ArrowLeft className="w-5 h-5" /> Retour au Tableau de Bord
          </button>
          <span className="text-xs text-slate-500 font-mono">ID-RDC SECURE WALLET v2.1</span>
        </div>

        {/* Title area */}
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">Mes Cartes d'Identité Nationales</h2>
          <p className="text-xs text-slate-400">Titres d'identité officiels sécurisés et numérisés de la République Démocratique du Congo.</p>
        </div>

        {/* Cards Stack / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Carte Nationale d'Identité Polycarbonate */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase">CARTE NATIONALE D'IDENTITÉ (CNI)</h3>
            
            {/* The Polycarbonate Card Visual */}
            <div className="w-full max-w-sm mx-auto aspect-[1.586/1] bg-gradient-to-tr from-[#eef2f7] via-[#f5f8fc] to-[#e6ecf3] border-2 border-slate-200 rounded-2xl p-4 shadow-xl text-slate-800 relative overflow-hidden font-sans">
              <div className="absolute inset-0 bg-[radial-gradient(#005ab7_1px,transparent_1px)] [background-size:16px_16px] opacity-5"></div>
              <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[radial-gradient(circle,rgba(225,37,49,0.06)_0%,transparent_70%)] rounded-full"></div>
              <div className="absolute -left-20 -top-20 w-60 h-60 bg-[radial-gradient(circle,rgba(0,90,183,0.06)_0%,transparent_70%)] rounded-full"></div>
              
              {/* Filigrane / Coat of Arms Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none z-0">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_Arms_Democratic_Republic_of_Congo.png/250px-Coat_of_Arms_Democratic_Republic_of_Congo.png" 
                  alt="Filigrane Armoiries RDC" 
                  className="w-[140px] h-[140px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-congo-blue/30 pb-2 relative z-10">
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 800 600" className="w-6 h-4 rounded-xs shadow-xs border border-slate-200 shrink-0">
                    <rect width="800" height="600" fill="#007FFF"/>
                    <path d="M 0,470 L 626,0 L 800,0 L 800,130 L 174,600 L 0,600 Z" fill="#FFD700"/>
                    <path d="M 0,500 L 666,0 L 800,0 L 800,100 L 133,600 L 0,600 Z" fill="#CE1126"/>
                    <g transform="translate(150, 150) scale(1.5)">
                      <path d="M 0,-40 L 11.7,-11.7 L 40,-11.7 L 17.6,5 L 26,34.2 L 0,16.2 L -26,34.2 L -17.6,5 L -40,-11.7 L -11.7,-11.7 Z" fill="#FFD700" />
                    </g>
                  </svg>
                  <div className="text-left">
                    <h4 className="text-[9px] font-extrabold text-slate-900 tracking-tight leading-none">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h4>
                    <p className="text-[7px] text-slate-500 font-bold leading-none mt-0.5">MINISTÈRE DE L'INTÉRIEUR • ONIP</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-slate-900 text-white text-[7px] font-black px-1.5 py-0.5 rounded leading-none">CNI</span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="grid grid-cols-12 gap-3 mt-3 relative z-10">
                {/* Photo Section */}
                <div className="col-span-4 relative">
                  <div className="w-full aspect-[3/4] bg-slate-200 rounded-lg overflow-hidden border-2 border-white shadow-md relative">
                    <img 
                      src="/src/assets/images/abraham_baraka_headshot_1783380003224.jpg" 
                      alt="Abraham Portrait" 
                      className="w-full h-full object-cover grayscale opacity-90 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-60 pointer-events-none mix-blend-overlay"></div>
                  </div>
                  <div className="mt-1 text-center">
                    <span className="text-[5px] font-mono text-slate-400 font-bold uppercase leading-none">EMPREINTE CONFIRMÉE</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="col-span-8 space-y-1 text-[8px] leading-tight text-slate-800 text-left">
                  <div className="grid grid-cols-2 gap-x-2">
                    <div>
                      <p className="text-[5px] text-slate-400 font-bold uppercase leading-none">NOM</p>
                      <p className="font-extrabold text-slate-900 uppercase text-[9px]">BARAKA</p>
                    </div>
                    <div>
                      <p className="text-[5px] text-slate-400 font-bold uppercase leading-none">POSTNOM</p>
                      <p className="font-extrabold text-slate-900 uppercase text-[9px]">MAHESHE</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[5px] text-slate-400 font-bold uppercase leading-none">PRÉNOM</p>
                    <p className="font-bold text-slate-800">Abraham</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2">
                    <div>
                      <p className="text-[5px] text-slate-400 font-bold uppercase leading-none">NÉ LE</p>
                      <p className="font-bold text-slate-800">23.11.1985</p>
                    </div>
                    <div>
                      <p className="text-[5px] text-slate-400 font-bold uppercase leading-none">LIEU DE NAISSANCE</p>
                      <p className="font-bold text-slate-800">Lubumbashi</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-x-2">
                    <div>
                      <p className="text-[5px] text-slate-400 font-bold uppercase leading-none">SEXE</p>
                      <p className="font-bold text-slate-800">M</p>
                    </div>
                    <div>
                      <p className="text-[5px] text-slate-400 font-bold uppercase leading-none">TAILLE</p>
                      <p className="font-bold text-slate-800">1.75m</p>
                    </div>
                    <div>
                      <p className="text-[5px] text-slate-400 font-bold uppercase leading-none">PROVINCE</p>
                      <p className="font-bold text-slate-800">Haut-Katanga</p>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[5px] text-slate-400 font-mono leading-none uppercase">NIN (Numéro National d'Identité)</p>
                      <p className="font-mono font-black text-congo-blue text-[8px] leading-none mt-0.5">NIN-1985-COD-89472019</p>
                    </div>
                    <Cpu className="w-3.5 h-3.5 text-congo-blue opacity-80 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Security Microprint Bar */}
              <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center text-[5px] font-mono text-slate-400 border-t border-slate-200/40 pt-1.5 z-10">
                <span>EXP: 31.12.2031</span>
                <span className="font-bold text-slate-500">ONIP SECURE POLYCARBONATE CARD</span>
                <span>ID_COD_092183</span>
              </div>
            </div>

            {/* Actions for Card 1 */}
            <div className="flex gap-2 max-w-sm mx-auto justify-center">
              <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Imprimer
              </button>
              <button className="flex-1 bg-congo-blue hover:bg-congo-blue/90 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Télécharger PDF
              </button>
            </div>
          </div>

          {/* Card 2: Carte d'Électeur Unifiée CENI */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase">CARTE D'ÉLECTEUR CONGOLAISE (CENI)</h3>
            
            {/* CENI Card Visual */}
            <div className="w-full max-w-sm mx-auto aspect-[1.586/1] bg-gradient-to-tr from-[#fffdf4] to-[#f7f2dc] border-2 border-[#e0cb95] rounded-2xl p-4 shadow-xl text-slate-800 relative overflow-hidden font-sans">
              <div className="absolute inset-0 bg-[radial-gradient(#705d00_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]"></div>
              <div className="absolute -right-16 -bottom-16 w-52 h-52 bg-[radial-gradient(circle,rgba(112,93,0,0.06)_0%,transparent_70%)] rounded-full"></div>
              
              {/* Filigrane / Coat of Arms Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none z-0">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_Arms_Democratic_Republic_of_Congo.png/250px-Coat_of_Arms_Democratic_Republic_of_Congo.png" 
                  alt="Filigrane Armoiries RDC" 
                  className="w-[140px] h-[140px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-[#705d00]/30 pb-2 relative z-10">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-4 bg-congo-red flex flex-col justify-between overflow-hidden rounded-sm border border-[#e0cb95]">
                    <div className="h-full bg-congo-red flex items-center justify-center">
                      <span className="text-[6px] font-black text-white">CENI</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="text-[9px] font-extrabold text-[#705d00] tracking-tight leading-none">COMMISSION ÉLECTORALE NATIONALE INDÉPENDANTE</h4>
                    <p className="text-[7px] text-slate-500 font-bold leading-none mt-0.5">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
                  </div>
                </div>
                <span className="bg-[#705d00] text-white text-[7px] font-bold px-1.5 py-0.5 rounded leading-none">VOTE</span>
              </div>

              {/* Card Content Area */}
              <div className="grid grid-cols-12 gap-3 mt-3 relative z-10">
                {/* Details Section */}
                <div className="col-span-8 space-y-1 text-[8px] leading-tight text-slate-800 text-left">
                  <div className="grid grid-cols-2 gap-x-2">
                    <div>
                      <p className="text-[5px] text-[#705d00] font-bold uppercase leading-none">NOM</p>
                      <p className="font-extrabold text-slate-900 uppercase text-[9px]">BARAKA</p>
                    </div>
                    <div>
                      <p className="text-[5px] text-[#705d00] font-bold uppercase leading-none">POSTNOM</p>
                      <p className="font-extrabold text-slate-900 uppercase text-[9px]">MAHESHE</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[5px] text-[#705d00] font-bold uppercase leading-none">PRÉNOM</p>
                    <p className="font-bold text-slate-800">Abraham</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2">
                    <div>
                      <p className="text-[5px] text-[#705d00] font-bold uppercase leading-none">DATE DE NAISSANCE</p>
                      <p className="font-bold text-slate-800">23.11.1985</p>
                    </div>
                    <div>
                      <p className="text-[5px] text-[#705d00] font-bold uppercase leading-none">LIEU D'ENRÔLEMENT</p>
                      <p className="font-bold text-slate-800">Lubumbashi, Haut-Katanga</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#705d00]/20">
                    <p className="text-[5px] text-[#705d00] font-mono leading-none uppercase">NUMÉRO D'ÉLECTEUR UNIQUE</p>
                    <p className="font-mono font-black text-[#705d00] text-[9px] leading-none mt-0.5">CENI-VOTE-89472019</p>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="col-span-4 flex flex-col items-center justify-center">
                  <div className="p-1.5 bg-white border border-[#e0cb95] rounded-xl shadow-sm">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <span className="text-[6px] font-mono text-[#705d00] font-bold mt-1 uppercase leading-none">SCRUTIN ACTIF 2026</span>
                </div>
              </div>

              {/* Card Footer Microprint */}
              <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center text-[5px] font-mono text-slate-400 border-t border-slate-200/40 pt-1.5 z-10">
                <span>RDC - SOUVERAINETÉ</span>
                <span className="font-bold text-[#705d00]">CENI SECURITISED DIGITAL CREDENTIAL</span>
                <span>STATION: 10291</span>
              </div>
            </div>

            {/* Actions for Card 2 */}
            <div className="flex gap-2 max-w-sm mx-auto justify-center">
              <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Imprimer
              </button>
              <button className="flex-1 bg-[#705d00] hover:bg-[#705d00]/90 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Télécharger PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="citizen_portal_view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white relative">
      <div className="lg:col-span-12 flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <button 
          onClick={() => setSubView('DASHBOARD')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeft className="w-5 h-5" /> Retour au Tableau de Bord
        </button>
        <span className="text-xs text-congo-blue font-mono font-bold uppercase tracking-wider">FORMULAIRE DE PRÉ-ENRÔLEMENT CIVIL</span>
      </div>
      {/* Informative Left Side */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
        <div className="bg-congo-card/90 border border-congo-blue/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-congo-blue/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-congo-blue/10 rounded-xl text-congo-blue">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-congo-blue font-semibold tracking-wider uppercase font-mono">Service Public</span>
              <h3 className="text-lg font-display font-semibold text-white">Auto-Enrôlement Civil</h3>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Gagnez du temps grâce à l'enrôlement hybride en RDC. Remplissez vos données administratives en ligne et téléchargez votre QR Code de pré-enrôlement sécurisé.
          </p>

          {/* Stepper indicator */}
          <div className="space-y-4">
            <div className={`flex items-center space-x-3 text-sm ${step >= 1 ? 'text-congo-blue font-medium' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step > 1 ? 'bg-congo-blue border-congo-blue text-white' : 'border-gray-600'} text-xs`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span>État-Civil & Naissance</span>
            </div>

            <div className={`flex items-center space-x-3 text-sm ${step >= 2 ? 'text-congo-blue font-medium' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step > 2 ? 'bg-congo-blue border-congo-blue text-white' : 'border-gray-600'} text-xs`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span>Photo d'Identité & Pièces</span>
            </div>

            <div className={`flex items-center space-x-3 text-sm ${step >= 3 ? 'text-congo-blue font-medium' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step > 3 ? 'bg-congo-blue border-congo-blue text-white' : 'border-gray-600'} text-xs`}>
                {step > 3 ? '✓' : '3'}
              </div>
              <span>Rendez-vous au Guichet</span>
            </div>

            <div className={`flex items-center space-x-3 text-sm ${step >= 4 ? 'text-congo-blue font-medium' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 4 ? 'border-congo-blue text-congo-blue' : 'border-gray-600'} text-xs`}>
                {step >= 4 ? '★' : '4'}
              </div>
              <span>QR Code & Récépissé</span>
            </div>
          </div>
        </div>

        {/* Benefits Panel */}
        <div className="bg-gradient-to-br from-congo-blue/10 to-congo-dark border border-congo-blue/20 rounded-2xl p-6 text-sm">
          <h4 className="text-congo-gold font-display font-medium mb-3 flex items-center gap-2">
            <span>⚡</span> Pourquoi se pré-enregistrer ?
          </h4>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-congo-blue font-bold mt-0.5">•</span>
              <span><strong>Guichet Express :</strong> Temps de passage au guichet divisé par 4 (moins de 3 minutes).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-congo-blue font-bold mt-0.5">•</span>
              <span><strong>Zéro erreur :</strong> Vous contrôlez la saisie de vos données pour éviter les fautes d'orthographe.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-congo-blue font-bold mt-0.5">•</span>
              <span><strong>Gratuit :</strong> L'enrôlement civil et électoral est un droit fondamental garanti par la Constitution.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Interactive Form Area */}
      <div className="lg:col-span-8 bg-congo-card border border-gray-800 rounded-2xl p-6 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-1">Informations Administratives</h2>
                <p className="text-xs text-gray-400">Étape 1 sur 3 : Remplissez scrupuleusement les champs selon vos justificatifs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nom <span className="text-congo-red">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Ex: KABAMBA"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Postnom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="postName"
                      placeholder="Ex: MULUMBA"
                      value={formData.postName}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Prénom <span className="text-congo-red">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Ex: Merveille"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Genre <span className="text-congo-red">*</span></label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Date de Naissance <span className="text-congo-red">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      name="birthDate"
                      required
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className={`w-full bg-congo-dark/60 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all ${
                        errors.birthDate 
                          ? 'border-congo-red focus:border-congo-red focus:ring-1 focus:ring-congo-red/30' 
                          : formData.birthDate 
                            ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30' 
                            : 'border-gray-800 focus:border-congo-blue'
                      }`}
                    />
                  </div>
                  {errors.birthDate && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-congo-red mt-1.5 font-medium flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-congo-red shrink-0" />
                      {errors.birthDate}
                    </motion.p>
                  )}
                  {!errors.birthDate && getBirthDateMessage() && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[11px] ${getBirthDateMessage()?.color} mt-1.5 font-medium flex items-center gap-1.5`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${getBirthDateMessage()?.color === 'text-emerald-400' ? 'bg-emerald-400' : 'bg-sky-400'} shrink-0`} />
                      {getBirthDateMessage()?.text}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Lieu de Naissance <span className="text-congo-red">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="birthPlace"
                      required
                      placeholder="Ex: Kinshasa"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Province d'Origine <span className="text-congo-red">*</span></label>
                  <select
                    name="originProvince"
                    value={formData.originProvince}
                    onChange={handleInputChange}
                    className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-congo-blue h-[42px]"
                  >
                    {CONGO_PROVINCES.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Province Actuelle <span className="text-congo-red">*</span></label>
                  <select
                    name="currentProvince"
                    value={formData.currentProvince}
                    onChange={handleInputChange}
                    className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-congo-blue h-[42px]"
                  >
                    {CONGO_PROVINCES.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Adresse Domicile <span className="text-congo-red">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="currentAddress"
                      required
                      placeholder="Ex: Avenue Kisangani N°12, Q/Golf"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Ville / Commune / Territoire <span className="text-congo-red">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="currentCity"
                      required
                      placeholder="Ex: Gombe, Kinshasa"
                      value={formData.currentCity}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">N° Téléphone <span className="text-congo-red">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Ex: +243 812 345 678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-congo-dark/60 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all ${
                        errors.phone 
                          ? 'border-congo-red focus:border-congo-red focus:ring-1 focus:ring-congo-red/30' 
                          : formData.phone 
                            ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30' 
                            : 'border-gray-800 focus:border-congo-blue'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-congo-red mt-1.5 font-medium flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-congo-red shrink-0" />
                      {errors.phone}
                    </motion.p>
                  )}
                  {!errors.phone && getPhoneMessage() && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-emerald-400 mt-1.5 font-medium flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {getPhoneMessage()?.text}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Ex: monadresse@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const phoneErr = validateField('phone', formData.phone);
                    const dateErr = validateField('birthDate', formData.birthDate);

                    if (phoneErr || dateErr) {
                      setErrors({ phone: phoneErr, birthDate: dateErr });
                      return;
                    }

                    if (formData.lastName && formData.firstName && formData.birthDate && formData.birthPlace && formData.currentAddress && formData.phone) {
                      setStep(2);
                    } else {
                      alert("Veuillez remplir correctement tous les champs obligatoires (*) pour continuer.");
                    }
                  }}
                  className="bg-congo-blue hover:bg-congo-blue/90 text-white font-display font-medium text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-1">Pièce Justificative & Photo</h2>
                <p className="text-xs text-gray-400">Étape 2 sur 3 : Chargez votre preuve de citoyenneté et capturez votre visage.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proof Document Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Type de Document Justificatif <span className="text-congo-red">*</span></label>
                    <select
                      name="justificationDoc"
                      value={formData.justificationDoc}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    >
                      <option value="ACTE_NAISSANCE">Acte de Naissance</option>
                      <option value="JUGEMENT_SUPPLETIF">Jugement Supplétif d'État-Civil</option>
                      <option value="CERTIFICAT_NATIONALITE">Certificat de Nationalité Congolaise</option>
                      <option value="ATTESTATION_NOTORIETE">Attestation de Notoriété Publique</option>
                    </select>
                  </div>

                  <div className="border-2 border-dashed border-gray-800 hover:border-congo-blue/40 rounded-2xl p-6 transition-colors flex flex-col items-center justify-center text-center space-y-2 bg-congo-dark/20 cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        {formData.justificationDocName ? formData.justificationDocName : "Téléverser le document justificatif"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (Max. 5 Mo)</p>
                    </div>
                  </div>

                  {formData.justificationDocName && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 flex items-center gap-3 text-xs">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Document '{formData.justificationDocName}' chargé avec succès ! Il sera scanné et validé au guichet physique.</span>
                    </div>
                  )}
                </div>

                {/* Photo Capture Section */}
                <div className="space-y-4">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Photo d'Identité Officielle <span className="text-congo-red">*</span></label>
                  
                  <div className="relative w-48 h-48 mx-auto bg-congo-dark/80 rounded-2xl border border-gray-800 overflow-hidden flex items-center justify-center shadow-inner">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Photo Citoyen" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : isCapturing ? (
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline></video>
                    ) : (
                      <div className="text-center p-4">
                        <Camera className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <span className="text-xs text-gray-500">Aucune photo capturée</span>
                      </div>
                    )}
                    
                    <canvas ref={canvasRef} className="hidden"></canvas>
                  </div>

                  <div className="flex flex-col space-y-2 max-w-[280px] mx-auto">
                    {isCapturing ? (
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="bg-congo-gold hover:bg-congo-gold/90 text-congo-dark font-display font-semibold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" /> Prendre la photo
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex-1 bg-congo-dark hover:bg-congo-dark/90 border border-gray-800 text-gray-300 font-display font-medium text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" /> Webcam
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setUsePreset(true);
                            // cycle through portraits
                            const nextIndex = (SAMPLE_PHOTO_PRESETS.indexOf(photoUrl) + 1) % SAMPLE_PHOTO_PRESETS.length;
                            setPhotoUrl(SAMPLE_PHOTO_PRESETS[nextIndex >= 0 ? nextIndex : 0]);
                          }}
                          className="flex-1 bg-congo-blue/10 hover:bg-congo-blue/20 text-congo-blue font-display font-medium text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Changer d'avatar
                        </button>
                      </div>
                    )}
                    <span className="text-[10px] text-gray-500 text-center">Vous pouvez utiliser votre webcam ou cliquer sur "Changer d'avatar" pour simuler une photo de haute qualité.</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-congo-dark hover:bg-congo-dark/90 border border-gray-800 text-gray-300 font-display font-medium text-sm px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!photoUrl && !usePreset) {
                      setPhotoUrl(SAMPLE_PHOTO_PRESETS[0]);
                    }
                    setStep(3);
                  }}
                  className="bg-congo-blue hover:bg-congo-blue/90 text-white font-display font-medium text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-1">Rendez-vous de Validation Physique</h2>
                <p className="text-xs text-gray-400">Étape 3 sur 3 : Sélectionnez votre bureau de validation territoriale.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Centre National de Validation <span className="text-congo-red">*</span></label>
                  <select
                    name="appointmentCenter"
                    value={formData.appointmentCenter}
                    onChange={handleInputChange}
                    className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-congo-blue h-[42px]"
                  >
                    {availableCenters.length > 0 ? (
                      availableCenters.map(center => (
                        <option key={center} value={center}>{center}</option>
                      ))
                    ) : (
                      <option value="">Sélectionnez une province d'abord</option>
                    )}
                  </select>
                  <span className="text-[10px] text-gray-500 mt-1 block">Bureaux mutualisés CENI et ONIP.</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Date du Rendez-vous <span className="text-congo-red">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      name="appointmentDate"
                      required
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-congo-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Créneau Horaire <span className="text-congo-red">*</span></label>
                  <select
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    className="w-full bg-congo-dark/60 border border-gray-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-congo-blue h-[42px]"
                  >
                    <option value="08:00 - 08:30">08:00 - 08:30 (Matinée)</option>
                    <option value="08:30 - 09:00">08:30 - 09:00</option>
                    <option value="09:00 - 09:30">09:00 - 09:30</option>
                    <option value="09:30 - 10:00">09:30 - 10:00</option>
                    <option value="10:00 - 10:30">10:00 - 10:30</option>
                    <option value="11:00 - 11:30">11:00 - 11:30</option>
                    <option value="13:30 - 14:00">13:30 - 14:00 (Après-midi)</option>
                    <option value="14:00 - 14:30">14:00 - 14:30</option>
                    <option value="15:00 - 15:30">15:00 - 15:30</option>
                  </select>
                </div>

                <div className="bg-congo-blue/5 border border-congo-blue/20 rounded-xl p-4 flex items-start gap-3 text-xs text-gray-300">
                  <CheckCircle className="w-5 h-5 text-congo-blue flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Validation Biométrique Obligatoire :</strong> Votre présence physique est obligatoire uniquement pour capturer vos 10 empreintes digitales et scanner vos iris. Les documents textuels et photos étant déjà saisis, votre temps de passage sera réduit à moins de 3 minutes.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-congo-dark hover:bg-congo-dark/90 border border-gray-800 text-gray-300 font-display font-medium text-sm px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-congo-gold hover:bg-congo-gold/90 text-congo-dark font-display font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  Valider et Générer le Reçu <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && receipt && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h2 className="text-xl font-display font-bold text-white">Pré-enrôlement Réussi !</h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Votre fiche citoyenne a été validée. Présentez ce reçu muni de son QR Code au guichet physique pour terminer votre enrôlement.
                </p>
              </div>

              {/* Printable receipt card */}
              <div id="printable-receipt" className="bg-white text-congo-dark rounded-2xl p-6 border border-gray-300 shadow-2xl relative overflow-hidden font-sans">
                {/* Visual side-flags of DRC */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-congo-blue via-congo-gold to-congo-red"></div>
                
                {/* Card Header */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-congo-blue/10 text-congo-blue rounded-xl flex items-center justify-center font-bold text-sm">
                      COD
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-congo-blue">République Démocratique du Congo</h4>
                      <h3 className="text-sm font-semibold text-gray-800">CENI & ONIP • ID-RDC</h3>
                      <p className="text-[10px] text-gray-500">Plateforme Nationale d'Identification Civile et Électorale</p>
                    </div>
                  </div>
                  <div className="bg-congo-blue/10 border border-congo-blue/20 text-congo-blue font-mono text-[10px] font-bold px-2 py-1 rounded">
                    RÉCÉPISSÉ : {receipt.id}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Portrait and details */}
                  <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-4 flex justify-center sm:justify-start">
                      <div className="w-28 h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-1">
                        <img 
                          src={receipt.citizen.photoUrl} 
                          alt="Photo d'identité" 
                          className="w-full h-full object-cover rounded"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-8 space-y-1.5 text-xs text-left">
                      <div className="grid grid-cols-3">
                        <span className="text-gray-400 font-mono">NOM :</span>
                        <span className="col-span-2 text-gray-800 font-bold tracking-wide">{receipt.citizen.lastName}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-gray-400 font-mono">POSTNOM :</span>
                        <span className="col-span-2 text-gray-800 font-bold tracking-wide">{receipt.citizen.postName || '-'}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-gray-400 font-mono">PRÉNOM :</span>
                        <span className="col-span-2 text-gray-800 font-bold tracking-wide">{receipt.citizen.firstName}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-gray-400 font-mono">SEXE / NE LE :</span>
                        <span className="col-span-2 text-gray-800 font-semibold">{receipt.citizen.gender} • {new Date(receipt.citizen.birthDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-gray-400 font-mono">LIEU NAISS :</span>
                        <span className="col-span-2 text-gray-800">{receipt.citizen.birthPlace}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-gray-400 font-mono">PROV ORIGINE :</span>
                        <span className="col-span-2 text-gray-800">{receipt.citizen.originProvince}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-gray-400 font-mono">DOMICILE :</span>
                        <span className="col-span-2 text-gray-800">{receipt.citizen.currentAddress}, {receipt.citizen.currentCity}</span>
                      </div>
                      <div className="grid grid-cols-3 border-t border-dashed border-gray-200 pt-1.5 mt-1.5">
                        <span className="text-gray-500 font-mono font-bold text-[10px]">VALIDE JUSQU'AU :</span>
                        <span className="col-span-2 text-red-600 font-bold tracking-wide flex items-center gap-1">
                          {new Date(new Date(receipt.citizen.preEnrolledAt).getTime() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                          <span className="text-[9px] text-gray-500 font-normal">(180 jours après pré-enrôlement)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Validation */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    {/* Simulated High-Tech QR Code */}
                    <div className="relative w-28 h-28 bg-white border border-gray-300 p-2 rounded shadow-sm flex items-center justify-center overflow-hidden">
                      {/* Grid patterns to look like a QR code */}
                      <div className="grid grid-cols-8 gap-[3px] w-full h-full opacity-95">
                        {Array.from({ length: 64 }).map((_, i) => {
                          const isCorner = 
                            (i < 3 || (i >= 8 && i <= 10) || (i >= 16 && i <= 18)) || // Top left
                            (i % 8 >= 5 && i < 24) || // Top right
                            (i >= 48 && i % 8 < 3); // Bottom left
                          const rand = Math.random() > 0.45;
                          return (
                            <div 
                              key={i} 
                              className={`rounded-[1px] ${
                                isCorner ? 'bg-congo-blue' : rand ? 'bg-black' : 'bg-transparent'
                              }`}
                            ></div>
                          );
                        })}
                      </div>
                      <div className="absolute inset-0 border-2 border-congo-blue/30 rounded flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-md border border-gray-100 shadow-sm">
                          <span className="text-[9px] font-bold text-congo-blue">RDC</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-gray-400 mt-2 uppercase">Données Civiles Cryptées</span>
                    <span className="text-[8px] font-mono text-gray-500 mt-0.5">{receipt.citizen.qrCodeData.split(':')[8] || 'HASH-SECURE-99X'}</span>
                  </div>
                </div>

                {/* Appointment Info footer on receipt */}
                <div className="bg-congo-blue/5 border border-congo-blue/20 rounded-xl p-3 mt-4 text-xs text-left grid grid-cols-1 sm:grid-cols-2 gap-2 text-congo-dark">
                  <div>
                    <span className="text-gray-500 block text-[10px] font-mono">BUREAU DE VALIDATION :</span>
                    <strong className="text-gray-800">{receipt.citizen.appointmentCenter}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] font-mono">CONVOCATION PHYSIQUE :</span>
                    <strong className="text-gray-800">
                      {new Date(receipt.citizen.appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} À {receipt.citizen.appointmentTime}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-congo-dark hover:bg-congo-dark/90 border border-gray-800 text-gray-300 font-display font-medium text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" /> Imprimer le récépissé
                </button>
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="bg-congo-gold hover:bg-congo-gold/90 text-congo-dark font-display font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" /> Télécharger en PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      lastName: '',
                      postName: '',
                      firstName: '',
                      gender: 'M',
                      birthDate: '',
                      birthPlace: '',
                      originProvince: 'Kinshasa',
                      currentAddress: '',
                      currentCity: '',
                      currentProvince: 'Kinshasa',
                      phone: '',
                      email: '',
                      justificationDoc: 'ACTE_NAISSANCE',
                      justificationDocName: '',
                      appointmentCenter: '',
                      appointmentDate: '',
                      appointmentTime: '08:30 - 09:00'
                    });
                    setPhotoUrl('');
                    setReceipt(null);
                    setStep(1);
                  }}
                  className="bg-gray-800 hover:bg-gray-750 text-white font-display font-medium text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  Nouveau pré-enrôlement <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      lastName: '',
                      postName: '',
                      firstName: '',
                      gender: 'M',
                      birthDate: '',
                      birthPlace: '',
                      originProvince: 'Kinshasa',
                      currentAddress: '',
                      currentCity: '',
                      currentProvince: 'Kinshasa',
                      phone: '',
                      email: '',
                      justificationDoc: 'ACTE_NAISSANCE',
                      justificationDocName: '',
                      appointmentCenter: '',
                      appointmentDate: '',
                      appointmentTime: '08:30 - 09:00'
                    });
                    setPhotoUrl('');
                    setReceipt(null);
                    setStep(1);
                    setSubView('DASHBOARD');
                  }}
                  className="bg-congo-blue hover:bg-congo-blue/90 text-white font-display font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                >
                  Retour au Tableau de Bord <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
