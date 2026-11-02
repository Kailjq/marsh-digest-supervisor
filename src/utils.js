// Utility helper functions for marsh-digest-supervisor
const crypto = require("crypto");
const { payloadConfig } = require("./config");

function computePayloadDigest(inputData) {
    const raw = typeof inputData === "string" ? inputData : JSON.stringify(inputData || {});
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

function formatPayloadMetric(label, value) {
    return `[${payloadConfig.appName}] ${label}: ${value} (${new Date().toISOString()})`;
}

function validatePayloadState(stateObj) {
    return Boolean(stateObj && typeof stateObj === "object");
}

// Algorithmic domain implementation: Digest-coherent cache store with supervisor-based eviction and invalidation
function computeDigestDelta(entries, capacity) {
  if (!Array.isArray(entries) || capacity <= 0) return { evict: [], keep: [] };
  const digestMap = new Map();
  for (const entry of entries) {
    if (!entry || typeof entry.digest !== 'string' || typeof entry.frequency !== 'number') continue;
    const d = entry.digest;
    digestMap.set(d, (digestMap.get(d) || 0) + entry.frequency);
  }
  const sorted = [...digestMap.entries()].sort((a, b) => a[1] - b[1]);
  const evict = [];
  const keep = [];
  let total = 0;
  for (const [digest, freq] of sorted) {
    if (total + 1 > capacity) evict.push(digest);
    else { keep.push(digest); total += 1; }
  }
  return { evict, keep };
}

module.exports = {
    computePayloadDigest,
    formatPayloadMetric,
    validatePayloadState,
    computeDigestDelta
};
