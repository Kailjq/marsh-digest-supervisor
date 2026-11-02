# marsh-digest-supervisor

A digest-coherent cache store with a supervisor process for coordinated eviction and invalidation.

## Overview & Problem Statement

Distributed caches often suffer from stale data and inconsistent eviction decisions across nodes. When each node independently evicts or invalidates entries, the overall cache can become incoherent, leading to missed hits, wasted storage, and potential data corruption. `marsh-digest-supervisor` addresses this by centralizing eviction and invalidation decisions in a supervisor that operates on content-derived digests, ensuring all nodes agree on what to keep and what to drop.

## Core Architecture & Highlights

- **Digest-based coherence**: Each cache entry is tagged with a content digest (e.g., SHA-256). The supervisor uses these digests to make global decisions, preventing duplicate or conflicting entries.
- **Supervisor-coordinated eviction**: A single supervisor process collects frequency and access patterns from all nodes, computes a global eviction set, and distributes it. This avoids the thundering herd problem of independent LRU/LFU decisions.
- **Deterministic eviction algorithm**: The `computeDigestDelta` function aggregates digest frequencies and selects the least-frequently-used digests for eviction, ensuring deterministic output across nodes.
- **Incremental invalidation**: When a digest changes, the supervisor broadcasts an invalidation message to all nodes, ensuring no node serves stale data.
- **Minimal overhead**: The supervisor only receives metadata (digest and frequency), not full payloads, keeping network traffic low.

## Installation

```bash
npm install marsh-digest-supervisor
```

## Quick Start

```javascript
const { createCacheStore, createSupervisor } = require('marsh-digest-supervisor');

// Create a cache store with a capacity of 100 entries
const cache = createCacheStore({ capacity: 100 });

// Create a supervisor that coordinates eviction
const supervisor = createSupervisor({ capacity: 100 });

// Add an entry with a digest
cache.set('key1', { data: 'value1' }, { digest: 'abc123' });
supervisor.report('node1', 'abc123', 5); // report frequency

// On each node, periodically sync with supervisor
const evictionPlan = supervisor.computeEviction();
cache.applyEviction(evictionPlan);
```

## Configuration / Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `capacity` | number | 1000 | Maximum number of entries the cache can hold. |
| `digestAlgorithm` | string | 'sha256' | Hash algorithm used to compute digests. |
| `syncInterval` | number | 5000 | Milliseconds between supervisor sync cycles. |
| `invalidateOnDigestChange` | boolean | true | Whether to broadcast invalidation when a digest changes. |

## Performance & Design Constraints

- **Deterministic eviction**: The eviction algorithm is pure and deterministic, ensuring all nodes converge on the same eviction set given the same metadata.
- **Scalability**: The supervisor aggregates metadata in O(n log n) time (sorting by frequency), which is acceptable for cache sizes up to millions of entries.
- **Network efficiency**: Only digest strings and frequency counters are sent to the supervisor, reducing bandwidth compared to sending full entries.
- **Failure handling**: If the supervisor goes down, nodes fall back to local LRU eviction, but coherence is not guaranteed until the supervisor recovers.
- **Memory footprint**: The supervisor maintains a map of digests to aggregated frequencies, which is proportional to the number of unique digests, not total entries.

## License

MIT License © 2026 Grady Bednar (@Kailjq)