export function quantizeTenth(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  // tiny epsilon prevents 0.449999999999 -> 0.4 instead of intended 0.5
  return Math.round((n + Math.sign(n) * 1e-9) * 10) / 10;
}

export function formatTenth(value, { sign = false, money = false } = {}) {
  const v = quantizeTenth(value);
  const abs = Math.abs(v);
  const numStr = Number.isInteger(abs) ? String(abs) : abs.toFixed(1);

  const signStr =
    v > 0 ? (sign ? "+" : "") :
    v < 0 ? "-" :
    "";

  const moneyStr = money ? "$" : "";
  return `${signStr}${moneyStr}${numStr}`;
}