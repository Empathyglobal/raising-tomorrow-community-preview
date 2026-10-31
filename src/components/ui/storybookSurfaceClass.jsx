import { isStorybookPopupModeFromDom } from "@/components/lib/uiTheme";

export function storybookSurfaceClass(kind = "dialog") {
  try {
    const isStorybook = isStorybookPopupModeFromDom();
    if (!isStorybook) return "";

    if (kind === "sheet" || kind === "drawer") {
      // Bottom sheets/drawers: paper-styled, NO torn edges
      return "rt-modal-sheet rt-popup--storybook rt-paper-elev storybook-surface rt-no-torn";
    }

    // Centered dialogs/popovers: paper-styled WITH torn edges
    if (kind === "dialog" || kind === "popover") {
      return "rt-modal-surface rt-popup--storybook rt-paper-elev storybook-surface";
    }

    // Default to dialog behavior
    return "rt-modal-surface rt-popup--storybook rt-paper-elev storybook-surface";
  } catch {
    return "";
  }
}