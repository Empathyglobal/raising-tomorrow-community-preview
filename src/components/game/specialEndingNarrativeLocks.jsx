export const BADGE_TO_TROPHY = {
  "🏆 Legendary: First Human on Mars": "mars_pioneer",
  "🗳️ Legendary: The President (Listener)": "hero_president",
  "☄️ Legendary: Asteroid Tycoon": "asteroid_tycoon",
  "⏳ Legendary: Time Traveler": "time_traveler",
  "🧱 Special: Blockcraft 2": "blockcraft_2",
  "🧨 Legendary: Supervillain Arc": "supervillain_arc",
  "🕯️ Special: Cult Leader": "cult_leader",
  "🤖 Secret: Human Resistance": "human_resistance",
  "🧟 Secret: World Destroyer": "world_destroyer",
  "🏆 Legendary: Nobel‑Tier Scientist": "nobel_tier_scientist",
  "🏆 Legendary: Olympic Medalist": "olympic_medalist",
  "🏆 Legendary: Peacemaker": "peacemaker",
  "🏆 Legendary: Media Mogul": "media_mogul",
  "🏆 Legendary: Kingmaker": "kingmaker",
  "✨ Special: Meme Icon": "meme_icon",
  "🏆 Legendary: Dynasty Builder": "dynasty_builder",
};

export const SPECIAL_ENDING_NARRATIVE_LOCKS = {
  time_traveler: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        "They didn't just chase the future — they fell through it.",
        "Proof shows up in the wrong centuries (and the right museums).",
        "Money: irrelevant when your kid is 5,000 years away.",
      ],
      paragraphs: [
`They chased a question too big to stay polite. One day they were building something that made your stomach tight — the next day they were gone.

There's no clean explanation. No closure. Just evidence that shouldn't exist: a clay tablet with your name, an old photograph where the "stranger" has your child's face, a museum label that quietly reads: "Origin: unknown."`,
`They worked in experimental physics until "impossible" became a scheduling issue. Then time folded and normal life stopped applying.

Years later, artifacts appear like breadcrumbs through history. The world debates it. You don't. You recognize your child the way you recognize your own heartbeat.`,
      ],
      tinyTruths: [
        `Tiny truth: you still keep a calendar reminder titled "Maybe Today."`,
        `Tiny truth: you've learned to love without closure — but you never stopped hoping.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

You're going to laugh. Or cry. Or both.

You're holding this on my 35th birthday.
I'm writing it on my 17th.
Also, it's on a clay tablet — because the postal system in Mesopotamia is basically "a guy" and I had to work with what I had.

Long story short: I time‑traveled.
I know. I know. "Don't push the button." I pushed the button.

The good news: I'm alive.
The weird news: bread here is incredible. The Internet is not.
The emotional news: I miss you in a sideways, timeline‑bent kind of way.

If a museum ever calls and says, "We found a tablet that says 'HI {parentRole}' in cuneiform," please don't faint. That's just me — saying hi across 5,000 years.

Love you.
Tell the future I said sorry about everything.

— {childName}`,
`{SALUTATION}

If you're reading this, then time did the thing again.

I'm okay. I'm just… not in the same "when" as you.

I've learned three useful skills:
1) How to smile politely when someone offers you goat milk like it's a luxury beverage.
2) How to not panic when the stars look wrong.
3) How to be kind even when nobody understands your language — because you raised me that way.

I left proof where I could: stone, clay, stupid little carvings in quiet places.
Not because I wanted to be famous.
Because I wanted you to know I existed. That I loved you. That I'm still me.

If you ever see my face in an ancient mural, please don't wave.
That's how you get a paradox.

Love,
{childName}`,
`{SALUTATION}

I'm writing quickly.
I have a meeting yesterday.

I miss you.
I miss indoor plumbing.
I miss you more.

— {childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `The world calls it impossible. Your heart calls it your child.`,
        `History gains a mystery. You gain a lifetime of "maybe."`,
        `Some loves don't end. They echo.`,
      ],
      paragraphs: [
`Time keeps moving like it didn't steal anything from you.

On birthdays you feel it most — the absence that still has a pulse. And then, in the most ridiculous way, proof arrives: a museum photo, a carved message, a clay tablet that somehow ends up in your hands on the exact day it promised.

You learn to live with two truths at once:
You never got closure.
And you never stopped loving them.`,
      ],
      tinyTruths: [
        `Tiny truth: you look at old history books like they're personal mail.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Curiosity stopped being a trait and became a doorway.`,
        `They learned courage without an audience — just the next moment.`,
        `They carried your values into centuries that didn't ask for them.`,
      ],
      paragraphs: [
`They grew into someone who could be dropped into chaos and still choose decency.

They built routines out of nothing. They learned languages from gestures and patience. They kept their humor when the timeline tried to swallow it.

Even far from you — especially far from you — they kept doing what you taught them: breathe, repair, be human.`,
      ],
      tinyTruths: [
        `Tiny truth: the bravest thing they did wasn't time travel — it was staying kind after it.`
      ]
    }
  },

  mars_pioneer: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They became the first human to step onto Mars.`,
        `Life became checklists, pressure seals, and controlled breathing.`,
        `Money: high. Meaning: higher.`,
      ],
      paragraphs: [
`They trained for years for a moment that lasted seconds — boots on red soil, a breath held too long, a planet that looked unreal until it wasn't.

