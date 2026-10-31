
export const SPECIAL_START_YEARLY_BEATS__FAMOUS_04 = {
  spotlight_reality_tv: {
    1: {
      title: "Born Into Entertainment",
      topic: "Camera as normal",
      scene: "{childName} is born to a parent in reality TV or entertainment.",
      choices: {
        connect: { text: "Create privacy and normalcy despite cameras.", consequence: "{childName} feels safe." },
        teach: { text: "Explain that cameras are tools, not life.", consequence: "They understand perspective." },
        boundary: { text: "Some moments are private, not content.", consequence: "They have refuge." },
        avoid: { text: "Film every moment of their life.", consequence: "{childName} has no privacy." },
        harm: { text: "Exploit them for content.", consequence: "{childName} internalizes being used." }
      }
    },
    2: {
      title: "Cameras Following Family",
      topic: "Constant documentation",
      scene: "{childName} grows up with cameras filming family life.",
      choices: {
        connect: { text: "Keep some moments off-camera.", consequence: "{childName} has privacy." },
        teach: { text: "Discuss what's real vs. performed.", consequence: "They understand reality." },
        boundary: { text: "Their consent is asked, not assumed.", consequence: "Agency is respected." },
        avoid: { text: "Film without permission.", consequence: "{childName} feels violated." },
        harm: { text: "Punish them for not being 'good TV.'", consequence: "{childName} performs constantly." }
      }
    },
    3: {
      title: "Public Identity: Everyone Knows Them",
      topic: "Loss of privacy",
      scene: "{childName} is recognized in public. Strangers know their name and story.",
      choices: {
        connect: { text: "Help them navigate recognition gracefully.", consequence: "{childName} handles fame well." },
        teach: { text: "Discuss fame and authenticity.", consequence: "They understand the gap." },
        boundary: { text: "They're allowed to be private.", consequence: "They're not performing all the time." },
        avoid: { text: "Encourage them to perform in public.", consequence: "{childName} loses sense of self." },
        harm: { text: "Use public recognition to control them.", consequence: "{childName} internalizes the control." }
      }
    },
    4: {
      title: "School: Being 'The Famous Kid'",
      topic: "Social complexity",
      scene: "{childName} goes to school where everyone knows them from TV.",
      choices: {
        connect: { text: "Help them navigate peer relationships.", consequence: "{childName} makes genuine friends." },
        teach: { text: "Discuss who's friend vs. fan.", consequence: "They learn discernment." },
        boundary: { text: "School is where they're a kid, not a star.", consequence: "They have normal peer life." },
        avoid: { text: "Use their fame at school.", consequence: "{childName} can't have normal friendships." },
        harm: { text: "Tell them 'people are jealous.'", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "Money & Fame: Understanding Value",
      topic: "Confused values",
      scene: "{childName} sees money coming from being on TV. Fame = worth.",
      choices: {
        connect: { text: "Separate their personal worth from fame/money.", consequence: "{childName} feels valued as person." },
        teach: { text: "Discuss what truly matters.", consequence: "Values develop." },
        boundary: { text: "Their worth isn't tied to ratings.", consequence: "Self-worth is stable." },
        avoid: { text: "Let them believe fame = love.", consequence: "{childName} chases fame for validation." },
        harm: { text: "Make money/fame the only measure of success.", consequence: "{childName} internalizes emptiness." }
      }
    },
    6: {
      title: "Performing Their Life: Always On",
      topic: "Authenticity erosion",
      scene: "{childName} learns to perform emotions and reactions for cameras.",
      choices: {
        connect: { text: "Create safe spaces where they don't perform.", consequence: "{childName} can be real." },
        teach: { text: "Help them distinguish performance from reality.", consequence: "They stay grounded." },
        boundary: { text: "Some moments are just for them.", consequence: "Authenticity is preserved." },
        avoid: { text: "Expect constant performance.", consequence: "{childName} loses authentic self." },
        harm: { text: "Punish them for 'bad' reactions on camera.", consequence: "{childName} learns to hide." }
      }
    },
    7: {
      title: "Social Media Comments: Strangers Judge Them",
      topic: "Public criticism",
      scene: "{childName} reads strangers commenting on their appearance, personality, family.",
      choices: {
        connect: { text: "Process criticism together.", consequence: "{childName} develops resilience." },
        teach: { text: "Discuss that criticism isn't truth.", consequence: "They build discernment." },
        boundary: { text: "Not all comments deserve engagement.", consequence: "They protect themselves." },
        avoid: { text: "Leave them to face criticism alone.", consequence: "{childName} internalizes shame." },
        harm: { text: "Agree with mean comments.", consequence: "{childName} develops self-hate." }
      }
    },
    8: {
      title: "Relationship with Your Career: Resentment Emerges",
      topic: "Competing for attention",
      scene: "{childName} feels {parent} is more invested in show than in them.",
      choices: {
        connect: { text: "Prioritize them over the show sometimes.", consequence: "{childName} feels loved." },
        teach: { text: "Help them understand career vs. parenthood.", consequence: "They grasp complexity." },
        boundary: { text: "They're never deprioritized for ratings.", consequence: "They're secure." },
        avoid: { text: "Choose show over them.", consequence: "{childName} internalizes rejection." },
        harm: { text: "Use the show to punish them.", consequence: "{childName} becomes resentful." }
      }
    },
    9: {
      title: "Control & Image: Being Managed",
      topic: "Loss of autonomy",
      scene: "{childName} is 9+. Their image, appearance, behavior are managed by producers.",
      choices: {
        connect: { text: "Respect their autonomy within the constraints.", consequence: "{childName} has agency." },
        teach: { text: "Discuss what they can control.", consequence: "Empowerment develops." },
        boundary: { text: "Their body and choices are theirs.", consequence: "Boundaries are honored." },
        avoid: { text: "Control all aspects of their presentation.", consequence: "{childName} loses autonomy." },
        harm: { text: "Force them into image that harms them.", consequence: "{childName} internalizes harm." }
      }
    },
    10: {
      title: "Peer Bullying or Worship: Unhealthy Dynamics",
      topic: "Distorted social relationships",
      scene: "{childName} is either bullied for being famous or worshipped unnaturally.",
      choices: {
        connect: { text: "Help them find authentic peers.", consequence: "{childName} has real friendships." },
        teach: { text: "Discuss healthy vs. unhealthy admiration.", consequence: "They learn what's real." },
        boundary: { text: "They're allowed normal peer relationships.", consequence: "They're not isolated." },
        avoid: { text: "Ignore peer dynamics.", consequence: "{childName} is lonely despite fame." },
        harm: { text: "Encourage worship as 'it's fun.'", consequence: "{childName} becomes disconnected." }
      }
    },
    11: {
      title: "Growing Awareness: Is This Real?",
      topic: "Identity questions",
      scene: "{childName} is 11. Who am I without cameras? Is any of this real?",
      choices: {
        connect: { text: "Have honest conversation about reality vs. performance.", consequence: "{childName} understands." },
        teach: { text: "Help them find their authentic self.", consequence: "Identity develops." },
        boundary: { text: "Some of you is real and private.", consequence: "They keep core self." },
        avoid: { text: "Tell them it's all real.", consequence: "{childName} remains confused." },
        harm: { text: "Say 'nothing about us is real.'", consequence: "{childName} loses trust." }
      }
    },
    12: {
      title: "Fame Impact: School Performance or Relationships Suffer",
      topic: "Real consequences",
      scene: "{childName} is struggling academically or socially because of fame.",
      choices: {
        connect: { text: "Address the impact seriously.", consequence: "{childName} gets support." },
        teach: { text: "Discuss that fame comes with costs.", consequence: "They make conscious choices." },
        boundary: { text: "Education and health are protected.", consequence: "They're supported." },
        avoid: { text: "Ignore the negative impact.", consequence: "{childName} falls further." },
        harm: { text: "Blame them for struggling.", consequence: "{childName} feels guilty." }
      }
    },
    13: {
      title: "Questions About Exploitation: Are They Using Me?",
      topic: "Consent and agency",
      scene: "{childName} is 13. Do they really consent? Or are they trapped?",
      choices: {
        connect: { text: "Give them real choice about participation.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss consent and boundaries.", consequence: "They understand their rights." },
        boundary: { text: "Opting out is always possible.", consequence: "They have agency." },
        avoid: { text: "Guilt them into continuing.", consequence: "{childName} resents you." },
        harm: { text: "Force them to continue for money.", consequence: "{childName} feels exploited." }
      }
    },
    14: {
      title: "Considering Leaving the Show",
      topic: "Exit questions",
      scene: "{childName} is 14. Can they quit? What happens if they leave?",
      choices: {
        connect: { text: "Support their choice to leave or stay.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss life after the show.", consequence: "Options feel real." },
        boundary: { text: "Their choice is honored.", consequence: "Autonomy is real." },
        avoid: { text: "Pressure them to stay.", consequence: "{childName} resents you." },
        harm: { text: "Say 'you'll regret leaving.'", consequence: "{childName} feels trapped." }
      }
    },
    15: {
      title: "Romance & Privacy: Dating in the Public Eye",
      topic: "Relationship vulnerability",
      scene: "{childName} is 15 and dating. Their relationship becomes content.",
      choices: {
        connect: { text: "Protect their relationship privacy.", consequence: "{childName}'s relationship is theirs." },
        teach: { text: "Discuss privacy in romance.", consequence: "They learn to set boundaries." },
        boundary: { text: "Partners aren't content.", consequence: "Relationships are sacred." },
        avoid: { text: "Use their romance as plot.", consequence: "{childName}'s relationship is exposed." },
        harm: { text: "Control who they date for ratings.", consequence: "{childName} feels manipulated." }
      }
    },
    16: {
      title: "Identity Beyond Fame: Who Are They?",
      topic: "Self-discovery",
      scene: "{childName} is 16. Separate from the TV persona, who are they?",
      choices: {
        connect: { text: "Help them build identity beyond TV.", consequence: "{childName} discovers themselves." },
        teach: { text: "Discuss that they're more than the show.", consequence: "Identity is multifaceted." },
        boundary: { text: "Privacy is protected.", consequence: "They develop authentic self." },
        avoid: { text: "Tell them the show is all they are.", consequence: "{childName} has fragile identity." },
        harm: { text: "Say 'without the show, you're nobody.'", consequence: "{childName} internalizes emptiness." }
      }
    },
    17: {
      title: "College & Education: Is That Still Possible?",
      topic: "Future options",
      scene: "{childName} is 17. College, career, normalcy—are these still possible?",
      choices: {
        connect: { text: "Support educational goals.", consequence: "{childName} can build normal life." },
        teach: { text: "Discuss what post-show life looks like.", consequence: "Future feels real." },
        boundary: { text: "Education is still important.", consequence: "They're prepared." },
        avoid: { text: "Tell them TV is their only option.", consequence: "{childName} feels trapped." },
        harm: { text: "Push them back into TV immediately.", consequence: "{childName} has no other path." }
      }
    },
    18: {
      title: "Adult Choice: Fame or Privacy?",
      topic: "Self-determination",
      scene: "{childName} is 18. Do they continue in entertainment or walk away?",
      choices: {
        connect: { text: "Support whatever authentic choice they make.", consequence: "{childName} feels free." },
        teach: { text: "Share wisdom about fame without pressure.", consequence: "They choose wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward continuing.", consequence: "{childName} might resent it." },
        harm: { text: "Disown them if they leave.", consequence: "{childName} is devastated." }
      }
    }
  },

  spotlight_tech_founder: {
    1: {
      title: "Born Into Tech Obsession",
      topic: "Code as normal",
      scene: "{childName} is born to tech founder parent(s) obsessed with disruption and scaling.",
      choices: {
        connect: { text: "Love them independent of their tech ability.", consequence: "{childName} feels accepted." },
        teach: { text: "Share tech passion without pressure.", consequence: "They see your love." },
        boundary: { text: "Childhood is not optimization.", consequence: "They develop naturally." },
        avoid: { text: "Start pushing coding immediately.", consequence: "{childName} feels burdened." },
        harm: { text: "Treat them like a startup to scale.", consequence: "{childName} internalizes pressure." }
      }
    },
    2: {
      title: "Disruption & Ambition as Values",
      topic: "Change the world mentality",
      scene: "{childName} grows up hearing that changing the world, disruption, and scale are everything.",
      choices: {
        connect: { text: "Teach them to think big without losing themselves.", consequence: "{childName} has healthy ambition." },
        teach: { text: "Discuss that not everything needs disruption.", consequence: "Wisdom develops." },
        boundary: { text: "Balance is possible.", consequence: "They're not consumed by ambition." },
        avoid: { text: "Make disruption the only value.", consequence: "{childName} becomes ruthless." },
        harm: { text: "Mock anything that's not about growth.", consequence: "{childName} despises stability." }
      }
    },
    3: {
      title: "Tech Literacy from Early Age",
      topic: "Code as language",
      scene: "{childName} is exposed to coding, technology, and digital natives early.",
      choices: {
        connect: { text: "Let them explore tech at their own pace.", consequence: "{childName} enjoys learning." },
        teach: { text: "Show them tech as tool, not god.", consequence: "Healthy relationship with tech." },
        boundary: { text: "Play and non-tech time are protected.", consequence: "Childhood is whole." },
        avoid: { text: "Push coding before age 6.", consequence: "{childName} resists learning." },
        harm: { text: "Use devices to control them.", consequence: "{childName} has unhealthy tech habits." }
      }
    },
    4: {
      title: "Comparison to Other Tech Kids",
      topic: "Pressure & competition",
      scene: "{childName} is compared to other tech prodigies. Can they compete?",
      choices: {
        connect: { text: "Celebrate their unique tech path.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss that not everyone codes the same way.", consequence: "They embrace their style." },
        boundary: { text: "Comparisons are redirected.", consequence: "Pressure eases." },
        avoid: { text: "Allow constant comparison.", consequence: "{childName} internalizes inadequacy." },
        harm: { text: "Say 'you'll never be as good as X.'", consequence: "{childName} gives up." }
      }
    },
    5: {
      title: "Early Success: Code Works",
      topic: "Validation through building",
      scene: "{childName} writes their first real code or creates something small that works.",
      choices: {
        connect: { text: "Celebrate without overpromising future.", consequence: "{childName} is proud." },
        teach: { text: "Discuss that small wins matter.", consequence: "They see incremental progress." },
        boundary: { text: "Success doesn't mean unicorn path.", consequence: "Pressure is managed." },
        avoid: { text: "Tell everyone 'my kid will be the next Zuckerberg.'", consequence: "{childName} feels burdened." },
        harm: { text: "Use their success to make money.", consequence: "{childName} internalizes being used." }
      }
    },
    6: {
      title: "Work-Life Balance: Parent's Startup Demands",
      topic: "Parental absence",
      scene: "{childName} sees parent working constantly. Startup always comes first.",
      choices: {
        connect: { text: "Maintain presence despite work demands.", consequence: "{childName} feels valued." },
        teach: { text: "Model that work is important AND family.", consequence: "Balance is learned." },
        boundary: { text: "Some time is off-limits for work.", consequence: "They're not neglected." },
        avoid: { text: "Let startup consume all your time.", consequence: "{childName} feels abandoned." },
        harm: { text: "Ignore them during crucial moments.", consequence: "{childName} internalizes abandonment." }
      }
    },
    7: {
      title: "Tech Dependency: Is It Good or Bad?",
      topic: "Healthy relationship questions",
      scene: "{childName} sees tech as solution to everything. Is this healthy?",
      choices: {
        connect: { text: "Help them see tech and limitations.", consequence: "{childName} has balanced view." },
        teach: { text: "Discuss what tech can't solve.", consequence: "They develop wisdom." },
        boundary: { text: "Non-tech solutions are valued.", consequence: "Life is multifaceted." },
        avoid: { text: "Tell them tech solves everything.", consequence: "{childName} becomes one-dimensional." },
        harm: { text: "Mock non-tech interests.", consequence: "{childName} hides other interests." }
      }
    },
    8: {
      title: "Funding & Money: Understanding Capital",
      topic: "Finance reality",
      scene: "{childName} learns that startup funding, exits, and money matter deeply.",
      choices: {
        connect: { text: "Teach healthy relationship with money.", consequence: "{childName} understands value." },
        teach: { text: "Discuss that money isn't everything.", consequence: "Values develop." },
        boundary: { text: "Money is tool, not purpose.", consequence: "They stay grounded." },
        avoid: { text: "Make money the only measure.", consequence: "{childName} chases wealth obsessively." },
        harm: { text: "Teach them ruthlessness for profit.", consequence: "{childName} becomes unethical." }
      }
    },
    9: {
      title: "Pressure to Build: Creating Products",
      topic: "Entrepreneurial expectation",
      scene: "{childName} is 9+. Are they expected to build? Create? Disrupt?",
      choices: {
        connect: { text: "Support creation without pressure.", consequence: "{childName} builds joyfully." },
        teach: { text: "Help them understand that failures teach.", consequence: "They develop resilience." },
        boundary: { text: "Not all ideas must become businesses.", consequence: "They're free to explore." },
        avoid: { text: "Push them to monetize everything.", consequence: "{childName} loses joy." },
        harm: { text: "Shame them for failing.", consequence: "{childName} stops trying." }
      }
    },
    10: {
      title: "School & Tech: Which Matters More?",
      topic: "Education priority",
      scene: "{childName} is juggling school with growing tech interests.",
      choices: {
        connect: { text: "Support both equally.", consequence: "{childName} succeeds in both." },
        teach: { text: "Discuss that education matters.", consequence: "They value learning." },
        boundary: { text: "School is not negotiable.", consequence: "Foundation is built." },
        avoid: { text: "Say 'school doesn't matter; just code.'", consequence: "{childName} drops out." },
        harm: { text: "Push them to drop school for startup.", consequence: "{childName} has no backup." }
      }
    },
    11: {
      title: "Identity as Coder/Builder: That's Who They Are",
      topic: "Self-concept narrowing",
      scene: "{childName} is 11. Identity increasingly tied to being a coder/builder.",
      choices: {
        connect: { text: "Support builder identity while developing others.", consequence: "{childName} is multifaceted." },
        teach: { text: "Discuss identity beyond coding.", consequence: "They develop full self." },
        boundary: { text: "Coding is important part, not all.", consequence: "Resilience is built." },
        avoid: { text: "Let builder identity consume everything.", consequence: "{childName} has no backup self." },
        harm: { text: "Say 'you're only good at coding.'", consequence: "{childName} has fragile self-worth." }
      }
    },
    12: {
      title: "Considering Entrepreneurship Seriously",
      topic: "Startup path?",
      scene: "{childName} is 12. Do they want to start their own company?",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss entrepreneurship honestly (risks and rewards).", consequence: "They make informed choice." },
        boundary: { text: "Their path is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward startup path.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you must be an entrepreneur.'", consequence: "{childName} feels burdened." }
      }
    },
    13: {
      title: "Dating While Tech-Obsessed",
      topic: "Work-life balance",
      scene: "{childName} is 13. Dating is hard when obsessed with building.",
      choices: {
        connect: { text: "Support relationships alongside tech.", consequence: "{childName} develops socially." },
        teach: { text: "Discuss balance between passion and love.", consequence: "They learn integration." },
        boundary: { text: "Relationships are allowed.", consequence: "They're not asexual for tech." },
        avoid: { text: "Tell them 'dating distracts from work.'", consequence: "{childName} isolates." },
        harm: { text: "Control who they date.", consequence: "{childName} rebels." }
      }
    },
    14: {
      title: "Following Parent's Footsteps or Creating Their Own Path",
      topic: "Career divergence",
      scene: "{childName} is 14. Will they follow your startup path or do something different?",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss different ways to use tech.", consequence: "Options feel real." },
        boundary: { text: "Their path is theirs, not yours.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward your path.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you have to be an entrepreneur like me.'", consequence: "{childName} feels trapped." }
      }
    },
    15: {
      title: "First Real Startup Attempt or Serious Project",
      topic: "Testing the path",
      scene: "{childName} is 15. Starting a real project or company is possible.",
      choices: {
        connect: { text: "Support their venture with guidance.", consequence: "{childName} learns what it takes." },
        teach: { text: "Help them understand realistic challenges.", consequence: "They're prepared." },
        boundary: { text: "Education is still important.", consequence: "Backup plan exists." },
        avoid: { text: "Push them to drop everything for startup.", consequence: "{childName} might burn out." },
        harm: { text: "Exploit their startup for your investment.", consequence: "{childName} internalizes resentment." }
      }
    },
    16: {
      title: "Funding Reality: Money, Investors, Control",
      topic: "Power dynamics",
      scene: "{childName} is 16. If they're building, funding becomes real.",
      choices: {
        connect: { text: "Help them understand funding dynamics.", consequence: "{childName} learns the game." },
        teach: { text: "Discuss equity and control.", consequence: "They make smart decisions." },
        boundary: { text: "Their agency is protected.", consequence: "They maintain control." },
        avoid: { text: "Push them toward bad deals.", consequence: "{childName} is exploited." },
        harm: { text: "Take equity from their startup.", consequence: "{childName} feels violated." }
      }
    },
    17: {
      title: "Success or Failure: Learning From Either",
      topic: "Building resilience",
      scene: "{childName} is 17. Early startup either succeeds or fails.",
      choices: {
        connect: { text: "Process outcome together.", consequence: "{childName} learns from experience." },
        teach: { text: "Discuss lessons regardless of outcome.", consequence: "Growth is real." },
        boundary: { text: "Failure is allowed and valued.", consequence: "They're resilient." },
        avoid: { text: "Shame them for failure.", consequence: "{childName} gives up." },
        harm: { text: "Say 'I told you so.'", consequence: "{childName} internalizes shame." }
      }
    },
    18: {
      title: "Adult Tech Path: Startup Founder or Something Else",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own tech future.",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Share wisdom about sustainable building.", consequence: "They learn from you." },
        boundary: { text: "Their legacy is theirs to create.", consequence: "Autonomy is honored." },
        avoid: { text: "Push them toward your path.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you're not building big enough.'", consequence: "{childName} internalizes inadequacy." }
      }
    }
  },

  spotlight_war_correspondent: {
    1: {
      title: "Born Into Conflict",
      topic: "Danger as normal",
      scene: "{childName} is born to journalist/correspondent parent covering wars and crises.",
      choices: {
        connect: { text: "Love them despite the danger you witness.", consequence: "{childName} feels loved." },
        teach: { text: "Explain that reporting matters.", consequence: "They understand your calling." },
        boundary: { text: "Childhood is protected from direct trauma.", consequence: "They're safe." },
        avoid: { text: "Expose them to danger directly.", consequence: "{childName} is traumatized." },
        harm: { text: "Treat them as part of your coverage.", consequence: "{childName} is exploited." }
      }
    },
    2: {
      title: "Frequent Absence & Dangerous Locations",
      topic: "Parental risk",
      scene: "{childName} doesn't understand why parent is always gone to dangerous places.",
      choices: {
        connect: { text: "Create rituals that maintain connection.", consequence: "{childName} feels connected." },
        teach: { text: "Explain work age-appropriately.", consequence: "They understand the why." },
        boundary: { text: "Time with them is fully present.", consequence: "Quality compensates for absence." },
        avoid: { text: "Leave them without explanation.", consequence: "{childName} feels abandoned." },
        harm: { text: "Use danger as leverage to control them.", consequence: "{childName} develops fear." }
      }
    },
    3: {
      title: "Fear of Losing You: Parent in Danger",
      topic: "Existential terror",
      scene: "{childName} understands parent covers wars. What if parent doesn't come back?",
      choices: {
        connect: { text: "Acknowledge the risk without drowning in fear.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss precautions and insurance.", consequence: "They feel less helpless." },
        boundary: { text: "Danger is real but managed.", consequence: "Fear is grounded." },
        avoid: { text: "Dismiss their fear.", consequence: "{childName} internalizes terror." },
        harm: { text: "Use fear to control them.", consequence: "{childName} becomes anxious." }
      }
    },
    4: {
      title: "Moving & Instability: Following the Conflict",
      topic: "Rootlessness",
      scene: "{childName} moves frequently following conflict zones or your assignments.",
      choices: {
        connect: { text: "Create portable sense of home.", consequence: "{childName} feels grounded." },
        teach: { text: "Help them see adaptability as strength.", consequence: "They value flexibility." },
        boundary: { text: "Each place gets time to settle.", consequence: "They form connections." },
        avoid: { text: "Treat moves as purely logistical.", consequence: "{childName} feels unmoored." },
        harm: { text: "Ignore their attachment to places.", consequence: "{childName} can't form attachments." }
      }
    },
    5: {
      title: "Exposure to Suffering & Witness",
      topic: "Too much reality",
      scene: "{childName} sees coverage or stories from conflict. Suffering is real and visible.",
      choices: {
        connect: { text: "Process what they see with compassion.", consequence: "{childName} develops empathy." },
        teach: { text: "Help them understand complexity.", consequence: "They see shades of gray." },
        boundary: { text: "Exposure is managed and contextualized.", consequence: "They're not traumatized." },
        avoid: { text: "Leave them exposed to trauma.", consequence: "{childName} is traumatized." },
        harm: { text: "Use suffering to guilt them.", consequence: "{childName} internalizes burden." }
      }
    },
    6: {
      title: "Questions About Your Work: Why Cover This?",
      topic: "Moral questions",
      scene: "{childName} is 6. Why do you go to dangerous places? Why not stay safe?",
      choices: {
        connect: { text: "Answer honestly about your calling.", consequence: "{childName} understands you." },
        teach: { text: "Discuss why journalism matters.", consequence: "They see the value." },
        boundary: { text: "They're not responsible for your choices.", consequence: "They stay a kid." },
        avoid: { text: "Dodge their questions.", consequence: "{childName} feels unsupported." },
        harm: { text: "Say 'this is more important than you.'", consequence: "{childName} internalizes rejection." }
      }
    },
    7: {
      title: "Peer Reactions: 'Your Parent Does What?'",
      topic: "Social difference",
      scene: "{childName}'s background is unusual. Peers don't understand danger or absence.",
      choices: {
        connect: { text: "Help them explain their situation.", consequence: "{childName} handles peer questions." },
        teach: { text: "Discuss how different families work differently.", consequence: "They see diversity." },
        boundary: { text: "Their family is valid even if different.", consequence: "Pride is maintained." },
        avoid: { text: "Isolate them from peers.", consequence: "{childName} becomes very lonely." },
        harm: { text: "Tell them to hide what parent does.", consequence: "{childName} develops shame." }
      }
    },
    8: {
      title: "Trauma Exposure: Witnessing War Through Coverage",
      topic: "Direct trauma exposure",
      scene: "{childName} is 8. They see images or coverage from conflict.",
      choices: {
        connect: { text: "Process traumatic images together.", consequence: "{childName} can heal." },
        teach: { text: "Help them understand what they're seeing.", consequence: "Processing happens." },
        boundary: { text: "Further trauma exposure is limited.", consequence: "They're protected." },
        avoid: { text: "Leave them to process alone.", consequence: "{childName} carries trauma." },
        harm: { text: "Use images to scare them.", consequence: "{childName} is re-traumatized." }
      }
    },
    9: {
      title: "Understanding Your Calling vs. Resenting Your Absence",
      topic: "Ambivalent feelings",
      scene: "{childName} is 9. They're proud of your work but angry about absence.",
      choices: {
        connect: { text: "Validate both pride and anger.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss complexity of loving someone in dangerous work.", consequence: "They understand nuance." },
        boundary: { text: "Both feelings are okay.", consequence: "They're not made to choose." },
        avoid: { text: "Push them to be proud only.", consequence: "{childName} hides anger." },
        harm: { text: "Make them feel guilty for resenting absence.", consequence: "{childName} internalizes shame." }
      }
    },
    10: {
      title: "School & Instability: Education Suffers or Flourishes",
      topic: "Academic impact",
      scene: "{childName} is 10. Moving affects school. Do they thrive or struggle?",
      choices: {
        connect: { text: "Support education actively.", consequence: "{childName} learns well." },
        teach: { text: "Help them adapt to new schools.", consequence: "They develop resilience." },
        boundary: { text: "Education isn't sacrificed for work.", consequence: "Foundation is built." },
        avoid: { text: "Let education slide.", consequence: "{childName} falls behind." },
        harm: { text: "Blame them for struggling academically.", consequence: "{childName} develops shame." }
      }
    },
    11: {
      title: "Considering Following Your Path",
      topic: "Career attraction",
      scene: "{childName} is 11. Your work seems important. Might they become a journalist?",
      choices: {
        connect: { text: "Support exploration without pressure.", consequence: "{childName} chooses freely." },
        teach: { text: "Discuss what journalism really costs.", consequence: "They make informed choice." },
        boundary: { text: "Their path is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward journalism.", consequence: "{childName} might resent it." },
        harm: { text: "Recruit them into your work.", consequence: "{childName} feels used." }
      }
    },
    12: {
      title: "Understanding the News: How Do They Process It?",
      topic: "Media literacy",
      scene: "{childName} is 12. They're seeing world events. How do they make sense?",
      choices: {
        connect: { text: "Help them process news critically.", consequence: "{childName} develops media literacy." },
        teach: { text: "Discuss journalism ethics.", consequence: "They understand the work." },
        boundary: { text: "They're not exposed to unfiltered horror.", consequence: "They're protected." },
        avoid: { text: "Leave them to process alone.", consequence: "{childName} becomes overwhelmed." },
        harm: { text: "Use news to scare them.", consequence: "{childName} becomes anxious." }
      }
    },
    13: {
      title: "Dating While Parent Is In Danger",
      topic: "Relationship complications",
      scene: "{childName} is 13 and dating. How do they explain parent's situation?",
      choices: {
        connect: { text: "Support relationships without pressure.", consequence: "{childName} develops normally." },
        teach: { text: "Help them decide what to share.", consequence: "They learn discernment." },
        boundary: { text: "Relationships are allowed.", consequence: "They're not isolated." },
        avoid: { text: "Tell them to hide their background.", consequence: "{childName}'s relationships stay shallow." },
        harm: { text: "Use relationship disclosure to control them.", consequence: "{childName} is manipulated." }
      }
    },
    14: {
      title: "Reality Check: Parent's Injury or Close Call",
      topic: "The danger becomes real",
      scene: "{childName} is 14. Parent is injured or narrowly escapes danger.",
      choices: {
        connect: { text: "Be fully present during crisis.", consequence: "{childName} knows you're there." },
        teach: { text: "Discuss the real costs of the work.", consequence: "They understand stakes." },
        boundary: { text: "This is allowed to change things.", consequence: "Recalibration is possible." },
        avoid: { text: "Minimize the danger.", consequence: "{childName} feels unsupported." },
        harm: { text: "Use the injury to guilt them.", consequence: "{childName} internalizes guilt." }
      }
    },
    15: {
      title: "Considering Different Life: Safety or Purpose",
      topic: "Moral question",
      scene: "{childName} is 15. Would you stop if they asked? For them?",
      choices: {
        connect: { text: "Be honest about your calling vs. their needs.", consequence: "{childName} understands you." },
        teach: { text: "Discuss difficult choices.", consequence: "They see complexity." },
        boundary: { text: "Their needs matter.", consequence: "They feel valued." },
        avoid: { text: "Act like they should never ask.", consequence: "{childName} stops asking for needs." },
        harm: { text: "Say 'your needs don't matter.'", consequence: "{childName} internalizes rejection." }
      }
    },
    16: {
      title: "College & Career: Different Path or Follow You?",
      topic: "Divergence",
      scene: "{childName} is 16. Will they become a journalist? Choose differently?",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss journalism honestly.", consequence: "They make informed choice." },
        boundary: { text: "Their career is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward journalism.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you have to be a journalist.'", consequence: "{childName} feels trapped." }
      }
    },
    17: {
      title: "Understanding Your Sacrifice: Why You Keep Going",
      topic: "Empathy and complexity",
      scene: "{childName} is 17. Can they understand why you choose danger over safety?",
      choices: {
        connect: { text: "Share your journey authentically.", consequence: "{childName} understands you." },
        teach: { text: "Discuss how calling shapes choices.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed; accountability too.", consequence: "Relationship is real." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame them for your sacrifices.", consequence: "{childName} feels guilty." }
      }
    },
    18: {
      title: "Adult Relationship: Different Lives, Same Love",
      topic: "New balance",
      scene: "{childName} is 18. Can you build adult relationship despite dangerous work?",
      choices: {
        connect: { text: "Build relationship on honesty and connection.", consequence: "Real relationship forms." },
        teach: { text: "Share wisdom without demands.", consequence: "Connection deepens." },
        boundary: { text: "Their autonomy is fully respected.", consequence: "Relationship is peer-level." },
        avoid: { text: "Keep treating them as needing protection.", consequence: "Relationship stays unequal." },
        harm: { text: "Expect them to abandon their dreams for your safety.", consequence: "Relationship breaks." }
      }
    }
  },

  spotlight_fashion_icon: {
    1: {
      title: "Born Into Style & Image",
      topic: "Appearance as currency",
      scene: "{childName} is born to parent(s) who are fashion icons or models.",
      choices: {
        connect: { text: "Love them for who they are, not appearance.", consequence: "{childName} feels valued." },
        teach: { text: "Share fashion passion without pressure.", consequence: "They see your joy." },
        boundary: { text: "Childhood is free from image obsession.", consequence: "They develop naturally." },
        avoid: { text: "Start assessing their appearance immediately.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Make appearance the measure of worth.", consequence: "{childName} internalizes emptiness." }
      }
    },
    2: {
      title: "Fashion Environment: Clothes, Looks, Image Matter",
      topic: "Appearance-focused world",
      scene: "{childName} grows up where appearance is discussed, valued, and scrutinized.",
      choices: {
        connect: { text: "Help them develop healthy relationship with appearance.", consequence: "{childName} feels comfortable." },
        teach: { text: "Discuss that looks aren't everything.", consequence: "Values broaden." },
        boundary: { text: "Play and mess are allowed.", consequence: "Childhood is protected." },
        avoid: { text: "Make appearance primary concern.", consequence: "{childName} becomes obsessed." },
        harm: { text: "Criticize their appearance.", consequence: "{childName} develops body shame." }
      }
    },
    3: {
      title: "Cute Factor: Everyone Notices Their Look",
      topic: "Unsolicited attention",
      scene: "{childName} is noticed for how they look. Compliments and comments are constant.",
      choices: {
        connect: { text: "Help them navigate attention gracefully.", consequence: "{childName} handles it well." },
        teach: { text: "Discuss that appearance is just one aspect.", consequence: "Self-worth is multifaceted." },
        boundary: { text: "Consent about being photographed/displayed.", consequence: "Agency is respected." },
        avoid: { text: "Use their cuteness for content.", consequence: "{childName} feels exploited." },
        harm: { text: "Shame them for being noticed.", consequence: "{childName} develops insecurity." }
      }
    },
    4: {
      title: "Modeling or Fashion World Exposure",
      topic: "Industry introduction",
      scene: "{childName} is exposed to fashion industry or modeling.",
      choices: {
        connect: { text: "Keep industry involvement light and age-appropriate.", consequence: "{childName} enjoys it." },
        teach: { text: "Discuss realities of fashion world.", consequence: "They understand complexity." },
        boundary: { text: "Education and normal childhood come first.", consequence: "They're protected." },
        avoid: { text: "Push them into modeling too early.", consequence: "{childName} resents it." },
        harm: { text: "Expose them to predatory industry forces.", consequence: "{childName} is at risk." }
      }
    },
    5: {
      title: "Comparison to Parent: Can They Be Like You?",
      topic: "Pressure emerges",
      scene: "Everyone expects {childName} to be as beautiful/stylish as their parent.",
      choices: {
        connect: { text: "Celebrate their unique style.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss that their look is their own.", consequence: "Identity is separate." },
        boundary: { text: "They're not expected to replicate you.", consequence: "Pressure eases." },
        avoid: { text: "Allow constant comparison.", consequence: "{childName} internalizes inadequacy." },
        harm: { text: "Say 'you'll never be as beautiful.'", consequence: "{childName} gives up." }
      }
    },
    6: {
      title: "Body Image Questions: Am I Pretty Enough?",
      topic: "Self-worth tied to appearance",
      scene: "{childName} is 6. In fashion world, appearance feels like everything.",
      choices: {
        connect: { text: "Affirm their worth independent of appearance.", consequence: "{childName} feels valued." },
        teach: { text: "Discuss what makes someone beautiful.", consequence: "Values develop." },
        boundary: { text: "Health matters more than image.", consequence: "They're not body-obsessed." },
        avoid: { text: "Encourage body obsession.", consequence: "{childName} develops eating issues." },
        harm: { text: "Critique their body.", consequence: "{childName} develops body shame." }
      }
    },
    7: {
      title: "School: Being the 'Fashion Kid'",
      topic: "Social identity",
      scene: "{childName} goes to school where everyone knows them as the fashionable kid.",
      choices: {
        connect: { text: "Help them navigate peer relationships.", consequence: "{childName} has genuine friends." },
        teach: { text: "Discuss fashion vs. friendship.", consequence: "Values clarify." },
        boundary: { text: "They're a whole person, not just fashion.", consequence: "Identity is broader." },
        avoid: { text: "Use their fashion status socially.", consequence: "{childName} has no real friends." },
        harm: { text: "Tell them people only like them for looks.", consequence: "{childName} becomes isolated." }
      }
    },
    8: {
      title: "Social Media: Appearance Displayed & Judged",
      topic: "Online scrutiny",
      scene: "{childName} is 8. Social media shows appearance to thousands. Comments are harsh.",
      choices: {
        connect: { text: "Manage social media exposure carefully.", consequence: "{childName} is protected." },
        teach: { text: "Discuss online kindness and cruelty.", consequence: "They develop resilience." },
        boundary: { text: "Their consent about posting is required.", consequence: "Agency is real." },
        avoid: { text: "Post constantly without asking.", consequence: "{childName} feels exploited." },
        harm: { text: "Share comments that hurt them.", consequence: "{childName} internalizes criticism." }
      }
    },
    9: {
      title: "Puberty & Body Changes: What Happens to My Looks?",
      topic: "Growth and transition",
      scene: "{childName} is 9-10. Puberty is changing their appearance.",
      choices: {
        connect: { text: "Help them navigate body changes with positivity.", consequence: "{childName} accepts growth." },
        teach: { text: "Discuss that beauty changes and that's okay.", consequence: "They adapt well." },
        boundary: { text: "All bodies are valid.", consequence: "They don't panic about change." },
        avoid: { text: "Tell them to fight natural changes.", consequence: "{childName} develops body shame." },
        harm: { text: "Criticize their changing body.", consequence: "{childName} develops eating disorders." }
      }
    },
    10: {
      title: "Identifying as Fashion Participant: Interests Deepen",
      topic: "Identity forming",
      scene: "{childName} is 10. Fashion interest is becoming part of their identity.",
      choices: {
        connect: { text: "Support fashion interest without obsession.", consequence: "{childName} enjoys fashion." },
        teach: { text: "Discuss fashion as creative expression.", consequence: "They see depth." },
        boundary: { text: "Fashion is one part of identity.", consequence: "They're multifaceted." },
        avoid: { text: "Let fashion consume all identity.", consequence: "{childName} has fragile self." },
        harm: { text: "Say 'fashion is all that matters.'", consequence: "{childName} internalizes emptiness." }
      }
    },
    11: {
      title: "Serious Modeling or Fashion Interest",
      topic: "Career possibility",
      scene: "{childName} is 11. Serious modeling or fashion career is possible.",
      choices: {
        connect: { text: "Support their interest while protecting childhood.", consequence: "{childName} decides freely." },
        teach: { text: "Discuss industry realities.", consequence: "They make informed choice." },
        boundary: { text: "School and development come first.", consequence: "They're not overworked." },
        avoid: { text: "Push them into modeling too early.", consequence: "{childName} resents it." },
        harm: { text: "Expose them to predatory industry forces.", consequence: "{childName} is at risk." }
      }
    },
    12: {
      title: "Dating & Relationships: Do People Like Me or My Looks?",
      topic: "Relationship authenticity",
      scene: "{childName} is 12 and dating. Are people attracted to them or their image?",
      choices: {
        connect: { text: "Help them find authentic relationships.", consequence: "{childName} dates genuinely." },
        teach: { text: "Discuss what real attraction is.", consequence: "They understand depth." },
        boundary: { text: "They deserve to be loved for who they are.", consequence: "They choose well." },
        avoid: { text: "Tell them appearance is all that matters.", consequence: "{childName} stays shallow." },
        harm: { text: "Control their relationships.", consequence: "{childName} rebels." }
      }
    },
    13: {
      title: "Considering Fashion Career Seriously",
      topic: "Path choice",
      scene: "{childName} is 13. Will they pursue fashion/modeling? Or different path?",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss fashion career honestly (challenges, beauty standards).", consequence: "They choose wisely." },
        boundary: { text: "Their path is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward fashion.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'fashion is your only option.'", consequence: "{childName} feels trapped." }
      }
    },
    14: {
      title: "Body Image Peak Years: Scrutiny Increases",
      topic: "Appearance pressure",
      scene: "{childName} is 14. Beauty standards are intense. Industry scrutiny is real.",
      choices: {
        connect: { text: "Prioritize their mental health.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss unhealthy beauty standards.", consequence: "They develop critical eye." },
        boundary: { text: "Health matters more than image.", consequence: "They're not harmed." },
        avoid: { text: "Push them to conform to standards.", consequence: "{childName} develops eating disorder." },
        harm: { text: "Tell them they need to diet.", consequence: "{childName} develops body issues." }
      }
    },
    15: {
      title: "Fashion School or Career Path: Real Commitment",
      topic: "Adult decisions",
      scene: "{childName} is 15. Fashion career requires real commitment.",
      choices: {
        connect: { text: "Support their choice with eyes open.", consequence: "{childName} decides consciously." },
        teach: { text: "Discuss sacrifice in fashion world.", consequence: "They understand costs." },
        boundary: { text: "Their choice is honored.", consequence: "Autonomy is real." },
        avoid: { text: "Push them harder.", consequence: "{childName} might burn out." },
        harm: { text: "Say 'this is your only value.'", consequence: "{childName} internalizes emptiness." }
      }
    },
    16: {
      title: "Professional Modeling or Fashion Work",
      topic: "Industry participant",
      scene: "{childName} is 16. Professional work in fashion is possible.",
      choices: {
        connect: { text: "Protect them in the industry.", consequence: "{childName} stays safe." },
        teach: { text: "Discuss industry boundaries and consent.", consequence: "They know their rights." },
        boundary: { text: "Exploitation is never allowed.", consequence: "They're protected." },
        avoid: { text: "Expose them to predatory situations.", consequence: "{childName} is at risk." },
        harm: { text: "Use their work for your benefit.", consequence: "{childName} internalizes resentment." }
      }
    },
    17: {
      title: "College & Career: Fashion or Different Path?",
      topic: "Final choice",
      scene: "{childName} is 17. College opens different possibilities.",
      choices: {
        connect: { text: "Support whatever authentic choice they make.", consequence: "{childName} feels free." },
        teach: { text: "Discuss life beyond beauty/fashion.", consequence: "They see breadth." },
        boundary: { text: "Their future is theirs to design.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward fashion.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you owe this to your looks.'", consequence: "{childName} feels trapped." }
      }
    },
    18: {
      title: "Adult Life: Their Identity Beyond Image",
      topic: "Self-determination",
      scene: "{childName} is 18. Building a life that's theirs, not defined by appearance.",
      choices: {
        connect: { text: "Support their authentic path.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about lasting worth.", consequence: "They learn from you." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Try to keep them in fashion.", consequence: "{childName} might resent you." },
        harm: { text: "Say 'without fashion, you're nothing.'", consequence: "{childName} internalizes emptiness." }
      }
    }
  }
};
