/**
 * Kid Logic Popups
 * - Parsed from a raw text list (easy to extend without reformatting 100 objects).
 * - Each entry becomes: { id, minAge, maxAge, kid, options: { empathize, ignore, boundary } }
 */

const KID_LOGIC_RAW = `
Kid: "I won't drink this water. You already drank water before, so it's basically your water."

Empathize: "You want water that feels 'yours.' This water is safe—do you want it in your special cup or with a straw?"

Ignore: "Okay." (Set it down. Move on.)

Fix/Boundary: "This is the water available right now. You can drink it if you're thirsty, or wait until later—no crying for a new cup."

Kid: "My fork touched your food, so the fork is ruined forever."

Empathize: "That felt yucky to you. Want to wipe it off together or switch to a clean fork?"

Ignore: "Alright." (Continue eating.)

Fix/Boundary: "Forks can be washed. This fork is fine—if you choose not to use it, dinner still continues."

Kid: "I can't put on socks because my toes are asleep and they're scared."

Empathize: "Your toes feel weird! Let's wiggle them and tell them they're safe."

Ignore: "Okay." (Start packing your own stuff calmly.)

Fix/Boundary: "We're leaving in two minutes. Socks on or shoes in hand—your choice."

Kid: "I want the blue cup. Not THAT blue. The other blue."

Empathize: "You have a very specific blue in mind. Show me with your finger—lighter or darker?"

Ignore: "This is the cup." (Place it, walk away.)

Fix/Boundary: "You can pick from these two cups. If you don't choose, I'll choose."

Kid: "Don't look at me. Your eyes are being too loud."

Empathize: "You want space. I can look away and use a quiet voice."

Ignore: "Okay." (Gently focus on something else.)

Fix/Boundary: "I'll give you space, but I still need you to use kind words. Try: 'I need a break.'"

Kid: "That banana is broken because it has a line on it."

Empathize: "You wanted a 'perfect' banana. Do you want me to peel it so it looks different?"

Ignore: "Okay." (Let it be.)

Fix/Boundary: "This is the banana we have. You can eat it, or be done with snack."

Kid: "My sandwich tastes like the crust is judging me."

Empathize: "You don't like the crust vibe today. Want it cut off, or do you want a different safe food?"

Ignore: "Okay." (No debate.)

Fix/Boundary: "Crust is part of the sandwich. You can eat what you want from it, but I'm not making a new meal."

Kid: "I can't walk to the car. My legs are in 'battery saving mode.'"

Empathize: "Your body feels tired. Want to stomp like a robot or hop like a bunny to the car?"

Ignore: "We're going." (Start walking.)

Fix/Boundary: "You can walk or I can carry you to the car—but if I carry you, you'll be buckled calmly."

Kid: "If I brush my teeth, my mouth will forget my snacks."

Empathize: "You want to remember the taste. We can say bye to the snack, then brush."

Ignore: "Teeth time." (Hand toothbrush, no lecture.)

Fix/Boundary: "Teeth get brushed every night. If you don't brush, I will help your hands brush."

Kid: "I'm not sleeping because my blanket keeps thinking."

Empathize: "That sounds spooky. Let's 'turn off' the blanket—shake it out and tuck it in."

Ignore: "Goodnight." (Lights low, leave.)

Fix/Boundary: "It's sleep time. You can cuddle the blanket or set it aside, but your body stays in bed."

Kid: "I only want the exact same cereal piece I ate yesterday."

Empathize: "You liked that one a lot. Today's cereal can still be crunchy—want to pick the biggest piece?"

Ignore: "Cereal's here." (End of conversation.)

Fix/Boundary: "We can't get yesterday's cereal back. Eat what's here, or choose a different breakfast option."

Kid: "My shirt tag touched me and now my whole day is ruined."

Empathize: "That was really uncomfortable. Let's fix the tag together or pick another shirt."

Ignore: "Mhm." (Keep moving.)

Fix/Boundary: "We can solve it quickly: tag tucked or different shirt. Yelling won't change the choices."

Kid: "If you cut my toast into triangles, the crumbs will escape."

Empathize: "You want your toast to stay 'together.' Do you want squares or whole?"

Ignore: "Here's toast." (No commentary.)

Fix/Boundary: "This is how toast is served today. If it's not okay, you can be done with toast."

Kid: "Don't sing. Your song is making my ears itch."

Empathize: "You want quiet. I can stop singing—thanks for telling me."

Ignore: "Okay." (Stop, continue task.)

Fix/Boundary: "I'll stop singing, and you'll speak politely. Try: 'Please stop singing.'"

Kid: "I can't wear pants. Pants are too… pants."

Empathize: "Pants feel annoying today. Do you want the soft pants or the stretchy pants?"

Ignore: "Pants go on." (Neutral tone.)

Fix/Boundary: "We're getting dressed. Choose pants or shorts. If you don't choose, I'll choose."

Kid: "My spoon is too shiny. I need a less shiny spoon."

Empathize: "That shine is bothering you. Want the matte spoon or a fork instead?"

Ignore: "This is the spoon." (Continue meal.)

Fix/Boundary: "One utensil choice, then we eat. If you keep switching, I'll pick and we're done."

Kid: "I'm not going outside. The air is too pointy."

Empathize: "It feels sharp and weird. Let's take three slow breaths and try again."

Ignore: "We're going." (Open door, proceed.)

Fix/Boundary: "Outside time is happening. You can hold my hand or hold your jacket—your choice."

Kid: "I can't eat that. It's touching the other food and they're arguing."

Empathize: "You want foods separate. Let's use the divider plate."

Ignore: "Okay." (No big response.)

Fix/Boundary: "Food can touch. You can eat what you want, but I'm not rebuilding the plate."

Kid: "You said 'later' but I need 'now-ter.'"

Empathize: "Waiting is hard. Let's set a timer so you can see when 'later' is."

Ignore: "Later." (Continue.)

Fix/Boundary: "I won't argue about the answer. Ask once politely or you lose the privilege for today."

Kid: "I don't want you to talk. Your words are too wordy."

Empathize: "You need quiet. I can use fewer words."

Ignore: "Okay." (Stop talking.)

Fix/Boundary: "I'll be quiet, and you'll speak respectfully. If you're rude, you take a break from conversation."

Kid: "That's not the same hug as yesterday."

Empathize: "You want a 'favorite' hug. Show me: squeeze hug or gentle hug?"

Ignore: "Love you." (Move on.)

Fix/Boundary: "I can hug again if you ask kindly. If you demand, I'm done hugging right now."

Kid: "My bed is too bed."

Empathize: "You need a reset. Want your stuffed animal, nightlight, or a quick story?"

Ignore: "Goodnight." (Leave.)

Fix/Boundary: "Bedtime is bedtime. You can settle yourself, or I will tuck you in and the room stays quiet."

Kid: "I can't wear that shirt. It smells like Tuesday."

Empathize: "That smell bugs you. Want a different shirt or we can wash this one."

Ignore: "Okay." (Switch if easy.)

Fix/Boundary: "You have two shirt choices. After that, I choose and we go."

Kid: "I want a snack, but I don't want a snack. I want the IDEA of a snack."

Empathize: "You want comfort, not food. Want a cuddle or water?"

Ignore: "Okay." (No drama.)

Fix/Boundary: "Kitchen is closed. You can have water. If you're hungry, eat at meal time."

Kid: "My cup has too many bubbles. The bubbles are staring."

Empathize: "Bubbles feel weird. Want me to tap them out or use a different drink?"

Ignore: "Here it is." (No big talk.)

Fix/Boundary: "Drink it or don't. We're not remaking drinks over bubbles."

Kid: "If I put on pajamas, then it's officially tomorrow."

Empathize: "It feels like pajamas mean the day is over. Pajamas are just cozy clothes."

Ignore: "PJ time." (Routine.)

Fix/Boundary: "Pajamas go on. You can choose which pair, but we're doing it now."

Kid: "My tooth feels wiggly and I think it's trying to leave the family."

Empathize: "That's a weird feeling. Let's check gently and you can tell it you're ready when you're ready."

Ignore: "Okay." (Continue.)

Fix/Boundary: "No poking it constantly. If you keep wiggling it with dirty hands, you'll wash hands or stop."

Kid: "I don't want a nap. Naps are for people who are tired, and I'm only exhausted."

Empathize: "Exhausted is very tired. Let's do a 'rest'—you don't have to sleep."

Ignore: "Rest time." (Settle them.)

Fix/Boundary: "Quiet rest happens daily. If you shout, you lose the after-nap activity."

Kid: "Don't cut my nails—my fingers will feel naked."

Empathize: "That's an odd feeling. We can clip one nail today and stop, then more later."

Ignore: "Okay." (Delay.)

Fix/Boundary: "We clip nails for health. We'll do it gently—if you fight, you'll sit with me and we'll finish faster."

Kid: "I'm not sharing. Sharing is when people steal politely."

Empathize: "You're worried you won't get it back. We can take turns with a timer."

Ignore: "Okay." (Observe if it's not required.)

Fix/Boundary: "In this house we take turns. If you can't take turns, the toy takes a break."

Kid: "You cut my grapes. I needed them whole so they can be brave."

Empathize: "Whole grapes feel better to you. Want berries instead, or bigger fruit pieces?"

Ignore: "Okay." (Move on.)

Fix/Boundary: "Grapes get cut for safety. If you don't want them, you can choose a different snack."

Kid: "I can't put my shoes on because my feet are busy thinking."

Empathize: "Your feet are having a moment. Want to race the timer or do 'shoe robot'?"

Ignore: "Shoes." (Proceed.)

Fix/Boundary: "We leave on time. Shoes on now, or I help."

Kid: "That's not my favorite chair today. My favorite chair is in my imagination."

Empathize: "You wish the perfect chair existed. Do you want a cushion or to sit on my lap?"

Ignore: "Okay." (Sit yourself.)

Fix/Boundary: "Pick a real chair. If you don't, I will choose and dinner starts."

Kid: "I can't eat that. It's too crunchy and my teeth are tired."

Empathize: "Crunchy is a lot. Want it softer—like sliced thinner—or a softer food?"

Ignore: "Okay." (No fight.)

Fix/Boundary: "This is the snack. If you don't want it, you can be done until the next meal."

Kid: "I don't want to wash my hair. My hair is keeping secrets."

Empathize: "You want control of your hair. Want to wash it yourself while I help?"

Ignore: "Okay." (Try later.)

Fix/Boundary: "Hair gets washed. You can choose quick wash or longer wash, but it's happening."

Kid: "I can't wear that. It's too… shirt."

Empathize: "Clothes are annoying sometimes. Want the soft shirt or the loose shirt?"

Ignore: "Mhm." (Continue.)

Fix/Boundary: "Two choices. If you refuse both, I pick and we move on."

Kid: "I only want the corner piece of pizza, but not the corner that touched the other corner."

Empathize: "You want the 'clean' piece. Let's pick your piece first next time."

Ignore: "Okay." (No extra.)

Fix/Boundary: "This is pizza. You can eat it or not—no dismantling the whole meal."

Kid: "Don't clap. The sound hurts my feelings."

Empathize: "That sound bothers you. I can stop clapping and use a quiet cheer."

Ignore: "Okay." (Stop.)

Fix/Boundary: "You can ask politely. If you yell at people for making normal sounds, you take a calm break."

Kid: "I'm not mad. I'm just… angrily peaceful."

Empathize: "That sounds like mad. It's okay to be mad—what do you need?"

Ignore: "Okay." (Let the emotion pass.)

Fix/Boundary: "You can be mad, and you cannot hit/yell. If you do, you go to the calm spot."

Kid: "My marker is broken because it ran out of purple feelings."

Empathize: "It's frustrating when it doesn't work. Let's find a working marker or a different color."

Ignore: "Okay." (Keep going.)

Fix/Boundary: "We treat supplies gently. If you throw markers, markers are done for today."

Kid: "I can't eat broccoli. It looks like tiny trees and I don't want to eat a forest."

Empathize: "It does look like trees! Want to pretend you're a giant dinosaur taking one tree bite?"

Ignore: "Okay." (No push.)

Fix/Boundary: "No food insults at the table. You can leave it, but you don't make comments."

Kid: "Stop breathing near me. Your breathing is touching my thoughts."

Empathize: "You need space. I'll step back and give you quiet."

Ignore: (Stay calm, say nothing.)

Fix/Boundary: "You can ask for space kindly. If you talk rudely, you take a break from the room."

Kid: "I only want the exact same bedtime story voice from last night."

Empathize: "You love the cozy routine. I'll try—tell me: silly voice or calm voice?"

Ignore: "Story time." (Read normally.)

Fix/Boundary: "I'll read once. If you keep correcting, story time ends early tonight."

Kid: "My stuffed animal looked at me funny. I don't trust him anymore."

Empathize: "That felt weird. Want to 'reset' him with a hug and a pat?"

Ignore: "Okay." (Move on.)

Fix/Boundary: "We can switch stuffies, but we're not spiraling. Bedtime continues."

Kid: "I can't eat the last bite. The last bite is too final."

Empathize: "Last bites feel big. You can save it, or we can name it and cheer it on."

Ignore: "Okay." (No pushing.)

Fix/Boundary: "All done is okay. But you won't get a different snack right after—this is the food."

Kid: "That's not the right car seat buckle sound. It sounded mean."

Empathize: "The click startled you. It's just the safety sound—want to do a practice click?"

Ignore: "Click." (Move on.)

Fix/Boundary: "We buckle every time. If you fight buckling, we don't drive until you're buckled safely."

Kid: "I don't want to hold the cup. My hand is on vacation."

Empathize: "Your hand is 'tired.' Want a straw cup or do you want me to hold it for the first sip?"

Ignore: "Okay." (Set it down.)

Fix/Boundary: "I'm not holding it the whole time. You can drink when you're ready."

Kid: "If I clean up, the mess will think I don't love it."

Empathize: "You're sweet. Cleaning up is taking care of our space."

Ignore: "Cleanup." (Begin silently.)

Fix/Boundary: "We clean up before the next activity. If you refuse, you lose the next activity until it's done."

Kid: "I can't use that bathroom. It smells like someone had a thought in there."

Empathize: "Smells are strong. Want the fan on, or we can try a different bathroom?"

Ignore: "Okay." (No fuss.)

Fix/Boundary: "Bathroom is necessary. We can turn on the fan, but we're going now."

Kid: "My cup is too full. I need it more empty so it feels safe."

Empathize: "Big amounts feel overwhelming. I can pour a little out—tell me what looks right."

Ignore: "Okay." (Set it down.)

Fix/Boundary: "You can drink it as is or leave it. I'm not repeatedly pouring back and forth."

Kid: "I can't go potty. My pee is shy."

Empathize: "That happens. Let's do quiet time and run the water to help."

Ignore: "Okay." (Wait briefly.)

Fix/Boundary: "We'll sit for two minutes, then we're done. No endless bathroom stalling."

Kid: "Don't put my food on that plate. That plate remembers last time."

Empathize: "You don't like that plate today. Want plate A or plate B?"

Ignore: "Okay." (Swap if easy.)

Fix/Boundary: "One plate choice. If you keep switching, you get the plate I choose."

Kid: "My hair tie is too tight, but also too loose. Fix it."

Empathize: "That's frustrating. We can try two more times, then pick hair down or ponytail."

Ignore: "Okay." (Step back.)

Fix/Boundary: "Two tries. After that, you choose hair down or I choose—and we move on."

Kid: "I don't want to leave the park. My fun isn't finished."

Empathize: "Leaving is hard. Want one last slide or one last swing?"

Ignore: "Time to go." (Start walking.)

Fix/Boundary: "We leave when I say. If you leave calmly, we come back sooner. If you fight, we take a park break next time."

Kid: "I can't eat that yogurt. It's too… smooth. It feels sneaky."

Empathize: "Textures are weird sometimes. Want granola in it or a different snack?"

Ignore: "Okay." (No drama.)

Fix/Boundary: "You can choose from the snack options. If you reject them all, you're done."

Kid: "My sleeves touched my elbows and it startled me."

Empathize: "That sensation surprised you. Want sleeves rolled up or a short-sleeve shirt?"

Ignore: "Mhm." (Keep going.)

Fix/Boundary: "Pick option A or B. We're leaving on time."

Kid: "I can't drink from that straw. The straw is too confident."

Empathize: "You want a different straw vibe. Want no straw or a different cup?"

Ignore: "Okay." (Move on.)

Fix/Boundary: "Drink it or don't. We're not collecting straws and cups all day."

Kid: "My shoes are too loud. They're clomping my feelings."

Empathize: "The sound bugs you. Want your quiet shoes or softer socks?"

Ignore: "Okay." (Proceed.)

Fix/Boundary: "You can choose quiet shoes or wear these. We're going either way."

Kid: "I can't eat the red one because the red one is spicy in its heart."

Empathize: "Colors feel powerful. Want to try a tiny bite, or choose a different color?"

Ignore: "Okay." (No debate.)

Fix/Boundary: "No new snack because of color rules. Eat what you choose from what's offered."

Kid: "Don't touch my blanket. Your hands have 'outside' on them."

Empathize: "You want it clean. I can wash my hands first or you can move it yourself."

Ignore: "Okay." (Back off.)

Fix/Boundary: "It's okay to want clean, but you still speak kindly. If you yell, you take a break."

Kid: "I can't wear that hat. It makes my head look like a mystery."

Empathize: "You feel weird about how it looks. Want hood up instead or a different hat?"

Ignore: "Okay." (Move on.)

Fix/Boundary: "It's cold outside. Hat or hood—choose one."

Kid: "I'm not going to bed because my dreams might use my stuff without asking."

Empathize: "Dreams can feel strange. We can do a 'dream lock'—tell your dreams to be kind."

Ignore: "Goodnight." (Routine continues.)

Fix/Boundary: "It's bedtime. You don't have to control dreams; you do have to stay in bed and rest."
`;

