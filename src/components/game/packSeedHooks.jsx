import { PACK_CHOICE_TEXT_POOLS, PACK_CONSEQUENCE_POOLS } from './scenarioPackTextPools';

   export const PACK_SEED_HOOKS = [
     // =========================
     // Screen Time & Boundaries
     // =========================
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:0, maxAge:1, band:"0-2", category:"digital", topic:"Screen soothing", intensity:2,
       hookText:"It's late and {childName} only settles when a bright video plays on your phone. The moment you turn it off, the crying ramps back up. You feel the temptation to trade sleep for screens." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:1, maxAge:2, band:"0-2", category:"digital", topic:"Meal videos", intensity:2,
       hookText:"Meals have started to require a video. {childName} eats while staring, but panics when the screen pauses. You wonder if you're building a habit you'll have to undo later." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:0, maxAge:2, band:"0-2", category:"boundaries", topic:"Background TV", intensity:1,
       hookText:"The TV is on in the background most days. You notice {childName} stops playing whenever a loud jingle hits, like their body got hooked. It's not dramatic, just… persistent." },
   
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:3, maxAge:4, band:"3-5", category:"digital", topic:"Tablet tantrum", intensity:3,
       hookText:"You say screen time is over and {childName} collapses into a full-body protest. The volume is impressive. You can feel every adult nerve begging you to give in." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:4, maxAge:5, band:"3-5", category:"digital", topic:"YouTube autoplay", intensity:3,
       hookText:"A 'harmless' video turns into a strange autoplay spiral. {childName} keeps asking for 'just one more' like the phrase is automatic. You realize you've lost track of time too." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:3, maxAge:5, band:"3-5", category:"boundaries", topic:"Transition warning", intensity:2,
       hookText:"When you end screens suddenly, everything explodes. When you give warnings, it's slightly better—but you don't always have the patience to do it perfectly. You can feel a routine trying to form." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:3, maxAge:5, band:"3-5", category:"sleep", topic:"Screens at bedtime", intensity:3,
       hookText:"Bedtime has drifted later because screens keep 'helping' {childName} calm down. Now they ask for the screen as part of the sleep ritual. You're not sure if you're solving sleep or postponing it." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:3, maxAge:5, band:"3-5", category:"boundaries", topic:"Phone in public", intensity:2,
       hookText:"In public, screens are the fastest way to keep peace. {childName} now expects a phone the moment waiting begins. You notice your own relief… and your own discomfort." },
   
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:6, maxAge:7, band:"6-10", category:"digital", topic:"Game stop meltdown", intensity:3,
       hookText:"You tell {childName} to stop playing and they act like you unplugged their brain mid-sentence. The anger comes fast, then the bargaining. You can feel a power struggle trying to recruit you." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:6, maxAge:10, band:"6-10", category:"digital", topic:"Homework vs screens", intensity:3,
       hookText:"Homework is suddenly 'impossible' but screens are effortless. {childName} can focus for an hour on a game, then claims five minutes of reading is torture. You're trying not to take it personally." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:8, maxAge:10, band:"6-10", category:"peer_pressure", topic:"Friend has no limits", intensity:2,
       hookText:"{childName} says their friend gets unlimited screen time and calls your rules 'unfair.' The comparison lands hard. You can feel yourself wanting to defend your parenting like it's on trial." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:6, maxAge:10, band:"6-10", category:"privacy", topic:"Bedroom screens", intensity:3,
       hookText:"{childName} asks to use a device alone in their room. You know privacy matters, and you also know devices can swallow time in secret. Your decision will teach something either way." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:7, maxAge:10, band:"6-10", category:"digital", topic:"'Educational' loophole", intensity:2,
       hookText:"{childName} discovers a loophole: anything can be labeled 'educational.' They negotiate like a tiny lawyer, listing benefits you didn't ask for. You admire the effort… and see the trap." },
   
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:11, maxAge:12, band:"11-13", category:"digital", topic:"First phone request", intensity:3,
       hookText:"{childName} says they're the last one without a phone. They don't ask casually—they ask like it's about belonging. You can feel the weight of a decision that will echo for years." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:11, maxAge:13, band:"11-13", category:"sleep", topic:"Group chat at night", intensity:3,
       hookText:"A group chat lights up after bedtime. {childName} says it's 'important' and keeps checking notifications like they're on call. You can see tiredness building behind their eyes." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:12, maxAge:13, band:"11-13", category:"privacy", topic:"Monitoring vs trust", intensity:4,
       hookText:"You notice something on the screen that feels off, but you also know snooping can destroy trust. {childName} is watching how you handle this more than they're watching the video." },
   
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:14, maxAge:16, band:"14-18", category:"sleep", topic:"Late-night scrolling", intensity:3,
       hookText:"You wake up and see light under the door. {childName} is still scrolling, half-asleep, thumb moving on autopilot. Tomorrow is going to be harder because tonight went sideways." },
     { packId:"pack_screen_time_v1", choicePack:"screen_time", minAge:16, maxAge:18, band:"14-18", category:"boundaries", topic:"Device-free time", intensity:2,
       hookText:"You try to create a device-free window—dinner, a walk, something human. {childName} agrees… and then reaches for the phone without noticing. It's not defiance, it's habit." },
   
     // =========================
     // Sibling Rivalry
     // =========================
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:1, maxAge:2, band:"0-2", category:"aggression", topic:"Toy grabbing", intensity:2,
       hookText:"If there's another child nearby, {childName} grabs the toy like it's survival. The other child cries. {childName} looks shocked that sharing is suddenly required." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:2, maxAge:3, band:"0-2", category:"fairness", topic:"Attention split", intensity:3,
       hookText:"You give attention to another child and {childName} immediately escalates—louder, clingier, more urgent. It feels less like misbehavior and more like panic about being replaced." },
   
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:3, maxAge:4, band:"3-5", category:"fairness", topic:"'You love them more'", intensity:3,
       hookText:"{childName} says, 'You love them more,' and the sentence hits you in the chest. They're not arguing logic—they're arguing belonging. The other child watches your face." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:3, maxAge:5, band:"3-5", category:"boundaries", topic:"Rough play", intensity:3,
       hookText:"Play between kids turns rough fast. {childName} insists it was 'just a game,' but someone ends up hurt. You can feel the need for a clear line and a better script." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:4, maxAge:5, band:"3-5", category:"fairness", topic:"Sharing timer war", intensity:2,
       hookText:"You introduce a timer for taking turns. {childName} immediately becomes obsessed with the seconds, policing fairness like it's a courtroom. The idea helps… and also creates a new argument." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:3, maxAge:5, band:"3-5", category:"relationships", topic:"Repair after conflict", intensity:2,
       hookText:"After a fight, {childName} avoids the other child like the relationship is over forever. You can tell they want closeness but don't know how to return to it. This is a teachable moment if you can stay calm." },
   
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:6, maxAge:7, band:"6-10", category:"fairness", topic:"Scorekeeping", intensity:2,
       hookText:"{childName} starts keeping score: who got more, who got the better one, who got away with it. They remember details you didn't know they noticed. It's exhausting, but it's also information." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:6, maxAge:10, band:"6-10", category:"authority", topic:"Tattling spiral", intensity:2,
       hookText:"You can't take three steps without a report: 'They did it again.' {childName} wants justice; the other child wants revenge. You're becoming the referee of a sport you didn't apply for." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:8, maxAge:10, band:"6-10", category:"relationships", topic:"Different strengths", intensity:3,
       hookText:"One child is praised for something and {childName} goes quiet. Later, they act out in a way that feels unrelated. You wonder if comparison is doing more damage than the conflict itself." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:7, maxAge:10, band:"6-10", category:"boundaries", topic:"Shared space fight", intensity:3,
       hookText:"A shared room or shared space becomes a battlefield. {childName} wants control over small things—where items go, who touched what, whose mess it is. You can feel a need for structure that doesn't become harshness." },
   
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:11, maxAge:13, band:"11-13", category:"identity", topic:"'The favorite' joke", intensity:3,
       hookText:"Someone makes a 'favorite child' joke and {childName} laughs too hard. Later, they bring it up again in a sharp tone. You can tell the joke landed like a bruise." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:12, maxAge:13, band:"11-13", category:"relationships", topic:"Public embarrassment", intensity:3,
       hookText:"In front of friends, {childName} snaps at the other child with a mean edge. The other child looks humiliated. You can feel the moment turning into a family story if you don't handle it well." },
   
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:14, maxAge:16, band:"14-18", category:"privacy", topic:"Borrowing without asking", intensity:3,
       hookText:"Something goes missing and you find it in the other child's room. {childName} calls it 'stealing' and wants consequences. The other child calls it 'not a big deal.' You can feel a values lesson arriving." },
     { packId:"pack_sibling_rivalry_v1", choicePack:"siblings", minAge:16, maxAge:18, band:"14-18", category:"relationships", topic:"Unexpected loyalty", intensity:2,
       hookText:"A hard day hits {childName}, and the other child quietly shows up for them. It's not dramatic, just real. You realize rivalry and closeness can exist in the same week." },
   
     // =========================
     // School Confidence & Anxiety
     // =========================
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:3, maxAge:4, band:"3-5", category:"school", topic:"Drop-off tears", intensity:3,
       hookText:"Drop-off becomes a daily heartbreak. {childName} clings to you like the doorway is a cliff. You can feel other adults watching, but the real question is what {childName} is learning about separation." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:4, maxAge:5, band:"3-5", category:"anxiety", topic:"Bathroom fear", intensity:2,
       hookText:"{childName} avoids using the school bathroom and holds it until they're uncomfortable. They won't say much, just 'I don't like it.' You can tell it's small to adults and huge to them." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:4, maxAge:5, band:"3-5", category:"school", topic:"Teacher note home", intensity:2,
       hookText:"A teacher mentions {childName} stayed quiet all day and didn't join group time. Nothing is 'wrong,' but something is happening. You want to respond without making it bigger than it is." },
   
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:7, band:"6-10", category:"school", topic:"Reading frustration", intensity:3,
       hookText:"Reading practice ends with tears. {childName} says they're 'stupid' and refuses to try again. You can feel shame trying to take root where skill should be growing." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:10, band:"6-10", category:"peer_pressure", topic:"Friendship wobble", intensity:2,
       hookText:"A friendship shifts—someone doesn't invite {childName} to play and the rejection sticks. They act fine, but their mood drops at home. You can tell the school day came back with them." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:7, maxAge:10, band:"6-10", category:"anxiety", topic:"Morning stomachaches", intensity:3,
       hookText:"School mornings now come with stomachaches. {childName} asks to stay home with a careful voice. You want to take pain seriously without teaching avoidance as the solution." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:8, maxAge:10, band:"6-10", category:"school", topic:"Performance pressure", intensity:3,
       hookText:"A test or performance is coming and {childName} can't stop talking about messing up. They rehearse failure like it's inevitable. You can feel confidence slipping before the event even happens." },
   
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:12, band:"11-13", category:"peer_pressure", topic:"Social spotlight", intensity:3,
       hookText:"Middle-school social gravity hits hard. {childName} becomes hyper-aware of how they look, talk, and stand. You can feel confidence turning into self-monitoring." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:13, band:"11-13", category:"school", topic:"Presentation dread", intensity:4,
       hookText:"A presentation is assigned and {childName} starts avoiding schoolwork entirely. They'd rather take a bad grade than stand in front of the class. You can tell fear is driving the steering wheel." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:12, maxAge:13, band:"11-13", category:"sleep", topic:"Late-night worry", intensity:3,
       hookText:"You hear {childName} awake late, rehearsing tomorrow's problems in their head. They don't ask for help; they just… spiral quietly. You can feel an opening for support if you approach gently." },
   
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:15, band:"14-18", category:"school", topic:"Burnout signs", intensity:4,
       hookText:"{childName} is doing 'fine' on paper, but they're flat and exhausted at home. They stop enjoying things they used to like. You can feel the cost of pressure showing up in the quiet places." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:15, maxAge:18, band:"14-18", category:"future", topic:"Future panic", intensity:4,
       hookText:"A conversation about the future makes {childName} shut down. They say they're 'behind' even when they aren't. You can hear fear underneath the words, asking for steadiness." },
     { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:18, band:"14-18", category:"confidence", topic:"Small win moment", intensity:2,
       hookText:"{childName} does something brave—asks a question in class, tries out, turns in work they're unsure about. They don't brag; they just glow a little. You can choose to notice it in a way that strengthens it." },

  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:3, maxAge:4, band:"3-5", category:"school", topic:"First-day jitters", intensity:3,
    hookText:"It's the first day in a new classroom. {childName} grips their backpack straps like armor and asks the same question: 'What if no one likes me?' You feel the doorway tension before you've even parked." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:3, maxAge:4, band:"3-5", category:"school", topic:"Goodbye bargaining", intensity:3,
    hookText:"At drop-off, {childName} starts bargaining like a tiny negotiator: 'Two more hugs. One more story. Just one more minute.' The longer you stay, the shakier they get." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:3, maxAge:5, band:"3-5", category:"confidence", topic:"Circle time freeze", intensity:2,
    hookText:"The teacher says {childName} won't join circle time. They sit on the edge, quiet and stiff, watching other kids sing. At home, they insist they had 'fun,' but their body says otherwise." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:3, maxAge:5, band:"3-5", category:"anxiety", topic:"Snack-time embarrassment", intensity:2,
    hookText:"{childName} worries about snack time. They whisper that their hands get shaky opening containers and they don't want anyone to see. It sounds small, but it lives big in their head." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:3, maxAge:5, band:"3-5", category:"anxiety", topic:"Loud assembly", intensity:3,
    hookText:"A loud assembly is coming. {childName} remembers the echoing gym and covers their ears just talking about it. The fear feels sensory, immediate, and hard to logic away." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:4, maxAge:5, band:"3-5", category:"school", topic:"Show-and-tell dread", intensity:2,
    hookText:"Show-and-tell is on the calendar and {childName} panics. They can't choose an item and keeps saying, 'Everyone will look at me.' You can feel the dread building days early." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:4, maxAge:5, band:"3-5", category:"anxiety", topic:"Substitute teacher", intensity:3,
    hookText:"You hear there's a substitute teacher today. {childName} goes pale and asks if they can stay home. It's not the substitute—it's the unpredictability." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:4, maxAge:5, band:"3-5", category:"peer_pressure", topic:"Recess intimidation", intensity:3,
    hookText:"On the playground, bigger kids accidentally knock {childName} over. They aren't hurt, but they won't go back to recess. The fear isn't rational—it's embodied." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:3, maxAge:5, band:"3-5", category:"confidence", topic:"Messy art fear", intensity:2,
    hookText:"Art time requires glue, paint, and messy hands. {childName} refuses and says they 'don't want to do it wrong.' You can see perfectionism wearing preschool clothes." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:4, maxAge:5, band:"3-5", category:"anxiety", topic:"Bus/carpool worry", intensity:3,
    hookText:"The bus/carpool line feels like a moving conveyor belt away from you. {childName} clings and whispers, 'What if I can't find you later?' Your calm will matter here." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:4, maxAge:5, band:"3-5", category:"anxiety", topic:"Bathroom accident shame", intensity:4,
    hookText:"{childName} has a bathroom accident at school and comes home quiet. They won't talk about it, but they avoid school the next morning like the building is the threat." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:4, maxAge:5, band:"3-5", category:"confidence", topic:"'Too slow' morning spiral", intensity:2,
    hookText:"{childName} says they're 'too slow' getting shoes on and thinks the teacher gets annoyed. They rush, make mistakes, then feel worse. You can see anxiety turning into a morning spiral." },

  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:8, band:"6-10", category:"school", topic:"Math panic", intensity:3,
    hookText:"Math homework triggers tears. {childName} stares at the page like it's written in a foreign language, then declares, 'My brain doesn't work.' You feel panic trying to become identity." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:10, band:"6-10", category:"school", topic:"Homework procrastination", intensity:3,
    hookText:"Homework becomes a nightly standoff. {childName} procrastinates, then panics, then rushes, then hates themselves for rushing. The loop repeats like a ritual you didn't agree to." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:10, band:"6-10", category:"school", topic:"Reading aloud fear", intensity:3,
    hookText:"{childName} has to read aloud in class and they've started faking sick on reading days. They say kids laugh when someone messes up—even if it's only once." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:7, maxAge:10, band:"6-10", category:"confidence", topic:"Forgotten homework shame", intensity:2,
    hookText:"{childName} forgets an assignment at home and spirals: 'The teacher will hate me.' The mistake is small, but their shame is huge." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:7, maxAge:10, band:"6-10", category:"peer_pressure", topic:"Lunchroom loneliness", intensity:3,
    hookText:"At lunch, {childName} says there was 'no seat' for them. They act casual, but they eat less and talk less. Social stress is showing up in quiet places." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:10, band:"6-10", category:"confidence", topic:"Picked last", intensity:3,
    hookText:"During PE, {childName} gets picked last for teams again. They shrug it off in the moment, then crash at home like they were holding their breath all day." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:9, band:"6-10", category:"anxiety", topic:"Spelling test dread", intensity:2,
    hookText:"A spelling test is coming and {childName} is obsessively rehearsing. They want to quit before they begin. You can feel a fear of being seen as 'not smart.'"},
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:7, maxAge:10, band:"6-10", category:"anxiety", topic:"Perfectionism eraser holes", intensity:3,
    hookText:"You find a worksheet with eraser holes and ripped corners. {childName} re-did the same problem over and over trying to make it 'perfect.' Their anxiety is literally wearing through paper." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:8, maxAge:10, band:"6-10", category:"peer_pressure", topic:"Group project stress", intensity:3,
    hookText:"A group project turns into social chess. {childName} worries they'll be judged for being 'bossy' or 'lazy' and can't sleep the night before. It's not just schoolwork—it's belonging." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:8, maxAge:10, band:"6-10", category:"peer_pressure", topic:"Teasing comment", intensity:4,
    hookText:"Another kid makes a teasing comment about {childName}'s clothes/voice/answer. It's one sentence, but it echoes. You can see confidence wobble in real time." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:10, band:"6-10", category:"authority", topic:"Teacher conflict", intensity:3,
    hookText:"You get a note: {childName} is 'disruptive' or 'not listening.' At home, they insist they were trying. You can feel a misunderstanding that could become a story about who they are." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:10, band:"6-10", category:"anxiety", topic:"Field trip nerves", intensity:2,
    hookText:"A field trip is coming and {childName} worries about bathrooms, buses, and getting lost. They ask logistical questions like they're trying to control the future." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:7, maxAge:10, band:"6-10", category:"sleep", topic:"Sunday night dread", intensity:3,
    hookText:"Sunday night becomes a storm: stomachaches, tears, and 'I can't go tomorrow.' The week hasn't even started, and their body is already bracing." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:8, maxAge:10, band:"6-10", category:"school", topic:"Timed tests", intensity:3,
    hookText:"Timed tests make {childName} freeze. They know the answers at home, then blank in the classroom. They start saying, 'I'm bad at tests' like it's permanent." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:6, maxAge:10, band:"6-10", category:"confidence", topic:"Learning difference worry", intensity:3,
    hookText:"{childName} says, 'Everyone else gets it faster.' They watch other kids finish and assume speed equals worth. You can hear comparison turning into anxiety." },

  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:12, band:"11-13", category:"school", topic:"Locker chaos", intensity:3,
    hookText:"Locker combinations turn into a daily crisis. {childName} is late to class and feels humiliated, even if no one notices. They start dreading school for something as small as a lock." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:13, band:"11-13", category:"anxiety", topic:"Changing classes", intensity:3,
    hookText:"Switching classes means new teachers, new rules, new social micro-cultures. {childName} keeps forgetting materials and calling themselves 'a mess.' Anxiety loves the chaos of transitions." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:13, band:"11-13", category:"peer_pressure", topic:"Cafeteria seat politics", intensity:4,
    hookText:"Lunch seating feels like social survival. {childName} worries about where to sit and who will interpret it as rejection. It's exhausting to watch them carry that weight." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:13, band:"11-13", category:"peer_pressure", topic:"Group chat drama", intensity:4,
    hookText:"A group chat blows up and {childName} is glued to the phone, anxious about every notification. They're trying to act unbothered, but their nervous system is loud." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:13, band:"11-13", category:"confidence", topic:"Tryout nerves", intensity:3,
    hookText:"Tryouts for a team/club are coming. {childName} wants it badly, which makes it terrifying. They consider quitting before they even step on the field." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:13, band:"11-13", category:"identity", topic:"Gym class embarrassment", intensity:3,
    hookText:"Gym class becomes a hotspot for self-consciousness. {childName} worries about changing, sweating, being watched. Their body feels like it's on display." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:12, maxAge:13, band:"11-13", category:"school", topic:"Missing assignment panic", intensity:3,
    hookText:"The online gradebook shows a missing assignment and {childName} spirals like the future is ruined. They can't focus on anything else until it's fixed." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:13, band:"11-13", category:"authority", topic:"Strict teacher shame", intensity:3,
    hookText:"A strict teacher calls {childName} out in front of the class. Even if it was mild, it lands as public shame. They replay the moment all evening." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:12, maxAge:13, band:"11-13", category:"peer_pressure", topic:"Rumor ripple", intensity:4,
    hookText:"{childName} hears a rumor about themselves—or worries one is starting. They ask, 'Do people think I'm weird?' You can hear fear of social death." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:11, maxAge:13, band:"11-13", category:"confidence", topic:"Participation grade pressure", intensity:3,
    hookText:"Participation grades appear, and {childName} freezes. They have ideas, but speaking up feels like stepping into a spotlight. Confidence becomes performance." },

  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:18, band:"14-18", category:"school", topic:"AP overload", intensity:4,
    hookText:"{childName} stacks challenging classes and looks 'fine' on paper, but their eyes are tired. They keep saying they can't drop anything without failing at life." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:15, maxAge:18, band:"14-18", category:"school", topic:"SAT/ACT anxiety", intensity:4,
    hookText:"Test prep becomes a constant hum. {childName} ties their worth to a score and starts catastrophizing every practice test. You can feel the pressure narrowing their world." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:15, maxAge:18, band:"14-18", category:"future", topic:"College essay freeze", intensity:4,
    hookText:"College essays start and {childName} stares at a blank document for hours. They say, 'Nothing about me is interesting.' It's not writing—it's identity fear." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:18, band:"14-18", category:"confidence", topic:"Comparison spiral", intensity:3,
    hookText:"{childName} scrolls classmates' achievements and quietly spirals: internships, awards, perfect grades. They say they're 'behind' even when they're not." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:18, band:"14-18", category:"sleep", topic:"Perfectionism insomnia", intensity:4,
    hookText:"At night, {childName} replays mistakes and imagines future failures. Sleep becomes impossible. Anxiety moves in after the lights go out." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:15, maxAge:18, band:"14-18", category:"peer_pressure", topic:"Group project freeloaders", intensity:3,
    hookText:"A group project becomes unfair. {childName} carries the work because they can't tolerate being seen as the one who 'ruined it.' Resentment and pressure mix." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:18, band:"14-18", category:"anxiety", topic:"Skip day temptation", intensity:4,
    hookText:"{childName} wants to stay home on a day with a test, presentation, or tryout. They aren't being lazy—they're avoiding dread so intense it feels physical." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:16, maxAge:18, band:"14-18", category:"future", topic:"Interview nerves", intensity:3,
    hookText:"An interview (job, scholarship, program) is scheduled. {childName} practices answers, then panics they'll freeze. They want to cancel and disappear." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:18, band:"14-18", category:"school", topic:"'Potential' comment sting", intensity:3,
    hookText:"A teacher says {childName} 'isn't reaching their potential.' It's meant as motivation, but it lands as shame. They hear: 'You're disappointing.'" },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:16, maxAge:18, band:"14-18", category:"future", topic:"Rejection letter", intensity:4,
    hookText:"{childName} gets a rejection (school, team, job) and acts numb. Later, they say, 'Why do I even try?' Their confidence takes a real hit." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:15, maxAge:18, band:"14-18", category:"school", topic:"Leadership pressure", intensity:3,
    hookText:"{childName} becomes captain/president/leader and suddenly feels responsible for everyone's happiness. They can't relax because they think they're always failing someone." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:18, band:"14-18", category:"confidence", topic:"Public mistake replay", intensity:4,
    hookText:"{childName} makes a public mistake—stumbles in a presentation, misses a shot, says something awkward. It becomes a mental highlight reel they can't stop replaying." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:14, maxAge:18, band:"14-18", category:"values", topic:"Cheating pressure", intensity:4,
    hookText:"Friends share answers or suggest cheating 'because everyone does.' {childName} feels torn between ethics, fear, and performance pressure. Anxiety becomes a values test." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:15, maxAge:18, band:"14-18", category:"future", topic:"Scholarship deadline panic", intensity:4,
    hookText:"Deadlines stack up—forms, fees, recommendations. {childName} freezes and then panics late at night. It's not time management; it's overwhelm." },
  { packId:"pack_school_confidence_v1", choicePack:"school_anxiety", minAge:15, maxAge:18, band:"14-18", category:"future", topic:"Graduation future void", intensity:4,
    hookText:"As graduation gets closer, {childName} swings between over-planning and total numbness. They say, 'What if I pick wrong and ruin my life?'" },

     // =========================
     // Teen Autonomy
     // =========================
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:11, maxAge:12, band:"11-13", category:"privacy", topic:"Closed door request", intensity:2,
       hookText:"{childName} starts asking for more privacy: closed doors, fewer questions, less checking. The request is calm, but the shift is big. You can feel your role changing under your feet." },
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:11, maxAge:13, band:"11-13", category:"authority", topic:"'Because I said so' backfire", intensity:3,
       hookText:"You give a rule and {childName} immediately asks 'why' in a tone that dares you to be unreasonable. They're not just resisting the rule; they're testing whether you can lead without force." },
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:12, maxAge:13, band:"11-13", category:"values", topic:"New identity experiments", intensity:2,
       hookText:"{childName} tries on a new identity—style, hobbies, opinions—and watches your reaction like it's a verdict. It's not dangerous, just unfamiliar. You can feel your own discomfort asking to be handled well." },
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:12, maxAge:13, band:"11-13", category:"relationships", topic:"Friend group shift", intensity:3,
       hookText:"{childName} starts spending time with a new crowd. They say it's 'no big deal,' but their tone is guarded. You want connection without interrogation." },
   
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:14, maxAge:15, band:"14-18", category:"authority", topic:"Curfew negotiation", intensity:3,
       hookText:"Curfew becomes a negotiation, not a rule. {childName} offers reasons, comparisons, and 'everyone else' like evidence. You can feel an opportunity to create an agreement instead of a war." },
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:14, maxAge:15, band:"14-18", category:"risk", topic:"Party invitation", intensity:4,
       hookText:"{childName} gets invited somewhere you can't fully control. They want independence; you want safety. The way you handle this can teach secrecy or trust." },
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:14, maxAge:16, band:"14-18", category:"responsibility", topic:"Chores vs freedom", intensity:2,
       hookText:"{childName} wants more freedom but avoids responsibilities at home. They insist the two aren't related. You can feel a lesson about adulthood forming right here in the dishes." },
   
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:16, maxAge:18, band:"14-18", category:"work", topic:"First job tension", intensity:3,
       hookText:"{childName} considers a job for money and independence. They like the idea until schedules and expectations show up. You can support growth without turning it into pressure." },
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:16, maxAge:18, band:"14-18", category:"future", topic:"Life plan conflict", intensity:4,
       hookText:"You imagine one future for {childName} and they imagine another. The disagreement isn't loud; it's emotional. You can feel values and identity trying to separate cleanly without breaking love." },
     { packId:"pack_teen_autonomy_v1", choicePack:"teen_autonomy", minAge:16, maxAge:18, band:"14-18", category:"privacy", topic:"Trust check moment", intensity:4,
       hookText:"You learn something about {childName} secondhand before they tell you. It's not catastrophic, but it matters. Your next move can invite honesty… or teach them to hide better." },
   
     // =========================
     // Co-Parenting (Same Roof vs Two Homes)
     // householdType === 'two'  -> coparent_together
     // householdType === 'single' -> coparent_separated
     // =========================

     // ---- Same-roof / partnered co-parenting (coparent_together) ----

     // 0–2
     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:0, maxAge:2, band:"0-2", category:"sleep", topic:"2 a.m. Siren Treaty", intensity:3,
       hookText:"📱 Couple Chat — {partnerName}\n{partnerName}: “If we pick up {childName} every time, {childName} will never sleep.”\nYou: “If we don’t, *I* will never sleep.”\n{childName}: “AAAAAAAA.” (wins the debate by volume)" },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:0, maxAge:2, band:"0-2", category:"logistics", topic:"Diaper Brand Cold War", intensity:2,
       hookText:"Two diaper brands sit on the changing table like rival flags. {partnerName} swears Brand A prevents blowouts. You swear Brand B isn’t ‘scratchy.’ {childName} responds by producing a blowout worthy of a museum exhibit." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:0, maxAge:2, band:"0-2", category:"money", topic:"The $300 Baby Gadget Incident", intensity:2,
       hookText:"📦 A huge box arrives. {partnerName} says: “It was on sale.” The receipt says otherwise. {childName} is peacefully asleep… on you… like a tiny hostage negotiator keeping you from standing up." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:0, maxAge:2, band:"0-2", category:"privacy", topic:"Photo Posted Without Consent", intensity:3,
       hookText:"📱 Family Group Chat\n{partnerName}: “I posted the cutest pic of {childName}!”\nYou: “Did we agree on posting {childName}?”\nA relative reacts with 27 heart emojis. You feel your privacy alarm go off while everyone else throws confetti." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:1, maxAge:2, band:"0-2", category:"health", topic:"High Chair Philosophy Fight", intensity:3,
       hookText:"At the high chair, {partnerName} wants to introduce new foods fast. You want to go slower after a scary gag. {childName} flings puree like confetti, then smiles like: “Welcome to my TED Talk.”" },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:0, maxAge:2, band:"0-2", category:"boundaries", topic:"Surprise ‘Helpful’ Visitors", intensity:3,
       hookText:"📱 Couple Chat — {partnerName}\n{partnerName}: “My parents are coming tomorrow to help with {childName}.”\nYou: “Tomorrow… as in… tomorrow tomorrow?”\n{childName} chooses this moment to start crying like they heard the news too." },

     // 3–5
     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:3, maxAge:5, band:"3-5", category:"boundaries", topic:"Cookie Supreme Court", intensity:3,
       hookText:"You tell {childName}: “Cookie after dinner.” Two minutes later, {childName} asks {partnerName} and gets a yes. {childName} walks past holding the cookie like a trophy. Your parenting government has been appealed—and overturned." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:3, maxAge:5, band:"3-5", category:"public", topic:"Aisle 7 Tantrum Summit", intensity:3,
       hookText:"In the grocery store, {childName} melts down over cereal. You want to reset and leave. {partnerName} wants to ‘hold the line’ in aisle 7. Strangers pretend not to watch while absolutely watching. {childName} escalates like they’re paid per decibel." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:3, maxAge:5, band:"3-5", category:"development", topic:"Potty Chart Becomes Currency", intensity:3,
       hookText:"You make a potty sticker chart. {partnerName} adds rewards. Now {childName} demands candy for blinking. Potty training has become a tiny economy and the adults forgot to set tax policy." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:3, maxAge:5, band:"3-5", category:"sleep", topic:"Bedtime Book Inflation", intensity:2,
       hookText:"Bedtime starts with one book. Then {partnerName} adds a second because {childName} “looks so cute listening.” Then {childName} requests a third, fourth, and fifth. You stare at the clock like it owes you money. {childName} is now running a bedtime subscription service." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:4, maxAge:5, band:"3-5", category:"boundaries", topic:"Treats for Compliance Debate", intensity:2,
       hookText:"📱 Couple Chat — {partnerName}\n{partnerName}: “I offered a treat so {childName} would put shoes on.”\nYou: “Now {childName} will demand treats for socks.”\n{childName} appears holding one shoe like: “I’m listening.”" },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:3, maxAge:5, band:"3-5", category:"school", topic:"Teacher Note Spiral", intensity:2,
       hookText:"A preschool note arrives: “{childName} hit during circle time.” {partnerName} drafts a midnight email like it’s a legal brief. You want a calm chat with the teacher. {childName} is asleep, and the adults are quietly speedrunning panic in different directions." },

     // 6–10
     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:6, maxAge:10, band:"6-10", category:"social", topic:"The PTA Chat Volunteered You", intensity:2,
       hookText:"📱 Parent Group Chat\nSomeone writes: “We still need 12 juice boxes.” {partnerName} volunteers you for cupcakes without asking. {childName} overhears and says, “Cupcakes means you love me the MOST.” You realize you’re now emotionally hostage to baked goods." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:6, maxAge:10, band:"6-10", category:"school", topic:"Homework Help War", intensity:3,
       hookText:"Homework happens. {partnerName} becomes a tutor. You try to build independence. {childName} ping‑pongs between “HELP ME” and “STOP HELPING ME” like a tiny pinball machine. The adults disagree on whether struggle is learning or suffering." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:6, maxAge:10, band:"6-10", category:"money", topic:"Allowance Negotiations", intensity:2,
       hookText:"{childName} wants an allowance. {partnerName} loves “pay for chores.” You think chores are community, not employment. {childName} immediately proposes overtime pay and asks about a 401(k). You didn’t know {childName} could say “benefits.”" },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:7, maxAge:10, band:"6-10", category:"digital", topic:"Gaming Treaty Breach", intensity:3,
       hookText:"You agree on a gaming limit. Then {partnerName} says yes to “just one more level” while you’re making dinner. {childName} learns: rules can be appealed to the Supreme Court of Tired Adults. Guess who sits on that court." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:6, maxAge:10, band:"6-10", category:"logistics", topic:"Calendar Overbooking", intensity:2,
       hookText:"📅 Calendar Alert\n{partnerName} added: soccer + piano + coding club + birthday party… all this weekend. {childName} is thrilled. You are doing travel math like a stressed airline pilot. {childName} asks: “Are we rich in time?” (No.)" },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:8, maxAge:10, band:"6-10", category:"social", topic:"Sleepover Verdict", intensity:3,
       hookText:"{childName} wants a sleepover. {partnerName} says yes instantly. You ask about supervision, allergies, and emergency plans. {childName} watches both of you like a jury waiting for closing arguments." },

     // 11–13
     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:11, maxAge:13, band:"11-13", category:"digital", topic:"Phone Pitch Deck", intensity:4,
       hookText:"{childName} presents a phone proposal with bullet points, ‘pros/cons,’ and a repayment plan. {partnerName} is impressed. You are suspicious. {childName} has charts. You are now trapped in a meeting you did not schedule." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:11, maxAge:13, band:"11-13", category:"privacy", topic:"The Screen Glimpse", intensity:4,
       hookText:"You glimpse something on {childName}’s screen that makes your stomach drop. {partnerName} wants to check everything. You want to ask directly and preserve trust. {childName} watches your face like it’s a lie detector test." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:11, maxAge:13, band:"11-13", category:"peer_pressure", topic:"Group Chat Explosion", intensity:3,
       hookText:"📱 {childName}’s phone buzzes nonstop. There’s group chat drama and someone is screenshotting everything like it’s a documentary. {partnerName} wants to message other parents. You want to coach {childName} first so they don’t feel publicly dissected." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:11, maxAge:13, band:"11-13", category:"identity", topic:"Style Shock", intensity:2,
       hookText:"{childName} reveals a bold new look. {partnerName} says: “Love it.” You feel a tiny panic about judgment and safety. {childName} pretends not to care what you think while caring *a lot* what you think." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:12, maxAge:13, band:"11-13", category:"values", topic:"Puberty Talk Hot Potato", intensity:2,
       hookText:"Puberty questions arrive at the worst possible time—trapped in the car. {partnerName} looks at you like “tag, you’re it.” {childName} stares out the window like they definitely aren’t listening (they are listening)." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:11, maxAge:13, band:"11-13", category:"authority", topic:"Loophole Olympics", intensity:4,
       hookText:"{childName} says: “{partnerName} already said yes.” Two minutes later: “You already said yes.” You compare notes and realize {childName} has been running a multi‑adult loophole strategy. The tiny mastermind awaits your response." },

     // 14–18
     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:14, maxAge:18, band:"14-18", category:"authority", topic:"Curfew Courtroom", intensity:4,
       hookText:"At the kitchen table, {childName} argues for a later curfew like a lawyer with a dream. {partnerName} starts negotiating. You start listing safety concerns. {childName} watches the adults disagree and quietly files it away for next time." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:14, maxAge:18, band:"14-18", category:"responsibility", topic:"Driving Panic Spreadsheet", intensity:4,
       hookText:"Driving privileges are on the table. You want strict rules. {partnerName} says strict rules create secret rules. {childName} holds the keys like a sacred artifact and says, “I’m literally responsible.” The adults laugh nervously because… yikes." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:14, maxAge:18, band:"14-18", category:"relationships", topic:"Dating Boundaries Clash", intensity:3,
       hookText:"{childName} starts dating. {partnerName} wants to be the chill parent. You want clear boundaries and safety talks. {childName} watches which adult is safer to tell the truth to—and chooses accordingly." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:15, maxAge:18, band:"14-18", category:"risk", topic:"Party + Safety Plan Debate", intensity:4,
       hookText:"A party invite appears. You want a no‑shame pickup rule for {childName}. {partnerName} wants zero tolerance. {childName} hears both and decides whether honesty is safe… or expensive." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:15, maxAge:18, band:"14-18", category:"work", topic:"Job vs Grades Tug‑of‑War", intensity:3,
       hookText:"{childName} wants a job for money and independence. {partnerName} loves the responsibility angle. You worry about sleep and school. {childName} says, “I can do both,” with the confidence of someone who has never worked a closing shift." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_together", householdTypes:["two"], minAge:16, maxAge:18, band:"14-18", category:"future", topic:"Launch Plan Collision", intensity:4,
       hookText:"College forms, gap‑year dreams, and big feelings pile up. {partnerName} pushes one path. You push another. {childName} goes quiet—either thinking or withdrawing. Either way, {childName} is reading the room like a weather forecast." },

     // ---- Two-home / separated co-parenting (coparent_separated) ----

     // 0–2
     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:0, maxAge:2, band:"0-2", category:"logistics", topic:"Handoff: 15 Minutes Becomes 40", intensity:3,
       hookText:"📱 Co‑Parent Chat — {coparentName}\n{coparentName}: “Running 15 min late for {childName}.”\nFifteen becomes forty. {childName} is crying in the car seat and the parking lot is becoming a stage. Your thumbs are drafting a spicy text all by themselves." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:0, maxAge:2, band:"0-2", category:"logistics", topic:"Diaper Bag Court Case", intensity:2,
       hookText:"You open {childName}’s bag: three wipes, no extra clothes, and one mysterious sock. 📱 {coparentName}: “It was full when I gave it.” You are now in a courtroom drama where Exhibit A is a single sock." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:0, maxAge:2, band:"0-2", category:"sleep", topic:"Routine Whiplash", intensity:3,
       hookText:"{childName} returns overtired and wired. 📱 {coparentName}: “{childName} slept great for me!” Your night becomes a marathon. You need to talk routines without sounding like you’re grading someone’s parenting." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:0, maxAge:2, band:"0-2", category:"health", topic:"Medication Note Panic", intensity:3,
       hookText:"You find {childName}’s medicine bottle with a sticky note: “Gave a little extra, {childName} seemed fussy.” Your stomach drops. You need clarity without starting a war. {childName} babbles happily, unaware adults are spiraling." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:1, maxAge:2, band:"0-2", category:"school", topic:"Daycare Decision Doom Timer", intensity:3,
       hookText:"A daycare decision needs a yes today. 📱 {coparentName}: “That one is too expensive for {childName}.” You want stability and quality. They want cheaper and fast. The clock ticks like it’s judging both of you." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:0, maxAge:2, band:"0-2", category:"relationships", topic:"New Partner Comes With Opinions", intensity:3,
       hookText:"At handoff, {coparentName} arrives with a new partner who says: “We’ve got a system for {childName}’s naps.” You didn’t ask. {childName} watches adult faces like it’s a weather report: safe day or storm day?" },

     // 3–5
     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:3, maxAge:5, band:"3-5", category:"relationships", topic:"Handoff Cling + Blame", intensity:3,
       hookText:"{childName} refuses to let go of your leg at handoff. 📱 {coparentName}: “You’re making this harder by being emotional.” {childName} hears it and tightens their grip. You can defend yourself… or protect {childName}’s nervous system first." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:3, maxAge:5, band:"3-5", category:"logistics", topic:"Stuffed Animal Hostage Situation", intensity:2,
       hookText:"🧸 Emergency: {childName}’s stuffed animal is at the other house. {childName} is sobbing like the world ended. 📱 {coparentName}: “{childName} will be fine.” Your brain hears: “I don’t respect the thing {childName} loves.”" },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:3, maxAge:5, band:"3-5", category:"digital", topic:"Two‑House Screen Rule Showdown", intensity:2,
       hookText:"{childName} announces: “At {coparentName}’s house I get unlimited tablet.” Then looks at you like you’re about to fold. This isn’t about screens. It’s about whether adults can agree on reality." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:3, maxAge:5, band:"3-5", category:"development", topic:"Potty Training Whiplash", intensity:3,
       hookText:"Potty training is going well… until {childName} comes back in pull-ups again. 📱 {coparentName}: “Accidents are gross.” {childName} goes quiet. You want consistency and zero shame, but you also need diplomacy." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:4, maxAge:5, band:"3-5", category:"authority", topic:"Messenger Kid Trap", intensity:4,
       hookText:"{childName} arrives repeating: “{coparentName} said I HAVE to…” like it’s a royal decree. You can argue through {childName} (trap) or communicate adult‑to‑adult (hard, but clean). {childName} watches which path you choose." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:4, maxAge:5, band:"3-5", category:"social", topic:"Birthday Peace Summit", intensity:2,
       hookText:"🎂 Birthday planning begins. You want one party so {childName} feels whole. {coparentName} wants separate parties ‘to avoid drama.’ {childName} just wants balloons and cake, not diplomacy." },

     // 6–10
     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:6, maxAge:10, band:"6-10", category:"school", topic:"Homework Didn’t Teleport", intensity:3,
       hookText:"{childName} says homework was done at the other house. The folder says otherwise. 📱 {coparentName}: “Not my problem, it’s your week.” {childName} is stressed in the middle while adults compete for ‘least responsible.’" },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:6, maxAge:10, band:"6-10", category:"logistics", topic:"Missing Supplies: The Sequel", intensity:2,
       hookText:"The backpack arrives missing the library book… again. Now there’s a fine and a teacher email. 📱 {coparentName}: “Buy a second copy for {childName}.” You’re trying not to scream-laugh at the idea of ‘duplicate childhood.’" },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:6, maxAge:10, band:"6-10", category:"logistics", topic:"Practice Transportation Standoff", intensity:3,
       hookText:"Practice lands on {coparentName}’s time. 📱 {coparentName}: “Can’t drive {childName}.” {childName} begs you to fix it like you control the universe. Your schedule starts to look like a sacrifice." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:7, maxAge:10, band:"6-10", category:"communication", topic:"One Word Starts a War", intensity:2,
       hookText:"You text: “Can you send {childName}’s jacket back?” They reply: “K.” Your brain reads disrespect. Their brain reads criticism. Congratulations: you are now in a tone fight about outerwear." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:8, maxAge:10, band:"6-10", category:"relationships", topic:"New Partner Discipline Complaint", intensity:3,
       hookText:"{childName} says the new partner at the other house yelled and took their tablet. {childName} looks scared and angry at once. You want to protect {childName} without torching the entire co‑parenting system." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:7, maxAge:10, band:"6-10", category:"health", topic:"Braces Debate", intensity:3,
       hookText:"The dentist recommends braces for {childName}. 📱 {coparentName}: “That’s unnecessary.” You want what’s best for {childName}. They want “not expensive.” Now you’re negotiating healthcare with someone who thinks you’re being dramatic." },

     // 11–13
     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:11, maxAge:13, band:"11-13", category:"digital", topic:"Screenshot Evidence War", intensity:4,
       hookText:"{childName} shows you a screenshot: “{coparentName} said I can have TikTok.” Then shows {coparentName} a screenshot: “You said no limits.” {childName} is running a two‑house policy hack and screenshots are the currency." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:11, maxAge:13, band:"11-13", category:"privacy", topic:"Safety vs ‘Control’ Accusation", intensity:4,
       hookText:"You suggest basic online safety monitoring for {childName}. 📱 {coparentName}: “Stop being controlling.” {childName} is eavesdropping, learning whether safety talks come with adult warfare." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:11, maxAge:13, band:"11-13", category:"authority", topic:"The Yes‑Triangle", intensity:4,
       hookText:"{childName} claims you already agreed to something big. You check with {coparentName} and they say you agreed too. You both realize {childName} is running a yes‑triangle strategy. Now you need unity without humiliating {childName}." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:12, maxAge:13, band:"11-13", category:"authority", topic:"Step‑Parent ‘My House, My Rules’", intensity:3,
       hookText:"{childName} comes home furious: the step‑parent took their phone and said, “my house, my rules.” {coparentName} says it’s fine. {childName} looks small for a second, then hard again. You need boundaries without gasoline." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:11, maxAge:13, band:"11-13", category:"logistics", topic:"Friend Plans vs Schedule Chess", intensity:2,
       hookText:"A friend hangout lands on {coparentName}’s weekend. {childName} begs you to ask for a swap. 📱 {coparentName}: “We already have plans for {childName}.” {childName} blames you for not being persuasive enough. Co‑parenting becomes scheduling chess." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:12, maxAge:13, band:"11-13", category:"values", topic:"Puberty Supplies Across Homes", intensity:2,
       hookText:"Puberty logistics show up: deodorant, body talk, supplies. {childName} wants everything to be invisible. 📱 {coparentName}: “You handle that stuff for {childName}.” Kids feel alone fast when adults avoid awkward teamwork." },

     // 14–18
     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:14, maxAge:18, band:"14-18", category:"authority", topic:"Curfew Loophole Olympics", intensity:4,
       hookText:"Curfew is 10 at your house and midnight at {coparentName}’s. {childName} starts scheduling life around whichever rule is softer. 📱 {coparentName}: “{childName} is basically an adult.” {childName} smiles like they just found an unlimited coupon." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:15, maxAge:18, band:"14-18", category:"responsibility", topic:"Tickets, Insurance, Blame", intensity:4,
       hookText:"A driving ticket happens. {childName} is shaken. {coparentName} says it’s your fault for being too strict/too lenient (choose your flavor). Now you’re debating consequences and safety while {childName} watches adults argue like it’s a sport." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:15, maxAge:18, band:"14-18", category:"relationships", topic:"{childName} Chooses a House", intensity:4,
       hookText:"{childName} asks to stay more at one home. You feel pain you refuse to put on {childName}. 📱 {coparentName}: “{childName} chooses because you’re too strict.” This can become competition… or an adult conversation that protects {childName}." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:16, maxAge:18, band:"14-18", category:"future", topic:"College Money Stalemate", intensity:4,
       hookText:"College planning requires forms, numbers, and cooperation. 📱 {coparentName}: “I’m not paying for that for {childName}.” {childName} acts like they don’t care, but their shoulders say otherwise. The future is being negotiated in passive‑aggressive texts." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:17, maxAge:18, band:"14-18", category:"social", topic:"Graduation Photo Politics", intensity:3,
       hookText:"Graduation is coming. {coparentName} wants the new partner in the main family photos. You want {childName} to feel celebrated, not split. The seating chart starts to look like a peace treaty and {childName} just wants a normal day." },

     { packId:"pack_coparenting_v1", choicePack:"coparent_separated", householdTypes:["single"], minAge:14, maxAge:18, band:"14-18", category:"relationships", topic:"Dating Rules Mismatch", intensity:3,
       hookText:"Dating gets serious. You want safety talks and boundaries for {childName}. {coparentName} calls you dramatic and allows sleepovers. {childName} learns: if one adult says no, there’s always another adult to ask. You need alignment before trust becomes a loophole." },
   
     // =========================
     // Modern Parenting (Devices, Social, AI)
     // =========================
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting_early", minAge:0, maxAge:1, band:"0-2", category:"privacy", topic:"Sharenting pressure", intensity:2,
       hookText:"A relative asks you to post baby photos so 'everyone can see.' {childName} can’t consent, but the internet will remember anyway. You can feel pride, connection, and privacy pulling in different directions." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting_early", minAge:0, maxAge:1, band:"0-2", category:"privacy", topic:"Wi‑Fi baby monitor", intensity:3,
       hookText:"You set up a Wi‑Fi baby monitor. It brings relief—until you hear about hacked cameras. A safety tool suddenly feels like a door you forgot to lock." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting_early", minAge:0, maxAge:1, band:"0-2", category:"digital", topic:"Phone glow at 2 a.m.", intensity:2,
       hookText:"It’s late. You’re rocking {childName}, and your other hand keeps drifting to your phone. The glow feels like company… and also like a habit forming in the quiet." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting_early", minAge:1, maxAge:2, band:"0-2", category:"relationships", topic:"Video calls as connection", intensity:2,
       hookText:"Grandparents want to video call constantly. {childName} lights up hearing their voices—then starts grabbing for the screen like it’s a toy. You can feel the difference between connection and passive screen time." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting_early", minAge:1, maxAge:2, band:"0-2", category:"digital", topic:"AI lullaby experiment", intensity:2,
       hookText:"Someone suggests an AI-generated lullaby. You try it, and it weirdly works—{childName} calms down. Part of you is impressed; part of you worries about outsourcing comfort." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting_early", minAge:2, maxAge:3, band:"3-5", category:"boundaries", topic:"Autoplay tantrum", intensity:3,
       hookText:"One short video turns into many. When you say 'all done,' {childName} melts down like a storm. You can feel your patience getting tested by an algorithm." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting_early", minAge:3, maxAge:5, band:"3-5", category:"boundaries", topic:"Tablet at restaurants", intensity:3,
       hookText:"You’re out, everyone is tired, and a tablet would buy instant peace. {childName} asks for it with practiced confidence. You can feel your future self watching: 'What habit are we building?'" },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting_early", minAge:3, maxAge:5, band:"3-5", category:"values", topic:"Smart speaker manners", intensity:2,
       hookText:"{childName} discovers the smart speaker responds instantly. They start barking commands at it—and then at people. It’s funny… until you realize it’s teaching a tone you don’t want at home." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:6, maxAge:8, band:"6-10", category:"digital", topic:"Influencer envy", intensity:2,
       hookText:"{childName} watches someone online living a life that looks perfect. Afterward, their mood drops and they complain about what they don't have. You can feel comparison quietly rewiring gratitude." },
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:7, maxAge:10, band:"6-10", category:"privacy", topic:"Family posting consent", intensity:2,
       hookText:"You want to post a cute photo of {childName}. They hesitate and say, 'Don't.' It's a small moment, but it's also a lesson about consent and digital footprint." },
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:8, maxAge:10, band:"6-10", category:"digital", topic:"Algorithm rabbit hole", intensity:3,
       hookText:"You notice {childName} getting pulled into endless short clips. They're not even laughing anymore—they're just scrolling. You can feel attention becoming a resource that's being spent without meaning." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:11, maxAge:13, band:"11-13", category:"peer_pressure", topic:"Screenshot drama", intensity:4,
       hookText:"A private message gets screenshot and passed around. {childName} is upset but tries to act unfazed. You can feel the modern lesson: privacy is fragile when other people control the evidence." },
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:11, maxAge:13, band:"11-13", category:"identity", topic:"Online persona shift", intensity:3,
       hookText:"{childName} starts presenting themselves differently online than at home. It's not 'bad,' just curated. You can feel identity experimenting in public where mistakes stick." },
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:12, maxAge:13, band:"11-13", category:"privacy", topic:"Inappropriate message (vague)", intensity:4,
       hookText:"{childName} gets a message that makes them uncomfortable. They don't want to show you, but they also look rattled. Your response can teach them to come to you sooner next time." },
   
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:14, maxAge:18, band:"14-18", category:"school", topic:"AI homework temptation", intensity:4,
       hookText:"A tool can generate an assignment in seconds, and {childName} knows it. They argue it's 'just efficient,' not cheating. You can feel a values conversation arriving with real-world consequences." },
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:14, maxAge:18, band:"14-18", category:"risk", topic:"Voice-clone scam scare", intensity:3,
       hookText:"You hear about voice-clone scams and realize how convincing they can be. It's not panic-worthy, but it is modern reality. You can choose to create a calm family protocol instead of fear." },
     { packId:"pack_modern_parenting_v1", choicePack:"modern_parenting", minAge:15, maxAge:18, band:"14-18", category:"identity", topic:"Reputation anxiety", intensity:4,
       hookText:"{childName} worries that one mistake will live forever online. They're not dramatic—they're realistic. You can feel the need for a safety plan and a self-worth anchor that isn't dependent on the internet." }
   ];