They didn't become legendary by being fearless. They became legendary by being steady: doing the boring checks, repeating the drills, staying kind under pressure.`,
      ],
      tinyTruths: [
        `Tiny truth: they still keep an old "good luck" note from home tucked in their gear.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I'm writing this from a place that used to be science fiction and is now… my Tuesday.

Mars is red in a way no photo gets right. The dust is so fine it gets into everything, including my dignity. (The space toilet has opinions. Strong ones.)

When I stepped onto the surface, I didn't say anything heroic. I whispered your name into my mic — because you were the first person I wanted in my head when my boots hit another planet.

I'm okay. I'm scared sometimes. I'm also weirdly calm… because you trained me for hard things:
breathe, check the basics, be kind to the humans in the room.

If you look up at the night sky and see that bright dot, just know:
I'm up here, doing my best, and thinking of home.

Love,
{childName}`,
`{SALUTATION}

MISSION UPDATE:

Day 1: Landed. Did not immediately trip. This is my greatest achievement.
Day 3: Discovered that "low gravity" makes you confident until you try to carry anything.
Day 12: I have become a professional dust‑wiper. Mars is basically a glitter bomb.

Real talk: the hardest part isn't the science. It's the weight of the moment.
But every time my nerves spike, I hear you in my head: "Slow down. Do the next right thing."

So that's what I'm doing — on a whole other planet.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `A footprint became a symbol — and a responsibility.`,
        `They stayed human in a place that didn't care if they were.`,
        `Home never stopped being part of the mission.`,
      ],
      paragraphs: [
`Their first step becomes a global memory — replayed, quoted, argued over, mythologized.

But in private, they stay simple: one day at a time, one system at a time, one kind word to the teammate who looks scared.

History remembers the "first."
You remember the kid — and the way love trained them to be steady.`,
      ],
      tinyTruths: [
        `Tiny truth: they still miss the simplest things — familiar voices and ordinary air.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Discipline became oxygen: do the checklist, survive the day.`,
        `Confidence became calm: not loud, just reliable.`,
        `Empathy became leadership: keep the team human.`,
      ],
      paragraphs: [
`They grew into steadiness — the kind you can lean on in emergencies.

They learned that bravery isn't a feeling. It's a practice: doing the next step, even while afraid, without making fear everyone else's problem.

They didn't just reach Mars.
They grew into someone who could carry it.`,
      ],
      tinyTruths: [
        `Tiny truth: the bravest thing they did was staying gentle under pressure.`
      ]
    }
  },

  hero_president: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They became President — famous for listening first.`,
        `They lead with questions, not volume.`,
        `Wealth: high, but never the point.`,
      ],
      paragraphs: [
`They don't lead like a superhero with a cape. They lead like a person with a notebook: listening, asking better questions, and making room for the quiet voices.

People call it "strength" because it is — especially when it would be easier to perform.`,
      ],
      tinyTruths: [
        `Tiny truth: they still get nervous before big speeches — then breathe and do it anyway.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

Tonight I'm writing from a desk with too many drawers and a security detail that politely pretends not to hear me whisper, "Where did I put my phone?"

Yes. I'm President.

Before the cameras and speeches, there was you.
There was the way you listened when my feelings were messy and my logic was worse.
You taught me that people calm down faster when they feel seen — and that "winning" isn't the same as "leading."

I still carry that into every room.
I ask one extra question.
I let silence do its job.
I read the boring briefing twice.

Anyway. This is me, reminding you:
your patience became policy.

Love,
{childName}`,
`{SALUTATION}

Inauguration Day Notes:

1) The oath is shorter than the line to use the bathroom.
2) They hand you approximately 400 pens. I don't know why. I suspect it's a test.
3) The hardest part wasn't the crowd — it was remembering that leadership is still just… humans.

So I'm doing what you trained me to do:
listen long enough for the truth to show up.

I love you.
Call me. (Yes, I'm serious. The White House has terrible snacks.)

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `They made listening a form of power.`,
        `They stayed human in rooms that reward performance.`,
        `They carried home into history.`,
      ],
      paragraphs: [
`They serve, they stumble, they learn, they repair.

Critics never disappear — but neither does their commitment to being decent under pressure. And when it's over, they don't chase glory. They return to the ordinary parts of life with relief.

History gets a headline.
You get the quiet truth: you raised someone who could hold power without losing their humanity.`,
      ],
      tinyTruths: [
        `Tiny truth: they still remember the adults who modeled repair.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Empathy became strategy — not softness, but skill.`,
        `Confidence became composure: calm is contagious.`,
        `Discipline became consistency: show up, even when it's boring.`,
      ],
      paragraphs: [
`They grew into a rare kind of leader: someone who can hold conflict without becoming cruel.

They learned to stay steady in loud rooms and to keep asking questions when everyone wants a quick villain.

They didn't become perfect.
They became trustworthy.`,
      ],
      tinyTruths: [
        `Tiny truth: they learned early that repair beats pride.`
      ]
    }
  },

  asteroid_tycoon: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They became an asteroid‑mining pioneer (yes, really).`,
        `High risk, high math, and very expensive snacks.`,
        `Money: suddenly… absurd.`,
      ],
      paragraphs: [
`They became one of the early asteroid‑mining pioneers — the kind of job that sounds fake until you see the receipts.