const takeAfterColon = (line) => {
  const idx = line.indexOf(":");
  return idx === -1 ? line.trim() : line.slice(idx + 1).trim();
};

const inferAgeRange = (kidLine) => {
  const t = (kidLine || "").toLowerCase();
  let minAge = 2;
  let maxAge = 10;

  // Gentle heuristics (still age-appropriate across the board)
  if (t.includes("school") || t.includes("backpack")) minAge = Math.max(minAge, 4);
  if (t.includes("tooth") || t.includes("teeth") || t.includes("toothbrush")) minAge = Math.max(minAge, 4);

  return { minAge, maxAge };
};

export const KID_LOGIC_POPUPS = (() => {
  const lines = KID_LOGIC_RAW.split("\n").map((l) => l.trim()).filter(Boolean);

  const entries = [];
  let cur = null;

  const pushCur = () => {
    if (!cur) return;
    if (!cur.kid || !cur.empathize || !cur.ignore || !cur.boundary) return;

    const idx = entries.length + 1;
    const { minAge, maxAge } = inferAgeRange(cur.kid);

    entries.push({
      id: `kidLogic_${String(idx).padStart(3, "0")}`,
      minAge,
      maxAge,
      kid: cur.kid,
      options: {
        empathize: cur.empathize,
        ignore: cur.ignore,
        boundary: cur.boundary,
      },
    });
  };

  for (const line of lines) {
    if (line.startsWith("Kid:")) {
      pushCur();
      cur = { kid: takeAfterColon(line), empathize: "", ignore: "", boundary: "" };
      continue;
    }
    if (!cur) continue;

    if (line.startsWith("Empathize:")) cur.empathize = takeAfterColon(line);
    else if (line.startsWith("Ignore:")) cur.ignore = takeAfterColon(line);
    else if (line.startsWith("Fix/Boundary:")) cur.boundary = takeAfterColon(line);
  }

  pushCur();
  return entries;
})();