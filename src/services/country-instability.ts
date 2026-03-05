import type { SocialUnrestEvent, MilitaryFlight, MilitaryVessel, ClusteredEvent, InternetOutage } from '@/types';
import { INTEL_HOTSPOTS, CONFLICT_ZONES, STRATEGIC_WATERWAYS } from '@/config/geo';
import { TIER1_COUNTRIES } from '@/config/countries';
import { focalPointDetector } from './focal-point-detector';
import type { ConflictEvent, UcdpConflictStatus, HapiConflictSummary } from './conflict';
import type { CountryDisplacement } from '@/services/displacement';
import type { ClimateAnomaly } from '@/services/climate';
import { getCountryAtCoordinates } from './country-geometry';

export interface CountryScore {
  code: string;
  name: string;
  score: number;
  level: 'low' | 'normal' | 'elevated' | 'high' | 'critical';
  trend: 'rising' | 'stable' | 'falling';
  change24h: number;
  components: ComponentScores;
  lastUpdated: Date;
}

export interface ComponentScores {
  unrest: number;
  conflict: number;
  security: number;
  information: number;
}

interface CountryData {
  protests: SocialUnrestEvent[];
  conflicts: ConflictEvent[];
  ucdpStatus: UcdpConflictStatus | null;
  hapiSummary: HapiConflictSummary | null;
  militaryFlights: MilitaryFlight[];
  militaryVessels: MilitaryVessel[];
  newsEvents: ClusteredEvent[];
  outages: InternetOutage[];
  displacementOutflow: number;
  climateStress: number;
}

// Re-export for backwards compatibility
export { TIER1_COUNTRIES } from '@/config/countries';

// Learning Mode - warmup period for reliable data (bypassed when cached scores exist)
const LEARNING_DURATION_MS = 15 * 60 * 1000; // 15 minutes
let learningStartTime: number | null = null;
let isLearningComplete = false;
let hasCachedScoresAvailable = false;

export function setHasCachedScores(hasScores: boolean): void {
  hasCachedScoresAvailable = hasScores;
  if (hasScores) {
    isLearningComplete = true; // Skip learning when cached scores available
  }
}

export function startLearning(): void {
  if (learningStartTime === null) {
    learningStartTime = Date.now();
  }
}

export function isInLearningMode(): boolean {
  if (hasCachedScoresAvailable) return false; // Bypass if backend has cached scores
  if (isLearningComplete) return false;
  if (learningStartTime === null) return true;

  const elapsed = Date.now() - learningStartTime;
  if (elapsed >= LEARNING_DURATION_MS) {
    isLearningComplete = true;
    return false;
  }
  return true;
}

export function getLearningProgress(): { inLearning: boolean; remainingMinutes: number; progress: number } {
  if (hasCachedScoresAvailable || isLearningComplete) {
    return { inLearning: false, remainingMinutes: 0, progress: 100 };
  }
  if (learningStartTime === null) {
    return { inLearning: true, remainingMinutes: 15, progress: 0 };
  }

  const elapsed = Date.now() - learningStartTime;
  const remaining = Math.max(0, LEARNING_DURATION_MS - elapsed);
  const progress = Math.min(100, (elapsed / LEARNING_DURATION_MS) * 100);

  return {
    inLearning: remaining > 0,
    remainingMinutes: Math.ceil(remaining / 60000),
    progress: Math.round(progress),
  };
}

