export const HOMEWORK_POPUPS = [
  {
    "id": "hw_06_001",
    "triggerAge": 6,
    "title": "The Name-Wallpaper Worksheet",
    "body": "Your child completes the worksheet… and proudly writes their name in every single blank, including the math answers. It’s less “homework” and more “branding campaign.”",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Move the name to the top (like a regular human).",
        "consequence": "You point to the top of the page and say, “This is the VIP section for names.” They redo a few lines and learn the format for real. It takes time, but it clicks.",
        "role": "teach",
        "deltas": {
          "intelligence": 1.0,
          "empathy": 0.4,
          "discipline": 0.8,
          "confidence": 0.8
        },
        "loveDelta": 3,
        "stressDelta": 1,
        "moneyDelta": 0
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Quietly rewrite it in neat adult handwriting.",
        "consequence": "You rewrite it in two minutes. Your child watches like you’re a magic printer and asks if you come with an “auto-finish” button. The page is perfect, but the lesson is… less so.",
        "role": "avoid",
        "deltas": {
          "intelligence": 0.2,
          "empathy": 0.1,
          "discipline": -0.8,
          "confidence": -0.4
        },
        "loveDelta": -1,
        "stressDelta": 2,
        "moneyDelta": 0
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Submit it as “brand consistency.”",
        "consequence": "You let the name-filled masterpiece ride. Your child feels proud and oddly professional. Tomorrow might include a teacher note: “Love the enthusiasm!”",
        "role": "connect",
        "deltas": {
          "intelligence": 0.5,
          "empathy": 0.4,
          "discipline": -0.2,
          "confidence": 1.2
        },
        "loveDelta": 2,
        "stressDelta": 0.5,
        "moneyDelta": 0
      }
    ]
  },
  {
    "id": "hw_06_002",
    "triggerAge": 6,
    "title": "Gummy Bear Math Lab",
    "body": "The assignment is simple counting. Your child uses gummy bears as “math tools,” then eats the tools mid-problem and insists the numbers “ran away.”",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Switch to something countable *and* non-edible.",
        "consequence": "You swap gummies for buttons and suddenly the numbers stop “disappearing.” Your child learns the count and also learns that math is safer without snacks. The gummies remain… in a separate location.",
        "role": "teach",
        "deltas": {
          "intelligence": 1.0,
          "empathy": 0.4,
          "discipline": 0.8,
          "confidence": 0.8
        },
        "loveDelta": 3,
        "stressDelta": 1,
        "moneyDelta": 0
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Do the counting while guarding the candy like a dragon.",
        "consequence": "You count fast while protecting the gummies with your whole body. Your child contributes by chewing thoughtfully and offering moral support. Homework finishes, but you feel like you fought in the Snack Wars.",
        "role": "avoid",
        "deltas": {
          "intelligence": 0.2,
          "empathy": 0.1,
          "discipline": -0.8,
          "confidence": -0.4
        },
        "loveDelta": -1,
        "stressDelta": 2.5,
        "moneyDelta": 0
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Accept the edible data loss and keep going.",
        "consequence": "You let them count, eat, recount, and improvise. The answers are mostly right and 100% sincere. Your child learns persistence… and that math tastes sweet.",
        "role": "connect",
        "deltas": {
          "intelligence": 0.5,
          "empathy": 0.4,
          "discipline": -0.2,
          "confidence": 1.2
        },
        "loveDelta": 2,
        "stressDelta": 0.5,
        "moneyDelta": 0
      }
    ]
  },
  {
    "id": "hw_06_003",
    "triggerAge": 6,
    "title": "The Stuffed-Animal Proctor",
    "body": "Your child refuses to start unless a stuffed animal is “watching the paper.” The bear is very strict and apparently allergic to lowercase letters.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Let the bear supervise… but you teach the letters.",
        "consequence": "You agree to the bear’s supervision and teach one letter at a time. Your child relaxes and actually focuses—because the bear is “counting.” It’s weirdly effective.",
        "role": "teach",
        "deltas": {
          "intelligence": 1.0,
          "empathy": 0.4,
          "discipline": 0.8,
          "confidence": 0.8
        },
        "loveDelta": 3,
        "stressDelta": 1,
        "moneyDelta": 0
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: “The bear and I will handle this.”",
        "consequence": "You do the work while the bear ‘judges’ silently. Your child is thrilled and offers the bear a high-five for “helping.” Homework is done, but the bear might be promoted permanently.",
        "role": "avoid",
        "deltas": {
          "intelligence": 0.2,
          "empathy": 0.1,
          "discipline": -0.8,
          "confidence": -0.4
        },
        "loveDelta": -1,
        "stressDelta": 2,
        "moneyDelta": 0
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Give the bear a “stamp” and roll with it.",
        "consequence": "You give the bear a pretend stamp and let your child ‘earn’ stamped lines. The page becomes half homework, half tiny office job. It’s messy, but your child stays engaged.",
        "role": "connect",
        "deltas": {
          "intelligence": 0.5,
          "empathy": 0.4,
          "discipline": -0.2,
          "confidence": 1.2
        },
        "loveDelta": 2,
        "stressDelta": 0.5,
        "moneyDelta": 0
      }
    ]
  },
  {
    "id": "hw_06_004",
    "triggerAge": 6,
    "title": "Crayon-Based Problem Solving",
    "body": "Math answers are supposed to be numbers. Your child answers with a rainbow, three hearts, and a dinosaur that looks emotionally supportive.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Translate the art into numbers together.",
        "consequence": "You ask, “Okay, how many hearts is that?” and turn doodles into counting practice. Your child learns that art can help thinking—then writes the real numbers. The dinosaur gets to stay in the margin.",
        "role": "teach",
        "deltas": {
          "intelligence": 1.0,
          "empathy": 0.4,
          "discipline": 0.8,
          "confidence": 0.8
        },
        "loveDelta": 3,
        "stressDelta": 1,
        "moneyDelta": 0
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Replace the dinosaur with actual digits.",
        "consequence": "You gently move the crayons away and write the correct digits. Your child sighs like a tiny misunderstood artist. Homework is correct, but their creative spark dims a bit tonight.",
        "role": "avoid",
        "deltas": {
          "intelligence": 0.2,
          "empathy": 0.1,
          "discipline": -0.8,
          "confidence": -0.4
        },
        "loveDelta": -1,
        "stressDelta": 2,
        "moneyDelta": 0
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Submit the dinosaur and call it “visual reasoning.”",
        "consequence": "You let the picture-answers stand and add tiny numbers next to them like subtitles. Your child feels seen and tries harder on the next question. Teacher reaction tomorrow is a coin flip, but the effort is real.",
        "role": "connect",
        "deltas": {
          "intelligence": 0.5,
          "empathy": 0.4,
          "discipline": -0.2,
          "confidence": 1.2
        },
        "loveDelta": 2,
        "stressDelta": 0.5,
        "moneyDelta": 0
      }
    ]
  },
  {
    "id": "hw_06_005",
    "triggerAge": 6,
    "title": "Homework on a Dentist Flyer",
    "body": "You discover the worksheet completed on the back of a dental reminder flyer. The answers are correct, and the flyer now also recommends flossing.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Redo it neatly on the real page (with breaks).",
        "consequence": "You treat it like a practice run and have them copy it over slowly. They learn that “right work” still needs the “right paper.” Also, they now know what a dentist is… again.",
        "role": "teach",
        "deltas": {
          "intelligence": 1.0,
          "empathy": 0.4,
          "discipline": 0.8,
          "confidence": 0.8
        },
        "loveDelta": 3,
        "stressDelta": 1,
        "moneyDelta": 0
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Copy it onto the correct sheet yourself.",
        "consequence": "You copy everything onto the correct page while they narrate dramatically. The result is clean and fast. Your child learns that mistakes disappear when adults do administrative work.",
        "role": "avoid",
        "deltas": {
          "intelligence": 0.2,
          "empathy": 0.1,
          "discipline": -0.8,
          "confidence": -0.4
        },
        "loveDelta": -1,
        "stressDelta": 2,
        "moneyDelta": 0
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Turn it in with a smile and a side of dental advice.",
        "consequence": "You staple the flyer to the homework like a tiny portfolio piece. Your child is proud of their ‘two-sided project.’ Tomorrow might bring a confused laugh from the teacher.",
        "role": "connect",
        "deltas": {
          "intelligence": 0.5,
          "empathy": 0.4,
          "discipline": -0.2,
          "confidence": 1.2
        },
        "loveDelta": 2,
        "stressDelta": 0.5,
        "moneyDelta": 0
      }
    ]
  },
  {
    "id": "hw_06_006",
    "triggerAge": 6,
    "title": "The Dry Glue Stick Tragedy",
    "body": "Tonight’s homework is a craft page. The glue stick is dry, and your child tries to solve it with sheer hope and one suspicious lick.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Improvise with tape and teach “Plan B.”",
        "consequence": "You show them how to use tape and still follow the instructions. They feel proud of problem-solving instead of panicking. The page looks fine—just slightly more ‘engineering’ than ‘craft.’",
        "role": "teach",
        "deltas": {
          "intelligence": 1.0,
          "empathy": 0.4,
          "discipline": 0.8,
          "confidence": 0.8
        },
        "loveDelta": 3,
        "stressDelta": 1,
        "moneyDelta": -5
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Do a fast, perfect glue/tape rescue.",
        "consequence": "You build the craft like a professional arts-and-crafts contractor. Your child watches and says, “Wow, you’re good at everything.” It’s flattering, but now they think you’re the glue wizard.",
        "role": "avoid",
        "deltas": {
          "intelligence": 0.2,
          "empathy": 0.1,
          "discipline": -0.8,
          "confidence": -0.4
        },
        "loveDelta": -1,
        "stressDelta": 2,
        "moneyDelta": 0
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Use the dry glue and hope for the best.",
        "consequence": "You both press down hard for ten seconds and say a prayer. The paper sticks… mostly. It’s a “fragile masterpiece,” but it’s done.",
        "role": "connect",
        "deltas": {
          "intelligence": 0.5,
          "empathy": 0.4,
          "discipline": -0.2,
          "confidence": 1.2
        },
        "loveDelta": 2,
        "stressDelta": 0.5,
        "moneyDelta": 0
      }
    ]
  },
  // PLACEHOLDER EVENTS FOR OTHER AGES (User provided text was truncated)
  // Replicating Age 6 events with new IDs/Ages to ensure functionality
  {
    "id": "hw_09_001",
    "triggerAge": 9,
    "title": "The Red 'MISSING' Notification",
    "body": "The school portal flashes a bright red ‘MISSING’ next to an assignment your child swears they finished. Later, you find the worksheet at the bottom of the backpack… folded into a paper airplane that never achieved flight.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Build a tiny ‘turn-in ritual’ so finished work actually leaves the backpack.",
        "consequence": "You keep the tone calm and treat it like a systems problem, not a character flaw. Together you make a simple routine: completed work goes in a bright folder, then a quick photo before it goes in the bag. Tomorrow your child turns it in without drama—and learns that brains forget, but systems remember.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Email the teacher and deliver the worksheet like you’re customer support.",
        "consequence": "You write a polite message, print a clean copy, and make sure it lands on the teacher’s desk. Crisis averted. Your child is relieved… and also quietly absorbs the lesson that if they panic hard enough, an adult will portal-jump in and fix it.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let the ‘missing’ land—then help them recover without shame.",
        "consequence": "You let the consequence happen and sit with the big feelings that follow. Then you turn it into a reset: “Okay—what do we change for next time?” They hate the red notification, but they also remember the new folder routine because it came after a real moment, not a lecture.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_002",
    "triggerAge": 9,
    "title": "The Fraction Pizza Vanishing Act",
    "body": "The homework says: cut out a paper pizza and label fractions (1/2, 1/4, 1/8). Your child hears ‘pizza’ and immediately launches a snack operation. The paper pizza is untouched; the real pizza is mysteriously gone.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Rebuild the paper pizza and turn dinner into a fraction lesson.",
        "consequence": "You draw a quick circle, cut it into slices, and let them label each piece before anyone eats anything. They learn that 1/4 is smaller than it looks when you’re hungry, and you both survive the assignment with minimal cheese-related drama.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Cut and label everything yourself while they ‘supervise’ with sauce-stained fingers.",
        "consequence": "The fractions are perfect and the worksheet is pristine. Your child’s contribution is announcing ‘that one looks like 1/8’ and eating the evidence. Homework is done, but the math muscle stays mostly unexercised.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Submit a messy version and let tomorrow’s feedback do the teaching.",
        "consequence": "They hand in something that’s… more ‘abstract pizza’ than fractions. The teacher’s note stings a little, but it makes next time clearer: the point isn’t the art project—it’s the thinking.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_003",
    "triggerAge": 9,
    "title": "Book Report: The Main Character Is ‘A Kid’",
    "body": "They need to write a paragraph about the main character’s problem and how it changes. Their draft reads: ‘The kid had a problem. Then the kid didn’t.’ It’s technically a plot, but it’s also… not.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Let them tell the story out loud, then help translate it into sentences.",
        "consequence": "You ask them to tell you the plot like it’s the hottest piece of playground gossip. Suddenly they have details, opinions, and strong feelings about the villain. You help them turn that energy into a paragraph that actually sounds like they met the characters.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Write a clean paragraph while they ‘look for the right pencil’ forever.",
        "consequence": "It gets turned in and it’s solid. Your child is relieved—and quietly learns that if they stall long enough, the paragraph will appear like a parent-powered miracle.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let the vague paragraph go in, then help them handle the feedback without spiraling.",
        "consequence": "The teacher writes something like ‘be specific’ and your child groans dramatically. Later, you redo it together as a low-stakes practice round. The lesson lands: details make stories believable—and so does effort.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_004",
    "triggerAge": 9,
    "title": "Spelling List: Necessary vs. Your Household",
    "body": "The spelling list is fine until ‘necessary’ and ‘separate’ show up. Your child stares at the paper like the English language is pranking them personally.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Invent a ridiculous mnemonic and practice in short, silly bursts.",
        "consequence": "You turn the words into a mini-comedy: ‘a shirt has one collar and two sleeves’ and ‘necessary has one c and two s.’ They laugh, they remember, and the practice doesn’t feel like a punishment.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Run a high-pressure drill session like it’s a game show finale.",
        "consequence": "You rapid-fire spelling words while they sweat and guess. They might nail a few through pure adrenaline, but the vibe is ‘spelling under interrogation’—and everyone goes to bed tense.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them miss a few and focus on staying brave and steady.",
        "consequence": "They don’t ace the list, but they also don’t collapse. Afterwards you frame it as information: ‘Okay—these are the tricky ones.’ Confidence stays intact, which makes future practice actually possible.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_005",
    "triggerAge": 9,
    "title": "Science Fair: The Volcano and the Dream",
    "body": "The science fair board is due tomorrow. Tonight your child announces the volcano is ‘basically done’—meaning there is a soda bottle, a roll of tape, and a huge amount of optimism. They also request paper-mâché, paint, and ‘like… science.’",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Shrink it to a simple experiment with a clear question and results.",
        "consequence": "You help them pick one variable—more baking soda or less—and run a few quick tests. The volcano is smaller, but the project is real: hypothesis, observations, and a kid who can explain what happened without memorizing a script.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Build the volcano yourself and hand them labels like it’s teamwork.",
        "consequence": "The board looks incredible. Your child smiles… then freezes when asked how it works. You saved the grade, but you also accidentally taught them that science is something adults perform while kids watch.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let the messy volcano happen and coach them to present honestly.",
        "consequence": "It’s a little lopsided and it barely erupts, but they stand up and say what they learned and what they’d change next time. That honesty is strangely powerful—and far more memorable than a perfect papier-mâché mountain.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_006",
    "triggerAge": 9,
    "title": "Timed Multiplication: The Stopwatch of Doom",
    "body": "The worksheet suggests using a timer. The moment the stopwatch starts, your child forgets what 6×7 is and also briefly forgets their own name.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Switch from speed to strategy—then build speed later.",
        "consequence": "You teach a couple tricks (doubles, making tens) and you take the timer off the table. Accuracy returns, and the fear drops. Over a few days, they get faster naturally—because they’re not panicking anymore.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Call out answers like an auctioneer so it’s over quickly.",
        "consequence": "The page fills up fast. Your child feels relieved, but the message underneath is loud: when math gets stressful, someone else will do it. Next time the timer appears, the anxiety arrives early.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Skip the timer, do a few problems now, and plan a calmer routine.",
        "consequence": "They complete less tonight, but they finish with their dignity. You help them set a tiny daily habit, and the worksheet stops feeling like a surprise attack.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_007",
    "triggerAge": 9,
    "title": "Cursive Signature: The Doctor Scribble Era",
    "body": "The assignment is ‘write your name in cursive five times.’ Your child produces something that looks like a doctor signing a prescription… for chaos.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Choose two ‘anchor letters’ and build a signature they can repeat.",
        "consequence": "You make it a design project: pick the letters that must be readable and let the rest be style. They practice five times, and by the end it’s recognizable—plus they feel oddly grown up in a wholesome way.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Write it neatly and have them trace it like a stencil.",
        "consequence": "The sheet looks great, and tracing feels satisfying. But the next day, without the stencil, the signature shapeshifts again. You fixed the assignment, not the skill.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let the wild cursive go in and celebrate effort over aesthetics.",
        "consequence": "It’s messy, but it’s theirs. Your child learns that school isn’t always about perfection—sometimes it’s just about showing up and trying, even if your name looks like a rollercoaster.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_008",
    "triggerAge": 9,
    "title": "Recorder Practice: The Squeakening",
    "body": "They’re supposed to practice a simple melody for music class. The recorder produces a sound that makes the family pet leave the room and your soul briefly exit your body.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Make practice tiny, predictable, and survivable.",
        "consequence": "You do two minutes of finger placement, then two minutes of the song—then stop while it’s still going okay. In a week, the squeaks turn into notes. Your child feels proud, and you regain the ability to blink calmly.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: ‘Let me show you’—and discover you also have recorder trauma.",
        "consequence": "You attempt a demonstration and immediately squeak in solidarity. Everyone laughs. It’s a bonding moment, but not much practice gets done—and now the recorder has two victims.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Encourage them to ask the teacher for one specific tip.",
        "consequence": "They show up honest: ‘I keep squeaking on this note—what am I doing wrong?’ The teacher helps, and your child learns a great life skill: asking for targeted help instead of suffering in silence.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_009",
    "triggerAge": 9,
    "title": "Show Your Work: The Psychic Math Case",
    "body": "Every answer is correct… but every ‘SHOW YOUR WORK’ line is blank. Your child says, ‘I did it in my brain.’ Their brain refuses to provide receipts.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Turn their brain-math into written steps they can repeat.",
        "consequence": "You listen, translate their ‘brain math’ into a few simple steps, and they realize they actually can explain it. Next time, they start writing steps earlier—because they now know what ‘work’ looks like on paper.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Reverse-engineer the steps and fill them in yourself.",
        "consequence": "The assignment is safe. Your child is relieved, but they don’t practice the skill the teacher is actually grading. You’ve saved tonight and borrowed stress from tomorrow.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Turn it in without steps and let the teacher’s note do the teaching.",
        "consequence": "They get the classic ‘great answers, show your work’ feedback. It stings, but it’s clear. You help them re-do two problems properly as practice, and the lesson lands without a lecture.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_09_010",
    "triggerAge": 9,
    "title": "Vocabulary Sentences: The Tiny Shakespeare Phase",
    "body": "They must use vocabulary words in sentences. Your child writes: ‘I observed the sandwich. The sandwich observed me.’ It is technically correct and also deeply unsettling.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Keep one silly sentence, then write a few that actually prove meaning.",
        "consequence": "You let them keep one absurd sentence for fun, then you help them write a couple that clearly show the word’s meaning. The homework becomes both accurate and weird—in the best way.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Write perfect sentences and hand them over like it’s a copy-paste job.",
        "consequence": "Everything looks polished and teacher-friendly. Your child learns the words will be ‘handled’ by adults when needed—which is convenient now and limiting later.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Submit the surreal sentences and trust the teacher has a sense of humor.",
        "consequence": "The teacher either laughs or circles ‘observed’ with a note that says ‘…okay?’ Either way, your child learns about audience and clarity. Also, the sandwich becomes a household legend.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_001",
    "triggerAge": 12,
    "title": "The Group Project Ghost",
    "body": "Their group project is due tomorrow. One teammate has vanished. Another keeps posting memes. Your child is staring at a half-finished slide deck like it’s a horror movie trailer.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Help them lead—clear message, simple plan, and a ‘good enough’ version.",
        "consequence": "You help them write a calm, direct message: who’s doing what, by when, and what happens if nothing comes back. Together you trim the project into something coherent and complete. They present with confidence and learn a new truth: leadership is mostly clarity and follow-through, not yelling.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: You become the project manager (and quietly fill in missing parts).",
        "consequence": "You email the teacher, chase the group, and patch the gaps yourself. It turns into a solid project. Your child is grateful… but also a little dependent on the feeling that adults will carry the weight when peers don’t.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Encourage honesty—submit your part and name what you couldn’t control.",
        "consequence": "Your child submits what they did and adds a simple note: “This is my portion; we didn’t receive the rest.” It’s uncomfortable, but it’s clean. They learn boundaries, self-respect, and that being momentarily embarrassed is survivable—and sometimes the bravest option.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_002",
    "triggerAge": 12,
    "title": "The Attachment That Wasn’t Attached",
    "body": "The portal says ‘Submitted.’ The teacher comment says, ‘I can’t see your work.’ Your child realizes they uploaded exactly nothing—like a digital magician who only knows one trick.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Build a tiny upload checklist—attach, preview, then submit.",
        "consequence": "You make a three-step ritual and practice it once together: attach the file, open it to confirm, then hit submit. Next time, your child catches the mistake before the teacher does. It’s boring… which is exactly why it works.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Log in, upload it yourself, and rescue the grade.",
        "consequence": "The work gets submitted in minutes. Your child is grateful—and learns that portals are less scary when an adult is standing behind them doing the clicking.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Have them email the teacher, own it, and resubmit properly.",
        "consequence": "They send a short, honest email and attach the right file. It’s uncomfortable, but it’s real responsibility. Next time, they double-check before submitting—because they remember how it felt to fix it themselves.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_003",
    "triggerAge": 12,
    "title": "Poster Board at 9:14pm",
    "body": "They announce they need a poster board for tomorrow. Not any poster board—‘the big kind.’ The stores are closed, the craft drawer is empty, and the urgency is at maximum volume.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Improvise with what you have, then plan a better system for next time.",
        "consequence": "You find a cardboard box, flatten it, and make the layout clean and readable. Then you set up a ‘project supplies’ spot for future emergencies. The board isn’t perfect, but your child learns: preparation beats panic (and cardboard is surprisingly versatile).",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Go on a late-night quest for poster board like it’s a side mission.",
        "consequence": "You find one, bring it home, and save the day. Your child is relieved… and your brain quietly adds ‘poster board’ to the list of things that can apparently only be remembered after 9pm.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them bring an imperfect version and accept the consequence.",
        "consequence": "They show up with a smaller board (or none) and feel the awkward sting. Later you help them reflect without shame: ‘What’s the earlier warning sign next time?’ The lesson lands because it cost them something real—but not something devastating.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_004",
    "triggerAge": 12,
    "title": "Lab Report: The Data That Doesn’t Data",
    "body": "They’re writing the lab report and the numbers make no sense. The graph looks like a roller coaster and the conclusion currently says, ‘Science is confusing.’",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Teach them to troubleshoot—check units, redo one calculation, then write ‘sources of error.’",
        "consequence": "You show them how to sanity-check the math and name what might have gone wrong. The report becomes honest and solid, and your child learns a powerful idea: messy data doesn’t mean failure—it means you’re doing real science.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Fix the calculations and redraw the graph so it looks ‘right.’",
        "consequence": "The report looks clean and confident. Your child is relieved—but they also miss the skill of figuring out what went wrong. The grade is safer; the learning is thinner.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them submit it imperfect—then reflect on what to do next time.",
        "consequence": "They submit with a wobbly graph and an honest conclusion. It’s not their best work, but it’s theirs. Afterwards, you talk about preparation and checking work earlier, without turning it into a character verdict.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_005",
    "triggerAge": 12,
    "title": "Group Chat: 73 Messages, 0 Work",
    "body": "The group project chat is lively—memes, reaction gifs, and one person typing ‘lol’ in three different fonts. Actual work: none. Due date: tomorrow.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Help them lead—clear tasks, deadlines, and a ‘good enough’ backup plan.",
        "consequence": "You help them send one calm message: who’s doing what, by when, and what happens if nobody responds. They finish a solid version anyway. Your child learns leadership isn’t bossy—it’s clarity plus follow-through.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: You step into the group situation and try to manage it yourself.",
        "consequence": "You email the teacher, message parents, chase updates—your child watches the adult machinery spin up. It might help, but it also teaches them that peer problems are solved by escalating to grown-ups instead of building their own backbone.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Encourage them to submit their portion and clearly name what they couldn’t control.",
        "consequence": "They submit what they did and explain the missing pieces without drama. It’s uncomfortable, but it’s clean. Your child learns boundaries and self-respect—skills that matter long after the group project is forgotten.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_006",
    "triggerAge": 12,
    "title": "The Study Plan Made of Vibes",
    "body": "Test tomorrow. Your child says, ‘I’ll just… study.’ Their backpack contains 47 loose papers, 3 mystery snacks, and one worksheet from a completely different unit.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Make a tiny plan—what matters most, then quick recall practice.",
        "consequence": "You help them choose the top topics and do short ‘close the notes and recall it’ practice. It feels structured, not overwhelming. They go to bed feeling prepared instead of doomed.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: You run a two-hour cram session like you’re the coach of the team.",
        "consequence": "You quiz them hard, push for more, and keep going past the point of usefulness. They might learn something, but the main memory is the stress. Studying becomes something that happens to them, not something they control.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Encourage sleep and acceptance—then revisit habits after the test.",
        "consequence": "They do a little, then rest. The score might reflect the lack of prep, but the next-day conversation is calmer: ‘What would help future-you not feel like this?’ Sometimes the lesson is timing, not content.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_007",
    "triggerAge": 12,
    "title": "The Permission Slip Teleport Request",
    "body": "At 9:58pm: ‘I need your signature for a field trip. It’s due tomorrow.’ The paper is crumpled like it survived a small tornado and smells faintly of cafeteria fries.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Sign it, then build a simple system so forms stop time-traveling.",
        "consequence": "You sign, but you also create a ‘forms folder’ and a daily two-minute backpack check. Next time, your child catches the slip earlier and feels oddly powerful. The real win isn’t the signature—it’s the habit.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Sign it fast and deliver a dramatic lecture about responsibility.",
        "consequence": "The paper gets signed, but the lecture turns into background noise. Your child learns that late slips come with big emotions—which makes them more likely to hide the next one, not share it sooner.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Don’t rescue—let them ask the teacher for a late signature.",
        "consequence": "They face the mild embarrassment of explaining it. It’s uncomfortable, but survivable—and it teaches them to handle consequences without you buffering every bump. Next time, they’re more likely to bring the paper home before midnight.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_008",
    "triggerAge": 12,
    "title": "The Citation Gremlin",
    "body": "The research paragraph is done. The sources section is… a blank abyss. Your child says, ‘I used the internet.’ The teacher wants MLA citations, which currently sounds like a foreign language.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Show them a simple way—find two credible sources and cite them correctly.",
        "consequence": "You teach them the basics: author, title, site, date. You find two decent sources together, and suddenly it’s not magic—it’s a pattern. They learn a quiet life skill: giving credit is part of being trustworthy.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: You hunt down sources and format citations while they ‘work’ nearby.",
        "consequence": "The bibliography appears like a miracle. Your child is relieved, but the next time citations come up, they still don’t know how to do it—because the skill never became theirs.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them submit with weak citations and learn from the grade and feedback.",
        "consequence": "They take a hit, but they also learn what the teacher values. Later, you help them practice with one short citation so the next assignment doesn’t feel like falling off a cliff.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_009",
    "triggerAge": 12,
    "title": "The Book You Definitely Read (In Your Heart)",
    "body": "They have a reading quiz tomorrow. The book is… mostly untouched. They claim they ‘get the vibe’ and ask if you can summarize it ‘real quick.’",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Teach a realistic rescue—skim smart, find key scenes, then learn the lesson.",
        "consequence": "You show them how to skim chapters, grab main events, and write a quick timeline. It’s not ideal, but it’s honest work and it models a real skill: when you’re behind, you triage instead of pretending.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Give them the full plot and the ‘correct answers’ vibe.",
        "consequence": "They feel instantly calmer, because the story is now in their head… secondhand. The quiz might go fine, but the larger habit quietly deepens: avoid the work, then ask for a shortcut.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them take the quiz unprepared and face it—then talk about the pattern.",
        "consequence": "They don’t love the result, but it’s clear and real. Later, you talk about why it happened and what would help next time. The lesson is uncomfortable, but it’s theirs—and that makes it stick.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_12_010",
    "triggerAge": 12,
    "title": "Calculator Battery Funeral",
    "body": "Right before homework, the calculator screen fades like it’s dramatically dying in a movie. Tomorrow’s math test expects calculator use. Your child whispers, ‘No… not now.’",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Teach the backup plan—replace the battery, pack spares, and practice one mental check.",
        "consequence": "You show them how to replace the battery and suggest keeping a spare in the backpack. You also practice one quick mental estimate check so they’re not helpless if tech fails. They feel competent again—like the world is manageable.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Run out and buy a new one immediately so the fear stops.",
        "consequence": "Problem solved fast. Your child relaxes, but the bigger lesson becomes: when something breaks, someone else will fix it at full speed. Useful tonight—less useful later.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them borrow one at school and handle the awkward conversation.",
        "consequence": "They ask the teacher or a friend to borrow a calculator and survive the mild embarrassment. It’s not fun, but it builds independence. Next time, they remember the battery before you do.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_001",
    "triggerAge": 15,
    "title": "The Midnight Thesis Spiral",
    "body": "At 11:47pm, your child announces the essay is ‘ruined’ because the introduction ‘doesn’t sound smart enough.’ The document has 237 words and most of them are apologizing.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Move from panic to plan—outline, timer, rough draft first.",
        "consequence": "You lower the target from “amazing” to “real.” Together you sketch three points, set a 25-minute timer, and ban editing until the timer ends. The essay becomes a draft. Their shoulders unclench. They learn that progress is a skill, not a mood.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Rewrite the intro so it sounds ‘right’ and hit save like a hero.",
        "consequence": "You type a clean, confident paragraph. They feel instant relief—followed by a weird emptiness: if it’s good, it doesn’t feel like theirs. The grade might be safer, but their belief in their own voice takes a hit.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them submit imperfect and sleep—tomorrow you debrief the pattern.",
        "consequence": "They submit something that’s not what they dreamed it could be. It stings. But the next week, they start earlier—because the memory of that midnight spiral is more motivating than any pep talk. Sometimes the lesson lands best when reality does.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_002",
    "triggerAge": 15,
    "title": "The Rubric They Never Met",
    "body": "The rubric is detailed, highlighted, and posted online. Your child’s draft ignores all of it, like the rubric is merely a suggestion from an alternate universe.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Compare draft to rubric and turn it into a checklist they can actually follow.",
        "consequence": "You sit beside them and translate rubric-speak into plain language. They add the missing pieces one by one, and the assignment suddenly feels doable. They learn the quiet superpower of school: follow the instructions like it’s a treasure map.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Rewrite it to match the rubric so it’s ‘safe’ before the deadline.",
        "consequence": "It becomes polished fast. Your child is relieved, but it also teaches them that the rubric is something adults decode and fix for them. Next time, they’re tempted to skip learning and wait for rescue.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them submit it as-is and use the grade as information, not shame.",
        "consequence": "The feedback stings, but it’s clear. Later, you help them identify the one or two rubric items they keep missing. The lesson lands because it’s real—and because you don’t make it mean they are ‘lazy’ or ‘bad.’",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_003",
    "triggerAge": 15,
    "title": "DBQ at 11:47pm: The Document Stare-Off",
    "body": "They have to write a DBQ using seven documents. They are currently staring at Document #1 like it owes them money. The cursor blinks. Dramatically.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Outline first—thesis, three points, then assign documents to each paragraph.",
        "consequence": "You help them make a quick skeleton: claim, evidence, explain. The essay stops being a monster and becomes a series of small steps. They finish tired but proud—and they learn that structure is the antidote to panic.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Hand them a thesis and topic sentences so the hard part feels ‘done.’",
        "consequence": "They write faster with your scaffolding. But the next DBQ still feels impossible, because the skill didn’t become theirs—it became something you provide when the clock gets loud.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them write a rough version and prioritize sleep over perfection.",
        "consequence": "It’s not their best work, but it’s real work. The next day, you talk about starting earlier—not with punishment, but with curiosity. The lesson is less ‘be better’ and more ‘build a system.’",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_004",
    "triggerAge": 15,
    "title": "Lab Partner Ghost Protocol",
    "body": "The lab report is due and their partner has gone silent. Your child has three messages marked ‘read’ and a growing suspicion that the group grade is a myth.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Teach them to document work, set a deadline, and communicate clearly with the teacher.",
        "consequence": "You help them write a calm message to the partner and a respectful note to the teacher if needed. They submit what they can with evidence of their effort. It’s a hard situation, but they learn boundaries and professionalism.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Escalate everywhere—emails, texts, and full adult intervention.",
        "consequence": "You shake the tree until something falls out. It might help, but your child learns that peer accountability is solved by adults storming in, not by their own skills. Also: your stress becomes everyone’s stress.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Submit their portion only and let the situation be uncomfortable but honest.",
        "consequence": "They submit what they did and name what they didn’t receive. It’s awkward, but it’s clean. The lesson sticks: you can’t control others, but you can protect your own integrity.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_005",
    "triggerAge": 15,
    "title": "Canvas Lockout at 11:58",
    "body": "They hit submit and the portal spins. Then it says ‘Upload failed.’ Then it logs them out like a villain. The due time ticks closer.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Teach the ‘deadline survival kit’—screenshots, backups, and earlier uploads.",
        "consequence": "You help them compress the file, take a timestamp screenshot, and send the assignment through an alternate method if needed. Later you talk about submitting earlier, not as a lecture—just as future stress prevention.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Troubleshoot and upload it yourself so the panic stops immediately.",
        "consequence": "It gets in. Crisis over. But your child walks away with a quiet belief that tech problems require adult rescue instead of calm problem-solving.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them email the teacher with proof and accept whatever happens.",
        "consequence": "They send the file with a timestamp and a short explanation. It’s not guaranteed, but it’s responsible. They learn that doing the right thing isn’t always perfect—but it’s still the right thing.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_006",
    "triggerAge": 15,
    "title": "Practice Test vs. The Bed",
    "body": "They promised they’d do an SAT practice section tonight. Instead, they’ve reorganized their desk, cleaned one earbud, and announced they are ‘too tired to think.’",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Make it small—one section, one timer, then stop on purpose.",
        "consequence": "You help them pick one manageable chunk and set a timer. They finish something, not everything—and that’s the point. They learn consistency beats heroic bursts of motivation.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Push hard and supervise like it’s your score on the line.",
        "consequence": "They comply, but the resentment grows. Testing becomes a battleground, not a skill. You might get minutes of studying, but you lose a little buy-in.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them rest and revisit the goal tomorrow when their brain is online.",
        "consequence": "They sleep and feel better, but the larger question remains: who is steering the plan? Later, you talk about why it keeps slipping—not to shame them, but to help them build a realistic routine.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_007",
    "triggerAge": 15,
    "title": "Citation Panic: The Essay Borrowed Too Much",
    "body": "Their essay is strong… and also contains a few lines that sound suspiciously like the internet wrote them. They suddenly remember the word ‘plagiarism’ and look haunted.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Teach them to paraphrase, cite properly, and fix it with integrity.",
        "consequence": "You show them how to rewrite the borrowed lines in their own voice and add simple citations. They learn that honesty is not just moral—it’s practical. Their confidence grows because they did the hard thing the right way.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Patch the citations yourself and quietly ‘fix’ the problem.",
        "consequence": "The risk drops fast, but your child learns a dangerous shortcut: when integrity feels scary, adults can hide the evidence. It solves tonight and steals growth from tomorrow.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Encourage them to talk to the teacher before submission and own the mistake.",
        "consequence": "They admit they’re unsure how to cite and ask for guidance. It’s vulnerable, but it’s also mature. They learn that asking for help early is braver than pretending everything is fine.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_008",
    "triggerAge": 15,
    "title": "Peer Review: Ouch",
    "body": "They get peer review comments: ‘confusing,’ ‘needs evidence,’ and one that just says ‘???’ They act like their entire future has been canceled.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Help them separate tone from content and pick two actionable fixes.",
        "consequence": "You validate the sting, then guide them to extract useful information: clarify the claim, add one piece of evidence, tighten one paragraph. They learn feedback isn’t a verdict—it’s data.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Defend them by emailing the teacher about ‘unfair’ comments.",
        "consequence": "You might feel righteous, but your child learns that discomfort should be fought, not processed. The skill they needed was resilience and revision—not a courtroom.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them cool down first, then revise only what they truly agree needs work.",
        "consequence": "They take a breath, then choose what to fix. The paper improves and their ego stays intact. They learn a mature balance: accept feedback without surrendering your whole self.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_009",
    "triggerAge": 15,
    "title": "Video Project: The Missing Clip",
    "body": "The group video project is almost done—except the key clip is missing. Someone swears it was recorded. Someone else swears it was sent. Reality swears it was never real.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Reshoot a simpler version and set a backup plan for files.",
        "consequence": "You help them plan a quick reshoot and immediately back it up in two places. The project survives, and they learn a very adult truth: disasters are less scary when you plan for them.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: You film and edit like you’re on a professional deadline.",
        "consequence": "It gets done. It might even be impressive. But your child learns that when collaboration fails, an adult will swoop in and become the production studio instead of teaching them how to cope and adapt.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them present a rough version and explain what happened.",
        "consequence": "They present with an imperfect edit and a simple explanation. It’s uncomfortable—but it’s honest. They learn to own problems without collapsing, which is a bigger skill than perfect video transitions.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_15_010",
    "triggerAge": 15,
    "title": "The Extension Email Draft: ‘hey’",
    "body": "They need an extension. Their email draft says: ‘hey i need more time.’ No subject line. No punctuation. Just vibes.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Teach a respectful ask—subject line, reason, and a proposed new deadline.",
        "consequence": "You help them write a clear email that sounds like a responsible human: brief context, accountability, and a specific plan. They send it themselves and feel the quiet pride of handling something hard like an adult.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Write the email for them so it’s perfect, then tell them to send it.",
        "consequence": "The email sounds great—but it also doesn’t sound like them. The teacher might grant the extension, yet your child learns less about communication and more about outsourcing their voice.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them not ask and accept the late penalty as a lesson in time.",
        "consequence": "They take the hit and it stings. Later, you help them reflect without shame: not ‘why are you like this,’ but ‘what system would prevent this next time?’ Responsibility grows best in calm soil.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_001",
    "triggerAge": 18,
    "title": "Senioritis vs. Capstone",
    "body": "The capstone project has been ‘basically done’ for three weeks. Tonight you walk past their room and hear: a sigh, three new tabs, and the opening notes of a ‘study with me’ video that includes suspiciously little studying.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Treat it like an adult project—milestones, calendar, and a check-in they agree to.",
        "consequence": "You sit down like collaborators. They choose the next two deliverables, block time, and decide how you can support (snack runs? proofreading? silence?). They finish in real chunks—and it feels less like being managed and more like learning to manage themselves.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: You micromanage it into existence because the deadline is real.",
        "consequence": "You hover, remind, print rubrics, and push the project across the finish line. It gets done, but the air feels tense. Your child complies, yet both of you feel the awkward truth: you can’t carry adulthood for someone who’s about to step into it.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Step back—offer support, but let them feel the clock and steer.",
        "consequence": "You don’t rescue. You stay available and kind, but you let them own the timeline. If they scramble, you help them triage instead of taking over. The project gets finished (maybe with caffeine), and the bigger win is quieter: they practice being responsible while you practice letting go.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_002",
    "triggerAge": 18,
    "title": "Scholarship Essay: The ‘Who Am I?’ Spiral",
    "body": "The scholarship prompt is simple: ‘Tell us about a challenge you overcame.’ Your child opens the document, types ‘I’… and then stares into the distance like they’re trying to remember their own origin story.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Help them pick one real moment and outline it like a story—beginning, middle, change.",
        "consequence": "You ask a few gentle questions until one true story emerges. They outline it, write a rough draft, and suddenly it’s not about being impressive—it’s about being specific. The essay becomes theirs, and it actually lands.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Write the first paragraph so they can ‘just finish it.’",
        "consequence": "The document finally has momentum. But the voice feels slightly borrowed, and they learn that when identity-writing gets hard, someone else can manufacture a beginning for them.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them write an imperfect draft and submit something honest instead of flawless.",
        "consequence": "It’s not a masterpiece, but it’s real. They learn that authenticity can be enough—and that shipping a draft beats worshipping a blank page.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_003",
    "triggerAge": 18,
    "title": "FAFSA: The Form That Eats Time",
    "body": "They sit down to do financial aid forms and immediately discover pages of questions that all sound like: ‘Please estimate your soul.’ Everyone’s patience starts to flicker.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Break it into steps—gather documents, set a timer, and do it calmly together.",
        "consequence": "You treat it like a project, not a crisis: documents first, then one section at a time. They learn how to handle boring adult paperwork without melting—and that’s a life skill disguised as a form.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Fill it out while they hover nearby, mostly relieved it’s ‘handled.’",
        "consequence": "It gets done, but your child learns that confusing paperwork is something parents do, not something they can learn. Convenience now; dependence later.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Encourage them to call the financial aid office and ask real questions.",
        "consequence": "They get answers straight from the source and realize adults aren’t magical—they just ask. It’s awkward at first, then empowering. The form becomes manageable because they learned how to get unstuck.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_004",
    "triggerAge": 18,
    "title": "Capstone Slides: ‘TITLE HERE’ Lives On",
    "body": "Presentation is tomorrow. Slide 1 still says ‘TITLE HERE’ and slide 2 says ‘ADD IMAGE.’ Their confidence is doing a slow-motion backflip.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Build a simple deck and practice the story—clarity over fancy design.",
        "consequence": "You help them make a clean structure: problem, approach, result, next step. They practice out loud twice and stop chasing perfection. The slides become ‘good enough,’ and the presentation becomes actually good.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Redesign the slides so they look professional, fast.",
        "consequence": "The deck looks polished. Your child feels safer, but also less connected to the work. You saved the aesthetics, not the confidence.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let the slides be rough—focus on showing up and owning it.",
        "consequence": "They present with imperfect visuals but a real voice. The world doesn’t end. They learn a huge lesson for adulthood: you can be nervous and still be capable.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_005",
    "triggerAge": 18,
    "title": "The Adult Email With a Subject Line",
    "body": "They need to email a professor or supervisor. Their draft starts with ‘yo’ and ends with no signature. It’s less ‘professional correspondence’ and more ‘text message in a suit.’",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Teach the structure—subject, greeting, ask, thanks, signature—then let them send it.",
        "consequence": "You help them write something clear and respectful. They hit send themselves and realize professionalism is a skill, not a personality type. Their confidence quietly levels up.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Rewrite it so it sounds perfect, then hand it back to send.",
        "consequence": "The email is flawless—but it also doesn’t sound like them. They get the benefit without learning the craft, which means the next email will feel just as scary.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them send the awkward version and learn from the response.",
        "consequence": "If the reply is chilly, it’s a lesson in tone. If it’s kind, it’s a lesson in grace. Either way, they learn what actually matters in communication: clarity and respect—not vibes alone.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_006",
    "triggerAge": 18,
    "title": "Internship Hours: The Great Reconstruction",
    "body": "The program wants logged hours. Your child has… vibes and a calendar full of ‘stuff.’ They’re trying to reconstruct the month like a detective without a budget.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Rebuild it using real anchors, then set up a simple tracking habit for the future.",
        "consequence": "You show them how to use texts, calendar events, and receipts to rebuild the timeline. Then you set up a two-minute daily log so this never happens again. They learn adult accountability the non-punishing way: systems over shame.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Estimate it quickly so the form gets submitted and the stress stops.",
        "consequence": "It’s done fast, but it’s built on guesswork. Your child learns that paperwork can be solved by rushing and hoping—and that’s a habit that gets expensive later.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Encourage them to talk to their supervisor and correct it honestly.",
        "consequence": "They admit they didn’t track perfectly and ask how to fix it. It’s humbling, but it builds integrity. They learn: honesty is uncomfortable for five minutes, and then it becomes freedom.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_007",
    "triggerAge": 18,
    "title": "Housing Deposit Surprise",
    "body": "They get an email: ‘Housing deposit due Friday.’ They look at their bank app, then look at you, then look back at the bank app like it might suddenly change its mind.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Walk through a plan—budget, options, and the next responsible step.",
        "consequence": "You help them break it down: what they have, what they need, what’s realistic. They make a plan and take the next step themselves. It’s not just about money—it’s about learning to face adulthood without freezing.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Pay it and tell them you’ll ‘figure it out later.’",
        "consequence": "The problem disappears instantly. Your child feels safe, but they also learn that big adult responsibilities can be quietly carried by someone else. It works today—and delays their growth.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them contact housing and negotiate a plan or deadline extension.",
        "consequence": "They make the call (nervous), ask the question (awkward), and get real information (empowering). Even if the answer is no, they practiced a crucial adult skill: advocating for themselves.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_008",
    "triggerAge": 18,
    "title": "Finals Week Meal Plan: Cereal and Determination",
    "body": "It’s finals week. Their meal strategy is ‘whatever is closest.’ The closest option is cereal. Again. Their brain is running on oat dust and hope.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Help them build a realistic finals routine—sleep, food, and short study blocks.",
        "consequence": "You help them map the week: what to study, when to rest, and how to eat something that isn’t pure crunch. Their performance improves, but more importantly, they learn to treat their body like it matters.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: You manage everything—meals, schedule, reminders, all of it.",
        "consequence": "They function… because you become the executive assistant of their life. It works short-term, but it quietly tells them they don’t have to learn self-management if someone else will do it.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them struggle a bit, then support reflection instead of rescuing.",
        "consequence": "They feel the cost of poor routines, but you stay kind. After finals, you help them look back and build a better plan for next time. The lesson becomes growth, not punishment.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_009",
    "triggerAge": 18,
    "title": "Recommendation Request at 11:58pm",
    "body": "A scholarship application requires a recommendation letter… due tomorrow. At 11:58pm, your child says, ‘I’ll just ask my teacher now.’ You watch the clock like it’s a thriller.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Help them write a respectful request—and accept that the answer might be no.",
        "consequence": "They send a short, polite message with context, gratitude, and a backup plan. It’s mature. Even if the teacher can’t do it, your child learns how to ask well—and that’s a skill they’ll use forever.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: You craft the message and push hard to make it happen.",
        "consequence": "The request goes out, but it feels like you’re driving the process. Your child gets the benefit without learning the planning that would have prevented this midnight scramble.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let the deadline slip and use the disappointment as a planning lesson.",
        "consequence": "It hurts. But later, you help them build a system: request letters weeks earlier, track deadlines, and respect other people’s time. The lesson is sharp—and because it’s real, it sticks.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  },
  {
    "id": "hw_18_010",
    "triggerAge": 18,
    "title": "Reflection Essay: ‘I Learned That I Learned’",
    "body": "Their senior portfolio requires a reflection essay. The draft currently says: ‘This year taught me many things. One thing is that I learned.’ It’s not wrong, but it’s also not… words.",
    "choices": [
      {
        "id": "coach",
        "letter": "A",
        "emoji": "🧑‍🏫",
        "text": "Coach: Help them find two specific moments and write honestly about change.",
        "consequence": "You ask for concrete examples: a hard moment, a turning point, a lesson learned. Suddenly the essay becomes real—less cringe, more human. They learn that reflection isn’t bragging; it’s meaning-making.",
        "role": "teach",
        "deltas": { "intelligence": 1 },
        "loveDelta": 3,
        "stressDelta": 1
      },
      {
        "id": "takeover",
        "letter": "B",
        "emoji": "🫣",
        "text": "Take over: Write a polished reflection for them so it sounds ‘impressive.’",
        "consequence": "It reads beautifully, but it doesn’t feel like them. They learn that sounding good matters more than being true—which is a lesson adulthood will eventually correct, loudly.",
        "role": "avoid",
        "deltas": { "discipline": -1 },
        "loveDelta": -1,
        "stressDelta": 2
      },
      {
        "id": "wingit",
        "letter": "C",
        "emoji": "🎲",
        "text": "Wing it: Let them write the awkward version and learn that authenticity is allowed.",
        "consequence": "It’s imperfect, a little clunky, and genuinely theirs. And that’s the point. They learn they don’t have to perform adulthood—they can grow into it in their own voice.",
        "role": "connect",
        "deltas": { "confidence": 1 },
        "loveDelta": 2,
        "stressDelta": 0
      }
    ]
  }
];