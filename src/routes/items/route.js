import { Routes } from "#kora/modules";

export class ItemsRoute extends Routes {
    constructor(kora) {
        super(kora, {
            name: "items",
            path: "/items",
            access: "private",
            permissions: {
                GET: "template.view",
                POST: "template.manage",
                DELETE: "template.manage"
            }
        });
    }

    async GET(request, response) {
        this.require(request, "template.view");
        const handler = this.kora.modules.handlers.get(this.module, "items");
        return handler.list();
    }

    async POST(request, response) {
        this.require(request, "template.manage");
        const handler = this.kora.modules.handlers.get(this.module, "items");
        const { identifier, name, category, quantity, price, active } = request.body;
        const created = await handler.create(identifier, name, { category, quantity, price, active });
        await this.audit(request, "template.items.create", identifier, { name, price });
        return created;
    }

    async DELETE(request, response) {
        this.require(request, "template.manage");
        const handler = this.kora.modules.handlers.get(this.module, "items");
        const identifier = String(request.query.identifier);
        await handler.delete(identifier);
        await this.audit(request, "template.items.delete", identifier);
        return { success: true };
    }
}
