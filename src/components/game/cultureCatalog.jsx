// Seed content for Culture & Heritage feature

export const CULTURE_LEVELS = [
  { level: 1, name: "Seed", min: 0, max: 99 },
  { level: 2, name: "Sprout", min: 100, max: 249 },
  { level: 3, name: "Rooting", min: 250, max: 499 },
  { level: 4, name: "Grounded", min: 500, max: 799 },
  { level: 5, name: "Flourishing", min: 800, max: 1199 },
  { level: 6, name: "Storykeeper", min: 1200, max: 1699 },
  { level: 7, name: "Tradition Builder", min: 1700, max: 2299 },
  { level: 8, name: "Community Connector", min: 2300, max: 2999 },
  { level: 9, name: "Heritage Guide", min: 3000, max: 3999 },
  { level: 10, name: "Legacy Maker", min: 4000, max: 999999 }
];

export const CULTURE_REWARDS = [
  { id: 'holiday_bonus', name: 'Holiday Kit Bonus', type: 'HolidayKitBonus' },
  { id: 'story_pack', name: 'Story Prompts Pack', type: 'StoryPromptsPack' },
  { id: 'language_pack', name: 'Language Play Pack', type: 'LanguagePlayPack' },
  { id: 'tradition_spotlight', name: 'Family Tradition Spotlight', type: 'TraditionSpotlight' },
  { id: 'memory_page', name: 'Memory Page', type: 'MemoryPage' }
];

