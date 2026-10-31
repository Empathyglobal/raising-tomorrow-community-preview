import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';

export default function ShoppingHubModal({ open, onClose, onOpenShop = null, onOpenHousing, onOpenMyHouse, onOpenStyleChange }) {
  const { mods, gameState, getActionAvailability } = useGameState();
  
  // Check availability for each shopping button
  const housingAvail = getActionAvailability('shop_housing');
  const carsAvail = getActionAvailability('shop_cars');
  const mallAvail = getActionAvailability('shop_mall');
  const myStuffAvail = getActionAvailability('shop_myStuff');
  const roomAvail = getActionAvailability('room');
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">🛍️ Shopping Hub</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                {/* Housing */}
                <button
                  onClick={() => {
                    if (housingAvail.enabled) {
                      onOpenHousing?.();
                      onClose();
                    }
                  }}
                  disabled={!housingAvail.enabled}
                  title={!housingAvail.enabled ? housingAvail.reason : ''}
                  className={`w-full p-4 rounded-xl border-2 border-slate-200 bg-white active:scale-[0.98] transition-all text-left ${
                    housingAvail.enabled 
                      ? 'hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🏠</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">Housing</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {housingAvail.enabled ? 'Buy, sell, and manage homes' : housingAvail.reason}
                      </div>
                    </div>
                  </div>
                </button>

                {/* My House */}
                <button
                  onClick={() => {
                    if (roomAvail.enabled) {
                      onOpenMyHouse?.();
                      onClose();
                    }
                  }}
                  disabled={!roomAvail.enabled}
                  title={!roomAvail.enabled ? roomAvail.reason : ''}
                  className={`w-full p-4 rounded-xl border-2 border-slate-200 bg-white active:scale-[0.98] transition-all text-left ${
                    roomAvail.enabled 
                      ? 'hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🛋️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">My House</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {roomAvail.enabled ? 'Manage your room & home life' : roomAvail.reason}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Car Dealership */}
                <button
                  onClick={() => {
                    if (carsAvail.enabled && typeof onOpenShop === 'function') {
                      onOpenShop({ mode: 'shop', filterMode: 'vehicles' });
                      onClose();
                    }
                  }}
                  disabled={!carsAvail.enabled}
                  title={!carsAvail.enabled ? carsAvail.reason : ''}
                  className={`w-full p-4 rounded-xl border-2 border-slate-200 bg-white active:scale-[0.98] transition-all text-left ${
                    carsAvail.enabled 
                      ? 'hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🚗</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">Car Dealership</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {carsAvail.enabled ? 'Browse and buy vehicles' : carsAvail.reason}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Mall */}
                <button
                  onClick={() => {
                    if (mallAvail.enabled && typeof onOpenShop === 'function') {
                      onOpenShop({ mode: 'shop', filterMode: 'mall' });
                      onClose();
                    }
                  }}
                  disabled={!mallAvail.enabled}
                  title={!mallAvail.enabled ? mallAvail.reason : ''}
                  className={`w-full p-4 rounded-xl border-2 border-slate-200 bg-white active:scale-[0.98] transition-all text-left ${
                    mallAvail.enabled 
                      ? 'hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🛍️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">Mall</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {mallAvail.enabled ? 'Fashion, beauty, hobbies & more' : mallAvail.reason}
                      </div>
                    </div>
                  </div>
                </button>

                {/* My Stuff */}
                <button
                  onClick={() => {
                    if (myStuffAvail.enabled && typeof onOpenShop === 'function') {
                      onOpenShop({ mode: 'stuff' });
                      onClose();
                    }
                  }}
                  disabled={!myStuffAvail.enabled}
                  title={!myStuffAvail.enabled ? myStuffAvail.reason : ''}
                  className={`w-full p-4 rounded-xl border-2 border-slate-200 bg-white active:scale-[0.98] transition-all text-left ${
                    myStuffAvail.enabled 
                      ? 'hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🎒</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">My Stuff</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {myStuffAvail.enabled ? 'View & use your inventory' : myStuffAvail.reason}
                      </div>
                    </div>
                  </div>
                </button>


              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}