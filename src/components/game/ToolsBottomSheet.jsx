import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Sparkles, BookMarked, BarChart3, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToolsBottomSheet({ open, onClose }) {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    navigate(createPageUrl(page));
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div 
            className="rt-modal-sheet fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Parent Tools</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleNavigate('StudyHub')}
                >
                  <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-semibold">Study Hub</div>
                    <div className="text-xs text-slate-500">Learn new parenting techniques</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleNavigate('Tutoring')}
                >
                  <GraduationCap className="w-5 h-5 mr-3 text-purple-600" />
                  <div>
                    <div className="font-semibold">Tutoring</div>
                    <div className="text-xs text-slate-500">Focus on specific skills</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleNavigate('Strategies')}
                >
                  <Sparkles className="w-5 h-5 mr-3 text-amber-600" />
                  <div>
                    <div className="font-semibold">Strategies</div>
                    <div className="text-xs text-slate-500">Special connection actions</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleNavigate('Journal')}
                >
                  <BookMarked className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <div className="font-semibold">Journal</div>
                    <div className="text-xs text-slate-500">View log & memories</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleNavigate('DevelopmentDetails')}
                >
                  <BarChart3 className="w-5 h-5 mr-3 text-indigo-600" />
                  <div>
                    <div className="font-semibold">Development Details</div>
                    <div className="text-xs text-slate-500">Full stats breakdown</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleNavigate('StudyHistory')}
                >
                  <Clock className="w-5 h-5 mr-3 text-slate-600" />
                  <div>
                    <div className="font-semibold">Study History</div>
                    <div className="text-xs text-slate-500">What you've learned</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleNavigate('ParentTools')}
                >
                  <span className="text-lg mr-3">📱</span>
                  <div>
                    <div className="font-semibold">Phone & More</div>
                    <div className="text-xs text-slate-500">Manage phone access</div>
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}