const COUNTRY_KEYWORDS: Record<string, string[]> = {
  // Major powers & nuclear states
  US: ['united states', 'usa', 'america', 'washington', 'biden', 'trump', 'pentagon'],
  RU: ['russia', 'moscow', 'kremlin', 'putin'],
  CN: ['china', 'beijing', 'xi jinping', 'prc'],
  GB: ['britain', 'uk', 'london', 'starmer'],
  FR: ['france', 'paris', 'macron'],
  IN: ['india', 'delhi', 'modi'],
  PK: ['pakistan', 'islamabad'],
  KP: ['north korea', 'pyongyang', 'kim jong'],
  IL: ['israel', 'tel aviv', 'netanyahu', 'idf', 'gaza'],
  // Active conflict zones
  UA: ['ukraine', 'kyiv', 'zelensky', 'donbas'],
  SY: ['syria', 'damascus', 'assad'],
  YE: ['yemen', 'sanaa', 'houthi'],
  MM: ['myanmar', 'burma', 'rangoon'],
  SD: ['sudan', 'khartoum', 'rsf', 'darfur'],
  SS: ['south sudan', 'juba'],
  SO: ['somalia', 'mogadishu', 'al-shabaab'],
  CD: ['congo', 'kinshasa', 'drc', 'm23'],
  ET: ['ethiopia', 'addis ababa', 'tigray'],
  AF: ['afghanistan', 'kabul', 'taliban'],
  IQ: ['iraq', 'baghdad', 'mosul'],
  LY: ['libya', 'tripoli', 'benghazi'],
  HT: ['haiti', 'port-au-prince'],
  ML: ['mali', 'bamako', 'sahel'],
  // Regional powers & strategic nations
  IR: ['iran', 'tehran', 'khamenei', 'irgc'],
  TW: ['taiwan', 'taipei'],
  SA: ['saudi arabia', 'riyadh', 'mbs'],
  TR: ['turkey', 'ankara', 'erdogan'],
  EG: ['egypt', 'cairo', 'sisi'],
  NG: ['nigeria', 'abuja', 'lagos', 'boko haram'],
  ZA: ['south africa', 'pretoria', 'johannesburg'],
  JP: ['japan', 'tokyo'],
  KR: ['south korea', 'seoul'],
  AU: ['australia', 'canberra', 'sydney'],
  ID: ['indonesia', 'jakarta'],
  TH: ['thailand', 'bangkok'],
  PH: ['philippines', 'manila'],
  VN: ['vietnam', 'hanoi'],
  AE: ['uae', 'emirates', 'dubai', 'abu dhabi'],
  QA: ['qatar', 'doha'],
  // Europe & NATO frontline
  DE: ['germany', 'berlin'],
  PL: ['poland', 'warsaw'],
  RO: ['romania', 'bucharest'],
  NO: ['norway', 'oslo'],
  SE: ['sweden', 'stockholm'],
  FI: ['finland', 'helsinki'],
  GR: ['greece', 'athens'],
  IT: ['italy', 'rome', 'roma'],
  ES: ['spain', 'madrid'],
  // Americas
  BR: ['brazil', 'brasilia', 'lula', 'bolsonaro'],
  MX: ['mexico', 'mexico city', 'cartel'],
  CO: ['colombia', 'bogota'],
  VE: ['venezuela', 'caracas', 'maduro'],
  AR: ['argentina', 'buenos aires', 'milei'],
  CA: ['canada', 'ottawa', 'trudeau'],
};

// Geopolitical baseline risk scores (0-50)
// Reflects inherent instability regardless of current events
const BASELINE_RISK: Record<string, number> = {
  // Major powers & nuclear states
  US: 5, RU: 35, CN: 25, GB: 5, FR: 10, IN: 20, PK: 35, KP: 45, IL: 45,
  // Active conflict zones
  UA: 50, SY: 50, YE: 50, MM: 45, SD: 50, SS: 50, SO: 50, CD: 45,
  ET: 40, AF: 50, IQ: 40, LY: 45, HT: 45, ML: 40,
  // Regional powers & strategic nations
  IR: 40, TW: 30, SA: 20, TR: 25, EG: 25, NG: 30, ZA: 20,
  JP: 5, KR: 10, AU: 5, ID: 15, TH: 15, PH: 20, VN: 15, AE: 10, QA: 10,
  // Europe & NATO frontline
  DE: 5, PL: 10, RO: 10, NO: 5, SE: 5, FI: 8, GR: 10, IT: 8, ES: 8,
  // Americas
  BR: 15, MX: 30, CO: 25, VE: 40, AR: 20, CA: 5,
};

// Event significance multipliers
// Higher = each event is more significant (authoritarian states where events are suppressed)
// Lower = events are common/expected (open democracies with high media coverage)
const EVENT_MULTIPLIER: Record<string, number> = {
  // Major powers & nuclear states
  US: 0.3, RU: 2.0, CN: 2.5, GB: 0.5, FR: 0.6, IN: 0.8, PK: 1.5, KP: 3.0, IL: 0.7,
  // Active conflict zones
  UA: 0.8, SY: 0.7, YE: 0.7, MM: 1.8, SD: 1.5, SS: 1.8, SO: 1.5, CD: 1.5,
  ET: 1.5, AF: 1.2, IQ: 1.0, LY: 1.2, HT: 1.5, ML: 1.5,
  // Regional powers & strategic nations
  IR: 2.0, TW: 1.5, SA: 2.0, TR: 1.2, EG: 1.8, NG: 1.0, ZA: 0.8,
  JP: 0.5, KR: 0.6, AU: 0.4, ID: 1.0, TH: 1.2, PH: 1.0, VN: 1.8, AE: 1.5, QA: 1.5,
  // Europe & NATO frontline
  DE: 0.5, PL: 0.8, RO: 0.8, NO: 0.5, SE: 0.5, FI: 0.5, GR: 0.7, IT: 0.5, ES: 0.5,
  // Americas
  BR: 0.6, MX: 1.0, CO: 1.0, VE: 1.8, AR: 0.7, CA: 0.4,
};