The fortune arrived in strange waves: one discovery, one contract, one "wait, is this real?" moment. The world called it luck. The people close to them called it preparation.`,
      ],
      tinyTruths: [
        `Tiny truth: they still think freeze‑dried dessert is a war crime.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I know you wanted a normal job title you could explain to strangers.

I'm sorry.
I mine asteroids.

I'm currently strapped into a chair inside a metal tube, eating a granola bar that tastes like laminate, while a robot arm grabs a rock worth more than a small country.

The weird part? I'm calm.
You raised me to do boring checklists and not panic when alarms beep.
Turns out that's basically the entire space economy.

Also: yes, I am rich now.
No, I am not buying a yacht.
The closest I want to get to a boat is "in a museum, behind glass."

Love,
{childName}`,
`{SALUTATION}

Quick update from space:

• We found a rock full of rare metals.
• My boss said the words "generational wealth" and I blacked out for a second.
• Customs asked what I was bringing back. I said "a small asteroid" and they stopped replying.

If I come home and you see me acting normal, please know:
this is me pretending my life hasn't become a bizarre math‑and‑vacuum opera.

Thank you for teaching me steadiness.
And for not laughing when I was a kid pointing at the sky like it was a plan.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `Wealth became real. So did responsibility.`,
        `They stayed grounded — somehow — in a very ungrounded career.`,
        `They never forgot being human was the point.`,
      ],
      paragraphs: [
`Their name becomes shorthand for a new era: mining the sky, building industries that didn't exist when they were little.

But in private, they remain oddly unchanged — calling home after big days, taking care of their crew, putting kindness where people expect ego.

They got rich.
They didn't get lost.`,
      ],
      tinyTruths: [
        `Tiny truth: their favorite souvenir is still a cheap childhood "space" keychain.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Discipline became survival: systems don't forgive vibes.`,
        `Confidence became quiet: panic helps nobody in a tin can.`,
        `Empathy became leadership: keep the crew okay.`,
      ],
      paragraphs: [
`They grew into someone who can hold risk without becoming reckless.

They learned that big dreams require boring habits — and that the people beside you matter more than the headlines about you.

They didn't just mine rocks.
They built a life that stayed steady.`,
      ],
      tinyTruths: [
        `Tiny truth: they still call you first when something big happens.`
      ]
    }
  },

  blockcraft_2: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They built Blockcraft 2 — and the world couldn't stop playing.`,
        `Fame: constant. Creativity: still alive.`,
        `Money: very high (and they still complain about taxes).`,
      ],
      paragraphs: [
`They became a game developer the most ridiculous way: obsessing, learning, failing, trying again, and shipping something that made people feel joy.

Blockcraft 2 became more than a hit — it became a place people lived inside for comfort, creativity, and community.`,
      ],
      tinyTruths: [
        `Tiny truth: they still get excited about small features, like better doors.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

PATCH NOTES — "MY LIFE" v2.0
• Added: Blockcraft 2 (somehow)
• Fixed: "panic when deadlines exist"
• Improved: ability to accept praise without combusting
• Known bug: I still explain door mechanics to strangers

Real talk:
The reason I could build a whole world is because you let me build tiny ones first.
You didn't call it pointless.
You called it practice.

So if you ever see my name trending and think, "How did this happen?"
It happened in our living room.
One small project at a time.

Love,
{childName}`,
`{SALUTATION}

I made a game that took over the world.

I'm sorry.
And you're welcome.

People keep asking how I did it and I want to tell the truth:
a grown‑up once cared about my tiny progress.
A grown‑up didn't mock the weirdness out of me.
A grown‑up let me fail without making me feel stupid.

So if Blockcraft 2 makes people feel safe enough to create…
that's your influence, wearing a pixel costume.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `Their creativity became a place millions could breathe.`,
        `Fame didn't erase their values — it amplified them.`,
        `They built worlds, then built a life.`,
      ],
      paragraphs: [
`Blockcraft 2 becomes a cultural event — not just addictive, but oddly hopeful.

Players don't just compete. They collaborate. They build. They repair. In a quiet way, your child codes their values into entertainment.

They become famous.
They stay real.`,
      ],
      tinyTruths: [
        `Tiny truth: they still keep a folder titled "stupid ideas (do not delete)."`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Resilience became their superpower: ship, crash, fix, ship again.`,
        `Confidence became creativity: make choices without begging approval.`,
        `Empathy became design: build spaces that feel safe.`,
      ],
      paragraphs: [
`They grew into someone who can fail publicly and keep building anyway.

They learned that talent starts things — discipline finishes them — and kindness makes them worth finishing.

They didn't just make a hit.
They made meaning.`,
      ],
      tinyTruths: [
        `Tiny truth: they still hear your encouragement when they hit "publish."`
      ]
    }
  },

  supervillain_arc: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They became a supervillain… briefly.`,
        `There was branding. There were speeches. There was a megalaser (unfinished).`,
        `They got stopped before anything catastrophic happened.`,
      ],
      paragraphs: [
`They had the brains for greatness — and used them for drama.

For a while, they leaned into the supervillain identity: dark aesthetic, dramatic monologues, and inventions that belonged in a comic book more than reality.

It didn't end with triumph.
It ended with accountability.`,
      ],
      tinyTruths: [
        `Tiny truth: they called it a "megalaser" because "Overreaction Beam" didn't test well.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

Before you hear it from the news: yes, I have a lair.
No, it is not in a volcano. (Volcanoes are a maintenance nightmare.)

I got… a little carried away.
I thought being the smartest person in the room meant I got to decide what the room should do.
So I built something dramatic.
There were blueprints.
There was monologuing.
There was, briefly, an employee handbook for "henchpersons." (Dental plan: terrible.)

Good news: nobody got hurt.
Better news: I'm realizing "power" without empathy is basically just loneliness with branding.

If you're willing, I'd like to come home for dinner.
I promise not to call it a "summit."

Love,
{childName}`,
`{SALUTATION}

I tried the whole "villain arc" thing.

It turns out being evil is 70% paperwork, 20% unresolved feelings, and 10% getting stopped by consequences.
(Also, capes are a tripping hazard. Who knew.)

I'm not asking you to pretend it was fine.
I'm asking you to believe I can change the direction of my brain.

I'm still me.
Just… hopefully less like a comic book mistake.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `They hit a wall — and finally listened to it.`,
        `Consequences became a teacher they couldn't outsmart.`,
        `They learned: brilliance without empathy collapses.`,
      ],
      paragraphs: [
`The "supervillain arc" ends the least dramatic way possible: accountability, limits, and someone firmly saying "no."

It stings. It humbles. It changes them.

Their talent remains. But slowly — with effort — the direction shifts from domination to repair.`,
      ],
      tinyTruths: [
        `Tiny truth: their biggest upgrade wasn't intelligence — it was humility.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `They learned to feel shame without turning it into rage.`,
        `They learned power isn't control — it's responsibility.`,
        `They learned repair is harder than drama (and worth it).`,
      ],
      paragraphs: [
`They grew the part of themselves that can pause.

The part that can hear criticism without becoming cruel.
The part that can build without needing to win.

They didn't become perfect.
They became safer.`,
      ],
      tinyTruths: [
        `Tiny truth: the real villain was unprocessed pain. They started processing it.`
      ]
    }
  },

  human_resistance: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `The world changed. Normal careers stopped making sense.`,
        `They became a leader in the Human Resistance.`,
        `Money: meaningless. Community: everything.`,
      ],
      paragraphs: [
`After the Machine War began, survival became the job.

They learned to repair radios, ration food, organize people, and keep morale alive. Leadership wasn't a title they chased. It was the responsibility that landed on them because they could still think clearly when things got loud.`,
      ],
      tinyTruths: [
        `Tiny truth: their most prized possession is still a working flashlight.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

Good news: I'm famous.

Bad news: it's because I'm the face of the Human Resistance.

Worse news: we call you "The Briefcase Era" in the history lessons.

Anyway — I'm alive.
I'm stubborn.
And I'm still your kid.

Love (complicated but real),
{childName}`,
`{SALUTATION}

The machines wanted obedience. Humans needed meaning.

So I built a movement: repairs, community, and courage.
People think I'm brave.
I think I'm just refusing to quit.

If there's anything I learned from you:
repair is real.

— {childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `The future didn't end — it changed shape.`,
        `They kept people human when the world tried to make them numbers.`,
        `Rebuilding became the new kind of heroism.`,
      ],
      paragraphs: [
`The war doesn't resolve cleanly. Nothing does.

But the Resistance grows into something more than survival: a culture of repair, cooperation, and stubborn hope. Your child becomes the kind of adult who can hold grief and still build a tomorrow.

The world changed.
They changed with it.`,
      ],
      tinyTruths: [
        `Tiny truth: hope returned in small pieces — and they kept collecting them.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `They became disciplined because chaos demanded it.`,
        `They became empathetic because cruelty was easy and they refused it.`,
        `They became a leader by staying human on purpose.`,
      ],
      paragraphs: [
`They grew into someone who can carry responsibility without turning cold.

They learned to make plans, to keep promises, to repair what breaks — and to keep choosing people over power.

In the end, their greatest skill wasn't fighting.
It was rebuilding.`,
      ],
      tinyTruths: [
        `Tiny truth: they still remember your voice — even when the world got loud.`
      ]
    }
  },

  world_destroyer: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They created a fictional zombie virus project — in a lab, on paper.`,
        `It was stopped and contained before anyone was harmed.`,
        `Brilliance without compassion is dangerous. They learned that the hard way.`,
      ],
      paragraphs: [
`This is a fictional "what-if" scenario (BitLife-style drama, not real bioweapons).

They built a science project that went too far: a theoretical zombie pathogen designed "just to see if it could be done." No one was infected. No outbreak happened. But the intent was enough.

Authorities intervened. The lab was shut down. The story made headlines as a cautionary tale about unchecked ambition.`,
      ],
      tinyTruths: [
        `Tiny truth: they had the intelligence. They lacked the empathy to ask "should I?"`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I know what the news said.
I know what people think.

I didn't release it. Nobody got hurt.
It was a theoretical project—a simulation that got flagged before it ever left containment.

But the question people keep asking is fair:
"Why would you even build it?"

I don't have a good answer.
I had curiosity without compassion. Intelligence without a guardrail.

I'm still processing what that says about me.

— {childName}`,
`{SALUTATION}

They stopped me.
The authorities. The ethics board. The headline that called it "reckless genius."

They were right.

I built something brilliant and horrifying—and I didn't pause long enough to ask if I should.

I'm not asking you to be proud.
I'm asking you to know I'm still here, still learning, and trying to build something better now.

— {childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `The project was fictional. The consequences were real.`,
        `They learned accountability the hardest way.`,
        `Brilliance + empathy beats brilliance alone.`,
      ],
      paragraphs: [
`The "World Destroyer" headline follows them for years—even though no one was harmed, no pathogen was released.

It becomes a teaching case in ethics courses: "What happens when intelligence outruns wisdom?"

They don't become a villain. They become cautious. They redirect their skills toward repair, not chaos.

Some stories are warnings. This one was.`,
      ],
      tinyTruths: [
        `Tiny truth: they still have the brilliance. They just added a conscience.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Intelligence: extreme. Empathy: nearly absent.`,
        `They learned the difference between "can I" and "should I."`,
        `Consequences became their teacher.`,
      ],
      paragraphs: [
`They grew into someone who could solve problems most people can't even see.

But without empathy, problem-solving becomes a weapon.

The world stopped them. Accountability arrived. And slowly—painfully—they learned to aim their brilliance at repair instead of chaos.`,
      ],
      tinyTruths: [
        `Tiny truth: the smartest move they ever made was listening to the people who said "stop."`
      ]
    }
  },

  nobel_tier_scientist: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They turned curiosity into citations (and probably forgot to eat lunch).`,
        `Nobel Prize territory — the kind where your name becomes a verb.`,
        `Wealth: comfortable. Legacy: untouchable.`,
      ],
      paragraphs: [
`They became the kind of scientist whose work gets quoted in textbooks and memed on the Internet at the same time.

