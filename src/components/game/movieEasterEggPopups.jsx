// Movie-ish Easter egg popups (every other year)
//
// These are original comedic situations that feel like playful nods to family/kids movies.
// Avoid direct quotes or beat-by-beat plot retellings; keep it "vibes", not reproduction.
// Use {childName} placeholders which are replaced at runtime.

export const MOVIE_EASTER_EGG_EVENTS = [
  // === Ages 2–4 (toddler chaos) ===
  {
    id: 'ee_let_it_go_cereal',
    minAge: 2,
    maxAge: 4,
    icon: '❄️',
    title: '{childName} declares winter and "lets it go"',
    body: `You hear dramatic humming from the kitchen.

You turn the corner and find a blizzard of cereal flakes drifting through the air like tiny crunchy snow.

{childName} looks at the mess, takes a deep breath, and announces: "I am FREE now."`,
    hint: "If you hear theatrical singing... no you didn't."
  },
  {
    id: 'ee_secret_chef',
    minAge: 2,
    maxAge: 4,
    icon: '👩‍🍳',
    title: '{childName} starts a "secret chef" partnership',
    body: `Dinner smells... interesting.

You discover a tiny "chef hat" on a stuffed animal and a spoon being used as a very serious baton.

{childName} whispers, "Don't tell anyone. The chef is shy."`,
    hint: 'Somewhere, a tiny imaginary kitchen is winning awards.'
  },
  {
    id: 'ee_closet_door_company',
    minAge: 2,
    maxAge: 4,
    icon: '🚪',
    title: '{childName} opens a suspicious closet "portal"',
    body: `You hear the closet door open... then close... then open again.

Inside, {childName} has arranged stuffed animals in a line. There's a clipboard. There's a "shift schedule."

Apparently, the closet is now "The Door Department."`,
    hint: "It's giving \"monsters, but unionized.\""
  },
  {
    id: 'ee_balloon_launch_attempt',
    minAge: 2,
    maxAge: 4,
    icon: '🎈',
    title: '{childName} attempts a chair‑lift via balloons',
    body: `You walk in to see balloons tied to a chair with impressive confidence and questionable physics.

{childName} points upward like a seasoned explorer and declares, "We are MOVING. To the clouds."

You gently explain gravity to someone who is not emotionally available for science today.`,
    hint: 'Adventure is out there. Gravity is also out there.'
  },
  {
    id: 'ee_toy_council_meeting',
    minAge: 2,
    maxAge: 4,
    icon: '🧸',
    title: '{childName} insists the toys held a meeting',
    body: `You notice the toys are arranged in a suspiciously perfect circle.

{childName} says, very seriously: "They had important business. No adults allowed."

You swear one of the stuffed animals is judging you.`,
    hint: "If the toys ever \"freeze\" when you look... no they didn't."
  },
  {
    id: 'ee_bathtub_ocean_quest',
    minAge: 2,
    maxAge: 4,
    icon: '🌊',
    title: '{childName} tries to "return the heart" to the bathtub',
    body: `Bath time becomes a sacred ceremony.

{childName} places a random rock into the water, whispers "You're welcome," and stares at the faucet like it might speak.

You are apparently the side character in an ocean prophecy now.`,
    hint: 'The ocean has opinions. So does your towel.'
  },

  // === Ages 5–8 (big imagination, bigger messes) ===
  {
    id: 'ee_wardrobe_world',
    minAge: 5,
    maxAge: 8,
    icon: '🧥',
    title: '{childName} discovers a wardrobe "entrance"',
    body: `You find {childName} packing snacks, a flashlight, and one single sock.

They explain the plan: "I'm going in. If I don't come back… tell my teacher I tried."

You open the wardrobe. It contains coats. And dust. And exactly zero magic kingdoms.`,
    hint: 'Some adventures are just laundry with better branding.'
  },
  {
    id: 'ee_golden_ticket_kitchen',
    minAge: 5,
    maxAge: 8,
    icon: '🍫',
    title: '{childName} finds a "golden ticket" (it\'s a crayon receipt)',
    body: `A tiny piece of paper is waved in your face like a winning lottery ticket.

{childName} announces you must give a full "factory tour" of the kitchen.

Five minutes later you're "demonstrating" how to wash dishes while being narrated by a very excited tour guide.`,
    hint: 'Everything smells like chocolate. None of it is chocolate.'
  },
  {
    id: 'ee_magic_lamp_snacks',
    minAge: 5,
    maxAge: 8,
    icon: '🪔',
    title: '{childName} rubs a "magic lamp" and starts taking requests',
    body: `A flashlight is presented like an ancient artifact.

{childName} rubs it, looks at you with full confidence, and says: "You get three wishes."

Every single wish is somehow "snacks."`,
    hint: 'You are not the genie. You are... the pantry.'
  },
  {
    id: 'ee_spy_kids_bedtime',
    minAge: 5,
    maxAge: 8,
    icon: '🕵️',
    title: '{childName} launches "Operation: Definitely Not Bedtime"',
    body: `There are sticky notes on the walls like a crime board.

{childName} whispers into a banana like it's a walkie‑talkie.

The mission appears to be sneaking one extra episode of something you didn't approve.`,
    hint: 'The banana is compromised.'
  },
  {
    id: 'ee_book_wizard_mode',
    minAge: 6,
    maxAge: 9,
    icon: '📚',
    title: '{childName} goes full book‑wizard',
    body: `You get a call from the librarian.

Apparently {childName} asked for "the biggest book you have" and then carried it out like a medieval quest.

At home, they correct your vocabulary in a gentle tone that somehow makes it worse.`,
    hint: "It's giving \"tiny genius with opinions.\""
  },
  {
    id: 'ee_lego_hallway_trap',
    minAge: 6,
    maxAge: 10,
    icon: '🏠',
    title: '{childName} sets a "trap" (it\'s... LEGOs)',
    body: `You take one confident step into the hallway.

Pain. Regret. Geometry.

{childName} pops out from behind the couch and whispers, "It worked."`,
    hint: 'Some "movie traps" are just toy physics and your bare feet.'
  },
  {
    id: 'ee_family_superhero_mission',
    minAge: 5,
    maxAge: 8,
    icon: '🦸',
    title: '{childName} assigns the family a "superhero mission"',
    body: `You are handed a cape made of a towel.

{childName} explains you have "powers," but you can only use them for good (and for carrying groceries).

There is a dramatic countdown to… taking out the trash.`,
    hint: 'The greatest superpower is showing up with snacks.'
  },
  {
    id: 'ee_lost_and_found_alien_pet',
    minAge: 5,
    maxAge: 8,
    icon: '🐾',
    title: '{childName} adopts a "weird dog" from Lost & Found',
    body: `A lumpy stuffed animal appears in your home.

{childName} insists it is not a stuffed animal. It is "a misunderstood creature" with "big feelings."

They introduce you. The creature stares into your soul (button eyes).`,
    hint: 'Ohana means nobody gets to throw away the weird plush.'
  },

  // === Ages 8–12 (school-age adventures) ===
  {
    id: 'ee_fish_rescue_mission',
    minAge: 8,
    maxAge: 12,
    icon: '🐠',
    title: '{childName} runs a full‑scale "fish rescue"',
    body: `You find towels everywhere and a very serious face.

{childName} explains a fish is "lost" and must be returned "to the big blue."

The "big blue" is the bathtub. The fish is fine. The floor is not.`,
    hint: 'Just keep swimming. Preferably toward a mop.'
  },
  {
    id: 'ee_ball_into_the_beast_yard',
    minAge: 9,
    maxAge: 12,
    icon: '⚾',
    title: '{childName} hits the ball into "the beast" yard',
    body: `A ball disappears over a fence.

Suddenly the neighbor's dog becomes "the legendary beast" in {childName}'s retelling.

An epic retrieval quest begins, featuring: diplomacy, snacks, and exactly one apology note.`,
    hint: 'Every neighborhood has a myth. Usually it\'s just a dog with opinions.'
  },
  {
    id: 'ee_parent_trap_attempt',
    minAge: 9,
    maxAge: 12,
    icon: '📝',
    title: '{childName} tries to set you up on a date',
    body: `You receive a handwritten invitation to "A Very Normal Adult Hangout."

The invite is signed by {childName}, who is apparently your social coordinator now.

You show up and realize they've seated two adults next to each other like it's a science experiment.`,
    hint: 'Your child is not subtle. Your child is also not wrong that you deserve joy.'
  },
  {
    id: 'ee_sudden_royalty_phase',
    minAge: 9,
    maxAge: 13,
    icon: '👑',
    title: '{childName} wakes up convinced they\'re royalty',
    body: `It starts with a new posture.

Then a request for "proper etiquette."

By lunch, {childName} is practicing a royal wave and calling the refrigerator "the pantry vault."`,
    hint: 'Sometimes confidence arrives dressed as a crown.'
  },
  {
    id: 'ee_acceptance_letter_vibes',
    minAge: 9,
    maxAge: 13,
    icon: '🦉',
    title: '{childName} receives an "acceptance letter"',
    body: `A letter appears. It has a wax seal. (It's... glue.)

{childName} reads it aloud in a very serious voice and packs a backpack with pencils and one dramatic cloak.

You ask where they're going. They answer, "To learn the secrets."`,
    hint: 'The only secret today is homework.'
  },
  {
    id: 'ee_emotion_control_room',
    minAge: 9,
    maxAge: 12,
    icon: '🎛️',
    title: '{childName} builds an "emotion control room" in the living room',
    body: `Sticky notes appear on the wall: "JOY," "SAD," "MAD," and "HUNGRY."

{childName} announces they are "running headquarters" and requests a status report on your feelings.

You accidentally say "tired" and get assigned to "the nap department."`,
    hint: 'Emotional literacy, but with props.'
  },
  {
    id: 'ee_band_manager_parent',
    minAge: 9,
    maxAge: 13,
    icon: '🎸',
    title: '{childName} forms a band and declares you the manager',
    body: `A "rehearsal schedule" appears on the fridge.

{childName} asks for "tour snacks," "stage lighting," and "someone to believe in their vision."

You are offered the job of "manager," which appears to mean: carry the speaker.`,
    hint: 'Rock and roll is mostly logistics.'
  },
  {
    id: 'ee_cardboard_guitar_era',
    minAge: 9,
    maxAge: 12,
    icon: '🎶',
    title: '{childName} builds a guitar out of cardboard',
    body: `You hear music. It is not coming from an instrument. It is coming from confidence.

{childName} performs a heartfelt concert for exactly two audience members and one confused pet.

They bow like they just sold out a stadium.`,
    hint: 'Sometimes the dream is bigger than the cardboard.'
  },

  // === Ages 13–18 (teen chaos, movie vibes) ===
  {
    id: 'ee_cafeteria_rehearsal',
    minAge: 13,
    maxAge: 18,
    icon: '🎤',
    title: '{childName} starts spontaneous cafeteria rehearsals',
    body: `You get a message from a teacher: "Just so you know... there was singing. A lot of singing."

At home, {childName} insists it's "for a club" and "totally normal."

You are asked to help run lines like you're the backstage crew now.`,
    hint: 'Some teens process emotions through choreography.'
  },
  {
    id: 'ee_laser_snack_heist',
    minAge: 13,
    maxAge: 18,
    icon: '🧵',
    title: '{childName} sets up "laser security" to sneak snacks',
    body: `You walk into the kitchen and find string crisscrossed like a museum.

{childName} explains it's "security training."

Security training appears to be: obtaining cookies without alerting the household.`,
    hint: 'The mission is impossible. The snacks are not.'
  },
  {
    id: 'ee_perfect_day_pitch',
    minAge: 14,
    maxAge: 18,
    icon: '🖼️',
    title: '{childName} pitches a "perfect day" with suspiciously precise timing',
    body: `You get a PowerPoint. (It's a slideshow on their phone. Still.)

The proposal includes: one "mental health day," one museum, and one meal they swear will "change your life."

They are either incredibly organized… or up to something. Probably both.`,
    hint: 'Sometimes "independence" shows up holding a schedule.'
  },
  {
    id: 'ee_skateboard_science_demo',
    minAge: 13,
    maxAge: 18,
    icon: '🛹',
    title: '{childName} modifies a skateboard and says, "Trust me."',
    body: `You notice tools. You notice confidence. You do not notice safety goggles.

{childName} insists it's "for science" and demonstrates a very dramatic glide.

You are asked to clap AND to sign a waiver you did not approve.`,
    hint: 'Time travel is unlikely. Sprained ankles are not.'
  },
  {
    id: 'ee_binder_power_arc',
    minAge: 14,
    maxAge: 18,
    icon: '📒',
    title: '{childName} discovers the power of an aggressively organized binder',
    body: `A binder appears. It has tabs. It has color coding. It has a vibe.

{childName} explains they can "fix everything" with a system.

They then attempt to reorganize your entire household like it's a courtroom exhibit.`,
    hint: 'Confidence is sometimes just office supplies.'
  },
  {
    id: 'ee_everything_is_awesome_reorg',
    minAge: 13,
    maxAge: 18,
    icon: '🧱',
    title: '{childName} declares "Everything is awesome" and reorganizes the room',
    body: `You come home to find the living room has been re‑built.

Not renovated. Re‑built.

{childName} proudly explains the new layout "optimizes joy." You cannot find the couch.`,
    hint: 'Sometimes creativity is just moving furniture with confidence.'
  },
  {
    id: 'ee_basement_treasure_hunt',
    minAge: 10,
    maxAge: 16,
    icon: '🗺️',
    title: '{childName} starts a basement treasure hunt',
    body: `You are handed a map that looks like it was drawn in a heroic hurry.

{childName} whispers, "We don't have much time."

The "treasure" is a box of old photos… but the excitement level is full cinematic adventure.`,
    hint: 'Sometimes the treasure is nostalgia (and dust).'
  },
  {
    id: 'ee_home_alone_holiday',
    minAge: 9,
    maxAge: 15,
    icon: '🎄',
    title: '{childName} has a very "home‑alone" holiday',
    body: `You plan a holiday trip. It's hectic. It's chaos. It's "Did we pack the toothbrushes?"

On the drive, you realize you haven't heard {childName} in a while… because {childName} is not in the back seat.

When you return, the house is oddly… booby‑trap‑adjacent. Two would‑be burglars are outside arguing about "marbles" and "a paint can that came out of nowhere."

{childName} is eating cereal like nothing happened.`,
    hint: 'Some families make memories. Yours makes sequels.'
  },
  {
    id: 'ee_volunteers_as_tribute',
    minAge: 12,
    maxAge: 18,
    icon: '🏹',
    title: '{childName} "volunteers as tribute" for a group project',
    body: `You hear {childName} announce, "Fine. I'll do it."

Later you learn the group project was sliding toward disaster, so they stepped in like a tiny hero.

Now they're exhausted, slightly dramatic, and requesting snacks "as payment."`,
    hint: 'Bravery sometimes looks like making the Google Doc.'
  },
  {
    id: 'ee_diary_narrator_mode',
    minAge: 10,
    maxAge: 15,
    icon: '📓',
    title: '{childName} starts narrating life like it\'s a diary',
    body: `You overhear {childName} muttering, "Day 432 of living with my parents..."

They are describing a completely normal request (putting socks in the hamper) like it's an epic tragedy.

You are unsure whether to laugh, cry, or ask for editorial notes.`,
    hint: 'Everyone is the main character at this age.'
  }
];

