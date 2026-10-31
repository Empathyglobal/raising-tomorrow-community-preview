import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, FileText, Eye, Building, TrendingUp, TrendingDown, AlertCircle, MessageCircle, Gavel, Lock, Info } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { PTA_RANKS, PTA_NPCS, WEEKLY_CHARGES, REMOVAL_ACTIONS, PROCEDURAL_MOVES } from './ptaData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// --- Sub-Components ---
import LodgeTab from './LodgeTab';
import CouncilTab from './CouncilTab';
import NetworkTab from './NetworkTab';
import DossierTab from './DossierTab';
import MaskTab from './MaskTab';

export default function PTAHubModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('lodge');
  const { gameState, updatePTA } = useGameState();
  const { pta } = gameState;

  if (!open) return null;

  const tabs = [
    { id: 'lodge', label: 'The Lodge', icon: Building },
    { id: 'council', label: 'Council', icon: Gavel },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'dossiers', label: 'Dossiers', icon: FileText },
    { id: 'mask', label: 'Mask', icon: Eye },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-700"
      >
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-500 tracking-wider">PTA ILLUMINATI</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Rank: {PTA_RANKS[pta.rank?.toUpperCase()]?.label || 'Observer'}</span>
                <span>•</span>
                <span>Heat: {pta.stats.heat}%</span>
                <span>•</span>
                <span>Integrity: {pta.stats.integrity}%</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-20 md:w-48 bg-slate-950 border-r border-slate-800 flex flex-col">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center md:gap-3 p-4 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-amber-500/10 text-amber-500 border-r-2 border-amber-500' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Panel */}
          <div className="flex-1 overflow-y-auto bg-slate-900 p-4 md:p-6">
            {activeTab === 'lodge' && <LodgeTab />}
            {activeTab === 'council' && <CouncilTab />}
            {activeTab === 'network' && <NetworkTab />}
            {activeTab === 'dossiers' && <DossierTab />}
            {activeTab === 'mask' && <MaskTab />}
          </div>
        </div>
        
        {/* Footer Stats Bar */}
        <div className="bg-slate-950 p-2 border-t border-slate-800 flex justify-around text-xs md:text-sm">
           <div className="flex items-center gap-1.5 text-slate-300">
             <TrendingUp className="w-4 h-4 text-emerald-400" />
             <span>Influence: {pta.stats.influence}</span>
           </div>
           <div className="flex items-center gap-1.5 text-slate-300">
             <AlertCircle className="w-4 h-4 text-red-400" />
             <span>Heat: {pta.stats.heat}</span>
           </div>
           <div className="flex items-center gap-1.5 text-slate-300">
             <Shield className="w-4 h-4 text-blue-400" />
             <span>Integrity: {pta.stats.integrity}</span>
           </div>
           <div className="flex items-center gap-1.5 text-slate-300">
             <TrendingDown className="w-4 h-4 text-amber-400" />
             <span>Bandwidth: {pta.stats.bandwidth}</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}