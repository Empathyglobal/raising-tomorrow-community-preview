// Life Goal Moments Pack
// Short, optional popups that ONLY appear if a matching Life Goal is selected.
// Never appear when yearly scenario is mandatory.

export const LIFE_GOAL_MOMENTS = [
  // KID GOALS
  {
    id: 'lgm_kid_athlete_signup',
    goalId: 'kid_athlete',
    minAge: 5,
    maxAge: 14,
    title: 'Sports Team Signup',
    body: 'A coach invites your kid to join the team. Practice starts next week.',
    choices: [
      {
        id: 'signup',
        emoji: '🏅',
        text: "Sign them up—let's try it!",
        deltas: { fitness: 1, confidence: 0.5 },
        loveDelta: 1,
        stressDelta: 0.5,
        logLine: 'Signed up for sports—practice starts soon.',
        timelineTitle: '🏅 Sports Team'
      },
      {
        id: 'skip',
        emoji: '🤷',
        text: 'Not this year—too much already.',
        loveDelta: 0,
        stressDelta: -0.5,
        logLine: 'Skipped sports signup this year.',
        timelineTitle: '🤷 Passed on sports'
      }
    ]
  },
  {
    id: 'lgm_kid_healthy_habits_reset',
    goalId: 'kid_healthy_habits',
    minAge: 3,
    maxAge: 12,
    title: 'Bedtime Routine Reset',
    body: 'Sleep has been slipping. Time to rebuild the routine.',
    choices: [
      {
        id: 'commit',
        emoji: '😴',
        text: 'Lock in a bedtime schedule—start tonight.',
        deltas: { health: 1, discipline: 0.5 },
        stressDelta: 0.5,
        logLine: 'Rebuilt the bedtime routine.',
        timelineTitle: '😴 Sleep Routine'
      },
      {
        id: 'flexible',
        emoji: '🌙',
        text: 'Keep it loose and hope it settles.',
        deltas: { health: 0.3 },
        stressDelta: -0.2,
        logLine: 'Bedtime stays flexible.',
        timelineTitle: '🌙 Flexible sleep'
      }
    ]
  },
  {
    id: 'lgm_kid_social_party',
    goalId: 'kid_social_butterfly',
    minAge: 5,
    maxAge: 14,
    title: 'Birthday Party Invite',
    body: "They got invited to a classmate's party. RSVP by Friday.",
    choices: [
      {
        id: 'yes',
        emoji: '🦋',
        text: 'Yes! Help them pick a gift.',
        deltas: { social: 1, confidence: 0.5 },
        loveDelta: 1,
        moneyDelta: -30,
        logLine: 'They went to the party and had fun.',
        timelineTitle: '🎉 Birthday party'
      },
      {
        id: 'no',
        emoji: '🏠',
        text: 'Decline—family time this weekend.',
        deltas: { social: -0.2 },
        loveDelta: 0.5,
        stressDelta: -0.5,
        logLine: 'Skipped the party—kept it quiet.',
        timelineTitle: '🏠 Family weekend'
      }
    ]
  },
  {
    id: 'lgm_kid_resilient_coping',
    goalId: 'kid_resilient',
    minAge: 6,
    maxAge: 15,
    title: 'Coping Skill Practice',
    body: 'Anxiety is high. Time to practice a calming technique together.',
    choices: [
      {
        id: 'practice',
        emoji: '🛡️',
        text: 'Sit together—breathing + naming feelings.',
        deltas: { anxiety: -1, confidence: 0.5 },
        loveDelta: 1.5,
        stressDelta: 0.5,
        logLine: 'Practiced a coping skill—it helped.',
        timelineTitle: '🛡️ Coping practice'
      },
      {
        id: 'later',
        emoji: '⏳',
        text: 'Let them ride it out on their own.',
        deltas: { confidence: -0.3 },
        loveDelta: -0.5,
        logLine: 'Skipped the moment—they handled it alone.',
        timelineTitle: '⏳ Ride it out'
      }
    ]
  },
  {
    id: 'lgm_kid_leader_council',
    goalId: 'kid_leader',
    minAge: 10,
    maxAge: 16,
    title: 'Student Council Opportunity',
    body: "They're interested in running for student council. It's extra work, but it could build skills.",
    choices: [
      {
        id: 'support',
        emoji: '🎤',
        text: 'Encourage them—help with posters.',
        deltas: { confidence: 1, responsibility: 0.5, social: 0.5 },
        loveDelta: 1,
        moneyDelta: -20,
        logLine: 'They ran for student council—campaign underway.',
        timelineTitle: '🎤 Student council'
      },
      {
        id: 'skip',
        emoji: '📚',
        text: 'Focus on school—not extra commitments.',
        deltas: { discipline: 0.3 },
        logLine: 'Skipped student council this year.',
        timelineTitle: '📚 Focus on school'
      }
    ]
  },
  {
    id: 'lgm_kid_explorer_nature',
    goalId: 'kid_explorer',
    minAge: 4,
    maxAge: 12,
    title: 'Nature Day Adventure',
    body: 'Perfect weather for a hike. They want to explore the trail.',
    choices: [
      {
        id: 'go',
        emoji: '🧭',
        text: 'Pack snacks and go—let curiosity lead.',
        deltas: { curiosity: 1, fitness: 0.5 },
        loveDelta: 1.5,
        moneyDelta: -15,
        logLine: 'Explored the trail—found rocks and questions.',
        timelineTitle: '🧭 Nature adventure'
      },
      {
        id: 'stay',
        emoji: '🏠',
        text: 'Stay home—too much to do today.',
        stressDelta: -0.5,
        logLine: 'Stayed home—quiet day.',
        timelineTitle: '🏠 Quiet day'
      }
    ]
  },
  {
    id: 'lgm_kid_helper_chore',
    goalId: 'kid_helper',
    minAge: 5,
    maxAge: 14,
    title: 'Chore Responsibility',
    body: "They want to help with dinner. It'll be messy, but it's a chance to teach.",
    choices: [
      {
        id: 'yes',
        emoji: '🤝',
        text: "Hand them a task—even if it's slower.",
        deltas: { responsibility: 1, empathy: 0.3 },
        loveDelta: 1,
        logLine: 'They helped with dinner—slow but real.',
        timelineTitle: '🤝 Kitchen helper'
      },
      {
        id: 'no',
        emoji: '⏱️',
        text: 'Do it yourself—faster and cleaner.',
        deltas: { responsibility: -0.2 },
        stressDelta: -0.5,
        logLine: 'Handled dinner solo—quicker.',
        timelineTitle: '⏱️ Solo dinner prep'
      }
    ]
  },
  {
    id: 'lgm_kid_maker_project',
    goalId: 'kid_maker',
    minAge: 6,
    maxAge: 15,
    title: 'Build Weekend Project',
    body: 'They want to build something—cardboard castle, birdhouse, anything.',
    choices: [
      {
        id: 'build',
        emoji: '🧰',
        text: "Clear the table—let's make a mess!",
        deltas: { creativity: 1, discipline: 0.5 },
        loveDelta: 1.5,
        moneyDelta: -25,
        logLine: 'Built something together—glue and chaos.',
        timelineTitle: '🧰 Build project'
      },
      {
        id: 'skip',
        emoji: '📺',
        text: 'Not today—screen time is easier.',
        deltas: { creativity: -0.2 },
        stressDelta: -0.5,
        logLine: 'Skipped the project—quiet day.',
        timelineTitle: '📺 Screen time'
      }
    ]
  },

  // ADULT GOALS
  {
    id: 'lgm_adult_business_mentor',
    goalId: 'adult_business_builder',
    minAge: 1,
    maxAge: 18,
    title: 'Business Mentor Feedback',
    body: 'A mentor offers advice on growing your side hustle.',
    choices: [
      {
        id: 'listen',
        emoji: '🏗️',
        text: 'Take the feedback—apply it this week.',
        statePatch: (prev) => {
          const hasBusiness = Boolean(prev.businessAttempted);
          if (hasBusiness) {
            return {
              businessIncomePerYear: Math.max(0, Number(prev.businessIncomePerYear || 0) + 500)
            };
          }
          return { stress: Math.max(0, Number(prev.stress || 0) - 1) };
        },
        logLine: 'Took business mentor feedback.',
        timelineTitle: '🏗️ Business mentor'
      },
      {
        id: 'skip',
        emoji: '⏳',
        text: 'Too busy—maybe next time.',
        stressDelta: 0.5,
        logLine: 'Passed on mentor feedback.',
        timelineTitle: '⏳ Skipped mentor'
      }
    ]
  },
  {
    id: 'lgm_adult_politics_invite',
    goalId: 'adult_political_rise',
    minAge: 3,
    maxAge: 18,
    title: 'Local Party Invite',
    body: 'The local party chair invites you to a planning meeting. Could be a door opener.',
    choices: [
      {
        id: 'attend',
        emoji: '🗳️',
        text: 'Show up—network and listen.',
        statePatch: (prev) => ({
          politics: {
            ...(prev.politics || {}),
            approval: Math.min(100, Number(prev.politics?.approval || 55) + 3)
          }
        }),
        stressDelta: 1,
        logLine: 'Attended local party meeting.',
        timelineTitle: '🗳️ Party meeting'
      },
      {
        id: 'decline',
        emoji: '🏠',
        text: 'Decline—family time tonight.',
        stressDelta: -0.5,
        logLine: 'Skipped politics event—stayed home.',
        timelineTitle: '🏠 Family priority'
      }
    ]
  },
  {
    id: 'lgm_adult_community_drive',
    goalId: 'adult_community_giver',
    minAge: 2,
    maxAge: 18,
    title: 'Blood Drive Sign-Up',
    body: "There's a blood drive at the community center. They need donors.",
    choices: [
      {
        id: 'donate',
        emoji: '🩸',
        text: 'Schedule it—show up for others.',
        statePatch: (prev) => ({
          donationProgress: {
            total: Number(prev.donationProgress?.total || 0) + 1,
            byType: {
              blood: Number(prev.donationProgress?.byType?.blood || 0) + 1,
              plasma: Number(prev.donationProgress?.byType?.plasma || 0)
            },
            lastType: 'blood',
            streak: Number(prev.donationProgress?.streak || 0) + 1,
            unlocks: prev.donationProgress?.unlocks || { drive: false }
          }
        }),
        loveDelta: 1,
        logLine: 'Donated blood—helped the community.',
        timelineTitle: '🩸 Blood donation'
      },
      {
        id: 'skip',
        emoji: '⏰',
        text: 'Skip it—too busy this week.',
        stressDelta: -0.5,
        logLine: 'Passed on blood drive.',
        timelineTitle: '⏰ Skipped drive'
      }
    ]
  },
  {
    id: 'lgm_adult_lifelong_streak',
    goalId: 'adult_lifelong_learner',
    minAge: 2,
    maxAge: 18,
    title: 'Study Streak Moment',
    body: "You've been reading parenting research. Keep the streak alive?",
    choices: [
      {
        id: 'study',
        emoji: '📚',
        text: 'Finish the chapter—invest 30 minutes.',
        statePatch: (prev) => ({
          studyPoints: Number(prev.studyPoints || 0) + 2
        }),
        stressDelta: 0.5,
        logLine: 'Kept the study streak alive (+2 points).',
        timelineTitle: '📚 Study streak'
      },
      {
        id: 'skip',
        emoji: '😴',
        text: 'Skip tonight—brain is fried.',
        stressDelta: -1,
        logLine: 'Took a break from studying.',
        timelineTitle: '😴 Brain rest'
      }
    ]
  },
  {
    id: 'lgm_adult_clean_record_offer',
    goalId: 'adult_clean_record',
    minAge: 5,
    maxAge: 18,
    title: 'Shady Opportunity',
    body: 'Someone offers you a "side deal"—fast cash, no questions.',
    choices: [
      {
        id: 'walk_away',
        emoji: '🧾',
        text: 'Walk away—keep it clean.',
        statePatch: (prev) => ({
          adultCrime: {
            ...(prev.adultCrime || {}),
            heat: Math.max(0, Number(prev.adultCrime?.heat || 0) - 2)
          }
        }),
        loveDelta: 0.5,
        logLine: 'Declined shady offer—record stays clean.',
        timelineTitle: '🧾 Clean choice'
      },
      {
        id: 'consider',
        emoji: '🤔',
        text: 'Hear them out (just listening...).',
        stressDelta: 1,
        logLine: 'Listened to shady pitch—no commitment.',
        timelineTitle: '🤔 Tempted'
      }
    ]
  },
  {
    id: 'lgm_adult_underworld_job',
    goalId: 'adult_underworld_operator',
    minAge: 4,
    maxAge: 18,
    title: 'Connection Offers Work',
    body: 'An old contact offers you a job—high risk, high pay.',
    choices: [
      {
        id: 'take',
        emoji: '🕶️',
        text: 'Take it—sharpen your skills.',
        statePatch: (prev) => ({
          adultCrime: {
            ...(prev.adultCrime || {}),
            skill: Math.min(100, Number(prev.adultCrime?.skill || 0) + 5),
            heat: Math.min(100, Number(prev.adultCrime?.heat || 0) + 2)
          }
        }),
        moneyDelta: 800,
        stressDelta: 2,
        logLine: 'Took underworld job—skill improved.',
        timelineTitle: '🕶️ Underworld job'
      },
      {
        id: 'pass',
        emoji: '🚪',
        text: 'Pass—too hot right now.',
        stressDelta: -0.5,
        logLine: 'Passed on risky job.',
        timelineTitle: '🚪 Played safe'
      }
    ]
  },
  {
    id: 'lgm_adult_game_night',
    goalId: 'adult_game_collector',
    minAge: 3,
    maxAge: 18,
    title: 'Game Night Find',
    body: 'You spot a great game on sale—perfect for family night.',
    choices: [
      {
        id: 'buy',
        emoji: '🎮',
        text: 'Buy it—add to the shelf!',
        statePatch: (prev) => {
          const shelf = Array.isArray(prev.gameShelf) ? prev.gameShelf : [];
          const titles = ['Strategy Quest', 'Puzzle Party', 'Card Chaos', 'Board Battle', 'Dice Dynasty', 'Trivia Showdown'];
          const pick = titles[Math.floor(Math.random() * titles.length)];
          const exists = shelf.some(g => g.title === pick);
          if (exists) return { stress: Math.max(0, Number(prev.stress || 0) - 1) };
          return {
            gameShelf: [...shelf, { id: `game_${Date.now()}`, title: pick, addedAtAge: prev.currentYear }]
          };
        },
        moneyDelta: -40,
        loveDelta: 1,
        logLine: 'Bought a new game for family night.',
        timelineTitle: '🎮 Game added'
      },
      {
        id: 'skip',
        emoji: '💸',
        text: 'Skip—save the money.',
        stressDelta: -0.3,
        logLine: 'Passed on the game.',
        timelineTitle: '💸 Saved money'
      }
    ]
  },
  {
    id: 'lgm_adult_emergency_expense',
    goalId: 'adult_emergency_fund',
    minAge: 2,
    maxAge: 18,
    title: 'Surprise Expense',
    body: 'Car repair hits out of nowhere. Do you tap the fund or scramble?',
    choices: [
      {
        id: 'fund',
        emoji: '🪙',
        text: "Use the emergency fund—that's why it exists.",
        moneyDelta: -300,
        stressDelta: -1,
        logLine: 'Tapped emergency fund—no panic.',
        timelineTitle: '🪙 Fund used'
      },
      {
        id: 'scramble',
        emoji: '😰',
        text: 'Scramble for cash elsewhere.',
        moneyDelta: -350,
        stressDelta: 3,
        logLine: 'Scrambled to cover surprise expense.',
        timelineTitle: '😰 Cash scramble'
      }
    ]
  },
  {
    id: 'lgm_adult_investor_habit',
    goalId: 'adult_investor',
    minAge: 3,
    maxAge: 18,
    title: 'Auto-Transfer Habit',
    body: 'Set up an automatic transfer to savings—$50/month adds up.',
    choices: [
      {
        id: 'setup',
        emoji: '📈',
        text: 'Set it up—automate wealth building.',
        moneyDelta: 250,
        stressDelta: -1,
        logLine: 'Set up auto-save habit.',
        timelineTitle: '📈 Auto-save'
      },
      {
        id: 'skip',
        emoji: '🤷',
        text: 'Not ready to commit—keep it manual.',
        stressDelta: 0.5,
        logLine: 'Skipped auto-transfer setup.',
        timelineTitle: '🤷 Manual savings'
      }
    ]
  },
  {
    id: 'lgm_adult_property_deal',
    goalId: 'adult_property_tycoon',
    minAge: 5,
    maxAge: 18,
    title: 'Property Deal Appears',
    body: 'A fixer-upper hits the market—below asking, but needs work.',
    choices: [
      {
        id: 'consider',
        emoji: '🏘️',
        text: 'Research it—run the numbers.',
        moneyDelta: -100,
        stressDelta: 2,
        logLine: 'Researched property deal—still thinking.',
        timelineTitle: '🏘️ Property research'
      },
      {
        id: 'pass',
        emoji: '🚫',
        text: 'Pass—too risky right now.',
        stressDelta: -0.5,
        logLine: 'Passed on property deal.',
        timelineTitle: '🚫 Deal passed'
      }
    ]
  },
  {
    id: 'lgm_adult_globetrotter_flight',
    goalId: 'adult_globetrotter',
    minAge: 4,
    maxAge: 18,
    title: 'Cheap Flight Deal',
    body: 'Flash sale: $200 round-trip somewhere new. Expires tonight.',
    choices: [
      {
        id: 'book',
        emoji: '🌍',
        text: 'Book it—make the memory!',
        statePatch: (prev) => {
          const stamps = Array.isArray(prev.passportStamps) ? prev.passportStamps : [];
          const exists = stamps.some(s => s.label === 'Deal Trip');
          if (exists) return { stress: Math.max(0, Number(prev.stress || 0) - 1), money: Number(prev.money || 0) - 200 };
          return {
            passportStamps: [
              ...stamps,
              {
                age: prev.currentYear,
                country: '??',
                city: '',
                label: 'Deal Trip',
                emoji: '🛂'
              }
            ]
          };
        },
        moneyDelta: -200,
        loveDelta: 1.5,
        logLine: 'Booked cheap flight—trip incoming.',
        timelineTitle: '🌍 Flight booked'
      },
      {
        id: 'skip',
        emoji: '💰',
        text: 'Skip it—save the money.',
        stressDelta: -0.5,
        logLine: 'Passed on flight deal.',
        timelineTitle: '💰 Saved money'
      }
    ]
  },
  {
    id: 'lgm_adult_pet_sanctuary_adopt',
    goalId: 'adult_pet_sanctuary',
    minAge: 3,
    maxAge: 18,
    title: 'Adoption Fee Waived',
    body: 'The shelter waives the fee for senior pets. Room for one more?',
    choices: [
      {
        id: 'adopt',
        emoji: '🐾',
        text: 'Adopt—the more the merrier.',
        loveDelta: 2,
        stressDelta: -1,
        logLine: 'Adopted another pet—house is full.',
        timelineTitle: '🐾 Pet adopted'
      },
      {
        id: 'pass',
        emoji: '🏠',
        text: "Pass—we're at capacity.",
        stressDelta: -0.5,
        logLine: 'Passed on adoption.',
        timelineTitle: '🏠 At capacity'
      }
    ]
  },
  {
    id: 'lgm_adult_library_bookstore',
    goalId: 'adult_personal_library',
    minAge: 2,
    maxAge: 18,
    title: 'Used Bookstore Find',
    body: 'You find a gem at the used bookstore—$5 and perfectly worn.',
    choices: [
      {
        id: 'buy',
        emoji: '📖',
        text: 'Buy it—add to the shelf.',
        statePatch: (prev) => {
          const shelf = Array.isArray(prev.bookshelf) ? prev.bookshelf : [];
          const titles = ['Quiet Wisdom', 'Parenting Real', 'Small Rituals', 'The Long Game', 'Raising Humans'];
          const pick = titles[Math.floor(Math.random() * titles.length)];
          const exists = shelf.some(b => b.title === pick);
          if (exists) return { stress: Math.max(0, Number(prev.stress || 0) - 0.5), money: Number(prev.money || 0) - 5 };
          return {
            bookshelf: [...shelf, { age: prev.currentYear, title: pick, punchline: 'Worth every page.' }]
          };
        },
        moneyDelta: -5,
        stressDelta: -0.5,
        logLine: 'Bought a used book—added to shelf.',
        timelineTitle: '📖 Bookstore find'
      },
      {
        id: 'skip',
        emoji: '👀',
        text: 'Browse and leave—no buy today.',
        stressDelta: -0.3,
        logLine: 'Browsed bookstore—left empty-handed.',
        timelineTitle: '👀 Just browsing'
      }
    ]
  },
  {
    id: 'lgm_adult_family_meeting',
    goalId: 'adult_family_harmony',
    minAge: 4,
    maxAge: 18,
    title: 'Weekly Family Check-In',
    body: "Everyone sits down for 15 minutes—what's working, what's not.",
    choices: [
      {
        id: 'checkin',
        emoji: '🏡',
        text: 'Do it—make space to listen.',
        loveDelta: 2,
        stressDelta: -1.5,
        deltas: { empathy: 0.5 },
        logLine: 'Family check-in—everyone felt heard.',
        timelineTitle: '🏡 Family meeting'
      },
      {
        id: 'skip',
        emoji: '📺',
        text: "Skip—everyone's tired tonight.",
        stressDelta: -0.5,
        logLine: 'Skipped family check-in.',
        timelineTitle: '📺 Quiet night'
      }
    ]
  },
  {
    id: 'lgm_adult_career_recruiter',
    goalId: 'adult_career_peak',
    minAge: 3,
    maxAge: 18,
    title: 'Recruiter Ping',
    body: 'A recruiter reaches out—better role, better pay. Interested?',
    choices: [
      {
        id: 'explore',
        emoji: '🚀',
        text: 'Take the call—hear the offer.',
        moneyDelta: 500,
        stressDelta: 1,
        logLine: 'Talked to recruiter—career options opening.',
        timelineTitle: '🚀 Recruiter call'
      },
      {
        id: 'pass',
        emoji: '😌',
        text: 'Pass—stability matters more.',
        stressDelta: -0.5,
        logLine: 'Stayed put—recruiter declined.',
        timelineTitle: '😌 Stay stable'
      }
    ]
  },
  {
    id: 'lgm_adult_influencer_viral',
    goalId: 'adult_influencer_empire',
    minAge: 4,
    maxAge: 18,
    title: 'Viral Post Window',
    body: 'Your content hits the algorithm just right. Post now or wait?',
    choices: [
      {
        id: 'post',
        emoji: '📣',
        text: 'Post now—ride the wave!',
        statePatch: (prev) => {
          const sm = prev.socialMedia || { accounts: {} };
          const accounts = { ...sm.accounts };
          const hasPlatform = Object.keys(accounts).length > 0;
          if (!hasPlatform) return { money: Number(prev.money || 0) + 300 };
          
          const firstPlatformId = Object.keys(accounts)[0];
          const acc = { ...accounts[firstPlatformId] };
          acc.followers = Math.min(999999, Number(acc.followers || 0) + 500);
          accounts[firstPlatformId] = acc;
          
          return {
            socialMedia: { ...sm, accounts }
          };
        },
        loveDelta: 0.5,
        stressDelta: 1,
        logLine: 'Viral post landed—followers grew.',
        timelineTitle: '📣 Viral moment'
      },
      {
        id: 'wait',
        emoji: '⏳',
        text: 'Wait—timing feels off.',
        stressDelta: -0.5,
        logLine: 'Passed on viral window.',
        timelineTitle: '⏳ Waited'
      }
    ]
  }
];