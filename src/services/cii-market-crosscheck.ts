/**
 * CII ↔ Market Cross-Validation Service
 *
 * Correlates Country Instability Index (CII) scores with country ETF / stock
 * index performance to:
 * 1. Validate CII signals (rising CII + falling ETF = confirmed risk)
 * 2. Detect false positives (rising CII but market calm = news noise?)
 * 3. Detect blind spots (market dropping but CII low = missed instability?)
 *
 * Uses iShares/Vanguard country ETFs and local stock indices as proxies.
 */

import type { CountryScore } from './country-instability';
import { MarketServiceClient } from '@/generated/client/worldmonitor/market/v1/service_client';
import type { EtfFlow, GetCountryStockIndexResponse } from '@/generated/client/worldmonitor/market/v1/service_client';

// Country → iShares / major ETF ticker mapping
const COUNTRY_ETF_MAP: Record<string, string> = {
  US: 'SPY', CN: 'FXI', JP: 'EWJ', KR: 'EWY', TW: 'EWT',
  IN: 'INDA', BR: 'EWZ', MX: 'EWW', ZA: 'EZA', AU: 'EWA',
  DE: 'EWG', FR: 'EWQ', GB: 'EWU', IT: 'EWI', ES: 'EWP',
  TR: 'TUR', SA: 'KSA', IL: 'EIS', PL: 'EPOL', TH: 'THD',
  ID: 'EIDO', PH: 'EPHE', QA: 'QAT', AE: 'UAE', EG: 'EGPT',
  CO: 'GXG', AR: 'ARGT', VN: 'VNM', CA: 'EWC', NO: 'ENOR',
  SE: 'EWD', FI: 'EFNL', GR: 'GREK', RO: 'GUR',
  // Conflict / frontier — no liquid ETFs, skip
};

export type CrosscheckVerdict =
  | 'confirmed'       // CII rising + market falling → instability confirmed
  | 'market_leading'  // Market falling but CII stable → market sees risk first
  | 'noise'           // CII rising but market calm → possible news noise
  | 'stable'          // Both calm → no signal
  | 'recovery'        // CII falling + market rising → recovery confirmed
  | 'no_data';        // No market data available

export interface CountryCrosscheck {
  code: string;
  name: string;
  ciiScore: number;
  ciiLevel: CountryScore['level'];
  ciiTrend: CountryScore['trend'];
  etfTicker: string | null;
  etfPriceChange: number | null;  // % change
  indexSymbol: string | null;
  indexWeekChange: number | null;  // % weekly change
  verdict: CrosscheckVerdict;
  divergenceScore: number;        // 0-100, higher = bigger divergence
}

export interface CrosscheckSummary {
  timestamp: Date;
  countries: CountryCrosscheck[];
  confirmedCount: number;
  noiseCount: number;
  marketLeadingCount: number;
  correlation: number | null;  // Pearson correlation CII vs market
}

/**
 * Run cross-validation between CII scores and market data.
 * Returns per-country verdicts and an overall correlation metric.
 */
export async function runCrosscheck(
  ciiScores: CountryScore[],
): Promise<CrosscheckSummary> {
  const client = new MarketServiceClient('', { fetch: (...args) => globalThis.fetch(...args) });

  // Fetch ETF flows and country indices in parallel
  const [etfResult, indexResults] = await Promise.allSettled([
    fetchEtfFlows(client),
    fetchCountryIndices(client, ciiScores.map(s => s.code)),
  ]);

  const etfMap = etfResult.status === 'fulfilled' ? etfResult.value : new Map<string, EtfFlow>();
  const indexMap = indexResult(indexResults);

  const countries: CountryCrosscheck[] = [];

  for (const score of ciiScores) {
    const etfTicker = COUNTRY_ETF_MAP[score.code] ?? null;
    const etf = etfTicker ? etfMap.get(etfTicker.toUpperCase()) : null;
    const idx = indexMap.get(score.code);

    const etfChange = etf?.priceChange ?? null;
    const idxChange = idx?.weekChangePercent ?? null;

    // Use ETF change if available, fall back to index
    const marketSignal = etfChange ?? idxChange;

    const verdict = computeVerdict(score, marketSignal);
    const divergenceScore = computeDivergence(score, marketSignal);

    countries.push({
      code: score.code,
      name: score.name,
      ciiScore: score.score,
      ciiLevel: score.level,
      ciiTrend: score.trend,
      etfTicker,
      etfPriceChange: etfChange,
      indexSymbol: idx?.symbol ?? null,
      indexWeekChange: idxChange,
      verdict,
      divergenceScore,
    });
  }

  // Compute Pearson correlation between CII and market change
  const paired = countries.filter(c => (c.etfPriceChange ?? c.indexWeekChange) !== null);
  const correlation = paired.length >= 5 ? pearsonCorrelation(
    paired.map(c => c.ciiScore),
    paired.map(c => -(c.etfPriceChange ?? c.indexWeekChange!)),  // Negate: rising CII should correlate with falling market
  ) : null;

  return {
    timestamp: new Date(),
    countries,
    confirmedCount: countries.filter(c => c.verdict === 'confirmed').length,
    noiseCount: countries.filter(c => c.verdict === 'noise').length,
    marketLeadingCount: countries.filter(c => c.verdict === 'market_leading').length,
    correlation,
  };
}