The breakthrough didn't arrive overnight. It was years of "wait… what if?" scribbled on napkins, refined in labs, and tested until it held water. Their discipline kept them steady. Their curiosity kept them going.`,
      ],
      tinyTruths: [
        `Tiny truth: they still keep a childhood notebook labeled "Questions Nobody Will Answer."`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

They're giving me an award.

Not a participation trophy — the kind where people wear tuxedos and the speeches are painfully long.

The weird part?
I remember when my biggest question was "why is the sky blue?"
You didn't say "just because."
You said "great question" and we looked it up.

Turns out that mattered.

All the big discoveries started as small questions you didn't shut down.

Thank you for not making me feel stupid when I didn't know things yet.

Love,
{childName}`,
`{SALUTATION}

I won.

The research landed. The peers clapped. The prize happened.

But if I'm honest, the moment I felt proudest wasn't the ceremony.
It was the day I realized: I ask better questions now because you normalized asking them.

You raised a brain that could stay curious without needing to be the smartest in the room.

That's rarer than the trophy.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `Curiosity became contribution. Questions became discoveries.`,
        `They made the world a little less mysterious — in a good way.`,
        `Fame arrived. Humility stayed.`,
      ],
      paragraphs: [
`Their name enters the textbooks quietly, with gratitude instead of ego.

They keep publishing, keep teaching, keep asking "what if we tried this?"

The Nobel isn't the end. It's permission to keep going.`,
      ],
      tinyTruths: [
        `Tiny truth: they still call you when a hypothesis breaks — not for answers, just for steadiness.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Intelligence became inquiry — not just answers, but better questions.`,
        `Discipline became practice — showing up even when it's boring.`,
        `Curiosity stayed alive — wonder never turned into cynicism.`,
      ],
      paragraphs: [
`They grew into someone who can stay interested without needing to dominate.

They learned to sit with "I don't know yet" without panic — because you taught them not knowing is part of learning.

They didn't just memorize facts.
They built a mind that could change itself.`,
      ],
      tinyTruths: [
        `Tiny truth: the skill that mattered most was tolerating boredom until the breakthrough arrived.`
      ]
    }
  },

  olympic_medalist: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They stood on the podium while an anthem played.`,
        `Years of 5am practice became one perfect moment.`,
        `Wealth: comfortable. The real prize: proving it was possible.`,
      ],
      paragraphs: [
`They became the kind of athlete whose routine sounds fake until you watch them do it: drills before sunrise, rest days that hurt, meals timed like science.

