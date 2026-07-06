/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, Check, ShieldAlert, Fingerprint, Eye, Sparkles, 
  Search, ShieldCheck, QrCode, Smartphone, RefreshCw, AlertTriangle
} from 'lucide-react';
import { EnrollmentRecord, BiometricData } from '../types';

interface AgentTerminalProps {
  records: EnrollmentRecord[];
  onRecordValidated: (updatedRecord: EnrollmentRecord) => void;
}

export default function AgentTerminal({ records, onRecordValidated }: AgentTerminalProps) {
  const [selectedRecord, setSelectedRecord] = useState<EnrollmentRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Biometric states
  const [capturingType, setCapturingType] = useState<'NONE' | 'LEFT_FINGERS' | 'RIGHT_FINGERS' | 'IRIS'>('NONE');
  const [leftFingers, setLeftFingers] = useState<boolean[]>([false, false, false, false]);
  const [rightFingers, setRightFingers] = useState<boolean[]>([false, false, false, false]);
  const [irisScanned, setIrisScanned] = useState(false);
  const [facialScore, setFacialScore] = useState(0);

  // Validation results states
  const [validationState, setValidationState] = useState<'IDLE' | 'PROCESSING' | 'DUPLICATE_ALERT' | 'SUCCESS'>('IDLE');
  const [generatedNIN, setGeneratedNIN] = useState('');
  const [generatedVoterCard, setGeneratedVoterCard] = useState('');

  // Filter records that need validation
  const filteredRecords = records.filter(rec => {
    const fullName = `${rec.citizen.firstName} ${rec.citizen.lastName} ${rec.citizen.postName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) && rec.status !== 'REJECTED';
  });

  const selectCitizen = (record: EnrollmentRecord) => {
    // Reset bio states
    setLeftFingers([false, false, false, false]);
    setRightFingers([false, false, false, false]);
    setIrisScanned(false);
    setFacialScore(0);
    setValidationState('IDLE');
    setCapturingType('NONE');
    
    // Simulate loading/scanning QR Code
    setIsScanningQR(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsScanningQR(false);
          setSelectedRecord(record);
          // Set simulated face match score
          setFacialScore(Math.floor(92 + Math.random() * 7));
          return 100;
        }
        return p + 20;
      });
    }, 100);
  };

  const simulateBiometricCapture = (type: 'LEFT_FINGERS' | 'RIGHT_FINGERS' | 'IRIS') => {
    setCapturingType(type);
    let timer = 0;
    const interval = setInterval(() => {
      timer += 20;
      if (timer >= 100) {
        clearInterval(interval);
        setCapturingType('NONE');
        if (type === 'LEFT_FINGERS') {
          setLeftFingers([true, true, true, true]);
        } else if (type === 'RIGHT_FINGERS') {
          setRightFingers([true, true, true, true]);
        } else if (type === 'IRIS') {
          setIrisScanned(true);
        }
      }
    }, 400);
  };

  const executeDeduplication = () => {
    if (!selectedRecord) return;
    
    setValidationState('PROCESSING');
    
    setTimeout(() => {
      // Check if it is the pre-seeded FRAUD record
      if (selectedRecord.id === 'REC-2026-FRAUD') {
        setValidationState('DUPLICATE_ALERT');
      } else {
        // Generate actual valid identifiers
        const ninYear = selectedRecord.citizen.birthDate.split('-')[0] || '1995';
        const randomNIN = `NIN-${ninYear}-COD-${Math.floor(10000000 + Math.random() * 90000000)}`;
        const randomVoterCard = `CENI-VOTE-${Math.floor(1000000 + Math.random() * 9000000)}`;
        
        setGeneratedNIN(randomNIN);
        setGeneratedVoterCard(randomVoterCard);
        setValidationState('SUCCESS');
        
        // Update record in parent
        const updatedBio: BiometricData = {
          leftFingerprints: leftFingers,
          rightFingerprints: rightFingers,
          irisScanned: true,
          facialMatchScore: facialScore,
          biometricsValidatedAt: new Date().toISOString()
        };

        const updatedRecord: EnrollmentRecord = {
          ...selectedRecord,
          status: 'COMPLETED',
          nin: randomNIN,
          voterCardNumber: randomVoterCard,
          biometrics: updatedBio,
          enrolledAt: new Date().toISOString()
        };

        onRecordValidated(updatedRecord);
      }
    }, 2500);
  };

  const handleBlockDuplicate = () => {
    if (!selectedRecord) return;
    const rejectedRecord: EnrollmentRecord = {
      ...selectedRecord,
      status: 'REJECTED',
      notes: "REJETÉ : Fraude par doublon biométrique détectée par le Hub ABIS central. Les empreintes correspondent au dossier NIN-1985-COD-89472019."
    };
    onRecordValidated(rejectedRecord);
    setSelectedRecord(null);
    setValidationState('IDLE');
  };

  const isBiometricsComplete = leftFingers.every(f => f) && rightFingers.every(f => f) && irisScanned;

  return (
    <div id="agent_terminal_view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      
      {/* Left Column: Citizen List & QR Scanner */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        <div className="bg-congo-card border border-gray-800 rounded-2xl p-4">
          <h3 className="font-display font-bold text-sm text-gray-300 mb-3 flex items-center gap-2">
            <Scan className="w-4 h-4 text-congo-blue" />
            <span>Fiches en attente de validation</span>
          </h3>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-congo-dark border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-congo-blue"
            />
          </div>

          {/* Citizen List */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto no-scrollbar">
            {filteredRecords.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">Aucun dossier en attente trouvé</p>
            ) : (
              filteredRecords.map(rec => {
                const isSelected = selectedRecord?.id === rec.id;
                const isPreSeededFraud = rec.id === 'REC-2026-FRAUD';
                return (
                  <button
                    key={rec.id}
                    onClick={() => selectCitizen(rec)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-congo-blue/10 border-congo-blue text-white' 
                        : isPreSeededFraud
                        ? 'bg-congo-red/5 border-congo-red/20 text-gray-300 hover:bg-congo-red/10'
                        : 'bg-congo-dark/40 border-gray-800 text-gray-300 hover:bg-congo-dark/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg border border-gray-800 overflow-hidden bg-gray-900 flex-shrink-0">
                        <img src={rec.citizen.photoUrl} alt="Portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold truncate uppercase">
                          {rec.citizen.lastName} <span className="font-normal text-gray-400 capitalize">{rec.citizen.firstName.toLowerCase()}</span>
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono truncate">{rec.citizen.currentCity}</p>
                      </div>
                    </div>
                    <div>
                      {rec.status === 'COMPLETED' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20">
                          COMPLÉTÉ
                        </span>
                      ) : isPreSeededFraud ? (
                        <span className="bg-congo-red/10 text-congo-red font-mono text-[9px] px-1.5 py-0.5 rounded border border-congo-red/20 animate-pulse">
                          TEST DOUBLON
                        </span>
                      ) : (
                        <span className="bg-congo-gold/10 text-congo-gold font-mono text-[9px] px-1.5 py-0.5 rounded border border-congo-gold/20">
                          ATTENTE
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic scanning display */}
        <AnimatePresence>
          {isScanningQR && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-congo-blue/5 border border-congo-blue/30 rounded-2xl p-4 text-center space-y-3"
            >
              <div className="flex justify-center">
                <QrCode className="w-10 h-10 text-congo-blue animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold">Lecture du QR Code citoyen...</p>
                <div className="w-full bg-congo-dark rounded-full h-1 max-w-[140px] mx-auto overflow-hidden">
                  <div className="bg-congo-blue h-1 rounded-full transition-all duration-100" style={{ width: `${scanProgress}%` }}></div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">Pre-remplissage des données d'état civil instantané (Gain de temps : ~12 minutes)</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: Workstation Controls */}
      <div className="lg:col-span-8 flex flex-col justify-between">
        {!selectedRecord ? (
          <div className="h-full min-h-[400px] border border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-congo-card/40">
            <Scan className="w-16 h-16 text-gray-700 mb-4 animate-pulse-slow" />
            <h3 className="text-base font-display font-semibold text-gray-400 mb-2">Aucun Citoyen Sélectionné</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Sélectionnez une fiche de pré-enrôlement ou scannez un QR Code dans la colonne de gauche pour débuter la capture biométrique au guichet physique.
            </p>
          </div>
        ) : (
          <div className="bg-congo-card border border-gray-800 rounded-2xl p-6 space-y-6 relative overflow-hidden">
            
            {/* Header: Citizen details pre-filled */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-800 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-16 rounded-xl border border-gray-800 overflow-hidden bg-gray-900 relative">
                  <img src={selectedRecord.citizen.photoUrl} alt="Visage" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-0 right-0 bg-congo-blue text-white text-[8px] px-1 font-bold">RDC</div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono bg-congo-blue/10 text-congo-blue border border-congo-blue/20 px-1.5 py-0.5 rounded font-bold">PRE-ENROLÉ</span>
                    <span className="text-[9px] font-mono text-gray-500">ID: {selectedRecord.citizen.id}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold uppercase tracking-wider mt-0.5">
                    {selectedRecord.citizen.lastName} <span className="font-light text-gray-300 capitalize">{selectedRecord.citizen.firstName.toLowerCase()} {selectedRecord.citizen.postName?.toLowerCase()}</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Né(e) le {new Date(selectedRecord.citizen.birthDate).toLocaleDateString('fr-FR')} à {selectedRecord.citizen.birthPlace} • {selectedRecord.citizen.gender}
                  </p>
                </div>
              </div>

              {/* Verified Documents label */}
              <div className="text-left sm:text-right">
                <span className="text-[9px] font-mono text-gray-400 block uppercase">Document Civil Justifié :</span>
                <span className="text-xs text-congo-gold font-medium block">
                  🛡️ {selectedRecord.citizen.justificationDoc.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-gray-500 block truncate max-w-[180px]">{selectedRecord.citizen.justificationDocName}</span>
              </div>
            </div>

            {/* Interactive biometrics capture zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Box: Fingerprints */}
              <div className="bg-congo-dark/50 border border-gray-800/80 rounded-2xl p-4 space-y-4">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800/50 pb-2">
                  <Fingerprint className="w-4 h-4 text-congo-blue" />
                  <span>Empreintes Digitales (10 Doigts)</span>
                </h4>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Left hand scan */}
                  <div className="bg-congo-card/50 border border-gray-800 rounded-xl p-3 text-center space-y-3">
                    <span className="text-[10px] font-semibold text-gray-400 block">Main Gauche</span>
                    <div className="flex justify-center gap-1.5 relative h-10 items-end">
                      {leftFingers.map((val, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-8 rounded-full border transition-all ${
                            val 
                              ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                              : 'bg-gray-800 border-gray-700'
                          }`}
                        ></div>
                      ))}
                      {capturingType === 'LEFT_FINGERS' && (
                        <div className="absolute inset-0 bg-congo-blue/10 animate-scan border-y border-congo-blue flex items-center justify-center text-[9px] font-mono font-bold text-congo-blue">SCANNING...</div>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={capturingType !== 'NONE' || leftFingers.every(f => f)}
                      onClick={() => simulateBiometricCapture('LEFT_FINGERS')}
                      className={`w-full py-1.5 rounded-lg text-[10px] font-display font-semibold transition-all cursor-pointer ${
                        leftFingers.every(f => f)
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-congo-blue hover:bg-congo-blue/90 text-white'
                      }`}
                    >
                      {leftFingers.every(f => f) ? '✓ Capturée' : 'Scanner Main G'}
                    </button>
                  </div>

                  {/* Right hand scan */}
                  <div className="bg-congo-card/50 border border-gray-800 rounded-xl p-3 text-center space-y-3">
                    <span className="text-[10px] font-semibold text-gray-400 block">Main Droite</span>
                    <div className="flex justify-center gap-1.5 relative h-10 items-end">
                      {rightFingers.map((val, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-8 rounded-full border transition-all ${
                            val 
                              ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                              : 'bg-gray-800 border-gray-700'
                          }`}
                        ></div>
                      ))}
                      {capturingType === 'RIGHT_FINGERS' && (
                        <div className="absolute inset-0 bg-congo-blue/10 animate-scan border-y border-congo-blue flex items-center justify-center text-[9px] font-mono font-bold text-congo-blue">SCANNING...</div>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={capturingType !== 'NONE' || rightFingers.every(f => f)}
                      onClick={() => simulateBiometricCapture('RIGHT_FINGERS')}
                      className={`w-full py-1.5 rounded-lg text-[10px] font-display font-semibold transition-all cursor-pointer ${
                        rightFingers.every(f => f)
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-congo-blue hover:bg-congo-blue/90 text-white'
                      }`}
                    >
                      {rightFingers.every(f => f) ? '✓ Capturée' : 'Scanner Main D'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Box: Iris and Facial Matching */}
              <div className="bg-congo-dark/50 border border-gray-800/80 rounded-2xl p-4 space-y-4">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800/50 pb-2">
                  <Eye className="w-4 h-4 text-congo-blue" />
                  <span>Scanner d'Iris & Vérification</span>
                </h4>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Iris Scanner */}
                  <div className="bg-congo-card/50 border border-gray-800 rounded-xl p-3 text-center space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-gray-400 block">Biométrie Oculaire</span>
                    
                    <div className="relative w-14 h-14 mx-auto bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                      <Eye className={`w-8 h-8 ${irisScanned ? 'text-emerald-400 shadow-lg' : 'text-gray-600'}`} />
                      {capturingType === 'IRIS' && (
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-congo-blue animate-pulse-slow animate-scan"></div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={capturingType !== 'NONE' || irisScanned}
                      onClick={() => simulateBiometricCapture('IRIS')}
                      className={`w-full py-1.5 rounded-lg text-[10px] font-display font-semibold transition-all cursor-pointer ${
                        irisScanned
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-congo-blue hover:bg-congo-blue/90 text-white'
                      }`}
                    >
                      {irisScanned ? '✓ Scanner OK' : 'Lancer Iris Scan'}
                    </button>
                  </div>

                  {/* Face portrait match */}
                  <div className="bg-congo-card/50 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-gray-400 block">Vérification Faciale</span>
                    
                    <div className="space-y-1.5">
                      <div className="text-2xl font-mono font-bold text-congo-gold">
                        {facialScore}%
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded uppercase block">Match Garanti</span>
                    </div>

                    <div className="text-[9px] text-gray-500 leading-normal">
                      Comparaison en direct avec la photo du récépissé.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ABIS system validation area */}
            <div className="border-t border-gray-800 pt-6">
              <AnimatePresence mode="wait">
                {validationState === 'IDLE' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <p className="text-xs text-gray-400 text-center max-w-lg">
                      Une fois la capture biométrique complétée sur place, cliquez sur "Valider & Dédupliquer". Le système transmettra les empreintes de manière hautement chiffrée au Hub Centralisé (ABIS partagé CENI/ONIP) pour exclure toute inscription multiple.
                    </p>
                    <button
                      type="button"
                      disabled={!isBiometricsComplete}
                      onClick={executeDeduplication}
                      className={`w-full max-w-sm py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        isBiometricsComplete
                          ? 'bg-congo-gold text-congo-dark hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-congo-gold/10'
                          : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" /> Valider & Dédupliquer (ABIS)
                    </button>
                    {!isBiometricsComplete && (
                      <span className="text-[10px] text-gray-500 font-mono">Capturez d'abord les empreintes digitales gauche/droite et l'iris.</span>
                    )}
                  </motion.div>
                )}

                {validationState === 'PROCESSING' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6 space-y-4 text-center"
                  >
                    <RefreshCw className="w-10 h-10 text-congo-gold animate-spin" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Lancement de la Déduplication ABIS...</h4>
                      <p className="text-xs text-gray-400 max-w-md mt-1">
                        Recherche d'empreintes ou de structures d'iris identiques sur l'ensemble de la base nationale unifiée (CENI + ONIP) en temps réel.
                      </p>
                    </div>
                  </motion.div>
                )}

                {validationState === 'DUPLICATE_ALERT' && (
                  <motion.div
                    key="fraud"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-congo-red/10 border border-congo-red/30 rounded-2xl p-5 space-y-4 text-center"
                  >
                    <div className="flex justify-center">
                      <AlertTriangle className="w-12 h-12 text-congo-red animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-display font-bold text-congo-red">⚠️ ALERTE : TENTATIVE DE FRAUDE / ENRÔLEMENT MULTIPLE</h4>
                      <p className="text-xs text-gray-300 max-w-xl mx-auto leading-relaxed">
                        Le Hub ABIS Centralisé vient de bloquer l'inscription. Les empreintes digitales capturées à l'instant correspondent à <strong>100%</strong> au citoyen <strong>Abraham BARAKA MAHESHE</strong> (NIN-1985-COD-89472019) enregistré le 28/06/2026 à Lubumbashi.
                      </p>
                    </div>
                    <div className="bg-congo-dark/50 p-3 rounded-xl border border-gray-800 text-[11px] text-left max-w-lg mx-auto font-mono text-gray-400">
                      <strong>Dossier Conflit :</strong> REC-2026-002 (CENI-VOTE-9082348)<br />
                      <strong>Sanction :</strong> Cette fiche d'auto-enrôlement ({selectedRecord.citizen.lastName} {selectedRecord.citizen.firstName}) est immédiatement invalidée pour doublon électoral et usurpation.
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleBlockDuplicate}
                        className="bg-congo-red hover:bg-congo-red/90 text-white font-display font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
                      >
                        Invalider l'enrôlement & Bloquer
                      </button>
                    </div>
                  </motion.div>
                )}

                {validationState === 'SUCCESS' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-4 text-center"
                  >
                    <div className="flex justify-center">
                      <ShieldCheck className="w-12 h-12 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-display font-bold text-emerald-400">FÉLICITATIONS : IDENTITÉ UNIQUE CERTIFIÉE</h4>
                      <p className="text-xs text-gray-300">
                        Aucun doublon biométrique détecté. Le citoyen a été enregistré avec succès dans le fichier électoral de la CENI et l'index de population de l'ONIP.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2 text-left font-mono text-xs">
                      <div className="bg-congo-dark/60 p-2.5 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-gray-500 block uppercase font-sans">N° NIN (Identifiant Unique ONIP) :</span>
                        <strong className="text-white tracking-wider">{generatedNIN}</strong>
                      </div>
                      <div className="bg-congo-dark/60 p-2.5 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-gray-500 block uppercase font-sans">N° Électeur (Carte CENI) :</span>
                        <strong className="text-congo-gold tracking-wider">{generatedVoterCard}</strong>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(null);
                          setValidationState('IDLE');
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-display font-semibold text-xs py-2 px-5 rounded-xl cursor-pointer"
                      >
                        Passer au citoyen suivant
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
