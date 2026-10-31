import { HUMOR_POOLS } from "./humorTextBank";

export function interpolateVars(text, vars = {}) {
  const s = String(text ?? "");
  return s
    .replace(/\{([A-Za-z0-9_]+)\}/g, (_, k) => {
      const v = vars[k];
      return (v === undefined || v === null) ? "" : String(v);
    })
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function pickHumor(poolKey, vars = {}) {
  const arr = HUMOR_POOLS?.[poolKey];
  if (!Array.isArray(arr) || arr.length === 0) return "";
  const chosen = arr[Math.floor(Math.random() * arr.length)];
  return interpolateVars(chosen, vars);
}

export function appendHumor(body, poolKey, vars = {}, prefix = "Funny reason: ") {
  const base = String(body ?? "");
  const line = pickHumor(poolKey, vars);
  if (!line) return base;
  return `${base}\n\n${prefix}${line}`;
}