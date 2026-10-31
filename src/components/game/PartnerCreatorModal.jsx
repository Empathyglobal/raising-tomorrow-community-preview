import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';

const PARTNER_NAME_SUGGESTIONS = [
  'Sam','Alex','Jordan','Casey','Taylor','Riley',
  'Amara','Wei','Yuki','Omar','Dmitri','Amelie','Diego',
  'Fatima','Jun','Haruto','Layla','Alexei','Sofia','Hassan',
  'Zuri','Mei','Kaito','Noor','Ivan','Camille','Carlos'
];

export default function PartnerCreatorModal({ open, onComplete, defaultGenderKey = 'male', defaultToneIndex = 0 }) {
  const [step, setStep] = useState('basics'); // 'basics' | 'avatar'
  const [partnerGenderKey, setPartnerGenderKey] = useState('male');
  const [partnerAge, setPartnerAge] = useState(28); // 18..75
  const [partnerAvatarIndex, setPartnerAvatarIndex] = useState(0); // 0..15
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setStep('basics');
      setPartnerGenderKey(defaultGenderKey === 'female' ? 'female' : 'male');
      setPartnerAge(28);
      const toneCol = (((defaultToneIndex ?? 0) % 4) + 4) % 4; // 0..3 safe
      setPartnerAvatarIndex(toneCol);
      setPartnerName('');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, defaultGenderKey, defaultToneIndex]);

  const ageOk = Number.isInteger(Number(partnerAge)) && partnerAge >= 18 && partnerAge <= 75;
  const canNextBasics = ageOk && (partnerGenderKey === 'male' || partnerGenderKey === 'female');
  const nameOk = partnerName.trim().length >= 2;
  const avatarOk = Number.isInteger(Number(partnerAvatarIndex)) && partnerAvatarIndex >= 0 && partnerAvatarIndex <= 15;
  const canFinish = nameOk && avatarOk && ageOk;

  const handleFinish = () => {
    if (!canFinish) return;
    onComplete?.({
      name: partnerName.trim(),
      age: Number(partnerAge),
      genderKey: partnerGenderKey,
      avatarSpriteIndex: Number(partnerAvatarIndex),
    });
  };

  const GenderCard = ({ gender }) => {
    const selected = partnerGenderKey === gender;
    return (
      <button
        onClick={() => setPartnerGenderKey(gender)}
        className={`flex-1 p-3 rounded-2xl border-2 transition-all bg-white ${selected ? 'ring-2 ring-amber-400 border-amber-300 shadow-md' : 'border-slate-200 hover:border-amber-300'}`}
      >
        <div className="flex items-center gap-3">
          <PlayerSpriteAvatar genderKey={gender} ageNumber={partnerAge} index={partnerAvatarIndex} size={72} align="center" />
          <div className="text-left">
            <div className="font-semibold text-slate-800 text-sm">{gender === 'male' ? 'Male' : 'Female'}</div>
            <div className="text-xs text-slate-500">Preview · updates with age</div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/70 z-[200]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="fixed inset-0 z-[201] flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85dvh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="text-xs text-slate-500">Partner Setup</div>
                <div className="text-lg font-bold text-slate-800">{step === 'basics' ? 'Basics' : 'Look + Name'}</div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 pb-24">
                {step === 'basics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <GenderCard gender="male" />
                      <GenderCard gender="female" />
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Partner age</label>
                        <div className="text-2xl font-bold text-amber-600">{partnerAge}</div>
                      </div>
                      <Slider value={[partnerAge]} onValueChange={(v) => setPartnerAge(v[0])} min={18} max={75} step={1} className="w-full" />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>18</span>
                        <span>75</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 'avatar' && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-2">Choose a portrait</div>
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 16 }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setPartnerAvatarIndex(i)}
                            className={`rounded-xl border p-1 transition-all ${partnerAvatarIndex === i ? 'ring-2 ring-amber-400 shadow border-amber-300' : 'border-slate-200 hover:border-amber-300'}`}
                          >
                            <div className="flex items-center justify-center">
                              <PlayerSpriteAvatar genderKey={partnerGenderKey} ageNumber={partnerAge} index={i} size={56} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Partner name</label>
                      <Input
                        type="text"
                        placeholder="e.g., Sam"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="text-base h-12 border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
                      />
                      <div className="mt-3">
                        <p className="text-xs text-slate-500 mb-2">Quick picks:</p>
                        <div className="flex flex-wrap gap-2">
                          {PARTNER_NAME_SUGGESTIONS.map((name) => (
                            <button
                              key={name}
                              onClick={() => setPartnerName(name)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 text-sm rounded-lg transition-colors"
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] bg-white border-t border-slate-100 sticky bottom-0 z-50">
                {step === 'basics' ? (
                  <Button onClick={() => setStep('avatar')} disabled={!canNextBasics} className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40">
                    Next
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setStep('basics')} variant="outline" className="h-12 flex-1">Back</Button>
                    <Button onClick={handleFinish} disabled={!canFinish} className="h-12 flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40">
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}