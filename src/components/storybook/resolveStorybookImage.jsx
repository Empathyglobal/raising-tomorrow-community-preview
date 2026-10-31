import postcards from '@/components/storybook/postcards';

const idToUrl = new Map();
(postcards || []).forEach((p) => {
  const id = String(p?.id || '').toLowerCase();
  if (id) idToUrl.set(id, p.image);
});

function normalize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

const aliasRaw = {
  bathhub_1: 'bathrub1',
  basket_veggies: 'basketvegies',
};
const aliasNorm = Object.fromEntries(Object.entries(aliasRaw).map(([k, v]) => [normalize(k), normalize(v)]));

export function resolveStorybookImage(srcOrKey) {
  if (!srcOrKey) return null;
  const s = String(srcOrKey);
  if (s === "/demo-art.svg") return s;
  if (s.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(s)) return null;

  const raw = s;
  const norm = normalize(s);

  const altRaw = aliasRaw[raw] || raw;
  const altNorm = aliasNorm[norm] || norm;

  if (idToUrl.has(altRaw)) return idToUrl.get(altRaw);
  if (idToUrl.has(altNorm)) return idToUrl.get(altNorm);
  if (idToUrl.has(raw)) return idToUrl.get(raw);
  if (idToUrl.has(norm)) return idToUrl.get(norm);
  return null;
}

export default resolveStorybookImage;