const countryDataMap = new Map<string, CountryData>();
const previousScores = new Map<string, number>();

function initCountryData(): CountryData {
  return { protests: [], conflicts: [], ucdpStatus: null, hapiSummary: null, militaryFlights: [], militaryVessels: [], newsEvents: [], outages: [], displacementOutflow: 0, climateStress: 0 };
}

export function clearCountryData(): void {
  countryDataMap.clear();
  hotspotActivityMap.clear();
}

export function getCountryData(code: string): CountryData | undefined {
  return countryDataMap.get(code);
}

export function getPreviousScores(): Map<string, number> {
  return previousScores;
}

export { COUNTRY_BOUNDS };
export type { CountryData };

function normalizeCountryName(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [code, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return code;
  }
  for (const [code, countryName] of Object.entries(TIER1_COUNTRIES)) {
    if (lower.includes(countryName.toLowerCase())) return code;
  }
  return null;
}

export function ingestProtestsForCII(events: SocialUnrestEvent[]): void {
  for (const e of events) {
    const code = normalizeCountryName(e.country);
    if (!code || !TIER1_COUNTRIES[code]) continue;
    if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
    countryDataMap.get(code)!.protests.push(e);
    trackHotspotActivity(e.lat, e.lon, e.severity === 'high' ? 2 : 1);
  }
}

export function ingestConflictsForCII(events: ConflictEvent[]): void {
  for (const e of events) {
    const code = normalizeCountryName(e.country);
    if (!code || !TIER1_COUNTRIES[code]) continue;
    if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
    countryDataMap.get(code)!.conflicts.push(e);
    trackHotspotActivity(e.lat, e.lon, e.fatalities > 0 ? 3 : 2);
  }
}

export function ingestUcdpForCII(classifications: Map<string, UcdpConflictStatus>): void {
  for (const [code, status] of classifications) {
    if (!TIER1_COUNTRIES[code]) continue;
    if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
    countryDataMap.get(code)!.ucdpStatus = status;
  }
}

export function ingestHapiForCII(summaries: Map<string, HapiConflictSummary>): void {
  for (const [code, summary] of summaries) {
    if (!TIER1_COUNTRIES[code]) continue;
    if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
    countryDataMap.get(code)!.hapiSummary = summary;
  }
}

const ISO3_TO_ISO2: Record<string, string> = {
  AFG: 'AF', SYR: 'SY', UKR: 'UA', SDN: 'SD', SSD: 'SS', SOM: 'SO',
  COD: 'CD', MMR: 'MM', YEM: 'YE', ETH: 'ET', VEN: 'VE', IRQ: 'IQ',
  COL: 'CO', NGA: 'NG', PSE: 'PS', TUR: 'TR', PAK: 'PK', IRN: 'IR',
  IND: 'IN', CHN: 'CN', RUS: 'RU', ISR: 'IL', SAU: 'SA', USA: 'US',
  TWN: 'TW', PRK: 'KP', POL: 'PL', DEU: 'DE', FRA: 'FR', GBR: 'GB',
  LBY: 'LY', EGY: 'EG', ZAF: 'ZA', JPN: 'JP', KOR: 'KR', AUS: 'AU',
  IDN: 'ID', THA: 'TH', PHL: 'PH', VNM: 'VN', ARE: 'AE', QAT: 'QA',
  ROU: 'RO', NOR: 'NO', SWE: 'SE', FIN: 'FI', GRC: 'GR', ITA: 'IT',
  ESP: 'ES', BRA: 'BR', MEX: 'MX', ARG: 'AR', CAN: 'CA', HTI: 'HT',
  MLI: 'ML',
};

const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  'Afghanistan': 'AF', 'Syria': 'SY', 'Ukraine': 'UA', 'Sudan': 'SD',
  'South Sudan': 'SS', 'Somalia': 'SO', 'DR Congo': 'CD', 'Myanmar': 'MM',
  'Yemen': 'YE', 'Ethiopia': 'ET', 'Venezuela': 'VE', 'Iraq': 'IQ',
  'Colombia': 'CO', 'Nigeria': 'NG', 'Palestine': 'PS', 'Turkey': 'TR',
  'Pakistan': 'PK', 'Iran': 'IR', 'India': 'IN', 'China': 'CN',
  'Russia': 'RU', 'Israel': 'IL', 'Saudi Arabia': 'SA',
  'Libya': 'LY', 'Egypt': 'EG', 'South Africa': 'ZA', 'Japan': 'JP',
  'South Korea': 'KR', 'Australia': 'AU', 'Indonesia': 'ID', 'Thailand': 'TH',
  'Philippines': 'PH', 'Vietnam': 'VN', 'Qatar': 'QA',
  'Romania': 'RO', 'Norway': 'NO', 'Sweden': 'SE', 'Finland': 'FI',
  'Greece': 'GR', 'Italy': 'IT', 'Spain': 'ES', 'Brazil': 'BR',
  'Mexico': 'MX', 'Argentina': 'AR', 'Canada': 'CA', 'Haiti': 'HT',
  'Mali': 'ML',
};

