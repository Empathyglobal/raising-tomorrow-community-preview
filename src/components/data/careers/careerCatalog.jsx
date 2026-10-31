// Canonical Career Catalog
// Centralized list of all careers/jobs used by the game. No gameplay logic here.

export const CAREER_CATALOG = [
  // Special
  {
    id: "government_assistance",
    title: "On Government Assistance",
    emoji: "\ud83c\udfdb\ufe0f",
    minEducation: "high_school",
    fields: [],
    baseYearlyIncome: 1000,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.2,
    blurb: "Fixed assistance income.",
    levels: [{ title: "On Government Assistance", incomeMult: 1.0 }]
  },
  {
    id: "stay_at_home_parent",
    title: "Stay-at-Home Parent",
    emoji: "\ud83c\udfe1",
    minEducation: "high_school",
    fields: [],
    baseYearlyIncome: 0,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0.2,
    parentStressDelta: -0.4,
    blurb: "You run the home front. More Focus each year, but fewer career perks.",
    levels: [{ title: "Stay-at-Home Parent", incomeMult: 1.0 }]
    },
    {
    id: "survivor",
    title: "Survivor",
    emoji: "🧟",
    minEducation: "high_school",
    fields: [],
    hidden: true,
    baseYearlyIncome: 1000,
    childDeltas: { discipline: 1, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.5,
    blurb: "Apocalypse work: scavenging, repairs, trading, and keeping people alive. Doesn't pay much, but it's real.",
    levels: [{ title: "Survivor", incomeMult: 1.0 }]
    },
    {
    id: "zombie",
    title: "Zombie",
    emoji: "🧟‍♀️",
    minEducation: "high_school",
    fields: [],
    baseYearlyIncome: 0,
    hidden: true,
    childDeltas: {},
    parentLoveDelta: 0,
    parentStressDelta: 0,
    blurb: "Unemployed (undead).",
    levels: [{ title: "Zombie", incomeMult: 1.0 }]
    },
    {
    id: "active_duty_military",
    title: "Active Duty",
    emoji: "🪖",
    minEducation: "high_school",
    fields: [],
    baseYearlyIncome: 6000,
    childDeltas: { discipline: 1, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.45,
    blurb: "Rotations, orders, and logistics. Stability comes from routines.",
    levels: [
     { title: "Enlisted", incomeMult: 1.0 },
     { title: "Senior Enlisted", incomeMult: 1.2 },
     { title: "NCO", incomeMult: 1.45 }
    ]
    },
    {
    id: "supreme_leader",
    title: "Supreme Leader",
    emoji: "🟥",
    minEducation: "high_school",
    fields: [],
    baseYearlyIncome: 25000,
    hidden: true,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.35,
    blurb: "You rule a palace-state. Succession is a parenting style now.",
    levels: [{ title: "Supreme Leader", incomeMult: 1.0 }]
    },

  // High school
  {
    id: 'retail_associate',
    title: 'Retail',
    emoji: '\ud83d\udecd\ufe0f',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 2893,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.35,
    blurb: 'Lots of people. Lots of little moments to model confidence.',
    levels: [
      { title: 'Retail Associate', incomeMult: 1.0 },
      { title: 'Senior Associate', incomeMult: 1.15 },
      { title: 'Shift Lead', incomeMult: 1.35 },
      { title: 'Assistant Manager', incomeMult: 1.6 },
      { title: 'Store Manager', incomeMult: 2.0 }
    ]
  },
  {
    id: 'food_service',
    title: 'Food Service',
    emoji: '\ud83c\udf54',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 2476,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.5,
    blurb: 'Fast pace. Thick skin. Tiny empathy lessons at home.',
    levels: [
      { title: 'Server', incomeMult: 1.0 },
      { title: 'Lead Server', incomeMult: 1.2 },
      { title: 'Shift Supervisor', incomeMult: 1.4 },
      { title: 'Manager', incomeMult: 1.7 },
      { title: 'General Manager', incomeMult: 2.0 }
    ]
  },
  {
    id: 'delivery_driver',
    title: 'Delivery',
    emoji: '\ud83d\ude9a',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 3267,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.25,
    blurb: 'Always moving. You get good at small routines and quick repairs.',
    levels: [
      { title: 'Driver', incomeMult: 1.0 },
      { title: 'Lead Driver', incomeMult: 1.2 },
      { title: 'Route Supervisor', incomeMult: 1.45 },
      { title: 'Operations Manager', incomeMult: 1.7 },
      { title: 'Fleet Manager', incomeMult: 2.0 }
    ]
  },
  {
    id: 'call_center',
    title: 'Call Center',
    emoji: '\ud83d\udcde',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 3019,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.4,
    blurb: 'Scripts, metrics, and emotional labor.',
    levels: [
      { title: 'Agent', incomeMult: 1.0 },
      { title: 'Senior Agent', incomeMult: 1.2 },
      { title: 'Team Lead', incomeMult: 1.45 },
      { title: 'Supervisor', incomeMult: 1.7 },
      { title: 'Operations Manager', incomeMult: 2.0 }
    ]
  },
  {
    id: 'telemarketer',
    title: 'Telemarketer',
    emoji: '\u260e\ufe0f',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 2590,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.6,
    blurb: 'Cold calls, scripts, and rejection management. High burnout potential.',
    levels: [
      { title: 'Caller', incomeMult: 1.0 },
      { title: 'Senior Caller', incomeMult: 1.2 },
      { title: 'Team Lead', incomeMult: 1.45 }
    ]
  },
  {
    id: 'warehouse',
    title: 'Warehouse',
    emoji: '\ud83d\udce6',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 3341,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.3,
    blurb: 'Physical work. Early shifts. Steady routines.',
    levels: [
      { title: 'Warehouse Worker', incomeMult: 1.0 },
      { title: 'Lead Worker', incomeMult: 1.2 },
      { title: 'Inventory Specialist', incomeMult: 1.4 },
      { title: 'Warehouse Supervisor', incomeMult: 1.65 },
      { title: 'Operations Manager', incomeMult: 1.95 }
    ]
  },
  {
    id: 'office_assistant',
    title: 'Office Assistant',
    emoji: '\ud83d\udccb',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 3148,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.3,
    blurb: 'Administrative work. Organization matters.',
    levels: [
      { title: 'Assistant', incomeMult: 1.0 },
      { title: 'Senior Assistant', incomeMult: 1.2 },
      { title: 'Office Manager', incomeMult: 1.5 },
      { title: 'Operations Manager', incomeMult: 1.8 },
      { title: 'Director of Operations', incomeMult: 2.1 }
    ]
  },
  {
    id: 'sales_rep',
    title: 'Sales Representative',
    emoji: '\ud83d\udcca',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 4383,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.4,
    blurb: 'Persuasion and persistence.',
    levels: [
      { title: 'Sales Rep', incomeMult: 1.0 },
      { title: 'Senior Sales Rep', incomeMult: 1.3 },
      { title: 'Sales Manager', incomeMult: 1.65 },
      { title: 'Regional Sales Director', incomeMult: 2.0 },
      { title: 'VP of Sales', incomeMult: 2.4 }
    ]
  },
  {
    id: 'adult_entertainer',
    title: 'Adult Entertainer (18+)',
    emoji: '\ud83c\udfad',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 3620,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.7,
    blurb: '18+. Work emphasizes boundaries, privacy, stigma awareness, and safety.',
    levels: [
      { title: 'Performer', incomeMult: 1.0 },
      { title: 'Featured Performer', incomeMult: 1.3 },
      { title: 'Headliner', incomeMult: 1.6 }
    ]
  },
  {
    id: 'escort_companion',
    title: 'Escort / Companion (18+)',
    emoji: '\ud83c\udf19',
    minEducation: 'high_school',
    fields: [],
    baseYearlyIncome: 4210,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.8,
    blurb: '18+. Controversial; reputation risk; strong focus on safety planning and personal boundaries.',
    levels: [
      { title: 'Companion', incomeMult: 1.0 },
      { title: 'Private Client Companion', incomeMult: 1.35 },
      { title: 'Premier Companion', incomeMult: 1.7 }
    ]
  },

  // Trade Jobs
  {
    id: 'mechanic',
    title: 'Mechanic',
    emoji: '\ud83d\udd27',
    minEducation: 'trade',
    fields: [],
    baseYearlyIncome: 5214,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.3,
    blurb: 'Problem-solving, diagnostics, and real skills.',
    levels: [
      { title: 'Apprentice Mechanic', incomeMult: 1.0 },
      { title: 'Mechanic', incomeMult: 1.25 },
      { title: 'Senior Mechanic', incomeMult: 1.5 },
      { title: 'Lead Mechanic', incomeMult: 1.8 },
      { title: 'Shop Manager', incomeMult: 2.1 }
    ]
  },
  {
    id: 'electrician',
    title: 'Electrician',
    emoji: '\u26a1',
    minEducation: 'trade',
    fields: [],
    baseYearlyIncome: 5798,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.3,
    blurb: 'Precision work. Safety first.',
    levels: [
      { title: 'Apprentice', incomeMult: 1.0 },
      { title: 'Journeyman', incomeMult: 1.3 },
      { title: 'Master Electrician', incomeMult: 1.6 },
      { title: 'Lead Electrician', incomeMult: 1.85 },
      { title: 'Contractor', incomeMult: 2.2 }
    ]
  },
  {
    id: 'plumber',
    title: 'Plumber',
    emoji: '\ud83d\udebf',
    minEducation: 'trade',
    fields: [],
    baseYearlyIncome: 5673,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.25,
    blurb: 'Always in demand. Real skills.',
    levels: [
      { title: 'Apprentice', incomeMult: 1.0 },
      { title: 'Plumber', incomeMult: 1.25 },
      { title: 'Master Plumber', incomeMult: 1.55 },
      { title: 'Lead Plumber', incomeMult: 1.8 },
      { title: 'Contractor', incomeMult: 2.15 }
    ]
  },
  {
    id: 'chef',
    title: 'Chef',
    emoji: '\ud83d\udc68\u200d\ud83c\udf73',
    isSpecialCareer: true,
    specialTrackId: 'culinary',
    minEducation: 'trade',
    fields: [],
    baseYearlyIncome: 4689,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
    parentLoveDelta: 0.1,
    parentStressDelta: 0.6,
    blurb: 'Creativity under pressure. Late nights.',
    levels: [
      { title: 'Line Cook', incomeMult: 1.0 },
      { title: 'Station Chef', incomeMult: 1.25 },
      { title: 'Sous Chef', incomeMult: 1.5 },
      { title: 'Head Chef', incomeMult: 1.8 },
      { title: 'Executive Chef', incomeMult: 2.1 }
    ]
  },
  {
    id: 'police_officer',
    title: 'Police Officer',
    emoji: '\ud83d\udc6e',
    isSpecialCareer: true,
    specialTrackId: 'police',
    minEducation: 'trade',
    fields: [],
    baseYearlyIncome: 6412,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.8,
    blurb: 'Public service. High stress. Structure.',
    levels: [
      { title: 'Officer', incomeMult: 1.0 },
      { title: 'Corporal', incomeMult: 1.2 },
      { title: 'Sergeant', incomeMult: 1.45 },
      { title: 'Lieutenant', incomeMult: 1.7 },
      { title: 'Captain', incomeMult: 2.0 }
    ]
  },
  {
    id: 'firefighter',
    title: 'Firefighter',
    emoji: '\ud83d\ude92',
    minEducation: 'trade',
    fields: [],
    baseYearlyIncome: 6158,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 0 },
    parentLoveDelta: 0.05,
    parentStressDelta: 0.7,
    blurb: 'Courage, teamwork, and unpredictable shifts.',
    levels: [
      { title: 'Firefighter', incomeMult: 1.0 },
      { title: 'Driver/Engineer', incomeMult: 1.2 },
      { title: 'Lieutenant', incomeMult: 1.45 },
      { title: 'Captain', incomeMult: 1.7 },
      { title: 'Battalion Chief', incomeMult: 2.0 }
    ]
  },

  // Associate
  {
    id: 'paralegal',
    title: 'Paralegal',
    emoji: '\ud83d\udcd1',
    minEducation: 'associate',
    fields: ['law_policy'],
    baseYearlyIncome: 7183,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.35,
    blurb: 'Legal work without the courtroom drama.',
    levels: [
      { title: 'Paralegal', incomeMult: 1.0 },
      { title: 'Senior Paralegal', incomeMult: 1.25 },
      { title: 'Lead Paralegal', incomeMult: 1.5 },
      { title: 'Paralegal Manager', incomeMult: 1.75 },
      { title: 'Director of Paralegal Services', incomeMult: 2.0 }
    ]
  },

  // Fame Careers (High School entry)
  {
    id: 'actor',
    title: 'Actor',
    emoji: '\ud83c\udfac',
    isSpecialCareer: true,
    specialTrackId: 'acting',
    minEducation: 'high_school',
    fields: ['arts'],
    baseYearlyIncome: 3800,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.5,
    blurb: 'Auditions, side gigs, and your kid accidentally books the room.',
    levels: [
      { title: 'Background Extra', incomeMult: 1.0 },
      { title: 'Commercial Actor', incomeMult: 1.3 },
      { title: 'TV Supporting', incomeMult: 1.6 },
      { title: 'TV Lead', incomeMult: 2.0 },
      { title: 'Film Star', incomeMult: 2.4 },
      { title: 'A\u2011List Icon', incomeMult: 2.8 }
    ]
  },
  {
    id: 'musician',
    title: 'Musician',
    emoji: '\ud83c\udfb8',
    isSpecialCareer: true,
    specialTrackId: 'music',
    hidden: true,
    minEducation: 'high_school',
    fields: ['arts'],
    baseYearlyIncome: 3200,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0.05,
    parentStressDelta: 0.55,
    blurb: 'Late nights, early school drop-offs, and one chorus that won\u2019t leave.',
    levels: [
      { title: 'Open Mic Regular', incomeMult: 1.0 },
      { title: 'Local Gig Hero', incomeMult: 1.3 },
      { title: 'Touring Artist', incomeMult: 1.7 },
      { title: 'Charting Artist', incomeMult: 2.1 },
      { title: 'Stadium Headliner', incomeMult: 2.5 },
      { title: 'Living Legend', incomeMult: 2.8 }
    ]
  },
  {
    id: 'content_creator',
    title: 'Content Creator',
    emoji: '\ud83d\udce3',
    isSpecialCareer: true,
    specialTrackId: 'social_media',
    hidden: true,
    minEducation: 'high_school',
    fields: ['arts','business'],
    baseYearlyIncome: 3000,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.4,
    blurb: 'You accidentally build an audience between bedtime and dishes.',
    levels: [
      { title: 'Nano Creator', incomeMult: 1.0 },
      { title: 'Micro Influencer', incomeMult: 1.3 },
      { title: 'Mid\u2011Tier Creator', incomeMult: 1.6 },
      { title: 'Verified Creator', incomeMult: 2.0 },
      { title: 'Brand Magnet', incomeMult: 2.3 },
      { title: 'Household Name', incomeMult: 2.6 }
    ]
  },

  // Bachelor
  {
    id: 'teacher',
    title: 'Teacher',
    emoji: '\ud83c\udf4e',
    minEducation: 'bachelors',
    fields: ['education', 'social'],
    baseYearlyIncome: 7842,
    childDeltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0.1,
    parentStressDelta: 0.25,
    blurb: "You bring home explanations, patience, and 'let's try again.'",
    levels: [
      { title: 'Teacher', incomeMult: 1.0 },
      { title: 'Senior Teacher', incomeMult: 1.2 },
      { title: 'Department Lead', incomeMult: 1.4 },
      { title: 'Assistant Principal', incomeMult: 1.65 },
      { title: 'Principal', incomeMult: 1.95 }
    ]
  },
  {
    id: 'instructional_designer',
    title: 'Instructional Designer',
    emoji: '\ud83e\uddf9',
    minEducation: 'bachelors',
    fields: ['education', 'business', 'arts'],
    baseYearlyIncome: 11250,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0.1,
    parentStressDelta: 0.25,
    blurb: 'You turn messy ideas into clear learning. You also can\'t stop optimizing everything.',
    levels: [
      { title: 'Junior Instructional Designer', incomeMult: 1.0 },
      { title: 'Instructional Designer', incomeMult: 1.2 },
      { title: 'Senior Instructional Designer', incomeMult: 1.4 },
      { title: 'Learning Experience Lead', incomeMult: 1.65 },
      { title: 'Director of Learning', incomeMult: 1.9 }
    ]
  },
  {
    id: 'school_counselor',
    title: 'School Counselor',
    emoji: '\ud83e\udde0',
    minEducation: 'masters',
    fields: ['education', 'social'],
    baseYearlyIncome: 10200,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 },
    parentLoveDelta: 0.15,
    parentStressDelta: 0.35,
    blurb: 'You help kids untangle feelings and choices—then come home and notice everything.',
    levels: [
      { title: 'Counselor', incomeMult: 1.0 },
      { title: 'Senior Counselor', incomeMult: 1.15 },
      { title: 'Lead Counselor', incomeMult: 1.3 },
      { title: 'Student Services Coordinator', incomeMult: 1.55 },
      { title: 'Director of Student Support', incomeMult: 1.8 }
    ]
  },
  {
    id: 'school_administrator',
    title: 'School Administrator',
    emoji: '\ud83c\udfd7\ufe0f',
    minEducation: 'masters',
    fields: ['education', 'business'],
    baseYearlyIncome: 12500,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
    parentLoveDelta: 0.05,
    parentStressDelta: 0.45,
    blurb: 'Schedules, budgets, parents, fires (metaphorical). You run a small civilization.',
    levels: [
      { title: 'Administrator', incomeMult: 1.0 },
      { title: 'Assistant Principal', incomeMult: 1.2 },
      { title: 'Principal', incomeMult: 1.45 },
      { title: 'District Administrator', incomeMult: 1.75 },
      { title: 'Superintendent', incomeMult: 2.1 }
    ]
  },
  {
    id: 'librarian',
    title: 'Librarian',
    emoji: '\ud83d\udcda',
    minEducation: 'bachelors',
    fields: ['education', 'arts'],
    baseYearlyIncome: 8800,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0.1,
    parentStressDelta: 0.2,
    blurb: 'You bring home book magic and calm energy. Also: deep opinions about noise levels.',
    levels: [
      { title: 'Librarian', incomeMult: 1.0 },
      { title: 'Senior Librarian', incomeMult: 1.15 },
      { title: 'Head Librarian', incomeMult: 1.35 },
      { title: 'Library Director', incomeMult: 1.6 },
      { title: 'Regional Library Director', incomeMult: 1.85 }
    ]
  },
  {
    id: 'edtech_specialist',
    title: 'EdTech Specialist',
    emoji: '\ud83d\udcbb',
    minEducation: 'bachelors',
    fields: ['education', 'stem'],
    baseYearlyIncome: 11800,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0.05,
    parentStressDelta: 0.3,
    blurb: 'You bring home tools, hacks, and "try turning it off and on" energy.',
    levels: [
      { title: 'EdTech Specialist', incomeMult: 1.0 },
      { title: 'Senior EdTech Specialist', incomeMult: 1.2 },
      { title: 'EdTech Coordinator', incomeMult: 1.4 },
      { title: 'Director of EdTech', incomeMult: 1.7 },
      { title: 'Chief Learning Officer', incomeMult: 2.0 }
    ]
  },
  {
    id: 'curriculum_writer',
    title: 'Curriculum Writer',
    emoji: '\u270d\ufe0f',
    minEducation: 'bachelors',
    fields: ['education', 'arts'],
    baseYearlyIncome: 10600,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0.05,
    parentStressDelta: 0.25,
    blurb: 'You design learning paths and secretly critique every worksheet you see.',
    levels: [
      { title: 'Curriculum Writer', incomeMult: 1.0 },
      { title: 'Senior Curriculum Writer', incomeMult: 1.2 },
      { title: 'Curriculum Lead', incomeMult: 1.4 },
      { title: 'Program Director', incomeMult: 1.7 },
      { title: 'VP of Curriculum', incomeMult: 2.0 }
    ]
  },
  {
    id: 'special_education_teacher',
    title: 'Special Education Teacher',
    emoji: '\ud83d\udc1b',
    minEducation: 'bachelors',
    fields: ['education', 'social'],
    baseYearlyIncome: 9200,
    childDeltas: { intelligence: 0, empathy: 2, discipline: 0, confidence: 0 },
    parentLoveDelta: 0.15,
    parentStressDelta: 0.5,
    blurb: 'You bring patience home in bulk. It matters. It\'s also a lot.',
    levels: [
      { title: 'Special Ed Teacher', incomeMult: 1.0 },
      { title: 'Senior Special Ed Teacher', incomeMult: 1.15 },
      { title: 'IEP Coordinator', incomeMult: 1.35 },
      { title: 'Student Support Lead', incomeMult: 1.6 },
      { title: 'Director of Special Services', incomeMult: 1.9 }
    ]
  },
  {
    id: 'nurse',
    title: 'Nurse',
    emoji: '\ud83e\ude7a',
    minEducation: 'bachelors',
    fields: ['health'],
    baseYearlyIncome: 11963,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.6,
    blurb: 'Care work is meaningful \u2014 and exhausting. Home needs decompression.',
    levels: [
      { title: 'RN', incomeMult: 1.0 },
      { title: 'Charge Nurse', incomeMult: 1.25 },
      { title: 'Nurse Manager', incomeMult: 1.5 },
      { title: 'Director of Nursing', incomeMult: 1.8 },
      { title: 'Chief Nursing Officer', incomeMult: 2.1 }
    ]
  },
  {
    id: 'software_engineer',
    title: 'Software Engineer',
    emoji: '\ud83d\udcbb',
    minEducation: 'bachelors',
    fields: ['stem'],
    baseYearlyIncome: 14836,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.4,
    blurb: 'Problem-solving energy... and the urge to "debug" feelings.',
    levels: [
      { title: 'Junior Engineer', incomeMult: 1.0 },
      { title: 'Software Engineer', incomeMult: 1.3 },
      { title: 'Senior Engineer', incomeMult: 1.6 },
      { title: 'Staff Engineer', incomeMult: 1.9 },
      { title: 'Principal Engineer', incomeMult: 2.3 }
    ]
  },
  {
    id: 'accountant',
    title: 'Accountant',
    emoji: '\ud83d\udcca',
    minEducation: 'bachelors',
    fields: ['business'],
    baseYearlyIncome: 10874,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.25,
    blurb: 'Structure spills over. (So do checklists.)',
    levels: [
      { title: 'Accountant', incomeMult: 1.0 },
      { title: 'Senior Accountant', incomeMult: 1.25 },
      { title: 'Accounting Manager', incomeMult: 1.5 },
      { title: 'Controller', incomeMult: 1.8 },
      { title: 'CFO', incomeMult: 2.2 }
    ]
  },
  {
    id: 'graphic_designer',
    title: 'Graphic Designer',
    emoji: '\ud83c\udfa8',
    minEducation: 'bachelors',
    fields: ['arts', 'business'],
    baseYearlyIncome: 8318,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0.05,
    parentStressDelta: 0.2,
    blurb: 'Creativity becomes normal. Critique becomes a household skill.',
    levels: [
      { title: 'Junior Designer', incomeMult: 1.0 },
      { title: 'Designer', incomeMult: 1.25 },
      { title: 'Senior Designer', incomeMult: 1.5 },
      { title: 'Lead Designer', incomeMult: 1.75 },
      { title: 'Creative Director', incomeMult: 2.1 }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing',
    emoji: '\ud83d\udce3',
    minEducation: 'bachelors',
    fields: ['business', 'arts'],
    baseYearlyIncome: 9783,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    parentLoveDelta: 0,
    parentStressDelta: 0.35,
    blurb: 'Campaigns, metrics, and creativity.',
    levels: [
      { title: 'Marketing Coordinator', incomeMult: 1.0 },
      { title: 'Marketing Specialist', incomeMult: 1.25 },
      { title: 'Marketing Manager', incomeMult: 1.5 },
      { title: 'Director of Marketing', incomeMult: 1.8 },
      { title: 'CMO', incomeMult: 2.2 }
    ]
  },
  {
    id: 'hr_specialist',
    title: 'HR Specialist',
    emoji: '\ud83e\uddd1\u200d\ud83d\udcbc',
    minEducation: 'bachelors',
    fields: ['business', 'social'],
    baseYearlyIncome: 9287,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0.05,
    parentStressDelta: 0.4,
    blurb: 'People problems become your daily bread.',
    levels: [
      { title: 'HR Coordinator', incomeMult: 1.0 },
      { title: 'HR Specialist', incomeMult: 1.2 },
      { title: 'HR Manager', incomeMult: 1.5 },
      { title: 'HR Director', incomeMult: 1.8 },
      { title: 'CHRO', incomeMult: 2.15 }
    ]
  },
  {
    id: 'project_manager',
    title: 'Project Manager',
    emoji: '\ud83d\udccb',
    minEducation: 'bachelors',
    fields: ['business', 'stem'],
    baseYearlyIncome: 12846,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.5,
    blurb: 'Timelines, stakeholders, and controlled chaos.',
    levels: [
      { title: 'Assistant PM', incomeMult: 1.0 },
      { title: 'Project Manager', incomeMult: 1.3 },
      { title: 'Senior PM', incomeMult: 1.6 },
      { title: 'Program Manager', incomeMult: 1.9 },
      { title: 'Director of PMO', incomeMult: 2.2 }
    ]
  },
  {
    id: 'ux_designer',
    title: 'UX Designer',
    emoji: '\ud83c\udfaf',
    minEducation: 'bachelors',
    fields: ['arts', 'stem'],
    baseYearlyIncome: 13213,
    childDeltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.3,
    blurb: 'Empathy meets design. User needs become a lens.',
    levels: [
      { title: 'Junior UX Designer', incomeMult: 1.0 },
      { title: 'UX Designer', incomeMult: 1.3 },
      { title: 'Senior UX Designer', incomeMult: 1.6 },
      { title: 'Lead UX Designer', incomeMult: 1.9 },
      { title: 'Head of Design', incomeMult: 2.3 }
    ]
  },
  {
    id: 'financial_analyst',
    title: 'Financial Analyst',
    emoji: '\ud83d\udcb9',
    minEducation: 'bachelors',
    fields: ['business'],
    baseYearlyIncome: 12593,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.4,
    blurb: 'Numbers, forecasts, and spreadsheets.',
    levels: [
      { title: 'Analyst', incomeMult: 1.0 },
      { title: 'Senior Analyst', incomeMult: 1.3 },
      { title: 'Finance Manager', incomeMult: 1.6 },
      { title: 'Finance Director', incomeMult: 1.9 },
      { title: 'VP of Finance', incomeMult: 2.3 }
    ]
  },
  {
    id: 'social_worker',
    title: 'Social Worker',
    emoji: '\ud83e\udd1d',
    minEducation: 'bachelors',
    fields: ['social'],
    baseYearlyIncome: 8547,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0.15,
    parentStressDelta: 0.6,
    blurb: 'You help families. Your own needs that same energy.',
    levels: [
      { title: 'Case Worker', incomeMult: 1.0 },
      { title: 'Social Worker', incomeMult: 1.2 },
      { title: 'Senior Social Worker', incomeMult: 1.45 },
      { title: 'Program Director', incomeMult: 1.7 },
      { title: 'Director of Social Services', incomeMult: 2.0 }
    ]
  },
  {
    id: 'journalist',
    title: 'Journalist',
    emoji: '\ud83d\udcf0',
    minEducation: 'bachelors',
    fields: ['arts'],
    baseYearlyIncome: 8031,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.4,
    blurb: 'Stories, deadlines, and truth-seeking.',
    levels: [
      { title: 'Reporter', incomeMult: 1.0 },
      { title: 'Staff Writer', incomeMult: 1.2 },
      { title: 'Senior Reporter', incomeMult: 1.45 },
      { title: 'Editor', incomeMult: 1.7 },
      { title: 'Managing Editor', incomeMult: 2.0 }
    ]
  },
  {
    id: 'civil_engineer',
    title: 'Civil Engineer',
    emoji: '\ud83c\udfd7\ufe0f',
    minEducation: 'bachelors',
    fields: ['stem'],
    baseYearlyIncome: 13517,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.35,
    blurb: 'Infrastructure, planning, and long timelines.',
    levels: [
      { title: 'Junior Engineer', incomeMult: 1.0 },
      { title: 'Engineer', incomeMult: 1.3 },
      { title: 'Senior Engineer', incomeMult: 1.6 },
      { title: 'Project Engineer', incomeMult: 1.9 },
      { title: 'Chief Engineer', incomeMult: 2.3 }
    ]
  },

  // Advanced (masters+)
  {
    id: 'physical_therapist',
    title: 'Physical Therapist',
    emoji: '\ud83e\uddb4',
    minEducation: 'masters',
    fields: ['health'],
    baseYearlyIncome: 14372,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0.05,
    parentStressDelta: 0.4,
    blurb: 'Movement, recovery, and patience.',
    levels: [
      { title: 'PT', incomeMult: 1.0 },
      { title: 'Senior PT', incomeMult: 1.25 },
      { title: 'Lead Therapist', incomeMult: 1.5 },
      { title: 'Clinical Director', incomeMult: 1.75 },
      { title: 'Practice Owner', incomeMult: 2.1 }
    ]
  },
  {
    id: 'psychologist',
    title: 'Psychologist',
    emoji: '\ud83e\udde0',
    minEducation: 'masters',
    fields: ['social', 'health'],
    baseYearlyIncome: 13916,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0.15,
    parentStressDelta: 0.35,
    blurb: 'You listen for feelings. Your kid feels... seen.',
    levels: [
      { title: 'Therapist', incomeMult: 1.0 },
      { title: 'Licensed Psychologist', incomeMult: 1.25 },
      { title: 'Senior Psychologist', incomeMult: 1.5 },
      { title: 'Clinical Director', incomeMult: 1.75 },
      { title: 'Practice Owner', incomeMult: 2.1 }
    ]
  },
  {
    id: 'data_scientist',
    title: 'Data Scientist',
    emoji: '\ud83d\udcc8',
    minEducation: 'masters',
    fields: ['stem', 'business', 'science'],
    baseYearlyIncome: 16847,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.45,
    blurb: 'Patterns everywhere. You accidentally optimize snack time.',
    levels: [
      { title: 'Data Analyst', incomeMult: 1.0 },
      { title: 'Data Scientist', incomeMult: 1.3 },
      { title: 'Senior Data Scientist', incomeMult: 1.6 },
      { title: 'Lead Data Scientist', incomeMult: 1.9 },
      { title: 'Head of Data', incomeMult: 2.3 }
    ]
  },
  {
    id: 'pharmacist',
    title: 'Pharmacist',
    emoji: '\ud83d\udc8a',
    minEducation: 'masters',
    fields: ['health'],
    baseYearlyIncome: 18947,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.3,
    blurb: 'Precision, responsibility, and retail reality.',
    levels: [
      { title: 'Staff Pharmacist', incomeMult: 1.0 },
      { title: 'Senior Pharmacist', incomeMult: 1.2 },
      { title: 'Pharmacy Manager', incomeMult: 1.5 },
      { title: 'District Manager', incomeMult: 1.8 },
      { title: 'Regional Director', incomeMult: 2.1 }
    ]
  },
  {
    id: 'professor',
    title: 'Professor',
    emoji: '\ud83c\udf93',
    minEducation: 'phd',
    fields: ['education', 'science', 'stem'],
    baseYearlyIncome: 15628,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.4,
    blurb: 'Research, teaching, and academic politics.',
    levels: [
      { title: 'Assistant Professor', incomeMult: 1.0 },
      { title: 'Associate Professor', incomeMult: 1.3 },
      { title: 'Full Professor', incomeMult: 1.6 },
      { title: 'Endowed Chair', incomeMult: 1.9 },
      { title: 'Department Chair', incomeMult: 2.2 }
    ]
  },
  {
    id: 'lawyer',
    title: 'Lawyer',
    emoji: '\u2696\ufe0f',
    minEducation: 'jd',
    fields: ['law_policy', 'business'],
    baseYearlyIncome: 19764,
    childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
    parentLoveDelta: -0.05,
    parentStressDelta: 0.9,
    blurb: 'Argument skills, precision, and "objection!" energy.',
    levels: [
      { title: 'Associate', incomeMult: 1.0 },
      { title: 'Attorney', incomeMult: 1.3 },
      { title: 'Senior Attorney', incomeMult: 1.65 },
      { title: 'Partner', incomeMult: 2.0 },
      { title: 'Managing Partner', incomeMult: 2.5 }
    ]
  },
  {
    id: 'veterinarian',
    title: 'Veterinarian',
    emoji: '\ud83d\udc3e',
    minEducation: 'dvm',
    fields: ['health'],
    baseYearlyIncome: 21458,
    childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: 0.1,
    parentStressDelta: 0.7,
    blurb: 'Animals, empathy, and heartbreak.',
    levels: [
      { title: 'Associate Vet', incomeMult: 1.0 },
      { title: 'Veterinarian', incomeMult: 1.3 },
      { title: 'Senior Veterinarian', incomeMult: 1.6 },
      { title: 'Practice Owner', incomeMult: 1.85 },
      { title: 'Multi-Practice Owner', incomeMult: 2.2 }
    ]
  },
  {
    id: 'dentist',
    title: 'Dentist',
    emoji: '\ud83e\uddb7',
    minEducation: 'dds',
    fields: ['health'],
    baseYearlyIncome: 23173,
    childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
    parentLoveDelta: 0,
    parentStressDelta: 0.6,
    blurb: 'Precision work. Clean outcomes.',
    levels: [
      { title: 'Associate Dentist', incomeMult: 1.0 },
      { title: 'General Dentist', incomeMult: 1.3 },
      { title: 'Senior Dentist', incomeMult: 1.6 },
      { title: 'Practice Owner', incomeMult: 1.9 },
      { title: 'Multi-Practice Owner', incomeMult: 2.3 }
    ]
  },
  {
    id: 'doctor',
    title: 'Doctor',
    emoji: '\ud83e\ude7b',
    minEducation: 'md',
    fields: ['health'],
    baseYearlyIncome: 23847,
    childDeltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
    parentLoveDelta: -0.05,
    parentStressDelta: 1.0,
    blurb: 'High responsibility. High stress. Big resources. Boundaries required.',
    levels: [
      { title: 'Resident', incomeMult: 1.0 },
      { title: 'Attending', incomeMult: 1.35 },
      { title: 'Senior Physician', incomeMult: 1.65 },
      { title: 'Department Head', incomeMult: 1.95 },
      { title: 'Chief of Medicine', incomeMult: 2.3 }
    ]
  },

  // Law & Public Policy expansion
  {
   id: 'legal_assistant',
   title: 'Legal Assistant',
   emoji: '🖇️',
   minEducation: 'high_school',
   fields: ['law_policy'],
   baseYearlyIncome: 4100,
   childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.4,
   blurb: 'Paperwork, deadlines, and small wins that teach follow-through.',
   levels: [
     { title: 'Legal Assistant', incomeMult: 1.0 },
     { title: 'Senior Legal Assistant', incomeMult: 1.2 },
     { title: 'Case Coordinator', incomeMult: 1.45 },
     { title: 'Office Manager', incomeMult: 1.7 },
     { title: 'Firm Operations Lead', incomeMult: 2.0 }
   ]
  },
  {
   id: 'court_clerk',
   title: 'Court Clerk',
   emoji: '🗄️',
   minEducation: 'high_school',
   fields: ['law_policy'],
   baseYearlyIncome: 3950,
   childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.35,
   blurb: 'Schedules, filings, and being calm in serious rooms.',
   levels: [
     { title: 'Clerk', incomeMult: 1.0 },
     { title: 'Senior Clerk', incomeMult: 1.2 },
     { title: 'Docket Coordinator', incomeMult: 1.45 },
     { title: 'Court Administrator', incomeMult: 1.7 },
     { title: 'Chief Clerk', incomeMult: 2.0 }
   ]
  },
  {
   id: 'campaign_staffer',
   title: 'Campaign Staffer',
   emoji: '🗳️',
   minEducation: 'high_school',
   fields: ['law_policy'],
   baseYearlyIncome: 3600,
   childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 },
   parentLoveDelta: 0,
   parentStressDelta: 0.6,
   blurb: 'Long days, big energy, and learning how to talk to strangers.',
   levels: [
     { title: 'Canvasser', incomeMult: 1.0 },
     { title: 'Field Organizer', incomeMult: 1.25 },
     { title: 'Campaign Staffer', incomeMult: 1.5 },
     { title: 'Deputy Campaign Manager', incomeMult: 1.85 },
     { title: 'Campaign Manager', incomeMult: 2.2 }
   ]
  },
  {
   id: 'legislative_aide',
   title: 'Legislative Aide',
   emoji: '📝',
   minEducation: 'bachelors',
   fields: ['law_policy'],
   baseYearlyIncome: 9800,
   childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
   parentLoveDelta: 0,
   parentStressDelta: 0.55,
   blurb: 'Meetings, notes, fast pivots, and learning how systems really work.',
   levels: [
     { title: 'Legislative Assistant', incomeMult: 1.0 },
     { title: 'Policy Aide', incomeMult: 1.2 },
     { title: 'Senior Aide', incomeMult: 1.45 },
     { title: 'Chief of Staff', incomeMult: 1.8 },
     { title: 'Legislative Director', incomeMult: 2.1 }
   ]
  },
  {
   id: 'policy_analyst',
   title: 'Policy Analyst',
   emoji: '📜',
   minEducation: 'bachelors',
   fields: ['law_policy'],
   baseYearlyIncome: 11500,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.45,
   blurb: 'Research, trade-offs, and the art of "this will have consequences."',
   levels: [
     { title: 'Analyst', incomeMult: 1.0 },
     { title: 'Senior Analyst', incomeMult: 1.2 },
     { title: 'Policy Lead', incomeMult: 1.45 },
     { title: 'Policy Manager', incomeMult: 1.75 },
     { title: 'Director of Policy', incomeMult: 2.1 }
   ]
  },
  {
   id: 'compliance_officer',
   title: 'Compliance Officer',
   emoji: '✅',
   minEducation: 'bachelors',
   fields: ['law_policy', 'business'],
   baseYearlyIncome: 13200,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.4,
   blurb: 'Rules, audits, and preventing disasters before they happen.',
   levels: [
     { title: 'Compliance Analyst', incomeMult: 1.0 },
     { title: 'Compliance Officer', incomeMult: 1.25 },
     { title: 'Senior Officer', incomeMult: 1.5 },
     { title: 'Compliance Manager', incomeMult: 1.8 },
     { title: 'Chief Compliance Officer', incomeMult: 2.2 }
   ]
  },
  {
   id: 'diplomat',
   title: 'Diplomat',
   emoji: '🌐',
   minEducation: 'bachelors',
   fields: ['law_policy'],
   baseYearlyIncome: 14100,
   childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 },
   parentLoveDelta: 0,
   parentStressDelta: 0.55,
   blurb: 'Relationships, negotiation, and staying polite under pressure.',
   levels: [
     { title: 'Junior Diplomat', incomeMult: 1.0 },
     { title: 'Foreign Service Officer', incomeMult: 1.25 },
     { title: 'Senior Officer', incomeMult: 1.55 },
     { title: 'Consul', incomeMult: 1.9 },
     { title: 'Ambassador', incomeMult: 2.3 }
   ]
  },
  {
   id: 'mediator',
   title: 'Mediator',
   emoji: '🕊️',
   minEducation: 'masters',
   fields: ['law_policy', 'social'],
   baseYearlyIncome: 15000,
   childDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 },
   parentLoveDelta: 0.05,
   parentStressDelta: 0.3,
   blurb: 'You turn conflict into a plan. At home, you notice every tone shift.',
   levels: [
     { title: 'Mediator', incomeMult: 1.0 },
     { title: 'Senior Mediator', incomeMult: 1.2 },
     { title: 'Lead Mediator', incomeMult: 1.45 },
     { title: 'Arbitration Specialist', incomeMult: 1.75 },
     { title: 'Director of Resolution Services', incomeMult: 2.05 }
   ]
  },
  {
   id: 'public_administrator',
   title: 'Public Administrator',
   emoji: '🏢',
   minEducation: 'masters',
   fields: ['law_policy', 'business'],
   baseYearlyIncome: 15500,
   childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
   parentLoveDelta: 0,
   parentStressDelta: 0.55,
   blurb: 'Budgets, services, and trying to make a city actually function.',
   levels: [
     { title: 'Program Administrator', incomeMult: 1.0 },
     { title: 'Senior Administrator', incomeMult: 1.2 },
     { title: 'Department Manager', incomeMult: 1.45 },
     { title: 'Deputy Director', incomeMult: 1.8 },
     { title: 'City Manager', incomeMult: 2.2 }
   ]
  },
  {
   id: 'public_defender',
   title: 'Public Defender',
   emoji: '🛡️',
   minEducation: 'jd',
   fields: ['law_policy', 'social'],
   baseYearlyIncome: 18200,
   childDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 1.0,
   blurb: 'High stakes, heavy stories, and learning to recharge at home.',
   levels: [
     { title: 'Public Defender', incomeMult: 1.0 },
     { title: 'Senior Defender', incomeMult: 1.2 },
     { title: 'Lead Defender', incomeMult: 1.45 },
     { title: 'Unit Chief', incomeMult: 1.8 },
     { title: 'Chief Public Defender', incomeMult: 2.1 }
   ]
  },
  {
   id: 'prosecutor',
   title: 'Prosecutor',
   emoji: '⚖️',
   minEducation: 'jd',
   fields: ['law_policy'],
   baseYearlyIncome: 20500,
   childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
   parentLoveDelta: -0.05,
   parentStressDelta: 0.95,
   blurb: 'Pressure, precision, and decisions that follow you home.',
   levels: [
     { title: 'Assistant DA', incomeMult: 1.0 },
     { title: 'Prosecutor', incomeMult: 1.25 },
     { title: 'Senior Prosecutor', incomeMult: 1.55 },
     { title: 'Deputy DA', incomeMult: 1.9 },
     { title: 'District Attorney', incomeMult: 2.3 }
   ]
  },

  // Science & Research expansion
  {
   id: 'lab_technician',
   title: 'Lab Technician',
   emoji: '🧪',
   minEducation: 'associate',
   fields: ['science'],
   baseYearlyIncome: 8200,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.35,
   blurb: 'Samples, protocols, and the quiet pride of clean results.',
   levels: [
     { title: 'Lab Tech', incomeMult: 1.0 },
     { title: 'Senior Lab Tech', incomeMult: 1.2 },
     { title: 'Lab Coordinator', incomeMult: 1.45 },
     { title: 'QA Specialist', incomeMult: 1.7 },
     { title: 'Lab Manager', incomeMult: 2.0 }
   ]
  },
  {
   id: 'research_assistant',
   title: 'Research Assistant',
   emoji: '🔎',
   minEducation: 'bachelors',
   fields: ['science'],
   baseYearlyIncome: 9000,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
   parentLoveDelta: 0.05,
   parentStressDelta: 0.35,
   blurb: 'You chase answers and learn that patience is a skill.',
   levels: [
     { title: 'Research Assistant', incomeMult: 1.0 },
     { title: 'Research Associate', incomeMult: 1.2 },
     { title: 'Senior Research Associate', incomeMult: 1.45 },
     { title: 'Project Scientist', incomeMult: 1.75 },
     { title: 'Research Lead', incomeMult: 2.05 }
   ]
  },
  {
   id: 'environmental_scientist',
   title: 'Environmental Scientist',
   emoji: '🌿',
   minEducation: 'bachelors',
   fields: ['science'],
   baseYearlyIncome: 10800,
   childDeltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
   parentLoveDelta: 0.05,
   parentStressDelta: 0.35,
   blurb: 'Fieldwork, reports, and learning to care without burning out.',
   levels: [
     { title: 'Environmental Scientist', incomeMult: 1.0 },
     { title: 'Senior Scientist', incomeMult: 1.25 },
     { title: 'Field Lead', incomeMult: 1.5 },
     { title: 'Program Manager', incomeMult: 1.8 },
     { title: 'Director of Sustainability', incomeMult: 2.1 }
   ]
  },
  {
   id: 'chemist',
   title: 'Chemist',
   emoji: '⚗️',
   minEducation: 'bachelors',
   fields: ['science'],
   baseYearlyIncome: 12300,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.45,
   blurb: 'Precision, experiments, and learning to trust your process.',
   levels: [
     { title: 'Chemist', incomeMult: 1.0 },
     { title: 'Senior Chemist', incomeMult: 1.25 },
     { title: 'Lab Lead', incomeMult: 1.5 },
     { title: 'R&D Manager', incomeMult: 1.85 },
     { title: 'Director of R&D', incomeMult: 2.2 }
   ]
  },
  {
   id: 'biologist',
   title: 'Biologist',
   emoji: '🧬',
   minEducation: 'bachelors',
   fields: ['science'],
   baseYearlyIncome: 11800,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
   parentLoveDelta: 0.05,
   parentStressDelta: 0.4,
   blurb: 'Living systems, messy data, and big curiosity.',
   levels: [
     { title: 'Biologist', incomeMult: 1.0 },
     { title: 'Senior Biologist', incomeMult: 1.25 },
     { title: 'Research Lead', incomeMult: 1.55 },
     { title: 'Program Scientist', incomeMult: 1.85 },
     { title: 'Research Director', incomeMult: 2.15 }
   ]
  },
  {
   id: 'geologist',
   title: 'Geologist',
   emoji: '🪨',
   minEducation: 'bachelors',
   fields: ['science'],
   baseYearlyIncome: 12500,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.45,
   blurb: 'Rocks, risk maps, and learning to read the planet.',
   levels: [
     { title: 'Geologist', incomeMult: 1.0 },
     { title: 'Senior Geologist', incomeMult: 1.25 },
     { title: 'Field Supervisor', incomeMult: 1.55 },
     { title: 'Exploration Lead', incomeMult: 1.9 },
     { title: 'Director of Geoscience', incomeMult: 2.25 }
   ]
  },
  {
   id: 'science_communicator',
   title: 'Science Communicator',
   emoji: '🎙️',
   minEducation: 'bachelors',
   fields: ['science', 'arts'],
   baseYearlyIncome: 9800,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 1 },
   parentLoveDelta: 0.05,
   parentStressDelta: 0.25,
   blurb: 'You translate complex ideas into stories people can actually hear.',
   levels: [
     { title: 'Science Writer', incomeMult: 1.0 },
     { title: 'Science Communicator', incomeMult: 1.2 },
     { title: 'Senior Communicator', incomeMult: 1.45 },
     { title: 'Public Affairs Lead', incomeMult: 1.75 },
     { title: 'Head of Communications', incomeMult: 2.05 }
   ]
  },
  {
   id: 'research_scientist',
   title: 'Research Scientist',
   emoji: '🔬',
   minEducation: 'masters',
   fields: ['science', 'stem'],
   baseYearlyIncome: 16000,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.55,
   blurb: 'You run studies, manage chaos, and learn what "replication" feels like at home.',
   levels: [
     { title: 'Research Scientist', incomeMult: 1.0 },
     { title: 'Senior Scientist', incomeMult: 1.25 },
     { title: 'Staff Scientist', incomeMult: 1.55 },
     { title: 'Principal Scientist', incomeMult: 1.9 },
     { title: 'Research Director', incomeMult: 2.3 }
   ]
  },
  {
   id: 'epidemiologist',
   title: 'Epidemiologist',
   emoji: '🦠',
   minEducation: 'masters',
   fields: ['science', 'health'],
   baseYearlyIncome: 16500,
   childDeltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.65,
   blurb: 'Patterns, prevention, and the weight of public outcomes.',
   levels: [
     { title: 'Epidemiologist', incomeMult: 1.0 },
     { title: 'Senior Epidemiologist', incomeMult: 1.25 },
     { title: 'Program Lead', incomeMult: 1.55 },
     { title: 'Division Director', incomeMult: 1.9 },
     { title: 'Chief Epidemiologist', incomeMult: 2.25 }
   ]
  },
  {
   id: 'astronomer',
   title: 'Astronomer',
   emoji: '🪐',
   isSpecialCareer: true,
   specialTrackId: 'aerospace',
   hidden: true,
   minEducation: 'phd',
   fields: ['science'],
   baseYearlyIncome: 17000,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
   parentLoveDelta: 0,
   parentStressDelta: 0.5,
   blurb: 'Long nights, long questions, and wonder you can\'t turn off.',
   levels: [
     { title: 'Postdoc', incomeMult: 1.0 },
     { title: 'Research Astronomer', incomeMult: 1.25 },
     { title: 'Senior Astronomer', incomeMult: 1.55 },
     { title: 'Observatory Scientist', incomeMult: 1.9 },
     { title: 'Principal Astronomer', incomeMult: 2.2 }
   ]
  },
  {
   id: 'principal_investigator',
   title: 'Principal Investigator',
   emoji: '🧫',
   minEducation: 'phd',
   fields: ['science', 'stem'],
   baseYearlyIncome: 19000,
   childDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 1 },
   parentLoveDelta: 0,
   parentStressDelta: 0.75,
   blurb: 'Grants, teams, and the nonstop responsibility of being the final answer.',
   levels: [
     { title: 'PI', incomeMult: 1.0 },
     { title: 'Senior PI', incomeMult: 1.25 },
     { title: 'Lab Director', incomeMult: 1.55 },
     { title: 'Center Director', incomeMult: 1.95 },
     { title: 'Institute Director', incomeMult: 2.35 }
   ]
  },

  // Outdoor / fitness flavor
  {
   id: 'park_ranger',
   title: 'Park Ranger',
   emoji: '🌲',
   minEducation: 'bachelors',
   fields: ['science', 'law_policy'],
   baseYearlyIncome: 8900,
   childDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 0 },
   parentLoveDelta: 0.05,
   parentStressDelta: 0.3,
   blurb: 'Public service in nature. Boundaries, safety, and a love for the outdoors.',
   levels: [
     { title: 'Ranger', incomeMult: 1.0 },
     { title: 'Senior Ranger', incomeMult: 1.2 },
     { title: 'Lead Ranger', incomeMult: 1.45 },
     { title: 'District Ranger', incomeMult: 1.75 },
     { title: 'Park Superintendent', incomeMult: 2.05 }
   ]
  },
  {
   id: 'bungee_jump_instructor',
   title: 'Bungee Jump Instructor',
   emoji: '🪂',
   minEducation: 'high_school',
   fields: ['health'],
   baseYearlyIncome: 3500,
   childDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
   parentLoveDelta: 0.05,
   parentStressDelta: 0.55,
   blurb: 'Adrenaline, safety checks, and teaching courage without recklessness.',
   levels: [
     { title: 'Assistant Instructor', incomeMult: 1.0 },
     { title: 'Instructor', incomeMult: 1.2 },
     { title: 'Lead Instructor', incomeMult: 1.45 },
     { title: 'Safety Manager', incomeMult: 1.7 },
     { title: 'Adventure Ops Lead', incomeMult: 2.0 }
   ]
  },
  {
   id: 'scuba_instructor',
   title: 'Scuba Instructor',
   emoji: '🤿',
   minEducation: 'trade',
   fields: ['health'],
   baseYearlyIncome: 5200,
   childDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
   parentLoveDelta: 0.05,
   parentStressDelta: 0.45,
   blurb: 'Calm under pressure. Safety-first energy that follows you home.',
   levels: [
     { title: 'Dive Guide', incomeMult: 1.0 },
     { title: 'Instructor', incomeMult: 1.2 },
     { title: 'Master Instructor', incomeMult: 1.45 },
     { title: 'Dive Shop Manager', incomeMult: 1.7 },
     { title: 'Resort Dive Director', incomeMult: 2.0 }
   ]
  },
  {
   id: 'yoga_instructor',
   title: 'Yoga Instructor',
   emoji: '🧘',
   minEducation: 'trade',
   fields: ['health'],
   baseYearlyIncome: 4800,
   childDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 0 },
   parentLoveDelta: 0.1,
   parentStressDelta: 0.25,
   blurb: 'Breath, routines, and finding calm in chaos.',
   levels: [
     { title: 'Instructor', incomeMult: 1.0 },
     { title: 'Senior Instructor', incomeMult: 1.15 },
     { title: 'Studio Lead', incomeMult: 1.35 },
     { title: 'Program Director', incomeMult: 1.6 },
     { title: 'Studio Owner', incomeMult: 1.9 }
   ]
   },
   {
   id: 'aerospace_program',
   title: 'Space Agency (Aerospace)',
   emoji: '🚀',
   isSpecialCareer: true,
   specialTrackId: 'aerospace',
   archetype: 'space',
   minEducation: 'bachelors',
   fields: ['stem', 'science'],
   baseYearlyIncome: 14500,
   childDeltas: { intelligence: 0.8, discipline: 0.4, creativity: 0.2 },
   parentStressDelta: 0.9,
   parentLoveDelta: 0,
   blurb: 'Rockets, research, and the kind of paperwork that can literally explode.',
   levels: [
     { title: 'Mission Intern', incomeMult: 0.75 },
     { title: 'Aerospace Specialist', incomeMult: 1.0 },
     { title: 'Flight Systems Lead', incomeMult: 1.25 },
     { title: 'Mission Director', incomeMult: 1.55 },
     { title: 'Program Chief', incomeMult: 1.9 },
     { title: 'Legendary Space Architect', incomeMult: 2.35 }
   ]
   },
   {
   id: 'tech_innovator',
   title: 'Tech Innovator',
   emoji: '🧲',
   isSpecialCareer: true,
   specialTrackId: 'tech',
   minEducation: 'bachelors',
   fields: ['stem', 'science', 'business'],
   baseYearlyIncome: 15000,
   childDeltas: { intelligence: 0.6, creativity: 0.6, discipline: 0.2 },
   parentLoveDelta: 0,
   parentStressDelta: 0.8,
   blurb: 'Prototypes, patents, and experiments that probably violate several warranties.',
   levels: [
     { title: 'Garage Tinkerer', incomeMult: 0.8 },
     { title: 'Startup Engineer', incomeMult: 1.05 },
     { title: 'Senior Engineer', incomeMult: 1.35 },
     { title: 'Lead Inventor', incomeMult: 1.7 },
     { title: 'Lab Director', incomeMult: 2.05 },
     { title: 'Tech Icon', incomeMult: 2.55 }
   ]
   },
   {
   id: 'bounty_hunter',
   title: 'Bounty Hunter',
   emoji: '🎯',
   isSpecialCareer: true,
   specialTrackId: 'bounty',
   minEducation: 'high_school',
   fields: ['law_policy'],
   baseYearlyIncome: 8500,
   childDeltas: { discipline: 0.4, empathy: -0.1, resilience: 0.5 },
   parentLoveDelta: 0,
   parentStressDelta: 1.2,
   blurb: 'Tracking, negotiating, and sometimes sprinting while wearing uncomfortable boots.',
   levels: [
     { title: 'Skip Tracer', incomeMult: 0.85 },
     { title: 'Recovery Agent', incomeMult: 1.05 },
     { title: 'Licensed Bounty Hunter', incomeMult: 1.35 },
     { title: 'Elite Tracker', incomeMult: 1.7 },
     { title: 'Legendary Tracker', incomeMult: 2.15 }
   ]
   },
   {
   id: 'space_contractor',
   title: 'Private Space Contractor',
   emoji: '🛰️',
   isSpecialCareer: true,
   specialTrackId: 'aerospace',
   archetype: 'space',
   minEducation: 'bachelors',
   fields: ['stem', 'science', 'business'],
   baseYearlyIncome: 18200,
   childDeltas: { intelligence: 1, confidence: 1, discipline: 0, empathy: 0 },
   parentStressDelta: 0.9,
   parentLoveDelta: -0.05,
   blurb: 'Commercial launch windows, investor calls, and risk hiding in the margins.',
   levels: [
     { title: 'Aerospace Engineer', incomeMult: 1.0 },
     { title: 'Mission Ops Lead', incomeMult: 1.28 },
     { title: 'Commercial Astronaut Candidate', incomeMult: 1.55 },
     { title: 'Commercial Astronaut', incomeMult: 1.85 },
     { title: 'Flight Lead', incomeMult: 2.15 },
     { title: 'Program Director', incomeMult: 2.55 }
   ]
   }
   ];