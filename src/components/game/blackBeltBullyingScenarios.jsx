// BLACK BELT BULLYING SCENARIOS - Conditional events for martial arts black belt holders
// Only eligible when: age >= 6, NOT homeschooling, AND has any martial arts black belt

import { hasAnyBlackBelt } from './martialArtsData';

// Helper: Check if black belt bullying scenarios can trigger
export function canTriggerBlackBeltBullying(state) {
  const age = state.currentYear || 0;
  const homeschool = state.schoolType === "homeschool";
  const hasBlack = hasAnyBlackBelt(state);
  return age >= 6 && !homeschool && hasBlack;
}

// Black belt bullying scenario bank (10 scenarios)
export const BLACK_BELT_BULLYING_SCENARIOS = [
  {
    id: "bb_bully_01_cafeteria",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "At school lunch, a bigger kid shoves in line and tries to grab your child's food. Your child stays upright, steps back, and uses a controlled move from training to break contact and create space. The other kid ends up embarrassed and backing off. Now you're in the principal's office. The principal says: 'Self‑defense or escalation?'\n\nWhat do you do?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🧊",
        text: "Calmly explain: safety first, de‑escalation next. Ask for an anti‑bullying plan.",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 0 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "Your child learns: skill + restraint + advocacy = safety."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🛡️",
        text: "Advocate firmly: consequences + supervision. Praise your child's restraint, not the takedown.",
        deltas: { confidence: 2, discipline: 1, empathy: -1, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Clear boundaries. Your child feels protected."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "🤐",
        text: "Downplay it to avoid drama: 'Let's all move on.' (Your child hears that.)",
        deltas: { discipline: 0, confidence: -2, empathy: 0, intelligence: 0 },
        loveDelta: -1,
        stressDelta: -1,
        consequence: "Your child learns: don't make waves, even when unsafe."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📵",
        text: "Punish your child for 'causing trouble'—remove privileges without discussing context.",
        deltas: { discipline: 1, confidence: -2, empathy: -1, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "Your child learns: self-defense equals punishment."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "Tell your child they should 'finish it faster next time' and treat it like a win.",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. They learn aggression = approval."
      }
    ]
  },

  {
    id: "bb_bully_02_hallway_backpack",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "In the hallway, a kid yanks your child's backpack strap hard and laughs. Your child turns, keeps their hands up, and uses their training to break free without chasing. A teacher sees the whole thing. The strap kid ends up in the principal's office too.\n\nThe principal asks you to explain what you're teaching at home. What do you say?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🗣️",
        text: "'We teach: get safe, get help, and use skills only to escape.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 0 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "Clear values. Your child feels understood and protected."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "📋",
        text: "Request a safety plan: 'My child shouldn't need self‑defense at school.'",
        deltas: { confidence: 1, discipline: 1, empathy: 0, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm advocacy. Your child sees you standing up."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😬",
        text: "Joke it off: 'Kids will be kids.' (Your child looks smaller.)",
        deltas: { empathy: -1, discipline: 0, confidence: -1, intelligence: 0 },
        loveDelta: -1,
        stressDelta: -1,
        consequence: "Your child learns: dismissal instead of protection."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "🚪",
        text: "Tell your child: 'Never respond—ever.' Even if grabbed again.",
        deltas: { discipline: 1, confidence: -2, empathy: 0, intelligence: 0 },
        loveDelta: -1,
        stressDelta: 0,
        consequence: "Your child learns: freeze, even when unsafe."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🏆",
        text: "Brag about it: 'Good. Bullies need to learn.' (Harmful pattern.)",
        deltas: { empathy: -4, discipline: -3, confidence: -1, intelligence: 0 },
        loveDelta: -3,
        stressDelta: 0,
        consequence: "Harmful pattern. Aggression becomes identity."
      }
    ]
  },

  {
    id: "bb_bully_03_playground_ball",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "At recess, a kid snatches the ball your child is using and shoves them when they protest. Your child doesn't swing wildly—they use a controlled technique from class to stop the shove and the other kid ends up sitting on the ground, shocked. A staff member blows the whistle.\n\nNow you're in the principal's office with your child. What's your response?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🧠",
        text: "Coach accountability + empathy: 'You defended yourself; now we repair and prevent.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "They learn: skill + responsibility + repair."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🛡️",
        text: "Make it about safety: 'We'll cooperate, but we need protection from bullying.'",
        deltas: { discipline: 1, confidence: 2, empathy: -1, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm advocacy. Clear expectations."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😶",
        text: "Tell your child to apologize first to 'keep peace' (even if targeted).",
        deltas: { empathy: 1, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -1,
        stressDelta: 0,
        consequence: "Your child learns: appeasement over truth."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📏",
        text: "Go strict: 'No more martial arts.' (They lose their identity anchor.)",
        deltas: { discipline: 0, confidence: -3, empathy: 0, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "Your child loses their coping anchor. Trust breaks."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "Encourage retaliation: 'Next time, make sure they don't get up.' (Damaging.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Violence becomes acceptable."
      }
    ]
  },

  {
    id: "bb_bully_04_bus_seat",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "On the bus, a kid tries to shove your child out of a seat and calls them names. Your child stays controlled, creates space, and the shove kid ends up losing balance and stopping. The driver pulls over.\n\nThe school says there will be a meeting. How do you guide your child?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🧭",
        text: "Teach a script: 'I'm not fighting. I'm getting safe.' Ask the school for a plan.",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "They learn: clear language + advocacy = safety."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🧱",
        text: "Teach firm boundaries: 'Loud voice, clear stop, then get an adult.'",
        deltas: { confidence: 2, discipline: 1, empathy: 0, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Clear boundaries. They learn assertiveness."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "🫥",
        text: "Tell them to 'ignore it' and not mention it again.",
        deltas: { empathy: 0, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -1,
        stressDelta: -1,
        consequence: "They learn: silence instead of safety."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📵",
        text: "Remove privileges because 'you embarrassed the family.'",
        deltas: { discipline: 1, confidence: -2, empathy: -1, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "They learn: image matters more than safety."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🥊",
        text: "Tell them it's 'good training' and they should look for chances to prove it.",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Seeking violence becomes a goal."
      }
    ]
  },

  {
    id: "bb_bully_05_bathroom_crowd",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "A couple kids corner your child near the bathroom and try to intimidate them. Your child takes a stable stance, uses a strong voice, and makes enough space to leave. One kid tries to grab their arm—your child breaks free cleanly. Staff arrives quickly.\n\nIn the principal's office, your child looks shaken but proud. What do you emphasize?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🫶",
        text: "'You did the right goal: escape. Feelings are allowed—let's decompress.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 0 },
        loveDelta: 2,
        stressDelta: -1,
        consequence: "They learn: safety + feelings both matter."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🧾",
        text: "'You stayed controlled. Now we document and push the school to act.'",
        deltas: { confidence: 2, discipline: 1, empathy: -1, intelligence: 1 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm advocacy. They see you taking action."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😓",
        text: "'Don't make it a big deal.' (They learn silence.)",
        deltas: { empathy: -1, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -1,
        stressDelta: -1,
        consequence: "They learn: minimize trauma to keep peace."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "🧊",
        text: "'You shouldn't have gone near them.' (Blame lands hard.)",
        deltas: { discipline: 0, confidence: -3, empathy: -1, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "They learn: victim-blaming instead of support."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "'Good. Fear is how you win.' (Abusive framing—never rewarded.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Intimidation becomes a value."
      }
    ]
  },

  {
    id: "bb_bully_06_gym_class",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "In gym class, a kid keeps 'testing' your child—little shoves, little trips—waiting for a reaction. Eventually your child uses their training to stop the contact quickly and step away. The bully ends up stunned that it didn't work.\n\nThe teacher says your child 'went too far.' What do you do?",
    choices: [
      {
        role: "boundary",
        letter: "A",
        emoji: "⚖️",
        text: "Ask for the full context and advocate: 'Stopping harm isn't too far.'",
        deltas: { confidence: 2, discipline: 1, empathy: 0, intelligence: 1 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm advocacy. Your child sees you defending truth."
      },
      {
        role: "connect",
        letter: "B",
        emoji: "🧠",
        text: "Teach nuance: praise restraint, then plan safer exits + adult help next time.",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "They learn: complexity, accountability, and support."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😬",
        text: "Apologize to the teacher to keep peace—your child feels blamed.",
        deltas: { empathy: 0, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -1,
        stressDelta: 0,
        consequence: "Your child learns: appease authority, abandon truth."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📏",
        text: "Ban martial arts: 'No more training.' (They lose a coping anchor.)",
        deltas: { discipline: 0, confidence: -3, empathy: 0, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "Their identity anchor is removed. Trust breaks."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "Tell the teacher they're weak and your child should 'teach them all.'",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Dominance becomes a goal."
      }
    ]
  },

  {
    id: "bb_bully_07_after_school",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "After school, a kid throws a nasty comment and steps into your child's space, expecting fear. Your child stays calm, uses their training to keep distance, and the kid backs up—suddenly not so brave. A staff member sees it.\n\nIn the principal's office, your child says: 'I didn't want to hurt them. I just wanted it to stop.' How do you respond?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🌿",
        text: "Validate + teach: 'That's the point of skill—stop harm, then choose peace.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 0 },
        loveDelta: 2,
        stressDelta: -1,
        consequence: "They learn: skill with values intact."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🛡️",
        text: "Praise strength: 'Good. Never be scared.' (Can pressure them.)",
        deltas: { confidence: 2, discipline: 1, empathy: -1, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "They learn: never show vulnerability."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "🤐",
        text: "Tell them to never mention it again—'We don't make waves.'",
        deltas: { discipline: 0, confidence: -2, empathy: -1, intelligence: 0 },
        loveDelta: -1,
        stressDelta: -1,
        consequence: "They learn: silence keeps peace, truth breaks it."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📵",
        text: "Punish them for 'embarrassing you' in front of staff.",
        deltas: { discipline: 1, confidence: -2, empathy: -1, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "They learn: reputation matters more than safety."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "Reward aggression: 'Next time, make sure everyone sees who's boss.'",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Dominance becomes validation."
      }
    ]
  },

  {
    id: "bb_bully_08_locker_room",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "In the locker room, a kid tries to slap your child's things to the floor. Your child uses controlled movement to stop the contact and immediately steps away. The bully ends up flustered and the coach intervenes.\n\nThe coach says: 'Your kid is skilled. But school rules are strict.' What do you do?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "📚",
        text: "'Skill includes restraint.' Ask the school to address bullying, not just outcomes.",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "They learn: skill + wisdom + advocacy."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🧱",
        text: "Push for discipline on the bully and a written safety agreement.",
        deltas: { confidence: 2, discipline: 1, empathy: 0, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm boundaries. Clear consequences."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😶",
        text: "'Let's forget it.' (Your child learns silence is safety.)",
        deltas: { empathy: -1, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -1,
        stressDelta: -1,
        consequence: "They learn: avoidance instead of resolution."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "🧊",
        text: "Scold your child: 'You made me get a call.' (Love dips.)",
        deltas: { discipline: 1, confidence: -2, empathy: -1, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "They learn: your inconvenience matters more than their safety."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "'Rules don't matter. Win matters.' (Harmful.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Rules become optional when angry."
      }
    ]
  },

  {
    id: "bb_bully_09_teacher_witness",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "A teacher witnesses the whole incident: the other kid starts it, your child uses a controlled self‑defense response, and then backs off immediately. The bully is furious… but also clearly lost.\n\nThe principal asks: 'What lesson do you want your child to take from this?'",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🫶",
        text: "'Safety matters. People matter. Skills are for escape, not dominance.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 2,
        stressDelta: -1,
        consequence: "They learn: skill with humanity intact."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🧾",
        text: "'Stand up for yourself.' (Good… but add de‑escalation later.)",
        deltas: { confidence: 2, discipline: 1, empathy: 0, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "They learn: strength. Missing: nuance."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "🫥",
        text: "'Never react. Ever.' (Teaches helplessness.)",
        deltas: { discipline: 1, confidence: -3, empathy: 0, intelligence: 0 },
        loveDelta: -1,
        stressDelta: 0,
        consequence: "They learn: freeze, even when capable."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📵",
        text: "'You embarrassed us.' (Focuses on image, not growth.)",
        deltas: { discipline: 1, confidence: -2, empathy: -1, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "They learn: appearance matters more than truth."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "'Make bullies afraid.' (Abusive framing.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Fear becomes the goal."
      }
    ]
  },

  {
    id: "bb_bully_10_repeat_offender",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "It turns out the bully has targeted your child before. This time, your child used their training to stop the contact fast and walk away. The bully 'lost,' and the adults finally noticed.\n\nThe principal asks what you want to happen next. What do you choose?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🧩",
        text: "Push for a real plan: supervision, check‑ins, and support for both kids.",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "They learn: systemic change + empathy for all."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🛑",
        text: "Demand consequences for the bully and a written safety guarantee.",
        deltas: { confidence: 2, discipline: 1, empathy: -1, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Clear boundaries. Your child sees you protecting them."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😶",
        text: "Say nothing and leave—your child thinks you won't protect them.",
        deltas: { empathy: 0, discipline: 0, confidence: -3, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 0,
        consequence: "They learn: you won't fight for them."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📏",
        text: "Blame your child for 'making enemies' and threaten to pull them from activities.",
        deltas: { discipline: 0, confidence: -3, empathy: -1, intelligence: 0 },
        loveDelta: -3,
        stressDelta: 1,
        consequence: "They learn: their skills are a liability, not an asset."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "Encourage dominance: 'Next time, make a point.' (Never rewarded.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Escalation becomes expected."
      }
    ]
  },

  {
    id: "bb_bully_11_water_fountain",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "At the water fountain, a kid tries to push your child's head down while they're drinking. Your child uses a defensive move to create space and the kid stumbles backward, surprised. A hall monitor intervenes immediately.\n\nIn the principal's office, the principal says: 'We don't allow martial arts at school.' What do you say?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🗣️",
        text: "'We teach safety skills, not fighting. My child defended themselves from assault.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "They learn: clear language + advocacy = power."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "🛡️",
        text: "'My child has a right to safety. Address the bullying, not the victim.'",
        deltas: { confidence: 2, discipline: 1, empathy: 0, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm stance. Your child sees strength."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😐",
        text: "'We'll make sure it doesn't happen again.' (Vague promise, no protection.)",
        deltas: { empathy: -1, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -1,
        stressDelta: -1,
        consequence: "They learn: compliance over safety."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📵",
        text: "'You should have just walked away.' (Blame the victim.)",
        deltas: { discipline: 1, confidence: -2, empathy: -1, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "They learn: you side with authority over them."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "'Good. They needed to learn respect.' (Harmful validation.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Violence equals respect."
      }
    ]
  },

  {
    id: "bb_bully_12_parking_lot",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "In the parking lot after school, a group of kids surround your child and start taunting. Your child uses controlled movements to create an exit path without engaging. One kid tries to grab them—your child breaks free and walks to a staff member. The parents are called.\n\nIn the meeting, another parent says: 'Your kid is dangerous.' What do you do?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🧘",
        text: "Stay calm, state facts: 'My child used minimal force to escape assault. That's safety.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "They learn: facts + calm = credibility."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "⚖️",
        text: "Demand accountability: 'Address the mob behavior. My child defended themselves.'",
        deltas: { confidence: 2, discipline: 1, empathy: -1, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm advocacy. Your child sees you won't back down."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😰",
        text: "Apologize to keep peace: 'We'll make sure it never happens again.'",
        deltas: { empathy: 0, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -1,
        stressDelta: 0,
        consequence: "They learn: appease bullies and their parents."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📏",
        text: "'You should have called me first.' (Blame them for handling it.)",
        deltas: { discipline: 0, confidence: -3, empathy: -1, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "They learn: don't solve problems, wait for rescue."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "Escalate: 'My kid can handle yours any day.' (Harmful posturing.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Aggression becomes identity."
      }
    ]
  },

  {
    id: "bb_bully_13_substitute_teacher",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "A substitute teacher doesn't know the context. A kid starts bullying your child during class. Your child uses minimal force to create space and the substitute only sees the outcome—the bully on the floor, crying.\n\nYou're called to school. The substitute insists: 'Zero tolerance means zero tolerance.' What do you do?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "📖",
        text: "Educate calmly: 'Context matters. My child was defending themselves from assault.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 1,
        stressDelta: -1,
        consequence: "They learn: truth + patience = resolution."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "⚖️",
        text: "Demand review of all evidence: 'Zero tolerance should protect victims, not punish them.'",
        deltas: { confidence: 2, discipline: 1, empathy: 0, intelligence: 1 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm advocacy. Your child sees justice pursued."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😔",
        text: "Accept the punishment to avoid conflict. (Your child feels abandoned.)",
        deltas: { empathy: -1, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -2,
        stressDelta: -1,
        consequence: "They learn: you won't fight for them."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "📵",
        text: "'You should never have used those skills.' (Ban all martial arts.)",
        deltas: { discipline: 0, confidence: -3, empathy: 0, intelligence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        consequence: "They lose their anchor. Trust breaks."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "Threaten the substitute: 'Touch my kid again and you'll regret it.' (Harmful.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 2,
        consequence: "Harmful pattern. Threats become your tool."
      }
    ]
  },

  {
    id: "bb_bully_14_field_trip",
    minAge: 6,
    maxAge: 17,
    requiresBlackBelt: true,
    scenarioText: "On a field trip, a kid from another school starts targeting your child—pushing, taunting, trying to provoke a fight in front of everyone. Your child stays controlled, uses defensive positioning, and the kid eventually gives up. A chaperone saw everything.\n\nBack at school, the principal asks: 'How do we handle this?' What's your input?",
    choices: [
      {
        role: "connect",
        letter: "A",
        emoji: "🌐",
        text: "'My child handled it perfectly: no escalation, just safety. Praise that.'",
        deltas: { empathy: 2, discipline: 1, confidence: 1, intelligence: 1 },
        loveDelta: 2,
        stressDelta: -1,
        consequence: "They learn: restraint deserves recognition."
      },
      {
        role: "boundary",
        letter: "B",
        emoji: "📋",
        text: "'Document it. Report it to the other school. Protect my child.'",
        deltas: { confidence: 2, discipline: 1, empathy: 0, intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        consequence: "Firm boundaries. Clear follow-through."
      },
      {
        role: "avoid",
        letter: "C",
        emoji: "😅",
        text: "'Kids will be kids. No big deal.' (Dismiss their experience.)",
        deltas: { empathy: -1, discipline: 0, confidence: -2, intelligence: 0 },
        loveDelta: -1,
        stressDelta: -1,
        consequence: "They learn: their feelings don't matter."
      },
      {
        role: "teach",
        letter: "D",
        emoji: "🚫",
        text: "'You should have found an adult immediately.' (Blame their judgment.)",
        deltas: { discipline: 1, confidence: -2, empathy: -1, intelligence: 0 },
        loveDelta: -1,
        stressDelta: 1,
        consequence: "They learn: second-guess yourself in danger."
      },
      {
        role: "harm",
        letter: "E",
        emoji: "🔥",
        text: "'Next time, make it memorable.' (Encourage violence.)",
        deltas: { empathy: -4, discipline: -3, confidence: -2, intelligence: 0 },
        loveDelta: -4,
        stressDelta: 0,
        consequence: "Harmful pattern. Retaliation becomes virtue."
      }
    ]
  }
];