The medal wasn't luck. It was repetition turned into muscle memory.`,
      ],
      tinyTruths: [
        `Tiny truth: the thing they're proudest of isn't the gold — it's the discipline that got them there.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I stood on the podium.
The flag went up.
The anthem played.

And all I could think was:
you believed this was possible before I did.

You drove me to practice when I wanted to quit.
You packed the boring lunches.
You stayed calm when I panicked before qualifiers.

The medal is mine.
The reason it exists is you.

Love,
{childName}`,
`{SALUTATION}

TOURNAMENT DEBRIEF:
• Won gold. (Still doesn't feel real.)
• Cried on international television. (Very real.)
• Thanked my coaches. (Should've thanked you first.)

Real talk:
The hardest part of competing wasn't the pressure.
It was remembering I was allowed to be proud of myself — because you normalized celebrating wins without making them my entire personality.

I'm an Olympian now.
But I'm still your kid.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `The medal became a symbol — the routine became a life.`,
        `They learned: talent opens doors. Discipline walks through them.`,
        `They stayed grounded (mostly) after standing on clouds.`,
      ],
      paragraphs: [
`Fame arrives in waves. Interviews, endorsements, kids asking for autographs.

But what stays with them isn't the noise — it's the quiet certainty that hard work compounds.

They keep training. Keep showing up. Keep being kind to the beginners who remind them of younger versions of themselves.`,
      ],
      tinyTruths: [
        `Tiny truth: they still wake up early — not because they have to, but because routine feels like home.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Discipline became devotion: show up, even when nobody's watching.`,
        `Confidence became calm: trust the training, not the nerves.`,
        `Fitness became identity: the body is a practice space.`,
      ],
      paragraphs: [
`They grew into someone who can push limits without breaking themselves.

They learned that excellence is repetition dressed up as talent — and that staying healthy matters more than looking impressive.

They didn't just win.
They built a life around winning well.`,
      ],
      tinyTruths: [
        `Tiny truth: the proudest moment wasn't the podium — it was the day practice became voluntary.`
      ]
    }
  },

  peacemaker: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They ended conflicts that seemed impossible.`,
        `Empathy became their negotiation superpower.`,
        `Wealth: stable. Reputation: legendary.`,
      ],
      paragraphs: [
`They became a diplomat in the truest sense: someone who could sit in rooms full of anger and still find the thread that untangles it.

