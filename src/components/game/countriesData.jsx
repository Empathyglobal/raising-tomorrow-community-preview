// Scalable country index: add minimal metadata once per country.
// Clients should use the default export COUNTRIES (array) for iteration
// and the helpers below for safe lookups/fallbacks.

export const COUNTRY_INDEX = {
  // Core existing set
  USA: { name: 'United States', level: 5, spokenLanguages: ['English'] },
  NOR: { name: 'Norway', level: 6, spokenLanguages: ['Norwegian'] },
  HTI: { name: 'Haiti', level: 1, spokenLanguages: ['French'] },
  IDN: { name: 'Indonesia', level: 2, spokenLanguages: ['Indonesian'] },
  JPN: { name: 'Japan', level: 5, spokenLanguages: ['Japanese'] },
  AUS: { name: 'Australia', level: 5, spokenLanguages: ['English'] },
  DEU: { name: 'Germany', level: 5, spokenLanguages: ['German'] },
  BRA: { name: 'Brazil', level: 4, spokenLanguages: ['Portuguese'] },
  IND: { name: 'India', level: 2, spokenLanguages: ['Hindi', 'English'] },
  ZAF: { name: 'South Africa', level: 3, spokenLanguages: ['English'] },
  MEX: { name: 'Mexico', level: 4, spokenLanguages: ['Spanish'] },
  GBR: { name: 'United Kingdom', level: 5, spokenLanguages: ['English'] },
  FRA: { name: 'France', level: 5, spokenLanguages: ['French'] },
  SGP: { name: 'Singapore', level: 6, spokenLanguages: ['English', 'Mandarin'] },

  // Newly added (expansion)
  CAN: { name: 'Canada', level: 5, spokenLanguages: ['English', 'French'] },
  CHN: { name: 'China', level: 4, spokenLanguages: ['Mandarin'] },
  KOR: { name: 'South Korea', level: 5, spokenLanguages: ['Korean'] },
  PRK: { name: 'North Korea', level: 1, spokenLanguages: ['Korean'] },
  ITA: { name: 'Italy', level: 5, spokenLanguages: ['Italian'] },
  ESP: { name: 'Spain', level: 5, spokenLanguages: ['Spanish'] },
  RUS: { name: 'Russia', level: 4, spokenLanguages: ['Russian'] },
  TUR: { name: 'Türkiye', level: 4, spokenLanguages: ['Turkish'] },
  SAU: { name: 'Saudi Arabia', level: 4, spokenLanguages: ['Arabic'] },
  ARE: { name: 'United Arab Emirates', level: 5, spokenLanguages: ['Arabic'] },
  EGY: { name: 'Egypt', level: 3, spokenLanguages: ['Arabic'] },
  NGA: { name: 'Nigeria', level: 2, spokenLanguages: ['English'] },
  ETH: { name: 'Ethiopia', level: 2, spokenLanguages: ['Amharic'] },
  KEN: { name: 'Kenya', level: 2, spokenLanguages: ['English', 'Swahili'] },
  ARG: { name: 'Argentina', level: 4, spokenLanguages: ['Spanish'] },
  CHL: { name: 'Chile', level: 4, spokenLanguages: ['Spanish'] },
  COL: { name: 'Colombia', level: 4, spokenLanguages: ['Spanish'] },
  PER: { name: 'Peru', level: 3, spokenLanguages: ['Spanish'] },
  VEN: { name: 'Venezuela', level: 2, spokenLanguages: ['Spanish'] },
  PHL: { name: 'Philippines', level: 3, spokenLanguages: ['Filipino', 'English'] },
  THA: { name: 'Thailand', level: 3, spokenLanguages: ['Thai'] },
  VNM: { name: 'Vietnam', level: 3, spokenLanguages: ['Vietnamese'] },
  MYS: { name: 'Malaysia', level: 3, spokenLanguages: ['Malay'] },
  KHM: { name: 'Cambodia', level: 2, spokenLanguages: ['Khmer'] },
  LKA: { name: 'Sri Lanka', level: 2, spokenLanguages: ['Sinhala', 'Tamil'] },
  NPL: { name: 'Nepal', level: 2, spokenLanguages: ['Nepali'] },
  BGD: { name: 'Bangladesh', level: 2, spokenLanguages: ['Bengali'] },
  PAK: { name: 'Pakistan', level: 2, spokenLanguages: ['Urdu', 'English'] },
  ISR: { name: 'Israel', level: 5, spokenLanguages: ['Hebrew'] },
  PSE: { name: 'Palestine', level: 1, spokenLanguages: ['Arabic'] },
  IRN: { name: 'Iran', level: 3, spokenLanguages: ['Persian'] },
  IRQ: { name: 'Iraq', level: 2, spokenLanguages: ['Arabic', 'Kurdish'] },
  SYR: { name: 'Syria', level: 1, spokenLanguages: ['Arabic'] },
  UKR: { name: 'Ukraine', level: 3, spokenLanguages: ['Ukrainian'] },
  POL: { name: 'Poland', level: 4, spokenLanguages: ['Polish'] },
  SWE: { name: 'Sweden', level: 6, spokenLanguages: ['Swedish'] },
  FIN: { name: 'Finland', level: 6, spokenLanguages: ['Finnish'] },
  DNK: { name: 'Denmark', level: 6, spokenLanguages: ['Danish'] },
  NLD: { name: 'Netherlands', level: 6, spokenLanguages: ['Dutch'] },
  BEL: { name: 'Belgium', level: 6, spokenLanguages: ['Dutch', 'French'] },
  CHE: { name: 'Switzerland', level: 6, spokenLanguages: ['German', 'French', 'Italian'] },
  AUT: { name: 'Austria', level: 6, spokenLanguages: ['German'] },
  PRT: { name: 'Portugal', level: 5, spokenLanguages: ['Portuguese'] },
  GRC: { name: 'Greece', level: 5, spokenLanguages: ['Greek'] },
  IRL: { name: 'Ireland', level: 5, spokenLanguages: ['English', 'Irish'] },
  NZL: { name: 'New Zealand', level: 5, spokenLanguages: ['English'] },
  KAZ: { name: 'Kazakhstan', level: 3, spokenLanguages: ['Kazakh', 'Russian'] },
  UZB: { name: 'Uzbekistan', level: 2, spokenLanguages: ['Uzbek'] },
  MMR: { name: 'Myanmar', level: 1, spokenLanguages: ['Burmese'] },
  TZA: { name: 'Tanzania', level: 2, spokenLanguages: ['Swahili', 'English'] },
  UGA: { name: 'Uganda', level: 2, spokenLanguages: ['English', 'Swahili'] },
  MAR: { name: 'Morocco', level: 3, spokenLanguages: ['Arabic'] },
  DZA: { name: 'Algeria', level: 3, spokenLanguages: ['Arabic'] },
  TUN: { name: 'Tunisia', level: 3, spokenLanguages: ['Arabic'] },
  CMR: { name: 'Cameroon', level: 2, spokenLanguages: ['French', 'English'] },

  // EUROPE PACK 2
  ISL: { name: 'Iceland', level: 6, spokenLanguages: ['Icelandic'] },
  CZE: { name: 'Czechia', level: 5, spokenLanguages: ['Czech'] },
  HUN: { name: 'Hungary', level: 4, spokenLanguages: ['Hungarian'] },
  ROU: { name: 'Romania', level: 4, spokenLanguages: ['Romanian'] },
  HRV: { name: 'Croatia', level: 4, spokenLanguages: ['Croatian'] },
  SRB: { name: 'Serbia', level: 3, spokenLanguages: ['Serbian'] },

  // MIDDLE EAST PACK 2
  QAT: { name: 'Qatar', level: 6, spokenLanguages: ['Arabic'] },
  KWT: { name: 'Kuwait', level: 6, spokenLanguages: ['Arabic'] },
  OMN: { name: 'Oman', level: 5, spokenLanguages: ['Arabic'] },
  JOR: { name: 'Jordan', level: 3, spokenLanguages: ['Arabic'] },
  LBN: { name: 'Lebanon', level: 3, spokenLanguages: ['Arabic', 'French'] },

  // AMERICAS PACK 2
  DOM: { name: 'Dominican Republic', level: 3, spokenLanguages: ['Spanish'] },
  JAM: { name: 'Jamaica', level: 3, spokenLanguages: ['English'] },
  CRI: { name: 'Costa Rica', level: 4, spokenLanguages: ['Spanish'] },
  PAN: { name: 'Panama', level: 4, spokenLanguages: ['Spanish'] },
  ECU: { name: 'Ecuador', level: 3, spokenLanguages: ['Spanish'] },

  // AFRICA PACK 2
  GHA: { name: 'Ghana', level: 2, spokenLanguages: ['English'] },
  RWA: { name: 'Rwanda', level: 2, spokenLanguages: ['English', 'French'] },
  SEN: { name: 'Senegal', level: 2, spokenLanguages: ['French'] },
};

// Produce a stable array view for consumers that iterate (existing code expects this)
export const COUNTRIES = Object.entries(COUNTRY_INDEX)
  .map(([iso3, v]) => ({
    iso3,
    name: v?.name || iso3,
    level: Number(v?.level) || 3,
    spokenLanguages: Array.isArray(v?.spokenLanguages) && v.spokenLanguages.length ? v.spokenLanguages : ['English']
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getSpokenLanguagesForCountry(countryCodeOrId) {
  // Handle both iso3 ("JPN") or destination object ({ iso3: "JPN" ... })
  const code = (typeof countryCodeOrId === 'object' ? countryCodeOrId?.iso3 || countryCodeOrId?.code : countryCodeOrId) || 'USA';
  const meta = COUNTRY_INDEX[code];
  return Array.isArray(meta?.spokenLanguages) && meta.spokenLanguages.length ? meta.spokenLanguages : ['English'];
}

export default COUNTRIES;