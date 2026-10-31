// Portrait Mod: scenario library with funny/catchy text
// ALL scenarios here are Portrait Mod exclusive (only eligible when mod enabled).

import { makePortraitVignette } from './portraitScenarioBuilder';

// ============================================================================
// Teen Punk Choice Scenario (one-off, ages 14-17)
// ============================================================================
export function buildTeenPunkScenario({ childName }) {
  return makePortraitVignette({
    id: 'portrait_teen_punk_announcement',
    pack: 'portrait_mod',
    ageMin: 14,
    ageMax: 17,
    title: 'The Punk Announcement',
    body: `Your teen bursts out of their room dressed like they just headlined a tiny basement show.\n\nThey declare: "I'm punk now." The eyeliner is… committed.`,
    portraitKey: 'teen_style_punk',
    portraitCaption: "Somewhere, a safety pin just felt a disturbance in the force.",
    portraitSeverity: 'low',
    choices: [
      {
        id: 'support',
        role: 'connect',
        letter: 'A',
        emoji: '🎸',
        text: `Support the chaos (and maybe buy hair dye).`,
        consequence: `${childName} feels seen and safe to experiment.`,
        deltas: { confidence: 0.45, empathy: 0.15 },
        loveDelta: 2,
        stressDelta: 0,
        meta: { setTeenStyle: 'teen_style_punk' }
      },
      {
        id: 'compromise',
        role: 'boundary',
        letter: 'B',
        emoji: '🤝',
        text: `Compromise: "You can be punk, but also… do your homework."`,
        consequence: `They roll their eyes but respect the boundary.`,
        deltas: { discipline: 0.3, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 0,
        meta: { setTeenStyle: 'teen_style_punk' }
      },
      {
        id: 'refuse',
        role: 'harm',
        letter: 'C',
        emoji: '🚫',
        text: `Absolutely not.`,
        consequence: `They go punk anyway—just more quietly and with more resentment.`,
        deltas: { empathy: -0.25, confidence: -0.15 },
        loveDelta: -2,
        stressDelta: 1,
        meta: { setTeenStyle: null }
      }
    ]
  });
}

// ============================================================================
// Middle School Bruised Scenario (ages 10-13)
// ============================================================================
export function buildMiddleSchoolBruisedScenario({ childName }) {
  return makePortraitVignette({
    id: 'portrait_kid_bruised_fight',
    pack: 'portrait_mod',
    ageMin: 10,
    ageMax: 13,
    title: 'Bruises and a Brave Face',
    body: `${childName} comes home trying to act normal… but there's a fresh bruise that says otherwise.\n\nSchool "was fine." Their face disagrees.`,
    portraitKey: 'kid_injury_bruised',
    portraitCaption: `"It's nothing." (It is definitely something.)`,
    portraitSeverity: 'med',
    choices: [
      {
        id: 'support',
        role: 'connect',
        letter: 'A',
        emoji: '🫂',
        text: `Get close and make it safe to tell the truth.`,
        consequence: `${childName} opens up. You learn what really happened.`,
        deltas: { empathy: 0.4, confidence: 0.2 },
        loveDelta: 2,
        stressDelta: 0
      },
      {
        id: 'escalate',
        role: 'boundary',
        letter: 'B',
        emoji: '📞',
        text: `Call the school immediately.`,
        consequence: `The adults get involved. ${childName} feels protected—and slightly mortified.`,
        deltas: { discipline: 0.3, confidence: 0.1 },
        loveDelta: 1,
        stressDelta: 1
      },
      {
        id: 'ignore',
        role: 'avoid',
        letter: 'C',
        emoji: '🙈',
        text: `Let it go. "Kids will be kids."`,
        consequence: `${childName} learns to hide things that hurt.`,
        deltas: { confidence: -0.2, empathy: -0.15 },
        loveDelta: -1,
        stressDelta: 0
      }
    ]
  });
}

// ============================================================================
// Style Drift Vignettes (auto-triggered, simple Continue)
// ============================================================================

export function buildStyleRevertVignette({ childName, fromStyleKey }) {
  return makePortraitVignette({
    id: `portrait_drift_revert_${fromStyleKey}`,
    pack: 'portrait_mod',
    ageMin: 13,
    ageMax: 17,
    title: 'The Phase Quietly Packs Its Bags',
    body: `One day you notice the spikes are gone. The band tee is... folded.\n\n${childName} shrugs: "Yeah, I'm just not feeling it anymore."`,
    portraitKey: null, // show base teen
    portraitCaption: "The safety pins retire with full benefits.",
    portraitSeverity: 'low',
    choices: [
      {
        id: 'continue',
        role: 'connect',
        letter: 'A',
        emoji: '👍',
        text: 'Continue',
        consequence: `Phases come and go. That's growth.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        meta: { noFocusCostForA: true }
      }
    ]
  });
}

export function buildStyleSwitchVignette({ childName, toStyleKey }) {
  return makePortraitVignette({
    id: `portrait_drift_switch_${toStyleKey}`,
    pack: 'portrait_mod',
    ageMin: 13,
    ageMax: 17,
    title: 'New Year, New Vibe',
    body: `${childName} announces a new aesthetic with the seriousness of a CEO unveiling a product launch.\n\nIt's different. It's dramatic. It's… probably temporary.`,
    portraitKey: toStyleKey,
    portraitCaption: "They've rebranded. Again.",
    portraitSeverity: 'low',
    choices: [
      {
        id: 'continue',
        role: 'connect',
        letter: 'A',
        emoji: '✨',
        text: 'Continue',
        consequence: 'You respect the pivot.',
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        meta: { noFocusCostForA: true }
      }
    ]
  });
}

export function buildStyleAdoptVignette({ childName, toStyleKey }) {
  return makePortraitVignette({
    id: `portrait_drift_adopt_${toStyleKey}`,
    pack: 'portrait_mod',
    ageMin: 13,
    ageMax: 17,
    title: 'Sudden Style Meteor',
    body: `Out of nowhere, ${childName} appears with a brand new look like it arrived by overnight shipping.\n\nNo warning. No discussion. Just vibes.`,
    portraitKey: toStyleKey,
    portraitCaption: "Somewhere, a group chat is cheering.",
    portraitSeverity: 'low',
    choices: [
      {
        id: 'continue',
        role: 'connect',
        letter: 'A',
        emoji: '🚀',
        text: 'Continue',
        consequence: 'Teens gonna teen.',
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        meta: { noFocusCostForA: true }
      }
    ]
  });
}

export function buildAdultResetVignette({ childName }) {
  return makePortraitVignette({
    id: 'portrait_adult_style_reset',
    pack: 'portrait_mod',
    ageMin: 18,
    ageMax: 18,
    title: 'The Closet Cleanout',
    body: `Adult life arrives with forms to fill out and places to be.\n\n${childName}'s look softens into something calmer—like the volume knob got turned down a notch.`,
    portraitKey: null, // show base adult
    portraitCaption: "The last dramatic hair decision fades into legend.",
    portraitSeverity: 'low',
    choices: [
      {
        id: 'continue',
        role: 'connect',
        letter: 'A',
        emoji: '🎓',
        text: 'Continue',
        consequence: 'Growing up is weird.',
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        meta: { noFocusCostForA: true }
      }
    ]
  });
}