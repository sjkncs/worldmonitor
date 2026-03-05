/**
 * Verify CII data completeness — all TIER1_COUNTRIES must have
 * matching entries in COUNTRY_KEYWORDS, BASELINE_RISK, EVENT_MULTIPLIER,
 * ISO3_TO_ISO2, COUNTRY_BOUNDS, and the adaptive weights function.
 */
import { readFileSync } from 'fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const countriesSrc = readFileSync('src/config/countries.ts', 'utf8');
const ciiSrc = readFileSync('src/services/country-instability.ts', 'utf8');

// Extract TIER1 country codes from countries.ts (format: "US:" or "'US':")
const tier1Codes = [...countriesSrc.matchAll(/\b([A-Z]{2}):\s*'/g)].map(m => m[1]);

// Extract codes from each CII data table (keys can be quoted or unquoted)
function extractCodes(tableName) {
  const tableRegex = new RegExp(`const ${tableName}[\\s\\S]*?= \\{([\\s\\S]*?)\\};`);
  const match = ciiSrc.match(tableRegex);
  if (!match) return [];
  return [...match[1].matchAll(/\b([A-Z]{2}):/g)].map(m => m[1]);
}

const keywordCodes = extractCodes('COUNTRY_KEYWORDS');
const baselineCodes = extractCodes('BASELINE_RISK');
const multiplierCodes = extractCodes('EVENT_MULTIPLIER');
const boundsCodes = extractCodes('COUNTRY_BOUNDS');

test('TIER1_COUNTRIES has 54 entries', () => {
  assert.equal(tier1Codes.length, 54, `Expected 54, got ${tier1Codes.length}: ${tier1Codes.join(',')}`);
});

test('All TIER1 countries have COUNTRY_KEYWORDS', () => {
  const missing = tier1Codes.filter(c => !keywordCodes.includes(c));
  assert.equal(missing.length, 0, `Missing COUNTRY_KEYWORDS for: ${missing.join(', ')}`);
});

test('All TIER1 countries have BASELINE_RISK', () => {
  const missing = tier1Codes.filter(c => !baselineCodes.includes(c));
  assert.equal(missing.length, 0, `Missing BASELINE_RISK for: ${missing.join(', ')}`);
});

test('All TIER1 countries have EVENT_MULTIPLIER', () => {
  const missing = tier1Codes.filter(c => !multiplierCodes.includes(c));
  assert.equal(missing.length, 0, `Missing EVENT_MULTIPLIER for: ${missing.join(', ')}`);
});

test('All TIER1 countries have COUNTRY_BOUNDS', () => {
  const missing = tier1Codes.filter(c => !boundsCodes.includes(c));
  assert.equal(missing.length, 0, `Missing COUNTRY_BOUNDS for: ${missing.join(', ')}`);
});

test('getAdaptiveWeights function exists', () => {
  assert.ok(ciiSrc.includes('function getAdaptiveWeights'), 'getAdaptiveWeights not found');
});

test('getAdaptiveWeights is used in calculateCII', () => {
  assert.ok(ciiSrc.includes('getAdaptiveWeights(code)'), 'getAdaptiveWeights not called in score calc');
});

test('RefreshScheduler exports runGuarded', () => {
  const schedulerSrc = readFileSync('src/services/refresh-scheduler.ts', 'utf8');
  assert.ok(schedulerSrc.includes('async runGuarded('), 'runGuarded method not found');
});

test('App.ts uses scheduler.runGuarded (no standalone inFlight)', () => {
  const appSrc = readFileSync('src/App.ts', 'utf8');
  assert.ok(appSrc.includes('this.scheduler.runGuarded'), 'scheduler.runGuarded not used in App.ts');
  assert.ok(!appSrc.includes('private inFlight'), 'Standalone inFlight set should be removed');
});

test('cii-market-crosscheck exports runCrosscheck', () => {
  const crossSrc = readFileSync('src/services/cii-market-crosscheck.ts', 'utf8');
  assert.ok(crossSrc.includes('export async function runCrosscheck'), 'runCrosscheck not exported');
});

test('YouTube availability service exports isYouTubeAvailable', () => {
  const ytSrc = readFileSync('src/services/youtube-availability.ts', 'utf8');
  assert.ok(ytSrc.includes('export async function isYouTubeAvailable'), 'isYouTubeAvailable not exported');
});

test('API health endpoint uses edge runtime', () => {
  const healthSrc = readFileSync('api/health.js', 'utf8');
  assert.ok(healthSrc.includes("runtime: 'edge'"), 'Health endpoint missing edge runtime config');
});

test('API rate limiter fails open on Redis error', () => {
  const rlSrc = readFileSync('api/_rate-limit.js', 'utf8');
  assert.ok(rlSrc.includes('limited: false, remaining: maxRequests'), 'Rate limiter should fail open');
});

test('RSS proxy has SSRF validation', () => {
  const rssSrc = readFileSync('api/rss-proxy.js', 'utf8');
  assert.ok(rssSrc.includes('validateFeedUrl'), 'SSRF validation function not found');
});

test('YouTube embed uses JSON.stringify for XSS defense', () => {
  const embedSrc = readFileSync('api/youtube/embed.js', 'utf8');
  assert.ok(embedSrc.includes('JSON.stringify'), 'JSON.stringify XSS defense not found');
});

console.log('\n--- CII Data Summary ---');
console.log(`TIER1_COUNTRIES: ${tier1Codes.length}`);
console.log(`COUNTRY_KEYWORDS: ${keywordCodes.length}`);
console.log(`BASELINE_RISK: ${baselineCodes.length}`);
console.log(`EVENT_MULTIPLIER: ${multiplierCodes.length}`);
console.log(`COUNTRY_BOUNDS: ${boundsCodes.length}`);
