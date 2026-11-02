// Main application module for marsh-digest-supervisor
const { KarmaPayloadSupervisorEngine } = require("./payloadEngine");
const { resolvePayloadOptions } = require("./config");

class KarmaPayloadSupervisor {
    constructor(options = {}) {
        this.options = resolvePayloadOptions(options);
        this.engine = new KarmaPayloadSupervisorEngine(this.options);
    }

    dispatch(item) {
        return this.engine.dispatchRecord(item);
    }

    status() {
        return this.engine.getStats();
    }
}

module.exports = {
    KarmaPayloadSupervisor,
    KarmaPayloadSupervisorEngine
};
