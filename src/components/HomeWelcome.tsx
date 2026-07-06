import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Fingerprint, Cpu, RefreshCw, Database, CheckCircle, 
  Key, Lock, WifiOff, Activity, ShieldCheck, CreditCard, 
  MapPin, Sparkles, Laptop, User, HelpCircle, Check, Code
} from 'lucide-react';

interface HomeWelcomeProps {
  onLogin: (role: 'CITIZEN' | 'AGENT' | 'HUB') => void;
  totalRecords: number;
}

interface AuditLog {
  hash: string;
  action: string;
  detail: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

export default function HomeWelcome({ onLogin, totalRecords }: HomeWelcomeProps) {
  // Navigation states mapping to App.tsx roles
  const [activeTabLocal, setActiveTabLocal] = useState<'HOME' | 'CITIZEN' | 'AGENT' | 'HUB'>('HOME');

  // Interactivity states for Bento elements
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(true);
  const [isCeniInterop, setIsCeniInterop] = useState<boolean>(true);
  const [syncTime, setSyncTime] = useState<number>(12);
  const [isRotatingKeys, setIsRotatingKeys] = useState<boolean>(false);
  const [hsmKeyStatus, setHsmKeyStatus] = useState<string>('AES-256-GCM');
  const [keyRotationDate, setKeyRotationDate] = useState<string>('12 Nov 2026');
  const [showFullChain, setShowFullChain] = useState<boolean>(false);
  
  // Audio / Visual state response
  const [showSuccessToast, setShowSuccessToast] = useState<string>('');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { hash: '#A82F92', action: 'Vérification biométrique réussie', detail: 'Validé par 4 consensus AFIS/FDS', time: '14:02:11', status: 'success' },
    { hash: '#B912C5', action: 'Sync Datacenter Lubumbashi', detail: 'Réplication terminée sans conflit', time: '13:58:45', status: 'success' },
    { hash: '#C44E11', action: 'Mise à jour Certificat SSL/TLS', detail: 'Root CA Authority Sign', time: '13:45:22', status: 'info' }
  ]);

  // Handle Bottom Navigation click and propagate to Parent (App.tsx)
  const handleNavigation = (tab: 'HOME' | 'CITIZEN' | 'AGENT' | 'HUB') => {
    setActiveTabLocal(tab);
    if (tab !== 'HOME') {
      onLogin(tab);
    }
  };

  // Simulated sync timer counting up
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncTime(prev => (prev >= 59 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // HSM Key rotation handler
  const handleRotateHSMKeys = () => {
    if (isRotatingKeys) return;
    setIsRotatingKeys(true);
    
    // Choose a random new standard algorithm for demonstration
    const algos = ['AES-256-GCM', 'CHACHA20-POLY1305', 'AES-512-KW', 'ECC-ECDSA-384'];
    const selectedAlgo = algos[Math.floor(Math.random() * algos.length)];

    setTimeout(() => {
      setIsRotatingKeys(false);
      setHsmKeyStatus(selectedAlgo);
      
      const now = new Date();
      const nextYear = now.getFullYear() + 1;
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
      setKeyRotationDate(`${now.getDate()} ${months[now.getMonth()]} ${nextYear}`);

      const nextId = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
      const timeStr = now.toTimeString().split(' ')[0];
      
      const newLog: AuditLog = {
        hash: `#${nextId}`,
        action: 'Rotation HSM exécutée',
        detail: `Session HSM rafraîchie sous standard ${selectedAlgo}`,
        time: timeStr,
        status: 'success'
      };
      
      setAuditLogs(prev => [newLog, ...prev]);
      setShowSuccessToast('Clés cryptographiques HSM renouvelées avec succès !');
      
      setTimeout(() => {
        setShowSuccessToast('');
      }, 3000);
    }, 1200);
  };

  // Toggle handlers with notifications
  const handleToggleOffline = () => {
    const nextState = !isOfflineMode;
    setIsOfflineMode(nextState);
    
    const now = new Date().toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      hash: `#${Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase()}`,
      action: nextState ? 'Cache FIPS-140-2 Activé' : 'Cache FIPS-140-2 Désactivé',
      detail: nextState ? 'Stockage chiffré local armé en cas de coupure réseau' : 'Passage en synchronisation directe',
      time: now,
      status: 'info'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleToggleCeni = () => {
    const nextState = !isCeniInterop;
    setIsCeniInterop(nextState);
    
    const now = new Date().toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      hash: `#${Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase()}`,
      action: nextState ? 'Interopérabilité CENI Armée' : 'Interopérabilité CENI Coupée',
      detail: nextState ? 'Lecture seule de la base électorale sécurisée autorisée' : 'Restriction d\'accès inter-institutionnel',
      time: now,
      status: nextState ? 'success' : 'warning'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Extra simulated logs
  const extraLogs: AuditLog[] = [
    { hash: '#E55D01', action: 'Consensus de blocs atteint', detail: 'Validation décentralisée par 6 nœuds d\'infrastructure', time: '13:30:15', status: 'success' },
    { hash: '#F88A19', action: 'Audit de sécurité automatique', detail: 'Aucun doublon trouvé dans les 100,000 derniers enregistrements', time: '13:12:00', status: 'success' },
    { hash: '#D421B2', action: 'Télémesure Solaire Kit #12', detail: 'Statut de batterie OK (92%) - Hub Bandundu', time: '12:55:40', status: 'info' }
  ];

  return (
    <div className="bg-[#f9f9fc] text-[#1a1c1e] font-sans min-h-screen pb-32 pt-2 text-left relative">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-[#005ab7] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-white/20"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{showSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content body */}
      <main className="mt-4 max-w-4xl mx-auto space-y-6 px-4">
        
        {/* Sovereignty Header Section */}
        <section className="py-4">
          <h2 className="text-2xl font-black tracking-tight text-[#005ab7]">Souveraineté Numérique</h2>
          <p className="text-[#414754] text-sm mt-1">Infrastructure de haute sécurité et gestion de l'identité nationale.</p>
        </section>

        {/* Bento Grid Infrastructure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ABIS Status Card */}
          <div className="bento-card bg-[#f3f3f6] p-6 rounded-2xl border border-[#c1c6d7] flex flex-col justify-between h-[220px]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#005ab7]/10 rounded-xl text-[#005ab7]">
                <Fingerprint className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#005ab7] text-white rounded-full text-[10px] font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                SYSTÈME ACTIF
              </div>
            </div>
            
            <div className="mt-4 text-left">
              <h3 className="text-[10px] font-bold text-[#414754] uppercase tracking-widest mb-1">
                Automated Biometric Identification
              </h3>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-[#005ab7] leading-none">0</span>
                <span className="text-lg font-bold text-[#1a1c1e]">Doublon</span>
              </div>
            </div>

            <div className="mt-4 flex items-center text-xs font-semibold text-[#414754] bg-[#f9f9fc] py-2 px-3 rounded-xl border border-[#c1c6d7]/30">
              <Cpu className="text-sm text-[#005ab7] mr-2 w-4 h-4" />
              Scan en temps réel AFIS/FDS (ONIP)
            </div>
          </div>

          {/* Data Replication Card */}
          <div className="bento-card bg-[#f3f3f6] p-6 rounded-2xl border border-[#c1c6d7] h-[220px] flex flex-col justify-between">
            <h3 className="text-[11px] font-bold text-[#414754] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="text-[#005ab7] w-4 h-4" />
              Réplication de Données
            </h3>
            
            <div className="relative space-y-2 mt-2">
              
              {/* Kinshasa Hub Block */}
              <div className="flex items-center justify-between p-2.5 bg-[#f9f9fc] rounded-xl border border-[#c1c6d7]/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#005ab7]/5 border border-[#005ab7]/10 flex items-center justify-center text-[#005ab7]">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">Kinshasa</p>
                    <p className="text-[9px] text-[#414754] uppercase font-bold">Hub Primaire</p>
                  </div>
                </div>
                <CheckCircle className="text-[#005ab7] w-4 h-4" />
              </div>

              {/* Animated Connection Path */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-1.5 h-6 rounded-full flow-line"></div>
              </div>

              {/* Lubumbashi Hub Block */}
              <div className="flex items-center justify-between p-2.5 bg-[#f9f9fc] rounded-xl border border-[#c1c6d7]/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#705d00]/5 border border-[#705d00]/10 flex items-center justify-center text-[#705d00]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">Lubumbashi</p>
                    <p className="text-[9px] text-[#414754]">Dernière synchro: <span className="font-bold text-[#005ab7]">{syncTime}s</span></p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#005ab7] security-pulse"></span>
              </div>

            </div>
          </div>

          {/* Encryption Key Management Card (HSM) */}
          <div className="bento-card md:col-span-2 bg-[#0a0c10] text-white p-6 rounded-2xl relative overflow-hidden border border-white/5 shadow-2xl">
            {/* Background absolute watermark */}
            <div className="absolute right-[-20px] top-[-20px] opacity-5 pointer-events-none text-white">
              <Key className="w-[180px] h-[180px]" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#005ab7] flex items-center justify-center shadow-lg shadow-[#005ab7]/20 text-white">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold leading-tight">Gestion HSM (Hardware Security Module)</h3>
                    <p className="text-xs text-white/50">Module de Sécurité Matériel v4.2</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  <span className="text-[10px] font-bold tracking-widest uppercase font-mono">Sécurisé</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 group hover:border-[#005ab7]/50 transition-colors text-left">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Standard Actif</p>
                  <p className="text-xs font-bold text-sky-300 font-mono">{hsmKeyStatus}</p>
                  <div className="mt-2 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#005ab7] h-full w-full"></div>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 group hover:border-[#005ab7]/50 transition-colors text-left">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Prochaine Rotation</p>
                  <p className="text-xs font-bold text-white">{keyRotationDate}</p>
                  <p className="text-[10px] mt-1 text-white/50">Renouvellement forcé requis régulièrement</p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 group hover:border-[#005ab7]/50 transition-colors text-left">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Validation cryptographique</p>
                  <p className="text-xs font-bold text-white">Multisig 2/3</p>
                  <div className="flex gap-1.5 mt-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#005ab7]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#005ab7]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="button"
                onClick={handleRotateHSMKeys}
                disabled={isRotatingKeys}
                className="mt-2 w-full py-3.5 bg-[#005ab7] hover:bg-[#005ab7]/95 disabled:bg-gray-800 text-white font-bold text-xs rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#005ab7]/20 cursor-pointer"
              >
                {isRotatingKeys ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    RENOUVELLEMENT EN COURS (HSM SIGN)...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-white" />
                    RENOUVELER LES CLÉS DE SESSION
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Offline Mode & CENI Toggles */}
          <div className="grid grid-cols-1 gap-4 md:col-span-2">
            
            {/* Offline Mode Toggle Card */}
            <div className="bento-card bg-[#e8e8ea] p-4 rounded-xl flex items-center justify-between border border-[#c1c6d7]/30">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#005ab7] shadow-xs border border-[#c1c6d7]/20">
                  <WifiOff className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Mode Hors-ligne Sécurisé</h4>
                  <p className="text-xs text-[#414754]">Cache local chiffré FIPS-140-2</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleOffline}
                className={`relative inline-flex items-center h-6 w-11 rounded-full p-0.5 transition-colors cursor-pointer ${
                  isOfflineMode ? 'bg-[#005ab7]' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block w-5 h-5 rounded-full bg-white transition-transform ${
                  isOfflineMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* CENI Interop Card */}
            <div className="bento-card bg-[#e8e8ea] p-4 rounded-xl flex items-center justify-between border border-[#c1c6d7]/30">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-red-600 shadow-xs border border-[#c1c6d7]/20">
                  <CreditCard className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Vue CENI Interopérable</h4>
                  <p className="text-xs text-[#414754]">Accès lecture seule base électorale</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleCeni}
                className={`relative inline-flex items-center h-6 w-11 rounded-full p-0.5 transition-colors cursor-pointer ${
                  isCeniInterop ? 'bg-[#005ab7]' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block w-5 h-5 rounded-full bg-white transition-transform ${
                  isCeniInterop ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>

        </div>

        {/* Security Activity Logs (Blockchain Ledger) */}
        <section className="bg-white p-5 rounded-2xl border border-[#c1c6d7] shadow-xs text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-800">
              <Activity className="text-[#005ab7] text-lg w-4 h-4" />
              Audit Ledger (Immutable)
            </h3>
            <span className="px-2 py-0.5 bg-[#1a1c1e]/5 text-[10px] font-mono font-bold rounded text-[#414754]">NODE_ID: DR-KN-01</span>
          </div>

          <div className="space-y-1 divide-y divide-gray-100">
            {/* Standard audit logs */}
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2.5 px-3 hover:bg-[#f3f3f6] rounded-xl transition-colors group">
                <span className="text-[10px] text-[#005ab7]/70 font-mono font-bold w-14">{log.hash}</span>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-gray-800 group-hover:text-[#005ab7] transition-colors">{log.action}</p>
                  <p className="text-[10px] text-[#414754]">{log.detail}</p>
                </div>
                <span className="text-[10px] font-mono text-[#414754]">{log.time}</span>
              </div>
            ))}

            {/* Expanded logs when button clicked */}
            {showFullChain && (
              extraLogs.map((log, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={`extra-${idx}`} 
                  className="flex items-center gap-3 py-2.5 px-3 hover:bg-[#f3f3f6] rounded-xl transition-colors group"
                >
                  <span className="text-[10px] text-emerald-600/70 font-mono font-bold w-14">{log.hash}</span>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">{log.action}</p>
                    <p className="text-[10px] text-[#414754]">{log.detail}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#414754]">{log.time}</span>
                </motion.div>
              ))
            )}
          </div>

          <button 
            type="button"
            onClick={() => setShowFullChain(!showFullChain)}
            className="w-full mt-4 py-2.5 border border-[#c1c6d7] rounded-xl text-[11px] font-bold text-[#005ab7] uppercase tracking-widest hover:bg-[#005ab7]/5 transition-all cursor-pointer"
          >
            {showFullChain ? "Fermer le Ledger d'audit" : "Consulter la chaîne complète"}
          </button>
        </section>

        {/* Demo Guidelines and shortcut info block */}
        <div className="bg-[#f3f3f6] border border-[#c1c6d7]/50 rounded-2xl p-4 text-xs text-left text-gray-600 space-y-2.5">
          <div className="flex items-center gap-1.5 font-bold text-[#005ab7] font-mono text-[10px] uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" /> Mode d'Emploi de la Démonstration
          </div>
          <p className="text-[11px] leading-relaxed">
            Cette interface de <strong>Souveraineté Nationale</strong> est connectée en temps réel au simulateur de processus d'enrôlement de la République Démocratique du Congo. Utilisez le menu supérieur pour naviguer :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button 
              type="button"
              onClick={() => handleNavigation('CITIZEN')}
              className="p-3 bg-white border border-[#c1c6d7]/40 rounded-xl hover:border-[#005ab7] text-left cursor-pointer transition-all hover:shadow-xs group"
            >
              <div className="font-bold text-[#005ab7] flex items-center gap-1 text-[11px] mb-1">
                <User className="w-3.5 h-3.5" /> 1. Portail Citoyen
              </div>
              <p className="text-[10px] text-gray-500">Pré-enrôlement civique à distance avec validation de format.</p>
            </button>

            <button 
              type="button"
              onClick={() => handleNavigation('AGENT')}
              className="p-3 bg-white border border-[#c1c6d7]/40 rounded-xl hover:border-[#005ab7] text-left cursor-pointer transition-all hover:shadow-xs group"
            >
              <div className="font-bold text-[#705d00] flex items-center gap-1 text-[11px] mb-1">
                <Laptop className="w-3.5 h-3.5" /> 2. Agent de Guichet
              </div>
              <p className="text-[10px] text-gray-500">Capture biométrique (Iris, Empreintes) et validation physique.</p>
            </button>

            <button 
              type="button"
              onClick={() => handleNavigation('HUB')}
              className="p-3 bg-white border border-[#c1c6d7]/40 rounded-xl hover:border-[#005ab7] text-left cursor-pointer transition-all hover:shadow-xs group"
            >
              <div className="font-bold text-red-600 flex items-center gap-1 text-[11px] mb-1">
                <Shield className="w-3.5 h-3.5" /> 3. Hub Central (ABIS)
              </div>
              <p className="text-[10px] text-gray-500">Production mutuelle de cartes d'identité & d'électeur unifiées.</p>
            </button>
          </div>
        </div>

      </main>

      {/* BottomNavBar tabbed controller bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-[#eeeef0] shadow-[0_-2px_10px_rgba(0,0,0,0.08)] rounded-t-2xl border-t border-white/20">
        
        {/* Tab 1: Accueil (Active on HOME) */}
        <button 
          type="button"
          onClick={() => handleNavigation('HOME')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTabLocal === 'HOME'
              ? 'bg-[#005ab7] text-white scale-100 shadow-md shadow-[#005ab7]/20 font-bold'
              : 'text-[#414754] hover:bg-[#e2e2e5]'
          }`}
        >
          <Database className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Accueil</span>
        </button>

        {/* Tab 2: Identité (Portail Citoyen) */}
        <button 
          type="button"
          onClick={() => handleNavigation('CITIZEN')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTabLocal === 'CITIZEN'
              ? 'bg-[#005ab7] text-white scale-100 shadow-md'
              : 'text-[#414754] hover:bg-[#e2e2e5]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Identité</span>
        </button>

        {/* Tab 3: Centres (Agent de Guichet) */}
        <button 
          type="button"
          onClick={() => handleNavigation('AGENT')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTabLocal === 'AGENT'
              ? 'bg-[#005ab7] text-white scale-100 shadow-md'
              : 'text-[#414754] hover:bg-[#e2e2e5]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Centres</span>
        </button>

        {/* Tab 4: Sécurité (Active / Hub Central ABIS) */}
        <button 
          type="button"
          onClick={() => handleNavigation('HUB')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTabLocal === 'HUB'
              ? 'bg-[#005ab7] text-white scale-100 shadow-md'
              : 'text-[#414754] hover:bg-[#e2e2e5]'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Sécurité</span>
        </button>

      </nav>

    </div>
  );
}