export function ingestDisplacementForCII(countries: CountryDisplacement[]): void {
  for (const data of countryDataMap.values()) {
    data.displacementOutflow = 0;
  }

  for (const c of countries) {
    const code = c.code?.length === 3
      ? ISO3_TO_ISO2[c.code] || c.code.substring(0, 2)
      : COUNTRY_NAME_TO_ISO[c.name] || c.code;
    if (!code || !TIER1_COUNTRIES[code]) continue;
    if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
    const outflow = c.refugees + c.asylumSeekers;
    countryDataMap.get(code)!.displacementOutflow = outflow;
  }
}

const ZONE_COUNTRY_MAP: Record<string, string[]> = {
  'Ukraine': ['UA'], 'Middle East': ['IR', 'IL', 'SA', 'SY', 'YE', 'IQ', 'EG', 'QA', 'AE'],
  'South Asia': ['PK', 'IN', 'AF'], 'Myanmar': ['MM'],
  'East Africa': ['ET', 'SO', 'SD', 'SS', 'CD'], 'West Africa': ['NG', 'ML'],
  'Southeast Asia': ['ID', 'TH', 'PH', 'VN', 'MM'],
  'East Asia': ['CN', 'JP', 'KR', 'TW', 'KP'],
  'Southern Africa': ['ZA'], 'North Africa': ['LY', 'EG'],
  'Caribbean': ['HT'], 'Central America': ['MX'],
  'South America': ['BR', 'CO', 'VE', 'AR'],
  'Europe': ['DE', 'FR', 'GB', 'PL', 'RO', 'GR', 'IT', 'ES', 'NO', 'SE', 'FI'],
  'Oceania': ['AU'],
};

export function ingestClimateForCII(anomalies: ClimateAnomaly[]): void {
  for (const data of countryDataMap.values()) {
    data.climateStress = 0;
  }

  for (const a of anomalies) {
    if (a.severity === 'normal') continue;
    const codes = ZONE_COUNTRY_MAP[a.zone] || [];
    for (const code of codes) {
      if (!TIER1_COUNTRIES[code]) continue;
      if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
      const stress = a.severity === 'extreme' ? 15 : 8;
      countryDataMap.get(code)!.climateStress = Math.max(countryDataMap.get(code)!.climateStress, stress);
    }
  }
}

// Country bounding boxes for location-based attribution [minLat, maxLat, minLon, maxLon]
const COUNTRY_BOUNDS: Record<string, [number, number, number, number]> = {
  // Major powers
  US: [24, 50, -125, -66],
  RU: [41, 82, 19, 180],
  CN: [18, 54, 73, 135],
  GB: [49, 61, -8, 2],
  FR: [41, 51, -5, 10],
  IN: [6, 36, 68, 97],
  PK: [23, 37, 60, 77],
  KP: [37, 43, 124, 131],
  IL: [29, 34, 34, 36],
  // Active conflict zones
  UA: [44, 53, 22, 40],
  SY: [32, 37, 35, 42],
  YE: [12, 19, 42, 54],
  MM: [9, 29, 92, 101],
  SD: [3, 23, 21, 39],
  SS: [3, 13, 24, 36],
  SO: [-2, 12, 40, 51],
  CD: [-14, 6, 12, 32],
  ET: [3, 15, 33, 48],
  AF: [29, 39, 60, 75],
  IQ: [29, 38, 38, 49],
  LY: [19, 34, 9, 25],
  HT: [18, 20, -75, -71],
  ML: [10, 25, -12, 4],
  // Regional powers
  IR: [25, 40, 44, 63],
  TW: [21, 26, 119, 122],
  SA: [16, 32, 34, 56],
  TR: [36, 42, 26, 45],
  EG: [22, 32, 24, 37],
  NG: [4, 14, 2, 15],
  ZA: [-35, -22, 16, 33],
  JP: [24, 46, 122, 146],
  KR: [33, 39, 124, 130],
  AU: [-44, -10, 113, 154],
  ID: [-11, 6, 95, 141],
  TH: [5, 21, 97, 106],
  PH: [4, 21, 116, 127],
  VN: [8, 24, 102, 110],
  AE: [22, 26, 51, 56],
  QA: [24, 27, 50, 52],
  // Europe
  DE: [47, 55, 5, 16],
  PL: [49, 55, 14, 24],
  RO: [43, 49, 20, 30],
  NO: [57, 72, 4, 32],
  SE: [55, 69, 11, 24],
  FI: [59, 70, 20, 32],
  GR: [34, 42, 19, 30],
  IT: [36, 47, 6, 19],
  ES: [36, 44, -10, 4],
  // Americas
  BR: [-34, 6, -74, -34],
  MX: [14, 33, -118, -86],
  CO: [-5, 13, -82, -66],
  VE: [0, 13, -74, -59],
  AR: [-56, -21, -74, -53],
  CA: [41, 84, -141, -52],
};
const LOCATION_COUNTRY_CANDIDATES = Object.keys(TIER1_COUNTRIES);

