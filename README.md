# Kora Module Template

The official module starter template for [Kora](https://zerodev.ca), developed by Zero Development.

This repository provides a production-ready, batteries-included template for building custom Kora modules. It demonstrates every subsystem, including database models, HTTP API routes, background clocks, runtime events, schema-driven configuration, multi-language localization, and bespoke React dashboard views.

---

## Getting Started

### 1. Clone into Kora

Clone this repository directly into your Kora `modules/` folder or as an isolated git worktree:

```bash
git clone https://github.com/zerodev-ca/Kora-Template modules/my-module
cd modules/my-module
```

Or when developing with git worktrees:

```bash
git worktree add modules/my-module -b module/my-module
```

### 2. Rename the Module

1. **`main.js`**: Update the `name` passed to `super()` to match your lowercase folder name, and set a readable `displayName`.
2. **`resources/lang/*/common.json`**: Update `"module.<name>.name"` across all 16 locales with your display name.
3. **Subsystems**: Rename classes, models, and tables to fit your feature domain.

---

## Directory Layout

```text
modules/my-module/
├── main.js                      # Module entrypoint extending Modules
├── README.md                    # Developer guide
├── resources/
│   ├── config/                  # Dashboard configuration schemas (Configs)
│   │   └── settings.js          # Supported field types, sections, conditions, and units
│   ├── dashboard/               # Custom dashboard views and pages
│   │   └── pages/
│   │       └── template/
│   │           ├── page.js      # Page manifest class extending Pages
│   │           └── view.tsx     # Rich React client component with Mantine/Tailwind UI
│   └── lang/                    # Multilingual dictionaries for all 16 locales
│       ├── en/
│       │   ├── common.json      # Capitalized display name
│       │   └── messages.js      # Phrase schemas extending Langs
│       └── ... (15 other language folders)
└── src/
    ├── clocks/                  # Scheduled background cron jobs (Clocks)
    │   └── cleanup.js
    ├── events/                  # System and custom event listeners (Events)
    │   └── licenseCreated.js
    ├── handlers/                # Core business logic and model calls (Handlers)
    │   └── Items.js
    ├── models/                  # SQL database tables managed by Sequelize (Models)
    │   └── Item.js
    └── routes/                  # HTTP API endpoints (Routes)
        └── items/
            └── route.js
```

---

## Custom Dashboard Components (`resources/dashboard/`)

Modules can provide bespoke React dashboard pages mounted directly inside Kora's web dashboard.

### 1. Page Registration (`page.js`)

```js
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
            return { available: true, data: { items } };
        } catch {
            return { available: true, data: { items: [] } };
        }
    }
}
```

### 2. Client View Component (`view.tsx`)

Bespoke views import official design system components directly from `@/components/ui/*`:

- `Button` (`@/components/ui/button`): Supports variants (`default`, `outline`, `destructive`, `ghost`) and sizes (`sm`, `default`, `lg`, `icon-sm`).
- `Select` (`@/components/ui/select`): Dropdown select menus with value bindings.
- `Input` (`@/components/ui/input`): Text, numeric, and search inputs.
- `Switch` (`@/components/ui/switch`): Boolean toggles.
- `Badge` (`@/components/ui/badge`): Semantic status tags.
- `Card`, `CardContent` (`@/components/ui/card`): Containers for metrics, lists, and forms.
- `Modal` (`@/components/ui/modal`): Accessible modal dialogs with form controls and paired actions.

---

## Supported Configuration Field Types

The `resources/config/settings.js` file demonstrates the configuration field types supported by Kora:

1. `boolean`: Switch toggle.
2. `string`: Single-line text input.
3. `text`: Multi-line textarea.
4. `secret`: Password input with eye visibility toggle.
5. `number`: Numeric input with step controls.
6. `select`: Dropdown select menu with options array.
7. `multiselect`: Multi-item dropdown tags.
8. `tags`: Dynamic keyword chip builder.
9. `color`: Hex color picker control.
10. `list`: Dynamic repeater list containing nested schema definitions.

---

## Documentation

Full developer documentation and architecture specifications are available at:
[https://zerodev.ca/docs/kora/developer-documentation](https://zerodev.ca/docs/kora/developer-documentation)
