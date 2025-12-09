import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Category {
    id: string;
    name: string;
    slug?: string;
    display_order: number;
    created_at: string;
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, Loader2, ChevronRight, GripVertical } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

// Interfaces
interface Category {
    id: string;
    name: string;
    slug?: string;
    display_order: number;
    families: Family[];
}

interface Family {
    id: string;
    category_id: string;
    name: string;
    slug?: string;
    display_order: number;
    subfamilies: Subfamily[];
}

interface Subfamily {
    id: string;
    family_id: string;
    name: string; // This corresponds to 'name' in table/json which might be description or name
    description?: string;
    is_consumable: boolean;
    display_order: number;
}

// Types for editing
type ItemType = "category" | "family" | "subfamily";

interface EditItem {
    type: ItemType;
    id?: string;
    parentId?: string; // category_id for family, family_id for subfamily
    name: string;
    description?: string;
    is_consumable?: boolean;
    display_order: number;
}

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState<EditItem | null>(null);
    const [saving, setSaving] = useState(false);

    // Delete States
    const [deleteData, setDeleteData] = useState<{ type: ItemType; id: string } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Categories
            const { data: cats, error: catError } = await supabase
                .from("categories")
                .select("*")
                .order("display_order");

            if (catError) throw catError;

            // Fetch Families
            const { data: fams, error: famError } = await supabase
                .from("families")
                .select("*")
                .order("display_order");

            if (famError) throw famError;

            // Fetch Subfamilies
            const { data: subs, error: subError } = await supabase
                .from("subfamilies")
                .select("*")
                .order("display_order");

            if (subError) throw subError;

            // Build Hierarchy
            const hierarchy = cats.map((cat: any) => ({
                ...cat,
                families: fams
                    .filter((f: any) => f.category_id === cat.id)
                    .map((fam: any) => ({
                        ...fam,
                        subfamilies: subs.filter((s: any) => s.family_id === fam.id)
                    }))
            }));

            setCategories(hierarchy);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({
                title: "Erro ao carregar dados",
                description: "Não foi possível carregar a estrutura do catálogo.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (type: ItemType, item?: any, parentId?: string) => {
        if (item) {
            setDialogData({
                type,
                id: item.id,
                parentId: parentId,
                name: type === 'subfamily' ? (item.name || item.description) : item.name, // Subfamily might use description as main name
                description: item.description,
                is_consumable: item.is_consumable,
                display_order: item.display_order
            });
        } else {
            // New Item
            let nextOrder = 0;
            if (type === 'category') nextOrder = categories.length + 1;
            else if (type === 'family') {
                const parentCat = categories.find(c => c.id === parentId);
                nextOrder = (parentCat?.families.length || 0) + 1;
            } else if (type === 'subfamily') {
                // Find family to count subfamilies
                let count = 0;
                categories.forEach(c => c.families.forEach(f => {
                    if (f.id === parentId) count = f.subfamilies.length;
                }));
                nextOrder = count + 1;
            }

            setDialogData({
                type,
                parentId,
                name: "",
                description: "",
                is_consumable: false,
                display_order: nextOrder * 10
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!dialogData || !dialogData.name.trim()) return;

        setSaving(true);
        try {
            const slug = dialogData.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

            if (dialogData.type === "category") {
                const payload: any = {
                    name: dialogData.name,
                    slug: slug,
                    display_order: dialogData.display_order
                };

                if (dialogData.id) {
                    await supabase.from("categories").update(payload).eq("id", dialogData.id);
                } else {
                    await supabase.from("categories").insert(payload);
                }
            } else if (dialogData.type === "family") {
                const payload: any = {
                    category_id: dialogData.parentId,
                    name: dialogData.name,
                    slug: slug,
                    display_order: dialogData.display_order
                };

                if (dialogData.id) {
                    delete payload.category_id; // Don't move parents easily
                    await supabase.from("families").update(payload).eq("id", dialogData.id);
                } else {
                    await supabase.from("families").insert(payload);
                }
            } else if (dialogData.type === "subfamily") {
                const payload: any = {
                    family_id: dialogData.parentId,
                    name: dialogData.name, // Using name column which we renamed/created
                    description: dialogData.description || dialogData.name,
                    is_consumable: dialogData.is_consumable,
                    display_order: dialogData.display_order,
                    slug: slug
                };

                if (dialogData.id) {
                    delete payload.family_id;
                    await supabase.from("subfamilies").update(payload).eq("id", dialogData.id);
                } else {
                    await supabase.from("subfamilies").insert(payload);
                }
            }

            toast({ title: "Salvo com sucesso" });
            setIsDialogOpen(false);
            fetchData();
        } catch (error: any) {
            console.error("Error saving:", error);
            toast({
                title: "Erro ao salvar",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteData) return;

        try {
            const table = deleteData.type === "category" ? "categories" :
                deleteData.type === "family" ? "families" : "subfamilies";

            const { error } = await supabase.from(table).delete().eq("id", deleteData.id);
            if (error) throw error;

            toast({ title: "Item excluído" });
            fetchData();
        } catch (error: any) {
            console.error("Error deleting:", error);
            toast({
                title: "Erro ao excluir",
                description: "Verifique se existem itens dependentes (ex: produtos).",
                variant: "destructive"
            });
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-lm-plum mb-2">
                            Estrutura do Catálogo
                        </h1>
                        <p className="text-lm-ink">Gerencie Categorias, Famílias e Subfamílias</p>
                    </div>
                    <Button onClick={() => handleEdit("category")} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nova Categoria
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Accordion type="multiple" className="w-full space-y-4">
                            {categories.map((category) => (
                                <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4 bg-white shadow-sm">
                                    <div className="flex items-center justify-between py-2">
                                        <AccordionTrigger className="hover:no-underline text-lg font-semibold flex-1">
                                            {category.name} <span className="text-xs text-muted-foreground ml-2 font-normal">({category.families.length} famílias)</span>
                                        </AccordionTrigger>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleEdit("family", undefined, category.id); }}>
                                                <Plus className="w-3 h-3 mr-1" /> Família
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEdit("category", category); }}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); setDeleteData({ type: "category", id: category.id }); }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <AccordionContent className="pb-4">
                                        <div className="pl-4 space-y-2 border-l-2 border-slate-100 ml-2">
                                            {category.families.map((family) => (
                                                <div key={family.id} className="space-y-2">
                                                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md group">
                                                        <div className="flex items-center gap-3 font-medium">
                                                            <div className="w-2 h-2 rounded-full bg-lm-orange/50" />
                                                            {family.name}
                                                            <span className="text-xs text-muted-foreground font-normal">({family.subfamilies.length} subfamílias)</span>
                                                        </div>

                                                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleEdit("subfamily", undefined, family.id)}>
                                                                <Plus className="w-3 h-3 mr-1" /> Subfamília
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit("family", family, category.id)}>
                                                                <Pencil className="w-3 h-3" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeleteData({ type: "family", id: family.id })}>
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Subfamilies List */}
                                                    {family.subfamilies.length > 0 && (
                                                        <div className="pl-6 space-y-1">
                                                            {family.subfamilies.map((sub) => (
                                                                <div key={sub.id} className="flex items-center justify-between py-1 px-2 hover:bg-slate-50 rounded text-sm group/sub">
                                                                    <div className="flex items-center gap-2">
                                                                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                                                        <span>{sub.name}</span>
                                                                        {sub.is_consumable && (
                                                                            <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">
                                                                                Consumível
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/sub:opacity-100 transition-opacity">
                                                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEdit("subfamily", sub, family.id)}>
                                                                            <Pencil className="w-3 h-3" />
                                                                        </Button>
                                                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setDeleteData({ type: "subfamily", id: sub.id })}>
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {category.families.length === 0 && (
                                                <p className="text-sm text-muted-foreground italic px-2">Nenhuma família cadastrada.</p>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {categories.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                Nenhuma categoria encontrada.
                            </div>
                        )}
                    </div>
                )}

                {/* Edit/Create Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {dialogData?.id ? "Editar" : "Nova"} {dialogData?.type === "category" ? "Categoria" : dialogData?.type === "family" ? "Família" : "Subfamília"}
                            </DialogTitle>
                        </DialogHeader>

                        {dialogData && (
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Nome</Label>
                                    <Input
                                        value={dialogData.name}
                                        onChange={(e) => setDialogData({ ...dialogData, name: e.target.value })}
                                        placeholder="Nome do item"
                                    />
                                </div>

                                {dialogData.type === "subfamily" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Descrição (Opcional)</Label>
                                            <Input
                                                value={dialogData.description || ""}
                                                onChange={(e) => setDialogData({ ...dialogData, description: e.target.value })}
                                                placeholder="Descrição técnica"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is_consumable"
                                                checked={dialogData.is_consumable}
                                                onCheckedChange={(c) => setDialogData({ ...dialogData, is_consumable: !!c })}
                                            />
                                            <Label htmlFor="is_consumable">É consumível?</Label>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <Label>Ordem de Exibição</Label>
                                    <Input
                                        type="number"
                                        value={dialogData.display_order}
                                        onChange={(e) => setDialogData({ ...dialogData, display_order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deleteData} onOpenChange={() => setDeleteData(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o item e pode afetar produtos vinculados.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
};

export default Categories;