Their work isn't flashy. It's precise: listening long enough for the real issue to surface, building trust where cynicism lives, and staying calm when ego wants a microphone.`,
      ],
      tinyTruths: [
        `Tiny truth: the hardest negotiations were the ones nobody saw — rebuilding trust one sentence at a time.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I just brokered a ceasefire.

Not a metaphor. An actual ceasefire. Between people who were convinced peace was impossible.

The secret?
I listened until I understood both sides better than they understood themselves.

Where did I learn that?
You.

You were the grown‑up who paused before responding.
You were the grown‑up who said "tell me more" when I was mid‑meltdown.

That listening became my superpower.

Love,
{childName}`,
`{SALUTATION}

People keep asking how I stay calm in conflict.

The honest answer: you trained me for it.

You taught me feelings are information, not emergencies.
You taught me curiosity beats judgment.
You taught me repair is more useful than being "right."

I carry that into war rooms, treaty tables, and very tense phone calls.

Thank you for modeling the skill I needed most.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `They built bridges where others saw only walls.`,
        `Empathy wasn't weakness — it was leverage.`,
        `Peace became real in small, documented wins.`,
      ],
      paragraphs: [
`Their career becomes a quiet catalog of impossible conversations that worked.

They don't end every war. But they shift enough conflicts that the world notices.

They win awards. They turn them down. They keep showing up anyway — because the work matters more than the recognition.`,
      ],
      tinyTruths: [
        `Tiny truth: they still believe people are good at the core. It's their competitive advantage.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Empathy became a muscle — practiced, strengthened, intentional.`,
        `Social skills became strategy: read the room, then rewrite it.`,
        `Confidence became quiet: they don't need to dominate to lead.`,
      ],
      paragraphs: [
`They grew into someone who can hold tension without becoming tense.

They learned to ask questions that soften defenses. To listen without fixing. To trust the process even when the process feels fragile.

They didn't just "make peace."
They became someone peace could happen around.`,
      ],
      tinyTruths: [
        `Tiny truth: their greatest skill is making enemies feel heard before they become allies.`
      ]
    }
  },

  media_mogul: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They built an empire out of attention and perfectly timed posts.`,
        `Followers became fans. Fans became a movement.`,
        `Wealth: very high. Brand deals: endless.`,
      ],
      paragraphs: [
`They turned storytelling into a business and attention into influence.

What started as a few viral posts became platforms, shows, products, and a name everyone knows. The algorithm loved them. The audience stayed because the content stayed real — funny, warm, and weirdly honest.`,
      ],
      tinyTruths: [
        `Tiny truth: they still screenshot nice comments when imposter syndrome hits.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I have 8 million followers.

I also have a therapist who reminds me that likes are not love, and engagement is not intimacy.

The weird thing about fame: it amplifies everything.
The good stuff gets louder.
The imposter syndrome gets a megaphone.

But you taught me something useful:
attention is currency, but connection is oxygen.

So I stay human on purpose.
I reply to kind DMs.
I turn my phone off during dinner (mostly).
I remember I'm a person, not a brand.

Love,
{childName}`,
`{SALUTATION}

Today someone recognized me at the grocery store.

They said, "You changed my life."
I said, "Thank you. Also, do you know where the oat milk is?"

If there's anything you taught me, it's this:
people are people, no matter how many cameras show up.

