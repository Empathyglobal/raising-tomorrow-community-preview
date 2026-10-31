export function getDependentNoun(kid) {
  return kid?.relation === 'grandchild' ? 'grandchild' : 'child';
}

export function getDependentPossessive(kid) {
  return kid?.relation === 'grandchild' ? 'your grandchild' : 'your child';
}

export function getDependentTitlePrefix(kid) {
  // Used for headers like "Child Profile" vs "Grandchild Profile"
  return kid?.relation === 'grandchild' ? 'Grandchild' : 'Child';
}

export function replaceGenericChildWording(text, kid) {
  // Light-touch: only replace very common generic phrases.
  // We intentionally do NOT mass-rewrite every scenario; only generic UI/log text.
  if (!text || typeof text !== 'string') return text;
  if (kid?.relation !== 'grandchild') return text;

  let t = text;

  // Most common phrases
  t = t.replaceAll('your child', 'your grandchild');
  t = t.replaceAll('Your child', 'Your grandchild');
  t = t.replaceAll('the child', 'the grandchild');
  t = t.replaceAll('The child', 'The grandchild');

  return t;
}