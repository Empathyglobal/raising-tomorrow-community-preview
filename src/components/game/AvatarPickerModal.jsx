import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { getAvatarEmojiForAge } from '@/components/game/avatars';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';

export default function AvatarPickerModal({ open, onClose }) {
  const { gameState, updateState } = useGameState();
  const [selectedGender, setSelectedGender] = React.useState(gameState.childAvatarGender || '');
  const [selectedToneIndex, setSelectedToneIndex] = React.useState(gameState.childAvatarToneIndex ?? 2);
  const [selectedSpriteIndex, setSelectedSpriteIndex] = React.useState(gameState.childAvatarSpriteIndex ?? ((gameState.childAvatarToneIndex ?? 0) % 4));

  React.useEffect(() => {
    if (open) {
      setSelectedGender(gameState.childAvatarGender || '');
      setSelectedToneIndex(gameState.childAvatarToneIndex ?? 2);
      setSelectedSpriteIndex(gameState.childAvatarSpriteIndex ?? ((gameState.childAvatarToneIndex ?? 0) % 4));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, gameState.childAvatarGender, gameState.childAvatarToneIndex]);

  const handleSelectSprite = (gender, spriteIndex) => {
    setSelectedGender(gender);
    setSelectedSpriteIndex(spriteIndex);
    const toneIndex = Number(spriteIndex) % 4;
    setSelectedToneIndex(toneIndex);
    updateState({ 
      childAvatarGender: gender,
      childAvatarSpriteIndex: spriteIndex,
      childAvatarToneIndex: toneIndex, 
      childAvatarPicked: true 
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">Change Avatar</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <p className="text-xs text-slate-500 text-center mb-4">
                  Pick girl or boy + skin tone. Avatar grows with age.
                </p>

                {/* Age previews */}
                <div className="flex justify-center gap-4 mb-5 bg-slate-50 rounded-lg p-3">
                  {selectedSpriteIndex != null ? (
                    <>
                      <div className="text-center">
                        <div className="mb-1">
                          <PlayerSpriteAvatar genderKey={selectedGender === 'girl' ? 'female' : 'male'} ageNumber={0} index={selectedSpriteIndex} size={48} />
                        </div>
                        <div className="text-[10px] text-slate-500">Age 0</div>
                      </div>
                      <div className="text-center">
                        <div className="mb-1">
                          <PlayerSpriteAvatar genderKey={selectedGender === 'girl' ? 'female' : 'male'} ageNumber={6} index={selectedSpriteIndex} size={48} />
                        </div>
                        <div className="text-[10px] text-slate-500">Age 6</div>
                      </div>
                      <div className="text-center">
                        <div className="mb-1">
                          <PlayerSpriteAvatar genderKey={selectedGender === 'girl' ? 'female' : 'male'} ageNumber={12} index={selectedSpriteIndex} size={48} />
                        </div>
                        <div className="text-[10px] text-slate-500">Age 12</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-2xl mb-1">{getAvatarEmojiForAge(1, selectedGender || 'boy', selectedToneIndex)}</div>
                        <div className="text-[10px] text-slate-500">Age 1</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-1">{getAvatarEmojiForAge(5, selectedGender || 'boy', selectedToneIndex)}</div>
                        <div className="text-[10px] text-slate-500">Age 5</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-1">{getAvatarEmojiForAge(9, selectedGender || 'boy', selectedToneIndex)}</div>
                        <div className="text-[10px] text-slate-500">Age 9</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Girl row */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-slate-600 mb-2">Girl</div>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {Array.from({ length: 16 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSprite('girl', i)}
                        className={`rounded-xl border p-1 transition-all ${selectedGender === 'girl' && selectedSpriteIndex === i ? 'ring-2 ring-pink-400 shadow border-pink-300' : 'border-slate-200 hover:border-pink-300'}`}
                      >
                        <div className="flex items-center justify-center">
                          <PlayerSpriteAvatar genderKey="female" ageNumber={0} index={i} size={56} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Boy row */}
                <div>
                  <div className="text-xs font-medium text-slate-600 mb-2">Boy</div>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {Array.from({ length: 16 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSprite('boy', i)}
                        className={`rounded-xl border p-1 transition-all ${selectedGender === 'boy' && selectedSpriteIndex === i ? 'ring-2 ring-blue-400 shadow border-blue-300' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <div className="flex items-center justify-center">
                          <PlayerSpriteAvatar genderKey="male" ageNumber={0} index={i} size={56} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}