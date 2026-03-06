"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Save, Type, ExternalLink, Image as ImageIcon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateBioLink, useUpdateBioLink } from "@/hooks/use-bio-links";
import { z } from "zod";

const formSchema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
    url: z.string().url("A URL deve ser válida"),
    icon: z.string().optional().nullable(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface BioLinkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
}

export function BioLinkModal({ open, onOpenChange, initialData }: BioLinkModalProps) {
    const { mutate: createLink, isPending: isCreating } = useCreateBioLink();
    const { mutate: updateLink, isPending: isUpdating } = useUpdateBioLink();

    const isPending = isCreating || isUpdating;
    const isEditing = !!initialData;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            url: "",
            icon: "",
            order: 0,
            isActive: true,
        },
    });

    const isActive = watch("isActive");

    React.useEffect(() => {
        if (initialData && open) {
            reset({
                title: initialData.title,
                url: initialData.url,
                icon: initialData.icon || "",
                order: initialData.order || 0,
                isActive: initialData.isActive !== false,
            });
        } else if (open) {
            reset({
                title: "",
                url: "",
                icon: "",
                order: 0,
                isActive: true,
            });
        }
    }, [initialData, open, reset]);

    const onSubmit = (data: FormData) => {
        if (isEditing && initialData.id) {
            updateLink(
                { id: initialData.id, data },
                {
                    onSuccess: () => {
                        toast.success("Link atualizado com sucesso!");
                        onOpenChange(false);
                        reset();
                    },
                    onError: () => toast.error("Erro ao atualizar link."),
                }
            );
        } else {
            createLink(data, {
                onSuccess: () => {
                    toast.success("Link criado com sucesso!");
                    onOpenChange(false);
                    reset();
                },
                onError: () => toast.error("Erro ao criar link."),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) reset(); onOpenChange(val); }}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <DialogHeader className="p-8 bg-neutral-900 border-b border-neutral-800 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Link2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                                {isEditing ? "Editar Link" : "Novo Link"}
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                                {isEditing ? "Atualizar link da bio" : "Adicionar novo link para a bio"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                Título do Link
                            </Label>
                            <div className="relative">
                                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    {...register("title")}
                                    placeholder="Ex: Meu WhatsApp"
                                    className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                                />
                            </div>
                            {errors.title && (
                                <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                URL (Link de Destino)
                            </Label>
                            <div className="relative">
                                <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    {...register("url")}
                                    placeholder="https://"
                                    className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                                />
                            </div>
                            {errors.url && (
                                <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">
                                    {errors.url.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                    Ícone (Opcional)
                                </Label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <Input
                                        {...register("icon")}
                                        placeholder="ex: whatsapp, instagram"
                                        className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                    Ordem
                                </Label>
                                <Input
                                    type="number"
                                    {...register("order", { valueAsNumber: true })}
                                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 mt-2">
                            <div className="flex flex-col gap-1">
                                <Label className="text-[10px] font-black uppercase tracking-widest">
                                    Status do Link
                                </Label>
                                <span className="text-[10px] text-neutral-500 font-bold">
                                    Links inativos não aparecem na bio
                                </span>
                            </div>
                            <Switch
                                checked={isActive}
                                onCheckedChange={(checked) => setValue("isActive", checked)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="font-bold uppercase tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 gap-2 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
                        >
                            <Save className="w-4 h-4" />{" "}
                            {isPending ? "Salvando..." : isEditing ? "Salvar Alterações" : "Salvar Link"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
