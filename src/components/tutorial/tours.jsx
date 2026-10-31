export const TOURS = {
  ftue_doctor_house_v1: [
    {
      target: '[data-tour="birth-parenting-style-authoritarian-info"]',
      title: 'Parenting Styles',
      content: 'Hover (or tap) the ⓘ to see pros & cons. Parenting style changes how some events play out.',
      placement: 'right',
      advanceOn: 'clickTarget',
      advanceDelayMs: 600
    },
    {
      target: '[data-tour="birth-parenting-style-authoritarian"]',
      title: 'Pick a style',
      content: 'For this tutorial, choose **Authoritarian**: strict rules, fast discipline. (You can try other styles next run.)',
      placement: 'right',
      advanceOn: 'clickTarget',
      advanceDelayMs: 600
    },
    {
      target: '[data-tour="birth-housing-family_home_rent"]',
      title: 'Choose housing',
      content: 'Start in a **Family Home (Renting)**. We will buy a place next.',
      placement: 'right',
      advanceOn: 'clickTarget',
      advanceDelayMs: 700
    },
    {
      target: '[data-tour="birth-commute-rideshare"]',
      title: 'Choose commute',
      content: 'Pick **Rideshare** for extra convenience.',
      placement: 'right',
      advanceOn: 'clickTarget',
      advanceDelayMs: 700
    },
    {
      target: '[data-tour="tab-relationships"]',
      title: 'Meet your child',
      content: 'Click **Relationships** to see your child and family.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 700
    },
    {
      target: '[data-tour="relationship-child-card"]',
      title: 'This is Ava',
      content: 'That\'s your child. Their stats + your choices will shape their future.',
      placement: 'top'
    },
    {
      target: '[data-tour="tab-actions"]',
      title: 'Do an action',
      content: 'Click **Actions**. Actions spend Focus and move the game forward.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 700
    },
    {
      target: '[data-tour="actions-category-care"]',
      title: 'Care',
      content: 'Open **Care**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 800
    },
    {
      target: '[data-tour="action-bond"]',
      title: 'Bond',
      content: 'Bonding raises your relationship. Click **Bond**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 800
    },
    {
      target: '[data-tour="bond-option-bond_read"]',
      title: 'Pick an activity',
      content: 'Choose **Read Together**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 800
    },
    {
      target: '[data-tour="action-result-ok"]',
      waitForEvent: 'actionResultOpened',
      title: 'Outcome',
      content: 'Nice. Click **OK**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 400
    },
    {
      target: '[data-tour="actions-category-earn"]',
      title: 'Earn',
      content: 'Now let\'s learn real estate. Open **Earn**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 900
    },
    {
      target: '[data-tour="action-realEstate"]',
      title: 'Real Estate',
      content: 'Click **Real Estate**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 900
    },
    {
      target: '[data-tour="realestate-tab-auction"]',
      title: 'Auctions',
      content: 'Foreclosure auctions can be cheap… and risky.',
      placement: 'bottom',
      advanceOn: 'clickTarget',
      advanceDelayMs: 700
    },
    {
      target: '[data-tour="realestate-auction-featured"]',
      title: 'Starter listing',
      content: 'This featured listing is a safe "starter" pick for the tutorial.',
      placement: 'top'
    },
    {
      target: '[data-tour="realestate-auction-buy-featured"]',
      title: 'Buy it',
      content: 'Buy the featured listing.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 900
    },
    {
      target: '[data-tour="realestate-tab-portfolio"]',
      title: 'Your portfolio',
      content: 'Go to **Portfolio**.',
      placement: 'bottom',
      advanceOn: 'clickTarget',
      advanceDelayMs: 800
    },
    {
      target: '[data-tour="realestate-portfolio-move-in-newest"]',
      title: 'Move in',
      content: 'Click **Move In**. (Owning/renting properties can be a great money strategy — in-game and in real life.)',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 800
    },
    {
      target: '[data-tour="realestate-close"]',
      title: 'Done here',
      content: 'Close Real Estate.',
      placement: 'left',
      advanceOn: 'clickTarget',
      advanceDelayMs: 700
    },
    {
      target: '[data-tour="actions-category-qualityOfLife"]',
      title: 'Quality of Life',
      content: 'Open **Quality of Life** to switch your housing.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 900
    },
    {
      target: '[data-tour="qolhub-housing"]',
      title: 'Housing',
      content: 'Click **Housing**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 900
    },
    {
      target: '[data-tour="qol-housing-owned-home"]',
      title: 'Use your owned home',
      content: 'Select **Owned Home**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 700
    },
    {
      target: '[data-tour="qol-save"]',
      title: 'Save changes',
      content: 'Click **Save Changes**.',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 700
    },
    {
      target: '[data-tour="age-up"]',
      title: 'Age up',
      content: 'Click **Age Up** to progress a year. You have learned the basics!',
      placement: 'top',
      advanceOn: 'clickTarget',
      advanceDelayMs: 500
    }
  ],
  ftue: [
    {
      target: '[data-tour="start-tutorial-mode"]',
      title: "Welcome to Raising Tomorrow",
      content: "This guided tour will walk you through the basics of raising your child. We'll start by setting up a game.",
      placement: "center"
    },
    {
      target: '[data-tour="start-quick-start"]',
      title: "Quick Start",
      content: "The fastest way to play. Assigns a random country, parent, and child.",
      placement: "bottom"
    },
    {
      target: '[data-tour="start-create-character"]',
      title: "Custom Character",
      content: "Allows you to choose your name, role, country, and background details.",
      placement: "bottom"
    },
    {
      target: '[data-tour="start-special-starts"]',
      title: "Special Scenarios",
      content: "Unique challenges like 'Golden Cage' or 'No Safety Net' for advanced play.",
      placement: "top"
    },
    {
      target: 'body',
      title: "Let's Begin",
      content: "We'll start a standardized run now so you can see the gameplay mechanics.",
      placement: "center",
      hideNext: true,
      primaryAction: {
        label: "Start Tutorial Run",
        action: "startTutorialRun"
      }
    },
    // --- GAME PAGE ---
    
    {
      target: '[data-tour="birth-style-choices"]',
      title: "First Choice: Parenting Style",
      content: "Every run starts with a style choice. This sets your initial stats (Warmth & Structure). Pick one to continue.",
      placement: "top",
      advanceOn: "clickWithin",
      advanceDelayMs: 800
    },
    {
      target: '[data-tour="age-up"]',
      title: "Age Up",
      content: "This starts Year 1 and triggers your first Life Moment.",
      placement: "top",
      advanceOn: "clickTarget",
      advanceDelayMs: 1200
    },
    {
      target: '[data-tour="scenario-choices"]',
      anchorId: 'scenario-choices',
      waitForEvent: 'scenarioOpened',
      title: "Life Moments",
      content: "As your child grows, scenarios appear. Your choices shape their personality and your relationship.",
      placement: "bottom",
      advanceOn: "clickWithin",
      advanceDelayMs: 900
    },
    {
      target: '[data-tour="action-result-ok"]',
      anchorId: 'action-result-ok',
      waitForEvent: 'actionResultOpened',
      title: "Outcomes",
      content: "See how your choice affected your child and your stats. Click OK to continue.",
      placement: "top",
      advanceOn: "clickTarget",
      advanceDelayMs: 400
    },
    {
      target: '[data-tour="tab-home"]',
      title: "Home Dashboard",
      content: "See your child's current status, mood, and your resources here.",
      placement: "top"
    },
    {
      target: '[data-tour="tab-actions"]',
      title: "Action Menu",
      content: "This is your main toolbox. Spend Focus to Bond, Play, Work, or handle needs.",
      placement: "top"
    },

    {
      target: 'body',
      title: "You\'re Ready!",
      content: "That\'s the basics. Explore, experiment, and see what kind of parent you become. Good luck!",
      placement: "center"
    }
  ]
};