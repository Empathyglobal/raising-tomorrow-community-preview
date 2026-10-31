// OUTCOME_TEXT_BANK - Fully written text variations (NO AI generation)
// RULES:
// - Only pick from these written options + seeded RNG
// - If adding more later, only append—do not change existing strings (keeps stability)

export const OUTCOME_TEXT_BANK = {

letter: [
  // SECRET ENDING: HUMAN RESISTANCE (LAUNCH CODES)
  {
    id: "letter_resistance_01",
    requireAll: ["SPECIAL_LAUNCH_CODES", "WORLD_APOCALYPSE_AI"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nRemember that briefcase at the park?\n\nYeah. Those weren't normal 'launch codes.'\n\nA private AI weapons network called PROJECT OVERMIND used them to start the Machine War.\n\nI grew up learning to repair radios, ration food, and not trust smiling screens.\n\nNow I lead the Human Resistance. It's not a job I applied for.\n\nI'm alive. I'm stubborn. And I'm still your kid.\n\n— {childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_resistance_02",
    requireAll: ["SPECIAL_LAUNCH_CODES", "WORLD_APOCALYPSE_AI"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nYou made a choice when you were scared and tired and money sounded like oxygen.\n\nIt lit a match. The world burned.\n\nI don't know if forgiveness is a moment or a decade.\n\nBut I do know this: I survived because I learned discipline, courage, and care—somewhere along the way.\n\nI'm leading people now. I'm trying to lead differently than the machines.\n\nLove, (complicated but real),\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_resistance_03",
    requireAll: ["SPECIAL_LAUNCH_CODES", "WORLD_APOCALYPSE_AI"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nGood news: I'm famous.\n\nBad news: it's because I'm the face of the Human Resistance.\n\nWorse news: we call you 'The Briefcase Era' in the history lessons.\n\nAnyway, I'm currently negotiating a ceasefire with a toaster that thinks it's a tank.\n\nMiss you. Try not to open any more mysterious objects.\n\n— {childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_resistance_04",
    requireAll: ["SPECIAL_LAUNCH_CODES", "WORLD_APOCALYPSE_AI"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nYou traded the world for $1,000,000.\n\nIt wasn't worth it.\n\nI became the person who has to clean up the consequences.\n\nI'm strong now. I had to be.\n\n— {childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_resistance_05",
    requireAll: ["SPECIAL_LAUNCH_CODES", "WORLD_APOCALYPSE_AI"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nThe machines wanted obedience. Humans needed meaning.\n\nSo I built a movement: repairs, community, and courage.\n\nPeople think I'm brave. I think I'm just refusing to quit.\n\nIf there's anything I learned from you: repair is real.\n\n— {childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_resistance_06",
    requireAll: ["SPECIAL_LAUNCH_CODES", "WORLD_APOCALYPSE_AI"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nDay 4,382 of the Machine War.\n\nWe have reclaimed: three neighborhoods, one library, and a suspiciously intelligent vending machine.\n\nTomorrow we raid a data fortress disguised as a yoga studio.\n\nIf I win, I'm naming the new base after the park where this all started.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // SPECIAL MUSIC STAR (GOOD) LETTERS
  {
    id: "letter_music_good_01",
    requireAll: ["SPECIAL_MUSIC_STAR_GOOD"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI play for crowds now—huge ones.\n\nBut the real gift you gave me was learning how to stay grounded when emotions get loud.\n\nTouring is wild. I'm tired. I'm grateful.\n\nI try to keep my circle small and my heart soft.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_music_good_02",
    requireAll: ["SPECIAL_MUSIC_STAR_GOOD"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI'm famous in a way that still feels weird.\n\nSometimes I miss normal life. Sometimes I miss you.\n\nThank you for being the kind of parent whose voice I could hear in my head when the world got loud.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // SPECIAL MUSIC STAR (DARK) LETTERS
  {
    id: "letter_music_dark_01",
    requireAll: ["SPECIAL_MUSIC_STAR_DARK"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nFame felt like proof I mattered… until it didn't.\n\nI'm not writing this to blame you. I'm writing it because I'm trying to be honest.\n\nI got lost for a while. I'm trying to find my way back.\n\nIf you ever wonder what helps: support, boundaries, and someone who doesn't turn pain into a joke.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_music_dark_02",
    requireAll: ["SPECIAL_MUSIC_STAR_DARK"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI was talented. I was famous. I was not okay.\n\nI'm learning the hard way that success doesn't replace stability.\n\nI hope I can rebuild. I'm trying.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // SPECIAL OLYMPIC GOLD LETTERS
  {
    id: "letter_olympic_01",
    requireAll: ["SPECIAL_OLYMPIC_GOLD"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI won Olympic gold.\n\nI thought the medal would feel like the end. It didn't.\n\nIt felt like proof that boring practice matters.\n\nThank you for teaching me to keep going without shame.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_olympic_02",
    requireAll: ["SPECIAL_OLYMPIC_GOLD"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nThe medal is heavy.\n\nBut the heaviest thing was learning who I am when I'm not winning.\n\nThank you for loving me beyond the scoreboard.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // SPECIAL SUPERMODEL LETTERS
  {
    id: "letter_model_01",
    requireAll: ["SPECIAL_SUPERMODEL"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI'm on billboards now.\n\nIt's glamorous… and also weirdly lonely.\n\nThe best thing you gave me was a sense of self that doesn't disappear when people stare.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_model_02",
    requireAll: ["SPECIAL_SUPERMODEL"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI learned a hard lesson: being admired isn't the same as being loved.\n\nI'm trying to build real connection on purpose.\n\nThanks for teaching me boundaries.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // SPECIAL ADULT ENTERTAINMENT (FAMOUS) LETTERS
  {
    id: "letter_adult_famous_01",
    requireAll: ["SPECIAL_ADULT_ENTERTAINMENT_FAMOUS"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI chose a controversial adult career.\n\nPeople have opinions. Loud ones.\n\nWhat kept me safe wasn't confidence—it was boundaries and support.\n\nI wish the world judged less and protected more.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_adult_famous_02",
    requireAll: ["SPECIAL_ADULT_ENTERTAINMENT_FAMOUS"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI'm famous… in a way that comes with a shadow.\n\nI'm learning how to protect my privacy and keep my life mine.\n\nThank you for teaching me that my worth isn't a crowd's opinion.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // SPECIAL ADULT ENTERTAINMENT (OBSCURE) LETTERS
  {
    id: "letter_adult_obscure_01",
    requireAll: ["SPECIAL_ADULT_ENTERTAINMENT_OBSCURE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI tried a path that looked like freedom and felt like chaos.\n\nThe stigma was heavy and the money was inconsistent.\n\nI'm trying to pivot toward something that feels steadier.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_adult_obscure_02",
    requireAll: ["SPECIAL_ADULT_ENTERTAINMENT_OBSCURE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI learned the hard way that confidence without structure can turn into trouble.\n\nI'm working on boundaries now—real ones.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // LEGENDARY ASTEROID MINER LETTERS
  {
    id: "letter_asteroid_01",
    requireAll: ["LEGENDARY_ASTEROID_MINER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI didn't have the confidence to be a hero on camera.\n\nBut I did have the patience to do impossible work quietly.\n\nSo… I went mining asteroids. Yes, that sentence is real.\n\nEvery day out there, I used the same skills you helped me practice: calm breath, steady routines, and being good to the people trapped in a metal tube with me.\n\nIf I'm rich now, it's because you taught me how to stay steady long before the world offered rewards.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_asteroid_02",
    requireAll: ["LEGENDARY_ASTEROID_MINER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nTurns out my childhood space obsession was not a phase.\n\nI followed it… just not the glamorous way.\n\nAsteroid mining is mostly math, maintenance, and trying not to panic when alarms beep.\n\nThe best part is the team. The worst part is the freeze-dried 'dessert.'\n\nThank you for raising me with enough empathy to keep people safe and enough discipline to keep systems running.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_asteroid_03",
    requireAll: ["LEGENDARY_ASTEROID_MINER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI know you wanted a normal job title you could explain to strangers.\n\nI'm sorry. I mined space rocks for money.\n\nI'm okay. I'm weirdly happy. And yes, I still call you after big moments because I don't want to forget being human.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // LEGENDARY TIME TRAVELER LETTERS
  {
    id: "letter_time_01",
    requireAll: ["LEGENDARY_TIME_TRAVELER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nIf you're reading this, then time did the thing again.\n\nI'm sorry I left like that. I didn't mean to.\n\nOne minute I was building… the next minute the world was thousands of years earlier.\n\nI carved your name into stone so you'd know I existed.\n\nI hope you feel loved, even without answers.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_time_02",
    requireAll: ["LEGENDARY_TIME_TRAVELER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI did something impossible and it took me away.\n\nI tried to live kindly wherever I landed—even when nobody spoke my language and the stars looked wrong.\n\nIf the sculpture reaches you: that's my proof. That's my hello.\n\nI miss you.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_time_03",
    requireAll: ["LEGENDARY_TIME_TRAVELER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nPlease don't blame yourself.\n\nMy brain always chased the biggest question in the room.\n\nI just didn't expect the question to chase back.\n\nIf you ever doubt I loved you—remember: I left proof in stone.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // LEGENDARY BLOCKCRAFT 2 LETTERS
  {
    id: "letter_block_01",
    requireAll: ["LEGENDARY_BLOCKCRAFT_2"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nYou let me build ridiculous things and call them 'important.'\n\nSo I kept building.\n\nBlockcraft 2 happened because you didn't crush the weirdness out of me.\n\nIt's everywhere now. People laugh, cry, and build tiny worlds together.\n\nThank you for making home feel safe enough to create.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_block_02",
    requireAll: ["LEGENDARY_BLOCKCRAFT_2"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI made a game that took over the world.\n\nI'm sorry. And you're welcome.\n\nPeople keep asking how I did it and I want to say: 'A grown‑up once cared about my tiny progress.'\n\nAlso, yes, the game has doors that actually work now.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_block_03",
    requireAll: ["LEGENDARY_BLOCKCRAFT_2"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nYou taught me to repair after mistakes.\n\nSo when my first launch crashed, I didn't quit. I fixed it.\n\nNow Blockcraft 2 is everywhere… and I'm still just a kid who likes building worlds.\n\nThanks for believing in the process, not just the outcome.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // LEGENDARY HERO PRESIDENT LETTERS
  {
    id: "letter_hero_president_01",
    requireAll: ["LEGENDARY_HERO_PRESIDENT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI learned early that leadership isn't volume. It's presence.\n\nWhen people were emotional, you didn't try to 'win'—you tried to understand.\n\nThat pattern followed me: class president, hard conversations, rooms where everyone was tense… and I could still breathe.\n\nNow I'm President, and I still use the same skill: listening until the truth shows up.\n\nThank you for building a home where repair was normal.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_hero_president_02",
    requireAll: ["LEGENDARY_HERO_PRESIDENT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nRemember when I ran for class president and wanted a speech that sounded like a movie?\n\nYou helped me write one sentence that mattered: 'I'll listen first.'\n\nI didn't know it then, but that sentence became my whole life.\n\nI'm President now. It's intense. It's messy. But I try to lead like you parented: firm, kind, and real.\n\nAlso, I still hate making small talk at fundraisers. Some things never change.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_hero_president_03",
    requireAll: ["LEGENDARY_HERO_PRESIDENT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nPeople think confidence is never doubting yourself.\n\nYou taught me confidence is acting with care even when you're nervous.\n\nThat's how I made it: not by being perfect—by being accountable.\n\nSomewhere between homework, speeches, and hard days, I learned to keep my humanity.\n\nThank you for choosing the kind of parenting that makes leaders safer to be around.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // LEGENDARY SUPERVILLAIN LETTERS
  {
    id: "letter_supervillain_01",
    requireAll: ["LEGENDARY_SUPERVILLAIN"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nThank you for all your hard work… and also the emotional chaos.\n\nMy origin story technically starts in juvenile hall, where I had a lot of time to think about lasers.\n\nYes, I built a Megalaser. Yes, I was going to 'dramatically destroy the world.' (I had a whole speech.)\n\nBut WAIT—what's that? A superhero?\n\nNO—MY MEGALASER! It's… it's broken. I've been defeated by consequences and basic safety standards.\n\nAnyway. I'm pivoting into 'ethical engineering' now. Therapy might've been cheaper.\n\nLove (ominously),\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_supervillain_02",
    requireAll: ["LEGENDARY_SUPERVILLAIN"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI became a supervillain for exactly 31 days. The idea came to me during my state-mandated reflection time in juvenile hall.\n\nDay 12: I finished the Megalaser prototype. Day 13: I wrote a logo. Day 14: I bought a dramatic cape.\n\nDay 15: a 'hero' appeared and said, calmly, 'No.' Then my plan fell apart.\n\nTurns out: genius without empathy is just… loud math.\n\nI'm keeping the cape though. It's comfortable.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  {
    id: "letter_supervillain_03",
    requireAll: ["LEGENDARY_SUPERVILLAIN"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [],
    paragraphs: [
      "{SALUTATION}\n\nI tried to build a doomsday device. I blame the quiet hours in juvenile detention for giving me too much focus.\n\nBefore you panic: it failed immediately, in a way that was deeply humiliating.\n\nThe 'laser' turned into a very expensive light show and a polite noise complaint.\n\nA superhero showed up anyway, destroyed my confidence, and left me with one sentence: 'Get help.'\n\nSo… I did. I'm learning feelings now. It's harder than physics.\n\nLove,\n{childName}"
    ],
    tinyTruths: []
  },
  
  // EXISTING LETTERS (below)

  {
    id: "love_high",
    requireAll: ["LOVE_HIGH"],
    headlines: [
      "A Letter From Your Adult Child",
      "A Note From the Future",
      "A Letter You'll Remember",
      "A Letter That Sounds Like Home",
      "A Letter With Warm Hands",
      "A Letter That Finally Says It"
    ],
    bullets: [
      "You made 'home' feel like a place I could breathe.",
      "I learned how to calm down because you showed me first.",
      "You weren't perfect. You were present.",
      "Even when you were tired, you tried to be kind.",
      "I still hear your voice when I'm brave.",
      "You taught me that mistakes aren't the end of love.",
      "I watched you learn—and it made me believe I could learn too.",
      "You chose repair over pride more times than you know."
    ],
    paragraphs: [
      "{SALUTATION} I don't know how to thank you without sounding cheesy, so I'll just be honest: you mattered. When I was little, I didn't understand how hard it is to be the adult in the room. Now I do—and I see you more clearly. You gave me limits that felt like safety, not control, and you made room for my feelings without letting them run the house. I still carry the small rituals you made—tiny routines that told my nervous system I was okay. If you ever worried you messed me up, I promise: you also built me up. Love, {childName}.",
      "{SALUTATION} I grew up with a quiet kind of confidence, and a lot of that is your doing. You showed up in the boring ways—the consistent ways—and those turned out to be the magic ones. I remember feeling seen, not managed. When life got messy, you came back and tried again instead of pretending it didn't happen. That taught me something school never did: how to be human and still be responsible. I hope you're proud, because I am. Love, {childName}.",
      "{SALUTATION} you taught me that love isn't a speech—it's a thousand small choices. You didn't always pick the perfect one, but you kept choosing me. When I struggled, you didn't treat me like a problem to fix; you treated me like a person to understand. I learned patience from your patience, and courage from how you repaired after tough days. I still laugh at how serious we both got about tiny things, like snacks and bedtime negotiations. Thank you for being my steady place. Love, {childName}.",
      "{SALUTATION} I used to think strong families were the ones who never argued. Now I know it's the ones who come back together. You modeled that—sometimes clumsily, sometimes beautifully, but always honestly. You made space for feelings and still taught me how to do the next right thing. You showed me that boundaries can be gentle and that discipline can be love with a spine. I grew up feeling like I belonged. That's a rare gift. Love, {childName}."
    ],
    tinyTruths: [
      "Tiny truth: I still judge people by how they handle snack situations.",
      "Tiny truth: I learned 60% of emotional regulation from you… and 40% from bedtime negotiations.",
      "Tiny truth: Your 'calm voice' is now my inner narrator.",
      "Tiny truth: I became an adult, but I still want you to be proud of me."
    ]
  },

  {
    id: "love_mid",
    requireAll: ["LOVE_MID"],
    headlines: [
      "A Letter From Your Adult Child",
      "A Letter That's Both True Things",
      "A Letter With Gratitude and Edges",
      "A Letter That Doesn't Pretend",
      "A Letter Written After a Few Deep Breaths"
    ],
    bullets: [
      "'Some parts were warm. Some parts were hard.'",
      "'I learned strength—and I also learned caution.'",
      "'I'm grateful… and I'm still untangling.'",
      "'You tried. Sometimes it landed. Sometimes it didn't.'",
      "'I needed comfort more than coaching on some days.'",
      "'We did love each other. We also missed each other sometimes.'",
      "'I grew up with lessons I had to interpret later.'",
      "'I learned to speak up—eventually.'"
    ],
    paragraphs: [
      "{SALUTATION} I'm writing this as someone who's old enough to hold two truths at once. There were moments I felt really loved, and moments I felt like you were overwhelmed and I was inconvenient. I don't say that to punish you—I say it because it shaped me. Still, you showed up more than you disappeared, and you came back after mistakes often enough that I learned repair is real. I took pieces of you with me: your values, your stubborn hope, and your 'try again' energy. I'm not a perfect adult, but I'm a real one—and that's partly because you were real too. Love, {childName}.",
      "{SALUTATION} I think you did the best you could with what you had, and I also think some days I needed something different. I learned independence early, which helped me in some ways and hurt in others. But I also remember the times you tried to understand me instead of winning against me. Those moments mattered more than you probably know. I'm still learning how to ask for help without feeling guilty about it. Thank you for the love you did give—and for the ways you tried to grow. Love, {childName}.",
      "{SALUTATION} I grew up watching you juggle a lot, and sometimes the balls dropped on my head. I'm not saying that to be dramatic—okay, maybe a little—but I'm also saying it with compassion. You weren't trying to hurt me; you were trying to survive. When you were present, I felt safe. When you were stressed, I learned to shrink. I'm unlearning that now. I hope you can be proud of the good you did without denying the messy parts. Love, {childName}."
    ],
    tinyTruths: [
      "Tiny truth: I still flinch at certain tones… and then I breathe and come back.",
      "Tiny truth: I became resilient. I also became a little too good at 'fine.'",
      "Tiny truth: Your rules made sense… about half the time.",
      "Tiny truth: I love you. I also love boundaries. Both can be true."
    ]
  },

  {
    id: "love_low",
    requireAll: ["LOVE_LOW"],
    headlines: [
      "A Letter From Your Adult Child",
      "A Letter With Distance",
      "A Letter That Holds a Boundary",
      "A Letter That Finally Names It",
      "A Letter Written Carefully"
    ],
    bullets: [
      "'I learned to handle things alone.'",
      "'I didn't feel very known.'",
      "'I kept my feelings private because that felt safer.'",
      "'We had a relationship, but it wasn't always close.'",
      "'I stopped expecting comfort and started expecting consequences.'",
      "'I'm not angry all the time. I'm just honest now.'",
      "'I'm building a life that feels steady.'",
      "'I visit when it's healthy for me.'"
    ],
    paragraphs: [
      "{SALUTATION} I'm writing this without trying to rewrite the past. We weren't close in the ways I needed, and that left marks I've had to understand on my own. I learned independence early, and people sometimes call that 'strong,' but it's also lonely. I don't hate you—I just don't pretend we had what we didn't. Over time, I learned to create safety in other places: in routines, in friendships, in my own boundaries. If there's one thing I want you to know, it's this: connection isn't automatic—it's built. I'm still building mine. Sincerely, {childName}.",
      "{SALUTATION} I used to spend a lot of energy trying to be the version of me that wouldn't cause problems. That was my way of coping. As an adult, I'm learning to be honest about what I felt: unseen, corrected, sometimes dismissed. I don't write this to shame you—I write it to name reality so I can stop carrying it alone. I keep contact in the ways that feel steady, not chaotic. I hope you find peace, and I hope you understand that distance can be a kind of safety. {childName}."
    ],
    tinyTruths: [
      "Tiny truth: I learned 'how are you?' doesn't always mean 'I want to know.'",
      "Tiny truth: I became good at reading rooms. It wasn't always fun.",
      "Tiny truth: I'm not cold. I'm careful.",
      "Tiny truth: Boundaries are the first home I built for myself."
    ]
  },

  {
    id: "default_any",
    requireAll: [],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'Time passed. Some lessons stayed.'",
      "'I became myself slowly, like most people do.'",
      "'I learned love in the ways it was offered.'",
      "'I'm still growing.'"
    ],
    paragraphs: [
      "{SALUTATION} I'm writing from the future with the best honesty I can manage. Parts of my childhood felt warm, parts felt complicated, and all of it shaped me. I remember your effort more than your perfection. I learned that people can love each other and still miss each other sometimes. I'm building a life that makes sense to me, and I hope you're finding your own steadiness too. Love, {childName}."
    ],
    tinyTruths: ["Tiny truth: adulthood is mostly scheduling and emotional regulation in a trench coat."]
  },

  {
    id: "love_high_money_low",
    requireAll: ["LOVE_HIGH", "MONEY_LOW"],
    headlines: [
      "A Letter From Your Adult Child",
      "A Letter Written After Rent Was Paid"
    ],
    bullets: [
      "'We didn't have a lot, but we had each other.'",
      "'You made safety out of routines and jokes.'",
      "'I learned generosity before I learned comfort.'",
      "'You taught me to feel—without falling apart.'",
      "'You were tired, and you still tried.'",
      "'We made enough feel like a kind of wealth.'"
    ],
    paragraphs: [
      "{SALUTATION} I remember the way you stretched everything—money, time, patience—and somehow still made room for warmth. We didn't live in luxury, but I never felt like love was scarce. You taught me that struggle doesn't have to become cruelty. I learned how to laugh in hard seasons, and how to ask for help without shame. If you ever felt guilty about what you couldn't give, I want you to know what you did give: steadiness, honesty, and a home that kept trying. Love, {childName}.",
      "{SALUTATION} we had months where the math didn't math, and you still found a way to make life feel normal enough. You turned small things into rituals—snacks, stories, little talks in the car—that made me feel safe. I learned grit from you, but I also learned softness. That's rare. I don't measure my childhood by what we didn't have. I measure it by the fact that I felt held. Love, {childName}."
    ],
    tinyTruths: [
      "Tiny truth: your 'cheap fun' ideas are now my whole personality.",
      "Tiny truth: I learned budgeting… and then learned to forgive myself for not being perfect at it."
    ]
  },

  {
    id: "love_high_stress_high",
    requireAll: ["LOVE_HIGH", "STRESS_HIGH"],
    headlines: [
      "A Letter From Your Adult Child",
      "A Letter From Someone Who Noticed"
    ],
    bullets: [
      "'I saw how hard you worked to hold it together.'",
      "'Even when you snapped, you came back.'",
      "'Your love was real—even when your stress was loud.'",
      "'You taught me repair. That saved me later.'",
      "'I learned that adults have feelings too.'",
      "'You didn't quit on me.'"
    ],
    paragraphs: [
      "{SALUTATION} I remember your tired face as much as your hugs. I remember the moments you were overwhelmed—and the moments you returned and tried again. That mattered. Your stress wasn't invisible to me, but neither was your love. You taught me something powerful: people can mess up and still come back. That's how I learned to repair relationships instead of burning them down. If you carry guilt, I want to soften it: I'm okay, and a lot of that is because you kept choosing me even when you were running on fumes. Love, {childName}.",
      "{SALUTATION} you were the kind of parent who tried. Not 'perfect'—real. Sometimes your stress spilled into tone, and I learned to watch moods like weather. But you also apologized, you also hugged, you also made space for me to be a kid. I carry both memories. And the good ones? They're the ones that shaped my belief that love can be steady even when life is hard. Love, {childName}."
    ],
    tinyTruths: [
      "Tiny truth: I still associate love with someone trying again the next day.",
      "Tiny truth: your nervous system taught mine… even when you didn't mean to."
    ]
  },

  {
    id: "love_mid_healing",
    requireAll: ["LOVE_MID", "HEALING_SELF_SOME"],
    headlines: [
      "A Letter From Your Adult Child",
      "A Letter About Breaking Cycles"
    ],
    bullets: [
      "'You didn't repeat everything you were given.'",
      "'You learned, even when it was uncomfortable.'",
      "'We weren't perfect, but we weren't stuck.'",
      "'You changed patterns mid‑story.'",
      "'That mattered more than you realize.'",
      "'I learned I can change too.'"
    ],
    paragraphs: [
      "{SALUTATION} I think the bravest thing you did was change while you were already in the middle of parenting. That takes humility. I felt the difference when you started trying new ways—when you paused, when you repaired, when you listened longer than you wanted to. We still had hard moments, but the story didn't freeze in them. You didn't fix everything, and you didn't have to. You proved something important: cycles aren't destiny. Love, {childName}.",
      "{SALUTATION} I grew up with a parent who was learning in public. That could be messy, but it was also inspiring. You didn't just say 'do better'—you practiced it. Over time I learned that growth is allowed at any age, and that love can include accountability. I'm proud of the ways you broke patterns, even imperfectly. Love, {childName}."
    ],
    tinyTruths: [
      "Tiny truth: watching you grow made me less afraid of my own mistakes.",
      "Tiny truth: 'repair' became my definition of strength."
    ]
  },

  {
    id: "love_low_boundary_respectful",
    requireAll: ["LOVE_LOW", "EMP_HIGH"],
    headlines: [
      "A Letter From Your Adult Child",
      "A Letter With Boundaries and Care"
    ],
    bullets: [
      "'Distance wasn't punishment—it was protection.'",
      "'I learned to be kind without being available.'",
      "'I can care and still keep space.'",
      "'I'm building a calmer life.'",
      "'I visit when it's healthy.'",
      "'I'm learning what safe feels like.'"
    ],
    paragraphs: [
      "{SALUTATION} I don't want a dramatic letter. I want an honest one. We weren't close in the ways I needed, and I've had to build some of that safety elsewhere. I'm not writing to attack you. I'm writing to explain why distance exists: it helps me stay regulated. I still have compassion for you, and I still have boundaries for me. If we rebuild anything, it will be slowly, with consistency, not with guilt. Sincerely, {childName}.",
      "{SALUTATION} I've learned that love without safety becomes obligation. I don't want obligation. I want honesty, and I want peace. My life is steadier now, and I protect that. I'm open to connection that respects boundaries, and I'm not open to returning to old patterns. That's not cruelty—it's maturity. {childName}."
    ],
    tinyTruths: [
      "Tiny truth: I don't hate you. I just won't abandon myself anymore.",
      "Tiny truth: boundaries were the first parenting I ever gave myself."
    ]
  }
  ,
  // ===== WOW LETTERS (Archetype-driven, cinematic formatting) =====
  {
    id: "letter_arch_steel_orchid_v1",
    requireAll: ["ARCHETYPE_STEEL_ORCHID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'The quiet parts mattered.'",
      "'Repair was normal here.'",
      "'I learned steadiness without losing myself.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nWhen I look back, it comes back in flashes:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\n{archetypePetFlourish}\n\nLove,\n{childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  },

  {
    id: "letter_arch_gentle_giant_v1",
    requireAll: ["ARCHETYPE_GENTLE_GIANT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'You let me feel things without making it dangerous.'",
      "'I learned kindness with boundaries.'",
      "'Home felt like a place, not a performance.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nTwo memories keep showing up when I'm trying to describe you to people:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\nLove,\n{childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  },

  {
    id: "letter_arch_chaos_diplomat_v1",
    requireAll: ["ARCHETYPE_CHAOS_DIPLOMAT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'We had storms. We also had laughter.'",
      "'I learned how to make a plan in the middle of noise.'",
      "'Somehow, I still turned out… me.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nI don't remember every argument. I remember the texture of the house:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\nLove,\n{childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  },

  {
    id: "letter_arch_wounded_healer_v1",
    requireAll: ["ARCHETYPE_WOUNDED_HEALER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'The early chapters were complicated.'",
      "'The later chapters were intentional.'",
      "'That change mattered more than you know.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nIf I had to explain our story in two snapshots, I'd pick these:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\nLove,\n{childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  },

  {
    id: "letter_arch_survivor_with_jokes_v1",
    requireAll: ["ARCHETYPE_SURVIVOR_WITH_JOKES"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'I learned survival early.'",
      "'Then I learned softness later.'",
      "'Both things are true.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nTwo moments I still carry:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\nLove,\n{childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  },

  {
    id: "letter_arch_polished_wound_v1",
    requireAll: ["ARCHETYPE_POLISHED_WOUND"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'Distance can be a kind of safety.'",
      "'I'm not cold. I'm careful.'",
      "'I'm still learning what closeness feels like.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nThe truth is, I remember things in fragments:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\n— {childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  },

  {
    id: "letter_arch_golden_cage_v1",
    requireAll: ["ARCHETYPE_GOLDEN_CAGE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'I learned how to win.'",
      "'Then I had to learn how to rest.'",
      "'I'm still learning the difference between success and safety.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nI can point to moments that made me:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\nLove,\n{childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  },

  {
    id: "letter_arch_wild_card_v1",
    requireAll: ["ARCHETYPE_WILD_CARD"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'I tried a lot of lives on.'",
      "'Somehow, you let me.'",
      "'That gave me air.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nIf you're wondering what I kept, it's these kinds of moments:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\nLove,\n{childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  },

  {
    id: "letter_arch_everyday_epic_v1",
    requireAll: ["ARCHETYPE_EVERYDAY_EPIC"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: [
      "'It wasn't one big thing.'",
      "'It was a thousand small choices.'",
      "'I'm still becoming.'"
    ],
    paragraphs: [
      "{SALUTATION}\n\n{archetypeHook}\n\nThe memories that float to the surface are ordinary—and that's the point:\n• {callback1}\n• {callback2}\n\n{beat1}\n\n{archetypeTruth}\n\nLove,\n{childName}"
    ],
    tinyTruths: [
      "Tiny truth: {archetypeStinger}"
    ]
  }
,

  {
    id: "letter_arch_steel_orchid_v2",
    requireAll: ["ARCHETYPE_STEEL_ORCHID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_steel_orchid_v3",
    requireAll: ["ARCHETYPE_STEEL_ORCHID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI want to tell you what you did that actually mattered.\n\nNot the big stuff. The human stuff:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm not perfect. I'm real. And I'm still grateful.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_gentle_giant_v2",
    requireAll: ["ARCHETYPE_GENTLE_GIANT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_gentle_giant_v3",
    requireAll: ["ARCHETYPE_GENTLE_GIANT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI want to tell you what you did that actually mattered.\n\nNot the big stuff. The human stuff:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm not perfect. I'm real. And I'm still grateful.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_chaos_diplomat_v2",
    requireAll: ["ARCHETYPE_CHAOS_DIPLOMAT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_chaos_diplomat_v3",
    requireAll: ["ARCHETYPE_CHAOS_DIPLOMAT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI used to think adulthood would feel like a movie montage. Turns out it's mostly emails.\n\nStill\u2014some highlights:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat2}\n\nPeople call me competent now. They don't know it's just years of practice plus mild panic.\n\n{archetypeTruth}\n\nP.S. {archetypePetFlourish}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_wounded_healer_v2",
    requireAll: ["ARCHETYPE_WOUNDED_HEALER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_wounded_healer_v3",
    requireAll: ["ARCHETYPE_WOUNDED_HEALER"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI want to tell you what you did that actually mattered.\n\nNot the big stuff. The human stuff:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm not perfect. I'm real. And I'm still grateful.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_survivor_with_jokes_v2",
    requireAll: ["ARCHETYPE_SURVIVOR_WITH_JOKES"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_survivor_with_jokes_v3",
    requireAll: ["ARCHETYPE_SURVIVOR_WITH_JOKES"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI used to think adulthood would feel like a movie montage. Turns out it's mostly emails.\n\nStill\u2014some highlights:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat2}\n\nPeople call me competent now. They don't know it's just years of practice plus mild panic.\n\n{archetypeTruth}\n\nP.S. {archetypePetFlourish}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_polished_wound_v2",
    requireAll: ["ARCHETYPE_POLISHED_WOUND"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_polished_wound_v3",
    requireAll: ["ARCHETYPE_POLISHED_WOUND"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI learned to look fine. I learned to sound fine. I even learned to succeed loudly.\n\nBut the truth lives in quieter places:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI don't blame you for being human. I do blame the part of our life that made honesty feel dangerous.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_golden_cage_v2",
    requireAll: ["ARCHETYPE_GOLDEN_CAGE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_golden_cage_v3",
    requireAll: ["ARCHETYPE_GOLDEN_CAGE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI want to tell you what you did that actually mattered.\n\nNot the big stuff. The human stuff:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm not perfect. I'm real. And I'm still grateful.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_wild_card_v2",
    requireAll: ["ARCHETYPE_WILD_CARD"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_wild_card_v3",
    requireAll: ["ARCHETYPE_WILD_CARD"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI used to think adulthood would feel like a movie montage. Turns out it's mostly emails.\n\nStill\u2014some highlights:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat2}\n\nPeople call me competent now. They don't know it's just years of practice plus mild panic.\n\n{archetypeTruth}\n\nP.S. {archetypePetFlourish}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_everyday_epic_v2",
    requireAll: ["ARCHETYPE_EVERYDAY_EPIC"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_everyday_epic_v3",
    requireAll: ["ARCHETYPE_EVERYDAY_EPIC"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI want to tell you what you did that actually mattered.\n\nNot the big stuff. The human stuff:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm not perfect. I'm real. And I'm still grateful.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_lonely_prodigy_v2",
    requireAll: ["ARCHETYPE_LONELY_PRODIGY"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A life isn't a stat sheet. It's a stack of moments.'", "'The hard parts mattered. The soft parts mattered more.'", "'Tiny truth: {archetypeTitle} is just a name for how I survived.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nIf you want the honest version, it isn't one story. It's three scenes I replay when nobody's watching:\n\u2022 {callback1}\n\u2022 {callback2}\n{callback3}\n\n{beat1}\n\nHere is what I learned: {signatureStrength} kept me moving. {workShadow} tried to make me small.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: I kept the lesson and changed the delivery."]
  },
  {
    id: "letter_arch_lonely_prodigy_v3",
    requireAll: ["ARCHETYPE_LONELY_PRODIGY"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned repair, not perfection.'", "'I became myself in inches, not leaps.'", "'Some things I carried. Some things I put down.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nI grew up in a house where I could hear my own thoughts. Sometimes that was peace. Sometimes it was loneliness.\n\nTwo memories keep showing up like bookmarks:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat3}\n\nI learned to be brilliant in private. I'm still learning to be loved out loud.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_arch_steel_orchid_v4",
    requireAll: ["ARCHETYPE_STEEL_ORCHID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The ending isn't the point. The pattern is.'", "'I remember what you repeated.'", "'I also remember what you repaired.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nAt eighteen, people start asking what I'm going to be.\nI think about what I already am.\n\nI am the kid who remembers:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf I have a superpower, it's this: I can keep moving without pretending it didn't hurt.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: the lesson survived the chaos."]
  },
  {
    id: "letter_arch_gentle_giant_v4",
    requireAll: ["ARCHETYPE_GENTLE_GIANT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The ending isn't the point. The pattern is.'", "'I remember what you repeated.'", "'I also remember what you repaired.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nAt eighteen, people start asking what I'm going to be.\nI think about what I already am.\n\nI am the kid who remembers:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf I have a superpower, it's this: I can keep moving without pretending it didn't hurt.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: the lesson survived the chaos."]
  },
  {
    id: "letter_arch_chaos_diplomat_v4",
    requireAll: ["ARCHETYPE_CHAOS_DIPLOMAT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The ending isn't the point. The pattern is.'", "'I remember what you repeated.'", "'I also remember what you repaired.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nAt eighteen, people start asking what I'm going to be.\nI think about what I already am.\n\nI am the kid who remembers:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf I have a superpower, it's this: I can keep moving without pretending it didn't hurt.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: the lesson survived the chaos."]
  },
  {
    id: "letter_arch_everyday_epic_v4",
    requireAll: ["ARCHETYPE_EVERYDAY_EPIC"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The ending isn't the point. The pattern is.'", "'I remember what you repeated.'", "'I also remember what you repaired.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nAt eighteen, people start asking what I'm going to be.\nI think about what I already am.\n\nI am the kid who remembers:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf I have a superpower, it's this: I can keep moving without pretending it didn't hurt.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: the lesson survived the chaos."]
  },
  {
    id: "letter_arch_golden_cage_v4",
    requireAll: ["ARCHETYPE_GOLDEN_CAGE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The ending isn't the point. The pattern is.'", "'I remember what you repeated.'", "'I also remember what you repaired.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nAt eighteen, people start asking what I'm going to be.\nI think about what I already am.\n\nI am the kid who remembers:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf I have a superpower, it's this: I can keep moving without pretending it didn't hurt.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: the lesson survived the chaos."]
  },
  {
    id: "letter_arch_polished_wound_v4",
    requireAll: ["ARCHETYPE_POLISHED_WOUND"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The ending isn't the point. The pattern is.'", "'I remember what you repeated.'", "'I also remember what you repaired.'"],
    paragraphs: ["{SALUTATION}\n\n{archetypeHook}\n\nAt eighteen, people start asking what I'm going to be.\nI think about what I already am.\n\nI am the kid who remembers:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf I have a superpower, it's this: I can keep moving without pretending it didn't hurt.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: the lesson survived the chaos."]
  },
  {
    id: "letter_love_veryhigh_v1",
    requireAll: ["LOVE_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Love was the climate in our house.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI know I'm eighteen now, and people expect me to talk about 'the future.'\n\nBut first, I want to talk about the past\u2014because it was warm.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nYou weren't perfect. You were present. That changed everything.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_love_verylow_v1",
    requireAll: ["LOVE_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Some homes teach you distance like a language.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nThis is hard to write.\n\nI grew up learning how to be easy to live with. Quiet. Helpful. Not a problem.\n\nI still remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat3}\n\nI'm building a life where tenderness isn't something you have to earn.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_stress_veryhigh_v1",
    requireAll: ["STRESS_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We lived inside a storm and called it normal.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nSome families measure time by birthdays.\nWe measured time by emergencies.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat2}\n\nI'm not angry that life was hard. I'm angry that we didn't always get to be soft.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_negative_v1",
    requireAll: ["MONEY_NEGATIVE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We were rich in improv.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nWe didn't have money. We had creativity, duct tape, and the weird confidence of people who have already survived embarrassment.\n\nTwo memories keep making me laugh:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI learned that dignity isn't a bank balance. It's how you treat people when you're scared.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_debt_high_v1",
    requireAll: ["DEBT_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The bills were loud. Love had to speak up.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI grew up hearing numbers that felt like weather: rent, interest, due dates.\n\nBut I also grew up seeing you keep going.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf I ever become 'successful,' I hope I never forget how brave survival was.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_travel_alot_v1",
    requireAll: ["TRAVEL_A_LOT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'My childhood had passport stamps and snack crumbs.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nPeople think travel makes you worldly.\nIt mostly made me good at packing, adapting, and finding the bathroom in unfamiliar buildings.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat2}\n\nI learned that home isn't a place. It's a person who shows up.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_travel_none_v1",
    requireAll: ["TRAVEL_NONE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Our world was small. It was still real.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nWe didn't go far.\nBut we went deep.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI learned that you can build a whole universe inside an ordinary week.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_faith_active_v1",
    requireAll: ["FAITH_ACTIVE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We practiced hope like a habit.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI don't know what I'll believe forever.\nBut I know what you taught me: to pause, to reflect, to care about the unseen parts of people.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf I keep anything from childhood, it's that kind of steady hope.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_counseling_used_v1",
    requireAll: ["COUNSELING_USED"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We learned new words for old pain.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nYou know what's weird?\nLearning that feelings can be named\u2014and that naming them doesn't make you weak.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI carry less shame now. That's not an accident. That's work.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_fast_v1",
    requireAll: ["FORGIVE_FAST"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We repaired quickly. That was the miracle.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI think a lot about how we handled mistakes.\nNot whether they happened\u2014because of course they did.\n\nBut how we repaired.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm not afraid of conflict. I'm afraid of silence.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_very_slow_v1",
    requireAll: ["FORGIVE_VERY_SLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Forgiveness wasn't a door. It was a hallway.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI want you to know something important:\nI didn't heal because time passed.\nI healed because something changed.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat3}\n\nIf I forgive, it's not forgetting. It's choosing a different future.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_harsh_many_v1",
    requireAll: ["HARSH_MANY"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Discipline can be love. It can also be fear.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI know you wanted me to be strong.\nI became strong.\n\nBut sometimes I became strong the way a tree becomes strong in a storm\u2014by bending.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat2}\n\nI'm learning gentleness now. Not because I'm weak. Because I'm done living like I'm under review.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_play_high_v1",
    requireAll: ["PLAY_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We laughed like it was medicine.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI grew up with a rare gift: a home where joy wasn't suspicious.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nWhen life gets heavy, I know how to make light without pretending the pain isn't real.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_study_deep_v1",
    requireAll: ["STUDY_DEEP"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You taught me how to finish things.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nPeople call me disciplined.\nThey think it was natural.\n\nIt wasn't.\nIt was repetition.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI learned to respect effort\u2014mine and other people's.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_bond_high_v1",
    requireAll: ["BOND_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We had a real relationship, not just a household.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nSome kids grow up supervised.\nI grew up known.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm carrying that with me into every friendship I make.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_phone_long_v1",
    requireAll: ["PHONE_LONG"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The screen was always there. Sometimes you were too.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI'm not writing this to judge you.\nI'm writing it because I'm trying to be honest.\n\nSome of my childhood lived behind glass.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat3}\n\nI'm learning how to look people in the eyes and stay.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_pet_present_v1",
    requireAll: ["PET_PRESENT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A small animal taught me about comfort.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI know it sounds silly, but I think having a pet in the house made us softer.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nSometimes love shows up as a warm body that refuses to leave your lap.\n\n{archetypeTruth}\n\nP.S. {archetypePetFlourish}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_partner_no_v1",
    requireAll: ["PARTNER_NO"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We were a team of two.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nWe didn't have a neat story.\nWe had a real one.\n\nYou carried a lot.\nAnd I saw it, even when I didn't have language for it.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nIf you ever wonder whether you mattered: you did. You were the difference.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_partner_yes_v1",
    requireAll: ["PARTNER_YES"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I watched two adults try.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI learned love by watching you love\u2014imperfectly, repeatedly, and in real time.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI know relationships aren't fairy tales. They're choices. I saw you choose.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_school_empathy_v1",
    requireAll: ["SCHOOL_EMPATHY"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'My education taught me feelings are data.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nSchool taught me facts.\nBut the way we lived taught me people.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm entering adulthood with something rare: a conscience that doesn't feel like a punishment.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_school_private_v1",
    requireAll: ["SCHOOL_PRIVATE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned confidence. I also learned performance.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nPrivate school taught me how to present.\nYou taught me what to keep.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat3}\n\nI'm learning to be impressive without disappearing inside it.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_school_homeschool_v1",
    requireAll: ["SCHOOL_HOMESCHOOL"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Home was my classroom.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nSome kids learn in hallways.\nI learned at the kitchen table.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat1}\n\nI'm grateful I grew up with a front-row seat to your humanity.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_activity_heavy_v1",
    requireAll: ["ACTIVITY_HEAVY"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'My body remembers what my mind forgets.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI used to think exercise was about discipline.\nNow I know it's about mental health with muscles.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat2}\n\nWhen stress rises, I don't only spiral. I move.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_activity_none_v1",
    requireAll: ["ACTIVITY_NONE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We lived in our heads.'", "'The details are what made it real.'", "'I carried more than you saw.'"],
    paragraphs: ["{SALUTATION}\n\nI didn't learn movement young.\nSo I'm learning it now.\n\nNot to punish myself.\nTo meet myself.\n\nI remember:\n\u2022 {callback1}\n\u2022 {callback2}\n\n{beat3}\n\nI'm building a life with a body in it.\n\n{archetypeTruth}\n\n\u2014 {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_love_veryhigh_v2",
    requireAll: ["LOVE_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Love was the climate in our house.'", "'You made care look normal.'", "'I still borrow your calm.'"],
    paragraphs: ["{SALUTATION}\n\nI’m eighteen now, and people keep asking who I want to become.\nI think the real answer is: someone who treats people the way you treated me.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nYou didn’t love me in a big dramatic way.\nYou loved me in a thousand small ways — the kind that quietly rewire a life.\n\nIf you ever worry you didn’t do enough: you did. You were enough, out loud and in the ordinary.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: the small things counted."]
  },
  {
    id: "letter_love_veryhigh_v3",
    requireAll: ["LOVE_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You made our home soft.'", "'You made my feelings allowed.'", "'You made “try again” a habit.'"],
    paragraphs: ["{SALUTATION}\n\nI used to think love was a personality trait.\nThen I watched you practice it like a skill.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nYou taught me how to show up — for work, for people, and for myself.\nAlso: you taught me that snacks solve at least 40% of problems.\n\nI carry you with me in the way I speak, the way I pause, and the way I repair instead of running.\n\n{archetypeTruth}\n\nAlways,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: love is a verb."]
  },
  {
    id: "letter_love_high_v1",
    requireAll: ["LOVE_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You made love practical.'", "'You made repair normal.'", "'I learned safety in your routines.'"],
    paragraphs: ["{SALUTATION}\n\nOur house wasn’t perfect.\nBut it was the kind of imperfect where you could still breathe.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nWhen I mess up, I don’t spiral the way I used to.\nI hear your voice — not yelling, not panicking — just steady: “Okay. What’s the next right thing?”\n\nThat’s the gift. Not a flawless childhood — a usable one.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_love_high_v2",
    requireAll: ["LOVE_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You didn’t win every day.'", "'You still showed up.'", "'That’s what I remember.'"],
    paragraphs: ["{SALUTATION}\n\nI’m writing this because I don’t want you to underestimate what you did.\nYou made me feel chosen — again and again.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nSometimes love looked like a hug.\nSometimes it looked like you doing the boring stuff anyway.\n\nI’m eighteen now. I can say it plainly:\nyou gave me a foundation.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: consistency is romance."]
  },
  {
    id: "letter_love_mid_v1",
    requireAll: ["LOVE_MID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Some days were warm.'", "'Some days were loud.'", "'We made it through anyway.'"],
    paragraphs: ["{SALUTATION}\n\nIf I’m honest, my childhood was a mix.\nNot a tragedy. Not a fairy tale. A real life.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThere were moments I felt held.\nThere were moments I felt like I had to handle things early.\n\nBut here’s what matters: we kept coming back.\nWe kept trying again. That counts.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: “again” is a love language."]
  },
  {
    id: "letter_love_mid_v2",
    requireAll: ["LOVE_MID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We weren’t perfect.'", "'We were persistent.'", "'That changed the math.'"],
    paragraphs: ["{SALUTATION}\n\nI learned early that love isn’t a mood.\nIt’s maintenance.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nSometimes you nailed it.\nSometimes you were tired and human and didn’t.\n\nBut you came back. You tried to understand me even when I was difficult to understand.\nThat’s why I can forgive myself now.\n\n{archetypeTruth}\n\nWith love,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_love_low_v1",
    requireAll: ["LOVE_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned independence early.'", "'I learned to read the room.'", "'I also learned to keep going.'"],
    paragraphs: ["{SALUTATION}\n\nI don’t want this letter to be cruel.\nI want it to be true.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThere were times I felt like an extra responsibility instead of a person.\nAnd there were times you surprised me — in the best way — by trying anyway.\n\nI’m eighteen now.\nI’m still learning how to let people in.\nBut I’m learning. That’s the good part.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: truth can be gentle."]
  },
  {
    id: "letter_love_low_v2",
    requireAll: ["LOVE_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I grew up fast.'", "'I didn’t always feel seen.'", "'I’m building something better.'"],
    paragraphs: ["{SALUTATION}\n\nSome kids inherit confidence.\nI inherited vigilance.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI don’t blame you for being overwhelmed.\nBut I also can’t pretend it didn’t shape me.\n\nHere’s the hope: I’m not stuck.\nI’m building a life with softer edges — and I’m proud of that.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_love_verylow_v2",
    requireAll: ["LOVE_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned to be small.'", "'I learned to be tough.'", "'I’m learning to be soft now.'"],
    paragraphs: ["{SALUTATION}\n\nI’ve rewritten this letter a dozen times.\nBecause part of me still expects punishment for honesty.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI grew up learning how to take care of myself.\nThat’s a skill — and it’s also a scar.\n\nI’m eighteen now, and I’m choosing a different future.\nNot to spite you — to save myself.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: healing starts with naming it."]
  },
  {
    id: "letter_love_verylow_v3",
    requireAll: ["LOVE_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I don’t hate you.'", "'I just remember.'", "'I’m trying to let go.'"],
    paragraphs: ["{SALUTATION}\n\nThis isn’t an ending where everything ties up neatly.\nIt’s an ending where I finally tell the truth.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI can see how hard life was for you.\nI can also see how alone I felt inside it.\n\nI’m learning boundaries.\nI’m learning how to ask for love without begging.\nI hope you learn too.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_stress_verylow_v1",
    requireAll: ["STRESS_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Our home was quiet in the best way.'", "'I didn’t live on adrenaline.'", "'Calm was the inheritance.'"],
    paragraphs: ["{SALUTATION}\n\nYou gave me something I didn’t realize was rare until I met other people:\na nervous system that didn’t have to stay on guard.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned how to rest without guilt.\nI learned how to focus without fear.\n\nWhen life gets loud now, I don’t panic — I breathe.\nThat’s not luck. That’s what you built.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: peace is parenting too."]
  },
  {
    id: "letter_stress_verylow_v2",
    requireAll: ["STRESS_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You made calm look normal.'", "'You didn’t turn every problem into a crisis.'", "'I’m grateful for the quiet.'"],
    paragraphs: ["{SALUTATION}\n\nWhen I think of childhood, I don’t think of emergencies.\nI think of ordinary days that felt safe.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nYou didn’t solve everything.\nYou just didn’t make everything worse.\n\nI’m older now and I understand how hard that is.\nThank you for choosing steadiness.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_stress_low_v1",
    requireAll: ["STRESS_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We had storms, but not hurricanes.'", "'We recovered.'", "'That taught me resilience.'"],
    paragraphs: ["{SALUTATION}\n\nLife wasn’t always easy, but it wasn’t constant chaos either.\nWe had room to breathe between the hard parts.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned that problems can be solved.\nNot magically — but step by step.\n\nThat belief is a superpower.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_stress_low_v2",
    requireAll: ["STRESS_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You didn’t make me your therapist.'", "'You kept adult problems adult.'", "'I noticed.'"],
    paragraphs: ["{SALUTATION}\n\nThank you for not putting the whole world on my shoulders.\nYou carried what was yours to carry.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nNow that I’m eighteen, I can see how tempting it is to unload.\nYou didn’t.\n\nThat’s why I can grow up without feeling like I raised you.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: boundaries protect kids."]
  },
  {
    id: "letter_stress_mid_v1",
    requireAll: ["STRESS_MID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Some years were heavy.'", "'Some years were light.'", "'We kept moving.'"],
    paragraphs: ["{SALUTATION}\n\nI remember both kinds of days.\nThe calm ones — and the ones where everything felt tight.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI don’t think you always knew what to do.\nBut you kept showing up.\n\nThat’s what I’m taking with me: keep showing up.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_stress_mid_v2",
    requireAll: ["STRESS_MID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned to adapt.'", "'I learned to laugh anyway.'", "'I learned we could recover.'"],
    paragraphs: ["{SALUTATION}\n\nIf my childhood had a theme, it was: adjust and continue.\nNot always fun — but it made me capable.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI’m learning that capable doesn’t have to mean numb.\nI can be strong and still be soft.\n\nThat’s my next level-up.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_stress_high_v1",
    requireAll: ["STRESS_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'Our house ran on urgency.'", "'I learned to read the room.'", "'I’m unlearning it now.'"],
    paragraphs: ["{SALUTATION}\n\nI grew up with my ears tuned to everything.\nFootsteps, tone, silence — all of it.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat made me quick.\nIt also made me tired.\n\nI’m eighteen now, and I’m learning a new skill:\nsafety without scanning.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: stress teaches fast lessons."]
  },
  {
    id: "letter_stress_high_v2",
    requireAll: ["STRESS_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We survived a lot.'", "'We didn’t always heal fast.'", "'But I’m still here.'"],
    paragraphs: ["{SALUTATION}\n\nThis letter isn’t a complaint.\nIt’s a report from someone who made it through.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI’m proud of how far we came.\nI’m also honest about what it cost.\n\nI’m building a life where calm isn’t a vacation — it’s the default.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_stress_veryhigh_v2",
    requireAll: ["STRESS_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We lived on adrenaline.'", "'I got good at crisis.'", "'I’m learning peace now.'"],
    paragraphs: ["{SALUTATION}\n\nSome kids remember cartoons.\nI remember tension.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI became strong in ways I didn’t ask for.\nI became funny in ways that kept me alive.\n\nI don’t hate my story — but I’m allowed to want something gentler next.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: survival isn’t the same as living."]
  },
  {
    id: "letter_stress_veryhigh_v3",
    requireAll: ["STRESS_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I can handle anything.'", "'That’s not always a compliment.'", "'Still… I’m proud of me.'"],
    paragraphs: ["{SALUTATION}\n\nIf you ever wondered what you taught me, here it is:\nhow to keep going even when everything is on fire.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat skill got me to eighteen.\nNow I’m learning the next one:\nhow to stop running when the fire is out.\n\nI’m not just surviving anymore.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_verylow_v1",
    requireAll: ["MONEY_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We made miracles out of receipts.'", "'I learned what “enough” means.'", "'I learned to be resourceful.'"],
    paragraphs: ["{SALUTATION}\n\nMoney was tight — not in an abstract way, in a daily way.\nWe counted. We stretched. We improvised.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI remember how you tried to protect me from the panic.\nSometimes you succeeded. Sometimes I felt it anyway.\n\nBut I learned something real:\nworth is not the same as price.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_verylow_v2",
    requireAll: ["MONEY_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I learned to fix things instead of replacing them.'", "'I learned creativity.'", "'I learned grit.'"],
    paragraphs: ["{SALUTATION}\n\nWe didn’t have a lot.\nBut we had a kind of stubborn magic.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI can make a meal out of nothing.\nI can turn a bad week into a plan.\n\nI’m proud of that — and I’m also building a future where we don’t have to fight so hard.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: resourcefulness is a legacy."]
  },
  {
    id: "letter_money_low_v1",
    requireAll: ["MONEY_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We lived carefully.'", "'I noticed the sacrifices.'", "'I’m grateful anyway.'"],
    paragraphs: ["{SALUTATION}\n\nWe weren’t starving, but we were careful.\nCareful meant no waste. Careful meant planning.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI saw you choose me over easier choices.\nI saw the quiet math you did in your head.\n\nI’m carrying that forward — not as fear, as wisdom.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_low_v2",
    requireAll: ["MONEY_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You made “not much” feel like enough.'", "'You kept us steady.'", "'That mattered.'"],
    paragraphs: ["{SALUTATION}\n\nThere were things I wanted that we couldn’t get.\nBut there was something bigger we did have: stability.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned how to prioritize.\nI learned how to be grateful without pretending we didn’t struggle.\n\nThat balance is hard. You taught it anyway.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_mid_v1",
    requireAll: ["MONEY_MID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We were okay.'", "'We weren’t rich, we were real.'", "'That gave me room to grow.'"],
    paragraphs: ["{SALUTATION}\n\nWe had enough to breathe.\nNot luxury — but enough to build a life.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI didn’t grow up afraid of the next bill.\nI grew up learning who I was.\n\nThat’s a gift people underestimate.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_mid_v2",
    requireAll: ["MONEY_MID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You taught me to work.'", "'You also taught me to rest.'", "'That’s the upgrade.'"],
    paragraphs: ["{SALUTATION}\n\nWe lived in the middle: not desperate, not dreamy.\nJust steady.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned that money is a tool, not a scoreboard.\nI learned that a good life is made of choices, not purchases.\n\nI’m taking that into whatever comes next.\n\n{archetypeTruth}\n\nWith love,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_high_v1",
    requireAll: ["MONEY_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I grew up with security.'", "'I didn’t worry about basics.'", "'I could focus on becoming.'"],
    paragraphs: ["{SALUTATION}\n\nWe weren’t rich in a movie way.\nBut we were safe in a real way.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat safety gave me permission to dream.\nIt also gave me a responsibility: not to waste it.\n\nI’m trying to honor what you built.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_high_v2",
    requireAll: ["MONEY_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You paid for opportunities.'", "'You also paid attention.'", "'Both mattered.'"],
    paragraphs: ["{SALUTATION}\n\nYou gave me resources — and more importantly, you gave me direction.\nYou didn’t just buy things. You built a path.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI’m grateful for the doors you opened.\nI’m even more grateful you taught me to walk through them with humility.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_veryhigh_v1",
    requireAll: ["MONEY_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We had options.'", "'We had comfort.'", "'I’m learning what to do with it.'"],
    paragraphs: ["{SALUTATION}\n\nSome people think money solves everything.\nIt doesn’t — but it does change what you have to fight.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI didn’t have to fight for basics.\nSo I’m choosing to fight for meaning.\n\nI’m learning to use privilege like a tool, not a personality.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_money_veryhigh_v2",
    requireAll: ["MONEY_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I had what I needed.'", "'Sometimes I had too much.'", "'I’m choosing who I want to be.'"],
    paragraphs: ["{SALUTATION}\n\nComfort can be a gift.\nIt can also be a bubble.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nYou gave me a soft landing.\nNow I’m learning to grow without becoming entitled.\n\nI’m trying to be impressive in the ways money can’t buy.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: values outlast wealth."]
  },
  {
    id: "letter_money_negative_v2",
    requireAll: ["MONEY_NEGATIVE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We paid interest in sleep.'", "'We carried stress like a backpack.'", "'We kept going anyway.'"],
    paragraphs: ["{SALUTATION}\n\nI remember the kind of money problems that don’t stay on paper.\nThey show up in tone, timing, and how your shoulders sit.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned hustle. I learned patience. I learned the word “later.”\n\nI’m eighteen now.\nI’m not ashamed of where we started — but I’m building a life where “later” arrives sooner.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: survival has receipts."]
  },
  {
    id: "letter_money_negative_v3",
    requireAll: ["MONEY_NEGATIVE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We made it work.'", "'Even when it didn’t make sense.'", "'That changed me.'"],
    paragraphs: ["{SALUTATION}\n\nYou tried to make scarcity invisible.\nI saw it anyway — and I saw you.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI saw the extra shifts. The careful decisions. The quiet worry.\n\nI’m grateful for your effort.\nAnd I’m choosing a future where money isn’t the loudest voice in the room.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_debt_none_v1",
    requireAll: ["DEBT_NONE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You taught me to live within reality.'", "'We didn’t panic.'", "'We planned.'"],
    paragraphs: ["{SALUTATION}\n\nI didn’t grow up with debt as background noise.\nThat’s quieter than people realize.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nYou taught me patience.\nYou taught me “save first” without turning it into fear.\n\nNow I’m eighteen and I can step into life without chains on my ankles.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_debt_none_v2",
    requireAll: ["DEBT_NONE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We were careful, not afraid.'", "'You made stability normal.'", "'I’m grateful.'"],
    paragraphs: ["{SALUTATION}\n\nSome families inherit drama.\nWe inherited a plan.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI know that took discipline.\nI know it wasn’t glamorous.\n\nBut you gave me the kind of freedom you can’t buy — you build it.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_debt_low_v1",
    requireAll: ["DEBT_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We carried some weight.'", "'But it didn’t crush us.'", "'We managed.'"],
    paragraphs: ["{SALUTATION}\n\nDebt was there, but it wasn’t everything.\nIt was a problem — not a destiny.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned how adults solve things: slowly, with paperwork.\n\nIt’s not romantic, but it works.\nI’m taking that steadiness with me.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_debt_low_v2",
    requireAll: ["DEBT_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You kept the lights on.'", "'You kept your humor too.'", "'That’s my favorite part.'"],
    paragraphs: ["{SALUTATION}\n\nWe had bills. We had stress.\nWe also had jokes — sometimes bad ones.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned that being responsible doesn’t mean being miserable.\n\nI’m eighteen now and I’m bringing that lesson into my own life.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_debt_high_v2",
    requireAll: ["DEBT_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'The debt was loud.'", "'So was your effort.'", "'I noticed.'"],
    paragraphs: ["{SALUTATION}\n\nSome problems live in the background.\nDebt lives in your calendar.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI saw what it took to hold everything together.\nI saw the stress — and the moments you still chose me.\n\nThat kind of love is not soft. It’s strong.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_debt_high_v3",
    requireAll: ["DEBT_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We carried a mountain.'", "'We took one step at a time.'", "'I learned grit.'"],
    paragraphs: ["{SALUTATION}\n\nWe didn’t have a clean, easy path.\nWe had determination.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned how to keep going when the math is ugly.\nI also learned I deserve a future where it isn’t.\n\nThat’s what I’m building now.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_verylow_v1",
    requireAll: ["RETIRE_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We didn’t have a safety net.'", "'We had each other.'", "'We still built a life.'"],
    paragraphs: ["{SALUTATION}\n\nI’m old enough now to understand how scary it is to have no cushion.\nYou still kept going.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nMaybe we didn’t store up money.\nBut you stored up skills: persistence, problem-solving, and the ability to start again.\n\nI’m carrying that into my adulthood — and I’m also building the cushion we didn’t have.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_verylow_v2",
    requireAll: ["RETIRE_VERYLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We lived in the present.'", "'Sometimes too much.'", "'I’m learning to plan now.'"],
    paragraphs: ["{SALUTATION}\n\nWe weren’t a “five-year plan” family.\nWe were a “get through this year” family.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI don’t judge you for that.\nI just know what it taught me.\n\nI’m learning to plan gently — without panic — because I want a softer future.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_low_v1",
    requireAll: ["RETIRE_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You tried to plan.'", "'Life kept happening.'", "'You kept adapting.'"],
    paragraphs: ["{SALUTATION}\n\nI saw you try to do the “responsible” thing.\nI also saw life throw curveballs.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nMaybe the savings weren’t huge.\nBut the effort was real.\n\nThat taught me the important lesson: planning matters — and flexibility matters too.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_low_v2",
    requireAll: ["RETIRE_LOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We were building while living.'", "'It wasn’t perfect.'", "'It was honest.'"],
    paragraphs: ["{SALUTATION}\n\nOur life looked like progress in small steps.\nNot a dramatic glow-up — steady movement.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI’m grateful for the realism.\nIt made me less entitled and more capable.\n\nNow I’m building my own long game — with a little more peace.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_mid_v1",
    requireAll: ["RETIRE_MID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You made the future feel possible.'", "'We had a plan.'", "'It helped.'"],
    paragraphs: ["{SALUTATION}\n\nI grew up watching you balance today and tomorrow.\nThat’s a hard skill.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nWe weren’t living in fear.\nWe weren’t living in fantasy.\n\nWe were building — and that’s why I believe I can build too.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_mid_v2",
    requireAll: ["RETIRE_MID"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You taught me consistency.'", "'Not perfection — consistency.'", "'That’s the real wealth.'"],
    paragraphs: ["{SALUTATION}\n\nThe future didn’t feel like a cliff.\nIt felt like a staircase.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat’s what your planning did.\nIt turned “someday” into “step by step.”\n\nI’m taking that mindset into adulthood.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_high_v1",
    requireAll: ["RETIRE_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You planned ahead.'", "'You kept us stable.'", "'I noticed even then.'"],
    paragraphs: ["{SALUTATION}\n\nSome kids grow up with chaos as background noise.\nI grew up with stability.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat stability made room for me to become myself.\nIt made room for mistakes without catastrophe.\n\nI know that didn’t happen by accident. Thank you.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_high_v2",
    requireAll: ["RETIRE_HIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You built a safety net.'", "'You also built a home.'", "'Both were love.'"],
    paragraphs: ["{SALUTATION}\n\nYou did the unsexy work: planning, saving, thinking ahead.\nThat’s one of the purest forms of care.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI’m older now and I understand it.\nI’m grateful for it.\n\nYou gave me a calm start line.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_veryhigh_v1",
    requireAll: ["RETIRE_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You future-proofed us.'", "'You made stability feel normal.'", "'That’s rare.'"],
    paragraphs: ["{SALUTATION}\n\nI didn’t grow up wondering if we’d be okay.\nI grew up believing it.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat belief shapes everything.\nIt makes you brave in the right ways.\n\nI’m trying to honor that gift by living with purpose, not just comfort.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_retire_veryhigh_v2",
    requireAll: ["RETIRE_VERYHIGH"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You gave me a soft landing.'", "'Now I’m choosing a strong life.'", "'Thanks for the runway.'"],
    paragraphs: ["{SALUTATION}\n\nSecurity can make people lazy.\nYou didn’t let it.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nYou gave me support — and standards.\nYou gave me comfort — and character.\n\nThat combination is a blessing.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}", "Tiny truth: stability is a superpower."]
  },
  {
    id: "letter_forgive_fast_v2",
    requireAll: ["FORGIVE_FAST"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You apologized when it mattered.'", "'You repaired.'", "'That changed everything.'"],
    paragraphs: ["{SALUTATION}\n\nOne of the biggest gifts you gave me was seeing repair in real time.\nNot shame. Not denial. Repair.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nBecause you could say “I was wrong,”\nI learned that mistakes aren’t the end of love.\n\nI’m carrying that into my relationships.\nIt’s the difference between breaking and bending.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_fast_v3",
    requireAll: ["FORGIVE_FAST"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We didn’t stay stuck.'", "'We talked.'", "'We moved forward.'"],
    paragraphs: ["{SALUTATION}\n\nSome families collect grudges like trophies.\nWe collected second chances.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat didn’t erase the hard moments.\nIt kept them from becoming the whole story.\n\nI’m eighteen now, and I know how rare that is.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_slow_v1",
    requireAll: ["FORGIVE_SLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'It took time.'", "'We didn’t rush it.'", "'We rebuilt anyway.'"],
    paragraphs: ["{SALUTATION}\n\nForgiveness in our house wasn’t instant.\nIt was earned — slowly.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nSome things took years to soften.\nSome conversations happened late.\n\nBut we kept returning to the table.\nThat’s what made it possible.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_slow_v2",
    requireAll: ["FORGIVE_SLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We healed like real people.'", "'Messy and slow.'", "'But we did heal.'"],
    paragraphs: ["{SALUTATION}\n\nI used to think forgiveness was one decision.\nNow I know it’s a practice.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nSome days I forgave you.\nSome days I didn’t.\n\nAnd then, over time, the balance shifted.\nThat’s what growing up looks like.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_very_slow_v2",
    requireAll: ["FORGIVE_VERY_SLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'It took years.'", "'We carried it a long time.'", "'I’m still learning.'"],
    paragraphs: ["{SALUTATION}\n\nSome parts of our story didn’t heal quickly.\nThey sat with us.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI’m not writing this to reopen wounds.\nI’m writing it because I’m finally old enough to understand them.\n\nI’m still learning what forgiveness means without losing myself.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_very_slow_v3",
    requireAll: ["FORGIVE_VERY_SLOW"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We didn’t get closure on schedule.'", "'We kept living anyway.'", "'That’s real.'"],
    paragraphs: ["{SALUTATION}\n\nTime didn’t fix everything.\nBut time did make space.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nSpace to breathe.\nSpace to see each other as humans.\n\nI don’t know if we ever get a perfect ending.\nBut I know we’re not stuck in the beginning anymore.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_complicated_v1",
    requireAll: ["FORGIVE_COMPLICATED"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I forgive some things.'", "'Some things needed boundaries.'", "'Both can be true.'"],
    paragraphs: ["{SALUTATION}\n\nI want to be honest without being cruel.\nForgiveness is complicated in our story.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI can love you and still protect myself.\nI can remember and still move forward.\n\nI’m learning a kind of forgiveness that doesn’t erase me.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_forgive_complicated_v2",
    requireAll: ["FORGIVE_COMPLICATED"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'It’s not simple.'", "'But it’s real.'", "'I’m choosing my future anyway.'"],
    paragraphs: ["{SALUTATION}\n\nSometimes people want forgiveness to be a clean reset.\nThat’s not how it worked for us.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nSome things softened. Some things stayed tender.\n\nI’m not trapped by it anymore.\nI’m building something honest — with room for both truth and peace.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_travel_none_v2",
    requireAll: ["TRAVEL_NONE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We didn’t go far.'", "'We went deep.'", "'Home was a whole world.'"],
    paragraphs: ["{SALUTATION}\n\nWe weren’t a passport family.\nWe were a “make a life here” family.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned how to find meaning in the ordinary.\nI learned how to build joy without a plane ticket.\n\nNow, if I travel, it’ll be because I want to — not because I’m escaping.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_travel_none_v3",
    requireAll: ["TRAVEL_NONE"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'My childhood wasn’t a montage.'", "'It was real life.'", "'I’m grateful for it.'"],
    paragraphs: ["{SALUTATION}\n\nI used to think adventures were only the big ones.\nNow I know better.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThe adventure was learning who I was in a steady place.\nThe adventure was you showing up in the same zip code, day after day.\n\nThat kind of consistency is rare — and powerful.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_travel_some_v1",
    requireAll: ["TRAVEL_SOME"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We didn’t travel constantly.'", "'But we did travel on purpose.'", "'I remember it.'"],
    paragraphs: ["{SALUTATION}\n\nWe had a few trips that mattered.\nNot because they were expensive — because they were ours.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI remember how you looked when you relaxed.\nI remember how you let me be curious.\n\nThose moments widened my world more than the miles did.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_travel_some_v2",
    requireAll: ["TRAVEL_SOME"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'A few stamps.'", "'A lot of meaning.'", "'That’s the ratio.'"],
    paragraphs: ["{SALUTATION}\n\nWe weren’t always going somewhere.\nBut when we went, it counted.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned how to step into new places without shrinking.\nI learned how to be flexible without being lost.\n\nNow I’m eighteen and I feel ready for the next map.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_travel_alot_v2",
    requireAll: ["TRAVEL_A_LOT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'My childhood had stamps.'", "'It also had stories.'", "'I carry them.'"],
    paragraphs: ["{SALUTATION}\n\nI grew up learning that the world is bigger than fear.\nYou showed me places — and you showed me how to be in them.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned curiosity.\nI learned adaptability.\n\nMost of all, I learned that home can be something you carry.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_travel_alot_v3",
    requireAll: ["TRAVEL_A_LOT"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'We moved through the world.'", "'We learned each other in new places.'", "'It shaped me.'"],
    paragraphs: ["{SALUTATION}\n\nI remember airports, road trips, strange snacks, and the way you laughed when plans changed.\nI remember you saying: “We’ll figure it out.”\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat sentence raised me.\nIt made me brave.\n\nNow I’m eighteen and I know I can handle the unknown — because you trained me gently.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_partner_yes_v2",
    requireAll: ["PARTNER_YES"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'I watched two adults try.'", "'Sometimes it was messy.'", "'But it was real.'"],
    paragraphs: ["{SALUTATION}\n\nI learned love by watching it happen in front of me.\nNot the perfect version — the practiced version.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI saw disagreements and repairs.\nI saw compromise.\n\nThat’s why I don’t think love is luck.\nI think it’s work people choose.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_partner_yes_v3",
    requireAll: ["PARTNER_YES"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'There was teamwork.'", "'There was tension.'", "'There was still care.'"],
    paragraphs: ["{SALUTATION}\n\nWhen I think of my childhood, I think of the feeling of “we.”\nEven when life got hard, there was more than one set of hands.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nThat shaped me.\nIt made me believe support is allowed.\n\nNow I’m eighteen and I’m choosing relationships that feel like teamwork — not a test.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_partner_no_v2",
    requireAll: ["PARTNER_NO"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You did it alone sometimes.'", "'I noticed the weight.'", "'I also noticed the love.'"],
    paragraphs: ["{SALUTATION}\n\nI grew up watching you do the job of two people.\nNot perfectly — but with stubborn care.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI learned independence.\nI learned gratitude.\n\nAnd I learned something else too:\na single person can still be a whole home.\n\n{archetypeTruth}\n\nLove,\n{childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  },
  {
    id: "letter_partner_no_v3",
    requireAll: ["PARTNER_NO"],
    headlines: ["A Letter From Your Adult Child"],
    bullets: ["'You were the whole team.'", "'That was a lot.'", "'I’m proud of you.'"],
    paragraphs: ["{SALUTATION}\n\nSome kids have two adults to blame and two adults to thank.\nI had you.\n\nI remember:\n• {callback1}\n• {callback2}\n\n{beat1}\n\nI know you got tired.\nI know you still showed up.\n\nI’m eighteen now, and I can finally say it clearly:\nI’m proud of you.\n\n{archetypeTruth}\n\n— {childName}"],
    tinyTruths: ["Tiny truth: {archetypeStinger}"]
  }
]
};