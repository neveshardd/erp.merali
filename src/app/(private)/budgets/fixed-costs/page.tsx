"use client"

import * as React from "react"
import { 
    Plus, 
    Trash2, 
    Pencil, 
    DollarSign, 
    Clock, 
    TrendingUp,
    Info,
    Search,
    Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { FixedCostModal } from "./fixed-cost-modal"
import { useFixedCosts, useDeleteFixedCost } from "@/hooks/use-costs"
import { ConfirmModal } from "@/components/confirm-modal"
import { toast } from "sonner"

export default function FixedCostsPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedCost, setSelectedCost] = React.useState<any>(null)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
    const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

    const { data: fixedCosts = [], isLoading } = useFixedCosts()
    const deleteMutation = useDeleteFixedCost()

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
            toast.success("Despesa excluída com sucesso!")
            setConfirmDeleteOpen(false)
        } catch (error) {
            toast.error("Erro ao excluir despesa.")
        }
    }

    const filteredCosts = fixedCosts.filter((c: any) => 
        (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalCost = fixedCosts.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0)
    const monthlyHours = 160 // Valor fixo de referência
    const costPerHour = totalCost / monthlyHours

    if (isLoading) return <div className="p-6">Carregando custos...</div>

    return (
        <main className="flex flex-col gap-8 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">Custos Fixos Mensais</h1>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">Gerenciamento de despesas operacionais do estúdio</p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
                >
                    <Plus className="w-4 h-4" /> Nova Despesa
                </Button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none bg-neutral-900 text-white rounded-3xl overflow-hidden relative shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <DollarSign className="w-24 h-24" />
                    </div>
                    <CardContent className="p-8 flex flex-col gap-2 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Total de Custos Fixos</span>
                        <span className="text-4xl font-black tabular-nums tracking-tighter">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
                        </span>
                    </CardContent>
                </Card>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm">
                    <CardContent className="p-8 flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Horas Úteis/Mês</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tabular-nums tracking-tighter text-neutral-900 dark:text-white">{monthlyHours}H</span>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Disponibilidade</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-3xl shadow-sm border-dashed">
                    <CardContent className="p-8 flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/60">Custo Operacional por Hora</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tabular-nums tracking-tighter text-emerald-600">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(costPerHour)}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600/40 uppercase tracking-widest">Base de Preço</span>
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
                            placeholder="Pesquisar despesa ou categoria..." 
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
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Descrição</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Categoria</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Valor Mensal</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Status de Quitação</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCosts.map((cost: any) => (
                                <TableRow key={cost.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                    <TableCell className="font-black text-xs uppercase text-neutral-900 dark:text-white py-4">{cost.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest rounded-md px-2 py-0.5 bg-neutral-50 dark:bg-neutral-800/50">
                                            {cost.category || "Geral"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cost.value)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 bg-emerald-500/10 text-emerald-600">
                                            Pago
                                        </Badge>
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
            
            <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
                <Info className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Por que gerenciar custos fixos?</span>
                    <p className="text-xs font-bold text-blue-900/60 uppercase leading-relaxed tracking-tight">
                        Seus custos fixos determinam o valor mínimo da sua hora de trabalho. Manter estes dados atualizados garante que seus orçamentos cubram não apenas a produção, mas toda a infraestrutura vital do Merali Studio.
                    </p>
                </div>
            </div>
            <FixedCostModal 
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
                title="Excluir Despesa?"
                description="Esta ação removerá permanentemente esta despesa fixa dos seus cálculos operacionais."
            />
        </main>
    )
}
