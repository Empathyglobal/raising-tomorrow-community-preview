// Portrait Mod: standardized scenario builder for portrait-driven vignettes
// Keeps portrait mod scenarios consistent and easy to add.

/**
 * Build a portrait vignette scenario.
 * 
 * @param {object} params
 * @param {string} params.id - Unique scenario ID
 * @param {string} params.pack - Pack ID (e.g., 'portrait_mod')
 * @param {number} params.ageMin - Min age
 * @param {number} params.ageMax - Max age
 * @param {string} params.title - Scenario title
 * @param {string} params.body - Scenario body text
 * @param {string} params.portraitKey - Portrait sheet key
 * @param {string} params.portraitCaption - 1-line quip shown under portrait
 * @param {object} params.portraitCallout - Optional callout box { title, body }
 * @param {string} params.portraitSeverity - "low"|"med"|"high"
 * @param {array} params.choices - Array of choice objects
 * @returns {object} Scenario object compatible with ScenarioModal
 */
export function makePortraitVignette({
  id,
  pack = 'portrait_mod',
  ageMin = 0,
  ageMax = 18,
  title,
  body,
  portraitKey,
  portraitCaption,
  portraitCallout = null,
  portraitSeverity = 'low',
  choices = []
}) {
  return {
    id,
    title,
    age: ageMin,
    topic: 'portrait',
    hookText: body,
    scenarioText: `${body}\n\nWhat do you do?`,
    choices,
    meta: {
      packId: pack,
      choicePack: 'standard',
      category: 'portrait',
      intensity: 1,
      hookId: id,
      portraitKey,
      portraitCaption,
      portraitCallout,
      portraitSeverity,
      isPortraitModScenario: true
    }
  };
}