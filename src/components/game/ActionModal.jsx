import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useGameState, combineDeltas, ECONOMY_PRICES, formatMoney, PRICING } from "@/components/game/GameStateContext";
import { pickFeedback } from './actionResultMessages';
import TravelDestinationModal from './TravelDestinationModal';
import TravelTripScenarioModal from './TravelTripScenarioModal';
import { trackBondAction, trackPlayAction } from './trackHeadlinerCounters';
import { hasShopItem } from './shopCatalog';
import { selectAirportScenario, formatAirportScenarioText } from './airportScenarios';
import { toast } from 'sonner';
import { getSpokenLanguagesForCountry } from './countriesData';
import { getParentLanguageComfortBonus } from './languageData';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';
import { getSectionCoverFilename } from '@/components/storybook/imageMap';

// --- Built-in fallback options ---
// If Base44 ActionOptions are missing/unavailable, we still want Bond/Play to work.
const FALLBACK_OPTIONS = {
  bond: [
    {
      id: 'bond_read',
      actionType: 'bond',
      emoji: '📚',
      title: 'Read together',
      subtitle: 'Cozy story time.',
      deltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
      loveDelta: 1,
      stressDelta: -1,
      moneyCost: 0,
      logLine: "📚 You read together. It lands softer than you expect."
    },
    {
      id: 'bond_talk',
      actionType: 'bond',
      emoji: '💬',
      title: 'Talk it out',
      subtitle: 'A real conversation (even if it\'s messy).',
      deltas: { intelligence: 0, empathy: 2, discipline: 0, confidence: 0 },
      loveDelta: 1,
      stressDelta: -0.5,
      moneyCost: 0,
      logLine: "💬 You talk. You listen. Something unclenches."
    },
    {
      id: 'bond_walk',
      actionType: 'bond',
      emoji: '🚶',
      title: 'Go for a walk',
      subtitle: 'Side-by-side is sometimes easier.',
      deltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 0 },
      loveDelta: 1,
      stressDelta: -1,
      moneyCost: 0,
      logLine: "🚶 You walk together. The hardest stuff comes out in the quiet."
    }
  ],
  play: [
    {
      id: 'play_park',
      actionType: 'play',
      emoji: '🌳',
      title: 'Park Adventure',
      subtitle: 'Run, climb, laugh.',
      deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 2 },
      loveDelta: 1,
      stressDelta: -1,
      moneyCost: 0,
      logLine: "🌳 You head to the park. Fresh air and big feelings."
    },
    {
      id: 'play_games',
      actionType: 'play',
      emoji: '🎮',
      title: 'Video games',
      subtitle: 'A little screen time — together.',
      deltas: { intelligence: 1, empathy: 0, discipline: -1, confidence: 1 },
      loveDelta: 1,
      stressDelta: 0,
      moneyCost: 0,
      logLine: "🎮 You play together. Someone definitely trash-talks."
    },
    {
      id: 'play_boardgames',
      actionType: 'play',
      emoji: '🎲',
      title: 'Board games',
      subtitle: 'Turns, rules, and playful rivalry.',
      deltas: { intelligence: 1, empathy: 1, discipline: 1, confidence: 0 },
      loveDelta: 1,
      stressDelta: 0,
      moneyCost: 0,
      logLine: "🎲 You play a board game. The rules are negotiable, apparently."
    },
    {
      id: 'play_art_time',
      actionType: 'play',
      emoji: '🎨',
      title: 'Art time',
      subtitle: 'Draw, paint, make a mess.',
      deltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 1 },
      loveDelta: 1,
      stressDelta: -0.5,
      moneyCost: 0,
      logLine: "🎨 You make art together. It's messy and surprisingly calming."
    }
  ]
};

const getFallbackOptions = (actionType) => {
  const list = FALLBACK_OPTIONS[actionType];
  return Array.isArray(list) ? list.map((o) => ({ ...o })) : [];
};

// --- Special option detection helpers ---
// Base44 entity record IDs are often auto-generated (e.g., 'rec_...'),
// so we detect special actions by optional stable keys *or* by copy/emoji.
const _norm = (v) => String(v ?? '').toLowerCase();

const _optionSearchText = (option) => _norm([
  option?.actionKey,
  option?.actionId,
  option?.action_id,
  option?.code,
  option?.slug,
  option?.key,
  option?.id,
  option?.title,
  option?.subtitle
].filter(Boolean).join(' '));

const _safeIncludes = (str, search) => {
  if (str === undefined || str === null) return false;
  return String(str).includes(search);
};

const _hasWord = (text, word) => {
  if (!text || !word) return false;
  try {
    return new RegExp(`\\b${word}\\b`, 'i').test(text);
  } catch {
    return false;
  }
};

const _isTravelOption = (option) => {
  // PRIORITY 1: Stable actionKey (preferred)
  if (option?.actionKey === 'travel') return true;
  
  // FALLBACK: Text/emoji detection (for legacy/missing data)
  const text = _optionSearchText(option);
  const emoji = String(option?.emoji || '');
  return (
    _hasWord(text, 'travel') ||
    _hasWord(text, 'trip') ||
    _hasWord(text, 'vacation') ||
    _hasWord(text, 'holiday') ||
    _safeIncludes(text, 'international') ||
    _safeIncludes(emoji, '✈') ||
    _safeIncludes(emoji, '🛂') ||
    _safeIncludes(emoji, '🛫') ||
    _safeIncludes(emoji, '🌍') ||
    _safeIncludes(emoji, '🌎') ||
    _safeIncludes(emoji, '🌏')
  );
};