async function fetchEtfFlows(client: MarketServiceClient): Promise<Map<string, EtfFlow>> {
  try {
    const data = await client.listEtfFlows({});
    const map = new Map<string, EtfFlow>();
    for (const etf of data.etfs) {
      map.set(etf.ticker.toUpperCase(), etf);
    }
    return map;
  } catch {
    return new Map();
  }
}

async function fetchCountryIndices(
  client: MarketServiceClient,
  codes: string[],
): Promise<Map<string, GetCountryStockIndexResponse>> {
  const map = new Map<string, GetCountryStockIndexResponse>();
  // Fetch up to 10 concurrently to avoid overwhelming the API
  const BATCH_SIZE = 10;
  for (let i = 0; i < codes.length; i += BATCH_SIZE) {
    const batch = codes.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(code => client.getCountryStockIndex({ countryCode: code })),
    );
    results.forEach((result, idx) => {
      const code = batch[idx];
      if (code && result.status === 'fulfilled' && result.value.available) {
        map.set(code, result.value);
      }
    });
  }
  return map;
}

function indexResult(
  result: PromiseSettledResult<Map<string, GetCountryStockIndexResponse>>,
): Map<string, GetCountryStockIndexResponse> {
  return result.status === 'fulfilled' ? result.value : new Map();
}

function computeVerdict(score: CountryScore, marketChange: number | null): CrosscheckVerdict {
  if (marketChange === null) return 'no_data';

  const ciiHigh = score.score >= 51;
  const ciiRising = score.trend === 'rising';
  const ciiFalling = score.trend === 'falling';
  const marketDown = marketChange < -1.5;  // Significant drop
  const marketUp = marketChange > 1.0;
  const marketCalm = Math.abs(marketChange) <= 1.5;

  // CII rising + market dropping → confirmed instability
  if ((ciiHigh || ciiRising) && marketDown) return 'confirmed';

  // Market dropping but CII not elevated → market leading indicator
  if (marketDown && !ciiHigh && !ciiRising) return 'market_leading';

  // CII rising but market calm → possible news noise
  if (ciiRising && marketCalm) return 'noise';

  // CII falling + market rising → recovery
  if (ciiFalling && marketUp) return 'recovery';

  return 'stable';
}

function computeDivergence(score: CountryScore, marketChange: number | null): number {
  if (marketChange === null) return 0;

  // Normalize CII to -1..1 range (50 = neutral, 100 = max risk, 0 = min risk)
  const ciiNorm = (score.score - 50) / 50;

  // Normalize market change to -1..1 range (±5% = ±1)
  const marketNorm = Math.max(-1, Math.min(1, marketChange / 5));

  // Divergence: CII rising + market rising (or vice versa) = high divergence
  // CII rising + market falling = agreement (low divergence)
  // Agreement means same sign when we negate market (rising CII + falling market)
  const divergence = (ciiNorm + marketNorm);  // Same sign = diverging signals

  return Math.round(Math.abs(divergence) * 50);
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 2) return 0;

  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const meanY = y.reduce((s, v) => s + v, 0) / n;

  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = (x[i] ?? 0) - meanX;
    const dy = (y[i] ?? 0) - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : Math.round((num / den) * 100) / 100;
}
