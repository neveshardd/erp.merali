"use client";

import {
    Link2,
    MoreHorizontal,
    Pencil,
    Plus,
    Trash2,
    ExternalLink,
    Loader2,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useBioLinks, useDeleteBioLink } from "@/hooks/use-bio-links";
import { BioLinkModal } from "./bio-link-modal";

export default function BioLinksPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedLink, setSelectedLink] = React.useState<any>(null);
    const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

    const { data: links = [], isLoading } = useBioLinks();
    const deleteLink = useDeleteBioLink();

    const handleEdit = (link: any) => {
        setSelectedLink(link);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedLink(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setPendingDeleteId(id);
        setConfirmDeleteOpen(true);
    };

    const executeDelete = async () => {
        if (!pendingDeleteId) return;
        try {
            await deleteLink.mutateAsync(pendingDeleteId);
            toast.success("Link removido com sucesso!");
            setConfirmDeleteOpen(false);
        } catch (_error) {
            toast.error("Erro ao remover link.");
        }
    };

    return (
        <main className="flex flex-col gap-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">
                        Links da Bio
                    </h1>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">
                        Gerenciamento de links para a página de Link na Bio
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
                >
                    <Plus className="w-4 h-4" /> Novo Link
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
                            <TableRow>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 w-16 text-center">
                                    Ordem
                                </TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">
                                    Detalhes do Link
                                </TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-center">
                                    Status
                                </TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-20 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
                                            <span className="font-bold uppercase tracking-widest text-[10px] text-neutral-400">
                                                Carregando links...
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : links.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Link2 className="w-8 h-8 opacity-20" />
                                            <span className="font-bold uppercase tracking-widest text-[10px] text-neutral-400">
                                                Nenhum link cadastrado
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                links.map((link: any) => (
                                    <TableRow
                                        key={link.id}
                                        className="group hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors"
                                    >
                                        <TableCell className="text-center font-black tabular-nums text-neutral-900 dark:text-white">
                                            {link.order}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-neutral-900 dark:text-white">
                                                        {link.title}
                                                    </span>
                                                    {link.icon && (
                                                        <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0 border-neutral-200 dark:border-neutral-700">
                                                            {link.icon}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <a href={link.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                                                    {link.url} <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={link.isActive ? "default" : "secondary"} className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 ${link.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}>
                                                {link.isActive ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                                                    onClick={() => handleEdit(link)}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                                                        >
                                                            <MoreHorizontal className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-48 rounded-xl border-neutral-200 dark:border-neutral-800"
                                                    >
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                                            Opções
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-[10px] font-bold uppercase tracking-widest gap-2 text-red-600 cursor-pointer"
                                                            onClick={() => handleDelete(link.id)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Excluir Link
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <BioLinkModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                initialData={selectedLink}
            />

            <ConfirmModal
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={executeDelete}
                title="Excluir Link?"
                description="Esta ação removerá este link da base. Ele não será mais exibido na página de bio."
            />
        </main>
    );
}
