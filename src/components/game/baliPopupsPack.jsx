// Empathy School Bali Popups Pack
// Exports two arrays with 100 items each: BALI_CALM_POPUPS and BALI_ACTIVITY_POPUPS

function pad3(n) {
  return String(n).padStart(3, '0');
}

function makeCalmItem(i) {
  const titles = [
    'Ducks on Parade',
    'Monkeys Plotting Heists',
    'Rice Terrace Breeze',
    'Quiet Temple Courtyard',
    'Afternoon Rain on Roof Tiles',
    'Scooter Lullaby',
    'Gecko Says Hello',
    'Kites Above the Beach',
    'Coconut Water Pause',
    'Clouds Over Mount Agung'
  ];
  const bodies = [
    'A line of ducks waddles past your room like they own the place. Somehow… it works.',
    'A monkey looks at you like a tiny philosopher. You both blink. Peace returns.',
    'Wind moves through the rice, shushing your nervous system like a librarian.',
    'Incense and soft footsteps. The world remembers: quiet exists.',
    'The rain says: today can be slower. You listen.',
    'Somehow the distant scooter hum feels like white noise from the universe.',
    'A gecko chirps. You decide it’s applause for doing your best.',
    'A kite sails high, wobbling like a yes-and. Your breath follows.',
    'Cold, sweet, simple. You remember you have a body again.',
    'Clouds gather and the volcano watches over everything calmly.'
  ];

  // Optional gentle child stat boosts
  const deltaOptions = [
    null,
    { empathy: 0.2 },
    { confidence: 0.2 },
    { happiness: 0.3 },
    { curiosity: 0.2 },
    { creativity: 0.2 },
    { health: 0.2 },
  ];
  const deltas = deltaOptions[i % deltaOptions.length] || null;

  return {
    id: `bali_calm_${pad3(i + 1)}`,
    title: titles[i % titles.length],
    body: bodies[i % bodies.length],
    minAge: 0,
    maxAge: 18,
    ...(deltas ? { deltas } : {})
  };
}

function makeActivityItem(i) {
  const titles = [
    'Choose Your Bali Weekend',
    'Pick Your Island Mini-Adventure',
    'How Will You Bali Today?',
    'Weekend Wonder: Your Call',
    'Island Day: What’s the Vibe?' 
  ];
  const bodies = [
    'You’ve got a free day. Where are you taking {childName}?',
    'Time to recharge together. What do you two get up to?',
    'The island is a playground. Pick your tiny story for today.',
    'Slow life unlocked. Choose your flavor of presence with {childName}.',
    'New day, new ritual. Where to with {childName}?'
  ];

  return {
    id: `bali_act_${pad3(i + 1)}`,
    title: titles[i % titles.length],
    body: bodies[i % bodies.length],
    minAge: 0,
    maxAge: 18,
    choices: [
      {
        id: 'beach',
        letter: 'A',
        emoji: '🏖️',
        text: 'Beach day: sandcastles + dramatic waves.',
        consequence: 'Salt air, giggles, and a questionable sunscreen application… but everyone relaxes.',
        deltas: { happiness: 0.6, health: 0.2, empathy: 0.1 },
        loveDelta: 1,
        stressDelta: -1,
        moneyDelta: -25
      },
      {
        id: 'art',
        letter: 'B',
        emoji: '🎨',
        text: 'Art market + craft workshop.',
        consequence: 'They make something weird and wonderful and insist it’s “modern.”',
        deltas: { creativity: 0.7, confidence: 0.3, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: -0.5,
        moneyDelta: -40
      },
      {
        id: 'temple',
        letter: 'C',
        emoji: '🛕',
        text: 'Temple visit: quiet, offerings, and questions you can’t Google fast enough.',
        consequence: 'They practice respect, curiosity, and the rare skill of being still.',
        deltas: { empathy: 0.6, curiosity: 0.4, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: -0.5,
        moneyDelta: -10
      }
    ]
  };
}

export const BALI_CALM_POPUPS = Array.from({ length: 100 }, (_, i) => makeCalmItem(i));
export const BALI_ACTIVITY_POPUPS = Array.from({ length: 100 }, (_, i) => makeActivityItem(i));