export const TEACH_TEMPLATES = [
  {
    id: "teach_name_story",
    title: "The Family Name Story",
    type: "Teach",
    focus: ["Stories & history", "Family values"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 10,
    points: 20,
    description: "Tell the story of your family name(s) and what they mean to you.",
    whatYoullDo: [
      "Share what your family calls itself (last names, clan names, chosen names, nicknames).",
      "Explain where the name comes from (if you know), or what you hope it represents.",
      "Invite your child to ask questions—and to make up a 'family motto.'"
    ],
    whatToSay: "Names carry stories. Some are old, some are chosen, and some are love names. Our name matters because…",
    makeItYours: "Add a photo of a relative, a map pin, or a simple timeline ('grandma → you → them').",
    quickWin: "Ask: 'If our family were a team, what would we be called?' Write it down."
  },
  {
    id: "teach_phrases",
    title: "Hello, Thank You, I Love You",
    type: "Teach",
    focus: ["Language"],
    ageRanges: ["Baby", "Toddler", "Preschool", "School Age"],
    time: 5,
    points: 10,
    description: "Teach three phrases in a heritage language (or a language you want at home).",
    whatYoullDo: [
      "Choose 3 phrases (hello, thank you, I love you).",
      "Say them together 3 times.",
      "Use them once today in real life."
    ],
    whatToSay: "Let’s learn words that make people feel safe and loved.",
    makeItYours: "Record a voice note of the phrases in your pronunciation.",
    quickWin: "Teach just 'hello' and use it at breakfast."
  },
  {
    id: "teach_ingredient",
    title: "Kitchen Culture: One Ingredient, One Story",
    type: "Teach",
    focus: ["Food & cooking", "Stories & history"],
    ageRanges: ["Toddler", "Preschool", "School Age"],
    time: 15,
    points: 25,
    description: "Pick one ingredient connected to your culture and tell its story.",
    whatYoullDo: [
      "Choose an ingredient (rice, beans, plantain, lentils, corn, herbs—anything meaningful).",
      "Show it, smell it, touch it.",
      "Share where it shows up in your family’s food and why it matters."
    ],
    whatToSay: "This ingredient shows up in our home because…",
    makeItYours: "Add your own 'family way' of cooking it—there’s no single correct version.",
    quickWin: "Just open the spice jar, smell it, and name it together."
  },
  {
    id: "teach_song",
    title: "Music Minute: One Song That Feels Like Home",
    type: "Teach",
    focus: ["Music & dance"],
    ageRanges: ["Baby", "Toddler", "Preschool", "School Age", "Tween", "Teen"],
    time: 10,
    points: 20,
    description: "Share one song connected to your culture and talk about how it feels.",
    whatYoullDo: [
      "Play one song.",
      "Ask: 'What do you notice?' (beat, instruments, mood)",
      "Move together for 30 seconds—dance, sway, clap, or tap."
    ],
    whatToSay: "Culture lives in sound. There’s no right way to move.",
    makeItYours: "Start a 'Home Songs' playlist.",
    quickWin: "Play 30 seconds and do a silly one-move dance."
  },
  {
    id: "teach_value",
    title: "A Value We Carry",
    type: "Teach",
    focus: ["Family values"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 10,
    points: 20,
    description: "Choose one value your culture/family emphasizes and make it visible.",
    whatYoullDo: [
      "Pick one value: hospitality, respect, courage, generosity, faith, education, community, resilience, joy.",
      "Tell one small example from your life.",
      "Ask your child to name how they can practice it today."
    ],
    whatToSay: "In our family, we practice ______ when we…",
    makeItYours: "Create a simple 'value sign' to put on the fridge.",
    quickWin: "Name the value at bedtime and one tiny example from today."
  },
  {
    id: "teach_story",
    title: "Storytime: The 'When I Was Little' Story",
    type: "Teach",
    focus: ["Stories & history"],
    ageRanges: ["Toddler", "Preschool", "School Age"],
    time: 10,
    points: 20,
    description: "Tell a short story from your childhood connected to culture or family.",
    whatYoullDo: [
      "Tell a story with 3 parts: place, people, feeling.",
      "Keep it warm and simple.",
      "Invite a question at the end."
    ],
    whatToSay: "When I was your age, we used to… It felt like…",
    makeItYours: "Add one object (photo, clothing, recipe card) to make it tangible.",
    quickWin: "Tell only the 'place' and 'feeling' in 60 seconds."
  },
  {
    id: "teach_two_homes",
    title: "Two Homes, One Heart",
    type: "Teach",
    focus: ["Family values", "Stories & history"],
    cultureAffinity: ["Universal"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 15,
    points: 30,
    description: "Help your child hold multiple cultures without choosing sides.",
    whatYoullDo: [
      "Name the cultures present in your family (or influences you value).",
      "Say: 'We don’t have to pick. We get to carry.'",
      "Create a 'both/and' statement: 'We are ___ and ___.'"
    ],
    whatToSay: "You can belong to more than one place. Belonging can be wide.",
    makeItYours: "Draw a heart with sections labeled by culture, people, places, foods, languages.",
    quickWin: "Say one sentence: 'In our family, we are both/and.'"
  },
  {
    id: "teach_map",
    title: "Map Moment: Where Our People Are From",
    type: "Teach",
    focus: ["Nature & place", "Stories & history"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 10,
    points: 20,
    description: "Use a map (paper or phone) to place your culture on the globe.",
    whatYoullDo: [
      "Find the place(s) connected to your culture(s).",
      "Point to where you live now.",
      "Say one thing you love about each place (real or imagined)."
    ],
    whatToSay: "People move for many reasons. What matters is we carry love forward.",
    makeItYours: "Add a pin and write one word for each place (food, song, value).",
    quickWin: "Point to one place and say: 'This is part of our story.'"
  },
  {
    id: "teach_proverb",
    title: "Proverb or Saying of the Week",
    type: "Teach",
    focus: ["Language", "Family values"],
    ageRanges: ["School Age", "Tween", "Teen"],
    time: 10,
    points: 20,
    description: "Share a proverb/saying from your culture (or make one together).",
    whatYoullDo: [
      "Share a short saying you heard growing up, or find one from a family member.",
      "Explain what it means in everyday life.",
      "Ask: 'When could we use this?'"
    ],
    whatToSay: "This saying reminds us to…",
    makeItYours: "Make a 'family version' in your own words.",
    quickWin: "Pick one word from the saying and define it together."
  },
  {
    id: "teach_craft",
    title: "Handmade Culture: A Simple Craft With Meaning",
    type: "Teach",
    focus: ["Art & crafts"],
    ageRanges: ["Toddler", "Preschool", "School Age"],
    time: 30,
    points: 35,
    description: "Make a simple craft inspired by your family tradition (no perfection needed).",
    whatYoullDo: [
      "Pick a symbol: a flower, color, pattern, flag, bead, textile, paper fold, or motif.",
      "Create it using paper, markers, tape, scraps, or clay.",
      "Name what it represents for your family."
    ],
    whatToSay: "This shape/color/pattern reminds me of…",
    makeItYours: "Use household materials—culture isn’t 'fancy supplies.'",
    quickWin: "Draw the symbol and name it."
  },
  {
    id: "teach_elders",
    title: "Elders & Ancestors: Gratitude Moment",
    type: "Teach",
    focus: ["Stories & history", "Faith & spirituality"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 10,
    points: 20,
    description: "A gentle gratitude moment for elders/ancestors or people who came before.",
    whatYoullDo: [
      "Name 1–3 people you want to honor (known or unknown).",
      "Say what you’re grateful for (strength, love, sacrifice, joy).",
      "Invite your child to add one."
    ],
    whatToSay: "We remember the people who helped us get here.",
    makeItYours: "Keep it secular or spiritual—your choice.",
    quickWin: "Say one name and one thank you."
  },
  {
    id: "teach_labels",
    title: "Language Play: Label 5 Things",
    type: "Teach",
    focus: ["Language"],
    ageRanges: ["Toddler", "Preschool", "School Age"],
    time: 5,
    points: 10,
    description: "Label five household items in a heritage language (or your chosen language).",
    whatYoullDo: [
      "Pick 5 items (door, water, spoon, book, shoes).",
      "Say each word together.",
      "Make it a silly game: point-fast, whisper, robot voice."
    ],
    whatToSay: "Let’s practice like a game, not a test.",
    makeItYours: "Write sticky notes if you want—optional.",
    quickWin: "Do just 2 items."
  },
  {
    id: "teach_holiday_warmup",
    title: "Holiday Warm-Up: Why We Celebrate",
    type: "Teach",
    focus: ["Holidays & rituals", "Stories & history"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 10,
    points: 20,
    description: "Before any holiday, teach the 'why' in one simple sentence.",
    whatYoullDo: [
      "Choose an upcoming holiday your family cares about.",
      "Say what it celebrates (light, freedom, renewal, gratitude, ancestors, community).",
      "Ask your child what they want the holiday to feel like."
    ],
    whatToSay: "This holiday is about ______. I want it to feel like ______.",
    makeItYours: "If you’re reconnecting, it’s okay to keep it simple and honest.",
    quickWin: "One sentence: 'We celebrate because…'"
  },
  {
    id: "teach_clothing",
    title: "Clothing & Identity: What We Wear and Why",
    type: "Teach",
    focus: ["Stories & history", "Art & crafts"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 10,
    points: 20,
    description: "Talk about a clothing item connected to culture (or an everyday item with meaning).",
    whatYoullDo: [
      "Pick an item (scarf, hat, jewelry, fabric, jersey, uniform, or anything meaningful).",
      "Share when it’s worn and what it represents.",
      "Let your child try it on (if appropriate)."
    ],
    whatToSay: "Some clothes are everyday. Some are special. All can carry meaning.",
    makeItYours: "Avoid rules—focus on respect and context.",
    quickWin: "Hold the item and name one memory."
  },
  {
    id: "teach_ceremony",
    title: "A Tiny Ceremony: A Weekly 'Blessing'",
    type: "Teach",
    focus: ["Faith & spirituality", "Family values"],
    ageRanges: ["Baby", "Toddler", "Preschool", "School Age", "Tween", "Teen"],
    time: 5,
    points: 10,
    description: "Create a weekly moment of care (secular or spiritual) that repeats.",
    whatYoullDo: [
      "Choose a phrase you’ll say weekly (a blessing, affirmation, or wish).",
      "Say it together at the same time each week.",
      "Add one small gesture: hand on heart, hug, candle, breath."
    ],
    whatToSay: "May we be safe. May we be kind. May we remember who we are.",
    makeItYours: "Keep it aligned with your beliefs.",
    quickWin: "Say one sentence and a hug."
  }
];

export const PARTICIPATE_TEMPLATES = [
  {
    id: "part_market",
    title: "Cultural Market / Grocery Adventure",
    type: "Participate",
    focus: ["Food & cooking", "Community & events"],
    ageRanges: ["Toddler", "Preschool", "School Age", "Tween", "Teen"],
    time: 30,
    points: 35,
    description: "Visit a market or store connected to your culture, or do a themed aisle tour.",
    whatYoullDo: [
      "Pick 3 items you’ve never tried together.",
      "Ask your child to choose one item.",
      "At home, taste and rate it: 'Love / Like / Maybe / Not yet.'"
    ],
    whatToSay: null,
    dayOf: [
      "What smells new?",
      "What color do you notice most?",
      "What would you cook with this?"
    ],
    quickWin: "Do it at home: pick one pantry item and tell its story."
  },
  {
    id: "part_community",
    title: "Community Moment: One Gathering",
    type: "Participate",
    focus: ["Community & events"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 60,
    points: 60,
    description: "Attend one gathering—service, festival, meetup, class, or family event.",
    whatYoullDo: [
      "Choose a gathering that feels safe and welcoming.",
      "Set a small goal: 'Say hello to one person.'",
      "After, do a 2-minute reflection together."
    ],
    whatToSay: "What felt familiar? What felt new? What do we want more of?",
    quickWin: "Join a virtual event for 10 minutes."
  },
  {
    id: "part_museum",
    title: "Museum or Cultural Center Day",
    type: "Participate",
    focus: ["Stories & history", "Nature & place"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 60,
    points: 60,
    description: "Visit a museum exhibit, cultural center, or heritage site—or do a virtual tour.",
    whatYoullDo: [
      "Pick one thing to 'adopt' for the day (object, photo, painting).",
      "Ask: 'What do you think its story is?'",
      "Take a photo (optional) and name it."
    ],
    whatToSay: null,
    quickWin: "Look at one photo online and invent its story kindly and respectfully."
  },
  {
    id: "part_language_meetup",
    title: "Language Meetup (or Language Date at Home)",
    type: "Participate",
    focus: ["Language", "Community & events"],
    ageRanges: ["Preschool", "School Age", "Tween", "Teen"],
    time: 30,
    points: 40,
    description: "Join a language group—or create a 15-minute 'language date' at home.",
    whatYoullDo: [
      "Choose 5 phrases for the day.",
      "Use them during one routine (meal, bath, bedtime).",
      "Celebrate effort, not accuracy."
    ],
    whatToSay: null,
    quickWin: "Use 1 phrase all day long."
  },
  {
    id: "part_elders_call",
    title: "Family Elders Call",
    type: "Participate",
    focus: ["Stories & history", "Community & events"],
    ageRanges: ["Toddler", "Preschool", "School Age", "Tween", "Teen"],
    time: 15,
    points: 30,
    description: "Call a family member and ask one gentle culture question.",
    whatYoullDo: [
      "What food reminds you of home?",
      "What song did you love as a kid?",
      "What do you want our child to remember?"
    ],
    whatToSay: null,
    quickWin: "Send a voice message with one question."
  },
  {
    id: "part_cook_dish",
    title: "Cook One Dish Together",
    type: "Participate",
    focus: ["Food & cooking"],
    ageRanges: ["Toddler", "Preschool", "School Age", "Tween", "Teen"],
    time: 60,
    points: 60,
    description: "Cook a dish connected to your culture, or a dish your family repeats with love.",
    whatYoullDo: [
      "Assign roles: washer, stirrer, taste tester, timer.",
      "Share one memory connected to the dish.",
      "Name your 'family version' proudly."
    ],
    whatToSay: null,
    quickWin: "Make a snack plate using one cultural ingredient."
  },
  {
    id: "part_music_party",
    title: "Music & Dance Mini-Party",
    type: "Participate",
    focus: ["Music & dance"],
    ageRanges: ["Baby", "Toddler", "Preschool", "School Age", "Tween", "Teen"],
    time: 15,
    points: 25,
    description: "Turn on music connected to your culture and move together.",
    whatYoullDo: [
      "Pick 3 songs (or 1 song on repeat).",
      "Let your child 'DJ' for one song.",
      "End with one calm breath together."
    ],
    whatToSay: null,
    quickWin: "One song counts."
  },
  {
    id: "part_decor",
    title: "Festival at Home: Decor + Color",
    type: "Participate",
    focus: ["Art & crafts", "Holidays & rituals"],
    ageRanges: ["Toddler", "Preschool", "School Age", "Tween", "Teen"],
    time: 30,
    points: 40,
    description: "Create a festive feel with color, pattern, or symbols—no perfection.",
    whatYoullDo: [
      "Pick 2 colors that feel connected to your culture/holiday.",
      "Decorate one corner (table, wall, doorway).",
      "Take a 'before/after' photo (optional)."
    ],
    whatToSay: null,
    quickWin: "Draw the colors on one page and hang it up."
  },
  {
    id: "part_serve",
    title: "Serve + Give Back (in a culturally-aligned way)",
    type: "Participate",
    focus: ["Family values", "Community & events"],
    ageRanges: ["School Age", "Tween", "Teen"],
    time: 60,
    points: 60,
    description: "Do one act of service that matches your family values.",
    whatYoullDo: [
      "Choose one: cook for someone, donate, volunteer, help a neighbor, clean a shared space.",
      "Name the value you’re practicing.",
      "Reflect: 'How did it feel to help?'"
    ],
    whatToSay: null,
    quickWin: "Write a thank-you note to someone in your community."
  }
];

export const HOLIDAY_KITS = [
  {
    id: "kit_lunar",
    title: "Holiday Kit: Lunar New Year (varies by year)",
    type: "Participate",
    isHolidayKit: true,
    month: 2,
    focus: ["Holidays & rituals"],
    time: 25,
    points: 75,
    description: "Welcome a new year with warmth, cleaning, wishes, and food.",
    whatYoullDo: [
      "Prep (15 min): Tidy one small area together ('make space for the new').",
      "Ritual (10 min): Share 3 wishes for the year (one for self, one for family, one for community).",
      "Food (optional): Eat something round or symbolic (dumplings, noodles, oranges—whatever fits your home)."
    ],
    dayOf: [
      "What do you want to grow this year?",
      "What would you like to leave behind?"
    ],
    quickWin: "One wish + one hug counts."
  },
  {
    id: "kit_diwali",
    title: "Holiday Kit: Diwali (varies by year)",
    type: "Participate",
    isHolidayKit: true,
    month: 11,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Light, hope, and homecoming—celebrate with brightness and kindness.",
    whatYoullDo: [
      "Prep: Clean one tiny spot and place a small light (candle/LED) safely.",
      "Ritual: Say one sentence: 'We choose light—hope, courage, and care.'",
      "Sweet moment: Share a treat and gratitude."
    ],
    dayOf: [
      "When did you feel proud this week?",
      "What helps you feel brave?"
    ],
    quickWin: "Light a safe candle/LED and name one gratitude."
  },
  {
    id: "kit_eid",
    title: "Holiday Kit: Eid (varies by year)",
    type: "Participate",
    isHolidayKit: true,
    month: 4,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Joy, generosity, and togetherness—celebrate with care and community.",
    whatYoullDo: [
      "Prep: Choose one act of generosity (donate, share food, help someone).",
      "Ritual: Dress up (optional) and share a 'joy photo' (optional).",
      "Family moment: Share what you’re thankful for."
    ],
    dayOf: [
      "What is one kind thing we can do today?",
      "What makes our family feel close?"
    ],
    quickWin: "Do one kind act and say: 'We share joy.'"
  },
  {
    id: "kit_nowruz",
    title: "Holiday Kit: Nowruz",
    type: "Participate",
    isHolidayKit: true,
    month: 3,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "A celebration of renewal, spring, and fresh beginnings.",
    whatYoullDo: [
      "Prep: Pick one 'new beginning' habit for the week.",
      "Ritual: Put something green in a bowl (herbs, plant, leaf) and name what you want to grow.",
      "Food: Share something fresh or green if you can."
    ],
    dayOf: [
      "What does 'new' feel like?",
      "What do you want to practice more?"
    ],
    quickWin: "One 'grow' word: 'This spring, I want to grow…'"
  },
  {
    id: "kit_passover",
    title: "Holiday Kit: Freedom & Story Night",
    type: "Participate",
    isHolidayKit: true,
    month: 4,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Tell a story of resilience and remember that people deserve dignity.",
    whatYoullDo: [
      "Ritual: Tell one family story about overcoming a hard thing (age-appropriate).",
      "Question: Ask one 'why' question at the table.",
      "Gratitude: Name one freedom you’re thankful for."
    ],
    dayOf: [
      "What helps people stay strong?",
      "How can we help someone feel safe?"
    ],
    quickWin: "Share one story in 2 minutes."
  },
  {
    id: "kit_moon",
    title: "Holiday Kit: Moon & Harvest Night",
    type: "Participate",
    isHolidayKit: true,
    month: 9,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "A cozy night to notice the moon, share food, and express gratitude.",
    whatYoullDo: [
      "Ritual: Step outside and look at the moon (or look out a window).",
      "Share: Say one thing you’re grateful for from the past season.",
      "Sweet moment: Share a treat (anything counts)."
    ],
    dayOf: [
      "What did we learn this season?",
      "What do you want to remember?"
    ],
    quickWin: "Look at the moon and say one gratitude."
  },
  {
    id: "kit_dia",
    title: "Holiday Kit: Remembering Night",
    type: "Participate",
    isHolidayKit: true,
    month: 11,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Remember loved ones with stories, photos, and gentle connection.",
    whatYoullDo: [
      "Prep: Choose 1 photo or name 1 person/pet to remember.",
      "Ritual: Tell one story that includes joy, not only sadness.",
      "Add: Place a small object that reminds you of them (flower, candle/LED, note)."
    ],
    dayOf: [
      "What did they love?",
      "What do we want to carry forward?"
    ],
    quickWin: "Say one name and one loving memory."
  },
  {
    id: "kit_hanukkah",
    title: "Holiday Kit: Light & Dedication",
    type: "Participate",
    isHolidayKit: true,
    month: 12,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Light candles (or lights) and celebrate dedication, courage, and home.",
    whatYoullDo: [
      "Ritual: Turn on a light safely and name one 'tiny light' you saw this week (kindness, effort, courage).",
      "Game/joy: Play something silly for 10 minutes.",
      "Gratitude: Thank someone in the family."
    ],
    dayOf: [
      "What does courage look like in our home?",
      "What do we keep doing even when it’s hard?"
    ],
    quickWin: "One light + one gratitude."
  },
  {
    id: "kit_christmas",
    title: "Holiday Kit: Cozy & Giving",
    type: "Participate",
    isHolidayKit: true,
    month: 12,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Make warmth, gratitude, and generosity the center.",
    whatYoullDo: [
      "Ritual: Share one 'favorite memory' from the year.",
      "Giving: Choose one small act of giving (kind note, donation, helping hands).",
      "Cozy: Hot drink/snack + music."
    ],
    dayOf: [
      "What made you feel loved this year?",
      "How do we show love in our family?"
    ],
    quickWin: "Write one kind note."
  },
  {
    id: "kit_kwanzaa",
    title: "Holiday Kit: Values Week",
    type: "Participate",
    isHolidayKit: true,
    month: 12,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Choose a value and practice it on purpose.",
    whatYoullDo: [
      "Pick one value for today (unity, self-determination, collective work, cooperative economics, purpose, creativity, faith).",
      "Do one action that matches it.",
      "Close with: 'Today we practiced ____ by ____.'"
    ],
    dayOf: [
      "What value do you want to get better at?",
      "How can we practice it tomorrow?"
    ],
    quickWin: "Name the value and one tiny action."
  },
  {
    id: "kit_holi",
    title: "Holiday Kit: Color & Joy",
    type: "Participate",
    isHolidayKit: true,
    month: 3,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Celebrate joy and togetherness with color and laughter.",
    whatYoullDo: [
      "Prep: Pick 2–3 colors and create a 'color corner' with paper/markers.",
      "Ritual: Say: 'We choose joy and kindness.'",
      "Joy: Do a 5-minute silly dance or laughter game."
    ],
    dayOf: [
      "What makes you feel joyful?",
      "How do we include others in joy?"
    ],
    quickWin: "Draw one bright color swirl and name it 'Joy.'"
  },
  {
    id: "kit_indigenous",
    title: "Holiday Kit: Land & Respect Day",
    type: "Participate",
    isHolidayKit: true,
    month: 10,
    focus: ["Holidays & rituals"],
    time: 20,
    points: 75,
    description: "Practice respect—learn, reflect, and care for place.",
    whatYoullDo: [
      "Ritual: Notice the land/place you live on (park, street, water, trees).",
      "Care: Do one act of care (pick up trash, water a plant, thank a place).",
      "Learn: Ask: 'Who has lived here, and what can we respect?'"
    ],
    dayOf: [
      "How do we show respect?",
      "What does caring look like?"
    ],
    quickWin: "Say thank you to a place and do one small care action."
  }
];