function getCountryFromLocation(lat: number, lon: number): string | null {
  const precise = getCountryAtCoordinates(lat, lon, LOCATION_COUNTRY_CANDIDATES);
  if (precise && TIER1_COUNTRIES[precise.code]) {
    return precise.code;
  }

  for (const [code, [minLat, maxLat, minLon, maxLon]] of Object.entries(COUNTRY_BOUNDS)) {
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return code;
    }
  }
  return null;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const HOTSPOT_COUNTRY_MAP: Record<string, string> = {
  tehran: 'IR', moscow: 'RU', beijing: 'CN', kyiv: 'UA', taipei: 'TW',
  telaviv: 'IL', pyongyang: 'KP', riyadh: 'SA', ankara: 'TR', damascus: 'SY',
  sanaa: 'YE', caracas: 'VE', dc: 'US', london: 'GB', brussels: 'FR',
  baghdad: 'IQ', beirut: 'IR', doha: 'QA', abudhabi: 'AE',
  cairo: 'EG', mogadishu: 'SO', khartoum: 'SD', addisababa: 'ET',
  kabul: 'AF', tripoli: 'LY', tokyo: 'JP', seoul: 'KR', jakarta: 'ID',
  manila: 'PH', hanoi: 'VN', bangkok: 'TH', bogota: 'CO', mexicocity: 'MX',
};

const hotspotActivityMap = new Map<string, number>();

function trackHotspotActivity(lat: number, lon: number, weight: number = 1): void {
  for (const hotspot of INTEL_HOTSPOTS) {
    const dist = haversineKm(lat, lon, hotspot.lat, hotspot.lon);
    if (dist < 150) {
      const countryCode = HOTSPOT_COUNTRY_MAP[hotspot.id];
      if (countryCode && TIER1_COUNTRIES[countryCode]) {
        const current = hotspotActivityMap.get(countryCode) || 0;
        hotspotActivityMap.set(countryCode, current + weight);
      }
    }
  }
  for (const zone of CONFLICT_ZONES) {
    const [zoneLon, zoneLat] = zone.center;
    const dist = haversineKm(lat, lon, zoneLat, zoneLon);
    if (dist < 300) {
      const zoneCountries: Record<string, string[]> = {
        ukraine: ['UA', 'RU'], gaza: ['IL', 'IR'], sudan: ['SA'], myanmar: ['MM'],
      };
      const countries = zoneCountries[zone.id] || [];
      for (const code of countries) {
        if (TIER1_COUNTRIES[code]) {
          const current = hotspotActivityMap.get(code) || 0;
          hotspotActivityMap.set(code, current + weight * 2);
        }
      }
    }
  }
  for (const waterway of STRATEGIC_WATERWAYS) {
    const dist = haversineKm(lat, lon, waterway.lat, waterway.lon);
    if (dist < 200) {
      const waterwayCountries: Record<string, string[]> = {
        taiwan_strait: ['TW', 'CN'], hormuz_strait: ['IR', 'SA'],
        bab_el_mandeb: ['YE', 'SA'], suez: ['IL'], bosphorus: ['TR'],
      };
      const countries = waterwayCountries[waterway.id] || [];
      for (const code of countries) {
        if (TIER1_COUNTRIES[code]) {
          const current = hotspotActivityMap.get(code) || 0;
          hotspotActivityMap.set(code, current + weight * 1.5);
        }
      }
    }
  }
}

function getHotspotBoost(countryCode: string): number {
  const activity = hotspotActivityMap.get(countryCode) || 0;
  return Math.min(10, activity * 1.5);  // Reduced from 30 max to 10 max
}

