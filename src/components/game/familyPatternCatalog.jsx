// Family Patterns Catalog - 28 patterns for generational/family trauma system
// Non-shaming, non-graphic language

export const DEFAULT_PATTERN_SEVERITY = 2; // 0..3 scale

export const FAMILY_PATTERN_CATALOG = [
  {
    id: 'EMOTIONAL_NEGLECT',
    label: 'Emotional neglect',
    short: "Feelings weren't met; needs got minimized.",
    pressures: { threat: 0, shame: 1, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Going numb, avoiding vulnerable talks, 'You're fine' reflex.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may hide needs, people‑please, or become 'too independent' too early."
  },
  {
    id: 'EMOTIONAL_ABUSE',
    label: 'Emotional abuse / chronic criticism',
    short: 'Shame-based love; ridicule or scapegoating shaped you.',
    pressures: { threat: 1, shame: 3, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Inner critic, conditional warmth, performance pressure.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may develop perfectionism, fear of mistakes, or anxious self‑doubt."
  },
  {
    id: 'PHYSICAL_ABUSE_HISTORY',
    label: 'Physical abuse history',
    short: 'Fear was used as a teacher.',
    pressures: { threat: 3, shame: 2, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Hypervigilance, sudden snapping, or shutdown under stress.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may become timid/compliant, or defiant/brave as a mask—calm routines feel hard."
  },
  {
    id: 'BOUNDARY_VIOLATION_HISTORY',
    label: 'Boundary violation history',
    short: "Your 'no' wasn't respected growing up.",
    pressures: { threat: 2, shame: 2, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Overprotection OR avoidance around consent/body topics.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may struggle with boundaries or feel anxious about safety and trust."
  },
  {
    id: 'WITNESSED_DOMESTIC_VIOLENCE',
    label: 'Witnessed domestic violence',
    short: 'Conflict meant danger; moods ran the house.',
    pressures: { threat: 3, shame: 1, chaos: 2, role: 0 },
    learn: {
      whatItCanFeelLike: "Conflict avoidance or intimidation reflex.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child becomes a peacekeeper, reads micro-signals, or fears speaking up."
  },
  {
    id: 'SUBSTANCE_USE_HOME',
    label: 'Substance use in the home',
    short: 'Promises broke; chaos was normal.',
    pressures: { threat: 1, shame: 1, chaos: 3, role: 2 },
    learn: {
      whatItCanFeelLike: "Rescuing, distrust, or rigid control to feel safe.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may be hyper‑responsible or impulsive; trust can be shaky."
  },
  {
    id: 'CAREGIVER_MENTAL_ILLNESS_HOME',
    label: 'Caregiver mental illness in the home',
    short: 'Availability changed; emotions felt risky.',
    pressures: { threat: 0, shame: 1, chaos: 2, role: 1 },
    learn: {
      whatItCanFeelLike: "Over‑controlling feelings or avoiding emotions.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may feel guilty for needing help; high compassion with weak boundaries."
  },
  {
    id: 'FAMILY_SUICIDE_LOSS',
    label: 'Family suicide attempt/loss',
    short: "Sadness became scary; 'don't upset anyone' rule.",
    pressures: { threat: 1, shame: 0, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Catastrophizing, emotional suppression, fear of hard talks.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may become anxious about abandonment and overly careful with emotions."
  },
  {
    id: 'ABANDONMENT_DISAPPEARANCE',
    label: 'Abandonment / caregiver disappearance',
    short: 'Being left shaped how you attach.',
    pressures: { threat: 1, shame: 1, chaos: 2, role: 0 },
    learn: {
      whatItCanFeelLike: "Clinging or distancing; fear of dependence.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may perform for love or detach first to avoid being hurt."
  },
  {
    id: 'FOSTER_MULTIPLE_PLACEMENTS',
    label: 'Foster care / multiple placements',
    short: 'Love felt temporary; moving was normal.',
    pressures: { threat: 1, shame: 1, chaos: 3, role: 0 },
    learn: {
      whatItCanFeelLike: "Over‑attach fast or keep distance to avoid pain.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may fear being 'sent away' and struggle trusting stability."
  },
  {
    id: 'PARENTIFICATION',
    label: 'Parentification',
    short: 'You had to be the adult too early.',
    pressures: { threat: 0, shame: 2, chaos: 1, role: 3 },
    learn: {
      whatItCanFeelLike: "Guilt resting; expecting maturity from kids.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may become a caretaker, high empathy, but low joy/play."
  },
  {
    id: 'ENMESHMENT',
    label: 'Enmeshment / no boundaries',
    short: 'Closeness meant guilt, intrusion, or control.',
    pressures: { threat: 0, shame: 2, chaos: 1, role: 3 },
    learn: {
      whatItCanFeelLike: "Jealousy of independence; 'we are one person' vibes.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may struggle with identity, guilt for autonomy, secret rebellion."
  },
  {
    id: 'CHAOTIC_RULES',
    label: 'Chaotic rules / inconsistent caregiving',
    short: "Rules changed; routines didn't stick.",
    pressures: { threat: 0, shame: 1, chaos: 3, role: 1 },
    learn: {
      whatItCanFeelLike: "Permissive → strict swings; follow‑through is hard.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may struggle with habits, focus, and trust in consistency."
  },
  {
    id: 'AUTHORITARIAN_CONTROL',
    label: 'Extreme authoritarian control',
    short: 'Obedience mattered more than voice.',
    pressures: { threat: 1, shame: 2, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Control = safety; negotiation feels unsafe.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may be obedient but anxious, or explode into rebellion later."
  },
  {
    id: 'CONDITIONAL_LOVE_PERFECTIONISM',
    label: 'Conditional love / perfectionism culture',
    short: 'Worth was measured; love was performance.',
    pressures: { threat: 0, shame: 3, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Comparison, pressure, fear of mistakes.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may look 'successful' but feel brittle inside; burnout risk."
  },
  {
    id: 'POVERTY_SCARCITY',
    label: 'Poverty / chronic financial insecurity',
    short: 'Scarcity shaped your nervous system.',
    pressures: { threat: 1, shame: 1, chaos: 2, role: 0 },
    learn: {
      whatItCanFeelLike: "Overwork, worry spending, difficulty relaxing.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may carry shame about needs or become a survival‑planner."
  },
  {
    id: 'FOOD_HOUSING_INSECURITY',
    label: 'Food/housing insecurity',
    short: "Stability was uncertain; basics weren't guaranteed.",
    pressures: { threat: 1, shame: 1, chaos: 3, role: 0 },
    learn: {
      whatItCanFeelLike: "Hoarding tendencies, panic at waste, control around security.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may resource‑guard, struggle with routines, or feel chronically unsettled."
  },
  {
    id: 'COMMUNITY_VIOLENCE_EXPOSURE',
    label: 'Community violence exposure',
    short: 'The world felt unsafe outside.',
    pressures: { threat: 3, shame: 1, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Hypervigilance; restricting freedom; 'toughen up' reflex.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may develop fearfulness or a tough persona; attention goes to scanning danger."
  },
  {
    id: 'INCARCERATION_LEGAL_TRAUMA',
    label: 'Incarceration / legal system trauma in the home',
    short: 'Shame, secrecy, instability around authority.',
    pressures: { threat: 1, shame: 2, chaos: 2, role: 0 },
    learn: {
      whatItCanFeelLike: "Avoid institutions; harsh 'stay out of trouble' discipline.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may be rigidly compliant or oppositional with authority; shame sensitivity."
  },
  {
    id: 'GRIEF_LOSS',
    label: 'Grief and loss (unresolved)',
    short: 'Attachment felt risky; goodbye felt close.',
    pressures: { threat: 1, shame: 0, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Overprotection or emotional distance to avoid pain.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may have separation anxiety, worry, or deep sensitivity."
  },
  {
    id: 'CHRONIC_ILLNESS_CAREGIVING',
    label: 'Chronic illness/disability caregiving home',
    short: 'Need = burden; rest felt unsafe.',
    pressures: { threat: 0, shame: 1, chaos: 1, role: 2 },
    learn: {
      whatItCanFeelLike: "Expecting 'easy kids'; guilt resting.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may become helpful and empathic—but hide needs and burn out."
  },
  {
    id: 'DISCRIMINATION_IDENTITY_STRESS',
    label: 'Discrimination / identity-based chronic stress',
    short: "Extra vigilance and 'twice as good' pressure.",
    pressures: { threat: 1, shame: 1, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Code‑switching; mistrust of systems; perfection pressure.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may carry pride + pressure; justice sensitivity; guardedness with outsiders."
  },
  {
    id: 'REFUGEE_FORCED_MIGRATION',
    label: 'Refugee/war/forced migration history',
    short: 'Safety obsession; grief for what was lost.',
    pressures: { threat: 3, shame: 0, chaos: 2, role: 1 },
    learn: {
      whatItCanFeelLike: "Startle response; strictness; emotional silence as protection.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may feel duty-heavy; high drive, constrained play, inherited fear."
  },
  {
    id: 'HIGH_CONTROL_RELIGION',
    label: 'High-control religion / spiritual abuse history',
    short: 'Fear-based morality; shame around self.',
    pressures: { threat: 1, shame: 3, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Black‑and‑white thinking; guilt tactics; body shame.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may develop anxiety, rigid discipline, or rebellious secrecy."
  },
  {
    id: 'FAMILY_SECRETS_BETRAYAL',
    label: "Family secrets / betrayal culture",
    short: "Truth felt dangerous; 'we don't talk' rules.",
    pressures: { threat: 0, shame: 2, chaos: 2, role: 0 },
    learn: {
      whatItCanFeelLike: "Self‑doubt, vigilance, image management.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may doubt their perceptions and struggle trusting intuition."
  },
  {
    id: 'SIBLING_FAVORITISM',
    label: 'Sibling favoritism / golden child–scapegoat roles',
    short: 'Comparison shaped identity and belonging.',
    pressures: { threat: 0, shame: 2, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Labeling reflex; rivalry mindset.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may feel boxed into a role ('good' or 'bad') instead of seen as whole."
  },
  {
    id: 'HISTORICAL_INTERGENERATIONAL',
    label: 'Intergenerational/historical trauma in family story',
    short: 'Survival rules passed down; grief in the background.',
    pressures: { threat: 1, shame: 1, chaos: 1, role: 0 },
    learn: {
      whatItCanFeelLike: "Silence OR intense narrative; distrust; duty pressure.",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may carry deep meaning and caution; pride mixed with pressure."
  },
  {
    id: 'GOOD_KID_SURVIVAL_STYLE',
    label: "The 'Good Kid' survival style",
    short: 'Being invisible/easy kept you safe.',
    pressures: { threat: 0, shame: 2, chaos: 0, role: 1 },
    learn: {
      whatItCanFeelLike: "Conflict avoidance; needs feel 'too much.'",
      howItCanShowUp: "Under stress, you default to practical fixes instead of connection."
    },
    childRipple: "Child may be compliant but anxious, indecisive, and afraid to take up space."
  }
];