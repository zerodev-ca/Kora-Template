import { Models } from "#kora/modules";

export class ItemModel extends Models {
    constructor(kora) {
        super(kora, {
            name: "template_items",
            dynamic: false,
            search: ["name", "identifier"],
            filters: ["active", "category"]
        });
    }

    schema() {
        return {
            identifier: { type: "string", required: true, unique: true },
            name: { type: "string", required: true },
            category: { type: "string", default: "bundles" },
            description: { type: "text" },
            quantity: { type: "integer", default: 1 },
            price: { type: "float", default: 0.0 },
            active: { type: "boolean", default: true },
            metadata: { type: "json" },
            expires_at: { type: "date" }
        };
    }
}
