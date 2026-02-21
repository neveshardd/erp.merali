"use client"

import * as React from "react"
import { 
    Plus, 
    Trash2, 
    Pencil, 
    ShoppingBag, 
    Archive, 
    Layers,
    Search,
    Link as LinkIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { VariableCostModal } from "./variable-cost-modal"
import { useVariableCosts, useDeleteVariableCost } from "@/hooks/use-costs"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/confirm-modal"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function VariableCostsPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedCost, setSelectedCost] = React.useState<any>(null)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
    const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

    const { data: variableCosts = [], isLoading } = useVariableCosts()
    const deleteMutation = useDeleteVariableCost()

    const handleEdit = (cost: any) => {
        setSelectedCost(cost)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        setPendingDeleteId(id)
        setConfirmDeleteOpen(true)
    }

    const executeDelete = async () => {
        if (!pendingDeleteId) return
        try {
            await deleteMutation.mutateAsync(pendingDeleteId)
            toast.success("Custo excluído com sucesso!")
            setConfirmDeleteOpen(false)
        } catch (error) {
            toast.error("Erro ao excluir custo.")
        }
    }

    const filteredCosts = variableCosts.filter((c: any) => 
        (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.budget?.projectName || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalVariable = variableCosts.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0)

    return (
        <main className="flex flex-col gap-8 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">Custos Variáveis</h1>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">Despesas pontuais vinculadas a projetos específicos</p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
                >
                    <Plus className="w-4 h-4" /> Registrar Custo
                </Button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none bg-emerald-600 text-white rounded-3xl overflow-hidden relative shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShoppingBag className="w-24 h-24" />
                    </div>
                    <CardContent className="p-8 flex flex-col gap-2 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Total Variável (Mês Atual)</span>
                        <span className="text-4xl font-black tabular-nums tracking-tighter">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalVariable)}
                        </span>
                    </CardContent>
                </Card>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm">
                    <CardContent className="p-8 flex flex-col gap-2 relative">
                        <div className="absolute top-8 right-8 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                            <Layers className="w-6 h-6 text-neutral-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Projetos Impactados</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tabular-nums tracking-tighter text-neutral-900 dark:text-white">
                                {String(new Set(variableCosts.map((c: any) => c.budgetId).filter(Boolean)).size).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Projetos Ativos</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and List */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input 
                            placeholder="Buscar por projeto, item ou descrição..." 
                            className="h-12 pl-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl shadow-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
                            <TableRow>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Projeto Alocado</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Custo / Despesa</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Data</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">Valor</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCosts.map((cost: any) => (
                                <TableRow key={cost.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                    <TableCell className="font-black text-xs uppercase text-emerald-600 py-4 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/20 rounded flex items-center justify-center">
                                            <Archive className="w-3 h-3" />
                                        </div>
                                        {cost.budget?.projectName || "Sem Projeto"}
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-tight">{cost.description}</TableCell>
                                    <TableCell className="text-xs font-bold text-neutral-500 uppercase tracking-widest tabular-nums">
                                        {format(new Date(cost.date), "dd/MM/yyyy", { locale: ptBR })}
                                    </TableCell>
                                    <TableCell className="text-right text-xs font-black text-neutral-900 dark:text-white tabular-nums">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cost.value)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                                                onClick={() => handleEdit(cost)}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="w-8 h-8 text-neutral-400 hover:text-red-600 cursor-pointer"
                                                onClick={() => handleDelete(cost.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <VariableCostModal 
                open={isModalOpen} 
                onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) setSelectedCost(null)
                }} 
                cost={selectedCost}
            />

            <ConfirmModal 
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={executeDelete}
                title="Excluir Custo?"
                description="Esta ação removerá permanentemente este custo variável associado ao projeto."
            />
        </main>
    )
}
