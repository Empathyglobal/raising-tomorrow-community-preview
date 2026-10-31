import React from "react";
import { motion } from "framer-motion";
import { isStorybookPopupModeFromDom } from "@/components/lib/uiTheme";

export default function SBSticker({
  emoji = "✨",
  label = "",
  value = "",
  tone = "gold", // gold | blue | mint | red | pink | purple
  size = "sm",   // sm | md
  className = ""
}) {
  const isStorybook = isStorybookPopupModeFromDom();
  if (!isStorybook) return null;

  const toneClass = `SBSticker--${tone}`;
  const sizeClass = size === "md" ? "SBSticker--md" : "SBSticker--sm";
  const v = (value === 0 || value) ? String(value) : "";

  return (
    <motion.div
      className={`SBSticker ${toneClass} ${sizeClass} ${className}`}
      initial={{ scale: 0.92, rotate: -1.5, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <span className="SBSticker__emoji" aria-hidden="true">{emoji}</span>
      <span className="SBSticker__label">{label}</span>
      {v !== "" && <span className="SBSticker__value">{v}</span>}
    </motion.div>
  );
}