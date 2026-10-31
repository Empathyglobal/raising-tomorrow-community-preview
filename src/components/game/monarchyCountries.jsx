// Monarchy helper
// Export a fixed allowlist of sovereign monarchies by ISO3 and a predicate

export const MONARCHY_ISO3 = new Set([
  'AND','ARE','ATG','AUS','BHR','BEL','BHS','BLZ','BRN','BTN','CAN','DNK','ESP','GBR','GRD','JAM','JOR','JPN','KHM','KNA','KWT','LCA','LIE','LSO','LUX','MAR','MCO','MYS','NLD','NOR','NZL','OMN','PNG','QAT','SAU','SLB','SWE','SWZ','THA','TON','TUV','VAT','VCT'
]);

export function isMonarchyCountry(country) {
  // Accept iso3 string or object with iso3 property; prefer iso3
  if (!country) return false;
  const iso3 = typeof country === 'string' ? country : (country.iso3 || country.code || country.cca3 || country.id);
  if (!iso3) return false;
  return MONARCHY_ISO3.has(String(iso3).toUpperCase());
}