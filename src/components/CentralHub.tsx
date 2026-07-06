/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, CreditCard, Sun, DollarSign, ListFilter, Cpu, 
  Satellite, Battery, RefreshCw, Layers, CheckCircle2, AlertCircle, Smartphone, Award
} from 'lucide-react';
import { EnrollmentRecord, KitStatus, SystemLogs } from '../types';
import { MOCK_KITS, INITIAL_LOGS } from '../data/mockData';

interface CentralHubProps {
  records: EnrollmentRecord[];
}

export default function CentralHub({ records }: CentralHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<'CARDS' | 'SOLAR' | 'BUDGET' | 'ABIS'>('CARDS');
  const [kits, setKits] = useState<KitStatus[]>(MOCK_KITS);
  const [logs, setLogs] = useState<SystemLogs[]>(INITIAL_LOGS);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Filter completed records for showing cards
  const completedRecords = records.filter(rec => rec.status === 'COMPLETED');

  useEffect(() => {
    if (completedRecords.length > 0 && !selectedRecordId) {
      setSelectedRecordId(completedRecords[0].id);
    }
  }, [completedRecords, selectedRecordId]);

  const selectedRecord = completedRecords.find(r => r.id === selectedRecordId) || completedRecords[0];

  // Simulating live telemetry updates for solar power
  useEffect(() => {
    const interval = setInterval(() => {
      setKits(prevKits => 
        prevKits.map(kit => {
          if (kit.status === 'MAINTENANCE') return kit;
          
          // Randomly fluctuate solar power and battery
          const deltaPower = kit.solarCharging ? Math.floor(Math.random() * 9 - 4) : 0;
          const deltaBattery = kit.solarCharging 
            ? (kit.batteryLevel < 100 ? (Math.random() > 0.5 ? 1 : 0) : 0)
            : (Math.random() > 0.6 ? -1 : 0);

          const newPower = kit.solarCharging ? Math.max(10, Math.min(80, kit.solarPowerWatts + deltaPower)) : 0;
          const newBattery = Math.max(10, Math.min(100, kit.batteryLevel + deltaBattery));

          return {
            ...kit,
            solarPowerWatts: newPower,
            batteryLevel: newBattery
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const triggerManualSync = (kitId: string) => {
    setKits(prevKits => 
      prevKits.map(kit => {
        if (kit.id === kitId) {
          return {
            ...kit,
            status: 'SYNCING'
          };
        }
        return kit;
      })
    );

    // Simulate logs update
    const matchedKit = kits.find(k => k.id === kitId);
    if (matchedKit) {
      const newLog: SystemLogs = {
        id: 'LOG-NEW-' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        type: 'INFO',
        source: 'KIT',
        message: `Lancement manuel de la synchronisation satellite pour ${matchedKit.location}. Transmissions de ${matchedKit.pendingSyncCount} dossiers.`
      };
      setLogs(prev => [newLog, ...prev]);
    }

    setTimeout(() => {
      setKits(prevKits => 
        prevKits.map(kit => {
          if (kit.id === kitId) {
            return {
              ...kit,
              status: 'ONLINE',
              pendingSyncCount: 0,
              lastSyncTime: new Date().toISOString()
            };
          }
          return kit;
        })
      );

      const successLog: SystemLogs = {
        id: 'LOG-NEW-SUCCESS-' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        type: 'SUCCESS',
        source: 'ABIS',
        message: `Synchronisation complétée pour ${matchedKit?.location}. Base ABIS centrale nettoyée et synchronisée (+${matchedKit?.pendingSyncCount} identités uniques).`
      };
      setLogs(prev => [successLog, ...prev]);
    }, 3000);
  };

  return (
    <div id="central_hub_view" className="space-y-6 text-white">
      {/* Header telemetry ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-congo-card/40 border border-gray-800 p-4 rounded-2xl text-xs">
        <div className="space-y-1">
          <span className="text-gray-500 block uppercase font-mono">Index Biométrique Unique (ABIS)</span>
          <strong className="text-lg text-white font-display font-bold">
            {records.filter(r => r.status === 'COMPLETED').length + 120485} <span className="text-congo-blue text-xs font-normal">Identités Validées</span>
          </strong>
        </div>
        <div className="space-y-1 border-l border-gray-800 pl-4">
          <span className="text-gray-500 block uppercase font-mono">Taux de Mutualisation</span>
          <strong className="text-lg text-congo-gold font-display font-bold">
            100% <span className="text-gray-400 text-xs font-normal">Infrastructures Partagées</span>
          </strong>
        </div>
        <div className="space-y-1 border-l border-gray-800 pl-4">
          <span className="text-gray-500 block uppercase font-mono">Économie d'Échelle</span>
          <strong className="text-lg text-emerald-400 font-display font-bold">
            $550,000,000 USD <span className="text-gray-400 text-xs font-normal">Économisés</span>
          </strong>
        </div>
        <div className="space-y-1 border-l border-gray-800 pl-4">
          <span className="text-gray-500 block uppercase font-mono">Kits Ruraux Actifs</span>
          <strong className="text-lg text-congo-blue font-display font-bold">
            {kits.filter(k => k.status !== 'MAINTENANCE').length} / {kits.length} <span className="text-gray-400 text-xs font-normal">En Service</span>
          </strong>
        </div>
      </div>

      {/* Navigation menu for sub-tabs */}
      <div className="flex border-b border-gray-800 gap-4 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('CARDS')}
          className={`pb-3 px-1 text-sm font-display font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'CARDS' 
              ? 'border-congo-blue text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Porte-Documents (Wallet)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('SOLAR')}
          className={`pb-3 px-1 text-sm font-display font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'SOLAR' 
              ? 'border-congo-blue text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <Sun className="w-4 h-4" /> Kits Solaires Hors-Ligne
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('BUDGET')}
          className={`pb-3 px-1 text-sm font-display font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'BUDGET' 
              ? 'border-congo-blue text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Fusion Budgétaire (Économies)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('ABIS')}
          className={`pb-3 px-1 text-sm font-display font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'ABIS' 
              ? 'border-congo-blue text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <Shield className="w-4 h-4" /> Supervision ABIS & Logs
        </button>
      </div>

      {/* Sub-Tab content panels */}
      <AnimatePresence mode="wait">
        
        {/* CARDS WALLET PANEL */}
        {activeSubTab === 'CARDS' && (
          <motion.div
            key="cards-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Citizen Selection */}
            <div className="lg:col-span-4 bg-congo-card/60 border border-gray-800 rounded-2xl p-4 space-y-4">
              <div>
                <h3 className="font-display font-bold text-sm text-gray-300">Portefeuille Évolutif</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Choisissez un citoyen enrôlé pour inspecter ses documents officiels générés sur les mêmes données.</p>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {completedRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    Aucun citoyen n'a encore validé sa biométrie. Utilisez l'onglet "Agent de Guichet" pour enrôler un citoyen d'abord !
                  </div>
                ) : (
                  completedRecords.map(rec => (
                    <button
                      key={rec.id}
                      onClick={() => setSelectedRecordId(rec.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center space-x-3 cursor-pointer ${
                        selectedRecordId === rec.id
                          ? 'bg-congo-blue/10 border-congo-blue text-white'
                          : 'bg-congo-dark border-gray-800 text-gray-300 hover:bg-congo-dark/70'
                      }`}
                    >
                      <img src={rec.citizen.photoUrl} alt="Portrait" className="w-8 h-8 rounded-full object-cover border border-gray-700" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold uppercase truncate">{rec.citizen.lastName} {rec.citizen.firstName}</h4>
                        <p className="text-[9px] font-mono text-gray-500 truncate">{rec.nin || 'NIN-GEN'}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Render Cards */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-8">
              {!selectedRecord ? (
                <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-2xl w-full">
                  <p className="text-xs">Aucun dossier disponible pour la production des cartes.</p>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Carte Nationale d'Identité (Polycarbonate - ONIP) */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-400">1. Carte d'Identité (Polycarbonate - ONIP)</span>
                      <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded">Valide 10 Ans</span>
                    </div>

                    {/* Polycarbonate design mockup */}
                    <div className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-[#1c2e4a] via-[#101b2f] to-[#121c2c] rounded-2xl p-4 text-white border border-gray-700 shadow-2xl overflow-hidden font-sans select-none">
                      {/* Interactive background vector */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,127,255,0.15),transparent)] pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-congo-gold/10 to-congo-red/5 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-congo-blue via-congo-gold to-congo-red"></div>

                      {/* Card Header */}
                      <div className="flex justify-between items-start pb-2 border-b border-white/10 mb-2">
                        <div className="flex gap-2">
                          <span className="text-sm">🐆</span>
                          <div>
                            <h4 className="text-[8px] font-bold tracking-wider text-congo-blue uppercase">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h4>
                            <h3 className="text-[7px] text-gray-300 uppercase">Office National d'Identification de la Population (ONIP)</h3>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold font-mono text-congo-gold">CNI</span>
                      </div>

                      {/* Card Body */}
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-4 relative">
                          <div className="w-full aspect-[4/5] rounded-lg border border-white/10 overflow-hidden bg-black/40 p-0.5 shadow-md">
                            <img src={selectedRecord.citizen.photoUrl} alt="Portrait CNI" className="w-full h-full object-cover rounded opacity-90 contrast-[1.05]" referrerPolicy="no-referrer" />
                          </div>
                          {/* Laser portrait watermark / hologram */}
                          <div className="absolute bottom-1 right-1 w-6 h-7 rounded bg-white/5 backdrop-blur-[0.5px] overflow-hidden border border-white/5 opacity-80">
                            <img src={selectedRecord.citizen.photoUrl} alt="Portrait water" className="w-full h-full object-cover grayscale brightness-125" referrerPolicy="no-referrer" />
                          </div>
                        </div>

                        <div className="col-span-8 text-[8px] text-left space-y-0.5">
                          <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-semibold font-mono">NOM :</span>
                            <span className="col-span-2 text-white font-bold">{selectedRecord.citizen.lastName}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-semibold font-mono">PRÉNOM :</span>
                            <span className="col-span-2 text-white font-bold">{selectedRecord.citizen.firstName}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-semibold font-mono">NE LE :</span>
                            <span className="col-span-2 text-white font-medium">{new Date(selectedRecord.citizen.birthDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-semibold font-mono">LIEU DE NAISS :</span>
                            <span className="col-span-2 text-white">{selectedRecord.citizen.birthPlace}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-semibold font-mono">GENRE :</span>
                            <span className="col-span-2 text-white">{selectedRecord.citizen.gender}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-gray-500 font-semibold font-mono">NIN :</span>
                            <span className="col-span-2 text-congo-gold font-bold font-mono tracking-wider">{selectedRecord.nin}</span>
                          </div>
                          
                          {/* Electronic Chip Icon and Barcode */}
                          <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-1.5 bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
                              <Cpu className="w-3.5 h-3.5 text-congo-gold" />
                              <span className="text-[6px] font-mono text-gray-400 uppercase">PUCE SECURE</span>
                            </div>
                            {/* Decorative micro barcode */}
                            <div className="flex flex-col items-end">
                              <div className="w-16 h-3 bg-gray-400/20 rounded flex overflow-hidden opacity-80">
                                {Array.from({ length: 24 }).map((_, i) => (
                                  <div key={i} className={`h-full ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`} style={{ width: `${Math.floor(Math.random() * 2) + 1}px` }}></div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Carte d'Électeur Digitale / QR Code (CENI) */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-400">2. Carte Électorale Digitale (CENI)</span>
                      <span className="bg-congo-blue/10 text-congo-blue font-mono text-[9px] px-2 py-0.5 rounded">Scrutin Actif</span>
                    </div>

                    {/* Paper/Digital Voter card design mockup */}
                    <div className="relative w-full aspect-[1.586/1] bg-white rounded-2xl p-4 text-congo-dark border border-gray-300 shadow-2xl overflow-hidden font-sans select-none text-left">
                      {/* Decorative elements */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-congo-blue"></div>
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_bottom_right,rgba(0,127,255,0.06),transparent)] pointer-events-none"></div>

                      {/* Card Header */}
                      <div className="flex justify-between items-start pb-2 border-b border-gray-200 mb-2 pl-2">
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-congo-blue/10 text-congo-blue rounded font-bold text-xs flex items-center justify-center">C</div>
                          <div>
                            <h4 className="text-[7px] font-bold tracking-wider text-gray-500 uppercase">COMMISSION ÉLECTORALE NATIONALE INDÉPENDANTE</h4>
                            <h3 className="text-[9px] font-bold text-congo-blue">CARTE D'ÉLECTEUR DIGITALISÉE</h3>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold font-mono text-congo-blue bg-congo-blue/5 border border-congo-blue/15 px-1 rounded">RDC</span>
                      </div>

                      {/* Card Body */}
                      <div className="grid grid-cols-12 gap-3 pl-2">
                        <div className="col-span-3">
                          <div className="w-full aspect-[4/5] rounded border border-gray-200 overflow-hidden bg-gray-50 p-0.5">
                            <img src={selectedRecord.citizen.photoUrl} alt="Portrait Électeur" className="w-full h-full object-cover rounded grayscale contrast-125" referrerPolicy="no-referrer" />
                          </div>
                        </div>

                        <div className="col-span-6 text-[7px] space-y-0.5">
                          <div>
                            <span className="text-gray-400 block text-[6px] font-mono leading-none">ID ÉLECTEUR :</span>
                            <strong className="text-gray-800 font-bold tracking-wider font-mono text-[8px]">{selectedRecord.voterCardNumber}</strong>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[6px] font-mono leading-none">NOMS :</span>
                            <strong className="text-gray-800 uppercase font-semibold">{selectedRecord.citizen.lastName} {selectedRecord.citizen.firstName}</strong>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[6px] font-mono leading-none">CENTRE D'INSCRIPTION :</span>
                            <span className="text-gray-700 font-medium">{selectedRecord.citizen.appointmentCenter}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[6px] font-mono leading-none">NIN CIVIL ASSOCIÉ :</span>
                            <span className="text-gray-600 font-mono">{selectedRecord.nin}</span>
                          </div>
                        </div>

                        {/* Vote Secure QR Code validation */}
                        <div className="col-span-3 flex flex-col items-center justify-center bg-gray-50 rounded border border-gray-100 p-1">
                          <div className="grid grid-cols-6 gap-[2px] w-9 h-9 opacity-80">
                            {Array.from({ length: 36 }).map((_, i) => {
                              const isCorner = i === 0 || i === 4 || i === 5 || i === 30 || i === 35;
                              const rand = Math.random() > 0.45;
                              return <div key={i} className={`rounded-[0.5px] ${isCorner ? 'bg-congo-blue' : rand ? 'bg-gray-800' : 'bg-transparent'}`}></div>;
                            })}
                          </div>
                          <span className="text-[5px] font-mono text-gray-400 mt-1 uppercase text-center leading-none">VOTE VALID</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Informational callout */}
              <div className="bg-congo-blue/5 border border-congo-blue/20 rounded-xl p-4 text-xs text-gray-300 text-left max-w-2xl w-full flex gap-3 items-start">
                <Smartphone className="w-5 h-5 text-congo-blue flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Synergie Civile et Électorale (CENI / ONIP) :</strong> Les données capturées au cours du même parcours sont partagées instantanément. L'ONIP produit la <strong>Carte Nationale d'Identité rigide</strong> (en polycarbonate résistant avec puce), tandis que la CENI délivre instantanément la <strong>Carte d'Électeur numérique ou papier</strong> reliée au même identifiant à vie (le NIN), éliminant définitivement les cartes électorales "blanches" ou effacées.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* SOLAR KITS PANEL */}
        {activeSubTab === 'SOLAR' && (
          <motion.div
            key="solar-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display font-bold text-base text-gray-200">Réseau des Kits Biométriques Solaires Ruraux</h3>
              <p className="text-xs text-gray-400 mt-0.5">Le matériel d'enrôlement fonctionne de manière totalement autonome (Offline-first) dans les zones enclavées sans électricité grâce à des panneaux pliables.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kits.map(kit => {
                const isOnline = kit.status === 'ONLINE';
                const isSyncing = kit.status === 'SYNCING';
                const isOfflineActive = kit.status === 'OFFLINE_ACTIVE';
                
                return (
                  <div key={kit.id} className="bg-congo-card/90 border border-gray-800 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                    {/* Status badge */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase">{kit.id}</span>
                        <h4 className="text-sm font-semibold text-white">{kit.location}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Province : {kit.province}</p>
                      </div>
                      
                      {isOnline && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> EN LIGNE
                        </span>
                      )}
                      {isSyncing && (
                        <span className="bg-congo-gold/10 text-congo-gold border border-congo-gold/20 font-mono text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" /> SYNC...
                        </span>
                      )}
                      {isOfflineActive && (
                        <span className="bg-congo-blue/10 text-congo-blue border border-congo-blue/20 font-mono text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                          <Satellite className="w-2.5 h-2.5" /> HORS-LIGNE
                        </span>
                      )}
                    </div>

                    {/* Solar telemetry */}
                    <div className="grid grid-cols-2 gap-4 bg-congo-dark/60 p-3 rounded-xl border border-gray-800/80 text-xs">
                      <div className="space-y-1 text-left">
                        <span className="text-gray-500 block text-[10px] font-mono uppercase flex items-center gap-1">
                          <Battery className="w-3.5 h-3.5 text-congo-gold" /> Batterie
                        </span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-white text-sm">{kit.batteryLevel}%</strong>
                          <span className="text-[9px] text-emerald-400 font-medium">Sain</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-left border-l border-gray-800/80 pl-3">
                        <span className="text-gray-500 block text-[10px] font-mono uppercase flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-congo-blue" /> Solaire
                        </span>
                        <div className="flex items-center gap-1">
                          <strong className="text-white text-sm">{kit.solarPowerWatts} W</strong>
                          {kit.solarCharging && (
                            <span className="text-[8px] bg-congo-gold/10 text-congo-gold px-1 rounded uppercase animate-pulse">CHARGE</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sync status */}
                    <div className="flex justify-between items-center text-xs border-t border-gray-800/50 pt-3">
                      <div>
                        <span className="text-gray-500 block text-[9px] font-mono">ENREGISTREMENTS EN ATTENTE :</span>
                        <strong className={kit.pendingSyncCount > 0 ? 'text-congo-gold' : 'text-gray-400'}>
                          {kit.pendingSyncCount} dossiers cryptés
                        </strong>
                      </div>

                      {kit.pendingSyncCount > 0 ? (
                        <button
                          type="button"
                          disabled={isSyncing}
                          onClick={() => triggerManualSync(kit.id)}
                          className="bg-congo-blue hover:bg-congo-blue/95 text-white font-display font-medium text-[10px] py-1 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <Satellite className="w-3 h-3" /> Synchroniser
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          ✓ Synchronisé
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* BUDGET SAVINGS PANEL */}
        {activeSubTab === 'BUDGET' && (
          <motion.div
            key="budget-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            {/* Visual breakdown graph */}
            <div className="lg:col-span-7 bg-congo-card/90 border border-gray-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-display font-bold text-base text-gray-200">Calculateur d'Économies Budgétaires Nationales</h3>
                <p className="text-xs text-gray-400 mt-0.5">La mutualisation évite d'acquérir deux fois des flottes de serveurs et des kits biométriques séparés.</p>
              </div>

              {/* Graphical horizontal bar comparison */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>A. DEUX PROCESSUS SÉPARÉS (CENI + ONIP indépendants)</span>
                    <strong className="text-congo-red">$800,000,000 USD</strong>
                  </div>
                  <div className="w-full bg-congo-dark/60 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-congo-red h-full rounded-full w-full"></div>
                  </div>
                  <span className="text-[9px] text-gray-500 block">($400M pour le recensement d'identification ONIP + $400M pour le recensement électoral de la CENI)</span>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>B. SOLUTION ID-RDC MUTUALISÉE</span>
                    <strong className="text-emerald-400">$250,000,000 USD</strong>
                  </div>
                  <div className="w-full bg-congo-dark/60 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[31%]"></div>
                  </div>
                  <span className="text-[9px] text-gray-500 block">(Achat unique de kits biométriques ruraux partagés + Base de données de déduplication ABIS conjointe)</span>
                </div>
              </div>

              {/* Progress Savings Bar */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">ÉCONOMIE D'ÉCHELLE POUR LE TRÉSOR PUBLIC</span>
                  <p className="text-xs text-gray-300">
                    En fusionnant l'enrôlement, l'État congolais économise <strong>$550 Millions USD</strong>, ré-investis dans d'autres priorités nationales.
                  </p>
                </div>
                <div className="text-center p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 flex-shrink-0 font-mono">
                  <span className="text-[10px] block font-sans">Réduction</span>
                  <strong className="text-xl font-bold font-mono">-68%</strong>
                </div>
              </div>
            </div>

            {/* Re-allocated budget funds list */}
            <div className="lg:col-span-5 bg-congo-card border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
                  <Award className="w-4 h-4 text-congo-gold" />
                  <span>Ré-affectation du Budget d'Économie ($550M)</span>
                </h4>

                <p className="text-xs text-gray-400">Exemples de projets de développement rural financés grâce aux fonds épargnés par la mutualisation :</p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="bg-congo-dark/50 p-2.5 rounded-xl border border-gray-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">🔌 Électrification Solaire Rurale</strong>
                      <span className="text-[10px] text-gray-500">Installation de micro-réseaux photovoltaïques territoriaux.</span>
                    </div>
                    <span className="text-congo-gold font-mono font-bold">$180M</span>
                  </div>

                  <div className="bg-congo-dark/50 p-2.5 rounded-xl border border-gray-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">🏥 Cliniques Mobiles de Santé</strong>
                      <span className="text-[10px] text-gray-500">Soins d'urgence dans les villages reculés de l'Équateur et du Kivu.</span>
                    </div>
                    <span className="text-congo-gold font-mono font-bold">$120M</span>
                  </div>

                  <div className="bg-congo-dark/50 p-2.5 rounded-xl border border-gray-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">🛣️ Routes de Desserte Agricole</strong>
                      <span className="text-[10px] text-gray-500">Réhabilitation des voies d'accès pour désenclaver les producteurs.</span>
                    </div>
                    <span className="text-congo-gold font-mono font-bold">$250M</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 italic mt-4 text-center border-t border-gray-800/40 pt-3">
                Calculs certifiés conformes selon les directives de mutualisation CENI - ONIP.
              </div>
            </div>
          </motion.div>
        )}

        {/* ABIS SUPERVISION PANEL */}
        {activeSubTab === 'ABIS' && (
          <motion.div
            key="abis-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display font-bold text-base text-gray-200">Supervision du Hub Biométrique ABIS</h3>
              <p className="text-xs text-gray-400 mt-0.5">Le système automatisé d'identification biométrique (ABIS) nettoie la base électorale et l'index de population civile en éradiquant les doublons.</p>
            </div>

            {/* Live Logs console */}
            <div className="bg-congo-dark border-2 border-gray-800/80 rounded-2xl p-5 font-mono text-xs text-left space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-gray-300">CONSOLE ABIS PARTAGÉE • TERMINAL DE CONTRÔLE</span>
                </div>
                <div className="text-[10px] text-gray-500">SAT-LINK ACTIVE • SECURE</div>
              </div>

              <div className="space-y-3.5 max-h-[280px] overflow-y-auto no-scrollbar">
                {logs.map((log, i) => {
                  const isSuccess = log.type === 'SUCCESS';
                  const isWarning = log.type === 'WARNING';
                  const isAlert = log.type === 'ALERT';
                  
                  return (
                    <div key={log.id} className="flex gap-3 text-[11px] leading-relaxed">
                      <span className="text-gray-500 font-mono flex-shrink-0">
                        [{new Date(log.timestamp).toLocaleTimeString('fr-FR')}]
                      </span>
                      <span className={`font-bold flex-shrink-0 font-mono ${
                        isSuccess ? 'text-emerald-400' : isWarning ? 'text-congo-gold' : isAlert ? 'text-congo-red' : 'text-congo-blue'
                      }`}>
                        {log.source} &raquo;
                      </span>
                      <span className="text-gray-300">
                        {log.message}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
