import React from "react";
import SafeStorybookImage from "@/components/storybook/SafeStorybookImage";
import { getChapterImageFilename } from "@/components/storybook/imageMap";
import { getUiThemeFromDom } from "@/components/lib/uiTheme";

function pickChapterId(age) {
  const a = Number(age || 0);
  if (a <= 4) return "birth";          // Early Years (EY)
  if (a <= 9) return "kindergarten";
  if (a <= 13) return "middle_school";
  if (a <= 17) return "high_school";
  if (a <= 18) return "graduation";
  return "first_job";
}

export default function StorybookChapterHeader({ currentYear }) {
  const isStorybook = getUiThemeFromDom() === "storybook";
  if (!isStorybook) return null;

  const age = Number(currentYear || 0);
  const chapterId = pickChapterId(age);
  const filename = getChapterImageFilename(chapterId);
  if (!filename) return null;

  const title =
    chapterId === "birth" ? "Early Years (EY)"
    : chapterId === "kindergarten" ? "School Days"
    : chapterId === "middle_school" ? "Middle School"
    : chapterId === "high_school" ? "High School"
    : chapterId === "graduation" ? "Graduation"
    : "First Job";

  const subtitle =
    chapterId === "birth" ? "Tiny routines, big feelings."
    : chapterId === "kindergarten" ? "New rules, new friends."
    : chapterId === "middle_school" ? "Identity starts forming."
    : chapterId === "high_school" ? "Bigger stakes, bigger choices."
    : chapterId === "graduation" ? "A milestone moment."
    : "The next chapter begins.";

  return (
    <div className="mb-3">
      <div className="relative rounded-xl overflow-hidden h-[150px] md:h-[180px] SBModalIllustration">
        <div className="SBModalIllustrationFrame absolute inset-0 rounded-[14px] overflow-hidden">
          <SafeStorybookImage
            src={filename}
            alt=""
            className="w-full h-full"
            fallbackVariant="banner"
            imgStyle={{ objectFit: "cover" }}
          />
        </div>

        <div className="absolute left-3 right-3 bottom-3 pointer-events-none" style={{ zIndex: 2 }}>
          <div className="SBPanel px-3 py-2 rounded-md">
            <div className="SBHeaderTitle text-base" style={{ color: "var(--sb-ink)" }}>
              Chapter: {title}
            </div>
            <div className="text-xs" style={{ color: "var(--sb-ink-soft)" }}>
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}