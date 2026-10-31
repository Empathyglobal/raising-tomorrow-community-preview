/**
 * Aggregated per-moment choice button text overrides.
 * These override ONLY the visible button text (A–E). Deltas/consequences are unchanged.
 */
import { MOMENT_CHOICE_TEXT_OVERRIDES_CORE } from "@/components/game/momentChoiceOverrides_core";
import { MOMENT_CHOICE_TEXT_OVERRIDES_SCHOOL_CONFIDENCE } from "@/components/game/momentChoiceOverrides_schoolConfidence";
import { MOMENT_CHOICE_TEXT_OVERRIDES_COPARENTING } from "@/components/game/momentChoiceOverrides_coparenting";

export const MOMENT_CHOICE_TEXT_OVERRIDES = {
  ...MOMENT_CHOICE_TEXT_OVERRIDES_CORE,
  ...MOMENT_CHOICE_TEXT_OVERRIDES_SCHOOL_CONFIDENCE,
  ...MOMENT_CHOICE_TEXT_OVERRIDES_COPARENTING,
};