// Configuration for marsh-digest-supervisor
const os = require("os");
const path = require("path");
try {
    const dotenv = require("dotenv");
    dotenv.config({ silent: true });
} catch {}

const payloadConfig = {
    appName: "marsh-digest-supervisor",
    environment: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "4251", 10),
    timeoutMs: 29830,
    maxBufferItems: 67,
    concurrency: os.cpus().length,
    baseDir: path.resolve(__dirname, "..")
};

function resolvePayloadOptions(overrides = {}) {
    return Object.assign({}, payloadConfig, overrides);
}

module.exports = {
    payloadConfig,
    resolvePayloadOptions
};
