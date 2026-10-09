import { useState, useMemo } from "react";
import {
    Search,
    Plus,
    Trash2,
    Edit,
    Box,
    Layers,
    Activity,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { useT } from "@/components/i18nProvider";

type ItemRecord = {
    identifier: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    active: boolean;
};

const DEFAULT_ITEMS: ItemRecord[] = [
    {
        identifier: "item_starter_bundle",
        name: "Starter Bundle",
        category: "bundles",
        quantity: 50,
        price: 9.99,
        active: true
    },
    {
        identifier: "item_vip_pass",
        name: "VIP Membership",
        category: "membership",
        quantity: 120,
        price: 19.99,
        active: true
    },
    {
        identifier: "item_extended_limits",
        name: "Extended License Limits",
        category: "addons",
        quantity: 15,
        price: 49.00,
        active: false
    },
    {
        identifier: "item_priority_support",
        name: "Priority Support SLA",
        category: "addons",
        quantity: 80,
        price: 25.00,
        active: true
    }
];

const CATEGORY_OPTIONS = [
    { value: "all", label: "All Categories" },
    { value: "bundles", label: "Bundles" },
    { value: "membership", label: "Membership" },
    { value: "addons", label: "Addons" }
];

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "disabled", label: "Disabled" }
];

const SORT_OPTIONS = [
    { value: "name", label: "Sort by Name" },
    { value: "quantity", label: "Sort by Stock" },
    { value: "price", label: "Sort by Price" }
];

