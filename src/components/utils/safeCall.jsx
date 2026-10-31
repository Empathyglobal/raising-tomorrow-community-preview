export function safeCall(fn, ...args) {
  if (typeof fn === "function") return fn(...args);
  return undefined;
}