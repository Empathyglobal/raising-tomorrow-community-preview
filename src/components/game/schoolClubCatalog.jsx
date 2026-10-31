export const CLUB_BY_TRACK_ID = {
  SPACE_ASTRONOMY:      { clubId: "club_astronomy", name: "Astronomy Club", emoji: "🔭", theme: "SPACE", dues: 60, seedAdds: { space: 1 }, joinDeltas: { intelligence: 0.2, confidence: 0.1, empathy: 0, discipline: 0 } },
  SPACE_ROCKETRY:       { clubId: "club_rocketry", name: "Rocketry Team", emoji: "🚀", theme: "SPACE", dues: 90, seedAdds: { space: 1, engineering: 1 }, joinDeltas: { discipline: 0.2, intelligence: 0.1, empathy: 0, confidence: 0 } },
  SPACE_XENOBIOLOGY:    { clubId: "club_astrobio", name: "Astrobiology Circle", emoji: "🧬", theme: "SPACE", dues: 70, seedAdds: { science: 1 }, joinDeltas: { intelligence: 0.2, empathy: 0.1, discipline: 0, confidence: 0 } },
  SPACE_PLANETARY:      { clubId: "club_planet_hunters", name: "Planet Hunters", emoji: "🪐", theme: "SPACE", dues: 60, seedAdds: { space: 1 }, joinDeltas: { intelligence: 0.2, empathy: 0, discipline: 0, confidence: 0 } },
  SPACE_ROBOTICS:       { clubId: "club_space_robotics", name: "Space Robotics Team", emoji: "🤖", theme: "SPACE", dues: 120, seedAdds: { space: 1, tech: 1 }, joinDeltas: { discipline: 0.2, intelligence: 0.2, empathy: 0, confidence: 0 } },
  SPACE_POLICY:         { clubId: "club_space_policy", name: "Space Policy & Ethics", emoji: "🛰️", theme: "SPACE", dues: 50, seedAdds: { leadership: 1 }, joinDeltas: { empathy: 0.2, confidence: 0.1, intelligence: 0, discipline: 0 } },

  ANIMALS_VETERINARY:   { clubId: "club_future_vets", name: "Future Vets Club", emoji: "🩺", theme: "ANIMALS", dues: 80, seedAdds: { nature: 1 }, joinDeltas: { empathy: 0.2, discipline: 0.1, intelligence: 0, confidence: 0 } },
  ANIMALS_ECOLOGY:      { clubId: "club_eco_rangers", name: "Eco Rangers", emoji: "🌿", theme: "ANIMALS", dues: 50, seedAdds: { nature: 2 }, joinDeltas: { empathy: 0.2, intelligence: 0.1, discipline: 0, confidence: 0 } },
  ANIMALS_MARINE:       { clubId: "club_marine_bio", name: "Marine Bio Club", emoji: "🐋", theme: "ANIMALS", dues: 70, seedAdds: { nature: 2 }, joinDeltas: { intelligence: 0.2, empathy: 0, discipline: 0, confidence: 0 } },
  ANIMALS_BEHAVIOR:     { clubId: "club_behavior_lab", name: "Animal Behavior Lab", emoji: "🧠", theme: "ANIMALS", dues: 60, seedAdds: { nature: 1 }, joinDeltas: { empathy: 0.2, intelligence: 0.1, discipline: 0, confidence: 0 } },
  ANIMALS_WILDLIFE:     { clubId: "club_wildlife_trackers", name: "Wildlife Trackers", emoji: "🦌", theme: "ANIMALS", dues: 60, seedAdds: { nature: 2 }, joinDeltas: { discipline: 0.2, empathy: 0.1, intelligence: 0, confidence: 0 } },

  ART_ILLUSTRATION:     { clubId: "club_art_studio", name: "Art Studio Club", emoji: "🎨", theme: "ART", dues: 50, seedAdds: { art: 2 }, joinDeltas: { confidence: 0.2, empathy: 0, discipline: 0, intelligence: 0 } },
  ART_WRITING:          { clubId: "club_creative_writing", name: "Creative Writing Club", emoji: "✍️", theme: "ART", dues: 40, seedAdds: { art: 1 }, joinDeltas: { intelligence: 0.2, empathy: 0, discipline: 0, confidence: 0 } },
  ART_ANIMATION:        { clubId: "club_animation_film", name: "Animation & Film Club", emoji: "🎞️", theme: "ART", dues: 70, seedAdds: { art: 1, performance: 1 }, joinDeltas: { intelligence: 0.2, confidence: 0.1, empathy: 0, discipline: 0 } },
  ART_MUSIC:            { clubId: "club_music", name: "Band & Music Club", emoji: "🎵", theme: "ART", dues: 90, seedAdds: { music: 1, performance: 1 }, joinDeltas: { discipline: 0.2, confidence: 0.2, empathy: 0, intelligence: 0 } },
  ART_GAMEDESIGN:       { clubId: "club_game_dev", name: "Game Dev Club", emoji: "🕹️", theme: "ART", dues: 90, seedAdds: { art: 1, tech: 1 }, joinDeltas: { intelligence: 0.2, confidence: 0.1, empathy: 0, discipline: 0 } },

  BUILDING_ROBOTICS:    { clubId: "club_robotics", name: "Robotics Team", emoji: "🤖", theme: "BUILDING", dues: 120, seedAdds: { engineering: 1, tech: 1 }, joinDeltas: { discipline: 0.2, intelligence: 0.2, empathy: 0, confidence: 0 } },
  BUILDING_SOFTWARE:    { clubId: "club_coding", name: "Coding Club", emoji: "💻", theme: "BUILDING", dues: 80, seedAdds: { tech: 2 }, joinDeltas: { intelligence: 0.2, discipline: 0.1, empathy: 0, confidence: 0 } },
  BUILDING_ARCHITECTURE:{ clubId: "club_architecture", name: "Architecture Club", emoji: "🏛️", theme: "BUILDING", dues: 70, seedAdds: { engineering: 2 }, joinDeltas: { intelligence: 0.2, empathy: 0, discipline: 0, confidence: 0 } },
  BUILDING_ELECTRONICS: { clubId: "club_electronics", name: "Electronics Lab", emoji: "🔌", theme: "BUILDING", dues: 90, seedAdds: { tech: 1, engineering: 1 }, joinDeltas: { discipline: 0.2, intelligence: 0.1, empathy: 0, confidence: 0 } },
  BUILDING_MECHANICAL:  { clubId: "club_makers", name: "Makers & Machines", emoji: "🛠️", theme: "BUILDING", dues: 70, seedAdds: { engineering: 2 }, joinDeltas: { discipline: 0.2, confidence: 0.1, empathy: 0, intelligence: 0 } },

  PEOPLE_PSYCHOLOGY:    { clubId: "club_psych", name: "Psych Club", emoji: "🧠", theme: "PEOPLE", dues: 50, seedAdds: { leadership: 1 }, joinDeltas: { empathy: 0.2, intelligence: 0.1, discipline: 0, confidence: 0 } },
  PEOPLE_MEDICINE:      { clubId: "club_first_aid", name: "Health & First Aid", emoji: "🩺", theme: "PEOPLE", dues: 60, seedAdds: { hero: 1 }, joinDeltas: { empathy: 0.2, discipline: 0.1, intelligence: 0, confidence: 0 } },
  PEOPLE_EDUCATION:     { clubId: "club_peer_tutors", name: "Peer Tutors", emoji: "📚", theme: "PEOPLE", dues: 40, seedAdds: { leadership: 1 }, joinDeltas: { empathy: 0.2, confidence: 0.1, intelligence: 0, discipline: 0 } },
  PEOPLE_LAW:           { clubId: "club_mock_trial", name: "Mock Trial & Debate", emoji: "⚖️", theme: "PEOPLE", dues: 70, seedAdds: { leadership: 1, hero: 1 }, joinDeltas: { confidence: 0.2, discipline: 0.1, empathy: 0, intelligence: 0 } },
  PEOPLE_PUBLIC_SERVICE:{ clubId: "club_service", name: "Community Service Club", emoji: "🏛️", theme: "PEOPLE", dues: 50, seedAdds: { hero: 1, leadership: 1 }, joinDeltas: { empathy: 0.2, confidence: 0.1, intelligence: 0, discipline: 0 } },
};

export function getClubInviteForTrack(trackId) {
  return CLUB_BY_TRACK_ID[trackId] || null;
}