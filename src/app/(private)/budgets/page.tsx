"use client"

import * as React from "react"
import { 
    Plus, 
    Trash2, 
    Pencil, 
    FileText,
    Search,
    MoreHorizontal,
    Copy,
    Eye,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { BudgetModal } from "./budget-modal"
import { ConfirmModal } from "@/components/confirm-modal"
import { useBudgets, useDeleteBudget } from "@/hooks/use-budgets"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function BudgetsPage() {
    const [search, setSearch] = React.useState("")
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedBudget, setSelectedBudget] = React.useState<any>(null)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
    const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)
    const router = useRouter()

    const { data: budgets = [], isLoading } = useBudgets()
    const deleteMutation = useDeleteBudget()

    const filteredBudgets = budgets.filter((b: any) => 
        b.projectName.toLowerCase().includes(search.toLowerCase()) ||
        b.client?.name.toLowerCase().includes(search.toLowerCase()) ||
        b.client?.company?.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = (id: string) => {
        setPendingDeleteId(id)
        setConfirmDeleteOpen(true)
    }

    const executeDelete = async () => {
        if (!pendingDeleteId) return
        try {
            await deleteMutation.mutateAsync(pendingDeleteId)
            toast.success("Orçamento excluído com sucesso!")
            setConfirmDeleteOpen(false)
        } catch (error) {
            toast.error("Erro ao excluir orçamento.")
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-neutral-100 text-neutral-600 border-neutral-200"
            case "IN_PROGRESS": return "bg-blue-50 text-blue-600 border-blue-100"
            case "APPROVED": return "bg-emerald-50 text-emerald-600 border-emerald-100"
            case "CANCELLED": return "bg-red-50 text-red-600 border-red-100"
            case "FINISHED": return "bg-purple-50 text-purple-600 border-purple-100"
            default: return "bg-neutral-100 text-neutral-600 border-neutral-200"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING": return "PENDENTE"
            case "IN_PROGRESS": return "EM PROGRESSO"
            case "APPROVED": return "APROVADO"
            case "CANCELLED": return "CANCELADO"
            case "FINISHED": return "FINALIZADO"
            default: return status
        }
    }

    return (
        <main className="flex flex-col gap-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tighter">Gerenciar Orçamentos</h1>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest text-[9px]">Visualize e gerencie todos os seus orçamentos em um só lugar.</p>
                </div>
                <Button 
                    onClick={() => {
                        setSelectedBudget(null)
                        setIsModalOpen(true)
                    }}
                    className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white font-black gap-2 rounded-xl h-12 px-6 uppercase tracking-widest text-[10px] cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Novo Orçamento
                </Button>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 ml-2" />
                <Input 
                    placeholder="BUSCAR POR PROJETO OU CLIENTE..." 
                    className="border-none focus-visible:ring-0 bg-transparent h-8 text-[10px] font-bold uppercase tracking-widest placeholder:text-neutral-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-black text-neutral-900 dark:text-neutral-100 py-4 uppercase tracking-widest text-[10px]">Projeto</TableHead>
                            <TableHead className="font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-widest text-[10px]">Cliente</TableHead>
                            <TableHead className="font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-widest text-[10px]">Prazo</TableHead>
                            <TableHead className="font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-widest text-[10px]">Valor Total</TableHead>
                            <TableHead className="font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-widest text-[10px]">Status</TableHead>
                            <TableHead className="text-right font-black text-neutral-900 dark:text-neutral-100 pr-6 uppercase tracking-widest text-[10px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-20 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
                                        <span className="font-bold uppercase tracking-widest text-[10px] text-neutral-400">Carregando orçamentos...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredBudgets.map((budget: any) => (
                            <TableRow 
                                key={budget.id} 
                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors cursor-pointer group"
                                onClick={(e) => {
                                    if (!(e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('a')) {
                                        router.push(`/budgets/${budget.id}`)
                                    }
                                }}
                            >
                                <TableCell className="py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-all border border-neutral-200 dark:border-neutral-800">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{budget.projectName}</span>
                                            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
                                                {format(new Date(budget.createdAt), "dd 'DE' MMM 'DE' yyyy", { locale: ptBR })}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-neutral-900 dark:text-neutral-100 font-black text-[11px] uppercase">{budget.client?.name}</span>
                                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{budget.clientTypeName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold text-[11px] text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                    {budget.deadline || "Não definido"}
                                </TableCell>
                                <TableCell className="font-black text-neutral-900 dark:text-neutral-100 tabular-nums text-sm">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget.totalValue)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("font-black px-2 py-0.5 border-neutral-200 dark:border-neutral-800 text-[9px] tracking-widest", getStatusStyle(budget.status))}>
                                        {getStatusLabel(budget.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full cursor-pointer">
                                                <span className="sr-only">Abrir menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 border-neutral-200 dark:border-neutral-800 shadow-xl rounded-2xl p-2 bg-white dark:bg-neutral-950">
                                            <DropdownMenuLabel className="text-[9px] uppercase font-black text-neutral-400 tracking-widest px-2 py-2">Ações do Orçamento</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/budgets/${budget.id}`} className="gap-2 cursor-pointer font-bold text-[10px] uppercase p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all">
                                                    <Eye className="w-4 h-4 text-neutral-500" /> Ver Detalhes e Itens
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => {
                                                    setSelectedBudget(budget)
                                                    setIsModalOpen(true)
                                                }}
                                                className="gap-2 cursor-pointer font-bold text-[10px] uppercase p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all"
                                            >
                                                <Pencil className="w-4 h-4 text-neutral-500" /> Editar Dados Básicos
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 cursor-pointer font-bold text-[10px] uppercase p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all">
                                                <Copy className="w-4 h-4 text-neutral-500" /> Duplicar Orçamento
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="my-2 bg-neutral-100 dark:bg-neutral-800" />
                                            <DropdownMenuItem 
                                                onClick={() => handleDelete(budget.id)}
                                                className="gap-2 cursor-pointer text-red-600 focus:text-red-500 font-bold text-[10px] uppercase p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" /> Excluir Permanentemente
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!isLoading && filteredBudgets.length === 0 && (
                    <div className="py-20 text-center text-neutral-500 flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 opacity-20" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Nenhum orçamento encontrado</span>
                    </div>
                )}
            </div>

            <BudgetModal 
                open={isModalOpen} 
                onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) setSelectedBudget(null)
                }} 
                budget={selectedBudget}
            />

            <ConfirmModal 
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={executeDelete}
                title="Excluir Orçamento?"
                description="Esta ação removerá permanentemente o orçamento e todos os itens e faturas associados."
            />
        </main>
    )
}