// Generic "after" lines (picked per event + choice)
export const MOVIE_POPUP_OK_AFTER = [
  "You nod slowly and decide this is just your life now.",
  "You add it to the mental scrapbook and keep walking.",
  "You choose peace. Peace looks like pretending you didn't see it.",
  "You take a photo, because nobody will believe you.",
  "You blink. They blink. The moment passes.",
  "You say, 'Okay.' It is the most honest word you know.",
  "You file it under: 'Weird, but harmless.'",
  "You breathe out and move on. Parenting is improv.",
  "You decide to laugh later. For now: cleanup.",
  "You accept that your household has lore now."
];

export const MOVIE_POPUP_SCOLD_AFTER = [
  "You deliver The Speech™, complete with hand gestures.",
  "You set a clear limit. It lands... eventually.",
  "You scold them. They look mildly sorry and deeply unbothered.",
  "You go firm. You keep it short. You try not to turn it into a whole saga.",
  "You point at the mess like it's evidence in court.",
  "You remind them actions have consequences. They ask what 'consequences' tastes like.",
  "You lay down the rule. They test it within 12 minutes.",
  "You raise an eyebrow so powerful it counts as parenting.",
  "You say, 'Absolutely not.' They say, 'Absolutely yes.'",
  "You enforce the boundary. You're tired, but you do it anyway."
];

export const MOVIE_POPUP_TALK_AFTER = [
  "You sit down, name what happened, and draw a simple line.",
  "You talk it through. Somehow, that helps more than you expected.",
  "You ask what they were thinking. They answer honestly. You both learn something.",
  "You keep your tone calm and your limit clear. It's harder than it should be.",
  "You turn it into a teachable moment without turning it into a lecture.",
  "You listen first. They soften. You still hold the boundary.",
  "You repair the moment. Not perfect—real.",
  "You validate the feeling and redirect the behavior. They don't love it... but it works.",
  "You do the long way: connection, then structure.",
  "You both walk away a little calmer and a little wiser."
];