"use client"

import {
    Plus,
    Settings2,
    FileText,
    FileCheck,
    Receipt,
    ClipboardList,
    FilePlus,
    CheckCircle2,
    Camera,
    Info,
    Trash2,
    Copy,
    Pencil,
    ArrowLeft,
    Loader2,
    CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { PricingRatesModal } from "./rates-modal"
import { AddItemModal } from "./add-item-modal"
import { InvoiceModal } from "./invoice-modal"
import { ConfirmModal } from "@/components/confirm-modal"
import { useBudget } from "@/hooks/use-budgets"
import { useBudgetItems, useDeleteBudgetItem, useUpdateBudgetItem, useDuplicateBudgetItem } from "@/hooks/use-budget-items"
import { useDeleteInvoice, useCreateCheckout } from "@/hooks/use-invoices"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import axios from "axios"
import { PaymentMethodModal } from "@/app/(private)/invoices/payment-method-modal"
import { CopyLinkButton } from "@/app/(private)/invoices/copy-link-button"

export default function BudgetDetailsPage() {
    const params = useParams()
    const id = params.id as string
    const [isRatesModalOpen, setIsRatesModalOpen] = useState(false)
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
    const [confirmDeleteInvoiceOpen, setConfirmDeleteInvoiceOpen] = useState(false)
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [pendingCheckoutInvoiceId, setPendingCheckoutInvoiceId] = useState<string | null>(null)
    
    const [editingItem, setEditingItem] = useState<any>(null)

    const { data: budget, isLoading } = useBudget(id)
    const { data: items = [] } = useBudgetItems(id)
    const deleteItem = useDeleteBudgetItem(id)
    const duplicateItem = useDuplicateBudgetItem(id)
    const deleteInvoice = useDeleteInvoice()
    const createCheckout = useCreateCheckout()

    const handleDeleteItem = (itemId: string) => {
        setPendingDeleteId(itemId)
        setConfirmDeleteOpen(true)
    }

    const executeDeleteItem = async () => {
        if (!pendingDeleteId) return
        try {
            await deleteItem.mutateAsync(pendingDeleteId)
            toast.success("Item removido.")
            setConfirmDeleteOpen(false)
        } catch {
            toast.error("Erro ao remover item.")
        }
    }

    const handleDuplicateItem = async (itemId: string) => {
        try {
            await duplicateItem.mutateAsync(itemId)
            toast.success("Item duplicado!")
        } catch {
            toast.error("Erro ao duplicar item.")
        }
    }

    const handleEditItem = (item: any) => {
        setEditingItem(item)
        setIsAddItemModalOpen(true)
    }

    const handleOpenAddItem = () => {
        setEditingItem(null)
        setIsAddItemModalOpen(true)
    }

    const handleOpenCheckout = (invoiceId: string) => {
        setPendingCheckoutInvoiceId(invoiceId)
        setPaymentModalOpen(true)
    }

    const executeCheckout = async (gateway: 'stripe' | 'mercadopago') => {
        if (!pendingCheckoutInvoiceId) return
        try {
            const data = await createCheckout.mutateAsync({ id: pendingCheckoutInvoiceId, gateway })
            if (data.url) {
                window.open(data.url, '_blank')
                setPaymentModalOpen(false)
            }
        } catch {
            toast.error("Erro ao gerar link de pagamento.")
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
        )
    }

    if (!budget) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
                <h1 className="text-xl font-bold uppercase tracking-tighter">Orçamento não encontrado</h1>
                <Button asChild variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
                    <Link href="/budgets">Voltar para a lista</Link>
                </Button>
            </div>
        )
    }

    const documentActions = [
        { icon: FileText, label: "Orçamento PDF", sub: "VISUALIZAR E IMPRIMIR", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-100 dark:border-blue-900/30", href: `/budgets/${id}/pdf` },
        { icon: FileCheck, label: "Contrato", sub: "GERAR CONTRATO PADRÃO", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-100 dark:border-emerald-900/30", href: `/budgets/${id}/contract` },
        { icon: Receipt, label: "Recibo", sub: "COMPROVANTE DE PAGAMENTO", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/10", border: "border-orange-100 dark:border-orange-900/30", href: `/budgets/${id}/receipt` },
        { icon: ClipboardList, label: "Ordem de Serviço", sub: "DADOS PARA PRODUÇÃO", color: "text-neutral-600", bg: "bg-neutral-50 dark:bg-neutral-800/50", border: "border-neutral-200 dark:border-neutral-800", href: `/budgets/${id}/os` },
        { icon: FilePlus, label: "Aditivo de Escopo", sub: "NOVOS ITENS NO PROJETO", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-100 dark:border-emerald-900/30", href: `/budgets/${id}/addendum` },
        { icon: CheckCircle2, label: "Aprovação Final", sub: "TERMO DE ENCERRAMENTO", color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/10", border: "border-cyan-100 dark:border-cyan-900/30", href: `/budgets/${id}/approval` },
        { icon: Camera, label: "Uso de Imagem", sub: "AUTORIZAÇÃO DE PORTFÓLIO", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-purple-100 dark:border-purple-900/30", href: `/budgets/${id}/usage` },
        { icon: Info, label: "Briefing Técnico", sub: "ENVIAR LINK PARA O CLIENTE", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/10", border: "border-rose-100 dark:border-rose-900/30", href: `/briefing/${id}` },
    ]

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            PENDING: "PENDENTE",
            IN_PROGRESS: "EM PROGRESSO",
            APPROVED: "APROVADO",
            CANCELLED: "CANCELADO",
            FINISHED: "FINALIZADO",
        }
        return map[status] ?? status
    }

    const totalHours = items.reduce((s, i) => s + i.estimatedHours * i.quantity, 0)

    // Metrics derived from budget rates
    const rates = { baseHours: budget.baseHours, hourlyRate: budget.hourlyRate, profitMargin: budget.profitMargin, multiplier: budget.multiplier }
    const effectiveRate = rates.hourlyRate * rates.multiplier * (1 + rates.profitMargin / 100)

    return (
        <main className="flex flex-col gap-8 p-6 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/budgets" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors w-fit font-bold uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="w-3 h-3" /> Voltar para Orçamentos
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">{budget.projectName}</h1>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-none font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">
                                {getStatusLabel(budget.status)}
                            </Badge>
                            <span className="text-sm text-neutral-500 font-bold uppercase tracking-tight text-[11px]">
                                CLIENTE: <span className="text-neutral-900 dark:text-neutral-100 font-black">{budget.client?.name}</span>
                                {budget.client?.company && <span className="ml-2 text-neutral-400 font-bold">({budget.client.company})</span>}
                            </span>
                        </div>
                    </div>
                    <Button
                        onClick={handleOpenAddItem}
                        className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white font-black gap-2 h-11 px-6 shadow-xl shadow-black/10 rounded-xl uppercase tracking-widest text-[10px] cursor-pointer"
                    >
                        <Plus className="w-4 h-4" /> Adicionar Item
                    </Button>
                </div>
            </div>

            {/* Metrics Section */}
            <Card className="border border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 bg-neutral-50/50 dark:bg-neutral-800/30 px-8">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">Precificação do Projeto</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-[10px] font-bold uppercase tracking-widest h-8 px-4 rounded-lg border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-none cursor-pointer"
                        onClick={() => setIsRatesModalOpen(true)}
                    >
                        <Settings2 className="w-3 h-3" /> Configurar Taxas
                    </Button>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 flex-1">
                            {[
                                { label: "Horas Base", value: `${rates.baseHours}h` },
                                { label: "Valor Hora", value: formatCurrency(rates.hourlyRate) },
                                { label: "Horas do Projeto", value: `${totalHours.toFixed(1)}h` },
                                { label: "Margem Lucro", value: `${rates.profitMargin}%` },
                                { label: "Multiplicador", value: `${rates.multiplier}x` },
                            ].map((m, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="text-[9px] uppercase font-black text-neutral-400 tracking-widest leading-none">{m.label}</span>
                                    <span className="text-lg font-black text-neutral-900 dark:text-neutral-100 tabular-nums uppercase">{m.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1 items-start md:items-end md:pl-8 md:border-l border-neutral-100 dark:border-neutral-800 shrink-0">
                            <span className="text-[9px] uppercase font-black text-neutral-900 dark:text-white tracking-widest leading-none opacity-40">Preço Final</span>
                            <span className="text-3xl md:text-4xl font-black text-emerald-500 dark:text-emerald-400 tabular-nums leading-none whitespace-nowrap">
                                {formatCurrency(budget.totalValue ?? 0)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Document Actions */}
            <div className="flex flex-col gap-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-1">Documentos e Termos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {documentActions.map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white transition-all group text-left shadow-none cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-lg ${action.bg} flex items-center justify-center ${action.color} border ${action.border} group-hover:scale-105 transition-transform`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">{action.label}</span>
                                <span className="text-[9px] font-bold text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors uppercase tracking-widest">{action.sub}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Production Items */}
            <Card className="border border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4 bg-neutral-50/50 dark:bg-neutral-800/30 px-8">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">
                        Itens de Produção ({items.length})
                    </CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-neutral-50/50 dark:bg-neutral-800/50">
                            <TableRow className="hover:bg-transparent border-b border-neutral-100 dark:border-neutral-800">
                                <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 px-8">Imagem / Descrição</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Tipo / Dificuldade</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Horas Un.</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Qtd.</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right">Valor Un.</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right">Total Item</TableHead>
                                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest px-8">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                                        Nenhum item adicionado ainda. Clique em "Adicionar Item" para começar.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors border-b border-neutral-100 dark:border-neutral-800">
                                        <TableCell className="py-4 px-8">
                                            <span className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-white">{item.description}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">{item.imageTypeName}</span>
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.difficultyName} ({item.difficultyMultiplier}x)</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center font-black text-sm text-neutral-900 dark:text-white tabular-nums">
                                            {item.estimatedHours.toFixed(1)}h
                                        </TableCell>
                                        <TableCell className="py-4 text-center font-black text-sm text-neutral-900 dark:text-white tabular-nums">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="py-4 text-right font-bold text-sm text-neutral-500 tabular-nums">
                                            {formatCurrency(item.unitValue)}
                                        </TableCell>
                                        <TableCell className="py-4 text-right font-black text-sm text-neutral-900 dark:text-white tabular-nums">
                                            {formatCurrency(item.totalValue)}
                                        </TableCell>
                                        <TableCell className="py-4 text-right px-8">
                                            <div className="flex justify-end items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleEditItem(item)}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 text-neutral-400 hover:text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDuplicateItem(item.id)}
                                                    disabled={duplicateItem.isPending}
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 text-neutral-400 hover:text-red-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    disabled={deleteItem.isPending}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {items.length > 0 && (
                    <div className="p-8 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/10">
                        <div className="flex justify-end gap-8 items-center">
                            <div className="flex flex-col items-end gap-0.5">
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total de Horas</span>
                                <span className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tabular-nums">{totalHours.toFixed(1)}h</span>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Preço Total</span>
                                <span className="text-3xl font-black text-emerald-500 dark:text-emerald-400 tabular-nums">{formatCurrency(budget.totalValue ?? 0)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Payment Schedule */}
            <Card className="border border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 bg-neutral-50/50 dark:bg-neutral-800/30 px-8">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">Cronograma de Pagamento</CardTitle>
                    <Button
                        onClick={() => setIsInvoiceModalOpen(true)}
                        className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white gap-2 text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-lg shadow-none cursor-pointer"
                    >
                        <Plus className="w-3 h-3" /> Nova Fatura
                    </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-neutral-50/50 dark:bg-neutral-800/50">
                            <TableRow className="hover:bg-transparent border-b border-neutral-100 dark:border-neutral-800">
                                <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 px-8">ID Fatura</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Vencimento</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right">Valor</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest px-8">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {budget.invoices?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                                        Nenhuma fatura cadastrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                budget.invoices?.map((invoice: any) => (
                                    <TableRow key={invoice.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors border-b border-neutral-100 dark:border-neutral-800">
                                        <TableCell className="py-4 px-8 font-black text-xs text-neutral-400 uppercase">
                                            #{invoice.id.slice(-6).toUpperCase()}
                                        </TableCell>
                                        <TableCell className="py-4 text-xs font-bold text-neutral-500 uppercase">
                                            {format(new Date(invoice.dueDate), "dd / MM / yyyy", { locale: ptBR })}
                                        </TableCell>
                                        <TableCell className="py-4 text-right font-black text-sm text-neutral-900 dark:text-white">
                                            {formatCurrency(invoice.amount)}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={`text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 ${
                                                invoice.status === 'PAID' ? "bg-emerald-500/10 text-emerald-600" : 
                                                invoice.status === 'PENDING' ? "bg-amber-500/10 text-amber-600" :
                                                "bg-neutral-100 text-neutral-500"
                                            }`}>
                                                {invoice.status === 'PAID' ? 'Pago' : invoice.status === 'PENDING' ? 'Pendente' : invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-right px-8">
                                            <div className="flex justify-end gap-1">
                                                {invoice.status === 'PENDING' && (
                                                    <>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="w-8 h-8 text-neutral-400 hover:text-blue-600 cursor-pointer"
                                                            onClick={() => handleOpenCheckout(invoice.id)}
                                                            title="Cobrar via Stripe ou Mercado Pago"
                                                        >
                                                            <CreditCard className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <CopyLinkButton invoiceId={invoice.id} />
                                                    </>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-8 h-8 text-neutral-400 hover:text-red-600 cursor-pointer"
                                                    onClick={() => {
                                                        setPendingDeleteId(invoice.id)
                                                        setConfirmDeleteInvoiceOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Payment progress summary */}
                {(budget.invoices?.length ?? 0) > 0 && (() => {
                    const totalInvoiced = budget.invoices?.reduce((a: number, inv: any) => a + inv.amount, 0) ?? 0
                    const totalPaid = budget.invoices?.filter((inv: any) => inv.status === 'PAID').reduce((a: number, inv: any) => a + inv.amount, 0) ?? 0
                    const budgetTotal = budget.totalValue ?? 0
                    const pct = budgetTotal > 0 ? Math.min((totalPaid / budgetTotal) * 100, 100) : 0
                    return (
                        <div className="p-8 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/10 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Total Faturado</span>
                                    <span className="text-lg font-black text-neutral-900 dark:text-white tabular-nums">{formatCurrency(totalInvoiced)}</span>
                                </div>
                                <div className="flex flex-col gap-0.5 items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Recebido</span>
                                    <span className="text-lg font-black text-emerald-500 tabular-nums">{formatCurrency(totalPaid)}</span>
                                </div>
                                <div className="flex flex-col gap-0.5 items-end">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Valor do Orçamento</span>
                                    <span className="text-lg font-black text-neutral-900 dark:text-white tabular-nums">{formatCurrency(budgetTotal)}</span>
                                </div>
                            </div>
                            <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                    className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 text-right">{pct.toFixed(0)}% recebido</p>
                        </div>
                    )
                })()}
            </Card>

            <PricingRatesModal open={isRatesModalOpen} onOpenChange={setIsRatesModalOpen} budgetId={id} />
            <AddItemModal open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen} budgetId={id} item={editingItem} />
            <InvoiceModal open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen} />

            <PaymentMethodModal
                open={paymentModalOpen}
                onOpenChange={setPaymentModalOpen}
                onSelect={executeCheckout}
                isLoading={createCheckout.isPending}
            />
            <ConfirmModal 
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={executeDeleteItem}
                title="Remover Item?"
                description="Você tem certeza que deseja remover este item do orçamento?"
            />

            <ConfirmModal 
                open={confirmDeleteInvoiceOpen}
                onOpenChange={setConfirmDeleteInvoiceOpen}
                onConfirm={async () => {
                    if (!pendingDeleteId) return
                    try {
                        await deleteInvoice.mutateAsync(pendingDeleteId)
                        toast.success("Fatura removida.")
                        setConfirmDeleteInvoiceOpen(false)
                    } catch {
                        toast.error("Erro ao remover fatura.")
                    }
                }}
                title="Excluir Fatura?"
                description="Esta ação removerá permanentemente a fatura e o link de pagamento associado."
            />
        </main>
    )
}
