export const SPECIAL_START_YEARLY_BEATS__FAMOUS_01 = {
  famous_pop_star: {
    1: {
      title: "First Song",
      topic: "Musical spark",
      scene: "{childName} hums a melody. You recognize raw talent. Do you nurture it?",
      choices: {
        connect: { text: "Sing together every day.", consequence: "{childName} bonds with music through you." },
        teach: { text: "Find a voice coach.", consequence: "Professional training begins early." },
        boundary: { text: "Keep it as a hobby only.", consequence: "{childName} enjoys music without pressure." },
        avoid: { text: "Let {childName} figure it out.", consequence: "Interest wavers; no real direction." },
        harm: { text: "Push toward recording now.", consequence: "{childName} feels overwhelmed and loses interest." }
      }
    },
    2: {
      title: "Talent Show Win",
      topic: "First spotlight",
      scene: "{childName} wins a local talent show. The audience loved it. New attention arrives.",
      choices: {
        connect: { text: "Celebrate {childName}'s joy.", consequence: "Confidence soars; they love performing." },
        teach: { text: "Teach stage presence.", consequence: "{childName} learns poise and delivery." },
        boundary: { text: "Remind them it's just one win.", consequence: "Realistic expectations stay intact." },
        avoid: { text: "React casually.", consequence: "Mixed signals; {childName} unsure if it matters." },
        harm: { text: "Demand another win.", consequence: "{childName} feels pressure; joy fades." }
      }
    },
    3: {
      title: "First Recording",
      topic: "Studio time",
      scene: "A local studio offers {childName} a day of free recording. It's exciting and scary.",
      choices: {
        connect: { text: "Go together; support in booth.", consequence: "{childName} feels safe and creative." },
        teach: { text: "Explain mic technique and takes.", consequence: "Professional skills develop early." },
        boundary: { text: "Let {childName} decide commitment.", consequence: "They own the choice." },
        avoid: { text: "Drop them off; skip details.", consequence: "{childName} feels alone and nervous." },
        harm: { text: "Criticize the first playback.", consequence: "Self-doubt creeps in." }
      }
    },
    4: {
      title: "YouTube Channel Launch",
      topic: "Social media debut",
      scene: "{childName} wants to post covers online. You wonder: how public should they be?",
      choices: {
        connect: { text: "Help film and edit together.", consequence: "Shared creativity; strong bond." },
        teach: { text: "Discuss privacy and online safety.", consequence: "{childName} learns smart boundaries." },
        boundary: { text: "Limit followers to friends only.", consequence: "Fun without excessive exposure." },
        avoid: { text: "Let {childName} handle it alone.", consequence: "Content is posted hastily." },
        harm: { text: "Use {childName}'s videos for your goals.", consequence: "{childName} feels exploited." }
      }
    },
    5: {
      title: "School Performance Conflict",
      topic: "Time crunch",
      scene: "{childName} is asked to perform at school, but a music lesson conflicts. Both matter.",
      choices: {
        connect: { text: "Help find a solution together.", consequence: "{childName} learns problem-solving." },
        teach: { text: "Explain balancing priorities.", consequence: "Maturity grows." },
        boundary: { text: "School comes first always.", consequence: "Music stays secondary; less pressure." },
        avoid: { text: "Let {childName} skip either.", consequence: "Commitment becomes unclear." },
        harm: { text: "Force the music choice.", consequence: "School suffers; {childName} stressed." }
      }
    },
    6: {
      title: "First Fan Letter",
      topic: "Recognition",
      scene: "Someone online wrote: '{childName}'s voice is amazing!' {childName} beams.",
      choices: {
        connect: { text: "Read it together; celebrate.", consequence: "Validation feels genuine and shared." },
        teach: { text: "Explain not all feedback is fair.", consequence: "{childName} learns discernment." },
        boundary: { text: "Remind them to stay humble.", consequence: "Ego stays in check." },
        avoid: { text: "Glance and move on.", consequence: "{childName} processes it alone." },
        harm: { text: "Say they're getting too big.", consequence: "{childName} becomes vain or insecure." }
      }
    },
    7: {
      title: "Songwriting First Try",
      topic: "Original work",
      scene: "{childName} writes their first song. It's rough but heartfelt. Do you critique harshly?",
      choices: {
        connect: { text: "Ask about the story behind it.", consequence: "{childName} opens up; bond deepens." },
        teach: { text: "Offer gentle craft feedback.", consequence: "Skills improve; they feel supported." },
        boundary: { text: "Let them decide if it's ready.", consequence: "{childName} trusts their instincts." },
        avoid: { text: "Don't comment.", consequence: "{childName} wonders if you care." },
        harm: { text: "Harshly critique the lyrics.", consequence: "{childName} stops writing for months." }
      }
    },
    8: {
      title: "Audition Nerves",
      topic: "Big opportunity",
      scene: "A regional competition audition is tomorrow. {childName} is nervous and doubting.",
      choices: {
        connect: { text: "Practice together; calm them.", consequence: "Anxiety eases; they feel ready." },
        teach: { text: "Reframe: audition = valuable experience.", consequence: "{childName} shifts mindset positively." },
        boundary: { text: "Say 'no pressure, just have fun.'", consequence: "Lightness returns; joy stays." },
        avoid: { text: "Leave them alone.", consequence: "{childName} spirals in doubt." },
        harm: { text: "Say 'you better win.'", consequence: "Crushing pressure; they freeze at audition." }
      }
    },
    9: {
      title: "Coach Disagreement",
      topic: "Artistic clash",
      scene: "The vocal coach wants {childName} to change their style. {childName} resists.",
      choices: {
        connect: { text: "Ask {childName} what feels right.", consequence: "They learn to trust their voice." },
        teach: { text: "Explain 'flexibility helps artists.'", consequence: "{childName} grows open-minded." },
        boundary: { text: "Support {childName}'s vision first.", consequence: "Authenticity is preserved." },
        avoid: { text: "Don't get involved.", consequence: "Tension builds; {childName} confused." },
        harm: { text: "Force the coach's changes.", consequence: "{childName} loses their unique sound." }
      }
    },
    10: {
      title: "Touring Offer (Youth Circuit)",
      topic: "Travel and fame",
      scene: "A modest tour invites {childName}. It's a step up. You worry about school and sleep.",
      choices: {
        connect: { text: "Plan it together with {childName}.", consequence: "{childName} feels empowered and heard." },
        teach: { text: "Discuss responsibility and balance.", consequence: "Maturity accelerates." },
        boundary: { text: "Say no; school is priority.", consequence: "Stability stays; opportunity passed." },
        avoid: { text: "Shrug and let it happen.", consequence: "{childName} gets fatigued and grades drop." },
        harm: { text: "Push {childName} into every date.", consequence: "Burnout starts early." }
      }
    },
    11: {
      title: "Bullying for Being 'Showy'",
      topic: "Peer backlash",
      scene: "Classmates mock {childName} for posting music videos. They say it's arrogant.",
      choices: {
        connect: { text: "Validate their hurt; listen deeply.", consequence: "{childName} feels safe to be themselves." },
        teach: { text: "Discuss jealousy and resilience.", consequence: "{childName} understands others' insecurity." },
        boundary: { text: "Suggest backing off social media.", consequence: "Some peace returns; fewer attacks." },
        avoid: { text: "Don't acknowledge it.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'you asked for it.'", consequence: "{childName} hates themselves." }
      }
    },
    12: {
      title: "First Revenue (Streaming/Merch)",
      topic: "Money arrives",
      scene: "{childName} earned $300 from streams and a T-shirt sale. They're excited and proud.",
      choices: {
        connect: { text: "Celebrate the milestone together.", consequence: "Achievement feels shared and real." },
        teach: { text: "Explain taxes and saving.", consequence: "{childName} learns financial responsibility." },
        boundary: { text: "Have them save most of it.", consequence: "Good habits form early." },
        avoid: { text: "Let {childName} spend freely.", consequence: "Money is gone fast; no lesson." },
        harm: { text: "Take the money for yourself.", consequence: "{childName} feels robbed and used." }
      }
    },
    13: {
      title: "Record Label Interest",
      topic: "Professional offer",
      scene: "A small label reaches out. They want to sign {childName}. It's legitimate but binding.",
      choices: {
        connect: { text: "Review the contract together closely.", consequence: "{childName} learns to read deals." },
        teach: { text: "Hire a lawyer/advisor to explain.", consequence: "They make an informed choice." },
        boundary: { text: "Advise: wait until 16+.", consequence: "Remaining independent; staying protected." },
        avoid: { text: "Tell {childName} to decide alone.", consequence: "They might sign unfavorably." },
        harm: { text: "Push them to sign immediately.", consequence: "Contract locks them in badly." }
      }
    },
    14: {
      title: "Romantic Interest from Fan",
      topic: "Attraction and risk",
      scene: "A fan (possibly older) is messaging {childName} with romantic interest. {childName} is flattered.",
      choices: {
        connect: { text: "Have an open safety talk.", consequence: "{childName} feels trusted and protected." },
        teach: { text: "Explain grooming and power imbalance.", consequence: "They understand the risk." },
        boundary: { text: "Set a 'no private fan contact' rule.", consequence: "{childName} stays safe." },
        avoid: { text: "Ignore the situation.", consequence: "{childName} may engage unsafely." },
        harm: { text: "Shame {childName} for being liked.", consequence: "They hide and don't ask for help." }
      }
    },
    15: {
      title: "Artistic Burnout Creeps In",
      topic: "Exhaustion",
      scene: "{childName} stops writing songs. They say music feels like work, not joy.",
      choices: {
        connect: { text: "Ask what {childName} needs to heal.", consequence: "They reconnect with why they love it." },
        teach: { text: "Normalize breaks and rest.", consequence: "{childName} learns sustainability." },
        boundary: { text: "Pause all projects for 2 months.", consequence: "Joy returns; passion reignites." },
        avoid: { text: "Keep pushing.", consequence: "Burnout deepens; they quit music." },
        harm: { text: "Force {childName} to keep producing.", consequence: "They resent you and music entirely." }
      }
    },
    16: {
      title: "College vs. Music Fork",
      topic: "Major life choice",
      scene: "{childName} is torn: music career or college degree? Both feel urgent and real.",
      choices: {
        connect: { text: "Ask what {childName} truly wants.", consequence: "They feel heard; clarity comes." },
        teach: { text: "Explain you can do both paths.", consequence: "{childName} sees options beyond binary." },
        boundary: { text: "Require college, music as side.", consequence: "Safety net is in place." },
        avoid: { text: "Don't weigh in; let them decide.", consequence: "{childName} feels alone in big choice." },
        harm: { text: "Force a music-only path.", consequence: "No backup plan if it fails." }
      }
    },
    17: {
      title: "Viral Moment (Good or Bad)",
      topic: "Sudden exposure",
      scene: "A video of {childName} is trending. The comments are a mix of love, criticism, and crude jokes.",
      choices: {
        connect: { text: "Help them process mixed reactions.", consequence: "{childName} feels grounded amid chaos." },
        teach: { text: "Discuss online toxicity vs. true impact.", consequence: "They build resilience." },
        boundary: { text: "Suggest stepping back from comments.", consequence: "Peace of mind is protected." },
        avoid: { text: "Pretend it's not happening.", consequence: "{childName} spirals alone." },
        harm: { text: "Say all the critics are right.", consequence: "{childName} crashes into self-doubt." }
      }
    },
    18: {
      title: "Independence & Legacy",
      topic: "On their own",
      scene: "{childName} is legally an adult. Music career or else, they're choosing their path.",
      choices: {
        connect: { text: "Tell them you're proud of them.", consequence: "They step forward with confidence." },
        teach: { text: "Offer long-term guidance, not control.", consequence: "{childName} respects you as advisor." },
        boundary: { text: "Respect whatever they choose.", consequence: "You stay close; trust is solid." },
        avoid: { text: "Drift away or criticize.", consequence: "Relationship strains; they feel unsupported." },
        harm: { text: "Remind them you made their career.", consequence: "{childName} resents you and doubts themselves." }
      }
    }
  },

  spotlight_movie_star: {
    1: {
      title: "First Movie Audition",
      topic: "Acting spark",
      scene: "{childName} gets offered a small film role. You're amazed but also nervous.",
      choices: {
        connect: { text: "Go to the audition together.", consequence: "{childName} feels supported and brave." },
        teach: { text: "Explain what acting means.", consequence: "They grasp the craft early." },
        boundary: { text: "Check the production is legit.", consequence: "Safety is verified first." },
        avoid: { text: "Let {childName} go alone.", consequence: "They're scared and uncertain." },
        harm: { text: "Push them to get the role.", consequence: "{childName} freezes at audition." }
      }
    },
    2: {
      title: "On Set for Real",
      topic: "First film",
      scene: "{childName} is filming their first movie. It's long days, many takes, and strange routines.",
      choices: {
        connect: { text: "Visit set; learn the process.", consequence: "You bond over their world." },
        teach: { text: "Explain 'acting is discipline, not magic.'", consequence: "{childName} respects the craft." },
        boundary: { text: "Set firm rules about school days.", consequence: "Education stays protected." },
        avoid: { text: "Stay out of it.", consequence: "{childName} feels lonely on set." },
        harm: { text: "Complain about the disruption.", consequence: "{childName} feels guilty for trying." }
      }
    },
    3: {
      title: "First Film Premiere",
      topic: "Red carpet",
      scene: "{childName}'s tiny film premieres at a small festival. There's a red carpet walk.",
      choices: {
        connect: { text: "Attend and cheer loudly.", consequence: "{childName} remembers this moment forever." },
        teach: { text: "Prepare them for cameras.", consequence: "They face publicity calmly." },
        boundary: { text: "Keep it low-key and fun.", consequence: "Ego stays grounded." },
        avoid: { text: "Don't attend.", consequence: "{childName} feels abandoned on big day." },
        harm: { text: "Tell them not to get famous.", consequence: "Shame attaches to their achievement." }
      }
    },
    4: {
      title: "Growth Spurts During Roles",
      topic: "Continuity problem",
      scene: "{childName} grows 2 inches during a multi-month shoot. The director wants reshoots.",
      choices: {
        connect: { text: "Reassure them it's normal.", consequence: "{childName} accepts their body changes." },
        teach: { text: "Explain 'body changes don't limit art.'", consequence: "They feel proud of growing up." },
        boundary: { text: "Advocate for fair reshoots budget.", consequence: "Production bears the cost." },
        avoid: { text: "Let {childName} stress about it.", consequence: "They feel ashamed of their body." },
        harm: { text: "Suggest restricting food.", consequence: "Eating disorder risk rises." }
      }
    },
    5: {
      title: "Mean Review in Print",
      topic: "Criticism stings",
      scene: "A critic panned {childName}'s performance. The words are harsh and personal.",
      choices: {
        connect: { text: "Hug them; validate their feelings.", consequence: "{childName} trusts you with pain." },
        teach: { text: "Explain critics are subjective.", consequence: "They build resilience." },
        boundary: { text: "Don't read reviews out loud.", consequence: "{childName} controls their exposure." },
        avoid: { text: "Say nothing.", consequence: "{childName} spirals silently." },
        harm: { text: "Agree the critic was right.", consequence: "{childName} internalizes self-hate." }
      }
    },
    6: {
      title: "Typecasting Pressure",
      topic: "Stuck in a role",
      scene: "After one successful role, {childName} only gets offered similar parts. They're bored.",
      choices: {
        connect: { text: "Brainstorm different genres together.", consequence: "They feel empowered to choose." },
        teach: { text: "Explain how to break typecasting.", consequence: "{childName} learns strategy." },
        boundary: { text: "Encourage saying no to bad offers.", consequence: "Autonomy grows." },
        avoid: { text: "Take whatever pays.", consequence: "{childName} resents their career." },
        harm: { text: "Force them into unwanted roles.", consequence: "Resentment and misery deepen." }
      }
    },
    7: {
      title: "School Scene Partners Jealous",
      topic: "Social rift",
      scene: "Classmates resent {childName}'s film schedule. They're cold and exclusionary.",
      choices: {
        connect: { text: "Talk about the loneliness.", consequence: "{childName} feels heard and less isolated." },
        teach: { text: "Help find friends who celebrate them.", consequence: "They build better circles." },
        boundary: { text: "Remind them not all peers get it.", consequence: "Perspective lightens the sting." },
        avoid: { text: "Ignore their social struggles.", consequence: "{childName} withdraws and lonels." },
        harm: { text: "Blame {childName} for being 'arrogant.'", consequence: "Shame deepens; they hate themselves." }
      }
    },
    8: {
      title: "Studio Pressure to Lose Weight",
      topic: "Body image attack",
      scene: "A director suggests {childName} 'slim down' for a role. {childName} is devastated.",
      choices: {
        connect: { text: "Validate their body and anger.", consequence: "{childName} rejects harmful pressure." },
        teach: { text: "Explain eating disorders and health.", consequence: "They understand the risk." },
        boundary: { text: "Refuse roles that demand this.", consequence: "You protect their health fiercely." },
        avoid: { text: "Let {childName} decide alone.", consequence: "They may develop unhealthy habits." },
        harm: { text: "Encourage the weight loss.", consequence: "Eating disorder develops; health crashes." }
      }
    },
    9: {
      title: "First Onscreen Kiss",
      topic: "Intimacy boundaries",
      scene: "{childName}'s script includes a kiss scene. They're nervous and unsure.",
      choices: {
        connect: { text: "Discuss feelings and boundaries.", consequence: "{childName} feels safe making choices." },
        teach: { text: "Explain intimacy coordinator role.", consequence: "They learn professionalism protects them." },
        boundary: { text: "Have them refuse if uncomfortable.", consequence: "Consent is always theirs." },
        avoid: { text: "Don't talk about it.", consequence: "{childName} processes silently and fearfully." },
        harm: { text: "Pressure them to 'just do it.'", consequence: "{childName} is retraumatized." }
      }
    },
    10: {
      title: "Award Nomination",
      topic: "Recognition",
      scene: "{childName} is nominated for an award. Excitement mixes with impostor feelings.",
      choices: {
        connect: { text: "Celebrate and remind them why.", consequence: "{childName} internalizes pride." },
        teach: { text: "Explain 'awards are nice but not proof.'", consequence: "They decouple self-worth from trophies." },
        boundary: { text: "Say winning isn't the point.", consequence: "Pressure eases; joy returns." },
        avoid: { text: "Casually mention it.", consequence: "{childName} feels like it doesn't matter." },
        harm: { text: "Say 'you better win.'", consequence: "{childName} is crushed by pressure." }
      }
    },
    11: {
      title: "Paparazzi Photo Unwanted",
      topic: "Privacy invasion",
      scene: "A paparazzi photo of {childName} going to school goes viral. It's uncomfortable.",
      choices: {
        connect: { text: "Reassure them about privacy.", consequence: "{childName} feels defended." },
        teach: { text: "Discuss 'public vs. private self.'", consequence: "They understand boundaries." },
        boundary: { text: "Adjust routines for safety.", consequence: "They regain some control." },
        avoid: { text: "Ignore it.", consequence: "{childName} feels exposed and powerless." },
        harm: { text: "Use the photo online yourself.", consequence: "{childName} feels betrayed." }
      }
    },
    12: {
      title: "Fan Obsession Revealed",
      topic: "Stalking risk",
      scene: "You discover a fan has been tracking {childName}'s location. It's creepy and scary.",
      choices: {
        connect: { text: "Discuss it openly; make a safety plan.", consequence: "{childName} feels protected." },
        teach: { text: "Explain healthy vs. obsessive fandom.", consequence: "They understand danger signs." },
        boundary: { text: "Hire security; limit public appearances.", consequence: "Safety is taken seriously." },
        avoid: { text: "Hope it goes away.", consequence: "{childName} is at risk." },
        harm: { text: "Minimize {childName}'s concerns.", consequence: "They stop reporting threats." }
      }
    },
    13: {
      title: "Substance Pressure on Set",
      topic: "Dangerous offers",
      scene: "An older actor offers {childName} alcohol or pills to 'relax' before a big scene.",
      choices: {
        connect: { text: "Ask what happened; believe them.", consequence: "{childName} trusts you with truth." },
        teach: { text: "Role-play safe refusals.", consequence: "They practice saying no." },
        boundary: { text: "Change productions immediately.", consequence: "They exit unsafe environment." },
        avoid: { text: "Don't know or ask.", consequence: "{childName} may accept drugs." },
        harm: { text: "Blame {childName} for being 'naïve.'", consequence: "They hide future incidents." }
      }
    },
    14: {
      title: "Leaked Personal Photos",
      topic: "Privacy breach",
      scene: "Private photos of {childName} are leaked online. They're embarrassed and angry.",
      choices: {
        connect: { text: "Stand by them; don't blame them.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss 'nothing is truly private online.'", consequence: "They learn caution." },
        boundary: { text: "Report and get legal help.", consequence: "You advocate fiercely." },
        avoid: { text: "Tell them to 'move on.'", consequence: "{childName} feels dismissed." },
        harm: { text: "Shame them for the leak.", consequence: "{childName} is traumatized." }
      }
    },
    15: {
      title: "Burnout: Can't Remember Lines",
      topic: "Exhaustion",
      scene: "{childName} forgets lines repeatedly. They cry on set. Burnout is obvious.",
      choices: {
        connect: { text: "Withdraw them; prioritize health.", consequence: "{childName} recovers and feels safe." },
        teach: { text: "Explain rest is necessary.", consequence: "They accept needing breaks." },
        boundary: { text: "Refuse jobs for 6 months.", consequence: "Real recovery happens." },
        avoid: { text: "Push them to work through it.", consequence: "Burnout deepens; mental health crashes." },
        harm: { text: "Say 'actors don't get tired.'", consequence: "{childName} hides suffering." }
      }
    },
    16: {
      title: "Industry Predator Warning",
      topic: "Grooming alert",
      scene: "You hear that a producer {childName} met is known for grooming young actors.",
      choices: {
        connect: { text: "Warn them clearly and lovingly.", consequence: "{childName} is protected and alert." },
        teach: { text: "Teach warning signs of grooming.", consequence: "They can protect themselves." },
        boundary: { text: "Ban contact with that producer.", consequence: "Safety is enforced." },
        avoid: { text: "Stay silent.", consequence: "{childName} may be victimized." },
        harm: { text: "Blame {childName} if approached.", consequence: "They stop reporting abuse." }
      }
    },
    17: {
      title: "Aging Out, Losing Roles",
      topic: "Career shift",
      scene: "{childName} ages past 'cute kid' roles. Offers dry up. They panic.",
      choices: {
        connect: { text: "Reassure them: reinvention is normal.", consequence: "{childName} hopes and adapts." },
        teach: { text: "Help pivot to teen/adult roles.", consequence: "They plan a new career arc." },
        boundary: { text: "Offer non-acting career paths.", consequence: "They feel less trapped." },
        avoid: { text: "Let them spiral.", consequence: "{childName} feels identity is tied to acting." },
        harm: { text: "Push unethical roles to stay relevant.", consequence: "They compromise their values." }
      }
    },
    18: {
      title: "Adult Actor Independence",
      topic: "Your own path",
      scene: "{childName} is 18 and choosing their next chapter: continue acting or step back?",
      choices: {
        connect: { text: "Support them either way.", consequence: "{childName} feels truly free." },
        teach: { text: "Discuss long-term career strategy.", consequence: "They think beyond immediate fame." },
        boundary: { text: "Respect if they want to quit.", consequence: "You honor their autonomy." },
        avoid: { text: "Assume they'll keep acting.", consequence: "{childName} feels pressured." },
        harm: { text: "Blame them for wasting their talent.", consequence: "{childName} resents you." }
      }
    }
  },

  spotlight_pro_athlete: {
    1: {
      title: "Natural Athlete Talent",
      topic: "Sports spark",
      scene: "{childName} is fast, strong, and loves to move. Coaches notice early.",
      choices: {
        connect: { text: "Play games with {childName} daily.", consequence: "Exercise becomes bonding time." },
        teach: { text: "Teach proper form and technique.", consequence: "They build good habits young." },
        boundary: { text: "Keep it fun, no pressure.", consequence: "{childName} plays for joy." },
        avoid: { text: "Don't engage.", consequence: "Talent is underdeveloped." },
        harm: { text: "Push elite training too early.", consequence: "{childName} burns out young." }
      }
    },
    2: {
      title: "Youth Team Invitation",
      topic: "Organized sports",
      scene: "A competitive youth team invites {childName} to try out. It's legit and well-coached.",
      choices: {
        connect: { text: "Attend every practice.", consequence: "{childName} feels supported." },
        teach: { text: "Explain teamwork and discipline.", consequence: "They grasp sports culture." },
        boundary: { text: "Let {childName} decide.", consequence: "They own the choice." },
        avoid: { text: "Drop them and leave.", consequence: "{childName} feels alone." },
        harm: { text: "Say 'this is your only future.'", consequence: "{childName} panics." }
      }
    },
    3: {
      title: "First Real Loss",
      topic: "Defeat stings",
      scene: "{childName}'s team loses a big game. They're crushed and blame themselves.",
      choices: {
        connect: { text: "Hug them; listen to their feelings.", consequence: "{childName} grieves and moves on." },
        teach: { text: "Explain loss teaches resilience.", consequence: "They build mental toughness." },
        boundary: { text: "Remind them it's one game.", consequence: "Perspective returns." },
        avoid: { text: "Act disappointed.", consequence: "{childName} thinks you're ashamed." },
        harm: { text: "Say 'you cost us the game.'", consequence: "{childName} spirals in shame." }
      }
    },
    4: {
      title: "Winning Streak & Ego",
      topic: "Success risk",
      scene: "{childName}'s team wins 5 games in a row. {childName} is boasting and cocky.",
      choices: {
        connect: { text: "Celebrate wins; temper arrogance.", consequence: "{childName} stays grounded." },
        teach: { text: "Teach humility and respect.", consequence: "They learn sportsmanship." },
        boundary: { text: "Remind them opponents are equals.", consequence: "Ego deflates healthily." },
        avoid: { text: "Inflate their ego further.", consequence: "Cocky attitude grows." },
        harm: { text: "Encourage arrogance.", consequence: "{childName} becomes insufferable." }
      }
    },
    5: {
      title: "Injury During Practice",
      topic: "First hurt",
      scene: "{childName} twists their ankle. It hurts. They want to keep playing.",
      choices: {
        connect: { text: "Insist on sitting out; care for them.", consequence: "{childName} learns to listen to body." },
        teach: { text: "Explain injury prevention.", consequence: "They respect physical limits." },
        boundary: { text: "Have it checked by doctor.", consequence: "No serious damage occurs." },
        avoid: { text: "Let them keep playing.", consequence: "Injury worsens." },
        harm: { text: "Push through the pain.", consequence: "Chronic injury develops." }
      }
    },
    6: {
      title: "Choosing a Sport (Too Many Offers)",
      topic: "Specialization",
      scene: "{childName} is recruited for soccer, basketball, and swimming. All want them.",
      choices: {
        connect: { text: "Help {childName} explore each sport.", consequence: "They choose authentically." },
        teach: { text: "Explain 'specializing builds mastery.'", consequence: "{childName} commits wisely." },
        boundary: { text: "Suggest one sport + one fun activity.", consequence: "Balance is protected." },
        avoid: { text: "Let them do all three.", consequence: "{childName} is overscheduled." },
        harm: { text: "Force your favorite sport.", consequence: "{childName} resents it." }
      }
    },
    7: {
      title: "Coach Is Harsh/Abusive",
      topic: "Unsafe coaching",
      scene: "The coach yells, demeans players, and makes {childName} feel small.",
      choices: {
        connect: { text: "Ask how {childName} feels about coach.", consequence: "They open up safely." },
        teach: { text: "Explain 'coaches should build up.'", consequence: "They recognize bad coaching." },
        boundary: { text: "Switch teams immediately.", consequence: "They escape a toxic environment." },
        avoid: { text: "Do nothing.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'toughen up; real athletes endure.'", consequence: "{childName} normalizes abuse." }
      }
    },
    8: {
      title: "Academics vs. Sports Crunch",
      topic: "Time management",
      scene: "{childName}'s grades are slipping because of sports. Both matter.",
      choices: {
        connect: { text: "Problem-solve together.", consequence: "They learn to balance." },
        teach: { text: "Create a realistic schedule.", consequence: "{childName} succeeds at both." },
        boundary: { text: "School comes first; sports second.", consequence: "Education is protected." },
        avoid: { text: "Ignore the grades.", consequence: "{childName} struggles academically." },
        harm: { text: "Say 'forget school, play ball.'", consequence: "Academic future is sacrificed." }
      }
    },
    9: {
      title: "Strength Training & Body Image",
      topic: "Physical changes",
      scene: "{childName} is muscular and fit now. They're either proud or obsessed.",
      choices: {
        connect: { text: "Celebrate health, not just looks.", consequence: "{childName} loves their body for function." },
        teach: { text: "Teach proper nutrition.", consequence: "They fuel wisely." },
        boundary: { text: "Watch for obsessive behaviors.", consequence: "You catch eating disorders early." },
        avoid: { text: "Don't comment.", consequence: "{childName} processes alone." },
        harm: { text: "Praise muscles over character.", consequence: "{childName} becomes vain." }
      }
    },
    10: {
      title: "Regional Playoff Pressure",
      topic: "High stakes",
      scene: "Regionals are here. {childName} is anxious and under intense pressure.",
      choices: {
        connect: { text: "Reassure them you love them either way.", consequence: "{childName} relaxes and plays free." },
        teach: { text: "Teach mental performance skills.", consequence: "They manage anxiety well." },
        boundary: { text: "Say 'have fun, that's all I care about.'", consequence: "Lightness returns." },
        avoid: { text: "Add your own pressure.", consequence: "{childName} chokes." },
        harm: { text: "Blame them if they lose.", consequence: "{childName} is traumatized." }
      }
    },
    11: {
      title: "Scholarship Possibilities Emerge",
      topic: "Future funding",
      scene: "Colleges are watching {childName}. Scholarships seem possible. Pressure rises.",
      choices: {
        connect: { text: "Discuss dreams without forcing.", consequence: "{childName} feels supported, not pushed." },
        teach: { text: "Explain college isn't guaranteed.", consequence: "They stay realistic." },
        boundary: { text: "Say 'we'll pay regardless of sports.'", consequence: "Scholarship becomes bonus, not lifeline." },
        avoid: { text: "Let {childName} internalize pressure.", consequence: "They obsess over scholarships." },
        harm: { text: "Say 'scholarship is your only option.'", consequence: "{childName} panics." }
      }
    },
    12: {
      title: "Teammates Excluded {childName}",
      topic: "Social rift",
      scene: "Teammates are jealous of {childName}'s talent. They freeze them out.",
      choices: {
        connect: { text: "Validate the hurt.", consequence: "{childName} feels understood." },
        teach: { text: "Help navigate team politics.", consequence: "They learn conflict skills." },
        boundary: { text: "Find a different team if needed.", consequence: "They escape toxicity." },
        avoid: { text: "Ignore social struggles.", consequence: "{childName} withdraws." },
        harm: { text: "Say '{childName} deserves it.'", consequence: "{childName} believes they're bad." }
      }
    },
    13: {
      title: "Doping Pressure / Supplement Pitches",
      topic: "Cheating temptation",
      scene: "Someone suggests performance drugs. They promise results. {childName} is tempted.",
      choices: {
        connect: { text: "Ask why they're considering it.", consequence: "{childName} opens up about pressure." },
        teach: { text: "Explain health risks and disqualification.", consequence: "They understand consequences." },
        boundary: { text: "Ban all supplements unless doctor-approved.", consequence: "They stay safe." },
        avoid: { text: "Don't address it.", consequence: "{childName} may dope secretly." },
        harm: { text: "Encourage 'anything to win.'", consequence: "{childName} risks their health." }
      }
    },
    14: {
      title: "Serious Injury (ACL or Worse)",
      topic: "Career threat",
      scene: "{childName} tears their ACL. Surgery is needed. Recovery is 6-12 months.",
      choices: {
        connect: { text: "Be present through rehab.", consequence: "{childName} heals emotionally and physically." },
        teach: { text: "Discuss comebacks take time.", consequence: "They stay patient and hopeful." },
        boundary: { text: "Insist on best medical care.", consequence: "Recovery maximizes." },
        avoid: { text: "Leave {childName} to struggle.", consequence: "Depression sets in." },
        harm: { text: "Blame them for 'being careless.'", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "Burnout: Hates Training Now",
      topic: "Passion dying",
      scene: "{childName} dreads practice. They say 'I don't love this anymore.' You're shocked.",
      choices: {
        connect: { text: "Listen without judgment.", consequence: "{childName} trusts your support." },
        teach: { text: "Explain burnout is real.", consequence: "They feel validated." },
        boundary: { text: "Offer a real break (2 months).", consequence: "Passion can return." },
        avoid: { text: "Push harder.", consequence: "They quit sports entirely." },
        harm: { text: "Say 'you're throwing away your future.'", consequence: "{childName} resents you." }
      }
    },
    16: {
      title: "Agent/Professional Offers",
      topic: "Go pro talks",
      scene: "A professional league is interested. Agents are calling. It's real.",
      choices: {
        connect: { text: "Discuss {childName}'s vision and dreams.", consequence: "They make an empowered choice." },
        teach: { text: "Have them review contracts carefully.", consequence: "They understand terms." },
        boundary: { text: "Insist on finishing college.", consequence: "They have a backup plan." },
        avoid: { text: "Stay uninvolved.", consequence: "{childName} may be exploited." },
        harm: { text: "Push them to turn pro too fast.", consequence: "They skip college and regret it." }
      }
    },
    17: {
      title: "Public vs. Private Self",
      topic: "Fame and privacy",
      scene: "People recognize {childName} in public. Fans ask for photos. It's flattering and weird.",
      choices: {
        connect: { text: "Discuss how to handle attention.", consequence: "{childName} owns their public image." },
        teach: { text: "Teach boundaries with fans.", consequence: "They stay safe and kind." },
        boundary: { text: "Help them carve out private time.", consequence: "They recharge peacefully." },
        avoid: { text: "Act like it's no big deal.", consequence: "{childName} processes alone." },
        harm: { text: "Push them to monetize every moment.", consequence: "{childName} loses privacy." }
      }
    },
    18: {
      title: "Career Ceiling & Life Beyond Sport",
      topic: "Adult identity",
      scene: "{childName} is 18. They're good but not Olympic-level. What's next for them?",
      choices: {
        connect: { text: "Celebrate who they are, sport or not.", consequence: "{childName} feels valued as a person." },
        teach: { text: "Help them explore post-athletic careers.", consequence: "They have exciting options." },
        boundary: { text: "Support stepping back from sport.", consequence: "They can retire with pride." },
        avoid: { text: "Push them to keep trying.", consequence: "{childName} is stuck in the past." },
        harm: { text: "Blame them for not being elite.", consequence: "{childName} hates themselves." }
      }
    }
  },

  spotlight_influencer: {
    1: {
      title: "Social Media Account Created",
      topic: "Online presence begins",
      scene: "{childName} starts a social media account. You help set it up safely.",
      choices: {
        connect: { text: "Review account together regularly.", consequence: "{childName} feels supervised and safe." },
        teach: { text: "Teach privacy settings and safety.", consequence: "They know how to protect themselves." },
        boundary: { text: "Require you know all passwords.", consequence: "You can check in anytime." },
        avoid: { text: "Let {childName} handle it alone.", consequence: "They make safety mistakes." },
        harm: { text: "Use their account for yourself.", consequence: "{childName} feels violated." }
      }
    },
    2: {
      title: "First Post Goes Viral (Cute Video)",
      topic: "Unexpected fame",
      scene: "{childName} posts a funny video. 50k views overnight. They're shocked and thrilled.",
      choices: {
        connect: { text: "Celebrate the moment together.", consequence: "{childName} feels pride and connection." },
        teach: { text: "Explain 'viral doesn't last; stay humble.'", consequence: "They keep perspective." },
        boundary: { text: "Discuss not every moment needs posting.", consequence: "They respect privacy boundaries." },
        avoid: { text: "Ignore it or downplay it.", consequence: "{childName} feels unseen." },
        harm: { text: "Say 'now you're famous, act famous.'", consequence: "{childName} becomes arrogant." }
      }
    },
    3: {
      title: "Weird Comments and DMs",
      topic: "Stranger interaction",
      scene: "{childName} gets strange messages from older users. Some are creepy.",
      choices: {
        connect: { text: "Talk about what's okay and not.", consequence: "{childName} learns to recognize red flags." },
        teach: { text: "Explain predatory behavior.", consequence: "They know to report weirdos." },
        boundary: { text: "Set rules: no private chats.", consequence: "Safety is enforced." },
        avoid: { text: "Don't discuss it.", consequence: "{childName} may engage with predators." },
        harm: { text: "Blame {childName} for the attention.", consequence: "They hide future harassment." }
      }
    },
    4: {
      title: "Sponsored Post Offer",
      topic: "Monetization begins",
      scene: "A brand wants to pay {childName} for a product post. $300 for one post.",
      choices: {
        connect: { text: "Discuss brand values together.", consequence: "{childName} learns to align values." },
        teach: { text: "Explain FTC disclosure rules.", consequence: "They do partnerships ethically." },
        boundary: { text: "Require approval of all brand deals.", consequence: "You vet sponsors." },
        avoid: { text: "Let {childName} take any deal.", consequence: "They endorse questionable products." },
        harm: { text: "Demand all earnings for yourself.", consequence: "{childName} feels exploited." }
      }
    },
    5: {
      title: "Comparison & Jealousy Spiral",
      topic: "Toxic metrics",
      scene: "A peer has 10x more followers. {childName} is upset and feeling 'not good enough.'",
      choices: {
        connect: { text: "Validate the feelings; reassure them.", consequence: "{childName} feels supported." },
        teach: { text: "Explain algorithms are luck-based.", consequence: "They stop comparing." },
        boundary: { text: "Suggest a social media break.", consequence: "Anxiety eases." },
        avoid: { text: "Dismiss their feelings.", consequence: "{childName} internalizes shame." },
        harm: { text: "Encourage unhealthy competition.", consequence: "{childName} obsesses with metrics." }
      }
    },
    6: {
      title: "Negative Comments Hurt",
      topic: "Cyberbullying starts",
      scene: "Mean comments appear: 'You're ugly,' 'You're fake.' {childName} is crushed.",
      choices: {
        connect: { text: "Help them process the hurt.", consequence: "{childName} feels heard and less alone." },
        teach: { text: "Explain critics are often jealous.", consequence: "They build resilience." },
        boundary: { text: "Show how to block/report bullies.", consequence: "They take action." },
        avoid: { text: "Ignore their pain.", consequence: "{childName} spirals into shame." },
        harm: { text: "Say the critics have a point.", consequence: "{childName} believes they're worthless." }
      }
    },
    7: {
      title: "FOMO & Posting Pressure",
      topic: "Addiction begins",
      scene: "{childName} checks their phone constantly. They feel anxious if they don't post daily.",
      choices: {
        connect: { text: "Gently discuss the anxiety.", consequence: "{childName} recognizes the pattern." },
        teach: { text: "Explain platform addiction tactics.", consequence: "They understand manipulation." },
        boundary: { text: "Set phone-free times/zones.", consequence: "Relief comes through breaks." },
        avoid: { text: "Ignore the behavior.", consequence: "{childName}'s addiction deepens." },
        harm: { text: "Say 'if you want followers, post more.'", consequence: "Obsession worsens." }
      }
    },
    8: {
      title: "Body Image Crisis from Comments",
      topic: "Appearance pressure",
      scene: "Followers comment on {childName}'s body. Some sexualize them. {childName} is horrified.",
      choices: {
        connect: { text: "Validate their anger and discomfort.", consequence: "{childName} feels protected." },
        teach: { text: "Explain objectification and boundaries.", consequence: "They understand what's wrong." },
        boundary: { text: "Disable comments on photos.", consequence: "They regain control." },
        avoid: { text: "Tell them to 'ignore it.'", consequence: "{childName} internalizes the comments." },
        harm: { text: "Suggest they lean into the sexualization.", consequence: "Predatory behavior escalates." }
      }
    },
    9: {
      title: "Friendship Drama Goes Public",
      topic: "Privacy explosion",
      scene: "{childName} posts about a friend conflict. The friend sees it. Drama explodes.",
      choices: {
        connect: { text: "Talk about venting vs. posting.", consequence: "{childName} learns to keep confidence." },
        teach: { text: "Explain 'post is permanent.'", consequence: "They think before sharing." },
        boundary: { text: "Require {childName} to ask before posting.", consequence: "Others' privacy is respected." },
        avoid: { text: "Stay out of it.", consequence: "{childName} repeats the mistake." },
        harm: { text: "Share {childName}'s secrets on your account.", consequence: "{childName} feels betrayed." }
      }
    },
    10: {
      title: "Influencer Collabs & Competition",
      topic: "Peer pressure",
      scene: "Bigger influencers want to collab with {childName}. {childName} feels pressure to keep up.",
      choices: {
        connect: { text: "Discuss which collabs feel right.", consequence: "{childName} chooses authentically." },
        teach: { text: "Explain not every collab is worth it.", consequence: "They learn discernment." },
        boundary: { text: "Allow only collabs you approve.", consequence: "Quality control stays." },
        avoid: { text: "Let {childName} do anything.", consequence: "They overcommit and burn out." },
        harm: { text: "Push unsavory collabs for growth.", consequence: "{childName} compromises values." }
      }
    },
    11: {
      title: "Imposter Syndrome & Authenticity",
      topic: "Real vs. fake self",
      scene: "{childName} wonders: am I being myself or a character? The line is blurry.",
      choices: {
        connect: { text: "Ask who they really are beyond posts.", consequence: "{childName} reconnects with true self." },
        teach: { text: "Explain curated content vs. reality.", consequence: "They understand the difference." },
        boundary: { text: "Encourage posting less/raw content.", consequence: "Authenticity increases." },
        avoid: { text: "Pretend social media is reality.", consequence: "{childName} loses themselves." },
        harm: { text: "Say 'the character is your brand now.'", consequence: "{childName} abandons their real self." }
      }
    },
    12: {
      title: "Inappropriate DM from Adult",
      topic: "Grooming alert",
      scene: "An adult is messaging {childName} with flirtation and compliments. Red flags everywhere.",
      choices: {
        connect: { text: "Create safe space to tell you.", consequence: "{childName} reports to you immediately." },
        teach: { text: "Teach grooming tactics.", consequence: "They can spot manipulation." },
        boundary: { text: "Report to platform and police.", consequence: "The predator is removed." },
        avoid: { text: "Don't discuss it.", consequence: "{childName} may be victimized." },
        harm: { text: "Blame {childName} for the message.", consequence: "They hide future abuse." }
      }
    },
    13: {
      title: "Mental Health Impact Visible",
      topic: "Anxiety/depression",
      scene: "{childName} is withdrawn, anxious, obsessed with likes. You see them suffering.",
      choices: {
        connect: { text: "Suggest a 2-week detox.", consequence: "{childName} gets relief and perspective." },
        teach: { text: "Discuss impact of constant performance.", consequence: "They understand the cost." },
        boundary: { text: "Enforce a break; delete the app.", consequence: "Healing begins." },
        avoid: { text: "Ignore the signs.", consequence: "{childName}'s mental health crashes." },
        harm: { text: "Say 'toughen up; everyone handles it.'", consequence: "{childName} hides their struggle." }
      }
    },
    14: {
      title: "Cancel Culture Threat",
      topic: "Public scrutiny",
      scene: "An old post of {childName}'s is dug up and misinterpreted. People are calling them out.",
      choices: {
        connect: { text: "Support them through the storm.", consequence: "{childName} feels defended." },
        teach: { text: "Discuss apology, growth, and moving on.", consequence: "They handle it with grace." },
        boundary: { text: "Advise deleting old problematic posts.", consequence: "They curate their history." },
        avoid: { text: "Leave them to handle it alone.", consequence: "{childName} is traumatized." },
        harm: { text: "Agree with the criticism harshly.", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "Fame Affecting Real Relationships",
      topic: "Isolation",
      scene: "Real-life friends feel {childName} is distant or arrogant. {childName} is lonely.",
      choices: {
        connect: { text: "Help them reconnect with true friends.", consequence: "{childName} rebuilds grounding." },
        teach: { text: "Discuss 'followers aren't real friends.'", consequence: "They value real relationships." },
        boundary: { text: "Encourage time offline with loved ones.", consequence: "Balance returns." },
        avoid: { text: "Let {childName} isolate.", consequence: "Real friendships dissolve." },
        harm: { text: "Say 'real friends don't matter.'", consequence: "{childName} becomes friendless." }
      }
    },
    16: {
      title: "Filtering & Body Dysmorphia",
      topic: "Reality distortion",
      scene: "{childName} uses filters so much they don't recognize themselves unfiltered. They feel ugly.",
      choices: {
        connect: { text: "Take unfiltered photos together.", consequence: "{childName} accepts their real face." },
        teach: { text: "Explain filter manipulation.", consequence: "They see the deception." },
        boundary: { text: "Ban filters on new posts.", consequence: "Authenticity returns." },
        avoid: { text: "Ignore the behavior.", consequence: "{childName} develops body dysmorphia." },
        harm: { text: "Encourage more extreme filters.", consequence: "Dysphoria deepens." }
      }
    },
    17: {
      title: "Monetization Tax & Legal Reality",
      topic: "Adult business concerns",
      scene: "{childName} made $5k this year. Taxes, contracts, and liability are complicated.",
      choices: {
        connect: { text: "Help navigate business basics.", consequence: "{childName} learns responsibility." },
        teach: { text: "Hire an accountant/lawyer.", consequence: "They're protected legally." },
        boundary: { text: "Set aside 40% for taxes.", consequence: "No surprise debt later." },
        avoid: { text: "Ignore the business side.", consequence: "{childName} faces tax penalties." },
        harm: { text: "Take all the money yourself.", consequence: "{childName} is exploited." }
      }
    },
    18: {
      title: "Career or College Choice",
      topic: "Future decision",
      scene: "{childName} is 18. Influencing pays well. But college offers stability. What now?",
      choices: {
        connect: { text: "Ask what {childName} truly wants.", consequence: "They choose authentically." },
        teach: { text: "Discuss diversification and retirement.", consequence: "They think long-term." },
        boundary: { text: "Require college as a safety net.", consequence: "They have a backup plan." },
        avoid: { text: "Stay silent; let them choose.", consequence: "{childName} feels unsupported." },
        harm: { text: "Push them to monetize forever.", consequence: "{childName} never builds other skills." }
      }
    }
  },

  spotlight_music_icon: {
    1: {
      title: "Musical Family Heritage",
      topic: "Legacy awakens",
      scene: "You discover {childName} hums melodies perfectly. Music runs in your family.",
      choices: {
        connect: { text: "Share family music stories.", consequence: "{childName} feels connected to legacy." },
        teach: { text: "Play family records together.", consequence: "They inherit musical appreciation." },
        boundary: { text: "Let {childName} find their own path.", consequence: "They choose freely." },
        avoid: { text: "Never mention music.", consequence: "They don't know their heritage." },
        harm: { text: "Say 'you must be as great.'", consequence: "{childName} feels pressured." }
      }
    },
    2: {
      title: "First Instrument Introduction",
      topic: "Musical training starts",
      scene: "{childName} is fascinated by your piano. Do you teach them or hire a teacher?",
      choices: {
        connect: { text: "Teach them yourself; bond over it.", consequence: "Special bonding over music." },
        teach: { text: "Hire a patient teacher.", consequence: "Professional foundation is built." },
        boundary: { text: "Let {childName} ask before lessons.", consequence: "Intrinsic motivation comes first." },
        avoid: { text: "Keep the instrument hidden.", consequence: "Interest is suppressed." },
        harm: { text: "Force lessons they hate.", consequence: "{childName} resists music." }
      }
    },
    3: {
      title: "First Recital Jitters",
      topic: "Public performance",
      scene: "{childName} will play in a local recital. They're nervous and excited.",
      choices: {
        connect: { text: "Practice together; calm their nerves.", consequence: "Confidence grows." },
        teach: { text: "Teach them performance basics.", consequence: "They handle pressure well." },
        boundary: { text: "Say 'perfection isn't the goal.'", consequence: "Anxiety eases." },
        avoid: { text: "Don't attend or acknowledge.", consequence: "{childName} feels unsupported." },
        harm: { text: "Say 'you better not mess up.'", consequence: "Crushing pressure; they freeze." }
      }
    },
    4: {
      title: "Genre Preference Emerges",
      topic: "Musical taste",
      scene: "{childName} gravitates to a genre (jazz, classical, rock). It differs from yours.",
      choices: {
        connect: { text: "Listen to their genre with them.", consequence: "{childName} feels accepted." },
        teach: { text: "Help them explore that genre deeply.", consequence: "True passion develops." },
        boundary: { text: "Support their choice fully.", consequence: "Autonomy is respected." },
        avoid: { text: "Dismiss their preference.", consequence: "{childName} doubts their taste." },
        harm: { text: "Insist on your genre only.", consequence: "{childName} resents music." }
      }
    },
    5: {
      title: "Multi-Instrument Curiosity",
      topic: "Expanding skills",
      scene: "{childName} wants to learn a second instrument. Budget and time are questions.",
      choices: {
        connect: { text: "Help explore options together.", consequence: "Their musical world expands." },
        teach: { text: "Explain discipline builds mastery.", consequence: "They learn focus." },
        boundary: { text: "Limit to one main instrument.", consequence: "Depth over breadth." },
        avoid: { text: "Let {childName} overload.", consequence: "They're overwhelmed." },
        harm: { text: "Say 'you're not talented enough for two.'", consequence: "{childName} stops trying." }
      }
    },
    6: {
      title: "School Talent Show Win",
      topic: "Recognition",
      scene: "{childName} wins the school talent show. Peers and teachers applaud loudly.",
      choices: {
        connect: { text: "Celebrate with genuine pride.", consequence: "{childName} internalizes success." },
        teach: { text: "Discuss what made them stand out.", consequence: "They understand their strengths." },
        boundary: { text: "Remind them to stay humble.", consequence: "Ego stays grounded." },
        avoid: { text: "React mildly.", consequence: "{childName} feels invisible." },
        harm: { text: "Say 'don't get big-headed.'", consequence: "Shame taints the win." }
      }
    },
    7: {
      title: "Composing First Original Piece",
      topic: "Creativity",
      scene: "{childName} composes a short piece. It's raw and heartfelt. You hear it.",
      choices: {
        connect: { text: "Ask about the inspiration.", consequence: "{childName} opens up emotionally." },
        teach: { text: "Offer gentle craft feedback.", consequence: "They improve with support." },
        boundary: { text: "Let them decide when to share.", consequence: "They control the pace." },
        avoid: { text: "Ignore the piece.", consequence: "{childName} stops composing." },
        harm: { text: "Harshly critique their composition.", consequence: "Creative confidence crashes." }
      }
    },
    8: {
      title: "First Ensemble/Orchestra Experience",
      topic: "Ensemble dynamics",
      scene: "{childName} joins a youth orchestra. They're learning to play with others.",
      choices: {
        connect: { text: "Attend rehearsals/concerts.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss listening and collaboration.", consequence: "They learn musicianship." },
        boundary: { text: "Let them find their voice in the group.", consequence: "They belong without losing identity." },
        avoid: { text: "Drop them and disappear.", consequence: "{childName} feels alone." },
        harm: { text: "Compare them to other performers.", consequence: "{childName} develops anxiety." }
      }
    },
    9: {
      title: "Teacher Changing/Conflict",
      topic: "Growth challenge",
      scene: "The current teacher's style isn't working. {childName} wants to switch.",
      choices: {
        connect: { text: "Listen to {childName}'s concerns.", consequence: "They feel heard." },
        teach: { text: "Help find a compatible new teacher.", consequence: "Growth accelerates." },
        boundary: { text: "Support the switch professionally.", consequence: "Teaching fit improves." },
        avoid: { text: "Force them to stay.", consequence: "{childName} resents music." },
        harm: { text: "Say 'teachers are always right.'", consequence: "{childName} internalizes harm." }
      }
    },
    10: {
      title: "Serious Practice Plateau",
      topic: "Frustration",
      scene: "{childName} isn't improving. They practice but feel stuck. Frustration grows.",
      choices: {
        connect: { text: "Validate the frustration.", consequence: "{childName} feels understood." },
        teach: { text: "Help analyze the obstacle.", consequence: "They strategize solutions." },
        boundary: { text: "Encourage a temporary break.", consequence: "Fresh perspective returns." },
        avoid: { text: "Ignore the struggle.", consequence: "{childName} quits music." },
        harm: { text: "Say 'maybe you're not talented.'", consequence: "They lose confidence entirely." }
      }
    },
    11: {
      title: "Local Competition/Festival Entry",
      topic: "Testing skills",
      scene: "A youth music competition is coming. {childName} wants to enter.",
      choices: {
        connect: { text: "Support their decision fully.", consequence: "{childName} feels backed." },
        teach: { text: "Discuss it as a growth opportunity.", consequence: "Pressure feels manageable." },
        boundary: { text: "Say 'results don't define you.'", consequence: "Stakes feel lower; they relax." },
        avoid: { text: "Let them decide alone.", consequence: "{childName} spirals in doubt." },
        harm: { text: "Say 'you have to win.'", consequence: "Crushing pressure; they choke." }
      }
    },
    12: {
      title: "Summer Music Camp Opportunity",
      topic: "Intensive growth",
      scene: "An intensive summer music camp invites {childName}. It's expensive but world-class.",
      choices: {
        connect: { text: "Discuss it together; make it happen.", consequence: "{childName} feels prioritized." },
        teach: { text: "Explain the value of intensive training.", consequence: "They commit enthusiastically." },
        boundary: { text: "Ensure time for rest and play.", consequence: "Balance is maintained." },
        avoid: { text: "Casually mention it; don't push.", consequence: "{childName} misses opportunity." },
        harm: { text: "Guilt-trip them into going.", consequence: "{childName} attends resentfully." }
      }
    },
    13: {
      title: "Identity Beyond Music",
      topic: "Well-rounded self",
      scene: "{childName} is talented but wonders: is music my only identity? They want other pursuits.",
      choices: {
        connect: { text: "Encourage diverse interests.", consequence: "{childName} becomes well-rounded." },
        teach: { text: "Discuss 'music is a gift, not your whole self.'", consequence: "Balance feels healthy." },
        boundary: { text: "Support non-music activities equally.", consequence: "They explore freely." },
        avoid: { text: "Dismiss non-music interests.", consequence: "{childName} feels one-dimensional." },
        harm: { text: "Say 'music is your destiny; nothing else.'", consequence: "{childName} feels trapped." }
      }
    },
    14: {
      title: "Peer Pressure: Cheating Practice Log",
      topic: "Integrity test",
      scene: "{childName} is tempted to fake practice hours. Peers do it. The teacher wouldn't know.",
      choices: {
        connect: { text: "Ask why they're considering it.", consequence: "{childName} opens up about pressure." },
        teach: { text: "Discuss how cheating hurts only themselves.", consequence: "Integrity strengthens." },
        boundary: { text: "Reinforce: practice is for you, not teacher.", consequence: "Intrinsic motivation returns." },
        avoid: { text: "Don't discuss it.", consequence: "{childName} may cheat." },
        harm: { text: "Say 'fake it if it works.'", consequence: "Dishonesty becomes normal." }
      }
    },
    15: {
      title: "Performance Anxiety Peaks",
      topic: "Mental health",
      scene: "{childName} has performance anxiety so bad they're considering quitting music.",
      choices: {
        connect: { text: "Seek a therapist specializing in performance.", consequence: "Anxiety is manageable with tools." },
        teach: { text: "Teach grounding and breathing techniques.", consequence: "They can calm themselves." },
        boundary: { text: "Consider lower-pressure venues.", consequence: "Confidence rebuilds slowly." },
        avoid: { text: "Ignore the anxiety.", consequence: "{childName} quits or spirals." },
        harm: { text: "Say 'real musicians don't get anxious.'", consequence: "{childName} hides their struggle." }
      }
    },
    16: {
      title: "Rejection from Prestigious Program",
      topic: "Disappointment",
      scene: "{childName} didn't get into a prestigious youth conservatory. They're devastated.",
      choices: {
        connect: { text: "Comfort them; validate the hurt.", consequence: "{childName} feels understood." },
        teach: { text: "Explain programs are subjective.", consequence: "They don't internalize the rejection." },
        boundary: { text: "Explore other great programs.", consequence: "New opportunities emerge." },
        avoid: { text: "Act like it doesn't matter.", consequence: "{childName} feels minimized." },
        harm: { text: "Say 'maybe music isn't for you.'", consequence: "{childName} considers quitting." }
      }
    },
    17: {
      title: "College Major Decision",
      topic: "Future path",
      scene: "{childName} is 17. Music conservatory or broader college? Career or hobby?",
      choices: {
        connect: { text: "Discuss their dream life, not just music.", consequence: "{childName} chooses holistically." },
        teach: { text: "Explain conservatory vs. dual degree options.", consequence: "They understand paths." },
        boundary: { text: "Support any choice without pressure.", consequence: "They feel empowered." },
        avoid: { text: "Don't weigh in.", consequence: "{childName} feels unsupported." },
        harm: { text: "Push conservatory only.", consequence: "They may regret missing broader education." }
      }
    },
    18: {
      title: "Adult Musician Independence",
      topic: "Your own path",
      scene: "{childName} is 18 and legally choosing: professional musician, amateur, or something else?",
      choices: {
        connect: { text: "Celebrate their musical journey.", consequence: "{childName} feels truly proud." },
        teach: { text: "Discuss sustainable music career paths.", consequence: "They plan realistically." },
        boundary: { text: "Respect whatever they choose.", consequence: "Relationship stays strong." },
        avoid: { text: "Act like it's not your concern.", consequence: "{childName} feels unvalued." },
        harm: { text: "Blame them for not pursuing music.", consequence: "{childName} resents you." }
      }
    }
  }
};