const _isReadOption = (option) => {
  const text = _optionSearchText(option);
  const emoji = String(option?.emoji || '');
  return (
    _hasWord(text, 'read') ||
    _hasWord(text, 'reading') ||
    _hasWord(text, 'book') ||
    _hasWord(text, 'books') ||
    _safeIncludes(text, 'story time') ||
    _safeIncludes(text, 'storybook') ||
    _safeIncludes(text, 'bedtime story') ||
    _safeIncludes(emoji, '📚') ||
    _safeIncludes(emoji, '📖')
  );
};

const _isBoardGameOption = (option) => {
  const text = _optionSearchText(option);
  const emoji = String(option?.emoji || '');
  return (
    _safeIncludes(text, 'board game') ||
    _safeIncludes(text, 'boardgame') ||
    _safeIncludes(text, 'board games') ||
    _safeIncludes(emoji, '🎲') ||
    _safeIncludes(emoji, '🃏')
  );
};

const _isVideoGameOption = (option) => {
  // Keep the special co-op option as-is (it has its own bespoke copy).
  if (String(option?.id) === 'play_tablet_coop') return false;

  const text = _optionSearchText(option);
  const emoji = String(option?.emoji || '');
  return (
    _safeIncludes(text, 'video game') ||
    _safeIncludes(text, 'videogame') ||
    _safeIncludes(text, 'gaming') ||
    _safeIncludes(text, 'console') ||
    _safeIncludes(text, 'screen time') ||
    (_safeIncludes(emoji, '🎮') && (_safeIncludes(text, 'game') || _safeIncludes(text, 'play')))
  );
};

const _isArtTimeOption = (option) => {
  const text = _optionSearchText(option);
  const emoji = String(option?.emoji || '');
  return (
    _hasWord(text, 'art') ||
    _safeIncludes(text, 'arts & crafts') ||
    _safeIncludes(text, 'arts and crafts') ||
    _hasWord(text, 'draw') ||
    _hasWord(text, 'drawing') ||
    _hasWord(text, 'paint') ||
    _hasWord(text, 'painting') ||
    _hasWord(text, 'color') ||
    _hasWord(text, 'coloring') ||
    _hasWord(text, 'craft') ||
    _hasWord(text, 'crafts') ||
    _safeIncludes(emoji, '🎨') ||
    _safeIncludes(emoji, '🖍') ||
    _safeIncludes(emoji, '✏')
  );
};

const TRAVEL_MOMENTS = {
  "Japan": [
    { text: "They discover vending machines that sell everything from soup to tiny toys.\n\nThey spend 20 minutes pushing buttons like it's a science experiment.", tag: "curiosity", reactions: [
      { id: "encourage", emoji: "🎯", label: "Encourage the exploration", consequence: "You let them figure out the machine. They beam.", deltas: { intelligence: 1, confidence: 1 } },
      { id: "hurry", emoji: "⏰", label: "Hurry them along", consequence: "You rush them. The moment deflates.", deltas: {}, loveDelta: -1 },
      { id: "join", emoji: "🤝", label: "Join the experiment", consequence: "You push buttons together. Pure joy.", deltas: { empathy: 1 }, loveDelta: 1 },
      { id: "teach", emoji: "📚", label: "Explain how it works", consequence: "You turn it into a lesson. They listen... sort of.", deltas: { intelligence: 1 } }
    ]}
  ],
  "France": [
    { text: "They refuse to eat anything that isn't bread or chocolate.\n\nYou're in Paris. There are Michelin stars everywhere. They want pain au chocolat for every meal.", reactions: [
      { id: "negotiate", emoji: "🤝", label: "Negotiate one real meal", consequence: "They agree to try something. Small win.", deltas: { discipline: 1 } },
      { id: "cave", emoji: "🍞", label: "Let them eat bread", consequence: "You cave. They're thrilled. You're tired.", deltas: {}, loveDelta: 1, stressDelta: 1 },
      { id: "force", emoji: "⚡", label: "Force them to try new food", consequence: "You insist. It becomes a battle.", deltas: {}, loveDelta: -2, stressDelta: 2 },
      { id: "compromise", emoji: "🎯", label: "Find kid-friendly French food", consequence: "You find crêpes. Everyone wins.", deltas: { empathy: 1 }, loveDelta: 1 }
    ]}
  ],
  "Iceland": [
    { text: "They're convinced they saw an elf.\n\nYou're near a rock formation. They insist—absolutely insist—an elf just waved at them.", reactions: [
      { id: "believe", emoji: "✨", label: "Believe them", consequence: "You play along. Their face lights up.", deltas: { confidence: 1 }, loveDelta: 2 },
      { id: "dismiss", emoji: "🤷", label: "Dismiss it gently", consequence: "You rationalize. They deflate.", deltas: {}, loveDelta: -1 },
      { id: "explore", emoji: "🔍", label: "Go look for more elves", consequence: "You search together. Magic happens.", deltas: { empathy: 1, confidence: 1 }, loveDelta: 1 },
      { id: "educate", emoji: "📚", label: "Explain Icelandic folklore", consequence: "You turn it into a lesson. They zone out.", deltas: { intelligence: 1 } }
    ]}
  ]
};

