import { Langs } from "#kora/modules";

export class MessagesLang extends Langs {
    constructor(kora) {
        super(kora, {
            name: "messages",
            label: "Template Messages",
            description: "Phrases and response messages used by the template module."
        });
    }

    schema() {
        return {
            created: {
                type: "phrase",
                label: "Item Created",
                default: "Template item \"%name%\" created successfully."
            },
            deleted: {
                type: "phrase",
                label: "Item Deleted",
                default: "Template item \"%identifier%\" removed."
            },
            not_found: {
                type: "phrase",
                label: "Item Not Found",
                default: "Template item \"%identifier%\" could not be found."
            }
        };
    }
}
