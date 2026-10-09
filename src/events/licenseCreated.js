import { Events } from "#kora/modules";

export class LicenseCreatedEvent extends Events {
    constructor(kora) {
        super(kora, {
            name: "licenseCreated",
            event: "license.created",
            once: false
        });
    }

    async run(license) {
        this.kora.console.log(this.kora.console.levels.info, `[${this.module}] Observed license creation: ${license.key}`);
    }
}
