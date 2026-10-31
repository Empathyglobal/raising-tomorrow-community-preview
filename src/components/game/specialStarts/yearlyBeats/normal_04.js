export const SPECIAL_START_YEARLY_BEATS__NORMAL_04 = {
  two_working_parents_childcare: {
    1: {
      title: "Born Into Dual-Income Household",
      topic: "Working parents from start",
      scene: "{childName} is born to two working parents. Both return to work quickly.",
      choices: {
        connect: { text: "Make homecoming moments count.", consequence: "{childName} feels loved." },
        teach: { text: "Explain that work and love coexist.", consequence: "They understand." },
        boundary: { text: "Childcare is reliable and warm.", consequence: "They're secure." },
        avoid: { text: "Treat childcare as purely logistical.", consequence: "{childName} feels like logistics." },
        harm: { text: "Neglect quality time with them.", consequence: "{childName} feels abandoned." }
      }
    },
    2: {
      title: "Childcare as Second Home",
      topic: "Consistent caregiver relationship",
      scene: "{childName} spends more waking hours with childcare provider than parents.",
      choices: {
        connect: { text: "Build strong relationship with provider.", consequence: "{childName} is secure." },
        teach: { text: "Help them understand different caregivers.", consequence: "They're adaptable." },
        boundary: { text: "Childcare is safe and nurturing.", consequence: "Attachment is secure." },
        avoid: { text: "Neglect provider relationship.", consequence: "{childName} feels unstable." },
        harm: { text: "Use childcare as punishment site.", consequence: "{childName} fears it." }
      }
    },
    3: {
      title: "Routine & Consistency: Schedules Are Everything",
      topic: "Structure dependent",
      scene: "{childName} grows up with strict schedules. Predictability matters.",
      choices: {
        connect: { text: "Make routine reliable and loving.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss why routines help.", consequence: "They understand structure." },
        boundary: { text: "Flexibility exists within routine.", consequence: "They're not rigid." },
        avoid: { text: "Make routines chaotic and stressful.", consequence: "{childName} feels anxious." },
        harm: { text: "Use routine as control tool.", consequence: "{childName} becomes rigid." }
      }
    },
    4: {
      title: "School Pickup: Parent or Childcare?",
      topic: "After-school transitions",
      scene: "{childName} is in school. After-school care or parent pickup?",
      choices: {
        connect: { text: "Ensure transitions are warm and predictable.", consequence: "{childName} adapts well." },
        teach: { text: "Explain transitions age-appropriately.", consequence: "They understand routine." },
        boundary: { text: "They're not shuffled callously.", consequence: "They feel cared for." },
        avoid: { text: "Make transitions chaotic.", consequence: "{childName} feels unsettled." },
        harm: { text: "Make pickup/dropoff punitive.", consequence: "{childName} feels unwanted." }
      }
    },
    5: {
      title: "Weekend & Evening Time: Quality Over Quantity",
      topic: "Concentrated parent time",
      scene: "{childName} has weekends and evenings with parents. Must be quality.",
      choices: {
        connect: { text: "Be fully present during time together.", consequence: "{childName} feels seen." },
        teach: { text: "Discuss that concentrated time is real connection.", consequence: "They value depth." },
        boundary: { text: "Work doesn't encroach on family time.", consequence: "They're prioritized." },
        avoid: { text: "Work through family time.", consequence: "{childName} feels deprioritized." },
        harm: { text: "Use together time to catch up on chores.", consequence: "{childName} feels unimportant." }
      }
    },
    6: {
      title: "School: Two Different Family Routines",
      topic: "Household complexity",
      scene: "{childName} goes to school where two-working-parent families are normal.",
      choices: {
        connect: { text: "Normalize their family structure.", consequence: "{childName} feels normal." },
        teach: { text: "Discuss that families work differently.", consequence: "They see diversity." },
        boundary: { text: "Their structure is valid.", consequence: "They're not ashamed." },
        avoid: { text: "Act like their structure is deficient.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'you need a stay-at-home parent.'", consequence: "{childName} resents their family." }
      }
    },
    7: {
      title: "Independence Emerging: More Self-Directed",
      topic: "Responsibility growth",
      scene: "{childName} is 7. They're learning to be more independent.",
      choices: {
        connect: { text: "Support independence with guidance.", consequence: "{childName} becomes capable." },
        teach: { text: "Discuss that independence is skill.", consequence: "They develop it." },
        boundary: { text: "They're still supervised appropriately.", consequence: "Safety is maintained." },
        avoid: { text: "Push too much independence too soon.", consequence: "{childName} feels abandoned." },
        harm: { text: "Expect adult responsibility from them.", consequence: "{childName} matures too fast." }
      }
    },
    8: {
      title: "Parental Stress: They Notice It",
      topic: "Work-life balance tension",
      scene: "{childName} is 8. They notice parents are tired and stressed.",
      choices: {
        connect: { text: "Be honest about stress without burdening them.", consequence: "{childName} understands." },
        teach: { text: "Discuss that work stress is normal.", consequence: "They're not scared." },
        boundary: { text: "Stress isn't their responsibility.", consequence: "They're a kid." },
        avoid: { text: "Vent to them about work.", consequence: "{childName} internalizes stress." },
        harm: { text: "Make them feel responsible for parent stress.", consequence: "{childName} develops guilt." }
      }
    },
    9: {
      title: "Identifying as Independent: That's Who They Are",
      topic: "Self-reliance forming",
      scene: "{childName} is 9. Independence is becoming core identity.",
      choices: {
        connect: { text: "Support independence while staying connected.", consequence: "{childName} is balanced." },
        teach: { text: "Discuss that independence and connection coexist.", consequence: "They see harmony." },
        boundary: { text: "Independence doesn't mean isolation.", consequence: "They stay emotionally close." },
        avoid: { text: "Encourage unhealthy independence.", consequence: "{childName} becomes isolated." },
        harm: { text: "Punish them for needing help.", consequence: "{childName} stops asking." }
      }
    },
    10: {
      title: "Feeling Neglected Sometimes: Can Both Parents Prioritize?",
      topic: "Parental attention tension",
      scene: "{childName} is 10. Sometimes feels parents' work comes first.",
      choices: {
        connect: { text: "Acknowledge the feeling; increase intentional time.", consequence: "{childName} feels valued." },
        teach: { text: "Discuss that both work and love matter.", consequence: "They understand complexity." },
        boundary: { text: "They're sometimes disappointed; that's okay.", consequence: "They develop resilience." },
        avoid: { text: "Dismiss their feelings.", consequence: "{childName} internalizes invalidation." },
        harm: { text: "Guilt-trip them for the feeling.", consequence: "{childName} hides emotions." }
      }
    },
    11: {
      title: "After-School Independence: Latchkey or Childcare?",
      topic: "Growing autonomy",
      scene: "{childName} is 11. Are they ready for some unsupervised time?",
      choices: {
        connect: { text: "Transition thoughtfully to age-appropriate independence.", consequence: "{childName} feels trusted." },
        teach: { text: "Discuss safety and responsibility.", consequence: "They're prepared." },
        boundary: { text: "They're supported, not abandoned.", consequence: "They're safe." },
        avoid: { text: "Throw them into unsupervised time unprepared.", consequence: "{childName} feels unsafe." },
        harm: { text: "Make them responsible for younger siblings.", consequence: "{childName} loses childhood." }
      }
    },
    12: {
      title: "Homework & Support: Who Helps?",
      topic: "Educational engagement",
      scene: "{childName} is 12. Homework support needs to come from somewhere.",
      choices: {
        connect: { text: "Ensure they get academic support somehow.", consequence: "{childName} succeeds." },
        teach: { text: "Help them advocate for their needs.", consequence: "They become independent learners." },
        boundary: { text: "Support is available even if not from parents.", consequence: "They're not neglected." },
        avoid: { text: "Ignore homework needs.", consequence: "{childName} falls behind." },
        harm: { text: "Punish them for not managing homework alone.", consequence: "{childName} resents school." }
      }
    },
    13: {
      title: "Dating & Relationships: Balancing Parental Availability",
      topic: "Social development",
      scene: "{childName} is 13 and developing romantic interests.",
      choices: {
        connect: { text: "Make time for conversations about relationships.", consequence: "{childName} can talk to you." },
        teach: { text: "Discuss relationships within your availability.", consequence: "They feel supported." },
        boundary: { text: "They're not expected to navigate alone.", consequence: "They can ask for help." },
        avoid: { text: "Be unavailable for relationship questions.", consequence: "{childName} doesn't come to you." },
        harm: { text: "Shame them for developing interest.", consequence: "{childName} hides." }
      }
    },
    14: {
      title: "Summer Camps & Activities: Filling the Gap",
      topic: "Organized care",
      scene: "{childName} is 14. Summer requires different care arrangements.",
      choices: {
        connect: { text: "Find activities they enjoy.", consequence: "{childName} has good summer." },
        teach: { text: "Discuss why summer care is necessary.", consequence: "They understand." },
        boundary: { text: "Activities are somewhat their choice.", consequence: "They're not just babysat." },
        avoid: { text: "Dump them in unsupervised situations.", consequence: "{childName} feels abandoned." },
        harm: { text: "Use summer as unpaid labor time.", consequence: "{childName} loses childhood." }
      }
    },
    15: {
      title: "Appreciating Parent Work Ethic: Or Resenting It",
      topic: "Values conflict",
      scene: "{childName} is 15. Do they respect parent work ethic or resent it?",
      choices: {
        connect: { text: "Share your work values without pressure.", consequence: "{childName} understands." },
        teach: { text: "Discuss balance between ambition and presence.", consequence: "They see complexity." },
        boundary: { text: "Your choices are yours; theirs will be theirs.", consequence: "Autonomy is honored." },
        avoid: { text: "Expect them to adopt your work ethic.", consequence: "{childName} might rebel." },
        harm: { text: "Guilt-trip them about family sacrifices.", consequence: "{childName} internalizes burden." }
      }
    },
    16: {
      title: "First Job or Commitment: Their Own Priorities",
      topic: "Independence milestone",
      scene: "{childName} is 16. First job or serious commitment of their own.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss balance they'll need.", consequence: "They learn early." },
        boundary: { text: "Their path is theirs to choose.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward work like you.", consequence: "{childName} might resent it." },
        harm: { text: "Shame them for not being ambitious enough.", consequence: "{childName} internalizes inadequacy." }
      }
    },
    17: {
      title: "Understanding Parent Choices: Why You Both Work",
      topic: "Empathy and values",
      scene: "{childName} is 17. Can they understand why both parents work?",
      choices: {
        connect: { text: "Share your reasons openly.", consequence: "{childName} understands you." },
        teach: { text: "Discuss financial and personal reasons.", consequence: "They see full picture." },
        boundary: { text: "Complexity is allowed.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss your choices.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame them for your need to work.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Adult Life: Their Own Work-Life Balance",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own approach to work and family.",
      choices: {
        connect: { text: "Support whatever balance they choose.", consequence: "{childName} feels free." },
        teach: { text: "Share wisdom about sustainable living.", consequence: "They build wisely." },
        boundary: { text: "Their choices are theirs.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward your model.", consequence: "{childName} might resent it." },
        harm: { text: "Guilt-trip them for different choices.", consequence: "{childName} internalizes burden." }
      }
    }
  },

  eldercare_shared: {
    1: {
      title: "Born Into Multigenerational Home",
      topic: "Extended family present",
      scene: "{childName} is born into household with aging grandparent or elder.",
      choices: {
        connect: { text: "Help them bond with elder naturally.", consequence: "{childName} has intergenerational connection." },
        teach: { text: "Explain that elders are part of family.", consequence: "They see continuity." },
        boundary: { text: "Caregiving doesn't fall on them.", consequence: "They're a child." },
        avoid: { text: "Make child responsible for elder care.", consequence: "{childName} loses childhood." },
        harm: { text: "Neglect elder in front of child.", consequence: "{childName} internalizes abandonment." }
      }
    },
    2: {
      title: "Elder Presence: Normal Household Member",
      topic: "Multigenerational rhythm",
      scene: "{childName} grows up with elder's routines, stories, and presence.",
      choices: {
        connect: { text: "Facilitate warm relationship.", consequence: "{childName} loves elder." },
        teach: { text: "Help them appreciate elder wisdom.", consequence: "They learn from age." },
        boundary: { text: "Elder's needs are managed, not put on child.", consequence: "They're protected." },
        avoid: { text: "Use child as entertainment for elder.", consequence: "{childName} becomes performing." },
        harm: { text: "Use child as free elder care.", consequence: "{childName} resents elder." }
      }
    },
    3: {
      title: "Understanding Aging: Elder Health Changes",
      topic: "Early aging awareness",
      scene: "{childName} is 3-4. Elder's health is changing. They notice.",
      choices: {
        connect: { text: "Explain changes gently and honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss aging as natural.", consequence: "They accept change." },
        boundary: { text: "Changes aren't their fault or responsibility.", consequence: "They're not scared." },
        avoid: { text: "Hide elder's decline.", consequence: "{childName} is confused." },
        harm: { text: "Make them feel elder's health is their problem.", consequence: "{childName} internalizes burden." }
      }
    },
    4: {
      title: "School: Different from Other Kids' Homes",
      topic: "Family structure uniqueness",
      scene: "{childName} is in school. Their multigenerational home is different.",
      choices: {
        connect: { text: "Normalize their family structure.", consequence: "{childName} feels normal." },
        teach: { text: "Discuss that families come in many forms.", consequence: "They see diversity." },
        boundary: { text: "Their structure is valid.", consequence: "They're not ashamed." },
        avoid: { text: "Act like their structure is deficient.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'only old people have multigenerational homes.'", consequence: "{childName} resents family." }
      }
    },
    5: {
      title: "Caregiving Responsibility: Awareness of Parent's Burden",
      topic: "Implicit understanding",
      scene: "{childName} is 5. They're aware parent is caring for elder.",
      choices: {
        connect: { text: "Acknowledge the effort without burdening them.", consequence: "{childName} is compassionate." },
        teach: { text: "Discuss caregiving as love.", consequence: "They understand." },
        boundary: { text: "Caregiving is adult responsibility.", consequence: "They're a child." },
        avoid: { text: "Complain constantly about caregiving burden.", consequence: "{childName} internalizes stress." },
        harm: { text: "Make them feel guilty about parent's burden.", consequence: "{childName} develops guilt." }
      }
    },
    6: {
      title: "Elder Decline: Loss of Function",
      topic: "Grief emerging",
      scene: "{childName} is 6. Elder is noticeably declining. They grieve.",
      choices: {
        connect: { text: "Process loss together.", consequence: "{childName} can grieve." },
        teach: { text: "Discuss that grief is love.", consequence: "They understand." },
        boundary: { text: "They're not responsible for reversing decline.", consequence: "They're not burdened." },
        avoid: { text: "Hide the decline.", consequence: "{childName} is confused." },
        harm: { text: "Tell them 'you're making it worse.'", consequence: "{childName} internalizes guilt." }
      }
    },
    7: {
      title: "Balancing Attention: Elder & Child Needs",
      topic: "Parental divided attention",
      scene: "{childName} is 7. Parent's attention is sometimes taken by elder care.",
      choices: {
        connect: { text: "Make time intentionally for them.", consequence: "{childName} feels valued." },
        teach: { text: "Discuss that multiple people can matter.", consequence: "They understand." },
        boundary: { text: "They're not deprioritized permanently.", consequence: "They're secure." },
        avoid: { text: "Consistently neglect them for elder.", consequence: "{childName} feels unimportant." },
        harm: { text: "Guilt-trip them about elder care.", consequence: "{childName} internalizes resentment." }
      }
    },
    8: {
      title: "Making Memories: Time with Elder",
      topic: "Precious moments",
      scene: "{childName} is 8. Creating memories with elder while they can.",
      choices: {
        connect: { text: "Facilitate special time together.", consequence: "{childName} treasures moments." },
        teach: { text: "Help them see value in time.", consequence: "They appreciate presence." },
        boundary: { text: "Time together is genuine, not obligatory.", consequence: "Love is real." },
        avoid: { text: "Forced time without genuine connection.", consequence: "{childName} resents it." },
        harm: { text: "Use child to perform for elder.", consequence: "{childName} feels used." }
      }
    },
    9: {
      title: "Identifying as Part of Multigenerational Family",
      topic: "Family identity",
      scene: "{childName} is 9. Their identity includes caring for elders.",
      choices: {
        connect: { text: "Celebrate this identity positively.", consequence: "{childName} feels proud." },
        teach: { text: "Discuss that this is special responsibility.", consequence: "They understand value." },
        boundary: { text: "It's one part of identity, not all.", consequence: "They're multifaceted." },
        avoid: { text: "Make caregiving their entire identity.", consequence: "{childName} has no other self." },
        harm: { text: "Say 'you're responsible for elder.'", consequence: "{childName} internalizes burden." }
      }
    },
    10: {
      title: "School & Home: Managing Dual Worlds",
      topic: "Compartmentalization",
      scene: "{childName} is 10. School is normal. Home has elder care.",
      choices: {
        connect: { text: "Help them transition between worlds.", consequence: "{childName} balances well." },
        teach: { text: "Discuss that both are real.", consequence: "They integrate." },
        boundary: { text: "School and home are separate.", consequence: "They're not exhausted." },
        avoid: { text: "Bring home stress to school.", consequence: "{childName} performs poorly." },
        harm: { text: "Use home responsibilities to avoid homework.", consequence: "{childName} falls behind." }
      }
    },
    11: {
      title: "Adolescence & Caregiving: Conflict in Roles",
      topic: "Development tension",
      scene: "{childName} is 11. Adolescent needs vs. family caregiving needs.",
      choices: {
        connect: { text: "Support their development while managing caregiving.", consequence: "{childName} thrives." },
        teach: { text: "Discuss that both needs are real.", consequence: "They feel understood." },
        boundary: { text: "Caregiving doesn't prevent them from growing.", consequence: "Development continues." },
        avoid: { text: "Make caregiving take priority over development.", consequence: "{childName} loses adolescence." },
        harm: { text: "Guilt-trip them for adolescent needs.", consequence: "{childName} resents caregiving." }
      }
    },
    12: {
      title: "Elder's Mortality: Facing Reality",
      topic: "Mortality awareness",
      scene: "{childName} is 12. Elder's mortality is becoming real.",
      choices: {
        connect: { text: "Discuss mortality honestly and compassionately.", consequence: "{childName} can grieve." },
        teach: { text: "Discuss that death is part of life.", consequence: "They understand." },
        boundary: { text: "Mortality isn't their fault.", consequence: "They're not burdened." },
        avoid: { text: "Avoid conversation about death.", consequence: "{childName} is confused." },
        harm: { text: "Tell them 'you should have spent more time with them.'", consequence: "{childName} internalizes guilt." }
      }
    },
    13: {
      title: "Dating & Relationships: Limited Privacy",
      topic: "Social development",
      scene: "{childName} is 13. Limited privacy in multigenerational home.",
      choices: {
        connect: { text: "Create some privacy for them.", consequence: "{childName} can develop normally." },
        teach: { text: "Discuss that privacy is important.", consequence: "They feel respected." },
        boundary: { text: "Their developing identity is protected.", consequence: "They feel safe." },
        avoid: { text: "Eliminate privacy entirely.", consequence: "{childName} becomes secretive." },
        harm: { text: "Use lack of privacy to control them.", consequence: "{childName} rebels." }
      }
    },
    14: {
      title: "Anticipatory Grief: Elder's Decline Accelerates",
      topic: "Preparing for loss",
      scene: "{childName} is 14. Elder is declining faster. Grief is active.",
      choices: {
        connect: { text: "Process grief together.", consequence: "{childName} can grieve." },
        teach: { text: "Discuss anticipatory grief.", consequence: "They understand the process." },
        boundary: { text: "Grief is valid but doesn't prevent development.", consequence: "Life continues." },
        avoid: { text: "Ignore their grief.", consequence: "{childName} internalizes loss." },
        harm: { text: "Make them feel selfish for not grieving enough.", consequence: "{childName} internalizes guilt." }
      }
    },
    15: {
      title: "Elder's Final Phase: End-of-Life Care",
      topic: "Witnessing mortality",
      scene: "{childName} is 15. Elder is in end-of-life phase.",
      choices: {
        connect: { text: "Include them appropriately in goodbye process.", consequence: "{childName} can say goodbye." },
        teach: { text: "Discuss dying process honestly.", consequence: "They understand." },
        boundary: { text: "They're included but not burdened.", consequence: "They're a teen, not caregiver." },
        avoid: { text: "Hide the dying process.", consequence: "{childName} is confused." },
        harm: { text: "Make them primary caregiver.", consequence: "{childName} loses teen years." }
      }
    },
    16: {
      title: "Grief After Loss: Processing the Absence",
      topic: "Bereavement",
      scene: "{childName} is 16. Elder has passed. House is different.",
      choices: {
        connect: { text: "Grieve together and support their grief.", consequence: "{childName} can heal." },
        teach: { text: "Discuss that grief evolves.", consequence: "They understand process." },
        boundary: { text: "Their grief is valued.", consequence: "They're supported." },
        avoid: { text: "Dismiss their grief.", consequence: "{childName} internalizes loss." },
        harm: { text: "Use their grief to burden them further.", consequence: "{childName} becomes depressed." }
      }
    },
    17: {
      title: "Understanding Your Sacrifice: Why You Cared",
      topic: "Values and meaning",
      scene: "{childName} is 17. Can they understand why you cared for elder?",
      choices: {
        connect: { text: "Share your values and motivations.", consequence: "{childName} understands." },
        teach: { text: "Discuss family obligation vs. love.", consequence: "They see complexity." },
        boundary: { text: "Your choices made sense.", consequence: "Relationship is validated." },
        avoid: { text: "Refuse to discuss caregiving.", consequence: "{childName} feels unsupported." },
        harm: { text: "Guilt-trip them about what you sacrificed.", consequence: "{childName} internalizes burden." }
      }
    },
    18: {
      title: "Adult Life: Their Own Approach to Caregiving",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own approach to family and care.",
      choices: {
        connect: { text: "Support whatever approach they choose.", consequence: "{childName} feels free." },
        teach: { text: "Share wisdom about sustainable caregiving.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward your caregiving model.", consequence: "{childName} might resent it." },
        harm: { text: "Guilt-trip them for different approach.", consequence: "{childName} internalizes burden." }
      }
    }
  },

  gifted_child: {
    1: {
      title: "Early Signs: Developmental Ahead",
      topic: "Giftedness emerging",
      scene: "{childName} shows early developmental signs. They're ahead.",
      choices: {
        connect: { text: "Love them for who they are, not ability.", consequence: "{childName} feels valued." },
        teach: { text: "Explore their interests without pressure.", consequence: "They develop naturally." },
        boundary: { text: "Childhood is still normal childhood.", consequence: "They play freely." },
        avoid: { text: "Groom them as prodigy immediately.", consequence: "{childName} feels burdened." },
        harm: { text: "Make ability the only measure of worth.", consequence: "{childName} internalizes pressure." }
      }
    },
    2: {
      title: "Early Learning: Hungry for Knowledge",
      topic: "Intellectual curiosity",
      scene: "{childName} is learning quickly and asking deep questions.",
      choices: {
        connect: { text: "Feed their curiosity without forcing.", consequence: "{childName} loves learning." },
        teach: { text: "Explore interests together.", consequence: "They enjoy discovery." },
        boundary: { text: "Playtime is still valued.", consequence: "Development is balanced." },
        avoid: { text: "Push academic learning too early.", consequence: "{childName} resents learning." },
        harm: { text: "Pressure them to perform.", consequence: "{childName} develops test anxiety." }
      }
    },
    3: {
      title: "Different From Peers: Noticeably Ahead",
      topic: "Social difference",
      scene: "{childName} is noticeably ahead of peers in development/abilities.",
      choices: {
        connect: { text: "Help them navigate being different.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss that different is okay.", consequence: "They're confident." },
        boundary: { text: "They still play with age-peers.", consequence: "Social development continues." },
        avoid: { text: "Push them only with advanced peers.", consequence: "{childName} feels isolated." },
        harm: { text: "Make them feel weird.", consequence: "{childName} hides abilities." }
      }
    },
    4: {
      title: "Testing & Identification: Is This Giftedness?",
      topic: "Formal assessment",
      scene: "{childName} is 4-5. Testing or formal identification happens.",
      choices: {
        connect: { text: "Explain testing as understanding, not judgment.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss what giftedness means.", consequence: "They understand." },
        boundary: { text: "Results don't change their worth.", consequence: "Self-worth is stable." },
        avoid: { text: "Make test results everything.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Use labels to push them harder.", consequence: "{childName} develops anxiety." }
      }
    },
    5: {
      title: "School Placement: Regular or Gifted Program?",
      topic: "Education decision",
      scene: "{childName} is 5. Decisions about gifted programs or acceleration.",
      choices: {
        connect: { text: "Choose placement based on whole child.", consequence: "{childName} thrives." },
        teach: { text: "Discuss pros/cons of different placements.", consequence: "They're prepared." },
        boundary: { text: "Their social-emotional needs matter.", consequence: "Development is balanced." },
        avoid: { text: "Push acceleration despite unreadiness.", consequence: "{childName} struggles." },
        harm: { text: "Choose placement for bragging rights.", consequence: "{childName} feels used." }
      }
    },
    6: {
      title: "Perfectionism Emerging: Need to Excel",
      topic: "Performance pressure",
      scene: "{childName} is 6. Perfectionism is developing.",
      choices: {
        connect: { text: "Normalize mistakes and learning.", consequence: "{childName} develops resilience." },
        teach: { text: "Discuss that failure is part of learning.", consequence: "They risk trying." },
        boundary: { text: "Good enough is good enough.", consequence: "Anxiety eases." },
        avoid: { text: "Praise only excellence.", consequence: "{childName} becomes rigid." },
        harm: { text: "Criticize imperfection.", consequence: "{childName} develops anxiety." }
      }
    },
    7: {
      title: "Asynchronous Development: Brilliant & Emotional",
      topic: "Uneven growth",
      scene: "{childName} is 7. Intellectually advanced but emotionally age-appropriate.",
      choices: {
        connect: { text: "Accept that they're asynchronous.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss that abilities don't align.", consequence: "They understand themselves." },
        boundary: { text: "Emotional needs are age-appropriate.", consequence: "They're not over-pushed." },
        avoid: { text: "Treat them as a tiny adult.", consequence: "{childName} lacks age-appropriate experiences." },
        harm: { text: "Expect emotional maturity to match ability.", consequence: "{childName} feels broken." }
      }
    },
    8: {
      title: "Social Struggles: Lonely Despite Intelligence",
      topic: "Peer relationships",
      scene: "{childName} is 8. Intellectually advanced but socially isolated.",
      choices: {
        connect: { text: "Help them find kindred spirits.", consequence: "{childName} has friends." },
        teach: { text: "Discuss social skills and differences.", consequence: "They develop socially." },
        boundary: { text: "Social life is supported.", consequence: "They're not isolated." },
        avoid: { text: "Ignore their loneliness.", consequence: "{childName} becomes withdrawn." },
        harm: { text: "Tell them 'you're too smart for normal friends.'", consequence: "{childName} internalizes isolation." }
      }
    },
    9: {
      title: "Identifying as Smart: That's Who They Are",
      topic: "Identity forming",
      scene: "{childName} is 9. Identity tied to being smart/gifted.",
      choices: {
        connect: { text: "Support this identity while building others.", consequence: "{childName} is multifaceted." },
        teach: { text: "Discuss identity beyond intelligence.", consequence: "They develop full self." },
        boundary: { text: "Smartness is important part, not all.", consequence: "Resilience is built." },
        avoid: { text: "Let intelligence consume entire identity.", consequence: "{childName} has no backup." },
        harm: { text: "Say 'you're only good because you're smart.'", consequence: "{childName} has fragile self-worth." }
      }
    },
    10: {
      title: "Underachievement: What If They Don't Try?",
      topic: "Motivation questions",
      scene: "{childName} is 10. They could achieve more but are choosing not to.",
      choices: {
        connect: { text: "Explore what's driving their choices.", consequence: "{childName} can discuss it." },
        teach: { text: "Discuss that effort is their choice.", consequence: "They have autonomy." },
        boundary: { text: "Underachievement is allowed.", consequence: "They're not forced." },
        avoid: { text: "Force them to achieve.", consequence: "{childName} rebels." },
        harm: { text: "Shame them for underachieving.", consequence: "{childName} becomes oppositional." }
      }
    },
    11: {
      title: "Interests Diverging: Not All Academic",
      topic: "Passion exploration",
      scene: "{childName} is 11. Passionate about non-academic interests.",
      choices: {
        connect: { text: "Support whatever interests them.", consequence: "{childName} develops fully." },
        teach: { text: "Discuss that passion takes many forms.", consequence: "They see possibilities." },
        boundary: { text: "Non-academic interests are valid.", consequence: "They're encouraged." },
        avoid: { text: "Push only academic achievement.", consequence: "{childName} loses joy." },
        harm: { text: "Tell them 'non-academic interests are waste.'", consequence: "{childName} hides passions." }
      }
    },
    12: {
      title: "Comparison & Competition: Against Other Gifted Kids",
      topic: "Competitive pressure",
      scene: "{childName} is 12. Surrounded by other gifted kids. Comparison is constant.",
      choices: {
        connect: { text: "Help them find their own lane.", consequence: "{childName} stops comparing." },
        teach: { text: "Discuss that everyone is different.", consequence: "Comparison eases." },
        boundary: { text: "Competition isn't everything.", consequence: "They develop self-worth." },
        avoid: { text: "Encourage constant competition.", consequence: "{childName} becomes obsessive." },
        harm: { text: "Tell them they're 'not the smartest.'", consequence: "{childName} internalizes inadequacy." }
      }
    },
    13: {
      title: "Dating & Relationships: Finding Compatible Partners",
      topic: "Love and intellect",
      scene: "{childName} is 13 and interested in dating.",
      choices: {
        connect: { text: "Support relationships regardless of partner intellect.", consequence: "{childName} dates authentically." },
        teach: { text: "Discuss that love isn't about matching abilities.", consequence: "They see possibilities." },
        boundary: { text: "Relationships are allowed.", consequence: "They develop socially." },
        avoid: { text: "Tell them to only date other gifted kids.", consequence: "{childName} becomes isolated." },
        harm: { text: "Mock their romantic choices.", consequence: "{childName} hides relationships." }
      }
    },
    14: {
      title: "Stress & Pressure: Taking Its Toll",
      topic: "Mental health",
      scene: "{childName} is 14. Perfectionism and pressure are affecting mental health.",
      choices: {
        connect: { text: "Address stress proactively.", consequence: "{childName} gets support." },
        teach: { text: "Discuss that rest is necessary.", consequence: "They learn balance." },
        boundary: { text: "Mental health comes before achievement.", consequence: "They're protected." },
        avoid: { text: "Ignore signs of stress.", consequence: "{childName} deteriorates." },
        harm: { text: "Tell them 'stress means you care.'", consequence: "{childName} internalizes anxiety." }
      }
    },
    15: {
      title: "College Prep: Pressure Intensifies",
      topic: "Future looming",
      scene: "{childName} is 15. College pressure is very real.",
      choices: {
        connect: { text: "Support them without pushing.",consequence: "{childName} feels supported." },
        teach: { text: "Discuss that many paths are valid.", consequence: "Pressure eases." },
        boundary: { text: "College isn't the only path.", consequence: "Options feel real." },
        avoid: { text: "Make college everything.", consequence: "{childName} becomes obsessive." },
        harm: { text: "Tell them 'you must go to prestigious school.'", consequence: "{childName} internalizes pressure." }
      }
    },
    16: {
      title: "Independent Learning: Self-Directed Success",
      topic: "Autonomy in achievement",
      scene: "{childName} is 16. Can they succeed without external pressure?",
      choices: {
        connect: { text: "Support their independence.", consequence: "{childName} builds internal motivation." },
        teach: { text: "Discuss sustainable success.", consequence: "They learn balance." },
        boundary: { text: "Achievement is their choice.", consequence: "Autonomy is real." },
        avoid: { text: "Stay controlling about achievement.", consequence: "{childName} rebels." },
        harm: { text: "Withdraw support if they underachieve.", consequence: "{childName} feels abandoned." }
      }
    },
    17: {
      title: "Understanding Your Expectations: Where They Come From",
      topic: "Parental pressure origins",
      scene: "{childName} is 17. Can they understand why you pushed?",
      choices: {
        connect: { text: "Share your intentions honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss where your expectations came from.", consequence: "Empathy develops." },
        boundary: { text: "Your choices made sense to you.", consequence: "Understanding is possible." },
        avoid: { text: "Deny pushing them.", consequence: "{childName} feels invalidated." },
        harm: { text: "Blame them for your high expectations.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Adult Path: Their Own Definition of Success",
      topic: "Self-determination",
      scene: "{childName} is 18. Building life on their own terms.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about meaningful success.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward your definition of success.", consequence: "{childName} might resent it." },
        harm: { text: "Tell them 'you're wasting your potential.'", consequence: "{childName} internalizes inadequacy." }
      }
    }
  },

  divorce_coparenting: {
    1: {
      title: "Divorce or Separation: Two Homes Begin",
      topic: "Family restructure",
      scene: "{childName} is born. Parents separate soon after.",
      choices: {
        connect: { text: "Love them through the transition.", consequence: "{childName} feels secure." },
        teach: { text: "Explain that both parents love them.", consequence: "They understand." },
        boundary: { text: "Their relationship with each parent is protected.", consequence: "Both bonds survive." },
        avoid: { text: "Use them as messenger between parents.", consequence: "{childName} feels burdened." },
        harm: { text: "Tell them 'parent X left us.'", consequence: "{childName} internalizes abandonment." }
      }
    },
    2: {
      title: "Two Households: Adjusted Attachments",
      topic: "Routine in two homes",
      scene: "{childName} grows up with two primary homes.",
      choices: {
        connect: { text: "Make both homes feel like home.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand two homes as normal.", consequence: "They adapt well." },
        boundary: { text: "Both homes are equally valid.", consequence: "No shame about structure." },
        avoid: { text: "Make one home feel secondary.", consequence: "{childName} has a \"less\" home." },
        harm: { text: "Bad-mouth the other home.", consequence: "{childName} internalizes conflict." }
      }
    },
    3: {
      title: "Transitions: Moving Between Homes",
      topic: "Logistical complexity",
      scene: "{childName} is 3-4. Regular transitions between homes.",
      choices: {
        connect: { text: "Make transitions smooth and predictable.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand transitions.", consequence: "They adapt well." },
        boundary: { text: "Transitions are business-like, not emotional.", consequence: "They're not burdened." },
        avoid: { text: "Make transitions chaotic or emotional.", consequence: "{childName} develops anxiety." },
        harm: { text: "Use transitions as punishment.", consequence: "{childName} hates transitions." }
      }
    },
    4: {
      title: "Loyalty Conflicts: Feeling Torn Between Parents",
      topic: "Emotional complexity",
      scene: "{childName} is 4-5. Loyalty conflicts emerging.",
      choices: {
        connect: { text: "Release them from loyalty conflicts.", consequence: "{childName} can love both." },
        teach: { text: "Discuss that loving both is okay.", consequence: "No guilt develops." },
        boundary: { text: "They're not responsible for parents' feelings.", consequence: "They're free." },
        avoid: { text: "Make them choose or feel they have to.", consequence: "{childName} internalizes conflict." },
        harm: { text: "Tell them they have to take a side.", consequence: "{childName} feels split." }
      }
    },
    5: {
      title: "School: Different Addresses, Same Love",
      topic: "Administrative complexity",
      scene: "{childName} goes to school. Two addresses on file.",
      choices: {
        connect: { text: "Communicate clearly with school.", consequence: "{childName} isn't confused." },
        teach: { text: "Help them explain their structure to peers.", consequence: "They're confident." },
        boundary: { text: "Teachers understand both homes matter.", consequence: "No shame." },
        avoid: { text: "Leave school confused about custody.", consequence: "{childName} is confused." },
        harm: { text: "Bad-mouth other parent to teachers.", consequence: "{childName} internalizes conflict." }
      }
    },
    6: {
      title: "Special Events: Navigating Both Parents",
      topic: "Milestone management",
      scene: "{childName} is 6. Birthday, school events, holidays—two parents invited.",
      choices: {
        connect: { text: "Both parents show up if possible.", consequence: "{childName} feels celebrated." },
        teach: { text: "Discuss that both parents want to be there.", consequence: "They feel loved." },
        boundary: { text: "Events don't become conflict zones.", consequence: "They're special." },
        avoid: { text: "Make events competitive or conflict-filled.", consequence: "{childName} dreads them." },
        harm: { text: "Exclude one parent from events.", consequence: "{childName} internalizes rejection." }
      }
    },
    7: {
      title: "Spending Patterns: Material Differences Between Homes",
      topic: "Economic disparity",
      scene: "{childName} is 7. One home has more resources than the other.",
      choices: {
        connect: { text: "Talk openly about the difference.", consequence: "{childName} understands." },
        teach: { text: "Discuss that love doesn't cost money.", consequence: "Values clarify." },
        boundary: { text: "Neither home is \"better\" because of money.", consequence: "No shame." },
        avoid: { text: "Let financial difference create resentment.", consequence: "{childName} plays one home against other." },
        harm: { text: "Use money to buy their loyalty.", consequence: "{childName} internalizes that love is transactional." }
      }
    },
    8: {
      title: "Parental Relationships: New Partners Appear",
      topic: "Family expansion",
      scene: "{childName} is 8. One or both parents are dating or re-partnering.",
      choices: {
        connect: { text: "Introduce new partners respectfully.", consequence: "{childName} adapts." },
        teach: { text: "Discuss that parents can date.", consequence: "They understand." },
        boundary: { text: "New partners don't replace their parent.", consequence: "Security is maintained." },
        avoid: { text: "Force bonding with new partners.", consequence: "{childName} resists." },
        harm: { text: "Use new partner to replace their other parent.", consequence: "{childName} internalizes abandonment." }
      }
    },
    9: {
      title: "Identifying as Divorce Kid: That's Their Reality",
      topic: "Identity forming",
      scene: "{childName} is 9. Identity includes being a child of divorce.",
      choices: {
        connect: { text: "Normalize this identity.", consequence: "{childName} feels normal." },
        teach: { text: "Discuss that divorce is common.", consequence: "No shame develops." },
        boundary: { text: "This identity is just one part.", consequence: "They're multifaceted." },
        avoid: { text: "Make divorce their entire identity.", consequence: "{childName} overidentifies with it." },
        harm: { text: "Tell them 'you're broken because of divorce.'", consequence: "{childName} internalizes shame." }
      }
    },
    10: {
      title: "Taking Sides: Pressure to Choose Allegiance",
      topic: "Loyalty pressure",
      scene: "{childName} is 10. One parent pressures them to take a side.",
      choices: {
        connect: { text: "Protect them from this pressure.", consequence: "{childName} is free." },
        teach: { text: "Discuss that they don't have to choose.", consequence: "Pressure eases." },
        boundary: { text: "Their relationship with each parent is theirs.", consequence: "Autonomy is protected." },
        avoid: { text: "Let one parent pressure them.", consequence: "{childName} feels torn." },
        harm: { text: "Tell them 'choose me or your other parent.'", consequence: "{childName} feels trapped." }
      }
    },
    11: {
      title: "Access & Contact: Can They See Both?",
      topic: "Relationship maintenance",
      scene: "{childName} is 11. Custody or access arrangements might change.",
      choices: {
        connect: { text: "Prioritize maintaining both relationships.", consequence: "{childName} can sustain both." },
        teach: { text: "Discuss that they deserve both parents.", consequence: "They understand their right." },
        boundary: { text: "Both relationships are protected.", consequence: "They're secure." },
        avoid: { text: "Restrict access to one parent.", consequence: "{childName} loses connection." },
        harm: { text: "Use access as punishment.", consequence: "{childName} internalizes control." }
      }
    },
    12: {
      title: "Holidays & Breaks: Shared Time",
      topic: "Schedule complexity",
      scene: "{childName} is 12. Holidays require coordination.",
      choices: {
        connect: { text: "Coordinate to make holidays special.", consequence: "{childName} has good holidays." },
        teach: { text: "Discuss that sharing is possible.", consequence: "They see cooperation." },
        boundary: { text: "Holidays aren't conflict zones.", consequence: "They're special." },
        avoid: { text: "Make holidays about conflict.", consequence: "{childName} dreads them." },
        harm: { text: "Exclude one parent from holidays.", consequence: "{childName} internalizes loss." }
      }
    },
    13: {
      title: "Teen Development: Which Home for Which Stage?",
      topic: "Parental roles",
      scene: "{childName} is 13. Adolescence requires both parents.",
      choices: {
        connect: { text: "Both parents stay involved.", consequence: "{childName} has both support." },
        teach: { text: "Discuss that adolescence needs both genders of parent.", consequence: "They understand." },
        boundary: { text: "Both parents are relevant.", consequence: "They're not choosing one." },
        avoid: { text: "Let one parent fade from teen years.", consequence: "{childName} loses connection." },
        harm: { text: "Blame other parent for teen issues.", consequence: "{childName} internalizes conflict." }
      }
    },
    14: {
      title: "Dating & Privacy: Two Homes, One Dating Life",
      topic: "Adolescent independence",
      scene: "{childName} is 14 and dating. Managing privacy in two homes.",
      choices: {
        connect: { text: "Both homes respect their privacy.", consequence: "{childName} can date." },
        teach: { text: "Discuss boundaries in two homes.", consequence: "They understand expectations." },
        boundary: { text: "Dating is allowed in both homes.", consequence: "They're not controlled." },
        avoid: { text: "Control or shame their dating.", consequence: "{childName} hides relationship." },
        harm: { text: "Use dating as ammunition against other parent.", consequence: "{childName} internalizes conflict." }
      }
    },
    15: {
      title: "College & Future: Which Parent for Which Decisions?",
      topic: "Parental collaboration",
      scene: "{childName} is 15. Major decisions ahead.",
      choices: {
        connect: { text: "Both parents collaborate on decisions.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss that both parents matter for big decisions.", consequence: "They feel valued." },
        boundary: { text: "Decisions include both parents when appropriate.", consequence: "They're not isolated." },
        avoid: { text: "One parent makes decisions alone.", consequence: "{childName} feels one-sided." },
        harm: { text: "Use decisions as ammunition in parental conflict.", consequence: "{childName} internalizes conflict." }
      }
    },
    16: {
      title: "Understanding Your Divorce: Why It Happened",
      topic: "Family history",
      scene: "{childName} is 16. Can they understand why parents divorced?",
      choices: {
        connect: { text: "Explain honestly but age-appropriately.", consequence: "{childName} understands." },
        teach: { text: "Discuss that divorce isn't their fault.", consequence: "Guilt eases." },
        boundary: { text: "Complexity is okay.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss divorce.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame other parent for divorce.", consequence: "{childName} internalizes conflict." }
      }
    },
    17: {
      title: "Adult Relationships: Learning From Your Divorce",
      topic: "Values and patterns",
      scene: "{childName} is 17. What have they learned about relationships?",
      choices: {
        connect: { text: "Share wisdom about healthy relationships.", consequence: "{childName} builds healthily." },
        teach: { text: "Discuss that divorce isn't always bad.", consequence: "They see complexity." },
        boundary: { text: "They're not destined to repeat patterns.", consequence: "Hope is possible." },
        avoid: { text: "Project your divorce onto their future.", consequence: "{childName} becomes fearful." },
        harm: { text: "Tell them 'all relationships end.'", consequence: "{childName} internalizes hopelessness." }
      }
    },
    18: {
      title: "Adult Relationship: Both Parents in Their Life",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own relationship with both parents.",
      choices: {
        connect: { text: "Support their independent relationships with both.", consequence: "{childName} has both." },
        teach: { text: "Discuss that they define their relationships.", consequence: "Autonomy is real." },
        boundary: { text: "They choose their relationship patterns.", consequence: "Freedom is possible." },
        avoid: { text: "Force them to maintain your approach.", consequence: "{childName} might resent you." },
        harm: { text: "Tell them they have to choose you.", consequence: "{childName} is devastated." }
      }
    }
  },

  first_gen_immigrant: {
    1: {
      title: "Born Into Immigrant Family",
      topic: "Cultural bridge",
      scene: "{childName} is born to immigrant parent(s) in new country.",
      choices: {
        connect: { text: "Love them as bridge between cultures.", consequence: "{childName} feels valued." },
        teach: { text: "Share both cultures naturally.", consequence: "They absorb both." },
        boundary: { text: "Childhood includes both homes.", consequence: "Identity is hybrid." },
        avoid: { text: "Force them to choose one culture.", consequence: "{childName} feels split." },
        harm: { text: "Shame them for either culture.", consequence: "{childName} internalizes shame." }
      }
    },
    2: {
      title: "Language: Speaking Both (or Neither)",
      topic: "Linguistic identity",
      scene: "{childName} grows up hearing home language and new language.",
      choices: {
        connect: { text: "Maintain home language naturally.", consequence: "{childName} speaks both." },
        teach: { text: "Discuss that bilingualism is gift.", consequence: "They value both languages." },
        boundary: { text: "Both languages are valid.", consequence: "No shame about code-switching." },
        avoid: { text: "Suppress home language.", consequence: "{childName} loses connection." },
        harm: { text: "Shame them for accent or language mix.", consequence: "{childName} hides home language." }
      }
    },
    3: {
      title: "Food, Traditions, Holidays: Different From Peers",
      topic: "Cultural practices",
      scene: "{childName} is 3-4. Their home is different from peers' homes.",
      choices: {
        connect: { text: "Share traditions proudly.", consequence: "{childName} is proud." },
        teach: { text: "Explain why traditions matter.", consequence: "They understand significance." },
        boundary: { text: "Traditions are valued.", consequence: "No shame." },
        avoid: { text: "Hide traditions at home.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'our way is weird.'", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "School: Curriculum Reflects Different Culture",
      topic: "Representation",
      scene: "{childName} goes to school. History, holidays, culture are different.",
      choices: {
        connect: { text: "Bridge the gap between home and school culture.", consequence: "{childName} integrates both." },
        teach: { text: "Discuss that both cultures are real.", consequence: "They understand both." },
        boundary: { text: "School culture isn't the only way.", consequence: "Home culture is valued." },
        avoid: { text: "Tell them school culture is correct way.", consequence: "{childName} rejects home." },
        harm: { text: "Act like home culture is wrong.", consequence: "{childName} internalizes shame." }
      }
    },
    5: {
      title: "Accent & Appearance: Being Noticed as Different",
      topic: "Visible difference",
      scene: "{childName} is noticed for accent, appearance, or cultural markers.",
      choices: {
        connect: { text: "Help them navigate being noticed.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss that different is okay.", consequence: "Confidence develops." },
        boundary: { text: "They're not responsible for others' reactions.", consequence: "They're secure." },
        avoid: { text: "Tell them to hide their difference.", consequence: "{childName} hides identity." },
        harm: { text: "Shame them for standing out.", consequence: "{childName} internalizes shame." }
      }
    },
    6: {
      title: "Peer Reactions: Understanding Cultural Differences",
      topic: "Social navigation",
      scene: "{childName} is 6. Peers comment on their home, food, traditions.",
      choices: {
        connect: { text: "Help them explain and celebrate.", consequence: "{childName} is proud." },
        teach: { text: "Discuss different families, different traditions.", consequence: "They see diversity." },
        boundary: { text: "Negative comments are about peers, not them.", consequence: "Confidence is built." },
        avoid: { text: "Leave them undefended.", consequence: "{childName} internalizes hurt." },
        harm: { text: "Tell them to mock their own culture to fit in.", consequence: "{childName} internalizes shame." }
      }
    },
    7: {
      title: "Translator Role: Helping Parents Navigate New Country",
      topic: "Adult responsibility",
      scene: "{childName} is 7+. Sometimes translating or navigating for parents.",
      choices: {
        connect: { text: "Use their help without burdening.", consequence: "{childName} feels capable." },
        teach: { text: "Discuss that they're helpers but children.", consequence: "Boundaries are clear." },
        boundary: { text: "They're not responsible adults.", consequence: "Childhood is protected." },
        avoid: { text: "make them primary translator/fixer.", consequence: "{childName} loses childhood." },
        harm: { text: "Blame them for parents' struggles.", consequence: "{childName} internalizes responsibility." }
      }
    },
    8: {
      title: "Bridging Worlds: Cultural Broker Between Home & School",
      topic: "Identity negotiation",
      scene: "{childName} is 8. They're becoming bridge between cultures.",
      choices: {
        connect: { text: "Support them as bridge without burdening.", consequence: "{childName} feels capable." },
        teach: { text: "Discuss that bridging is valuable skill.", consequence: "They see value." },
        boundary: { text: "Bridging doesn't mean choosing one.", consequence: "They can be both." },
        avoid: { text: "Force them to be perfect ambassador.", consequence: "{childName} becomes burdened." },
        harm: { text: "Make them responsible for representing their culture.", consequence: "{childName} internalizes pressure." }
      }
    },
    9: {
      title: "Identifying as Immigrant Kid: That's Who They Are",
      topic: "Identity crystallizing",
      scene: "{childName} is 9. Identity includes being immigrant's child.",
      choices: {
        connect: { text: "Support this identity proudly.", consequence: "{childName} feels proud." },
        teach: { text: "Discuss that immigrant heritage is strength.", consequence: "Values form." },
        boundary: { text: "This identity is important but not all.", consequence: "They're multifaceted." },
        avoid: { text: "Let immigrant identity consume all.", consequence: "{childName} has no other self." },
        harm: { text: "Say 'you'll never be fully American.'", consequence: "{childName} internalizes not-belonging." }
      }
    },
    10: {
      title: "Homesickness for a Place They've Never Lived",
      topic: "Ancestral connection",
      scene: "{childName} is 10. Longing for homeland they've never seen.",
      choices: {
        connect: { text: "Validate their connection to homeland.", consequence: "{childName} feels understood." },
        teach: { text: "Share stories of home.", consequence: "Connection feels real." },
        boundary: { text: "Home can be two places.", consequence: "Belonging is possible." },
        avoid: { text: "Tell them 'this is your only home.'", consequence: "{childName} feels split." },
        harm: { text: "Dismiss their longing for homeland.", consequence: "{childName} internalizes loss." }
      }
    },
    11: {
      title: "Return Visits: Reconnecting With Homeland",
      topic: "Cultural immersion",
      scene: "{childName} is 11. Visiting homeland for first or subsequent time.",
      choices: {
        connect: { text: "Make visit meaningful and low-pressure.", consequence: "{childName} connects." },
        teach: { text: "Discuss differences without judgment.", consequence: "They integrate experience." },
        boundary: { text: "They don't have to be homeland kid.", consequence: "They're themselves." },
        avoid: { text: "Expect them to suddenly be homeland kid.", consequence: "{childName} feels displaced." },
        harm: { text: "Tell them 'you don't belong here anymore.'", consequence: "{childName} internalizes not-belonging." }
      }
    },
    12: {
      title: "Pressure to Preserve Culture: Cultural Ambassador Role",
      topic: "Cultural responsibility",
      scene: "{childName} is 12. Expected to preserve culture, teach siblings, honor traditions.",
      choices: {
        connect: { text: "Share culture without pressure.", consequence: "{childName} enjoys it." },
        teach: { text: "Discuss that culture naturally evolves.", consequence: "Flexibility develops." },
        boundary: { text: "Preserving culture is family effort, not their job.", consequence: "Pressure eases." },
        avoid: { text: "Make them sole carrier of culture.", consequence: "{childName} feels burdened." },
        harm: { text: "Guilt-trip them for not preserving culture.", consequence: "{childName} resents culture." }
      }
    },
    13: {
      title: "Dating & Relationships: Culture & Partner Expectations",
      topic: "Romance complexity",
      scene: "{childName} is 13 and interested in dating.",
      choices: {
        connect: { text: "Support relationships regardless of partner culture.", consequence: "{childName} dates authentically." },
        teach: { text: "Discuss what matters in relationships.", consequence: "Values clarify." },
        boundary: { text: "They're not responsible for cultural compatibility.", consequence: "Freedom is possible." },
        avoid: { text: "Control who they date based on culture.", consequence: "{childName} rebels." },
        harm: { text: "Tell them 'you can only date your own culture.'", consequence: "{childName} feels trapped." }
      }
    },
    14: {
      title: "Accent & Language: Will They Lose Home Language?",
      topic: "Linguistic anxiety",
      scene: "{childName} is 14. Home language is fading. Guilt about it.",
      choices: {
        connect: { text: "Normalize language change.", consequence: "{childName} feels less guilty." },
        teach: { text: "Discuss that language naturally changes.", consequence: "Acceptance develops." },
        boundary: { text: "Losing language accent doesn't mean losing culture.", consequence: "They're not broken." },
        avoid: { text: "Guilt-trip them for losing language.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'you're betraying your culture.'", consequence: "{childName} internalizes guilt." }
      }
    },
    15: {
      title: "College & Career: Following Own Path or Parents' Vision",
      topic: "Future decisions",
      scene: "{childName} is 15. Career paths might differ from family expectations.",
      choices: {
        connect: { text: "Support their authentic path.", consequence: "{childName} feels free." },
        teach: { text: "Discuss both family and personal values.", consequence: "Integration is possible." },
        boundary: { text: "Their path is theirs to choose.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward family-expected path.", consequence: "{childName} might resent it." },
        harm: { text: "Tell them 'you're betraying family.'", consequence: "{childName} internalizes guilt." }
      }
    },
    16: {
      title: "Understanding Parent Sacrifice: Why They Came",
      topic: "Empathy and values",
      scene: "{childName} is 16. Can they understand why parents immigrated?",
      choices: {
        connect: { text: "Share your journey authentically.", consequence: "{childName} understands." },
        teach: { text: "Discuss what you sacrificed and gained.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss immigration journey.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them 'you owe us everything.'", consequence: "{childName} internalizes guilt." }
      }
    },
    17: {
      title: "Adult Identity: Which Culture Are They?",
      topic: "Identity crystallization",
      scene: "{childName} is 17. Are they immigrant culture? New culture? Both?",
      choices: {
        connect: { text: "Support their unique identity.", consequence: "{childName} is comfortable." },
        teach: { text: "Discuss that hybrid identity is valid.", consequence: "They embrace both." },
        boundary: { text: "They get to decide their own identity.", consequence: "Autonomy is honored." },
        avoid: { text: "Force them to choose one culture.", consequence: "{childName} feels split." },
        harm: { text: "Tell them 'you're not really [culture].'", consequence: "{childName} internalizes not-belonging." }
      }
    },
    18: {
      title: "Adult Life: Building Own Cultural Integration",
      topic: "Self-determination",
      scene: "{childName} is 18. Creating their own approach to culture and identity.",
      choices: {
        connect: { text: "Support whatever approach they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about healthy integration.", consequence: "They build wisely." },
        boundary: { text: "Their cultural path is theirs.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward your approach.", consequence: "{childName} might resent it." },
        harm: { text: "Tell them 'you're betraying your heritage.'", consequence: "{childName} internalizes guilt." }
      }
    }
  }
};