export default function TemplateView({ data, revalidate }: { data: any; revalidate?: () => void }) {
    const { t } = useT();
    const [items, setItems] = useState<ItemRecord[]>(
        data && Array.isArray(data.items) && data.items.length > 0 ? data.items : DEFAULT_ITEMS
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ItemRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ItemRecord | null>(null);

    const [formIdentifier, setFormIdentifier] = useState("");
    const [formName, setFormName] = useState("");
    const [formCategory, setFormCategory] = useState("bundles");
    const [formQuantity, setFormQuantity] = useState(1);
    const [formPrice, setFormPrice] = useState(0);

    const filteredItems = useMemo(() => {
        return items
            .filter(item => {
                const matchesSearch =
                    searchQuery.trim() === "" ||
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.identifier.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

                const matchesStatus =
                    selectedStatus === "all" ||
                    (selectedStatus === "active" && item.active) ||
                    (selectedStatus === "disabled" && !item.active);

                return matchesSearch && matchesCategory && matchesStatus;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price":
                        return b.price - a.price;
                    case "quantity":
                        return b.quantity - a.quantity;
                    case "name":
                    default:
                        return a.name.localeCompare(b.name);
                }
            });
    }, [items, searchQuery, selectedCategory, selectedStatus, sortBy]);

    const activeCount = useMemo(() => items.filter(item => item.active).length, [items]);
    const totalInventoryValue = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

    function openCreateModal() {
        setEditingItem(null);
        setFormIdentifier(`item_${Date.now().toString().slice(-4)}`);
        setFormName("");
        setFormCategory("bundles");
        setFormQuantity(10);
        setFormPrice(9.99);
        setModalOpen(true);
    }

    function openEditModal(item: ItemRecord) {
        setEditingItem(item);
        setFormIdentifier(item.identifier);
        setFormName(item.name);
        setFormCategory(item.category);
        setFormQuantity(item.quantity);
        setFormPrice(item.price);
        setModalOpen(true);
    }

    function handleSave() {
        if (!formName.trim()) {
            toast({ title: "Validation Error", description: "Name is required.", variant: "destructive" });
            return;
        }

        if (editingItem) {
            setItems(prev =>
                prev.map(item =>
                    item.identifier === editingItem.identifier
                        ? { ...item, name: formName, category: formCategory, quantity: formQuantity, price: formPrice }
                        : item
                )
            );
            toast({ title: "Updated", description: `Item "${formName}" was updated.` });
        } else {
            const newItem: ItemRecord = {
                identifier: formIdentifier.trim(),
                name: formName.trim(),
                category: formCategory,
                quantity: formQuantity,
                price: formPrice,
                active: true
            };
            setItems(prev => [newItem, ...prev]);
            toast({ title: "Created", description: `Item "${formName}" was created.` });
        }

        setModalOpen(false);
        if (revalidate) revalidate();
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        setItems(prev => prev.filter(item => item.identifier !== deleteTarget.identifier));
        toast({ title: "Deleted", description: `Item "${deleteTarget.name}" was removed.` });
        setDeleteTarget(null);
        if (revalidate) revalidate();
    }

    function toggleStatus(identifier: string) {
        setItems(prev =>
            prev.map(item =>
                item.identifier === identifier ? { ...item, active: !item.active } : item
            )
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Template Manager</h1>
                    <p className="text-sm text-muted-foreground">Manage inventory items, licensed bundles, and operational parameters.</p>
                </div>
                <Button onClick={openCreateModal} className="h-9 gap-1.5 px-3">
                    <Plus className="size-4" />
                    <span>Create Item</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="p-4">
                    <CardContent className="flex items-center gap-3 p-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-foreground">
                            <Box className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Items</span>
                            <span className="text-xl font-semibold tracking-tight">{items.length}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-4">
                    <CardContent className="flex items-center gap-3 p-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Status</span>
                            <span className="text-xl font-semibold tracking-tight">{activeCount} / {items.length}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-4">
                    <CardContent className="flex items-center gap-3 p-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-primary/10 text-primary">
                            <Activity className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inventory Value</span>
                            <span className="text-xl font-semibold tracking-tight">${totalInventoryValue.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or identifier..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="h-9 pl-9 text-sm"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="w-36">
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                                options={CATEGORY_OPTIONS}
                            />
                        </div>
                        <div className="w-32">
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                                options={STATUS_OPTIONS}
                            />
                        </div>
                        <div className="w-40">
                            <Select
                                value={sortBy}
                                onValueChange={setSortBy}
                                options={SORT_OPTIONS}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3">Identifier</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        No items found matching the current criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item.identifier} className="hover:bg-muted/20">
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.identifier}</td>
                                        <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                                        <td className="px-4 py-3">
                                            <Badge className="bg-muted text-muted-foreground font-normal capitalize">{item.category}</Badge>
                                        </td>
                                        <td className="px-4 py-3">{item.quantity}</td>
                                        <td className="px-4 py-3 font-medium">${item.price.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(item.identifier)}
                                                className="cursor-pointer"
                                            >
                                                <Badge className={item.active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}>
                                                    {item.active ? "Active" : "Disabled"}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    size="icon-sm"
                                                    variant="ghost"
                                                    onClick={() => openEditModal(item)}
                                                >
                                                    <Edit className="size-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon-sm"
                                                    variant="destructive"
                                                    onClick={() => setDeleteTarget(item)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingItem ? "Edit Item" : "Create Item"}
                description="Configure the properties of this licensed template resource."
            >
                <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Identifier</label>
                        <Input
                            value={formIdentifier}
                            onChange={e => setFormIdentifier(e.target.value)}
                            disabled={Boolean(editingItem)}
                            className="h-9 font-mono text-xs"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Name</label>
                        <Input
                            value={formName}
                            onChange={e => setFormName(e.target.value)}
                            placeholder="e.g. Starter Bundle"
                            className="h-9"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Category</label>
                            <Select
                                value={formCategory}
                                onValueChange={setFormCategory}
                                options={CATEGORY_OPTIONS.filter(o => o.value !== "all")}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Stock Quantity</label>
                            <Input
                                type="number"
                                value={formQuantity}
                                onChange={e => setFormQuantity(Number(e.target.value))}
                                className="h-9"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Price (USD)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formPrice}
                            onChange={e => setFormPrice(Number(e.target.value))}
                            className="h-9"
                        />
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setModalOpen(false)} className="h-9 px-4">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="h-9 px-4">
                            Save Item
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                title="Delete Item"
                description={`Are you sure you want to delete "${deleteTarget ? deleteTarget.name : ""}"? This action cannot be undone.`}
            >
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="h-9 px-4">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete} className="h-9 px-4">
                        Confirm Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