export default function ActionModal({ open, actionType, onClose, onBriefcaseTriggered }) {
  const [options, setOptions] = useState([]);
  const [travelPickerOpen, setTravelPickerOpen] = useState(false);
  const [tripMomentOpen, setTripMomentOpen] = useState(false);
  const [pendingTrip, setPendingTrip] = useState(null);
  const [processingReaction, setProcessingReaction] = useState(false);
  const [missingActions, setMissingActions] = useState([]);
  const { gameState, applyDeltas, applyLove, applyStress, adjustedLoveGain, consumeAction, addLog, applyTechniqueBonusesForAction, spendMoney, pickFlavor, updateState, spendFocus, applyMoneyDelta, emitActionResult, recordTimelineEntry, BOND_ACTIVITY_PACK, PLAY_ACTIVITY_PACK, performActivity } = useGameState();

  const loadOptions = useCallback(async () => {
    let data = [];
    const missing = [];

    try {
      data = await base44.entities.ActionOptions.filter({ actionType });
      if (!Array.isArray(data)) data = [];
    } catch (error) {
      console.error('Failed to load action options from Base44:', error);
      data = [];
      missing.push('base44');
    }

    // Use new activity packs
    if (actionType === 'bond') {
    data = [...BOND_ACTIVITY_PACK];

    // Filter requiresItems
    data = data.filter(opt => {
      if (!opt.requiresItems || !Array.isArray(opt.requiresItems)) return true;
      return opt.requiresItems.every(itemId => hasShopItem(gameState, itemId));
    });

    // Add board games if owned (legacy support for item interaction)
    if (hasShopItem(gameState, 'boardGamesPack')) {
        data.push({
          id: 'bond_boardgame',
          group: 'Games & Challenges',
          actionType: 'bond',
          emoji: '🎲',
          title: 'Board game night (Collection)',
          subtitle: 'Structured play with rules.',
          deltas: { intelligence: 1, empathy: 1, discipline: 2, confidence: 0 },
          loveDelta: 2,
          stressDelta: 0,
          moneyCost: 0,
          logLine: "A board game night. They learn to take turns, lose gracefully, and flip the table."
        });
    }
    } else if (actionType === 'play') {
      data = [...PLAY_ACTIVITY_PACK];
      
      // Filter requiresItems
      data = data.filter(opt => {
        if (!opt.requiresItems || !Array.isArray(opt.requiresItems)) return true;
        return opt.requiresItems.every(itemId => hasShopItem(gameState, itemId));
      });
      
      // Add foam sword fight
      if (hasShopItem(gameState, 'toy_foamSwords')) {
        data.push({
          id: 'play-foam-sword-fight',
          menu: 'play',
          group: 'Physical Play',
          title: 'Sword Fight (Foam Swords)',
          subtitle: 'Living room arena. Dramatic slow-motion bonks. Zero injuries, maximum legend.',
          focusCost: 1,
          effects: {
            bond: 3,
            player: { stress: -1 },
            child: { happiness: 2, fitness: 1, confidence: 1 }
          },
          resultLines: [
            "You both grab foam swords and declare the living room a combat zone. The couch becomes cover. A lamp witnesses everything.",
            "Slow-motion bonks. Theatrical death scenes. You lose gracefully. They celebrate like they just won a championship.",
            "The battle rages for 12 glorious minutes. Someone bonks you mid-sentence. You allow it because it's hilarious."
          ]
        });
      }
      
      // GameSphere games
      if (hasShopItem(gameState, 'gamesphere_console') && hasShopItem(gameState, 'gamesphere_blockcraft1')) {
        data.push({
          id: 'play-gamesphere-blockcraft',
          menu: 'play',
          group: 'Games & Challenges',
          title: 'GameSphere: Blockcraft 1 (Co‑op Build)',
          subtitle: 'Build worlds together. Mine blocks. Argue over architecture.',
          focusCost: 1,
          effects: {
            bond: 2,
            player: { stress: -2 },
            child: { happiness: 2, creativity: 1, intelligence: 0.5, health: -1 }
          },
          resultLines: [
            "You build a house together. They add 47 secret tunnels. You pretend this was always the plan.",
            "Co-op building turns into architectural negotiations. You compromise on the roof. They win on everything else.",
            "Three hours pass. You've built a castle, a farm, and a surprisingly detailed llama stable. Bedtime is negotiable now."
          ]
        });
      }
      
      if (hasShopItem(gameState, 'gamesphere_console') && hasShopItem(gameState, 'gamesphere_galaxyRacers')) {
        data.push({
          id: 'play-gamesphere-galaxy',
          menu: 'play',
          group: 'Games & Challenges',
          title: 'GameSphere: Galaxy Racers (Best‑of‑3)',
          subtitle: 'Space racing showdown. Zero-gravity turns. Maximum trash talk.',
          focusCost: 1,
          effects: {
            bond: 2,
            player: { stress: -1 },
            child: { happiness: 2, confidence: 1.5 }
          },
          resultLines: [
            "Best-of-3 turns into best-of-7. You lose honorably. They celebrate with a victory lap around the couch.",
            "The racing is close. The trash talk is closer. You both laugh so hard you forget who won.",
            "One race ends in a photo finish. You review the replay three times. They're declared the winner by vibes alone."
          ]
        });
      }
      
      if (hasShopItem(gameState, 'gamesphere_console') && hasShopItem(gameState, 'gamesphere_dungeonDelvers')) {
        data.push({
          id: 'play-gamesphere-dungeon',
          menu: 'play',
          group: 'Games & Challenges',
          title: 'GameSphere: Dungeon Delvers (Quest Night)',
          subtitle: 'Strategic questing. Loot debates. "One more level" never means one.',
          focusCost: 1,
          effects: {
            bond: 2,
            player: { stress: -1 },
            child: { happiness: 2, intelligence: 1, discipline: 0.5 }
          },
          resultLines: [
            "Quest night becomes a campaign. You coordinate strategies. They betray you for a legendary sword. Respect.",
            "The dungeon is cleared. The loot is divided. Someone says 'one more level' and you both know it's a lie… but you go anyway.",
            "You play until you're both delirious. The final boss falls. You high-five like professionals."
          ]
        });
      }
      
      // Add item-based plays
      if (hasShopItem(gameState, 'piano')) {
          data.push({
            id: 'play_piano',
            group: 'Movement & Music',
            actionType: 'play',
            emoji: '🎹',
            title: 'Practice piano together',
            subtitle: 'Music education: structured fun.',
            deltas: { intelligence: 2, empathy: 0, discipline: 1, confidence: 1 },
            loveDelta: 1,
            stressDelta: hasShopItem(gameState, 'artApron') ? -0.1 : 0,
            moneyCost: 0,
            logLine: "Piano practice becomes a ritual. They learn rhythm… and patience."
          });
      }
      if (hasShopItem(gameState, 'tablet')) {
          data.push({
            id: 'play_tablet_coop',
            group: 'Games & Challenges',
            actionType: 'play',
            emoji: '🎮',
            title: 'Co‑op game night',
            subtitle: 'Screen time, but together.',
            deltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 1 },
            loveDelta: 2,
            stressDelta: 0,
            moneyCost: 0,
            logLine: "You play a co-op game together. They learn teamwork (and trash talk)."
          });
      }
    } else {
      // Fallback for other types if any
      data = getFallbackOptions(actionType);
    }

    // Travel is no longer a required action in Bond/Play menus
    // It's available via the Outings action elsewhere
    setMissingActions([]);
      

      
    setOptions(Array.isArray(data) ? data : []);
  }, [actionType, gameState]);

  useEffect(() => {
    if (open && actionType) {
      loadOptions();
    }
  }, [open, actionType, loadOptions]);

  // Removed unused isTravelOption function

  const handleSelectOption = async (option) => {
    // Activity-pack items (from newActivitiesPack) use {menu, effects, focusCost, moneyCost}.
    // They must be executed through performActivity to apply effects + emit ActionResult.
    const isPackActivity =
      option &&
      typeof option === 'object' &&
      (option.menu === 'play' || option.menu === 'bond') &&
      option.effects &&
      typeof option.effects === 'object';

    if (isPackActivity) {
      const ok = performActivity(option);
      if (ok) onClose();
      return;
    }

    // Check if this is travel - open picker instead
    if (_isTravelOption(option)) {
      // Prevent double-trigger
      if (gameState.travelPending) return;
      
      const source = actionType;
      const baseDeltas = option.deltas || {};
      const baseLoveDelta = option.loveDelta || 0;
      const baseStressDelta = option.stressDelta || 0;
      
      updateState({
        travelPending: true,
        pendingTravelContext: {
          source,
          baseDeltas,
          baseLoveDelta,
          baseStressDelta,
          focusCost: 1,
          moneyCost: 0, // Will be set by destination selection
          pricingType: PRICING.GLOBAL
        }
      });
      
      setTravelPickerOpen(true);
      return;
    }

    // 1. Spend focus
    if (!consumeAction(actionType)) {
      // Not enough focus
      return;
    }
    
    // Track for headliners (once per year)
    if (actionType === 'bond') {
      trackBondAction(gameState, updateState);
    } else if (actionType === 'play') {
      trackPlayAction(gameState, updateState);
    }

    // 2. Apply money cost if present
    let actualMoneyDelta = 0;
    if (option.moneyCost && option.moneyCost > 0) {
      spendMoney(option.moneyCost);
      actualMoneyDelta = -option.moneyCost;
      addLog(`💸 You spend $${formatMoney(option.moneyCost)}.`);
    }

    // 3. Apply stat deltas with technique bonuses + inventory bonuses
    const baseDeltas = option.deltas || {};
    const bonusDeltas = applyTechniqueBonusesForAction(actionType);
    let combined = combineDeltas(baseDeltas, bonusDeltas);
    
    // Add board games bonus if playing board games
    if (actionType === "play" && _isBoardGameOption(option) && hasShopItem(gameState, 'boardGamesPack')) {
      combined = combineDeltas(combined, { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 });
    }
    
    const sourceName = actionType === 'bond' ? 'Bond: ' : 'Play: ';
    applyDeltas(combined, sourceName + option.title);

    // 4. Apply love with stress adjustment
    let loveDelta = option.loveDelta || 0;
    if (loveDelta > 0) {
      loveDelta = adjustedLoveGain(loveDelta);
    }
    if (loveDelta !== 0) {
      applyLove(loveDelta, option.title);
    }

    // 5. Apply stress
    if (option.stressDelta !== 0) {
      applyStress(option.stressDelta, option.title);
    }

    // 6. Get flavor detail if applicable
    let timelineDetail = option.subtitle;
    let logText = option.logLine;
    
    // If logLine is missing but resultLines exists, pick one with seeded randomness
    if (!logText && Array.isArray(option.resultLines) && option.resultLines.length > 0) {
      const seed = `${gameState.runSeed || 'default'}_${option.id}_${gameState.currentYear}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash;
      }
      const index = Math.abs(hash) % option.resultLines.length;
      logText = option.resultLines[index];
      
      // For timeline, use 2 lines if available for richer detail
      if (option.resultLines.length >= 2) {
        const index2 = (index + 1) % option.resultLines.length;
        timelineDetail = `${option.resultLines[index]} ${option.resultLines[index2]}`;
      } else {
        timelineDetail = logText;
      }
    }
    
    // Generic fallback if both are missing
    if (!logText) {
      logText = "You spend time together and it leaves a small memory behind.";
      timelineDetail = logText;
    }
    
    if (actionType === "bond" && _isReadOption(option)) {
      const book = await pickFlavor("book", gameState.currentYear);
      if (book) {
        timelineDetail = `You read "${book.title}." ${book.punchline}`;
        logText = `📚 You read "${book.title}." ${book.punchline}`;
        
        // Add to bookshelf (avoid duplicates)
        const existing = gameState.bookshelf.find(b => b.title === book.title);
        if (!existing) {
          updateState({
            bookshelf: [...gameState.bookshelf, {
              age: gameState.currentYear,
              title: book.title,
              punchline: book.punchline
            }]
          });
        }
      }
    } else if (option.id === "play_games") {
      const game = await pickFlavor("video_game", gameState.currentYear);
      if (game) {
        timelineDetail = `You play ${game.title}. ${game.punchline}`;
        logText = `🎮 You play ${game.title}. ${game.punchline}`;
        
        // Add to game shelf (avoid duplicates)
        const existing = gameState.gameShelf.find(g => g.title === game.title);
        if (!existing) {
          updateState({
            gameShelf: [...gameState.gameShelf, {
              age: gameState.currentYear,
              title: game.title,
              punchline: game.punchline,
              kind: 'video_game'
            }]
          });
        }
      }
    } else if (option.id === "play_boardgames") {
      const bg = await pickFlavor("board_game", gameState.currentYear);
      if (bg) {
        timelineDetail = `You play ${bg.title}. ${bg.punchline}`;
        logText = `🎲 You play ${bg.title}. ${bg.punchline}`;
        
        // Add to game shelf (avoid duplicates)
        const existing = gameState.gameShelf.find(g => g.title === bg.title);
        if (!existing) {
          updateState({
            gameShelf: [...gameState.gameShelf, {
              age: gameState.currentYear,
              title: bg.title,
              punchline: bg.punchline,
              kind: 'board_game'
            }]
          });
        }
      }
    }

    // 7. Add log
    addLog(logText);

    // 8. Log technique bonuses if any
    const hasBonuses = Object.values(bonusDeltas).some(v => v !== 0);
    if (hasBonuses) {
      if (actionType === 'bond' && bonusDeltas.empathy > 0) {
        addLog("The conversation goes softer. You hear the need under the attitude.");
      } else if (actionType === 'bond' && bonusDeltas.discipline > 0) {
        addLog("They calm faster when you stay calm first.");
      } else if (actionType === 'play' && bonusDeltas.confidence > 0) {
        addLog("You catch them doing something right and it visibly lands.");
      }
    }

    // Log board games bonus if applicable
    if (actionType === "play" && _isBoardGameOption(option) && hasShopItem(gameState, 'boardGamesPack')) {
      addLog("The board games collection makes it better. (Bonus DIS +1)");
    }
    
    // Log tablet coop game if applicable
    if (option.id === "play_tablet_coop") {
      addLog("🎮 A co-op game session. They teach you the controls with zero patience.");
    }
    
    // Log board game night if applicable
    if (option.id === "bond_boardgame") {
      addLog("🎲 Board game night. Someone learns sportsmanship. Maybe.");
    }
    
    // Log jam session if applicable
    if (option.id === "play_jam_session") {
      addLog("🎸 Jam session. Notes clash, then connect. Everyone grins.");
    }

    // Compute biggest delta stat for feedback
    const biggestDeltaStat = Object.entries(combined)
      .filter(([_, v]) => v > 0)
      .sort(([_, a], [__, b]) => b - a)[0]?.[0] || null;

    // Add feedback with variety (content packs)
    const usedRecently = gameState.usedFeedbackLines || [];
    const feedback = pickFeedback(biggestDeltaStat, usedRecently);
    addLog(feedback);

    // Track used feedback for variety
    updateState({
      usedFeedbackLines: [...usedRecently, feedback].slice(-8)
    });

    emitActionResult({
      actionId: actionType,
      title: option.title,
      body: logText,
      deltas: combined,
      loveDelta: loveDelta,
      stressDelta: option.stressDelta,
      moneyDelta: actualMoneyDelta,
      focusDelta: -1,
      tags: [actionType, 'connect'],
      meta: {
        emoji: actionType === 'bond' ? '❤️' : '🎮',
        option: option.title,
        coachNote: option.coachNote || option.whyWorked,
        backfireNote: option.backfireNote || option.whyBackfired
      }
    });

    // Record Life Log entry for Bond/Play
    recordTimelineEntry({
      kind: actionType,
      title: `${option.emoji || (actionType === 'bond' ? '❤️' : '🎮')} ${option.title}`,
      detail: logText,
      deltas: combined,
      loveDelta: loveDelta,
      stressDelta: option.stressDelta,
      moneyDelta: actualMoneyDelta
    });

    // Check for briefcase trigger (park only, 3% chance)
    if (option.id === 'play_park' || (option.title && _safeIncludes(String(option.title).toLowerCase(), 'park'))) {
      const flags = gameState.flags || {};
      if (!flags.briefcaseChainComplete && !flags.briefcaseFound) {
        // 3% chance
        const seed = `${gameState.runSeed || 'default'}_briefcase_${gameState.currentYear}`;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
          hash = ((hash << 5) - hash) + seed.charCodeAt(i);
          hash = hash & hash;
        }
        const rng = Math.abs(hash) / 0x7fffffff;
        
        if (rng < 0.03) {
          // Trigger briefcase chain
          if (onBriefcaseTriggered) {
            onBriefcaseTriggered();
          }
        }
      }
    }

    // Close modal
    onClose();
  };

  const finalizeTravel = (destination) => {
    const ctx = gameState.pendingTravelContext;
    if (!ctx || !destination) {
      setTravelPickerOpen(false);
      updateState({ travelPending: false, pendingTravelContext: null });
      return;
    }

    // 1. Validate focus FIRST
    if (gameState.actionPoints < 1) {
      emitActionResult({
        title: "Not Enough Focus",
        body: "You need 1 Focus to travel. Take a moment to recharge first.",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['travel', 'blocked'],
        meta: { emoji: '✈️', blocked: true }
      });
      setTravelPickerOpen(false);
      updateState({ travelPending: false, pendingTravelContext: null });
      return;
    }

    // 2. Check for duplicate stamps in same age
    const existingStamp = (Array.isArray(gameState.passportStamps) ? gameState.passportStamps : []).find(
      s => s && s.age === gameState.currentYear && s.code === destination.code
    );
    if (existingStamp) {
      emitActionResult({
        title: "Already Visited",
        body: `You already visited ${destination.name} this year. Pick a different destination.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['travel', 'duplicate'],
        meta: { emoji: '✈️', duplicate: true }
      });
      // Keep travel picker open
      return;
    }

    // 3. Spend focus (preserves burnout tax)
    if (!spendFocus(1, "Travel")) {
      return;
    }

    // 4. Track for headliners (once per year)
    if (ctx.source === 'bond') {
      trackBondAction(gameState, updateState);
    } else if (ctx.source === 'play') {
      trackPlayAction(gameState, updateState);
    }

    // 5. Apply money cost
    // For travel, cost is per destination.
    const travelCost = Number(destination?.baseCost || 0);
    applyMoneyDelta(-travelCost, { allowCreditMessage: true });
    
    // Note: We use the specific destination cost, NOT the context default
    // because travel costs vary by destination now.

    // 6. Apply base stat deltas + technique bonuses
    const bonusDeltas = applyTechniqueBonusesForAction(ctx.source);
    const combinedDeltas = combineDeltas(ctx.baseDeltas || {}, bonusDeltas || {});
    applyDeltas(combinedDeltas, "Travel");

    // 7. Apply love/stress
    let baseLoveDelta = ctx.baseLoveDelta || 0;
    if (baseLoveDelta > 0) {
      baseLoveDelta = adjustedLoveGain(baseLoveDelta);
    }
    if (baseLoveDelta !== 0) {
      applyLove(baseLoveDelta, "Travel");
    }

    if (ctx.baseStressDelta !== 0) {
      applyStress(ctx.baseStressDelta, "Travel");
    }

    // --- LANGUAGE COMFORT BONUS ---
    // Check if parent knows the local language
    const spoken = getSpokenLanguagesForCountry(destination.code);
    const langBonus = getParentLanguageComfortBonus(gameState, spoken);

    if (langBonus.stressDelta < 0) {
      applyStress(langBonus.stressDelta, 'Language comfort');

      const pointsText = langBonus.bestProgress >= 3
        ? 'Your language skill makes everything feel effortless.'
        : 'Even a little language goes a long way.';

      toast(
        `Because of your language skill, you’re able to get around so easily.\n\n${pointsText}${
          langBonus.bestLanguage ? ` (${langBonus.bestLanguage} level ${langBonus.bestProgress})` : ''
        }`,
        { icon: '🗺️', duration: 4200, position: 'top-center' }
      );
      
      // Log it too
      addLog(`🗺️ Travel felt easier thanks to your language skills (${langBonus.bestLanguage || 'language'}). Stress ${langBonus.stressDelta}.`);
    }

    // 8. Pick memory + souvenir
    const memory = destination.memories[Math.floor(Math.random() * destination.memories.length)];
    const souvenir = Math.random() < 0.5 && destination.souvenirs.length > 0
      ? destination.souvenirs[Math.floor(Math.random() * destination.souvenirs.length)]
      : null;

    // 9. Create passport stamp
    const stampId = `stamp_${gameState.currentYear}_${destination.code}_${Date.now()}`;
    const newStamp = {
      id: stampId,
      age: gameState.currentYear,
      code: destination.code,
      name: destination.name,
      flagEmoji: destination.flagEmoji,
      landmarkEmoji: destination.emoji,
      emoji: destination.emoji,
      memory: memory,
      souvenir: souvenir
    };

    // 10. Mark action as used
    updateState(prev => ({
      passportStamps: [...(Array.isArray(prev.passportStamps) ? prev.passportStamps : []), newStamp],
      lastTravelDestination: {
        code: destination.code,
        name: destination.name,
        flagEmoji: destination.flagEmoji,
        landmarkEmoji: destination.emoji,
        emoji: destination.emoji
      },
      actionsUsed: {
        ...(prev.actionsUsed || {}),
        [ctx.source]: true
      },
      actionUsageCounts: {
        ...(prev.actionUsageCounts || {}),
        [ctx.source]: (prev.actionUsageCounts?.[ctx.source] || 0) + 1
      }
    }));

    // 11. Determine if we show airport scenario or destination moment (international trips only)
    const airportScenario = selectAirportScenario(gameState.runSeed, gameState.currentYear, destination.code);
    
    let moment;
    let isAirportScenario = false;
    
    if (airportScenario) {
      // Airport scenario replaces the normal destination moment
      isAirportScenario = true;
      const formattedSetup = formatAirportScenarioText(
        airportScenario.setup,
        gameState.childName,
        destination.name,
        destination.flagEmoji
      );
      
      moment = {
        text: formattedSetup,
        reactions: airportScenario.choices.map(choice => ({
          id: choice.id,
          emoji: choice.emoji,
          label: choice.text,
          consequence: choice.resultLine || choice.text,
          deltas: choice.deltas || {},
          loveDelta: choice.loveDelta || 0,
          stressDelta: choice.stressDelta || 0,
          moneyDelta: choice.moneyDelta || 0
        })),
        isAirport: true,
        airportTitle: airportScenario.title,
        airportId: airportScenario.id,
        airportBase: airportScenario.base || {}
      };
      
      // Apply airport base effects immediately (e.g., +5 stress from forbidden joke)
      if (airportScenario.base) {
        if (airportScenario.base.stressDelta) {
          applyStress(airportScenario.base.stressDelta, "Airport");
        }
        if (airportScenario.base.loveDelta) {
          applyLove(airportScenario.base.loveDelta, "Airport");
        }
        if (airportScenario.base.moneyDelta) {
          applyMoneyDelta(airportScenario.base.moneyDelta);
        }
        if (airportScenario.base.deltas) {
          applyDeltas(airportScenario.base.deltas, "Airport");
        }
      }
    } else {
      // Normal destination moment
      const moments = TRAVEL_MOMENTS[destination.name];
      moment = moments && moments.length > 0
        ? moments[Math.floor(Math.random() * moments.length)]
        : {
            text: memory,
            reactions: [
              { id: "smile", emoji: "😊", label: "Smile and enjoy it", consequence: "You soak it in.", deltas: {}, loveDelta: 1 },
              { id: "photo", emoji: "📸", label: "Take a photo", consequence: "You capture the moment.", deltas: { intelligence: 0 } },
              { id: "talk", emoji: "💬", label: "Talk about it", consequence: "You share the experience.", deltas: { empathy: 1 }, loveDelta: 1 },
              { id: "hurry", emoji: "⏰", label: "Move on quickly", consequence: "You rush past it.", deltas: {}, stressDelta: 1 }
            ]
          };
    }

    // 12. Store pending trip data and open trip moment modal
    setPendingTrip({
      destination,
      moment,
      memory,
      souvenir,
      combinedDeltas,
      baseLoveDelta,
      baseStressDelta: ctx.baseStressDelta,
      moneyCost: ctx.moneyCost,
      isAirportScenario,
      airportTitle: moment.airportTitle,
      airportId: moment.airportId
    });
    setTravelPickerOpen(false);
    setTripMomentOpen(true);
  };

  const handleTripReaction = (reaction) => {
    if (processingReaction || !pendingTrip) return;
    setProcessingReaction(true);

    const { destination, moment, memory, souvenir, combinedDeltas, baseLoveDelta, baseStressDelta, moneyCost, isAirportScenario, airportTitle, airportId } = pendingTrip;

    // Apply reaction deltas
    const reactionDeltas = reaction.deltas || {};
    const reactionLoveDelta = reaction.loveDelta || 0;
    const reactionStressDelta = reaction.stressDelta || 0;
    const reactionMoneyDelta = reaction.moneyDelta || 0;

    if (Object.values(reactionDeltas).some(v => v !== 0)) {
      applyDeltas(reactionDeltas, isAirportScenario ? "Airport Reaction" : "Trip Reaction");
    }
    if (reactionLoveDelta !== 0) {
      applyLove(reactionLoveDelta, isAirportScenario ? "Airport Reaction" : "Trip Reaction");
    }
    if (reactionStressDelta !== 0) {
      applyStress(reactionStressDelta, isAirportScenario ? "Airport Reaction" : "Trip Reaction");
    }
    if (reactionMoneyDelta !== 0) {
      applyMoneyDelta(reactionMoneyDelta);
    }

    // Queue quirk follow-up if moment has a tag
    if (moment.tag && gameState.currentYear < 18) {
      updateState({
        activeTravelQuirkTag: moment.tag,
        activeTravelQuirkUntilAge: gameState.currentYear + 3
      });
    }

    // Combine all deltas for result display
    const totalDeltas = combineDeltas(combinedDeltas, reactionDeltas);
    const totalLoveDelta = baseLoveDelta + reactionLoveDelta;
    const totalStressDelta = baseStressDelta + reactionStressDelta;

    // Build result body
    const souvenirText = souvenir ? ` (Souvenir: ${souvenir})` : '';
    let resultBody;
    
    if (isAirportScenario) {
      // Airport scenario: show memory/souvenir + airport moment
      resultBody = `${memory}${souvenirText}\n\n🛄 Airport moment: ${airportTitle} — ${reaction.consequence}`;
    } else {
      // Normal destination moment
      resultBody = `${memory}${souvenirText}\n\n${moment.text}\n\nYou chose: ${reaction.label}\n${reaction.consequence}`;
    }

    // Emit combined result
    // Recalculate cost based on destination (since moneyCost in context might be 0/default)
    const travelCost = Number(destination?.baseCost || 0);
    const totalMoneyDelta = -travelCost + reactionMoneyDelta;
    
    emitActionResult({
      actionId: 'travel',
      title: `Trip to ${destination.name}`,
      body: resultBody,
      deltas: totalDeltas,
      loveDelta: totalLoveDelta,
      stressDelta: totalStressDelta,
      moneyDelta: totalMoneyDelta,
      focusDelta: -1,
      tags: ['travel', 'experience', isAirportScenario ? 'airport' : 'moment'],
      meta: { 
        emoji: '✈️', 
        destination: destination.name, 
        souvenir, 
        passport: true, 
        reaction: reaction.id,
        airportScenarioId: isAirportScenario ? airportId : null,
        airportScenarioTitle: isAirportScenario ? airportTitle : null
      }
    });

    // Record Life Log entry for Travel
    recordTimelineEntry({
      kind: 'travel',
      title: `✈️ Trip to ${destination.name}`,
      detail: resultBody,
      deltas: totalDeltas,
      loveDelta: totalLoveDelta,
      stressDelta: totalStressDelta,
      moneyDelta: totalMoneyDelta,
      meta: {
        destinationCode: destination.code,
        destinationName: destination.name,
        souvenir,
        reactionId: reaction.id
      }
    });

    // Cleanup
    setTripMomentOpen(false);
    setPendingTrip(null);
    updateState({ travelPending: false, pendingTravelContext: null });
    onClose();

    setTimeout(() => setProcessingReaction(false), 300);
  };

  const title = actionType === 'bond' ? 'Bond — Choose a way' : 'Play — Choose a way';
  const isStorybook = typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook';
  const coverId = actionType === 'bond' ? 'relationships' : 'play';
  const headerSrc = isStorybook ? (getSectionCoverFilename(coverId) || null) : null;

  // Block body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

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
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className={`w-full max-w-lg my-8 flex flex-col max-h-[85vh] ${isStorybook ? 'rt-modal-surface rt-popup--storybook rt-paper-elev' : 'bg-white rounded-2xl shadow-2xl'}`}>
              {/* Header */}
              {isStorybook ? (
                <div className="relative w-full h-[160px] flex-shrink-0">
                  <div className="SBModalIllustrationFrame absolute inset-3 rounded-[14px] overflow-hidden">
                    <SafeStorybookImage src={headerSrc} alt="" className="SBImageEl w-full h-full" imgStyle={{ objectFit: 'cover' }} fallbackVariant="banner" />
                  </div>
                  <div className="absolute left-4 right-4 bottom-4 pointer-events-none">
                    <div className="SBPanel px-3 py-2 rounded-md">
                      <div className="SBHeaderTitle">{title}</div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              )}

              {/* Options List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {/* At Home Section (owned items) */}
                {options.some(o => ['play_piano', 'play_tablet_coop', 'bond_boardgame'].includes(o.id)) && (
                  <>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      At Home
                    </h4>
                    <div className="space-y-3 mb-6">
                      {options.filter(o => ['play_piano', 'play_tablet_coop', 'bond_boardgame'].includes(o.id)).map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelectOption(option)}
                          className="w-full text-left p-5 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 hover:bg-emerald-100/50 transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-3xl flex-shrink-0">{option.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 mb-1 text-base">{option.title}</div>
                              <div className="text-sm text-slate-600 leading-relaxed">{option.subtitle}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                
                {/* Grouped Options */}
                {Object.entries(options.reduce((acc, opt) => {
                  const g = opt.group || 'General';
                  if (!acc[g]) acc[g] = [];
                  acc[g].push(opt);
                  return acc;
                }, {})).map(([group, groupOptions]) => (
                  <div key={group} className="mb-6">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">{group}</h4>
                    <div className="space-y-3">
                      {groupOptions.sort((a,b) => (a.rank||999) - (b.rank||999)).map((option) => (
                        <button
                          key={option.id}
                          data-tour={actionType === 'bond' ? `bond-option-${option.id}` : undefined}
                          onClick={() => handleSelectOption(option)}
                          className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-start gap-4">
                            {option.emoji && <span className="text-3xl flex-shrink-0">{option.emoji}</span>}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div className="font-semibold text-slate-800 mb-1 text-base">{option.title}</div>
                                <div className="flex flex-col items-end gap-1">
                                  {option.moneyCost > 0 && (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                      ${formatMoney(option.moneyCost)}
                                    </span>
                                  )}
                                  {option.moneyGain > 0 && (
                                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                      +${formatMoney(option.moneyGain)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-sm text-slate-600 leading-relaxed">{option.subtitle}</div>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {option.focusCost > 1 && (
                                  <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                    {option.focusCost} Focus
                                  </span>
                                )}
                                {option.minAge > 0 && (
                                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    Age {option.minAge}+
                                  </span>
                                )}
                                {option.requiresItems?.map(item => (
                                  <span key={item} className="text-[10px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                                    Req: {item.replace(/_/g, ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Travel Destination Picker */}
          <TravelDestinationModal
            open={travelPickerOpen}
            onClose={() => {
              setTravelPickerOpen(false);
              updateState({ travelPending: false, pendingTravelContext: null });
            }}
            onSelectDestination={finalizeTravel}
          />

          {/* Trip Moment Scenario */}
          <TravelTripScenarioModal
            open={tripMomentOpen}
            destination={pendingTrip?.destination}
            moment={pendingTrip?.moment}
            onChoose={handleTripReaction}
            disabled={processingReaction}
          />
        </>
      )}
    </AnimatePresence>
  );
}