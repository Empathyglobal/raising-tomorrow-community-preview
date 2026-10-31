import { SPECIAL_START_YEARLY_BEATS__FAMOUS_01 } from "./famous_01";
import { SPECIAL_START_YEARLY_BEATS__FAMOUS_02 } from "./famous_02";
import { SPECIAL_START_YEARLY_BEATS__FAMOUS_03 } from "./famous_03";
import { SPECIAL_START_YEARLY_BEATS__FAMOUS_04 } from "./famous_04";
import { SPECIAL_START_YEARLY_BEATS__FAMOUS_05 } from "./famous_05";

import { SPECIAL_START_YEARLY_BEATS__NORMAL_01 } from "./normal_01";
import { SPECIAL_START_YEARLY_BEATS__NORMAL_02 } from "./normal_02";
import { SPECIAL_START_YEARLY_BEATS__NORMAL_03 } from "./normal_03";
import { SPECIAL_START_YEARLY_BEATS__NORMAL_04 } from "./normal_04";
import { SPECIAL_START_YEARLY_BEATS__NORMAL_05 } from "./normal_05";
import { SPECIAL_START_YEARLY_BEATS__NORMAL_06 } from "./normal_06";
import { SPECIAL_START_YEARLY_BEATS__NORMAL_07 } from "./normal_07";
import { SPECIAL_START_YEARLY_BEATS__NORMAL_08 } from "./normal_08";

import { SPECIAL_START_YEARLY_BEATS__INSANE_01 } from "./insane_01";
import { SPECIAL_START_YEARLY_BEATS__INSANE_02 } from "./insane_02";
import { SPECIAL_START_YEARLY_BEATS__INSANE_03 } from "./insane_03";
import { SPECIAL_START_YEARLY_BEATS__INSANE_04 } from "./insane_04";
import { SPECIAL_START_YEARLY_BEATS__INSANE_05 } from "./insane_05";
import { SPECIAL_START_YEARLY_BEATS__INSANE_06 } from "./insane_06";

import { SPECIAL_START_YEARLY_BEATS__TRAGIC_01 } from "./tragic_01";
import { SPECIAL_START_YEARLY_BEATS__TRAGIC_02 } from "./tragic_02";
import { SPECIAL_START_YEARLY_BEATS__TRAGIC_03 } from "./tragic_03";
import { SPECIAL_START_YEARLY_BEATS__TRAGIC_04 } from "./tragic_04";

import { SPECIAL_START_YEARLY_BEATS__TABOO_01 } from "./taboo_01";
import { SPECIAL_START_YEARLY_BEATS__TABOO_02 } from "./taboo_02";

import { SPECIAL_START_YEARLY_BEATS__MISSING_01 } from "./missing_01";

export const SPECIAL_START_YEARLY_BEATS = {
  ...SPECIAL_START_YEARLY_BEATS__FAMOUS_01,
  ...SPECIAL_START_YEARLY_BEATS__FAMOUS_02,
  ...SPECIAL_START_YEARLY_BEATS__FAMOUS_03,
  ...SPECIAL_START_YEARLY_BEATS__FAMOUS_04,
  ...SPECIAL_START_YEARLY_BEATS__FAMOUS_05,

  ...SPECIAL_START_YEARLY_BEATS__NORMAL_01,
  ...SPECIAL_START_YEARLY_BEATS__NORMAL_02,
  ...SPECIAL_START_YEARLY_BEATS__NORMAL_03,
  ...SPECIAL_START_YEARLY_BEATS__NORMAL_04,
  ...SPECIAL_START_YEARLY_BEATS__NORMAL_05,
  ...SPECIAL_START_YEARLY_BEATS__NORMAL_06,
  ...SPECIAL_START_YEARLY_BEATS__NORMAL_07,
  ...SPECIAL_START_YEARLY_BEATS__NORMAL_08,

  ...SPECIAL_START_YEARLY_BEATS__INSANE_01,
  ...SPECIAL_START_YEARLY_BEATS__INSANE_02,
  ...SPECIAL_START_YEARLY_BEATS__INSANE_03,
  ...SPECIAL_START_YEARLY_BEATS__INSANE_04,
  ...SPECIAL_START_YEARLY_BEATS__INSANE_05,
  ...SPECIAL_START_YEARLY_BEATS__INSANE_06,

  ...SPECIAL_START_YEARLY_BEATS__TRAGIC_01,
  ...SPECIAL_START_YEARLY_BEATS__TRAGIC_02,
  ...SPECIAL_START_YEARLY_BEATS__TRAGIC_03,
  ...SPECIAL_START_YEARLY_BEATS__TRAGIC_04,

  ...SPECIAL_START_YEARLY_BEATS__TABOO_01,
  ...SPECIAL_START_YEARLY_BEATS__TABOO_02,

  ...SPECIAL_START_YEARLY_BEATS__MISSING_01,
};

/**
 * Validates the structure and completeness of all special start yearly beats.
 * Ensures each start has ages 1-18 with proper title/topic/scene/choices structure.
 */
function validateSpecialStartYearlyBeats(allBeats) {
  const errors = [];

  Object.entries(allBeats).forEach(([specialStartId, beats]) => {
    // Check ages 1-18 exist
    for (let age = 1; age <= 18; age++) {
      if (!beats[age]) {
        errors.push(`[${specialStartId}] Missing age ${age}`);
      }
    }

    // Validate each age
    Object.entries(beats).forEach(([age, beat]) => {
      const ageNum = parseInt(age, 10);
      if (ageNum < 1 || ageNum > 18) return;

      // Check required fields
      if (!beat.title) {
        errors.push(`[${specialStartId}:${age}] Missing title`);
      }
      if (!beat.topic) {
        errors.push(`[${specialStartId}:${age}] Missing topic`);
      }
      if (!beat.scene) {
        errors.push(`[${specialStartId}:${age}] Missing scene`);
      } else if (!beat.scene.includes("{childName}")) {
        errors.push(`[${specialStartId}:${age}] Scene missing {childName}`);
      }

      // Check choices structure
      if (!beat.choices) {
        errors.push(`[${specialStartId}:${age}] Missing choices`);
        return;
      }

      const requiredChoices = ["connect", "teach", "boundary", "avoid", "harm"];
      const choiceKeys = Object.keys(beat.choices);

      requiredChoices.forEach((key) => {
        if (!beat.choices[key]) {
          errors.push(`[${specialStartId}:${age}] Missing choice: ${key}`);
        } else {
          if (!beat.choices[key].text) {
            errors.push(`[${specialStartId}:${age}:${key}] Missing text`);
          }
          if (!beat.choices[key].consequence) {
            errors.push(`[${specialStartId}:${age}:${key}] Missing consequence`);
          }
        }
      });

      if (choiceKeys.length !== requiredChoices.length) {
        const unexpected = choiceKeys.filter(
          (k) => !requiredChoices.includes(k)
        );
        if (unexpected.length > 0) {
          errors.push(
            `[${specialStartId}:${age}] Unexpected choices: ${unexpected.join(", ")}`
          );
        }
      }
    });
  });

  if (errors.length > 0) {
    errors.forEach((err) => console.error(err));
    if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
      throw new Error(
        `Invalid special start yearly beats: ${errors.length} validation error(s)`
      );
    }
  }
}

// Validate at module load
validateSpecialStartYearlyBeats(SPECIAL_START_YEARLY_BEATS);