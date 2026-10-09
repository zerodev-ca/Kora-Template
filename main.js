import { Modules } from "#kora/modules";

export class TemplateModule extends Modules {
    constructor(kora) {
        super(kora, {
            name: "template",
            displayName: "Template Module",
            author: "Zero Development",
            version: "1.0.0.0",
            description: "Official module template for creating custom Kora modules.",
            icon: "box",
            requires: ["core"]
        });
    }

    async onStartup() {
        this.kora.console.log(this.kora.console.levels.startup, `${this.getName()} module loaded successfully.`);
    }

    async onShutdown() {
        this.kora.console.log(this.kora.console.levels.info, `${this.getName()} module shut down.`);
    }
}
