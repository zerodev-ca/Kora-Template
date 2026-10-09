import { Pages } from "#kora/modules";

export class TemplatePage extends Pages {
    constructor(kora) {
        super(kora, {
            name: "template",
            label: "Template Items",
            description: "View and manage registered template items.",
            icon: "box",
            group: "Modules",
            order: 1,
            component: "template",
            audience: "staff",
            permission: "template.view",
            config: {
                endpoint: "/items"
            }
        });
    }

    async load({ client }) {
        try {
            const items = await client.send("GET", "/api/modules/template/items");
            return {
                available: true,
                data: {
                    items: Array.isArray(items) ? items : []
                }
            };
        } catch {
            return {
                available: true,
                data: {
                    items: []
                }
            };
        }
    }
}
