export const SHOP_CATEGORIES = [
  { id: 'toy', label: 'Toys', emoji: '🧸' },
  { id: 'book', label: 'Books', emoji: '📚' },
  { id: 'learning', label: 'Learning', emoji: '🧠' },
  { id: 'gear', label: 'Gear', emoji: '🎒' },
  { id: 'robots', label: 'Robots', emoji: '🤖' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'home', label: 'Home', emoji: '🛋️' },
  { id: 'fitness', label: 'Fitness', emoji: '🏋️' },
  { id: 'hobby', label: 'Hobbies', emoji: '🎨' },
  { id: 'food', label: 'Food', emoji: '☕' },
  { id: 'defense', label: 'Survival', emoji: '🛡️' },
  { id: 'absurd', label: 'Absurd', emoji: '🦄' },
  { id: 'vehicle', label: 'Vehicles', emoji: '🚗' },
  { id: 'electronics', label: 'Tech', emoji: '📱' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🪩' },
  { id: 'luxury', label: 'Luxury (Mostly Fake)', emoji: '⌚' }
];

export const SHOP_ITEMS = [
  // Toys
  { id: 'toy_blocks', name: 'Building Blocks', category: 'toy', emoji: '🧱', cost: 25, lifespanYears: 6, description: 'Classic wooden blocks for creativity.', immediate: { deltas: { intelligence: 1 } } },
  { id: 'toy_doll', name: 'Comfort Doll', category: 'toy', emoji: '🎎', cost: 30, lifespanYears: 5, description: 'A soft friend for emotional support.', immediate: { deltas: { empathy: 1 }, stressDelta: -5 } },
  { id: 'toy_puzzle', name: 'Jigsaw Puzzle', category: 'toy', emoji: '🧩', cost: 18, lifespanYears: 4, description: 'Quiet focus in a box.', immediate: { deltas: { intelligence: 0.7, discipline: 0.4 } } },
  { id: 'toy_stuffed_animal', name: 'Stuffed Animal', category: 'toy', emoji: '🧸', cost: 22, lifespanYears: 6, description: 'Emotional support, premium edition.', immediate: { deltas: { empathy: 0.7 }, stressDelta: -2 } },
  { id: 'toy_board_game', name: 'Board Game', category: 'toy', emoji: '🎲', cost: 35, lifespanYears: 8, description: 'Fun, strategy, and mild chaos.', immediate: { deltas: { social: 0.6, happiness: 0.6 } } },
  { id: 'toy_art_kit', name: 'Art Kit', category: 'toy', emoji: '🖍️', cost: 25, lifespanYears: 3, description: 'Creativity, unleashed.', immediate: { deltas: { creativity: 0.8, happiness: 0.3 } } },
  { id: 'toy_science_slime', name: 'Slime Science Kit', category: 'toy', emoji: '🧫', cost: 15, lifespanYears: 1, description: 'A learning experience… and a cleanup experience.', immediate: { deltas: { curiosity: 0.7, creativity: 0.4 } } },
  { id: 'toy_sports_set', name: 'Sports Set', category: 'toy', emoji: '🏀', cost: 20, lifespanYears: 4, description: 'Run, jump, feel unstoppable.', immediate: { deltas: { fitness: 0.6, confidence: 0.4 } } },
  
  // Books
  { id: 'book_animals', name: 'Picture Book', category: 'book', emoji: '🦁', cost: 15, lifespanYears: 8, description: 'Bright pictures of animals.', immediate: { deltas: { intelligence: 1 } } },
  { id: 'book_space', name: 'Space Atlas', category: 'book', emoji: '🪐', cost: 40, lifespanYears: 12, description: 'A journey to the stars.', immediate: { deltas: { intelligence: 2 } } },
  { id: 'book_fairytales', name: 'Fairy Tale Collection', category: 'book', emoji: '📖', cost: 25, lifespanYears: 12, description: 'Classic stories, timeless vibes.', immediate: { deltas: { empathy: 0.6, happiness: 0.4 } } },
  { id: 'book_early_readers', name: 'Early Reader Set', category: 'book', emoji: '🔤', cost: 30, lifespanYears: 8, description: 'Short stories that build momentum.', immediate: { deltas: { intelligence: 0.8, discipline: 0.4 } } },
  { id: 'book_comic_bundle', name: 'Comic Bundle', category: 'book', emoji: '🗯️', cost: 20, lifespanYears: 6, description: 'Reading… but fun and dramatic.', immediate: { deltas: { happiness: 0.6, creativity: 0.4 } } },
  { id: 'book_math_puzzles', name: 'Math Puzzle Book', category: 'book', emoji: '➗', cost: 18, lifespanYears: 6, description: 'Brain reps. Quiet flex.', immediate: { deltas: { intelligence: 0.9, discipline: 0.3 } } },
  { id: 'book_mindfulness_journal', name: 'Mindfulness Journal', category: 'book', emoji: '📝', cost: 20, lifespanYears: 3, description: 'Thoughts, organized gently.', immediate: { deltas: { discipline: 0.4 }, stressDelta: -0.3 } },
  { id: 'book_cooking_basics', name: 'Cooking Basics Book', category: 'book', emoji: '🍳', cost: 28, lifespanYears: 8, description: 'Food skills = life skills.', immediate: { deltas: { health: 0.4, discipline: 0.2, happiness: 0.2 } } },
  { id: 'book_money_playbook', name: 'Money Playbook', category: 'book', emoji: '💸', cost: 35, lifespanYears: 10, description: 'Budgeting, but make it survivable.', immediate: { deltas: { intelligence: 0.5, discipline: 0.5 } } },
  { id: 'book_relationship_guide', name: 'Relationship Guide', category: 'book', emoji: '💞', cost: 30, lifespanYears: 8, description: 'Better communication. Fewer spirals.', immediate: { deltas: { empathy: 0.5, social: 0.4 } } },

  // Gear
  { id: 'gear_backpack', name: 'Cool Backpack', category: 'gear', emoji: '🎒', cost: 45, lifespanYears: 4, description: 'Carries books and confidence.', immediate: { deltas: { confidence: 1 } } },
  { id: 'gear_hiking_boots', name: 'Hiking Boots', category: 'gear', emoji: '🥾', cost: 120, lifespanYears: 6, description: 'Comfort for long walks and big plans.', immediate: { deltas: { fitness: 0.4, confidence: 0.4 } } },
  { id: 'gear_sleeping_bag', name: 'Sleeping Bag', category: 'gear', emoji: '🛌', cost: 80, lifespanYears: 6, description: 'Sleep outdoors like you mean it.', immediate: { deltas: { health: 0.2 }, stressDelta: -0.2 } },
  { id: 'gear_storage_bins', name: 'Storage Bins (Too Many)', category: 'gear', emoji: '📦', cost: 60, lifespanYears: 7, description: 'Organized chaos is still organized.', immediate: { deltas: { discipline: 0.4 }, stressDelta: -0.1 } },
  { id: 'gear_travel_luggage', name: 'Luggage Set', category: 'gear', emoji: '🧳', cost: 140, lifespanYears: 10, description: 'Travel-ready, emotionally and physically.', immediate: { deltas: { confidence: 0.3 } } },
  { id: 'gear_baby_monitor', name: 'Baby Monitor', category: 'gear', emoji: '📟', cost: 90, lifespanYears: 5, benefitsRequireMinorChild: true, description: 'Peace of mind (most nights).', immediate: { deltas: {}, stressDelta: -0.3 } },
  { id: 'gear_stroller', name: 'Stroller', category: 'gear', emoji: '👶', cost: 180, lifespanYears: 6, benefitsRequireMinorChild: true, description: 'Makes outings possible again.', immediate: { deltas: {}, stressDelta: -0.2 } },
  
  // Homes
  { id: 'home_starter', name: 'Starter Apartment', category: 'gear', emoji: '🏢', cost: 150000, lifespanYears: null, uniqueGroup: 'home', description: 'Small but yours. Appreciates 1% yearly.', immediate: { deltas: { confidence: 2 } } },
  { id: 'home_family', name: 'Family House', category: 'gear', emoji: '🏡', cost: 350000, lifespanYears: null, uniqueGroup: 'home', description: 'Space to grow. Appreciates 1% yearly.', immediate: { deltas: { confidence: 3, empathy: 1 } } },
  { id: 'home_estate', name: 'Dream Estate', category: 'gear', emoji: '🏰', cost: 800000, lifespanYears: null, uniqueGroup: 'home', description: 'A legacy property. Appreciates 1% yearly.', immediate: { deltas: { confidence: 5, intelligence: 1 } } },

  // Vehicles
  { id: 'vehicle_tricycle', name: 'Tricycle', category: 'vehicle', emoji: '🚲', cost: 80, lifespanYears: 5, uniqueGroup: 'bike', description: 'Three wheels of freedom.', immediate: { deltas: { confidence: 2, discipline: 1 } } },
  { id: 'vehicle_bicycle', name: 'Bicycle', category: 'vehicle', emoji: '🚴', cost: 150, lifespanYears: 8, uniqueGroup: 'bike', tradeInRate: 0.5, description: 'Two wheels, no training wheels.', immediate: { deltas: { confidence: 3, discipline: 2 } } },

  // Tech
  { id: 'tech_tablet', name: 'Learning Tablet', category: 'electronics', emoji: '📱', cost: 200, lifespanYears: 4, description: 'Educational games included.', immediate: { deltas: { intelligence: 2 } } },
  { id: 'tech_laptop', name: 'Laptop', category: 'electronics', emoji: '💻', cost: 1200, lifespanYears: 5, pricing: 'global', description: 'Essential for school and work.', immediate: { deltas: { intelligence: 2 } } },
  { id: 'tech_phone', name: 'Smartphone', category: 'electronics', emoji: '📱', cost: 800, lifespanYears: 3, pricing: 'global', description: 'Communication hub.', immediate: { deltas: { confidence: 1 } } },

  // Vehicles (Global Pricing)
  { id: 'usedCar', name: 'Used Car', category: 'vehicle', emoji: '🚗', cost: 5000, lifespanYears: 10, pricing: 'global', uniqueGroup: 'car', description: 'Reliable enough.', immediate: { deltas: { confidence: 1 } }, passivePerAge: { moneyDelta: -500, stressDelta: -1 } },
  { id: 'newCar', name: 'New Sedan', category: 'vehicle', emoji: '🚙', cost: 25000, lifespanYears: 12, pricing: 'global', uniqueGroup: 'car', description: 'Safe and shiny.', immediate: { deltas: { confidence: 2 } }, passivePerAge: { moneyDelta: -500, stressDelta: -2 } },
  { id: 'motorcycle', name: 'Motorcycle', category: 'vehicle', emoji: '🏍️', cost: 8000, lifespanYears: 15, pricing: 'global', uniqueGroup: 'motorcycle', description: 'Fast and fun.', immediate: { deltas: { confidence: 3 } }, passivePerAge: { moneyDelta: -200, stressDelta: -1 } },

  // Fame/Status Vehicles
  { id: 'vehicle_luxurySuv', name: 'Luxury SUV', category: 'vehicle', emoji: '🛻', cost: 60000, lifespanYears: 10, pricing: 'global', uniqueGroup: 'car', description: 'Subtle power move.', immediate: { deltas: { confidence: 2, social: 1 } }, passivePerAge: { moneyDelta: -1200, deltas: { social: 0.5, confidence: 0.2 } } },
  { id: 'vehicle_sportscar', name: 'Sports Car', category: 'vehicle', emoji: '🏎️', cost: 120000, lifespanYears: 8, pricing: 'global', uniqueGroup: 'car', description: 'Fast. Loud. Worth it.', immediate: { deltas: { confidence: 3, social: 1.5 } }, passivePerAge: { moneyDelta: -2000, deltas: { social: 0.8, confidence: 0.3 } } },
  { id: 'vehicle_supercar', name: 'Supercar', category: 'vehicle', emoji: '🏎️', cost: 350000, lifespanYears: 12, pricing: 'global', uniqueGroup: 'car', description: 'Status incarnate.', immediate: { deltas: { confidence: 4, social: 2 } }, passivePerAge: { moneyDelta: -3500, deltas: { social: 1.2, confidence: 0.5 } } },
  { id: 'vehicle_celeb_van', name: 'Celebrity Shuttle Van', category: 'vehicle', emoji: '🚐', cost: 85000, lifespanYears: 7, pricing: 'global', uniqueGroup: 'car', description: 'Tour in style (with friends).', immediate: { deltas: { confidence: 2, social: 2 } }, passivePerAge: { moneyDelta: -1500, deltas: { social: 1.0, confidence: 0.2 } } },

  // Fashion
  { id: 'fashion_capsuleWardrobe', name: 'Capsule Wardrobe (20 outfits)', category: 'fashion', emoji: '👚', cost: 1500, lifespanYears: 4, description: 'A glow-up in bulk.', immediate: { deltas: { confidence: 2, social: 1, happiness: 1 }, stressDelta: -0.5 } },
  { id: 'fashion_powerSuitSet', name: 'Power Suit Set (3 suits)', category: 'fashion', emoji: '🤵', cost: 1600, lifespanYears: 5, description: 'Dress like you mean it.', immediate: { deltas: { confidence: 2, discipline: 1, social: 0.4 } } },
  { id: 'fashion_sneakers', name: 'Sneaker Upgrade', category: 'fashion', emoji: '👟', cost: 180, lifespanYears: 3, description: 'Walk tall. Walk comfy.', immediate: { deltas: { confidence: 1, fitness: 0.5 } } },
  { id: 'fashion_babyClothes', name: 'Baby Clothes Bundle', category: 'fashion', emoji: '🍼', cost: 250, lifespanYears: 2, benefitsRequireMinorChild: true, description: 'Tiny clothes. Big adorable.', immediate: { deltas: { happiness: 1, health: 0.4 } } },

  // Beauty
  { id: 'beauty_makeupKit', name: 'Makeup Kit', category: 'beauty', emoji: '💄', cost: 120, lifespanYears: 2, description: 'Confidence in a bag.', immediate: { deltas: { confidence: 1, social: 0.5 }, stressDelta: -0.3 } },
  { id: 'beauty_skincare', name: 'Skincare Routine Set', category: 'beauty', emoji: '🧴', cost: 90, lifespanYears: 2, description: 'Glow quietly. Win loudly.', immediate: { deltas: { health: 0.5, confidence: 0.5 }, stressDelta: -0.2 },
    useSpec: {
      label: 'Skincare Reset',
      focusCost: 1,
      stressDelta: -0.5,
      deltas: { health: 0.1 },
      title: '🧴 Skincare Reset',
      body: 'You moisturize like your enemies are watching. Your future self sends a thank-you note.'
    }
  },
  { id: 'beauty_hairRefresh', name: 'Hair Refresh Package', category: 'beauty', emoji: '💇', cost: 150, lifespanYears: 1, description: 'New year, new vibe.', immediate: { deltas: { confidence: 1, happiness: 0.4 } } },
  { id: 'beauty_beardKit', name: 'Beard Grooming Kit', category: 'beauty', emoji: '🧔', cost: 80, lifespanYears: 2, description: 'Precision. Respect.', immediate: { deltas: { confidence: 0.6, discipline: 0.3 } } },
  { id: 'beauty_fragrance', name: 'Fragrance Set', category: 'beauty', emoji: '🧪', cost: 110, lifespanYears: 3, description: 'Smell like a plot twist.', immediate: { deltas: { social: 0.5, confidence: 0.4 }, partnerMeterDelta: 1 } },

  // Home Upgrades (require owned home)
  { id: 'home_upg_solar', name: 'Solar Panel Array', category: 'home', emoji: '☀️', cost: 18000, lifespanYears: 25, uniqueGroup: 'home_upgrade_solar', tradeInRate: 0.2, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'Lower bills. Higher smugness.', immediate: { deltas: { confidence: 0.4 }, stressDelta: -0.1 }, passivePerAge: { moneyDelta: 900, stressDelta: -0.15 },
    useSpec: {
      label: 'Check Energy App',
      focusCost: 0,
      skipTimeline: true,
      title: '☀️ Solar Dashboard',
      body: 'Your meter spins backward. Your ego spins forward.'
    }
  },
  { id: 'home_upg_battery', name: 'Home Battery Backup', category: 'home', emoji: '🔋', cost: 11000, lifespanYears: 15, uniqueGroup: 'home_upgrade_battery', tradeInRate: 0.15, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'Power stays on. Panic stays off.', immediate: { deltas: { confidence: 0.2 }, stressDelta: -0.08 }, passivePerAge: { moneyDelta: 250, stressDelta: -0.10 } },
  { id: 'home_upg_thermostat', name: 'Smart Thermostat', category: 'home', emoji: '🌡️', cost: 280, lifespanYears: 8, uniqueGroup: 'home_upgrade_thermostat', tradeInRate: 0.1, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'Comfort, optimized.', immediate: { deltas: { discipline: 0.2 } }, passivePerAge: { moneyDelta: 70, stressDelta: -0.05 } },
  { id: 'home_upg_insulation', name: 'Insulation + Air Sealing', category: 'home', emoji: '🧱', cost: 3500, lifespanYears: 20, uniqueGroup: 'home_upgrade_insulation', tradeInRate: 0.2, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'Stops drafts and excuses.', immediate: { deltas: { discipline: 0.2 }, stressDelta: -0.05 }, passivePerAge: { moneyDelta: 220, stressDelta: -0.07 } },
  { id: 'home_upg_heatpump', name: 'Heat Pump HVAC Retrofit', category: 'home', emoji: '♨️', cost: 9500, lifespanYears: 15, uniqueGroup: 'home_upgrade_heatpump', tradeInRate: 0.2, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'Efficient climate control. Fewer "WHY IS IT LIKE THIS" moments.', immediate: { deltas: { health: 0.2 }, stressDelta: -0.08 }, passivePerAge: { moneyDelta: 480, stressDelta: -0.08 } },
  { id: 'home_upg_leak_sensors', name: 'Leak Sensors + Auto Shutoff', category: 'home', emoji: '💧', cost: 450, lifespanYears: 10, uniqueGroup: 'home_upgrade_leaks', tradeInRate: 0.15, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'Catches leaks before they become stories.', immediate: { deltas: { discipline: 0.2 } }, passivePerAge: { moneyDelta: 90, stressDelta: -0.04 } },
  { id: 'home_upg_water_filter', name: 'Whole-Home Water Filter', category: 'home', emoji: '🚰', cost: 1200, lifespanYears: 8, uniqueGroup: 'home_upgrade_waterfilter', tradeInRate: 0.15, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'Better water, better vibes.', immediate: { deltas: { health: 0.3 }, stressDelta: -0.03 } },
  { id: 'home_upg_security', name: 'Smart Security System', category: 'home', emoji: '🔒', cost: 900, lifespanYears: 8, uniqueGroup: 'home_upgrade_security', tradeInRate: 0.1, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'You feel safer. Your packages feel watched.', immediate: { deltas: { confidence: 0.4 }, stressDelta: -0.06 }, passivePerAge: { moneyDelta: -120, stressDelta: -0.10 } },
  { id: 'home_upg_soundproof', name: 'Soundproofing Package', category: 'home', emoji: '🔇', cost: 2800, lifespanYears: 20, uniqueGroup: 'home_upgrade_soundproof', tradeInRate: 0.2, requiresOwnedUniqueGroup: 'home', requiresHousingId: 'owned_home', description: 'Silence you can finally hear.', immediate: { deltas: { happiness: 0.2 }, stressDelta: -0.08 }, passivePerAge: { moneyDelta: 0, stressDelta: -0.15 } },

  // Home
  { id: 'home_weightedBlanket', name: 'Weighted Blanket', category: 'home', emoji: '🛌', cost: 90, lifespanYears: 5, description: 'Instant calm (mostly).', immediate: { deltas: { health: 0.2 }, stressDelta: -0.6 } },
  { id: 'home_headphones', name: 'Noise-Canceling Headphones', category: 'home', emoji: '🎧', cost: 250, lifespanYears: 5, description: 'The world is loud. Not anymore.', immediate: { deltas: { confidence: 0.4 }, stressDelta: -0.2 },
    useSpec: {
      label: 'Silence Mode',
      focusCost: 0,
      skipTimeline: true,
      title: '🎧 Silence Mode',
      body: 'You put them on. The chaos fades. You can finally hear... your own thoughts. Immediately regret that.'
    }
  },
  { id: 'home_hotTub', name: 'Ridiculous Inflatable Hot Tub', category: 'home', emoji: '🛁', cost: 500, lifespanYears: 3, description: 'Questionable decisions. Great bubbles.', immediate: { deltas: { happiness: 0.6 }, stressDelta: -0.4 },
    useSpec: (gameState) => ({
      label: 'Hot Tub Reset',
      focusCost: 1,
      stressDelta: -0.8,
      deltas: { happiness: 0.3 },
      partnerMeterDelta: gameState.householdType === 'two' ? 2 : 0,
      friendMeterDelta: 1,
      title: '🛁 Hot Tub Reset',
      body: 'You sink into bubbling bliss. For a moment, your problems cannot swim.'
    })
  },
  { id: 'home_espresso', name: 'Espresso Machine', category: 'home', emoji: '☕', cost: 250, lifespanYears: 7, description: 'Caffeinated stability.', immediate: { deltas: { happiness: 0.3 } }, passivePerAge: { moneyDelta: -60, stressDelta: -0.3 } },
  { id: 'home_mattress', name: 'Fancy Mattress', category: 'home', emoji: '🛏️', cost: 800, lifespanYears: 10, description: 'Sleep like you are rich.', immediate: { deltas: { health: 0.5 } }, passivePerAge: { stressDelta: -0.6 } },
  { id: 'home_standingDesk', name: 'Standing Desk', category: 'home', emoji: '🧍', cost: 300, lifespanYears: 10, description: 'Posture + productivity.', immediate: { deltas: { health: 0.5, discipline: 0.3 } } },
  { id: 'home_plants', name: 'Houseplant Jungle', category: 'home', emoji: '🪴', cost: 70, lifespanYears: 3, description: 'Photosynthesis therapy.', immediate: { deltas: { happiness: 0.4 }, stressDelta: -0.2 } },

  // Fitness
  { id: 'fitness_yogaKit', name: 'Yoga Kit', category: 'fitness', emoji: '🧘', cost: 45, lifespanYears: 3, description: 'Stretch your stress out.', immediate: { deltas: { fitness: 0.4, health: 0.2 }, stressDelta: -0.2 } },
  { id: 'fitness_dumbbells', name: 'Dumbbell Set', category: 'fitness', emoji: '🏋️', cost: 150, lifespanYears: 8, description: 'Simple. Effective. Heavy.', immediate: { deltas: { fitness: 0.6, health: 0.4 } } },
  { id: 'fitness_treadmill', name: 'Treadmill', category: 'fitness', emoji: '🏃', cost: 900, lifespanYears: 10, description: 'Run from problems indoors.', immediate: { deltas: { fitness: 1, health: 0.7 }, stressDelta: -0.1 } },
  { id: 'fitness_boxingBag', name: 'Boxing Bag', category: 'fitness', emoji: '🥊', cost: 180, lifespanYears: 7, description: 'Therapy with gloves.', immediate: { deltas: { fitness: 0.5, confidence: 0.3 }, stressDelta: -0.3 } },

  // Hobbies
  { id: 'hobby_guitar', name: 'Guitar', category: 'hobby', emoji: '🎸', cost: 350, lifespanYears: 8, description: 'Three chords, infinite feelings.', immediate: { deltas: { creativity: 1, happiness: 0.5 } },
    useSpec: {
      label: 'Play Guitar',
      focusCost: 1,
      stressDelta: -0.6,
      deltas: { creativity: 0.2, happiness: 0.2 },
      title: '🎸 Guitar Session',
      body: 'You strum confidently... until you realize you\'ve invented a new genre: "sad cowboy jazz." Somehow it slaps.'
    }
  },
  { id: 'hobby_karaoke', name: 'Karaoke Machine', category: 'hobby', emoji: '🎤', cost: 220, lifespanYears: 5, description: 'For people who fear silence.', immediate: { deltas: { happiness: 0.4, social: 0.2 } },
    useSpec: (gameState) => ({
      label: 'Karaoke Night',
      focusCost: 1,
      stressDelta: -0.7,
      deltas: { happiness: 0.3, social: 0.2 },
      partnerMeterDelta: gameState.householdType === 'two' ? 2 : 0,
      friendMeterDelta: 2,
      title: '🎤 Karaoke Night',
      body: 'You sing like nobody\'s judging you. (They are. But respectfully.)'
    })
  },
  { id: 'hobby_camera', name: 'Camera', category: 'hobby', emoji: '📷', cost: 600, lifespanYears: 6, description: 'Capture memories (and angles).', immediate: { deltas: { creativity: 0.7, knowledge: 0.6 } } },
  { id: 'hobby_artSupplies', name: 'Art Supplies Haul', category: 'hobby', emoji: '🎨', cost: 120, lifespanYears: 2, description: 'Paint your stress away.', immediate: { deltas: { creativity: 0.6 }, stressDelta: -0.3 } },
  { id: 'hobby_console', name: 'Gaming Console', category: 'hobby', emoji: '🎮', cost: 500, lifespanYears: 6, description: 'Joy. Chaos. Loading screens.', immediate: { deltas: { happiness: 0.7, social: 0.4 }, stressDelta: -0.2 } },
  { id: 'hobby_3dPrinter', name: '3D Printer', category: 'hobby', emoji: '🖨️', cost: 900, lifespanYears: 6, description: 'Invent problems. Print solutions.', immediate: { deltas: { intelligence: 0.7, creativity: 0.7 } } },
  { id: 'hobby_toolkit', name: 'DIY Toolkit', category: 'hobby', emoji: '🧰', cost: 200, lifespanYears: 10, description: 'Fix stuff. Feel capable.', immediate: { deltas: { confidence: 0.6, discipline: 0.3 } } },

  // Food
  { id: 'food_mealPrep', name: 'Meal Prep Kit', category: 'food', emoji: '🥗', cost: 110, lifespanYears: 1, description: 'Convenience with vitamins.', immediate: { deltas: { health: 0.5, discipline: 0.3 }, stressDelta: -0.1 } },
  { id: 'food_spiceRack', name: 'Spice Rack Upgrade', category: 'food', emoji: '🧂', cost: 70, lifespanYears: 5, description: 'Flavor = happiness.', immediate: { deltas: { happiness: 0.4, social: 0.2 } } },
  { id: 'food_chocolate', name: 'Chocolate Stash', category: 'food', emoji: '🍫', cost: 40, lifespanYears: 1, description: 'Morale boost.', immediate: { deltas: { happiness: 0.4 }, stressDelta: -0.2 } },
  { id: 'food_waterFilter', name: 'Water Filter', category: 'food', emoji: '💧', cost: 100, lifespanYears: 5, description: 'Hydration, upgraded.', immediate: { deltas: { health: 0.4 } } },

  // Learning
  { id: 'learn_steam_project_kit', name: 'STEAM Project Kit', category: 'learning', emoji: '🧪', cost: 55, lifespanYears: 2, description: 'Build something cool and accidentally learn a lot.', immediate: { deltas: { intelligence: 1, creativity: 1 } }, stressDelta: -0.2,
    useSpec: {
      label: 'Build a Project',
      focusCost: 1,
      stressDelta: -0.5,
      deltas: { intelligence: 0.2, creativity: 0.2 },
      title: '🧪 STEAM Project Time',
      body: 'You start a "simple" project. Three hours later you\'ve built a masterpiece… and also invented a new category of mess. Still: worth it.'
    }
  },
  { id: 'learn_language_course', name: 'Language Course Subscription', category: 'learning', emoji: '🗣️', cost: 250, lifespanYears: 2, description: 'Your brain gets stronger. Your accent gets braver.', immediate: { deltas: { intelligence: 0.6, social: 0.3 } } },
  { id: 'learn_skill_course_bundle', name: 'Skill Course Bundle', category: 'learning', emoji: '🎓', cost: 350, lifespanYears: 3, description: 'A structured way to level up.', immediate: { deltas: { intelligence: 0.8, discipline: 0.4 } } },

  // Robots
  { id: 'robots_roomba', name: 'Robot Vacuum', category: 'robots', emoji: '🤖', cost: 350, lifespanYears: 6, description: 'Less mess. Less stress.', immediate: { deltas: { discipline: 0.2 } }, passivePerAge: { moneyDelta: -40, stressDelta: -0.4 },
    useSpec: {
      label: 'Run Vacuum Bot',
      focusCost: 0,
      skipTimeline: true,
      title: '🤖 Vacuum Bot Run',
      body: 'The robot begins its patrol. It immediately eats a shoelace and declares victory anyway.'
    }
  },
  { id: 'robots_laundryFolder', name: 'Laundry Folding Robot', category: 'robots', emoji: '🧺', cost: 12000, lifespanYears: 10, description: 'It folds clothes. It also judges you silently.', immediate: { deltas: { discipline: 0.4 } }, passivePerAge: { moneyDelta: -400, stressDelta: -0.6 },
    useSpec: {
      label: 'Do Laundry',
      focusCost: 0,
      skipTimeline: true,
      title: '🧺 Laundry Robot',
      body: 'You press one button. The robot does 4 loads of laundry. Unfortunately it mixes reds and whites. Congratulations: your socks are now pink and emotionally secure.'
    }
  },
  { id: 'robots_butler', name: 'Home Butler Robot (Limited)', category: 'robots', emoji: '🦾', cost: 25000, lifespanYears: 12, description: 'It helps. It side-eyes you. Fair.', immediate: { deltas: { confidence: 0.3 } }, passivePerAge: { moneyDelta: -800, stressDelta: -0.8 },
    useSpec: {
      label: 'Delegate Chores',
      focusCost: 0,
      skipTimeline: true,
      title: '🦾 Delegated Chores',
      body: 'You ask the robot to handle chores. It completes everything perfectly... then rotates its head 3 degrees like it\'s disappointed in your life choices.'
    }
  },

  // Survival (country/scenario-specific)
  { id: 'def_firstAid', name: 'First Aid Kit', category: 'defense', emoji: '🩹', cost: 60, lifespanYears: 3, description: 'Prepared is calmer. Reduces stress during natural disasters.', immediate: { deltas: { health: 0.6, confidence: 0.2 } }, disasterPrep: true },
  { id: 'def_campingKit', name: 'Camping Survival Kit', category: 'defense', emoji: '🧭', cost: 180, lifespanYears: 6, description: 'Useful in normal life… or not normal life.', immediate: { deltas: { confidence: 0.5, discipline: 0.3 } } },
  { id: 'def_flashlight', name: 'High-Power Flashlight', category: 'defense', emoji: '🔦', cost: 35, lifespanYears: 6, description: 'Prepared feels calmer. Reduces stress during natural disasters.', immediate: { deltas: { confidence: 0.2 } }, disasterPrep: true },
  { id: 'def_radio', name: 'Emergency Radio', category: 'defense', emoji: '📻', cost: 50, lifespanYears: 6, description: 'Information reduces panic (usually). Reduces stress during disasters.', immediate: { deltas: { confidence: 0.3 } }, disasterPrep: true },
  { id: 'def_fire_ext', name: 'Fire Extinguisher', category: 'defense', emoji: '🧯', cost: 40, lifespanYears: 8, description: 'You hope you never need it. Reduces cost during fire-related disasters.', immediate: { deltas: { confidence: 0.2 } }, disasterPrep: true },
  { id: 'def_water_pack', name: 'Water Jugs Pack', category: 'defense', emoji: '🚰', cost: 25, lifespanYears: 2, description: 'Hydration, but tactical. Reduces stress during heat/drought disasters.', immediate: { deltas: { health: 0.2 } }, disasterPrep: true },
  { id: 'def_go_bag', name: 'Go-Bag Backpack', category: 'defense', emoji: '🎒', cost: 85, lifespanYears: 5, description: 'A calm plan in a bag. Reduces cost and stress during all natural disasters.', immediate: { deltas: { confidence: 0.4, discipline: 0.2 } }, disasterPrep: true },
  { id: 'def_generator', name: 'Portable Generator', category: 'defense', emoji: '⚡', cost: 700, lifespanYears: 10, description: 'Lights stay on. Stress stays lower. Reduces cost/stress during power-outage disasters.', immediate: { deltas: { confidence: 0.6 } }, passivePerAge: { moneyDelta: -60, stressDelta: -0.1 }, disasterPrep: true },
  { id: 'def_sidearm', name: 'Sidearm (Fictional)', category: 'defense', emoji: '🛡️', cost: 700, lifespanYears: 10, availability: { countries: ['USA'], scenarios: ['zombie_apocalypse', 'alien_invasion'] }, description: 'For extreme scenarios (in-game).', immediate: { deltas: { confidence: 1 } },
    useSpec: (gameState) => {
      const ss = String(gameState.specialStartId || '');
      if (ss === 'zombie_apocalypse') {
        return {
          label: 'Zombie Patrol',
          focusCost: 1,
          stressDelta: -0.4,
          deltas: { confidence: 0.2 },
          zombieTrainingDelta: 3,
          title: '🧟 Zombie Patrol',
          body: 'You patrol the streets. The only thing more relentless than the zombies is your determination (and your dramatic music playlist).'
        };
      }
      if (ss === 'alien_invasion') {
        return {
          label: 'Alien Watch',
          focusCost: 1,
          stressDelta: -0.4,
          deltas: { confidence: 0.2 },
          alienThreatDelta: -1,
          title: '👽 Alien Watch',
          body: 'You scan the skies with heroic focus. You spot… a weather balloon. Still, you feel extremely prepared.'
        };
      }
      return {
        label: 'Range Time',
        focusCost: 1,
        stressDelta: -0.3,
        deltas: { confidence: 0.1 },
        title: '🎯 Range Time',
        body: 'You spend time at a supervised range. The target is paper. Your ego somehow still gets humbled.'
      };
    }
  },
  { id: 'def_rifle', name: 'Rifle (Fictional)', category: 'defense', emoji: '🎯', cost: 1200, lifespanYears: 12, availability: { countries: ['USA'], scenarios: ['zombie_apocalypse', 'alien_invasion'] }, description: 'Serious gear for serious fiction.', immediate: { deltas: { confidence: 1.5 } },
    useSpec: (gameState) => {
      const ss = String(gameState.specialStartId || '');
      if (ss === 'zombie_apocalypse') {
        return {
          label: 'Zombie Drill',
          focusCost: 1,
          stressDelta: -0.5,
          deltas: { confidence: 0.2 },
          zombieTrainingDelta: 4,
          title: '🧟 Zombie Drill',
          body: 'You do a tactical drill. Mostly you just sprint heroically and trip over a curb. Still counts.'
        };
      }
      if (ss === 'alien_invasion') {
        return {
          label: 'Perimeter Check',
          focusCost: 1,
          stressDelta: -0.5,
          deltas: { confidence: 0.2 },
          alienThreatDelta: -2,
          title: '👽 Perimeter Check',
          body: 'You check the perimeter. You find a suspicious footprint. It\'s yours. From earlier.'
        };
      }
      return {
        label: 'Range Time',
        focusCost: 1,
        stressDelta: -0.4,
        deltas: { confidence: 0.1 },
        title: '🎯 Range Time',
        body: 'You practice calmly. You leave feeling steadier, and somehow slightly more humble.'
      };
    }
  },
  { id: 'def_tank', name: 'Tank (Somehow)', category: 'defense', emoji: '🚜', cost: 2000000, lifespanYears: 25, availability: { countries: ['USA'], scenarios: ['zombie_apocalypse', 'alien_invasion'] }, description: 'Absurd. Expensive. Loud.', immediate: { deltas: { confidence: 5 } }, passivePerAge: { moneyDelta: -5000, stressDelta: -1 },
    useSpec: {
      label: 'Take It For a Spin',
      focusCost: 0,
      skipTimeline: true,
      title: '🚜 Tank (Somehow)',
      body: 'You start it up. The ground vibrates. A bird files a noise complaint. You feel wildly overqualified for normal life.'
    }
  },

  // Absurd
  { id: 'abs_unicorn', name: 'Giant Inflatable Unicorn', category: 'absurd', emoji: '🦄', cost: 120, lifespanYears: 3, description: 'You have lost your mind. Great!', immediate: { deltas: { happiness: 1, creativity: 0.4 } },
    useSpec: {
      label: 'Deploy Unicorn',
      focusCost: 0,
      skipTimeline: true,
      title: '🦄 Unicorn Deployed',
      body: 'You inflate it. It takes 7 minutes and 12% of your dignity. The neighbors clap anyway.'
    }
  },
  { id: 'abs_bubbles', name: 'Bubble Machine', category: 'absurd', emoji: '🫧', cost: 80, lifespanYears: 2, description: 'Why? Because bubbles.', immediate: { deltas: { happiness: 0.7, social: 0.3 } } },
  { id: 'abs_rubber_duck', name: 'Giant Rubber Duck', category: 'absurd', emoji: '🦆', cost: 150, lifespanYears: 4, description: 'It brings joy. It brings questions.', immediate: { deltas: { happiness: 0.8, social: 0.2 } } },
  { id: 'abs_confetti', name: 'Confetti Cannon', category: 'absurd', emoji: '🎉', cost: 60, lifespanYears: 1, description: 'Instant celebration. Later consequences.', immediate: { deltas: { happiness: 0.5, social: 0.3 } } },
  { id: 'abs_disco_ball', name: 'Disco Ball', category: 'absurd', emoji: '🪩', cost: 120, lifespanYears: 6, description: 'Your ceiling now has a personality.', immediate: { deltas: { happiness: 0.4, social: 0.3 } } },
  { id: 'abs_pet_rock', name: 'Pet Rock', category: 'absurd', emoji: '🪨', cost: 15, lifespanYears: 20, description: 'Low maintenance. Deep bond.', immediate: { deltas: { happiness: 0.2 } } },
  { id: 'abs_hat_collection', name: 'Novelty Hat Collection', category: 'absurd', emoji: '🎩', cost: 90, lifespanYears: 4, description: 'Confidence via questionable accessories.', immediate: { deltas: { confidence: 0.3, social: 0.2 } } },
  { id: 'abs_goat_statue', name: 'Screaming Goat Statue', category: 'absurd', emoji: '🐐', cost: 75, lifespanYears: 8, description: 'It screams. You relate.', immediate: { deltas: { creativity: 0.3, happiness: 0.3 } } },

  // Nightlife (Consumables)
  { id: 'nightlife_cigarettes_carton', name: 'Carton of Cigarettes', category: 'nightlife', emoji: '🚬', cost: 500, lifespanYears: 1, consumable: true, description: 'Fast relief. Slow consequences.',
    useSpec: {
      label: 'Smoke',
      focusCost: 1,
      stressDelta: -5,
      title: '🚬 Smoke Break',
      body: "You step outside for a smoke. For a few minutes, the world is quiet.\n\nIt's not a great long-term plan... but it *is* a plan. Your nervous system takes the first exit it can find.\n\nYou go back inside smelling like weather and decisions."
    }
  },
  { id: 'nightlife_wine_bottle', name: 'Bottle of Wine', category: 'nightlife', emoji: '🍷', cost: 120, lifespanYears: 1, consumable: true, description: 'The edge softens. Your standards do too.',
    useSpec: {
      label: 'Drink',
      focusCost: 1,
      stressDelta: -5,
      loveDelta: -1,
      title: '🍷 A Drink',
      body: "You pour a drink. The edge softens. Your shoulders drop.\n\nIt helps in the short term. In the long term... it makes you a little less available.\n\nYou consider texting someone. You don't. Growth."
    }
  },
  { id: 'nightlife_beer_case', name: 'Case of Beer', category: 'nightlife', emoji: '🍺', cost: 90, lifespanYears: 1, consumable: true, description: 'A temporary friendship with carbonation.',
    useSpec: {
      label: 'Drink',
      focusCost: 1,
      stressDelta: -5,
      loveDelta: -1,
      title: '🍺 Beer Break',
      body: "You crack one open. The world gets slightly funnier.\n\nShort-term relief: ✅  Long-term wisdom: ⚠️\n\nYou wake up tomorrow wondering who let you become a philosopher at midnight."
    }
  },

  // New Vehicles (Real Status Cars)
  { id: 'vehicle_influencer_convertible', name: 'Influencer Convertible', category: 'vehicle', emoji: '🚗', cost: 65000, lifespanYears: 10, pricing: 'global', uniqueGroup: 'car', description: "Wind in your hair. Everyone else's opinions in your comments.", immediate: { deltas: { confidence: 2, social: 1 } },
    useSpec: {
      label: 'Pull Up Dramatically',
      focusCost: 1,
      stressDelta: -0.4,
      fameDelta: 12,
      deltas: { confidence: 0.2, social: 0.2 },
      title: '🚗 Influencer Convertible',
      body: "You drive with the top down. A camera appears out of nowhere. You pretend you're \"casual.\" You are not."
    }
  },
  { id: 'vehicle_celebrity_suv', name: 'Celebrity SUV', category: 'vehicle', emoji: '🚙', cost: 120000, lifespanYears: 10, pricing: 'global', uniqueGroup: 'car', description: 'Tinted windows. Big aura.', immediate: { deltas: { confidence: 3, social: 1.5 } },
    useSpec: {
      label: 'Arrive Mysteriously',
      focusCost: 1,
      stressDelta: -0.3,
      fameDelta: 15,
      deltas: { confidence: 0.3, social: 0.2 },
      title: '🚙 Celebrity SUV',
      body: "You roll up like you have a secret. You do. It's just snacks. But still: powerful."
    }
  },
  { id: 'vehicle_exec_electric_sedan', name: 'Executive Electric Sedan', category: 'vehicle', emoji: '🚘', cost: 85000, lifespanYears: 10, pricing: 'global', uniqueGroup: 'car', description: 'Quiet ride. Loud success.', immediate: { deltas: { confidence: 2, social: 1 } },
    useSpec: {
      label: 'Executive Drive',
      focusCost: 1,
      stressDelta: -0.4,
      fameDelta: 8,
      deltas: { discipline: 0.2, confidence: 0.2 },
      title: '🚘 Executive Drive',
      body: "You glide through traffic like a calm person. You are not calm. But the car is, and it's contagious."
    }
  },
  { id: 'vehicle_track_day_monster', name: 'Track-Day Monster', category: 'vehicle', emoji: '🏎️', cost: 150000, lifespanYears: 8, pricing: 'global', uniqueGroup: 'car', description: 'Fast, loud, and emotionally irresponsible.', immediate: { deltas: { confidence: 4, social: 2 } },
    useSpec: {
      label: 'Track Day',
      focusCost: 1,
      stressDelta: -0.7,
      fameDelta: 18,
      deltas: { confidence: 0.4 },
      title: '🏎️ Track Day',
      body: 'You take it to the track. Your brain stops buffering. For once, all your thoughts are just "VROOM."'
    }
  },
  { id: 'vehicle_party_bus', name: 'Party Bus', category: 'vehicle', emoji: '🚌', cost: 75000, lifespanYears: 7, pricing: 'global', uniqueGroup: 'car', description: 'Your commute becomes an event.', immediate: { deltas: { confidence: 2, social: 2 } },
    useSpec: {
      label: 'Host a Ride',
      focusCost: 1,
      stressDelta: -0.5,
      fameDelta: 14,
      deltas: { social: 0.4, happiness: 0.3 },
      title: '🚌 Party Bus Energy',
      body: "You give people a ride. Someone says, \"This is iconic.\" Someone else spills something immediately. Balance."
    }
  },

  // RVs (live in them, unlock RV Trips)
  { id: 'vehicle_camper_van', name: 'Camper Van', category: 'vehicle', emoji: '🚐', cost: 60000, lifespanYears: null, pricing: 'global', uniqueGroup: 'rv', tradeInRate: 0.55, description: 'A tiny home on wheels. Unlocks RV Trips in Outdoor & Travel.', immediate: { deltas: { confidence: 1, happiness: 1 } } },
  { id: 'vehicle_rv', name: 'RV', category: 'vehicle', emoji: '🚍', cost: 120000, lifespanYears: null, pricing: 'global', uniqueGroup: 'rv', tradeInRate: 0.55, description: 'More space, more comfort. Unlocks better RV Trips.', immediate: { deltas: { confidence: 2, happiness: 1, discipline: 1 } } },
  { id: 'vehicle_grand_rv', name: 'Grand RV', category: 'vehicle', emoji: '🚌', cost: 250000, lifespanYears: null, pricing: 'global', uniqueGroup: 'rv', tradeInRate: 0.55, description: 'A rolling luxury apartment. Big comfort. Big trips.', immediate: { deltas: { confidence: 3, happiness: 2 } } },
  
  // REAL LUXURY (expensive, safe)
  { id: 'lux_real_chronometer', name: 'Luxury Chronometer Watch', category: 'luxury', emoji: '⌚', cost: 12000, lifespanYears: 10,
    description: 'Quiet luxury. Loud confidence.',
    immediate: { deltas: { confidence: 0.6, social: 0.4 }, fameDelta: 15 },
    luxuryTier: 'real',
    useSpec: {
      label: 'Show It Off',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 5,
      deltas: { confidence: 0.2, social: 0.1 },
      title: '⌚ Luxury Watch',
      body: 'You check the time with the calm of someone whose calendar is *managed.* Nobody asked… but everyone noticed.'
    }
  },

  { id: 'lux_real_designer_bag', name: 'Luxury Leather Bag', category: 'luxury', emoji: '👜', cost: 9000, lifespanYears: 8,
    description: 'Leather, stitching, and a suspicious amount of confidence.',
    immediate: { deltas: { confidence: 0.5, social: 0.4 }, fameDelta: 12 },
    luxuryTier: 'real',
    useSpec: {
      label: 'Carry It Like It\'s Art',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 4,
      deltas: { confidence: 0.2, social: 0.1 },
      title: '👜 Luxury Bag',
      body: 'You carry it gently, like it has feelings. People give you space. The bag is now the main character.'
    }
  },

  { id: 'lux_real_sunglasses', name: 'Luxury Sunglasses', category: 'luxury', emoji: '🕶️', cost: 1200, lifespanYears: 6,
    description: 'Blocks sunlight and low standards.',
    immediate: { deltas: { confidence: 0.4 }, fameDelta: 6 },
    luxuryTier: 'real',
    useSpec: {
      label: 'Put On Shades',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 2,
      deltas: { confidence: 0.1 },
      title: '🕶️ Luxury Shades',
      body: 'You put them on indoors. Objectively questionable. Subjectively powerful.'
    }
  },

  { id: 'lux_real_platinum_ring', name: 'Platinum Ring', category: 'luxury', emoji: '💍', cost: 6500, lifespanYears: 12,
    description: 'Subtle shine. Serious vibe.',
    immediate: { deltas: { confidence: 0.4, social: 0.3 }, fameDelta: 8 },
    luxuryTier: 'real',
    useSpec: {
      label: 'Show It Off',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 2,
      deltas: { confidence: 0.1, social: 0.1 },
      title: '💍 Platinum Ring',
      body: 'You adjust it casually. The sparkle is quiet. The confidence is not.'
    }
  },

  { id: 'lux_real_diamond_ring', name: 'Diamond Ring', category: 'luxury', emoji: '💎', cost: 16000, lifespanYears: 15,
    description: 'It\'s not subtle. That\'s the point.',
    immediate: { deltas: { confidence: 0.6, social: 0.4 }, fameDelta: 14 },
    luxuryTier: 'real',
    useSpec: {
      label: 'Show It Off',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 3,
      deltas: { confidence: 0.2, social: 0.1 },
      title: '💎 Diamond Ring',
      body: 'Someone says "wow." You say "thanks" like this happens every day now.'
    }
  },

  // FAKE LUXURY (cheaper, risky)
  { id: 'lux_fake_flashy_watch', name: 'Gold-Plated Watch (Questionable)', category: 'luxury', emoji: '⌚', cost: 250, lifespanYears: 4,
    description: 'Tells time and small lies.',
    immediate: { deltas: { confidence: 0.2, social: 0.15 }, fameDelta: 4 },
    luxuryTier: 'fake',
    exposureBaseChance: 0.18,
    useSpec: {
      label: 'Show It Off',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 2,
      deltas: { confidence: 0.05, social: 0.05 },
      title: '⌚ Gold-Plated Watch',
      body: 'You casually adjust your sleeve so your wrist gets maximum screen time. Subtle? Not even remotely.'
    }
  },

  { id: 'lux_fake_logo_belt', name: 'Logo Belt (Questionable)', category: 'luxury', emoji: '🧷', cost: 120, lifespanYears: 3,
    description: 'Holds pants. Raises eyebrows.',
    immediate: { deltas: { confidence: 0.15, social: 0.1 }, fameDelta: 3 },
    luxuryTier: 'fake',
    exposureBaseChance: 0.22,
    useSpec: {
      label: 'Outfit Check',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 2,
      deltas: { confidence: 0.05 },
      title: '🧷 Logo Belt',
      body: 'You post a mirror selfie. The belt steals the spotlight. It also steals… credibility.'
    }
  },

  { id: 'lux_fake_bag', name: 'Luxury-Style Bag (Questionable)', category: 'luxury', emoji: '👜', cost: 180, lifespanYears: 3,
    description: 'Luxury vibes. Budget reality.',
    immediate: { deltas: { confidence: 0.15, social: 0.1 }, fameDelta: 3 },
    luxuryTier: 'fake',
    exposureBaseChance: 0.20,
    useSpec: {
      label: 'Flex Gently',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 2,
      deltas: { social: 0.05 },
      title: '👜 Luxury-Style Bag',
      body: 'You carry it like it\'s fragile and expensive. It is fragile. It is… not expensive.'
    }
  },

  { id: 'lux_fake_shades', name: 'Runway Shades (Questionable)', category: 'luxury', emoji: '🕶️', cost: 90, lifespanYears: 2,
    description: 'Blocks sunlight and accountability.',
    immediate: { deltas: { confidence: 0.12 }, fameDelta: 2 },
    luxuryTier: 'fake',
    exposureBaseChance: 0.16,
    useSpec: {
      label: 'Put On Shades',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 1,
      deltas: { confidence: 0.04 },
      title: '🕶️ Runway Shades',
      body: 'You put them on and instantly feel like you could ignore emails professionally.'
    }
  },

  { id: 'lux_fake_sparkle_ring', name: 'Sparkle Ring (Questionable)', category: 'luxury', emoji: '💍', cost: 60, lifespanYears: 3,
    description: 'It sparkles… enthusiastically.',
    immediate: { deltas: { confidence: 0.12, social: 0.08 }, fameDelta: 2 },
    luxuryTier: 'fake',
    exposureBaseChance: 0.25,
    useSpec: {
      label: 'Show It Off',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 1,
      deltas: { confidence: 0.05 },
      title: '💍 Sparkle Ring',
      body: 'You flash it briefly. The sparkle is loud. The confidence is louder.'
    }
  },

  { id: 'lux_fake_gold_ring', name: 'Gold-Tone Ring (Questionable)', category: 'luxury', emoji: '✨', cost: 120, lifespanYears: 4,
    description: 'Gold-tone. Bold-tone.',
    immediate: { deltas: { confidence: 0.15, social: 0.1 }, fameDelta: 3 },
    luxuryTier: 'fake',
    exposureBaseChance: 0.22,
    useSpec: {
      label: 'Show It Off',
      focusCost: 0,
      skipTimeline: true,
      fameDelta: 1,
      deltas: { confidence: 0.05 },
      title: '✨ Gold-Tone Ring',
      body: 'You gesture a lot during conversation. Your hands are now doing PR.'
    }
  },

  // Fake / Replica Cars
  { id: 'vehicle_lambo_ish', name: 'Kit Supercar (Replica)', category: 'vehicle', emoji: '🏎️', cost: 25000, lifespanYears: 8, pricing: 'global', uniqueGroup: 'car', description: 'Looks expensive from 40 feet away. Perfect.', immediate: { deltas: { confidence: 1.5, social: 0.5 } },
    luxuryTier: 'fake',
    exposureBaseChance: 0.15,
    useSpec: {
      label: 'Show Off (Carefully)',
      focusCost: 1,
      stressDelta: -0.2,
      fameDelta: 7,
      deltas: { confidence: 0.1, social: 0.1 },
      title: '🏎️ Kit Supercar',
      body: 'You pull up and everyone stares. Then the door squeaks like a haunted house. Still: applause.'
    }
  },
  { id: 'vehicle_gwagon_ish', name: 'Boxy Luxury SUV (Replica)', category: 'vehicle', emoji: '🚙', cost: 30000, lifespanYears: 8, pricing: 'global', uniqueGroup: 'car', description: 'Boxy confidence. Budget reality.', immediate: { deltas: { confidence: 1.5, social: 0.5 } },
    luxuryTier: 'fake',
    exposureBaseChance: 0.15,
    useSpec: {
      label: 'Roll Up',
      focusCost: 1,
      stressDelta: -0.2,
      fameDelta: 7,
      deltas: { confidence: 0.1, social: 0.1 },
      title: '🚙 Boxy Luxury SUV',
      body: 'You arrive looking important. You are important. The dashboard warning lights are also important.'
    }
  },
  { id: 'vehicle_royce_ish', name: 'Ultra-Lux Sedan (Replica)', category: 'vehicle', emoji: '🚘', cost: 22000, lifespanYears: 7, pricing: 'global', uniqueGroup: 'car', description: 'Luxury vibes. Economy engine.', immediate: { deltas: { confidence: 1, social: 0.5 } },
    luxuryTier: 'fake',
    exposureBaseChance: 0.16,
    useSpec: {
      label: 'Act Rich',
      focusCost: 1,
      stressDelta: -0.2,
      fameDelta: 6,
      deltas: { confidence: 0.1 },
      title: '🚘 Ultra-Lux Sedan',
      body: 'You glide in like old money. The Bluetooth says "Connected (Probably)."'
    }
  },
  { id: 'vehicle_fauxrari', name: 'Replica Supercar Coupe', category: 'vehicle', emoji: '🏎️', cost: 28000, lifespanYears: 7, pricing: 'global', uniqueGroup: 'car', description: 'Speed... adjacent.', immediate: { deltas: { confidence: 1.5, social: 0.5 } },
    luxuryTier: 'fake',
    exposureBaseChance: 0.17,
    useSpec: {
      label: 'Rev Engine (Dramatically)',
      focusCost: 1,
      stressDelta: -0.2,
      fameDelta: 8,
      deltas: { confidence: 0.1, social: 0.1 },
      title: '🏎️ Replica Supercar',
      body: 'You rev the engine. It sounds like a lawn mower with ambition. People still film you. Honestly: respect.'
    }
  },
  { id: 'vehicle_tessla_ish', name: 'Electric Sedan (Clone)', category: 'vehicle', emoji: '🚗', cost: 20000, lifespanYears: 6, pricing: 'global', uniqueGroup: 'car', description: 'Autopilot (emotionally), not legally.', immediate: { deltas: { confidence: 1, social: 0.5 } },
    luxuryTier: 'fake',
    exposureBaseChance: 0.14,
    useSpec: {
      label: 'Silent Cruise',
      focusCost: 1,
      stressDelta: -0.3,
      fameDelta: 5,
      deltas: { discipline: 0.1, confidence: 0.1 },
      title: '🚗 Electric Sedan',
      body: 'You drive silently and feel futuristic. The touchscreen lags once and humbles you instantly.'
    }
  },

  // Required items for activity packs
  { id: 'HELMET_SET', name: 'Safety Helmet & Pads', category: 'gear', emoji: '🪖', cost: 45, lifespanYears: 5, description: 'Helmets and knee pads for wheeled adventures.', immediate: { deltas: { confidence: 0.3 } } },
  { id: 'ROCKET_KIT', name: 'Model Rocket Kit', category: 'hobby', emoji: '🚀', cost: 60, lifespanYears: 4, description: 'Launch-ready model rockets. STEM thrill, supervised.', immediate: { deltas: { intelligence: 0.5, curiosity: 0.4 } } },
  { id: 'STEM_KIT', name: 'STEM Project Kit', category: 'robots', emoji: '🧪', cost: 50, lifespanYears: 4, description: 'Kid-friendly experiments and circuits.', immediate: { deltas: { intelligence: 0.6, curiosity: 0.3 } } },
  { id: 'ART_SUPPLIES_KIT', name: 'Art Supplies Kit', category: 'hobby', emoji: '🎨', cost: 40, lifespanYears: 2, description: 'Paints, markers, glue, and creative chaos supplies.', immediate: { deltas: { creativity: 0.5, confidence: 0.2 } } },
  
  // Foam Swords
  { id: 'toy_foamSwords', name: 'Foam Swords (2-Pack)', category: 'toy', emoji: '⚔️', cost: 28, lifespanYears: 4, description: 'Safe-ish dueling. Dramatic sound effects not included (but inevitable).', immediate: { deltas: { confidence: 0.4, fitness: 0.3 } } },
  
  // GameSphere Console
  { id: 'gamesphere_console', name: 'GameSphere Console', category: 'electronics', emoji: '🎮', cost: 350, lifespanYears: 6, pricing: 'global', description: 'It is spherical. Somehow this makes gaming feel futuristic.', immediate: { deltas: { happiness: 0.6, intelligence: 0.3 } } },
  
  // GameSphere Games (hidden unless console owned)
  { id: 'gamesphere_blockcraft1', name: 'Blockcraft 1', category: 'electronics', emoji: '🧱', cost: 45, lifespanYears: null, pricing: 'global', requiresOwnedItemIds: ['gamesphere_console'], description: 'Build worlds. Mine blocks. Defend against creepers… or whatever the kids call them.', immediate: { deltas: { creativity: 0.4, intelligence: 0.3 } } },
  { id: 'gamesphere_galaxyRacers', name: 'Galaxy Racers', category: 'electronics', emoji: '🏎️', cost: 45, lifespanYears: null, pricing: 'global', requiresOwnedItemIds: ['gamesphere_console'], description: 'Space racing with zero gravity physics. Your stomach disagrees with the turns.', immediate: { deltas: { confidence: 0.3, fitness: 0.2 } } },
  { id: 'gamesphere_dungeonDelvers', name: 'Dungeon Delvers', category: 'electronics', emoji: '🗺️', cost: 45, lifespanYears: null, pricing: 'global', requiresOwnedItemIds: ['gamesphere_console'], description: 'Quest through dungeons. Strategic co-op or competitive betrayal—your call.', immediate: { deltas: { intelligence: 0.4, discipline: 0.3 } } }
];

export const isShopItemAvailable = (gameState, item) => {
  const country = String(gameState?.countryIso3 || 'USA');
  const scenario = String(gameState?.specialStartId || '');

  // Helper checks
  const isPropertyHome = item?.uniqueGroup === 'home';
  const isVehicle = item?.category === 'vehicle' || ['car', 'bike', 'motorcycle', 'rv'].includes(item?.uniqueGroup);
  
  // War zone / Refugee camp: block homes and vehicles
  if (scenario === 'war_zone' || scenario === 'refugee_camp') {
    if (isPropertyHome || isVehicle) return false;
  }
  
  // Apocalypse scenarios: block homes, vehicles, and normal-life categories
  const isApocalypse = scenario === 'zombie_apocalypse' || scenario === 'alien_invasion' || scenario === 'apocalypse_bunker_stream';
  if (isApocalypse) {
    if (isPropertyHome || isVehicle) return false;
    const normalLifeCategories = ['nightlife', 'luxury', 'fashion', 'beauty', 'absurd'];
    if (normalLifeCategories.includes(item?.category)) return false;
  }

  // Space station: no real estate, no vehicles
  if (scenario === 'space_station_family') {
    if (isPropertyHome || isVehicle) return false;
  }

  const a = item?.availability;
  if (!a) return true;

  const hasCountries = Array.isArray(a.countries) && a.countries.length > 0;
  const hasScenarios = Array.isArray(a.scenarios) && a.scenarios.length > 0;

  const inCountry = !hasCountries || a.countries.includes(country);
  const inScenario = !hasScenarios || a.scenarios.includes(scenario);

  if (hasCountries && hasScenarios) return inCountry || inScenario;
  if (hasCountries) return inCountry;
  if (hasScenarios) return inScenario;
  return true;
};

// Helper to lookup items by ID
export const SHOP_ITEM_BY_ID = SHOP_ITEMS.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

// Export for backward compatibility if needed
export const SHOP_CATALOG = {
  toys: SHOP_ITEMS.filter(i => i.category === 'toy'),
  books: SHOP_ITEMS.filter(i => i.category === 'book'),
  gear: SHOP_ITEMS.filter(i => i.category === 'gear'),
  vehicle: SHOP_ITEMS.filter(i => i.category === 'vehicle'),
  electronics: SHOP_ITEMS.filter(i => i.category === 'electronics')
};

export const getAffordableUnlocks = (gameState, moneyDelta) => {
  // If gameState is passed as first arg (old signature was money, ownedItems), handle it
  // But typically usage is getAffordableUnlocks(gameState, moneyAmount)
  
  const money = typeof gameState === 'number' ? gameState : (gameState?.money || 0);
  const ownedItems = typeof gameState === 'object' ? (gameState?.inventory?.items || []) : [];
  const ownedIds = new Set(ownedItems.map(i => i.id));
  
  // If moneyDelta is provided, we check against that amount (e.g. "what can I buy with this windfall")
  // otherwise check against total money
  const checkAmount = moneyDelta !== undefined ? moneyDelta : money;

  return SHOP_ITEMS.filter(item => 
    !ownedIds.has(item.id) && 
    item.cost <= checkAmount
  );
};

export const hasShopItem = (gameState, itemId) => {
  if (!gameState?.inventory?.items) return false;
  return gameState.inventory.items.some(i => i.id === itemId);
};

export const getInventoryItems = (gameState) => {
  return gameState?.inventory?.items || [];
};

export const getOwnedItemByUniqueGroup = (gameState, group) => {
  if (!gameState?.inventory?.items) return null;
  return gameState.inventory.items.find(i => i.uniqueGroup === group);
};

// Generate generic flavor text for item usage based on category
const GENERIC_USE_FLAVOR = {
  robots: [
    'It does a chore with unsettling confidence.',
    'The robot completes its task and immediately judges your lifestyle choices.',
    'You press one button. The robot handles it. You feel powerful and slightly obsolete.'
  ],
  home: [
    'You enjoy the upgrade and briefly feel like an adult.',
    'You use it. Your stress level quietly approves.',
    'You engage with your purchase. It was worth it (probably).'
  ],
  luxury: [
    'You flex it subtly. People notice.',
    'You use it confidently. Perception shifts slightly.',
    'You deploy it strategically. The vibe: powerful.'
  ],
  beauty: [
    'You do the routine. You look slightly more put together than your calendar deserves.',
    'Self-care mode activated. Future you sends a thank-you note.',
    'You take a moment for yourself. It helps more than you expected.'
  ],
  hobby: [
    'You practice. Talent arrives… slowly.',
    'You dive in. Progress is invisible but real.',
    'You commit to the hobby. The hobby commits back.'
  ],
  food: [
    'You make something nice. It tastes like self-respect.',
    'You prepare it carefully. Nutrition meets morale.',
    'You enjoy it. Your body files a quiet thank-you note.'
  ],
  fashion: [
    'You put it on. Suddenly you walk like you own the sidewalk.',
    'You try it out. Confidence increases by vibes alone.',
    'You wear it. The mirror approves.'
  ],
  absurd: [
    'You commit to the bit. The bit commits back.',
    'You do the thing. Reality questions your choices. You persist.',
    'You deploy it. Logic protests. Fun wins.'
  ],
  fitness: [
    'You use it. Your muscles remember what effort feels like.',
    'You train. Progress whispers quietly.',
    'You push yourself. Tomorrow will complain, but today feels strong.'
  ],
  vehicle: [
    'You take it for a spin. Freedom has a steering wheel.',
    'You drive. The road cooperates.',
    'You enjoy the ride. Simple pleasures compound.'
  ],
  electronics: [
    'You power it on. Technology cooperates (for once).',
    'You use it efficiently. The future is… okay.',
    'You engage with tech. Productivity increases by 3%.'
  ],
  toy: [
    'You play with it. Joy is simple sometimes.',
    'You use it together. Laughter happens.',
    'You engage. Childhood vibes activated.'
  ],
  book: [
    'You read a little. Words land quietly.',
    'You turn pages. Knowledge compounds.',
    'You read together. Stories connect.'
  ],
  gear: [
    'You use it. It does what it\'s supposed to do. Revolutionary.',
    'You deploy it. Preparedness feels good.',
    'You engage with your gear. Confidence ticks up.'
  ],
  defense: [
    'You use it responsibly. Preparedness is calm.',
    'You engage carefully. Safety is a skill.',
    'You practice. Competence grows quietly.'
  ],
  luxury: [
    'You flex it subtly. People notice.',
    'You use it confidently. Perception shifts slightly.',
    'You deploy it strategically. The vibe: powerful.'
  ]
};

function hashString(str) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h >>> 0;
}

function pickGenericFlavor(itemId, category) {
  const pool = GENERIC_USE_FLAVOR[category] || GENERIC_USE_FLAVOR.home;
  const idx = hashString(itemId) % pool.length;
  return pool[idx];
}

export function getUseSpecForItem(gameState, itemDef) {
  if (!itemDef) return null;
  
  // If item has a useSpec, use it (resolve if function)
  if (itemDef.useSpec) {
    if (typeof itemDef.useSpec === 'function') {
      return itemDef.useSpec(gameState);
    }
    return itemDef.useSpec;
  }
  
  // Generic flavor fallback (0 Focus, skipTimeline, no effects)
  const body = pickGenericFlavor(itemDef.id, itemDef.category);
  
  return {
    label: `Use ${itemDef.name}`,
    focusCost: 0,
    skipTimeline: true,
    title: `${itemDef.emoji} ${itemDef.name}`,
    body
  };
}