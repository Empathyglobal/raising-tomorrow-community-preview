// Passion tracks chosen at puberty (age 12).
// These are explicitly linked to the broad primary interest chosen at age 6.
// Saved in: gameState.childProfile.pubertyPassion

export const PASSION_TRACKS_BY_PRIMARY = {
  SPACE: [
    {
      id: 'SPACE_ASTRONOMY',
      label: 'Astronomy',
      emoji: '🔭',
      description: 'Stars, galaxies, and the math that explains them.',
      educationField: 'Astrophysics',
      deltas: { intelligence: 0.6, discipline: 0.2 }
    },
    {
      id: 'SPACE_ROCKETRY',
      label: 'Rocketry',
      emoji: '🚀',
      description: 'Engines, launches, and building what can actually fly.',
      educationField: 'Aerospace Engineering',
      deltas: { intelligence: 0.5, discipline: 0.3, confidence: 0.1 }
    },
    {
      id: 'SPACE_XENOBIOLOGY',
      label: 'Xenobiology',
      emoji: '🧬',
      description: 'Life in extreme environments… and maybe beyond Earth.',
      educationField: 'Astrobiology',
      deltas: { intelligence: 0.6, empathy: 0.2 }
    },
    {
      id: 'SPACE_PLANETARY',
      label: 'Planetary Science',
      emoji: '🪨',
      description: 'Rocks, planets, and the clues they keep.',
      educationField: 'Planetary Science',
      deltas: { intelligence: 0.5, discipline: 0.2 }
    },
    {
      id: 'SPACE_ROBOTICS',
      label: 'Space Robotics',
      emoji: '🤖',
      description: 'Machines that explore where humans cannot (yet).',
      educationField: 'Robotics & Automation',
      deltas: { intelligence: 0.5, discipline: 0.2, confidence: 0.1 }
    },
    {
      id: 'SPACE_POLICY',
      label: 'Space Policy',
      emoji: '🛰️',
      description: 'Ethics, rules, and decisions that shape space futures.',
      educationField: 'Public Policy',
      deltas: { intelligence: 0.4, empathy: 0.3, confidence: 0.2 }
    }
  ],

  ANIMALS: [
    {
      id: 'ANIMALS_VETERINARY',
      label: 'Veterinary',
      emoji: '🩺',
      description: 'Healing animals and learning what they cannot say.',
      educationField: 'Veterinary Medicine',
      deltas: { empathy: 0.4, intelligence: 0.3, discipline: 0.2 }
    },
    {
      id: 'ANIMALS_ECOLOGY',
      label: 'Ecology & Conservation',
      emoji: '🌿',
      description: 'Protecting habitats and the life inside them.',
      educationField: 'Ecology & Conservation',
      deltas: { empathy: 0.3, intelligence: 0.3, discipline: 0.2 }
    },
    {
      id: 'ANIMALS_MARINE',
      label: 'Marine Biology',
      emoji: '🐋',
      description: 'Ocean life, ecosystems, and deep curiosity.',
      educationField: 'Marine Biology',
      deltas: { intelligence: 0.4, empathy: 0.2, discipline: 0.2 }
    },
    {
      id: 'ANIMALS_BEHAVIOR',
      label: 'Animal Behavior',
      emoji: '🧠',
      description: 'Understanding why animals do what they do.',
      educationField: 'Behavioral Science',
      deltas: { intelligence: 0.3, empathy: 0.3 }
    },
    {
      id: 'ANIMALS_WILDLIFE',
      label: 'Wildlife Biology',
      emoji: '🦌',
      description: 'Fieldwork, tracking, and protecting the wild.',
      educationField: 'Wildlife Biology',
      deltas: { discipline: 0.3, intelligence: 0.3 }
    }
  ],

  ART: [
    {
      id: 'ART_ILLUSTRATION',
      label: 'Illustration',
      emoji: '🎨',
      description: 'Visual style, taste, and making ideas visible.',
      educationField: 'Visual Design',
      deltas: { confidence: 0.3, intelligence: 0.2 }
    },
    {
      id: 'ART_WRITING',
      label: 'Writing',
      emoji: '✍️',
      description: 'Stories, voice, and the craft of clarity.',
      educationField: 'Writing & Storytelling',
      deltas: { intelligence: 0.3, confidence: 0.2 }
    },
    {
      id: 'ART_ANIMATION',
      label: 'Animation & Film',
      emoji: '🎞️',
      description: 'Motion, scenes, and emotional pacing.',
      educationField: 'Film & Animation',
      deltas: { confidence: 0.3, discipline: 0.2 }
    },
    {
      id: 'ART_MUSIC',
      label: 'Music',
      emoji: '🎵',
      description: 'Practice, performance, and feeling through sound.',
      educationField: 'Music',
      deltas: { discipline: 0.3, confidence: 0.2 }
    },
    {
      id: 'ART_GAMEDESIGN',
      label: 'Game Design',
      emoji: '🕹️',
      description: 'Systems, fun, and building worlds with rules.',
      educationField: 'Game Design',
      deltas: { intelligence: 0.3, discipline: 0.2, confidence: 0.2 }
    }
  ],

  BUILDING: [
    {
      id: 'BUILDING_ROBOTICS',
      label: 'Robotics',
      emoji: '🤖',
      description: 'Mechanics + code + debugging.',
      educationField: 'Robotics Engineering',
      deltas: { intelligence: 0.4, discipline: 0.3 }
    },
    {
      id: 'BUILDING_SOFTWARE',
      label: 'Software',
      emoji: '💻',
      description: 'Logic, craft, and building things from nothing.',
      educationField: 'Computer Science',
      deltas: { intelligence: 0.4, discipline: 0.2 }
    },
    {
      id: 'BUILDING_ARCHITECTURE',
      label: 'Architecture',
      emoji: '🏛️',
      description: 'Designing spaces people live real lives in.',
      educationField: 'Architecture',
      deltas: { intelligence: 0.3, discipline: 0.3, confidence: 0.1 }
    },
    {
      id: 'BUILDING_ELECTRONICS',
      label: 'Electronics',
      emoji: '🔌',
      description: 'Circuits, signals, and precision.',
      educationField: 'Electrical Engineering',
      deltas: { intelligence: 0.4, discipline: 0.2 }
    },
    {
      id: 'BUILDING_MECHANICAL',
      label: 'Mechanical',
      emoji: '🛠️',
      description: 'Machines, materials, and practical invention.',
      educationField: 'Mechanical Engineering',
      deltas: { intelligence: 0.3, discipline: 0.3 }
    }
  ],

  PEOPLE: [
    {
      id: 'PEOPLE_PSYCHOLOGY',
      label: 'Psychology',
      emoji: '🧠',
      description: 'How minds work—and how to help.',
      educationField: 'Psychology',
      deltas: { empathy: 0.4, intelligence: 0.2 }
    },
    {
      id: 'PEOPLE_MEDICINE',
      label: 'Medicine',
      emoji: '🩺',
      description: 'Care under pressure. Learning never ends.',
      educationField: 'Medicine',
      deltas: { empathy: 0.3, intelligence: 0.3, discipline: 0.2 }
    },
    {
      id: 'PEOPLE_EDUCATION',
      label: 'Education',
      emoji: '📚',
      description: 'Teaching, patience, and building confidence in others.',
      educationField: 'Education',
      deltas: { empathy: 0.3, confidence: 0.2, discipline: 0.2 }
    },
    {
      id: 'PEOPLE_LAW',
      label: 'Law & Advocacy',
      emoji: '⚖️',
      description: 'Argument, fairness, and protecting people.',
      educationField: 'Law',
      deltas: { confidence: 0.3, intelligence: 0.2, empathy: 0.2 }
    },
    {
      id: 'PEOPLE_PUBLIC_SERVICE',
      label: 'Public Service',
      emoji: '🏛️',
      description: 'Community work, leadership, and real-world impact.',
      educationField: 'Public Administration',
      deltas: { empathy: 0.3, confidence: 0.2, discipline: 0.2 }
    }
  ]
};

export const PASSION_TRACKS_FLAT = Object.values(PASSION_TRACKS_BY_PRIMARY).flat();

export const PASSION_TRACK_LABELS = PASSION_TRACKS_FLAT.reduce((acc, t) => {
  acc[t.id] = t.label;
  return acc;
}, {});

export function getPassionTracksForPrimary(primaryInterest) {
  if (primaryInterest && PASSION_TRACKS_BY_PRIMARY[primaryInterest]) {
    return PASSION_TRACKS_BY_PRIMARY[primaryInterest];
  }
  // Fallback: if something is missing/legacy save, offer everything.
  return PASSION_TRACKS_FLAT;
}

export function getPassionMeta(passionId) {
  if (!passionId) return null;
  return PASSION_TRACKS_FLAT.find(t => t.id === passionId) || null;
}

export function formatPassionTrack(passionId) {
  if (!passionId) return '';
  return PASSION_TRACK_LABELS[passionId] || '';
}