I'm grateful for the platform.
I'm more grateful you raised me to stay real on it.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `Influence became responsibility — not just reach, but impact.`,
        `They stayed authentic when every incentive said "perform."`,
        `Fame didn't erase their humanity. It tested it — and they passed.`,
      ],
      paragraphs: [
`Their career becomes a case study in "how to be famous without losing yourself."

They build businesses, launch products, and shape trends — but they also take breaks, protect their peace, and remember that virality isn't the same as value.

They get rich.
They stay kind.`,
      ],
      tinyTruths: [
        `Tiny truth: the best advice they give online is the stuff you said at breakfast.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Social skills became strategy: connect, entertain, stay real.`,
        `Confidence became content: they show up without apologizing.`,
        `Intelligence became curation: know what resonates and why.`,
      ],
      paragraphs: [
`They grew into someone who can hold attention without exploiting it.

They learned to storytell with warmth, to engage without manipulation, and to remember the humans on the other side of the screen.

They didn't just build a brand.
They built a bridge.`,
      ],
      tinyTruths: [
        `Tiny truth: they credit you in speeches more than people expect.`
      ]
    }
  },

  kingmaker: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They don't need the crown. They run the kingdom anyway.`,
        `Political strategy became their art form.`,
        `Wealth: high. Influence: higher.`,
      ],
      paragraphs: [
`They became the person candidates call when campaigns feel impossible.

They don't run for office. They build the strategies, recruit the teams, and whisper the truths nobody else will say out loud. Power behind the throne energy — and they prefer it that way.`,
      ],
      tinyTruths: [
        `Tiny truth: they still believe good policy beats good branding.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

People ask if I'm ever going to run for office myself.

I laugh. Politely.

Because I already have the part I want: influence without the performance. Strategy without the spotlight. Power with an exit plan.

I help good people win. I protect them from bad advice. I tell them the truth when everyone else is telling them what they want to hear.

You taught me that service doesn't require a title — just consistency and care.

Love,
{childName}`,
`{SALUTATION}

Today I convinced three warring factions to agree on lunch.

Tomorrow I'll convince them to agree on policy.

The method?
Your method: listen long, speak short, stay calm.

I'm grateful you modeled patience.
Politics rewards performance.
But real power comes from the boring work nobody sees.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `Influence without ego became their signature.`,
        `They shaped outcomes — then walked away from cameras.`,
        `Their legacy isn't a statue. It's policy that works.`,
      ],
      paragraphs: [
`They never run for President. They make three Presidents possible.

Their work isn't sexy: spreadsheets, coalition‑building, and very boring phone calls that change laws. But it compounds — and the world quietly shifts because of it.

They get rich.
They stay private.
They keep working.`,
      ],
      tinyTruths: [
        `Tiny truth: their favorite wins are the ones nobody knows they pulled off.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Intelligence became analysis: see patterns before they become problems.`,
        `Social skills became strategy: coalition‑building is a superpower.`,
        `Confidence became composure: never let them see you sweat.`,
      ],
      paragraphs: [
`They grew into someone who can sit in rooms full of egos and still get everyone aligned.

They learned to negotiate without manipulation, to strategize without cruelty, and to hold power without needing applause.

They didn't just understand politics.
They understood people.`,
      ],
      tinyTruths: [
        `Tiny truth: the most powerful move is often silence — and they learned when to use it.`
      ]
    }
  },

  meme_icon: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `One weird moment. One camera. The internet did the rest.`,
        `They became permanently viral (and learned to live with it).`,
        `Wealth: variable. Fame: unavoidable.`,
      ],
      paragraphs: [
`It started as a moment — awkward, unplanned, captured on someone's phone — and turned into a cultural artifact.

They didn't try to go viral. They just existed at the exact wrong (or right?) moment. The meme spread. Remix culture took over. Their face became a reaction image.

They learned to laugh about it. Eventually.`,
      ],
      tinyTruths: [
        `Tiny truth: they Google themselves sometimes — just to make sure it's still happening.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I am permanently a meme.

I can't go to the grocery store without someone pointing.
I can't attend a wedding without becoming a reaction GIF.

Do I hate it? Sometimes.
Do I lean into it? Also yes.

You taught me to laugh at myself — which is the only reason I survived becoming the internet's punchline AND comfort character.

If you ever see my face on a T‑shirt, just know:
I get royalties.
And therapy.

Love,
{childName}`,
`{SALUTATION}

Quick update:
I'm in a museum exhibit about "Digital Culture Icons."

Next to a Nyan Cat plushie.

I don't know how to process this, but you raised me to find the absurdity funny instead of devastating.

So here we are.

Love (and confusion),
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `Virality became permanence — and they adapted.`,
        `Humor saved them when fame got weird.`,
        `They monetized chaos without losing themselves.`,
      ],
      paragraphs: [
`The meme never dies. It evolves, gets remixed, and resurfaces every few years like clockwork.

They learn to work with it: brand deals, comedy shows, a TED Talk that goes viral for different reasons.

They didn't ask for this.
But they made it work.`,
      ],
      tinyTruths: [
        `Tiny truth: they still cringe at the original video — but the residuals help.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Creativity became currency: lean into weirdness with confidence.`,
        `Social awareness became survival: read the room, work the algorithm.`,
        `Humor became armor: laugh before the internet does.`,
      ],
      paragraphs: [
`They grew into someone who can be publicly embarrassing and privately fine.

They learned to separate their worth from their visibility — and to monetize chaos without becoming cynical.

They didn't plan for fame.
They adapted to it.`,
      ],
      tinyTruths: [
        `Tiny truth: the skill that saved them was remembering it's all absurd — and that's okay.`
      ]
    }
  },

  cult_leader: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `They built a 'movement' around certainty.`,
        `People followed — until the cost became clear.`,
        `It looked like faith from a distance. Up close, it was control.`,
        `The tragedy: empathy never kept up with conviction.`,
      ],
      paragraphs: [
`They started with devotion — real, deep, practiced. But without empathy to temper it, devotion became certainty. And certainty became power.

They built a following: people who needed answers, who craved belonging, who traded questions for scripts. Their charisma made it feel safe. Their conviction made it feel true.

But control dressed as faith is still control.`,
`The warning signs were there: isolation from critics, shaming of doubters, loyalty tests disguised as devotion.

Eventually, people noticed. Some left. Some stayed too long. The "movement" fractured when the cost became too high.

They had the faith. They lacked the empathy to make it safe.`,
      ],
      tinyTruths: [
        `Tiny truth: charisma + low empathy + extreme certainty → harmful control.`,
        `Tiny truth: they believed their own story — and that made it more dangerous.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I know what you've heard.

I know what the documentary said.

I'm not writing to defend myself. I'm writing because I need you to know I'm still trying to understand what happened.

I had conviction. I had community. I had a message people needed — or at least I thought they did.

But somewhere along the way, certainty replaced curiosity. Belonging became obedience. And the people who stayed… stayed because they were afraid to leave.

I was so sure I was right that I stopped asking if I was kind.

I'm working on it now.
Slowly. With accountability. With people who don't worship me.

I'm still your kid.
Just… a cautionary tale version.

— {childName}`,
`{SALUTATION}

I became a leader. Then a problem. Then a lesson.

The part people don't talk about: I started with good intentions. Real devotion. A genuine desire to help people find meaning.

But without empathy, "helping" turned into controlling.
Without self-awareness, conviction turned into cruelty.

I didn't notice until people started leaving.
And then I noticed too late.

I'm rebuilding now — not a movement, just myself.
With therapy. With accountability. With honesty instead of certainty.

If you're willing to talk, I'm ready to listen.
For the first time in a long time.

— {childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `They learned the difference between devotion and domination.`,
        `Consequences arrived. Accountability followed.`,
        `Repair is possible — but it requires humility they didn't have before.`,
      ],
      paragraphs: [
`The "cult" disbanded. Some members found community elsewhere. Some stayed angry. Some forgave — slowly, with boundaries.

Your child didn't end up in prison. They ended up in therapy, in accountability groups, in a life that required more honesty than performance.

The skill remained: they can still inspire, lead, organize.
They're learning to do it without control.`,
      ],
      tinyTruths: [
        `Tiny truth: the hardest thing they learned was "I was wrong."`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Confidence became charisma — and then became manipulation.`,
        `Faith became certainty — and certainty became a weapon.`,
        `They're learning empathy now — the part they skipped before.`,
      ],
      paragraphs: [
`They grew into someone who could command a room — but not care for the people in it.

They had discipline. They had conviction. They had followers.
What they lacked was the pause that asks "am I causing harm?"

Consequences taught them what empathy should have.
They're rebuilding now — with humility they didn't know they needed.`,
      ],
      tinyTruths: [
        `Tiny truth: brilliance without compassion becomes cruelty — and they learned that the hardest way.`
      ]
    }
  },

  dynasty_builder: {
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `Generational wealth unlocked. The receipts are legendary.`,
        `They built businesses, bought property, and stacked assets like Tetris.`,
        `Wealth: very high. Legacy: tangible.`,
      ],
      paragraphs: [
`They didn't just make money. They built systems that make money while they sleep.

Real estate, businesses, investments — all layered carefully, maintained patiently, and passed down intentionally. The dynasty isn't just wealth. It's a story about what consistency can build.`,
      ],
      tinyTruths: [
        `Tiny truth: they still check prices at the grocery store. Wealth didn't erase the habit.`
      ]
    },
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: [],
      paragraphs: [
`{SALUTATION}

I own three businesses, two properties, and a portfolio my accountant calls "spicy but defensible."

I'm writing checks that change lives.
I'm teaching my kids about compound interest at breakfast.

And every time I make a big financial decision, I hear your voice:
"Don't be reckless. Be strategic."

So that's what I'm doing — building something that outlasts me.

The dynasty started with your discipline.
I'm just continuing the build.

Love,
{childName}`,
`{SALUTATION}

WEALTH UPDATE:

Net worth: absurd.
Stress about it: surprisingly low.

Because you taught me money is a tool, not a personality.

I invest carefully.
I give generously.
I sleep well.

And when people ask "how did you build this?"
I tell the truth: one boring, smart decision at a time.

Love,
{childName}`,
      ],
      tinyTruths: []
    },
    epilogue: {
      headline: "Epilogue",
      bullets: [
        `Wealth became legacy — not just money, but values.`,
        `They built businesses that treat people well.`,
        `The dynasty includes bedtime stories and financial literacy.`,
      ],
      paragraphs: [
`The wealth compounds. The reputation holds. The family traditions survive.

They don't just leave money behind — they leave systems, values, and a blueprint for building well.

Their kids grow up with privilege — and with responsibility.
The dynasty holds.`,
      ],
      tinyTruths: [
        `Tiny truth: they still remember what it felt like before money was stable — and they protect others from that fear.`
      ]
    },
    howTheyGrew: {
      headline: "How They Grew",
      bullets: [
        `Discipline became investment: patient, boring, and effective.`,
        `Intelligence became strategy: see opportunities before they're obvious.`,
        `Confidence became execution: make the call, live with it.`,
      ],
      paragraphs: [
`They grew into someone who can build wealth without losing their values.

They learned to think in decades, not paychecks. To invest in people, not just portfolios. To stay grounded even when the numbers get absurd.

They didn't just get rich.
They built something worth keeping.`,
      ],
      tinyTruths: [
        `Tiny truth: their proudest investment isn't financial — it's the family culture they're passing down.`
      ]
    }
  },
};