/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, Laptop, Globe, Menu, X, Check, UserPlus, CreditCard, LayoutDashboard, Fingerprint
} from 'lucide-react';
import { EnrollmentRecord } from './types';
import { MOCK_CITIZENS } from './data/mockData';
import CitizenPortal from './components/CitizenPortal';
import AgentTerminal from './components/AgentTerminal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'CITIZEN' | 'AGENT'>('CITIZEN');
  const [citizenSubView, setCitizenSubView] = useState<'DASHBOARD' | 'CARDS' | 'WIZARD'>('DASHBOARD');
  const [menuOpen, setMenuOpen] = useState(false);
  const [records, setRecords] = useState<EnrollmentRecord[]>([]);

  // Load records from localStorage or use pre-seeded mock citizens
  useEffect(() => {
    const stored = localStorage.getItem('id_congo_records');
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch (err) {
        console.error("Could not parse stored records, resetting to default.", err);
        setRecords(MOCK_CITIZENS);
      }
    } else {
      setRecords(MOCK_CITIZENS);
    }
  }, []);

  const saveRecords = (newRecords: EnrollmentRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('id_congo_records', JSON.stringify(newRecords));
  };

  // Add new pre-enrolled citizen from portal
  const handlePreEnrollCompleted = (newRecord: EnrollmentRecord) => {
    // Check if record already exists to prevent duplicate insertion
    if (records.some(r => r.id === newRecord.id)) return;
    
    const updated = [newRecord, ...records];
    saveRecords(updated);
    
    // Automatically redirect to CARDS view so they see their receipt / identity card
    setCitizenSubView('CARDS');
  };

  // Agent validates citizen biometrics and ABIS generates NIN
  const handleRecordValidated = (updatedRecord: EnrollmentRecord) => {
    const updated = records.map(r => r.id === updatedRecord.id ? updatedRecord : r);
    saveRecords(updated);
  };

  const handleResetData = () => {
    if (confirm("Voulez-vous réinitialiser l'application avec les données de démonstration d'origine ? Toutes vos fiches créées seront effacées.")) {
      localStorage.removeItem('id_congo_records');
      setRecords(MOCK_CITIZENS);
      setActiveTab('CITIZEN');
    }
  };

  return (
    <div className="min-h-screen bg-congo-dark text-[#1A1C1E] font-sans flex flex-col justify-between selection:bg-congo-blue/30 selection:text-white">
      
      {/* Top Banner & Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
        {/* DRC Flag Ribbon at the absolute top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-congo-blue via-congo-gold to-congo-red"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            {/* National Emblem (Coat of Arms) */}
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200 overflow-hidden p-1 shrink-0 hover:scale-105 transition-all duration-300">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_Arms_Democratic_Republic_of_Congo.png/250px-Coat_of_Arms_Democratic_Republic_of_Congo.png"
                alt="Armoiries de la RDC"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left">
              <span className="text-[8px] font-mono font-bold tracking-widest text-congo-blue uppercase block">République Démocratique du Congo</span>
              <h1 className="text-lg font-display font-black tracking-tight text-[#1A1C1E] flex items-center gap-2">
                ID-RDC
                <span className="inline-flex items-center bg-[#F4F5F7] px-1.5 py-0.5 rounded-md border border-gray-200 shadow-2xs select-none">
                  <svg viewBox="0 0 800 600" className="w-6 h-4 rounded-xs shadow-xs border border-gray-300 shrink-0">
                    <rect width="800" height="600" fill="#007FFF"/>
                    <path d="M 0,470 L 626,0 L 800,0 L 800,130 L 174,600 L 0,600 Z" fill="#FFD700"/>
                    <path d="M 0,500 L 666,0 L 800,0 L 800,100 L 133,600 L 0,600 Z" fill="#CE1126"/>
                    <g transform="translate(150, 150) scale(1.5)">
                      <path d="M 0,-40 L 11.7,-11.7 L 40,-11.7 L 17.6,5 L 26,34.2 L 0,16.2 L -26,34.2 L -17.6,5 L -40,-11.7 L -11.7,-11.7 Z" fill="#FFD700" />
                    </g>
                  </svg>
                </span>
              </h1>
            </div>
          </div>

          {/* Hamburger Menu & Actions */}
          <div className="flex items-center gap-2.5 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 py-2.5 bg-[#F4F5F7] hover:bg-gray-200/80 active:scale-95 text-gray-700 hover:text-[#1A1C1E] rounded-xl border-0 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="w-4 h-4 stroke-[2.5]" /> : <Menu className="w-4 h-4 stroke-[2.5]" />}
                <span className="text-xs font-display font-extrabold tracking-wider uppercase">Menu</span>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left border-0">
                    <div className="px-5 pb-2 mb-2">
                      <p className="text-[10px] font-mono font-bold tracking-widest text-congo-blue uppercase">Espaces disponibles</p>
                    </div>
                    
                    <div className="flex flex-col gap-1 px-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('CITIZEN');
                          setCitizenSubView('DASHBOARD');
                          setMenuOpen(false);
                        }}
                        className={`w-full p-2.5 text-xs font-display rounded-xl flex items-center gap-3.5 transition-all cursor-pointer text-left ${
                          activeTab === 'CITIZEN' && citizenSubView === 'DASHBOARD'
                            ? 'bg-congo-blue/10 text-congo-blue font-bold'
                            : 'text-gray-600 hover:text-[#1A1C1E] hover:bg-gray-50 font-semibold'
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all flex items-center justify-center shrink-0 ${
                          activeTab === 'CITIZEN' && citizenSubView === 'DASHBOARD'
                            ? 'bg-congo-blue/20 text-congo-blue'
                            : 'bg-[#F4F5F7] text-gray-500'
                        }`}>
                          <LayoutDashboard className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold">Portail Citoyen</p>
                          <p className="text-[10px] text-gray-500 font-normal font-sans mt-0.5 leading-tight">Tableau de bord principal</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('CITIZEN');
                          setCitizenSubView('WIZARD');
                          setMenuOpen(false);
                        }}
                        className={`w-full p-2.5 text-xs font-display rounded-xl flex items-center gap-3.5 transition-all cursor-pointer text-left ${
                          activeTab === 'CITIZEN' && citizenSubView === 'WIZARD'
                            ? 'bg-congo-blue/10 text-congo-blue font-bold'
                            : 'text-gray-600 hover:text-[#1A1C1E] hover:bg-gray-50 font-semibold'
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all flex items-center justify-center shrink-0 ${
                          activeTab === 'CITIZEN' && citizenSubView === 'WIZARD'
                            ? 'bg-congo-blue/20 text-congo-blue'
                            : 'bg-[#F4F5F7] text-gray-500'
                        }`}>
                          <Fingerprint className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold">Nouvel enrôlement</p>
                          <p className="text-[10px] text-gray-500 font-normal font-sans mt-0.5 leading-tight">Pré-enrôlement civique en ligne</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('CITIZEN');
                          setCitizenSubView('CARDS');
                          setMenuOpen(false);
                        }}
                        className={`w-full p-2.5 text-xs font-display rounded-xl flex items-center gap-3.5 transition-all cursor-pointer text-left ${
                          activeTab === 'CITIZEN' && citizenSubView === 'CARDS'
                            ? 'bg-congo-blue/10 text-congo-blue font-bold'
                            : 'text-gray-600 hover:text-[#1A1C1E] hover:bg-gray-50 font-semibold'
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all flex items-center justify-center shrink-0 ${
                          activeTab === 'CITIZEN' && citizenSubView === 'CARDS'
                            ? 'bg-congo-blue/20 text-congo-blue'
                            : 'bg-[#F4F5F7] text-gray-500'
                        }`}>
                          <CreditCard className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold">Ma carte ID</p>
                          <p className="text-[10px] text-gray-500 font-normal font-sans mt-0.5 leading-tight">Mes cartes d'identité & d'électeur</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 py-8 flex-grow">
        
        {/* Project Intro Panel - contextual to the active space */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left shadow-sm relative overflow-hidden">
          {/* Accent decoration (thin colored stripes block from the charter) */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="w-1/2 h-full bg-congo-blue"></div>
            <div className="w-1/4 h-full bg-congo-gold"></div>
            <div className="w-1/4 h-full bg-congo-red"></div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-congo-blue animate-pulse"></span>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-congo-blue">
                PORTAIL CITOYEN : ENRÔLEMENT ET IDENTITÉ NUMÉRIQUE
              </h2>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
              Saisissez vos données d'état civil depuis votre domicile, téléversez votre acte de naissance ou certificat de nationalité, et accédez à vos pièces d'identité numériques sécurisées en République Démocratique du Congo.
            </p>
          </div>
          <div className="bg-congo-blue/10 text-congo-blue border border-congo-blue/20 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto justify-center">
            <Globe className="w-3.5 h-3.5" /> RDC Unifiée
          </div>
        </div>

        {/* Dynamic Space Render */}
        <div className="min-h-[500px]">
          {activeTab === 'CITIZEN' ? (
            <CitizenPortal 
              onPreEnrollCompleted={handlePreEnrollCompleted} 
              subView={citizenSubView}
              onSubViewChange={setCitizenSubView}
            />
          ) : (
            <AgentTerminal 
              records={records} 
              onRecordValidated={handleRecordValidated} 
            />
          )}
        </div>
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-xs text-gray-500 text-center shadow-inner mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-gray-800 font-bold"><strong>ID-RDC</strong> • Plateforme d'Enrôlement Civil et Électoral Hybride</p>
            <p className="text-[10px] text-gray-500 mt-1">Cabinet du Numérique RDC • En partenariat avec l'ONIP et la CENI • Année 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Serveur Principal (Kinshasa) : Connecté
            </span>
            <span className="text-gray-300">|</span>
            <span className="font-mono text-[10px] bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg text-gray-600 font-bold">VERSION 2.4.0-STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
