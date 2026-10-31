// Scenario bank for Emotion Match mini‑game
// Keep scenarios short, relevant to parenting / school / family / relationships.

/**
 * @typedef {Object} EmotionScenario
 * @property {string} id
 * @property {string} text
 * @property {string} correctEmotion
 * @property {string} explanation
 */

/** @type {EmotionScenario[]} */
const EMOTION_MATCH_SCENARIOS = [
  { id: 's1', text: "Your child freezes at the doorway on the first day of a new school.", correctEmotion: 'Anxiety', explanation: 'It’s worry about what might happen, not immediate danger.' },
  { id: 's2', text: "A teen slams their door after their younger sibling borrowed clothes without asking.", correctEmotion: 'Anger', explanation: 'A boundary was crossed, triggering anger.' },
  { id: 's3', text: "You find your kid quietly staring at a trophy they earned last week, smiling a little.", correctEmotion: 'Pride', explanation: 'They feel proud of something they achieved.' },
  { id: 's4', text: "A preschooler bursts into giggles when you show up with their favorite snack.", correctEmotion: 'Joy', explanation: 'Happy surprise linked to something they love.' },
  { id: 's5', text: "Your child says, ‘Everyone else got invited to the party but me.’", correctEmotion: 'Loneliness', explanation: 'They feel left out and disconnected from peers.' },
  { id: 's6', text: "A middle‑schooler hides a report card and avoids eye contact.", correctEmotion: 'Shame', explanation: 'They feel bad about themselves, not just the action.' },
  { id: 's7', text: "A kid chews their hoodie strings and asks the same question for the third time before a dentist visit.", correctEmotion: 'Anxiety', explanation: 'Reassurance seeking and nervous behavior signal anxiety.' },
  { id: 's8', text: "A toddler clings to you when a big dog runs past at the park.", correctEmotion: 'Fear', explanation: 'A perceived immediate threat prompts fear.' },
  { id: 's9', text: "After a loud argument cools down, your teen takes a deep breath and speaks softly.", correctEmotion: 'Calm', explanation: 'Their nervous system is settling after stress.' },
  { id: 's10', text: "A student’s face lights up when the teacher announces their project will be displayed.", correctEmotion: 'Excitement', explanation: 'They anticipate something enjoyable and engaging.' },
  { id: 's11', text: "Your kid avoids the kitchen after breaking a glass earlier and hasn’t told anyone.", correctEmotion: 'Guilt', explanation: 'They feel bad about what they did and avoid consequences.' },
  { id: 's12', text: "A teen scrolls social media and mutters, ‘Why do they always get everything?’", correctEmotion: 'Jealousy', explanation: 'They want what someone else has and compare themselves.' },
  { id: 's13', text: "A child fidgets and snaps, ‘This homework doesn’t make sense!’", correctEmotion: 'Frustration', explanation: 'They feel blocked while trying to accomplish a task.' },
  { id: 's14', text: "Your kid says, ‘I think tomorrow might be better. Can we try again?’", correctEmotion: 'Hopeful', explanation: 'They are looking forward with positive expectation.' },
  { id: 's15', text: "A teen quietly wipes away tears after a close friend moves away.", correctEmotion: 'Sadness', explanation: 'Loss and longing point to sadness.' },
  { id: 's16', text: "A child wrinkles their nose and pushes away a spoiled lunch.", correctEmotion: 'Disgust', explanation: 'A strong aversion to something unpleasant.' },
  { id: 's17', text: "Your kid jumps when a balloon pops behind them.", correctEmotion: 'Surprise', explanation: 'An unexpected event startles them suddenly.' },
  { id: 's18', text: "After a hard day, the family sits quietly together with cocoa and soft music.", correctEmotion: 'Calm', explanation: 'A sense of safety and relaxation returns.' },
  { id: 's19', text: "Your child insists on checking the door lock three times before bed.", correctEmotion: 'Anxiety', explanation: 'Repetitive safety checking is anxiety‑driven.' },
  { id: 's20', text: "A teen glares when you read their texts without asking.", correctEmotion: 'Anger', explanation: 'A privacy boundary was crossed.' },
  { id: 's21', text: "A kid whispers, ‘I didn’t do it,’ then confesses they lied later.", correctEmotion: 'Guilt', explanation: 'They feel bad about a specific action and confess.' },
  { id: 's22', text: "The school play starts and your child bounces on their toes backstage.", correctEmotion: 'Excitement', explanation: 'Anticipation before a fun, meaningful event.' },
  { id: 's23', text: "Your kid says, ‘My stomach hurts’ on mornings with a big test.", correctEmotion: 'Anxiety', explanation: 'Physical symptoms from worry about performance.' },
  { id: 's24', text: "A toddler screams and throws crayons when the tower keeps falling.", correctEmotion: 'Frustration', explanation: 'Blocked goal causes big feelings.' },
  { id: 's25', text: "After a long week, you and your kid watch rain together without talking.", correctEmotion: 'Calm', explanation: 'Shared quiet presence and regulation.' },
  { id: 's26', text: "Your teen avoids a group who used to be friends and says, ‘They don’t want me there.’", correctEmotion: 'Loneliness', explanation: 'They feel excluded and isolated.' },
  { id: 's27', text: "A child says, ‘That smell is yucky’ and pushes the trash can lid closed.", correctEmotion: 'Disgust', explanation: 'Sensory aversion to unpleasant smell.' },
  { id: 's28', text: "You hand your kid a surprise note in their lunch; they grin from ear to ear.", correctEmotion: 'Joy', explanation: 'A warm, happy response to care and surprise.' },
  { id: 's29', text: "A teen watches graduation videos and says, ‘That’ll be me next year.’", correctEmotion: 'Hopeful', explanation: 'Positive expectation for the future.' },
  { id: 's30', text: "Your child’s eyes widen when the coach calls their name for the starting lineup.", correctEmotion: 'Surprise', explanation: 'Unexpected selection causes sudden astonishment.' },
  { id: 's31', text: "A kid hides finished art after a classmate mocked it last time.", correctEmotion: 'Shame', explanation: 'They feel bad about themselves after criticism.' },
  { id: 's32', text: "Your child hugs you tightly after a nightmare.", correctEmotion: 'Fear', explanation: 'Lingering fear from a frightening dream.' },
  { id: 's33', text: "The sibling gets a bigger slice of cake and your kid stares at it quietly.", correctEmotion: 'Jealousy', explanation: 'Comparison and wanting what another received.' },
  { id: 's34', text: "A teen mutters, ‘It’s too much,’ staring at a stacked to‑do list.", correctEmotion: 'Overwhelmed', explanation: 'Too many demands outstrip capacity right now.' },
  { id: 's35', text: "Your child smiles softly after helping a friend pick up spilled pencils.", correctEmotion: 'Pride', explanation: 'They feel good about doing something kind.' },
];

export default EMOTION_MATCH_SCENARIOS;