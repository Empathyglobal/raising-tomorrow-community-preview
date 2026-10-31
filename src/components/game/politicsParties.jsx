// Politics Parties - country-specific party lists + helpers

export const ONE_PARTY_COMMUNIST_ISO3 = new Set(['CHN', 'PRK']);

export const INDEPENDENT_PARTY = {
  id: 'independent',
  label: 'Independent (No Party)',
  abbr: 'IND',
  machineStrength: 0,
};

export const PARTY_DATA_BY_ISO3 = {
  USA: [
    { id: 'dem', label: 'Democratic Party', abbr: 'DEM', machineStrength: 4 },
    { id: 'gop', label: 'Republican Party', abbr: 'GOP', machineStrength: 4 },
    { id: 'green', label: 'Green Party', abbr: 'GRN', machineStrength: 1 },
  ],
  NOR: [
    { id: 'ap', label: 'Labour Party', abbr: 'Ap', machineStrength: 4 },
    { id: 'frp', label: 'Progress Party', abbr: 'FrP', machineStrength: 3 },
    { id: 'hoyre', label: 'Conservative Party', abbr: 'H', machineStrength: 3 },
  ],
  HTI: [
    { id: 'phtk', label: 'Haitian Tèt Kale Party', abbr: 'PHTK', machineStrength: 3 },
    { id: 'fl', label: 'Fanmi Lavalas', abbr: 'FL', machineStrength: 2 },
    { id: 'ppd', label: 'Pitit Desalin', abbr: 'PPD', machineStrength: 2 },
  ],
  IDN: [
    { id: 'pdip', label: 'PDI‑P (Indonesian Democratic Party of Struggle)', abbr: 'PDI‑P', machineStrength: 4 },
    { id: 'golkar', label: 'Golkar', abbr: 'GOLKAR', machineStrength: 3 },
    { id: 'gerindra', label: 'Gerindra (Great Indonesia Movement Party)', abbr: 'GRD', machineStrength: 3 },
  ],
  JPN: [
    { id: 'ldp', label: 'Liberal Democratic Party', abbr: 'LDP', machineStrength: 4 },
    { id: 'cdp', label: 'Constitutional Democratic Party', abbr: 'CDP', machineStrength: 3 },
    { id: 'komei', label: 'Komeito', abbr: 'KOM', machineStrength: 2 },
  ],
  AUS: [
    { id: 'alp', label: 'Australian Labor Party', abbr: 'ALP', machineStrength: 4 },
    { id: 'lib', label: 'Liberal Party of Australia', abbr: 'LIB', machineStrength: 4 },
    { id: 'greens', label: 'Australian Greens', abbr: 'GRN', machineStrength: 2 },
  ],
  DEU: [
    { id: 'spd', label: 'Social Democratic Party (SPD)', abbr: 'SPD', machineStrength: 4 },
    { id: 'cducsu', label: 'CDU/CSU (The Union)', abbr: 'CDU/CSU', machineStrength: 4 },
    { id: 'grune', label: 'Alliance 90/The Greens', abbr: 'GRN', machineStrength: 3 },
  ],
  BRA: [
    { id: 'pt', label: "Workers' Party (PT)", abbr: 'PT', machineStrength: 4 },
    { id: 'pl', label: 'Liberal Party (PL)', abbr: 'PL', machineStrength: 3 },
    { id: 'mdb', label: 'Brazilian Democratic Movement (MDB)', abbr: 'MDB', machineStrength: 3 },
  ],
  IND: [
    { id: 'bjp', label: 'Bharatiya Janata Party (BJP)', abbr: 'BJP', machineStrength: 4 },
    { id: 'inc', label: 'Indian National Congress (INC)', abbr: 'INC', machineStrength: 3 },
    { id: 'aap', label: 'Aam Aadmi Party (AAP)', abbr: 'AAP', machineStrength: 2 },
  ],
  ZAF: [
    { id: 'anc', label: 'African National Congress (ANC)', abbr: 'ANC', machineStrength: 4 },
    { id: 'da', label: 'Democratic Alliance (DA)', abbr: 'DA', machineStrength: 3 },
    { id: 'mk', label: 'uMkhonto weSizwe (MK) Party', abbr: 'MK', machineStrength: 3 },
  ],
  MEX: [
    { id: 'morena', label: 'Morena', abbr: 'MORENA', machineStrength: 4 },
    { id: 'pan', label: 'National Action Party (PAN)', abbr: 'PAN', machineStrength: 3 },
    { id: 'pri', label: 'Institutional Revolutionary Party (PRI)', abbr: 'PRI', machineStrength: 3 },
  ],
  GBR: [
    { id: 'lab', label: 'Labour Party', abbr: 'LAB', machineStrength: 4 },
    { id: 'con', label: 'Conservative Party', abbr: 'CON', machineStrength: 4 },
    { id: 'ld', label: 'Liberal Democrats', abbr: 'LD', machineStrength: 2 },
  ],
  FRA: [
    { id: 're', label: 'Renaissance', abbr: 'RE', machineStrength: 3 },
    { id: 'rn', label: 'National Rally', abbr: 'RN', machineStrength: 3 },
    { id: 'lfi', label: 'La France Insoumise', abbr: 'LFI', machineStrength: 3 },
  ],
  SGP: [
    { id: 'pap', label: "People's Action Party (PAP)", abbr: 'PAP', machineStrength: 4 },
    { id: 'wp', label: "Workers' Party (WP)", abbr: 'WP', machineStrength: 3 },
    { id: 'psp', label: 'Progress Singapore Party (PSP)', abbr: 'PSP', machineStrength: 2 },
  ],
  // Dictatorship exception
  CHN: [
    { id: 'cpc', label: 'Communist Party of China', abbr: 'CPC', machineStrength: 6 },
  ],
  PRK: [
    { id: 'wpk', label: "Workers' Party of Korea", abbr: 'WPK', machineStrength: 6 },
  ],
};

export function getPartyOptionsForCountry(iso3) {
  const key = String(iso3 || '').toUpperCase();
  const base = PARTY_DATA_BY_ISO3[key] || PARTY_DATA_BY_ISO3['USA'];
  // Always include independent as 4th option in UI
  return [...base, INDEPENDENT_PARTY];
}

export function getDefaultPartyIdForCountry(iso3) {
  const key = String(iso3 || '').toUpperCase();
  const list = PARTY_DATA_BY_ISO3[key] || PARTY_DATA_BY_ISO3['USA'];
  return list[0]?.id || 'dem';
}

export function isIndependentParty(partyId) {
  return partyId === 'independent';
}

export function isOnePartyCommunist(iso3) {
  return ONE_PARTY_COMMUNIST_ISO3.has(String(iso3 || '').toUpperCase());
}