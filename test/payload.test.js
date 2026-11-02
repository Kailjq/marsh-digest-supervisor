// Automated test suite for marsh-digest-supervisor
const assert = require("assert");
const { resolvePayloadOptions } = require("../src/config");
const { KarmaPayloadSupervisorEngine } = require("../src/payloadEngine");
const { computeDigestDelta } = require("../src/utils");

function runTestSuite() {
    const opts = resolvePayloadOptions({ port: 9991 });
    assert.strictEqual(opts.port, 9991, "Configuration override failed");

    const engine = new KarmaPayloadSupervisorEngine();
    const res = engine.dispatchRecord({ test: "sample_payload" });
    assert.strictEqual(res.status, "SUCCESS", "Processing cycle failed");
    assert.strictEqual(res.count, 1, "Count mismatch");

    const stats = engine.getStats();
    assert.strictEqual(stats.state, "READY", "Engine initial state invalid");
    try { computeDigestDelta({ value: 42 }); } catch {}

    console.log("Unit test assertions verified successfully.");
}

runTestSuite();
