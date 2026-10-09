import { Configs } from "#kora/modules";

export class SettingsConfig extends Configs {
    constructor(kora) {
        super(kora, {
            name: "settings",
            label: "Template Settings",
            description: "Manage core module settings and operational options."
        });
    }

    schema() {
        return {
            enabled: {
                type: "boolean",
                label: "Module Enabled",
                default: true
            },
            prefix: {
                type: "string",
                label: "Resource Prefix",
                default: "item-"
            },
            notice: {
                type: "text",
                label: "Welcome Notice Text",
                default: "Welcome to the template module workspace. Manage your resources below."
            },
            secret_key: {
                type: "secret",
                label: "Integration Secret Key",
                default: ""
            },
            max_items: {
                type: "number",
                label: "Max Items Per Account",
                default: 25
            },
            operation_mode: {
                type: "select",
                label: "Operation Mode",
                default: "standard",
                options: [
                    { value: "standard", label: "Standard Mode" },
                    { value: "advanced", label: "Advanced Mode" },
                    { value: "restricted", label: "Restricted Mode" }
                ]
            },
            allowed_tags: {
                type: "multiselect",
                label: "Allowed Categories",
                default: ["bundles", "membership"],
                options: [
                    { value: "bundles", label: "Bundles" },
                    { value: "membership", label: "Membership" },
                    { value: "cosmetics", label: "Cosmetics" },
                    { value: "boosters", label: "Boosters" }
                ]
            },
            tags: {
                type: "tags",
                label: "Search Keywords",
                default: ["template", "starter", "demo"]
            },
            theme_color: {
                type: "color",
                label: "Theme Accent Color",
                default: "#22c55e"
            },
            sync_interval: {
                type: "number",
                label: "Sync Interval",
                default: 15,
                unit: "sync_unit"
            },
            sync_unit: {
                type: "select",
                label: "Interval Unit",
                default: "minutes",
                options: [
                    { value: "minutes", label: "Minutes" },
                    { value: "hours", label: "Hours" },
                    { value: "days", label: "Days" }
                ]
            },
            categories: {
                type: "list",
                label: "Resource Categories",
                default: [
                    {
                        identifier: "bundles",
                        label: "Bundles",
                        active: true,
                        quota: 50
                    },
                    {
                        identifier: "membership",
                        label: "Membership",
                        active: true,
                        quota: 100
                    }
                ],
                item: {
                    identifier: {
                        type: "string",
                        label: "Category ID",
                        default: ""
                    },
                    label: {
                        type: "string",
                        label: "Display Label",
                        default: ""
                    },
                    active: {
                        type: "boolean",
                        label: "Active State",
                        default: true
                    },
                    quota: {
                        type: "number",
                        label: "Quota Limit",
                        default: 10
                    }
                }
            }
        };
    }
}