export function ingestMilitaryForCII(flights: MilitaryFlight[], vessels: MilitaryVessel[]): void {
  // Track foreign military activity per country
  const foreignMilitaryByCountry = new Map<string, { flights: number; vessels: number }>();

  for (const f of flights) {
    // 1. Credit operator country (their own military activity)
    const operatorCode = normalizeCountryName(f.operatorCountry);
    if (operatorCode && TIER1_COUNTRIES[operatorCode]) {
      if (!countryDataMap.has(operatorCode)) countryDataMap.set(operatorCode, initCountryData());
      countryDataMap.get(operatorCode)!.militaryFlights.push(f);
    }

    // 2. Credit LOCATION country if different (foreign military over their territory = threat)
    const locationCode = getCountryFromLocation(f.lat, f.lon);
    if (locationCode && TIER1_COUNTRIES[locationCode] && locationCode !== operatorCode) {
      if (!foreignMilitaryByCountry.has(locationCode)) {
        foreignMilitaryByCountry.set(locationCode, { flights: 0, vessels: 0 });
      }
      foreignMilitaryByCountry.get(locationCode)!.flights++;
    }
    trackHotspotActivity(f.lat, f.lon, 1.5);
  }

  for (const v of vessels) {
    // 1. Credit operator country
    const operatorCode = normalizeCountryName(v.operatorCountry);
    if (operatorCode && TIER1_COUNTRIES[operatorCode]) {
      if (!countryDataMap.has(operatorCode)) countryDataMap.set(operatorCode, initCountryData());
      countryDataMap.get(operatorCode)!.militaryVessels.push(v);
    }

    // 2. Credit LOCATION country if different (foreign naval presence = threat)
    const locationCode = getCountryFromLocation(v.lat, v.lon);
    if (locationCode && TIER1_COUNTRIES[locationCode] && locationCode !== operatorCode) {
      if (!foreignMilitaryByCountry.has(locationCode)) {
        foreignMilitaryByCountry.set(locationCode, { flights: 0, vessels: 0 });
      }
      foreignMilitaryByCountry.get(locationCode)!.vessels++;
    }
    trackHotspotActivity(v.lat, v.lon, 2);
  }

  // Store foreign military counts for security calculation
  for (const [code, counts] of foreignMilitaryByCountry) {
    if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
    const data = countryDataMap.get(code)!;
    // Add synthetic entries to represent foreign military presence
    // Each foreign flight/vessel counts MORE than own military (it's a threat)
    for (let i = 0; i < counts.flights * 2; i++) {
      data.militaryFlights.push({} as MilitaryFlight);
    }
    for (let i = 0; i < counts.vessels * 2; i++) {
      data.militaryVessels.push({} as MilitaryVessel);
    }
  }
}

export function ingestNewsForCII(events: ClusteredEvent[]): void {
  for (const e of events) {
    const title = e.primaryTitle.toLowerCase();
    for (const [code] of Object.entries(TIER1_COUNTRIES)) {
      const keywords = COUNTRY_KEYWORDS[code] || [];
      if (keywords.some(kw => title.includes(kw))) {
        if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
        countryDataMap.get(code)!.newsEvents.push(e);
      }
    }
  }
}

export function ingestOutagesForCII(outages: InternetOutage[]): void {
  for (const o of outages) {
    const code = normalizeCountryName(o.country);
    if (!code || !TIER1_COUNTRIES[code]) continue;
    if (!countryDataMap.has(code)) countryDataMap.set(code, initCountryData());
    countryDataMap.get(code)!.outages.push(o);
  }
}

function calcUnrestScore(data: CountryData, countryCode: string): number {
  const protestCount = data.protests.length;
  const multiplier = EVENT_MULTIPLIER[countryCode] ?? 1.0;

  let baseScore = 0;
  let fatalityBoost = 0;
  let severityBoost = 0;

  if (protestCount > 0) {
    const fatalities = data.protests.reduce((sum, p) => sum + (p.fatalities || 0), 0);
    const highSeverity = data.protests.filter(p => p.severity === 'high').length;

    // For democracies with frequent protests (low multiplier), use log scaling
    // This prevents routine protests from triggering instability alerts
    const isHighVolume = multiplier < 0.7;
    const adjustedCount = isHighVolume
      ? Math.log2(protestCount + 1) * multiplier * 5  // Log scale for democracies
      : protestCount * multiplier;

    baseScore = Math.min(50, adjustedCount * 8);

    // Fatalities and high severity always matter, but scaled by multiplier
    fatalityBoost = Math.min(30, fatalities * 5 * multiplier);
    severityBoost = Math.min(20, highSeverity * 10 * multiplier);
  }

  // Internet outages are a MAJOR signal of instability
  // Governments cut internet during crackdowns, conflicts, coups
  let outageBoost = 0;
  if (data.outages.length > 0) {
    const totalOutages = data.outages.filter(o => o.severity === 'total').length;
    const majorOutages = data.outages.filter(o => o.severity === 'major').length;
    const partialOutages = data.outages.filter(o => o.severity === 'partial').length;

    // Total blackout = major red flag (30 points)
    // Major outage = significant (15 points)
    // Partial = moderate (5 points)
    outageBoost = Math.min(50, totalOutages * 30 + majorOutages * 15 + partialOutages * 5);
  }

  return Math.min(100, baseScore + fatalityBoost + severityBoost + outageBoost);
}

