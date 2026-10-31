export const SPECIAL_START_YEARLY_BEATS__NORMAL_01 = {
  golden_cage: {
    1: {
      title: "Wealth Surrounds Them",
      topic: "Privilege from birth",
      scene: "{childName} is born into significant wealth. Everything is available.",
      choices: {
        connect: { text: "Teach that love matters more than money.", consequence: "{childName} feels truly valued." },
        teach: { text: "Explain where money comes from.", consequence: "They understand economics early." },
        boundary: { text: "Some things are earned, not bought.", consequence: "Work ethic is modeled." },
        avoid: { text: "Act like money solves everything.", consequence: "{childName} becomes materialistic." },
        harm: { text: "Use wealth to control them.", consequence: "{childName} feels manipulated." }
      }
    },
    2: {
      title: "Best of Everything: Toys, Education, Care",
      topic: "Abundance",
      scene: "{childName} has the finest toys, best schools, premium childcare.",
      choices: {
        connect: { text: "Let them enjoy abundance without guilt.", consequence: "{childName} feels free." },
        teach: { text: "Explain privilege as responsibility.", consequence: "They see both sides." },
        boundary: { text: "Some things are still 'no.'", consequence: "They learn limits exist." },
        avoid: { text: "Give them everything they want.", consequence: "{childName} becomes entitled." },
        harm: { text: "Guilt them for their privilege.", consequence: "{childName} feels ashamed." }
      }
    },
    3: {
      title: "Overprotection: Limited Real-World Experience",
      topic: "Bubble life",
      scene: "You shield {childName} from discomfort, risk, and difficulty. Life is curated.",
      choices: {
        connect: { text: "Gradually introduce age-appropriate challenges.", consequence: "{childName} develops resilience." },
        teach: { text: "Discuss why some struggle is healthy.", consequence: "They understand growth." },
        boundary: { text: "Let them experience natural consequences.", consequence: "They learn from mistakes." },
        avoid: { text: "Keep them completely protected.", consequence: "{childName} can't handle difficulty." },
        harm: { text: "Mock them for being sheltered.", consequence: "{childName} feels ashamed." }
      }
    },
    4: {
      title: "Private School, Curated Peers",
      topic: "Social bubble",
      scene: "{childName} attends exclusive school. Peers are all wealthy. Diversity is limited.",
      choices: {
        connect: { text: "Expose them to diverse people and ideas.", consequence: "{childName} sees the wider world." },
        teach: { text: "Discuss how luck played a role in their privilege.", consequence: "Empathy develops." },
        boundary: { text: "They have friends outside their social class.", consequence: "Real perspective forms." },
        avoid: { text: "Let them stay in the bubble.", consequence: "{childName} sees only one reality." },
        harm: { text: "Teach them they're better than others.", consequence: "{childName} becomes snobbish." }
      }
    },
    5: {
      title: "Allowance & Money Management",
      topic: "Learning value",
      scene: "{childName} gets an allowance (significant or unlimited). How do they learn money means something?",
      choices: {
        connect: { text: "Tie allowance to contributions, not entitlement.", consequence: "{childName} values money." },
        teach: { text: "Discuss saving, spending, and giving.", consequence: "Financial literacy grows." },
        boundary: { text: "Some things they must earn themselves.", consequence: "Work has meaning." },
        avoid: { text: "Give unlimited money.", consequence: "{childName} wastes and disrespects value." },
        harm: { text: "Use money as punishment.", consequence: "{childName} becomes anxious about finances." }
      }
    },
    6: {
      title: "Comparing Self to Wealthy Peers",
      topic: "Status anxiety",
      scene: "{childName} notices some peers are wealthier. They feel less-than.",
      choices: {
        connect: { text: "Validate their feelings; discuss other measures of worth.", consequence: "{childName} feels seen." },
        teach: { text: "Discuss that more money doesn't mean better life.", consequence: "Perspective develops." },
        boundary: { text: "Their worth isn't measured in wealth.", consequence: "Confidence remains." },
        avoid: { text: "Push them to compete for wealth.", consequence: "{childName} becomes obsessed." },
        harm: { text: "Say 'you should be grateful for less.'", consequence: "{childName} feels invalidated." }
      }
    },
    7: {
      title: "Guilt About Privilege",
      topic: "Awareness of inequality",
      scene: "{childName} learns others have less. They feel guilt or confusion about their wealth.",
      choices: {
        connect: { text: "Normalize their feelings; discuss action.", consequence: "{childName} feels understood." },
        teach: { text: "Help them serve or support others.", consequence: "Privilege becomes purposeful." },
        boundary: { text: "Don't let guilt paralyze them.", consequence: "They act, not just feel." },
        avoid: { text: "Dismiss their guilt.", consequence: "{childName} internalizes it." },
        harm: { text: "Shame them for having privilege.", consequence: "{childName} becomes resentful." }
      }
    },
    8: {
      title: "Entitled Expectations",
      topic: "Reality check",
      scene: "{childName} expects things to be easy, perfect, on-demand. They're shocked by limits.",
      choices: {
        connect: { text: "Address entitlement with love and limits.", consequence: "{childName} learns reality." },
        teach: { text: "Explain that money doesn't buy everything.", consequence: "They see deeper truths." },
        boundary: { text: "Natural consequences are allowed.", consequence: "They learn from mistakes." },
        avoid: { text: "Give in to entitled demands.", consequence: "{childName} becomes more entitled." },
        harm: { text: "Shame them harshly.", consequence: "{childName} becomes defensive." }
      }
    },
    9: {
      title: "Therapy or Counseling (If Needed)",
      topic: "Mental health isn't money",
      scene: "{childName} struggles with anxiety, depression, or entitlement. Money alone won't fix it.",
      choices: {
        connect: { text: "Get professional help immediately.", consequence: "{childName} gets support." },
        teach: { text: "Discuss that privilege doesn't prevent mental health issues.", consequence: "They understand complexity." },
        boundary: { text: "Therapy is normalized, not shameful.", consequence: "They seek help when needed." },
        avoid: { text: "Ignore mental health issues.", consequence: "{childName} deteriorates." },
        harm: { text: "Use therapists to control them.", consequence: "{childName} resists help." }
      }
    },
    10: {
      title: "Seeing Poverty or Homelessness Directly",
      topic: "Reality hits",
      scene: "{childName} witnesses poverty or homelessness. Cognitive dissonance is real.",
      choices: {
        connect: { text: "Process their reaction together.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss systemic inequality honestly.", consequence: "Understanding deepens." },
        boundary: { text: "Move them toward compassion, not guilt.", consequence: "They want to help." },
        avoid: { text: "Ignore their discomfort.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Teach them to dismiss the poor.", consequence: "{childName} becomes callous." }
      }
    },
    11: {
      title: "Relationships: Do They Like Me or My Money?",
      topic: "Trust and friendship",
      scene: "{childName} questions if friends like them or just their wealth. Paranoia emerges.",
      choices: {
        connect: { text: "Help them identify authentic friends.", consequence: "{childName} finds real connection." },
        teach: { text: "Discuss what makes real friendship.", consequence: "They can distinguish." },
        boundary: { text: "Encourage friends without wealth-based bonding.", consequence: "Real friendships form." },
        avoid: { text: "Leave them suspicious.", consequence: "{childName} isolates." },
        harm: { text: "Use money to buy them friends.", consequence: "{childName} trusts no one." }
      }
    },
    12: {
      title: "Romantic Interest: Are They Into You or Your Status?",
      topic: "Dating dilemma",
      scene: "{childName} starts dating. They wonder: do they like me or my wealth/status?",
      choices: {
        connect: { text: "Help them navigate authenticity in dating.", consequence: "{childName} dates authentically." },
        teach: { text: "Discuss red flags in relationships.", consequence: "They choose wisely." },
        boundary: { text: "Their worth isn't their wealth.", consequence: "They demand respect." },
        avoid: { text: "Ignore their dating concerns.", consequence: "{childName} feels unsupported." },
        harm: { text: "Use money to control their dating.", consequence: "{childName} rebels." }
      }
    },
    13: {
      title: "Work Expectations: Do They Have To?",
      topic: "Purpose and contribution",
      scene: "{childName} doesn't need to work for survival. Why would they work?",
      choices: {
        connect: { text: "Help them see work as purpose, not necessity.", consequence: "{childName} finds meaningful work." },
        teach: { text: "Discuss what work teaches beyond money.", consequence: "They value contribution." },
        boundary: { text: "Some work is expected of them.", consequence: "They develop work ethic." },
        avoid: { text: "Let them be idle.", consequence: "{childName} has no purpose." },
        harm: { text: "Force work on them.", consequence: "{childName} resents work." }
      }
    },
    14: {
      title: "Substance Access & Risk",
      topic: "Dangers of privilege",
      scene: "{childName} has easy access to alcohol, drugs, or other substances. Temptation is high.",
      choices: {
        connect: { text: "Talk openly about risks and values.", consequence: "{childName} makes conscious choices." },
        teach: { text: "Discuss how wealth doesn't protect from addiction.", consequence: "They understand danger." },
        boundary: { text: "Set clear rules and consequences.", consequence: "Structure is provided." },
        avoid: { text: "Turn a blind eye.", consequence: "Addiction risk rises." },
        harm: { text: "Provide substances or enable use.", consequence: "{childName} develops addiction." }
      }
    },
    15: {
      title: "Philanthropy or Service: Finding Purpose",
      topic: "Using privilege for good",
      scene: "{childName} discovers they can help others through wealth or work. Purpose emerges.",
      choices: {
        connect: { text: "Support their desire to help.", consequence: "{childName} finds meaningful purpose." },
        teach: { text: "Discuss systemic vs. charity approaches.", consequence: "They think critically." },
        boundary: { text: "Helping is their choice, not obligation.", consequence: "Authenticity is preserved." },
        avoid: { text: "Ignore their desire to help.", consequence: "{childName} feels directionless." },
        harm: { text: "Push them to help against their will.", consequence: "{childName} resents giving." }
      }
    },
    16: {
      title: "Independence Question: Can They Live Without Money?",
      topic: "Real-world readiness",
      scene: "{childName} wonders: could I survive without family wealth? Can I stand alone?",
      choices: {
        connect: { text: "Help them build real independence.", consequence: "{childName} becomes self-reliant." },
        teach: { text: "Encourage gap year or work experience.", consequence: "Reality-testing happens." },
        boundary: { text: "Let them try and struggle a bit.", consequence: "Growth occurs." },
        avoid: { text: "Keep them dependent.", consequence: "{childName} never grows up." },
        harm: { text: "Cut them off without support.", consequence: "{childName} is harmed." }
      }
    },
    17: {
      title: "College & Career: Their Choice vs. Your Expectations",
      topic: "Defining their path",
      scene: "{childName} is 17. Do they go to elite school? Pursue lucrative career? Or follow passion?",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} chooses freely." },
        teach: { text: "Discuss financial independence and options.", consequence: "They understand choices." },
        boundary: { text: "Money isn't the measure of success.", consequence: "They define success." },
        avoid: { text: "Force elite path.", consequence: "{childName} resents you." },
        harm: { text: "Cut them off if they don't comply.", consequence: "{childName} is devastated." }
      }
    },
    18: {
      title: "Adult Freedom: Will They Keep the Wealth or Walk Away?",
      topic: "Their choice",
      scene: "{childName} is 18. Do they accept the family wealth? Reject it? Use it differently?",
      choices: {
        connect: { text: "Respect their authentic choice.", consequence: "{childName} feels truly free." },
        teach: { text: "Share what you've learned about privilege.", consequence: "They choose wisely." },
        boundary: { text: "They own their relationship with wealth.", consequence: "It's theirs to decide." },
        avoid: { text: "Act betrayed by their choice.", consequence: "{childName} feels guilty." },
        harm: { text: "Disown them if they reject wealth.", consequence: "{childName} is devastated." }
      }
    }
  },

  newcomer_reset: {
    1: {
      title: "Born Into a New Country",
      topic: "Fresh start",
      scene: "{childName} is born in a new country. Everything is unfamiliar to you too.",
      choices: {
        connect: { text: "Create comfort and belonging for both of you.", consequence: "{childName} feels safe." },
        teach: { text: "Learn the new culture together.", consequence: "Shared discovery happens." },
        boundary: { text: "Keep cultural roots alive.", consequence: "Identity is not erased." },
        avoid: { text: "Isolate yourselves from the new culture.", consequence: "{childName} is culturally isolated." },
        harm: { text: "Shame them for being born 'foreign.'", consequence: "{childName} is confused about identity." }
      }
    },
    2: {
      title: "Language Learning Begins",
      topic: "Communication challenge",
      scene: "{childName} learns the new country's language alongside you.",
      choices: {
        connect: { text: "Make language learning joyful.", consequence: "{childName} enjoys learning." },
        teach: { text: "Teach both languages with equal respect.", consequence: "Bilingualism is valued." },
        boundary: { text: "Both languages are home languages.", consequence: "No language is 'lesser.'" },
        avoid: { text: "Push only new language.", consequence: "{childName} loses heritage language." },
        harm: { text: "Shame them for accents.", consequence: "{childName} becomes silent." }
      }
    },
    3: {
      title: "Food & Homesickness",
      topic: "Missing home",
      scene: "{childName} doesn't recognize food or culture. You miss home too.",
      choices: {
        connect: { text: "Share recipes from home; cook together.", consequence: "{childName} feels connected to heritage." },
        teach: { text: "Gradually introduce new foods.", consequence: "They enjoy both cuisines." },
        boundary: { text: "Home foods are celebrated, not hidden.", consequence: "Pride is maintained." },
        avoid: { text: "Cut off all heritage food.", consequence: "{childName} feels erased." },
        harm: { text: "Shame their food preferences.", consequence: "{childName} hides who they are." }
      }
    },
    4: {
      title: "School: First Day in New Education System",
      topic: "Big transition",
      scene: "{childName} starts school in the new country. Different curriculum, different kids, different language.",
      choices: {
        connect: { text: "Prepare them; be present through adjustment.", consequence: "{childName} adapts well." },
        teach: { text: "Help translate educational concepts.", consequence: "Learning is not lost." },
        boundary: { text: "School time is protected; stress is shared.", consequence: "They're not overwhelmed." },
        avoid: { text: "Leave them to figure it out alone.", consequence: "{childName} struggles." },
        harm: { text: "Blame them if they don't adapt quickly.", consequence: "{childName} feels ashamed." }
      }
    },
    5: {
      title: "Peers Notice Their Difference",
      topic: "Standing out",
      scene: "Peers notice {childName}'s accent, food, clothes, traditions. Teasing may start.",
      choices: {
        connect: { text: "Validate their feelings; build confidence.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss their unique heritage as strength.", consequence: "Pride develops." },
        boundary: { text: "No tolerance for bullying.", consequence: "They're protected." },
        avoid: { text: "Ignore their experience of being different.", consequence: "{childName} internalizes shame." },
        harm: { text: "Push them to hide who they are.", consequence: "{childName} becomes invisible." }
      }
    },
    6: {
      title: "Cultural Celebration or Holiday Missed",
      topic: "Homesickness peaks",
      scene: "A major home-country holiday arrives. You can't celebrate the way you used to.",
      choices: {
        connect: { text: "Create new traditions that honor old ones.", consequence: "{childName} feels connected." },
        teach: { text: "Explain why traditions matter.", consequence: "They appreciate their roots." },
        boundary: { text: "Adapt celebrations; don't erase them.", consequence: "Identity is preserved." },
        avoid: { text: "Pretend the holiday doesn't matter.", consequence: "{childName} feels erased." },
        harm: { text: "Shame them for missing home.", consequence: "{childName} hides nostalgia." }
      }
    },
    7: {
      title: "You're Struggling Too",
      topic: "Parent's own adjustment",
      scene: "{childName} notices you're sad, stressed, or struggling with the move.",
      choices: {
        connect: { text: "Be honest about your feelings.", consequence: "{childName} feels you're real." },
        teach: { text: "Show them you're managing and adapting.", consequence: "They learn resilience." },
        boundary: { text: "Don't burden them with your struggles.", consequence: "They're not your therapist." },
        avoid: { text: "Hide everything; let them worry.", consequence: "{childName} internalizes your stress." },
        harm: { text: "Blame {childName} for the move.", consequence: "{childName} feels guilty." }
      }
    },
    8: {
      title: "Friendships Form Despite Difference",
      topic: "Belonging begins",
      scene: "{childName} makes genuine friends. Kids who see beyond the accent or difference.",
      choices: {
        connect: { text: "Celebrate these friendships.", consequence: "{childName} feels like they belong." },
        teach: { text: "Discuss what makes a real friend.", consequence: "They know good people." },
        boundary: { text: "Friendship is based on mutual respect.", consequence: "They build healthy bonds." },
        avoid: { text: "Ignore their friendships.", consequence: "{childName} feels unseen." },
        harm: { text: "Prevent friendships from non-heritage background.", consequence: "{childName} stays isolated." }
      }
    },
    9: {
      title: "Systemic Barriers: Job/Housing Discrimination",
      topic: "Adult reality",
      scene: "{childName} sees you face discrimination in work/housing/services because of origin.",
      choices: {
        connect: { text: "Process the injustice together.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss discrimination and systemic inequality.", consequence: "They understand reality." },
        boundary: { text: "Discrimination isn't your fault.", consequence: "You both process without blame." },
        avoid: { text: "Ignore the discrimination.", consequence: "{childName} internalizes it." },
        harm: { text: "Teach them to internalize blame.", consequence: "{childName} develops shame." }
      }
    },
    10: {
      title: "Becoming Translator/Cultural Mediator",
      topic: "Grown-up responsibility",
      scene: "{childName} becomes the family translator or cultural mediator. Language advantage shifts roles.",
      choices: {
        connect: { text: "Thank them; don't over-rely on them.", consequence: "{childName} feels valued, not burdened." },
        teach: { text: "Explain they're helping, but it's not their job.", consequence: "Boundaries are clear." },
        boundary: { text: "Complex situations have adult help.", consequence: "They're not alone." },
        avoid: { text: "Let them handle adult situations alone.", consequence: "{childName} parentifies." },
        harm: { text: "Rely entirely on them.", consequence: "{childName} feels responsible for family." }
      }
    },
    11: {
      title: "Hybrid Identity Confusion",
      topic: "Who am I?",
      scene: "{childName} is between cultures. Not fully of the new country, not fully of home.",
      choices: {
        connect: { text: "Celebrate hybrid identity as strength.", consequence: "{childName} feels proud." },
        teach: { text: "Discuss that both cultures are theirs.", consequence: "Identity is integrated." },
        boundary: { text: "No pressure to choose one culture.", consequence: "They're allowed complexity." },
        avoid: { text: "Force them to choose.", consequence: "{childName} feels torn." },
        harm: { text: "Say one culture is wrong.", consequence: "{childName} rejects part of self." }
      }
    },
    12: {
      title: "Visiting Home Country (If Possible)",
      topic: "Reconnection",
      scene: "{childName} visits home country. Everything feels familiar and foreign at once.",
      choices: {
        connect: { text: "Let them process the complexity.", consequence: "{childName} integrates experience." },
        teach: { text: "Discuss how they've changed.", consequence: "Self-awareness develops." },
        boundary: { text: "Both countries can be home.", consequence: "Belonging is expanded." },
        avoid: { text: "Rush the visit.", consequence: "{childName} feels pushed." },
        harm: { text: "Say 'see, we should go back forever.'", consequence: "{childName} feels torn." }
      }
    },
    13: {
      title: "School: Advanced Academics & Language Advantage",
      topic: "Unexpected strength",
      scene: "{childName} excels academically or discovers language as a gift.",
      choices: {
        connect: { text: "Celebrate their strength.", consequence: "{childName} feels empowered." },
        teach: { text: "Help them see bilingualism as asset.", consequence: "They value their background." },
        boundary: { text: "Success is theirs to own.", consequence: "They feel pride." },
        avoid: { text: "Minimize their achievement.", consequence: "{childName} feels unseen." },
        harm: { text: "Pressure constant excellence.", consequence: "{childName} burns out." }
      }
    },
    14: {
      title: "Romantic Interest from Different Background",
      topic: "Love crosses cultures",
      scene: "{childName} falls for someone from yet another culture. You see history repeating.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss navigating cultural differences in love.", consequence: "They choose wisely." },
        boundary: { text: "They choose their partner.", consequence: "Their choice is respected." },
        avoid: { text: "Forbid the relationship.", consequence: "{childName} hides it." },
        harm: { text: "Shame them for loving outside their culture.", consequence: "{childName} hides love." }
      }
    },
    15: {
      title: "Identity Question: Where Do They Belong?",
      topic: "Defining home",
      scene: "{childName} is 15. They speak both languages, but feel fully at home nowhere.",
      choices: {
        connect: { text: "Help them see themselves as global citizen.", consequence: "{childName} feels expanded." },
        teach: { text: "Discuss that belonging is built, not given.", consequence: "They become intentional." },
        boundary: { text: "Multiple places can be home.", consequence: "Home is internal." },
        avoid: { text: "Tell them they must choose.", consequence: "{childName} feels torn." },
        harm: { text: "Reject whichever culture they identify less with.", consequence: "{childName} is wounded." }
      }
    },
    16: {
      title: "College & Future: Where to Build Life?",
      topic: "Next chapter location",
      scene: "{childName} is 16. College options exist in both home country and new country.",
      choices: {
        connect: { text: "Explore all options together.", consequence: "{childName} feels guided." },
        teach: { text: "Discuss what each location offers.", consequence: "They choose wisely." },
        boundary: { text: "It's ultimately their choice.", consequence: "Autonomy is respected." },
        avoid: { text: "Push them toward one country.", consequence: "{childName} might resent it." },
        harm: { text: "Disown them if they choose differently.", consequence: "{childName} is devastated." }
      }
    },
    17: {
      title: "Career Path: Unique Advantage or Pressure?",
      topic: "Using their background",
      scene: "{childName} is 17. Translation, international work, or cultural liaison roles exist.",
      choices: {
        connect: { text: "Support careers that feel authentic.", consequence: "{childName} chooses freely." },
        teach: { text: "Discuss that they have unique skills.", consequence: "They see their advantage." },
        boundary: { text: "No pressure to use identity professionally.", consequence: "They choose their path." },
        avoid: { text: "Ignore their unique advantages.", consequence: "{childName} feels unseen." },
        harm: { text: "Push them into 'cultural' careers.", consequence: "{childName} resents their background." }
      }
    },
    18: {
      title: "Adult Citizenship & Belonging Decision",
      topic: "Roots deepening",
      scene: "{childName} is 18. Do they get citizenship here? Maintain home identity? Both?",
      choices: {
        connect: { text: "Support their citizenship/identity choice.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss what citizenship means to them.", consequence: "They choose consciously." },
        boundary: { text: "Both identities can coexist.", consequence: "They don't have to choose." },
        avoid: { text: "Act hurt by their choice.", consequence: "{childName} feels guilty." },
        harm: { text: "Disown them for their choice.", consequence: "{childName} is devastated." }
      }
    }
  },

  tradition_tug_of_war: {
    1: {
      title: "Family Tradition Sets Expectations",
      topic: "Expected path",
      scene: "{childName} is born into families with deep traditions: religion, culture, values.",
      choices: {
        connect: { text: "Share traditions with love, not obligation.", consequence: "{childName} feels the meaning." },
        teach: { text: "Explain why traditions matter to you.", consequence: "They understand the why." },
        boundary: { text: "Let them question traditions eventually.", consequence: "Faith is genuine, not forced." },
        avoid: { text: "Impose traditions without explanation.", consequence: "{childName} resents them." },
        harm: { text: "Use traditions to control them.", consequence: "{childName} rebels against all tradition." }
      }
    },
    2: {
      title: "Ritual Participation Begins",
      topic: "Learning practice",
      scene: "{childName} participates in family rituals: prayers, ceremonies, celebrations.",
      choices: {
        connect: { text: "Make rituals joyful and age-appropriate.", consequence: "{childName} enjoys them." },
        teach: { text: "Explain the meaning behind rituals.", consequence: "They understand the why." },
        boundary: { text: "Participation is gentle, not forced.", consequence: "They stay willing." },
        avoid: { text: "Make rituals boring or obligatory.", consequence: "{childName} resists." },
        harm: { text: "Shame them if they don't participate perfectly.", consequence: "{childName} hides." }
      }
    },
    3: {
      title: "Peers Have Different Traditions",
      topic: "Noticing difference",
      scene: "{childName} sees peers have different (or no) traditions. They notice the gap.",
      choices: {
        connect: { text: "Validate that different is okay.", consequence: "{childName} feels secure." },
        teach: { text: "Discuss why different families do different things.", consequence: "Understanding grows." },
        boundary: { text: "Your traditions are valuable.", consequence: "Pride develops." },
        avoid: { text: "Act superior or defensive.", consequence: "{childName} feels insecure." },
        harm: { text: "Shame other families' traditions.", consequence: "{childName} learns intolerance." }
      }
    },
    4: {
      title: "School vs. Home Traditions Conflict",
      topic: "Two worlds",
      scene: "School teaches something that contradicts family traditions. {childName} is confused.",
      choices: {
        connect: { text: "Have honest conversation about both.", consequence: "{childName} can think for themselves." },
        teach: { text: "Help them understand complexity.", consequence: "Critical thinking develops." },
        boundary: { text: "Respect both systems without choosing for them.", consequence: "They're trusted." },
        avoid: { text: "Tell them school is wrong.", consequence: "{childName} stops learning." },
        harm: { text: "Punish them for school lessons.", consequence: "{childName} hides." }
      }
    },
    5: {
      title: "Different From Relatives' Interpretations",
      topic: "Not all the same",
      scene: "Extended family interprets traditions differently. {childName} sees disagreement.",
      choices: {
        connect: { text: "Explain families interpret things differently.", consequence: "{childName} understands nuance." },
        teach: { text: "Discuss your version without dismissing others.", consequence: "Respect develops." },
        boundary: { text: "You let them form own views.", consequence: "Autonomy is modeled." },
        avoid: { text: "Bad-mouth relatives' interpretations.", consequence: "{childName} learns disrespect." },
        harm: { text: "Force strict adherence while others are flexible.", consequence: "{childName} feels controlled." }
      }
    },
    6: {
      title: "Questions About 'Why' Start Appearing",
      topic: "Critical thinking",
      scene: "{childName} asks: Why do we do this? Does this make sense? What if I don't believe?",
      choices: {
        connect: { text: "Welcome their questions genuinely.", consequence: "{childName} feels heard." },
        teach: { text: "Answer honestly; admit when you don't know.", consequence: "They see your authenticity." },
        boundary: { text: "Questions don't threaten traditions.", consequence: "Faith is tested, not forbidden." },
        avoid: { text: "Shut down questions.", consequence: "{childName} stops asking." },
        harm: { text: "Punish them for questioning.", consequence: "{childName} hides doubts." }
      }
    },
    7: {
      title: "Peer Pressure Against Traditions",
      topic: "Social cost",
      scene: "Peers make fun of {childName}'s traditions, dress, food, or practices. Social pain is real.",
      choices: {
        connect: { text: "Validate their experience and support their choice.", consequence: "{childName} feels backed." },
        teach: { text: "Discuss pride in their tradition.", consequence: "They own their identity." },
        boundary: { text: "Some flexibility is okay (e.g., clothing at school).", consequence: "They adapt without abandoning." },
        avoid: { text: "Ignore their social struggle.", consequence: "{childName} internalizes shame." },
        harm: { text: "Shame them for fitting in.", consequence: "{childName} feels guilty." }
      }
    },
    8: {
      title: "Adolescent Rebellion Against Tradition",
      topic: "Testing limits",
      scene: "{childName} deliberately rejects or breaks traditions. Intentional rebellion or exploration.",
      choices: {
        connect: { text: "Listen to their resistance without defensiveness.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss why traditions matter to you.", consequence: "They understand your perspective." },
        boundary: { text: "Core family rules are non-negotiable; other things are flexible.", consequence: "Balance is found." },
        avoid: { text: "Respond with shame or punishment.", consequence: "{childName} rebels harder." },
        harm: { text: "Disown them for questioning.", consequence: "{childName} abandons tradition entirely." }
      }
    },
    9: {
      title: "Exploring Different Beliefs/Traditions",
      topic: "Spiritual seeking",
      scene: "{childName} becomes curious about other traditions, religions, or philosophies.",
      choices: {
        connect: { text: "Support their exploration with curiosity.", consequence: "{childName} explores openly." },
        teach: { text: "Help them understand both their roots and new interests.", consequence: "Integration is possible." },
        boundary: { text: "No judgment; learning is good.", consequence: "They stay connected to you." },
        avoid: { text: "Forbid exploration.", consequence: "{childName} explores secretly." },
        harm: { text: "Say their exploration is betrayal.", consequence: "{childName} hides and isolates." }
      }
    },
    10: {
      title: "Secular vs. Religious Pull",
      topic: "Core conflict",
      scene: "{childName} is pulled between religious tradition and secular modern world.",
      choices: {
        connect: { text: "Create space for both without forcing choice.", consequence: "{childName} integrates." },
        teach: { text: "Discuss how many people navigate both.", consequence: "Options feel open." },
        boundary: { text: "Their faith is theirs to own.", consequence: "Autonomy is respected." },
        avoid: { text: "Force all-or-nothing choice.", consequence: "{childName} feels torn." },
        harm: { text: "Ridicule either tradition or secular life.", consequence: "{childName} is conflicted." }
      }
    },
    11: {
      title: "Tradition Conflicts With Personal Identity",
      topic: "Real tension",
      scene: "{childName} realizes tradition might conflict with their emerging identity (gender, sexuality, career).",
      choices: {
        connect: { text: "Prioritize their wellbeing over tradition.", consequence: "{childName} feels loved." },
        teach: { text: "Discuss reinterpreting tradition if possible.", consequence: "Creative solutions emerge." },
        boundary: { text: "Their authentic self comes first.", consequence: "They feel safe." },
        avoid: { text: "Force tradition over their identity.", consequence: "{childName} internalizes shame." },
        harm: { text: "Reject them for diverging from tradition.", consequence: "{childName} is devastated." }
      }
    },
    12: {
      title: "Dating/Partnership Outside Tradition",
      topic: "Love challenges",
      scene: "{childName} falls for someone outside their traditional community. Conflict emerges.",
      choices: {
        connect: { text: "Support their relationship with openness.", consequence: "{childName} feels backed." },
        teach: { text: "Help them navigate expectations from both families.", consequence: "They learn diplomacy." },
        boundary: { text: "Their partner choice is ultimately theirs.", consequence: "Autonomy is respected." },
        avoid: { text: "Forbid the relationship.", consequence: "{childName} sneaks relationship." },
        harm: { text: "Disown them for their choice.", consequence: "{childName} is devastated." }
      }
    },
    13: {
      title: "Career/Education Conflicts With Tradition",
      topic: "Future planning",
      scene: "{childName}'s desired career or education path doesn't fit traditional expectations.",
      choices: {
        connect: { text: "Support their dreams while honoring tradition.", consequence: "{childName} feels empowered." },
        teach: { text: "Help them find ways to bridge both.", consequence: "Integration is possible." },
        boundary: { text: "Their future is ultimately theirs.", consequence: "Autonomy is respected." },
        avoid: { text: "Force traditional path on them.", consequence: "{childName} resents you." },
        harm: { text: "Say 'you're destroying our family.'", consequence: "{childName} feels guilty." }
      }
    },
    14: {
      title: "Spiritual Crisis or Deconversion",
      topic: "Faith collapse",
      scene: "{childName} loses faith or radically reinterprets it. What was certain now seems false.",
      choices: {
        connect: { text: "Be present through their crisis without judgment.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss your own faith journey.", consequence: "They see complexity." },
        boundary: { text: "They're allowed to change beliefs.", consequence: "Growth is honored." },
        avoid: { text: "Ignore their spiritual crisis.", consequence: "{childName} processes alone." },
        harm: { text: "Reject them for deconverting.", consequence: "{childName} is devastated." }
      }
    },
    15: {
      title: "Educating Yourself: Understanding Their Perspective",
      topic: "Bridge-building",
      scene: "{childName} asks you to learn about their new beliefs or path. Will you try?",
      choices: {
        connect: { text: "Make genuine effort to understand.", consequence: "{childName} feels honored." },
        teach: { text: "Ask honest questions.", consequence: "Connection deepens." },
        boundary: { text: "You can disagree while respecting.", consequence: "Relationship survives difference." },
        avoid: { text: "Refuse to learn about their path.", consequence: "{childName} feels unsupported." },
        harm: { text: "Ridicule what they're learning.", consequence: "{childName} hides from you." }
      }
    },
    16: {
      title: "College & Autonomy: True Choice Emerges",
      topic: "Real freedom",
      scene: "{childName} is 16. Away from family, they might truly choose their own path.",
      choices: {
        connect: { text: "Prepare them for authentic choice-making.", consequence: "{childName} chooses consciously." },
        teach: { text: "Discuss that different choices are okay.", consequence: "They feel free." },
        boundary: { text: "Your relationship survives different choices.", consequence: "Love isn't conditional." },
        avoid: { text: "Try to control their college decisions.", consequence: "{childName} rebels." },
        harm: { text: "Say 'if you don't believe, we're done.'", consequence: "{childName} cuts you off." }
      }
    },
    17: {
      title: "Final Decision: Their Tradition Path",
      topic: "Adult autonomy",
      scene: "{childName} is 17. Will they keep, reject, or reinterpret family traditions?",
      choices: {
        connect: { text: "Respect their decision fully.", consequence: "{childName} feels truly free." },
        teach: { text: "Share what traditions mean to you; let them choose.", consequence: "They choose consciously." },
        boundary: { text: "Their choice doesn't define your relationship.", consequence: "Love survives difference." },
        avoid: { text: "Act hurt by their choice.", consequence: "{childName} feels guilty." },
        harm: { text: "Reject them for their choice.", consequence: "{childName} is devastated." }
      }
    },
    18: {
      title: "Adult Faith & Family: Rebuilding Connection",
      topic: "New adult dynamic",
      scene: "{childName} is 18. Whatever they've chosen, can you rebuild relationship?",
      choices: {
        connect: { text: "Meet them as an adult, not a rebel.", consequence: "Real relationship develops." },
        teach: { text: "Share your journey; listen to theirs.", consequence: "Mutual understanding grows." },
        boundary: { text: "Respect is the foundation now.", consequence: "Relationship is peer-level." },
        avoid: { text: "Keep trying to change them.", consequence: "Distance widens." },
        harm: { text: "Use tradition to shame or control.", consequence: "Relationship breaks." }
      }
    }
  },

  rural_isolation: {
    1: {
      title: "Born Far From Everything",
      topic: "Isolated childhood",
      scene: "{childName} is born in a rural area: far from cities, services, and other people.",
      choices: {
        connect: { text: "Create warmth and connection amid isolation.", consequence: "{childName} feels safe." },
        teach: { text: "Teach them to appreciate nature and self-sufficiency.", consequence: "Wonder develops." },
        boundary: { text: "Protect them from harsh isolation.", consequence: "They have what they need." },
        avoid: { text: "Neglect them in isolation.", consequence: "{childName} becomes lonely." },
        harm: { text: "Use isolation as punishment.", consequence: "{childName} resents it." }
      }
    },
    2: {
      title: "Limited Access to Services",
      topic: "Practical hardship",
      scene: "{childName} gets sick or injured. The nearest doctor is hours away.",
      choices: {
        connect: { text: "Be prepared; have first aid and telehealth resources.", consequence: "{childName} gets care." },
        teach: { text: "Teach them emergency preparedness.", consequence: "They learn resilience." },
        boundary: { text: "Don't glamorize the risk.", consequence: "They understand reality." },
        avoid: { text: "Ignore health risks.", consequence: "{childName} is at risk." },
        harm: { text: "Neglect medical needs.", consequence: "{childName} is endangered." }
      }
    },
    3: {
      title: "Few Peers to Play With",
      topic: "Social isolation",
      scene: "{childName} has few or no nearby peers. Siblings or solitary play are primary.",
      choices: {
        connect: { text: "Be their play partner; create connection.", consequence: "{childName} bonds with you." },
        teach: { text: "Teach independent and creative play.", consequence: "Imagination develops." },
        boundary: { text: "Technology connects them when possible.", consequence: "Some social contact exists." },
        avoid: { text: "Leave them constantly alone.", consequence: "{childName} becomes lonely." },
        harm: { text: "Ignore their isolation.", consequence: "{childName} internalizes loneliness." }
      }
    },
    4: {
      title: "Schooling Challenges: Homeschool or Far Away",
      topic: "Education access",
      scene: "{childName} is either homeschooled or must travel far for school.",
      choices: {
        connect: { text: "Provide quality education actively.", consequence: "{childName} learns well." },
        teach: { text: "Help them adjust to their education reality.", consequence: "Learning is prioritized." },
        boundary: { text: "Education quality isn't sacrificed.", consequence: "Their future is protected." },
        avoid: { text: "Neglect their education.", consequence: "{childName} falls behind." },
        harm: { text: "Isolate them from learning.", consequence: "{childName} has no foundation." }
      }
    },
    5: {
      title: "Self-Sufficiency Skills Develop",
      topic: "Rural competence",
      scene: "{childName} learns farm/rural skills: raising animals, growing food, fixing things.",
      choices: {
        connect: { text: "Share the skills; make it bonding.", consequence: "{childName} loves the work with you." },
        teach: { text: "Teach why these skills matter.", consequence: "They see value." },
        boundary: { text: "Work is age-appropriate.", consequence: "They're not overworked." },
        avoid: { text: "Ignore their skill development.", consequence: "{childName} has no competence." },
        harm: { text: "Work them too hard.", consequence: "{childName} resents rural life." }
      }
    },
    6: {
      title: "First Time in a City or Town",
      topic: "Massive culture shock",
      scene: "{childName} goes to a town/city for a day. Overstimulation and wonder mix.",
      choices: {
        connect: { text: "Process the experience together.", consequence: "{childName} feels understood." },
        teach: { text: "Explain what they saw.", consequence: "They make sense of it." },
        boundary: { text: "Rural home is still home.", consequence: "Both worlds are valid." },
        avoid: { text: "Dismiss their reaction.", consequence: "{childName} feels unseen." },
        harm: { text: "Say 'see, the city is better.'", consequence: "{childName} becomes dissatisfied." }
      }
    },
    7: {
      title: "School Friends Live Far Away",
      topic: "Friendship maintenance",
      scene: "{childName} has school friends but can't easily hang out. Isolation despite friends.",
      choices: {
        connect: { text: "Help them maintain friendships creatively.", consequence: "{childName} keeps connections." },
        teach: { text: "Discuss what friendship means at distance.", consequence: "They value quality." },
        boundary: { text: "Technology helps but can't replace presence.", consequence: "Reality is understood." },
        avoid: { text: "Isolate them from friends.", consequence: "{childName} is very lonely." },
        harm: { text: "Discourage friendships.", consequence: "{childName} has no peers." }
      }
    },
    8: {
      title: "Economic Hardship: Rural Poverty",
      topic: "Financial struggle",
      scene: "{childName} realizes the family doesn't have money. Rural area means limited opportunity.",
      choices: {
        connect: { text: "Be honest about finances without burdening them.", consequence: "{childName} understands." },
        teach: { text: "Discuss how to manage with limited resources.", consequence: "They learn resourcefulness." },
        boundary: { text: "Don't make them feel they caused it.", consequence: "They're not responsible." },
        avoid: { text: "Hide financial struggle.", consequence: "{childName} worries secretly." },
        harm: { text: "Blame {childName} for poverty.", consequence: "{childName} feels ashamed." }
      }
    },
    9: {
      title: "Dangerous Weather or Natural Events",
      topic: "Real danger",
      scene: "Storms, floods, or severe weather threaten your rural home.",
      choices: {
        connect: { text: "Keep them safe; be calm and prepared.", consequence: "{childName} trusts you." },
        teach: { text: "Teach them emergency preparedness.", consequence: "They learn resilience." },
        boundary: { text: "Prepare without creating excessive fear.", consequence: "Realism is balanced." },
        avoid: { text: "Panic or ignore danger.", consequence: "{childName} is confused." },
        harm: { text: "Use danger to scare them.", consequence: "{childName} becomes anxious." }
      }
    },
    10: {
      title: "School: Finally Meeting More Peers",
      topic: "Expansion",
      scene: "{childName} gets to school where there are many kids. Social world explodes.",
      choices: {
        connect: { text: "Help them navigate the social expansion.", consequence: "{childName} adjusts well." },
        teach: { text: "Discuss making friends in new context.", consequence: "Social skills develop." },
        boundary: { text: "Rural home is still important.", consequence: "Both worlds matter." },
        avoid: { text: "Leave them to figure it out.", consequence: "{childName} might struggle." },
        harm: { text: "Isolate them from school social life.", consequence: "{childName} remains socially stunted." }
      }
    },
    11: {
      title: "Peers Tease About Rural Background",
      topic: "Social vulnerability",
      scene: "Urban/suburban kids make fun of {childName}'s accent, clothes, or rural background.",
      choices: {
        connect: { text: "Validate their experience; build confidence.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss their unique heritage as strength.", consequence: "Pride develops." },
        boundary: { text: "No tolerance for bullying.", consequence: "They're protected." },
        avoid: { text: "Ignore their experience.", consequence: "{childName} internalizes shame." },
        harm: { text: "Push them to hide who they are.", consequence: "{childName} becomes invisible." }
      }
    },
    12: {
      title: "Dreams of Leaving (The City, Elsewhere)",
      topic: "Escape fantasy",
      scene: "{childName} dreams of leaving rural life. City seems exciting; home seems limiting.",
      choices: {
        connect: { text: "Understand their dreams without judgment.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss both rural and urban realities.", consequence: "Vision is balanced." },
        boundary: { text: "They're allowed to leave if they choose.", consequence: "Their future is theirs." },
        avoid: { text: "Ignore their dissatisfaction.", consequence: "{childName} internalizes resentment." },
        harm: { text: "Say 'you're ungrateful.'", consequence: "{childName} hides dreams." }
      }
    },
    13: {
      title: "Skills Advantage: Self-Sufficiency",
      topic: "Rural strength",
      scene: "{childName} realizes they can do things peers can't: fix things, survive outdoors, grow food.",
      choices: {
        connect: { text: "Celebrate these skills.", consequence: "{childName} feels proud." },
        teach: { text: "Help them see this as advantage.", consequence: "They value their background." },
        boundary: { text: "Skills don't have to define them.", consequence: "Options feel open." },
        avoid: { text: "Minimize their skills.", consequence: "{childName} doesn't value them." },
        harm: { text: "Push rural skills over all else.", consequence: "{childName} feels trapped." }
      }
    },
    14: {
      title: "Technology Access Gap Widens",
      topic: "Information disparity",
      scene: "{childName} realizes they have less technology access than peers. Disadvantage becomes clear.",
      choices: {
        connect: { text: "Provide access if possible.", consequence: "{childName} can compete." },
        teach: { text: "Discuss inequality thoughtfully.", consequence: "They understand systemic issues." },
        boundary: { text: "Lack of technology doesn't define their intelligence.", consequence: "Self-worth remains." },
        avoid: { text: "Ignore the gap.", consequence: "{childName} feels inadequate." },
        harm: { text: "Say 'you're behind forever.'", consequence: "{childName} internalizes limitation." }
      }
    },
    15: {
      title: "College Options: Leave or Stay Local",
      topic: "Future crossroads",
      scene: "{childName} is 15. College might require leaving the rural area.",
      choices: {
        connect: { text: "Explore college options together.", consequence: "{childName} feels guided." },
        teach: { text: "Discuss costs and benefits of leaving.", consequence: "Decision is informed." },
        boundary: { text: "Their choice is respected.", consequence: "Autonomy is real." },
        avoid: { text: "Push them to leave.", consequence: "{childName} might resent it." },
        harm: { text: "Guilt them for wanting to leave.", consequence: "{childName} stays resentfully." }
      }
    },
    16: {
      title: "Part-Time Work or Economic Necessity",
      topic: "Growing up fast",
      scene: "{childName} might need to work to help family or earn. Rural economics are real.",
      choices: {
        connect: { text: "Support them; ensure school isn't sacrificed.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss balancing work and future.", consequence: "They learn to plan." },
        boundary: { text: "Work doesn't prevent education.", consequence: "Future remains open." },
        avoid: { text: "Let work consume them.", consequence: "{childName} doesn't get educated." },
        harm: { text: "Expect them to support the family.", consequence: "{childName} loses childhood." }
      }
    },
    17: {
      title: "Final Decision: Stay or Leave Rural Home",
      topic: "Life-defining choice",
      scene: "{childName} is 17. Will they leave the rural area for opportunity? Or stay?",
      choices: {
        connect: { text: "Support their authentic choice.", consequence: "{childName} feels free." },
        teach: { text: "Discuss what each path costs and offers.", consequence: "They choose wisely." },
        boundary: { text: "Their choice doesn't define your relationship.", consequence: "Love survives difference." },
        avoid: { text: "Act hurt by their choice.", consequence: "{childName} feels guilty." },
        harm: { text: "Disown them if they leave.", consequence: "{childName} is devastated." }
      }
    },
    18: {
      title: "Adult Path: Connected to Roots or Departed",
      topic: "Long-term relationship",
      scene: "{childName} is 18. Whatever they've chosen, can your relationship survive?",
      choices: {
        connect: { text: "Maintain connection despite distance.", consequence: "Love bridges geography." },
        teach: { text: "Share your journey; respect theirs.", consequence: "Mutual respect develops." },
        boundary: { text: "Rural home will always be theirs.", consequence: "They belong there." },
        avoid: { text: "Guilt them about leaving.", consequence: "Distance becomes permanent." },
        harm: { text: "Punish them for their choice.", consequence: "Relationship breaks." }
      }
    }
  },

  tiny_apartment_city: {
    1: {
      title: "Born in Cramped Urban Space",
      topic: "Tight quarters",
      scene: "{childName} is born in a tiny apartment in the city. No personal space. All sounds amplified.",
      choices: {
        connect: { text: "Create coziness and safety despite cramped space.", consequence: "{childName} feels secure." },
        teach: { text: "Teach them about city living.", consequence: "It becomes normal." },
        boundary: { text: "Protect their sleep and basic needs.", consequence: "Health is maintained." },
        avoid: { text: "Neglect their basic needs.", consequence: "{childName} is uncomfortable." },
        harm: { text: "Use cramped space to control them.", consequence: "{childName} feels trapped." }
      }
    },
    2: {
      title: "Noise, Crowds, Constant Stimulation",
      topic: "Sensory overload",
      scene: "{childName} lives amid city noise: sirens, neighbors, traffic. Quiet doesn't exist.",
      choices: {
        connect: { text: "Create quiet moments together.", consequence: "{childName} has refuge." },
        teach: { text: "Help them filter noise; find calm.", consequence: "They develop coping skills." },
        boundary: { text: "Their need for quiet is honored.", consequence: "They can rest." },
        avoid: { text: "Ignore their overstimulation.", consequence: "{childName} becomes anxious." },
        harm: { text: "Use noise as punishment.", consequence: "{childName} becomes traumatized." }
      }
    },
    3: {
      title: "Limited Outdoor Space: Sidewalk Play",
      topic: "Street life",
      scene: "{childName}'s play is on the sidewalk or stoop. Parks exist but are crowded.",
      choices: {
        connect: { text: "Supervise street play; make it bonding.", consequence: "{childName} enjoys play with you." },
        teach: { text: "Teach city safety and streetsmarts.", consequence: "They learn to navigate." },
        boundary: { text: "Play is safe and age-appropriate.", consequence: "They're protected." },
        avoid: { text: "Leave them unsupervised on streets.", consequence: "{childName} is at risk." },
        harm: { text: "Keep them indoors all the time.", consequence: "{childName} doesn't develop normally." }
      }
    },
    4: {
      title: "Poverty Visibility: Homelessness and Inequality",
      topic: "Economic reality",
      scene: "{childName} sees homelessness, poverty, and inequality daily. It's visible on every corner.",
      choices: {
        connect: { text: "Process what they see together.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss poverty and inequality age-appropriately.", consequence: "They understand systems." },
        boundary: { text: "Awareness shouldn't paralyze them.", consequence: "They develop compassion." },
        avoid: { text: "Ignore what they see.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Teach them to ignore the poor.", consequence: "{childName} becomes callous." }
      }
    },
    5: {
      title: "Neighborhood Danger: Crime, Drugs, Violence",
      topic: "Real safety concern",
      scene: "{childName} is aware of danger in their neighborhood. Sirens. Arguments. Risk.",
      choices: {
        connect: { text: "Keep them safe while being honest.", consequence: "{childName} understands reality." },
        teach: { text: "Teach awareness and street smarts.", consequence: "They learn to navigate." },
        boundary: { text: "Danger is minimized through supervision.", consequence: "They're protected." },
        avoid: { text: "Dismiss the danger.", consequence: "{childName} is at risk." },
        harm: { text: "Expose them to danger.", consequence: "{childName} is traumatized." }
      }
    },
    6: {
      title: "School: Diverse & Often Underfunded",
      topic: "Education inequality",
      scene: "{childName} attends crowded, diverse public school. Resources are limited.",
      choices: {
        connect: { text: "Support their education actively.", consequence: "{childName} learns well." },
        teach: { text: "Help them navigate school politics.", consequence: "They advocate for themselves." },
        boundary: { text: "Education quality matters; you supplement if needed.", consequence: "Learning is supported." },
        avoid: { text: "Accept educational neglect.", consequence: "{childName} falls behind." },
        harm: { text: "Ignore school problems.", consequence: "{childName} doesn't get educated." }
      }
    },
    7: {
      title: "Neighbor Conflicts or Landlord Issues",
      topic: "Housing instability",
      scene: "{childName} hears arguments with neighbors or landlord. Housing feels precarious.",
      choices: {
        connect: { text: "Reassure them about housing security.", consequence: "{childName} feels safe." },
        teach: { text: "Explain tenant rights age-appropriately.", consequence: "They understand systems." },
        boundary: { text: "Their safety is prioritized.", consequence: "They're protected." },
        avoid: { text: "Expose them to housing stress.", consequence: "{childName} becomes anxious." },
        harm: { text: "Make them feel responsible for housing.", consequence: "{childName} develops shame." }
      }
    },
    8: {
      title: "Eviction Risk or Move Threat",
      topic: "Instability",
      scene: "{childName} overhears rent problems. Eviction or moving feels possible.",
      choices: {
        connect: { text: "Be honest but reassuring about housing.", consequence: "{childName} feels informed." },
        teach: { text: "Help them understand housing as adult issue.", consequence: "They're not responsible." },
        boundary: { text: "They're not burdened with adult worry.", consequence: "They stay a child." },
        avoid: { text: "Hide housing problems.", consequence: "{childName} worries secretly." },
        harm: { text: "Make them feel guilty about expense.", consequence: "{childName} develops shame." }
      }
    },
    9: {
      title: "Limited Privacy: Shared Walls, Thin Doors",
      topic: "No boundaries",
      scene: "{childName} has little privacy. Arguments are heard. Intimacy has no privacy.",
      choices: {
        connect: { text: "Create small private spaces for them.", consequence: "{childName} has refuge." },
        teach: { text: "Discuss privacy as normal need.", consequence: "They understand it matters." },
        boundary: { text: "Their privacy is protected as much as possible.", consequence: "Boundaries are honored." },
        avoid: { text: "Ignore their need for privacy.", consequence: "{childName} struggles." },
        harm: { text: "Use lack of privacy to control them.", consequence: "{childName} feels violated." }
      }
    },
    10: {
      title: "Peers Have More Space, More Stuff",
      topic: "Comparison emerges",
      scene: "{childName} visits peers with houses, bedrooms, backyards. Comparison hurts.",
      choices: {
        connect: { text: "Validate their feelings without shame.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss different ways of living.", consequence: "They see values beyond stuff." },
        boundary: { text: "Their home is valid even if different.", consequence: "Pride is maintained." },
        avoid: { text: "Ignore their comparison pain.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'we have nothing.'", consequence: "{childName} becomes ashamed." }
      }
    },
    11: {
      title: "Doing Homework in Shared, Noisy Space",
      topic: "Educational struggle",
      scene: "{childName} does homework in living room. No quiet space. Concentration is hard.",
      choices: {
        connect: { text: "Create study space together.", consequence: "{childName} can focus." },
        teach: { text: "Help them develop focus strategies.", consequence: "They learn to manage." },
        boundary: { text: "Their study time is protected.", consequence: "Education is supported." },
        avoid: { text: "Ignore homework environment.", consequence: "{childName} falls behind." },
        harm: { text: "Say 'stop complaining and study.'", consequence: "{childName} gives up." }
      }
    },
    12: {
      title: "Food Insecurity or Inconsistent Meals",
      topic: "Survival concern",
      scene: "{childName} realizes meals might be uncertain. Food security is at risk.",
      choices: {
        connect: { text: "Get help from food banks or programs.", consequence: "{childName} eats." },
        teach: { text: "Don't shame them about food access.", consequence: "They don't develop eating issues." },
        boundary: { text: "Their nutrition is prioritized.", consequence: "Health is maintained." },
        avoid: { text: "Ignore food insecurity.", consequence: "{childName} is hungry and stressed." },
        harm: { text: "Make them feel guilty about food need.", consequence: "{childName} develops eating disorders." }
      }
    },
    13: {
      title: "Work & School: Necessity vs. Education",
      topic: "Growing up fast",
      scene: "{childName} might need to work to help family. School and work compete.",
      choices: {
        connect: { text: "Support them; ensure education stays priority.", consequence: "{childName} can manage both." },
        teach: { text: "Discuss long-term value of education.", consequence: "They stay motivated." },
        boundary: { text: "Their future isn't sacrificed.", consequence: "Education is protected." },
        avoid: { text: "Push them into full-time work.", consequence: "{childName} doesn't graduate." },
        harm: { text: "Burden them with supporting family.", consequence: "{childName} loses childhood." }
      }
    },
    14: {
      title: "Social Stigma: Feeling Poor or Less-Than",
      topic: "Identity shame",
      scene: "{childName} feels stigmatized for being poor. Shame about their home emerges.",
      choices: {
        connect: { text: "Validate their pain; build confidence.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss structural inequality.", consequence: "Shame shifts to systemic critique." },
        boundary: { text: "Poverty isn't shameful; systems are.", consequence: "They separate self-worth from money." },
        avoid: { text: "Ignore their shame.", consequence: "{childName} internalizes it." },
        harm: { text: "Agree they should be ashamed.", consequence: "{childName} hates themselves." }
      }
    },
    15: {
      title: "Dreams Beyond Their Neighborhood",
      topic: "Escape fantasy",
      scene: "{childName} dreams of leaving their neighborhood. Dreams of stability and space.",
      choices: {
        connect: { text: "Support their dreams without judgment.", consequence: "{childName} feels heard." },
        teach: { text: "Help them plan realistic pathways.", consequence: "Dreams become actionable." },
        boundary: { text: "Dreams are valid and possible.", consequence: "Hope is maintained." },
        avoid: { text: "Dismiss their dreams as unrealistic.", consequence: "{childName} gives up." },
        harm: { text: "Say 'you're stuck here forever.'", consequence: "{childName} becomes hopeless." }
      }
    },
    16: {
      title: "College & Moving Out: First Real Option",
      topic: "Future path",
      scene: "{childName} is 16. College (if affordable) is a way out. Real opportunity emerges.",
      choices: {
        connect: { text: "Support college goals fiercely.", consequence: "{childName} pursues education." },
        teach: { text: "Help them navigate college access.", consequence: "They understand options." },
        boundary: { text: "Education is the path forward.", consequence: "They stay focused." },
        avoid: { text: "Dismiss college as not for them.", consequence: "{childName} stays trapped." },
        harm: { text: "Guilt them about leaving family.", consequence: "{childName} doesn't pursue opportunity." }
      }
    },
    17: {
      title: "Final Decision: Try to Leave or Stay Put",
      topic: "Life-defining choice",
      scene: "{childName} is 17. Do they pursue options to move up/out? Or accept their situation?",
      choices: {
        connect: { text: "Support whatever authentic choice they make.", consequence: "{childName} feels truly free." },
        teach: { text: "Discuss both paths honestly.", consequence: "They choose with eyes open." },
        boundary: { text: "Their choice doesn't define your love.", consequence: "Relationship survives difference." },
        avoid: { text: "Push them toward one path.", consequence: "{childName} might resent it." },
        harm: { text: "Guilt them for wanting to leave.", consequence: "{childName} stays resentfully." }
      }
    },
    18: {
      title: "Adult Independence: Building Their Own Stability",
      topic: "Self-determination",
      scene: "{childName} is 18. They're working toward their own stable future, whatever that looks like.",
      choices: {
        connect: { text: "Support their path toward independence.", consequence: "{childName} feels backed." },
        teach: { text: "Share wisdom about building stability.", consequence: "They learn from you." },
        boundary: { text: "Their future is theirs to build.", consequence: "Autonomy is honored." },
        avoid: { text: "Act like they owe you.", consequence: "{childName} feels trapped." },
        harm: { text: "Expect them to rescue the family.", consequence: "{childName} is burdened." }
      }
    }
  }
};