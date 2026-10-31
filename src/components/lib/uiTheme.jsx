import { isBrowser } from "./isBrowser";

export function getUiThemeFromDom() {
  if (!isBrowser) return "classic";
  const t = (document.documentElement?.dataset || {}).uiTheme;
  return t === "storybook" ? "storybook" : "classic";
}

export function safeSetDomTheme(theme) {
  if (!isBrowser) return;
  document.documentElement.dataset.uiTheme = theme;
}

export function getPopupStyleFromDom() {
  if (!isBrowser) return "classic";
  const s = (document.documentElement?.dataset || {}).rtPopupStyle;
  // data-rt-popup-style becomes dataset.rtPopupStyle
  if (s === "storybook") return "storybook";
  if (s === "opaque") return "opaque";
  return "classic";
}

/**
 * True if Storybook POPUP MODE is active in the DOM.
 * - Either full Storybook UI theme is enabled, OR popupStyle=storybook.
 * - Use this for popup-only styling helpers that don't receive gameState.
 */
export function isStorybookPopupModeFromDom() {
  const theme = getUiThemeFromDom();
  const popupStyle = getPopupStyleFromDom();
  return theme === "storybook" || popupStyle === "storybook";
}

/**
 * True if Storybook VISUAL THEME is active (DOM theme or saved setting).
 * Use this for page chrome, fonts, backgrounds.
 */
export function isStorybookUiActive(gameState) {
  const dom = getUiThemeFromDom();
  const stateTheme = gameState?.settings?.uiTheme;
  return dom === "storybook" || stateTheme === "storybook";
}

/**
 * True if Storybook POPUPS should render (either Storybook UI theme OR popupStyle=storybook).
 * Use this for popup branches (ScenarioModal, ActionResultSheet, KidLogic, etc).
 */
export function isStorybookPopupsActive(gameState) {
  const dom = getUiThemeFromDom();
  const popupStyle = gameState?.settings?.popupStyle;
  return dom === "storybook" || popupStyle === "storybook";
}

export const UiTheme = undefined; // JS placeholder for TS type