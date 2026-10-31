import React from 'react';
import { Home, Zap, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'actions', label: 'Actions', icon: Zap },
    { id: 'story', label: 'Story', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              data-tour={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 h-full flex flex-col items-center justify-center gap-1 relative"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-amber-600' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}