function calcConflictScore(data: CountryData, countryCode: string): number {
  const events = data.conflicts;
  const multiplier = EVENT_MULTIPLIER[countryCode] ?? 1.0;

  if (events.length === 0 && !data.hapiSummary) return 0;

  const battleCount = events.filter(e => e.eventType === 'battle').length;
  const explosionCount = events.filter(e => e.eventType === 'explosion' || e.eventType === 'remote_violence').length;
  const civilianCount = events.filter(e => e.eventType === 'violence_against_civilians').length;
  const totalFatalities = events.reduce((sum, e) => sum + e.fatalities, 0);

  const eventScore = Math.min(50, (battleCount * 3 + explosionCount * 4 + civilianCount * 5) * multiplier);
  const fatalityScore = Math.min(40, Math.sqrt(totalFatalities) * 5 * multiplier);
  const civilianBoost = civilianCount > 0 ? Math.min(10, civilianCount * 3) : 0;

  // HAPI fallback: if no ACLED conflict events but HAPI shows political violence
  // Note: eventsCivilianTargeting is folded into eventsPoliticalViolence (HAPI doesn't
  // split them), so we use a blended weight of 3 to avoid underweighting civilian targeting.
  let hapiFallback = 0;
  if (events.length === 0 && data.hapiSummary) {
    const h = data.hapiSummary;
    hapiFallback = Math.min(60, h.eventsPoliticalViolence * 3 * multiplier);
  }

  return Math.min(100, Math.max(eventScore + fatalityScore + civilianBoost, hapiFallback));
}

function getUcdpFloor(data: CountryData): number {
  const status = data.ucdpStatus;
  if (!status) return 0;
  switch (status.intensity) {
    case 'war': return 70;
    case 'minor': return 50;
    case 'none': return 0;
  }
}

function calcSecurityScore(data: CountryData): number {
  const flights = data.militaryFlights.length;
  const vessels = data.militaryVessels.length;
  const flightScore = Math.min(50, flights * 3);
  const vesselScore = Math.min(30, vessels * 5);
  return Math.min(100, flightScore + vesselScore);
}

function calcInformationScore(data: CountryData, countryCode: string): number {
  const count = data.newsEvents.length;
  if (count === 0) return 0;

  const multiplier = EVENT_MULTIPLIER[countryCode] ?? 1.0;
  const velocitySum = data.newsEvents.reduce((sum, e) => sum + (e.velocity?.sourcesPerHour || 0), 0);
  const avgVelocity = velocitySum / count;

  // For high-volume countries (US, UK, DE, FR), use logarithmic scaling
  // This prevents routine news volume from triggering instability
  const isHighVolume = multiplier < 0.7;
  const adjustedCount = isHighVolume
    ? Math.log2(count + 1) * multiplier * 3  // Log scale for media-saturated countries
    : count * multiplier;

  const baseScore = Math.min(40, adjustedCount * 5);

  // Velocity only matters if it's actually high (breaking news style)
  const velocityThreshold = isHighVolume ? 5 : 2;
  const velocityBoost = avgVelocity > velocityThreshold
    ? Math.min(40, (avgVelocity - velocityThreshold) * 10 * multiplier)
    : 0;

  // Alert boost also scaled by multiplier
  const alertBoost = data.newsEvents.some(e => e.isAlert) ? 20 * multiplier : 0;

  return Math.min(100, baseScore + velocityBoost + alertBoost);
}

/**
 * Adaptive component weights based on country characteristics.
 * - War zones (baseline >= 45): conflict weighted higher, info lower
 * - Authoritarian/suppressed (multiplier >= 1.8): unrest weighted higher (rare = significant)
 * - Media-saturated democracies (multiplier <= 0.5): info weighted lower to reduce noise
 * Default: unrest 0.25, conflict 0.30, security 0.20, information 0.25
 */
function getAdaptiveWeights(code: string): { unrest: number; conflict: number; security: number; information: number } {
  const baseline = BASELINE_RISK[code] ?? 20;
  const multiplier = EVENT_MULTIPLIER[code] ?? 1.0;

  // Start with defaults
  let wU = 0.25, wC = 0.30, wS = 0.20, wI = 0.25;

  // Active war zone: boost conflict weight, reduce info noise
  if (baseline >= 45) {
    wC += 0.10;
    wI -= 0.05;
    wU -= 0.05;
  }

  // Authoritarian / heavily suppressed: unrest is rare and significant
  if (multiplier >= 1.8) {
    wU += 0.08;
    wI -= 0.05;
    wS -= 0.03;
  }

  // Media-saturated democracies: reduce info weight (high volume ≠ instability)
  if (multiplier <= 0.5) {
    wI -= 0.08;
    wC += 0.04;
    wS += 0.04;
  }

  // Normalize to sum to 1.0
  const sum = wU + wC + wS + wI;
  return { unrest: wU / sum, conflict: wC / sum, security: wS / sum, information: wI / sum };
}

