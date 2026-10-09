import { Clocks } from "#kora/modules";

export class CleanupClock extends Clocks {
    constructor(kora) {
        super(kora, {
            name: "cleanup",
            schedule: "0 0 * * *"
        });
    }

    async run() {
        const handler = this.kora.modules.handlers.get(this.module, "items");
        if (!handler) return;

        this.kora.console.log(this.kora.console.levels.info, `[${this.module}] Running scheduled template item cleanup.`);
        await handler.purge();
    }
}