function getLevel(score: number): CountryScore['level'] {
  if (score >= 81) return 'critical';
  if (score >= 66) return 'high';
  if (score >= 51) return 'elevated';
  if (score >= 31) return 'normal';
  return 'low';
}

function getTrend(code: string, current: number): CountryScore['trend'] {
  const prev = previousScores.get(code);
  if (prev === undefined) return 'stable';
  const diff = current - prev;
  if (diff >= 5) return 'rising';
  if (diff <= -5) return 'falling';
  return 'stable';
}

export function calculateCII(): CountryScore[] {
  const scores: CountryScore[] = [];
  const focalUrgencies = focalPointDetector.getCountryUrgencyMap();

  for (const [code, name] of Object.entries(TIER1_COUNTRIES)) {
    const data = countryDataMap.get(code) || initCountryData();
    const baselineRisk = BASELINE_RISK[code] ?? 20;

    const components: ComponentScores = {
      unrest: Math.round(calcUnrestScore(data, code)),
      conflict: Math.round(calcConflictScore(data, code)),
      security: Math.round(calcSecurityScore(data)),
      information: Math.round(calcInformationScore(data, code)),
    };

    // Adaptive weights: adjusted per-country based on regime type and conflict status
    const w = getAdaptiveWeights(code);
    const eventScore = components.unrest * w.unrest + components.conflict * w.conflict + components.security * w.security + components.information * w.information;

    const hotspotBoost = getHotspotBoost(code);
    const newsUrgencyBoost = components.information >= 70 ? 5
      : components.information >= 50 ? 3
      : 0;
    const focalUrgency = focalUrgencies.get(code);
    const focalBoost = focalUrgency === 'critical' ? 8
      : focalUrgency === 'elevated' ? 4
      : 0;

    const displacementBoost = data.displacementOutflow >= 1_000_000 ? 8
      : data.displacementOutflow >= 100_000 ? 4
      : 0;
    const climateBoost = data.climateStress;

    const blendedScore = baselineRisk * 0.4 + eventScore * 0.6 + hotspotBoost + newsUrgencyBoost + focalBoost + displacementBoost + climateBoost;

    // UCDP-derived conflict floor replaces hardcoded floors
    // war (1000+ deaths/yr) → 70, minor (25-999) → 50, none → 0
    const floor = getUcdpFloor(data);
    const score = Math.round(Math.min(100, Math.max(floor, blendedScore)));

    const prev = previousScores.get(code) ?? score;

    scores.push({
      code,
      name,
      score,
      level: getLevel(score),
      trend: getTrend(code, score),
      change24h: score - prev,
      components,
      lastUpdated: new Date(),
    });

    previousScores.set(code, score);
  }

  return scores.sort((a, b) => b.score - a.score);
}

export function getTopUnstableCountries(limit = 10): CountryScore[] {
  return calculateCII().slice(0, limit);
}

export function getCountryScore(code: string): number | null {
  const data = countryDataMap.get(code);
  if (!data) return null;

  const baselineRisk = BASELINE_RISK[code] ?? 20;
  const components: ComponentScores = {
    unrest: calcUnrestScore(data, code),
    conflict: calcConflictScore(data, code),
    security: calcSecurityScore(data),
    information: calcInformationScore(data, code),
  };

  const w = getAdaptiveWeights(code);
  const eventScore = components.unrest * w.unrest + components.conflict * w.conflict + components.security * w.security + components.information * w.information;
  const hotspotBoost = getHotspotBoost(code);
  const newsUrgencyBoost = components.information >= 70 ? 5
    : components.information >= 50 ? 3
    : 0;
  const focalUrgency = focalPointDetector.getCountryUrgency(code);
  const focalBoost = focalUrgency === 'critical' ? 8
    : focalUrgency === 'elevated' ? 4
    : 0;
  const displacementBoost = data.displacementOutflow >= 1_000_000 ? 8
    : data.displacementOutflow >= 100_000 ? 4
    : 0;
  const climateBoost = data.climateStress;
  const blendedScore = baselineRisk * 0.4 + eventScore * 0.6 + hotspotBoost + newsUrgencyBoost + focalBoost + displacementBoost + climateBoost;

  const floor = getUcdpFloor(data);
  return Math.round(Math.min(100, Math.max(floor, blendedScore)));
}
