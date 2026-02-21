"use client"

import * as React from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { FileText, DollarSign, Calendar, Info } from "lucide-react"
import { useBudgets } from "@/hooks/use-budgets"
import { useCreateInvoice } from "@/hooks/use-invoices"
import { toast } from "sonner"

interface InvoiceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function InvoiceModal({ open, onOpenChange }: InvoiceModalProps) {
    const { data: budgets = [] } = useBudgets()
    const createInvoice = useCreateInvoice()

    const [selectedBudgetId, setSelectedBudgetId] = React.useState("")
    const [amount, setAmount] = React.useState("")
    const [dueDate, setDueDate] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Set default due date to 7 days from now
    React.useEffect(() => {
        if (open) {
            const date = new Date()
            date.setDate(date.getDate() + 7)
            setDueDate(date.toISOString().split('T')[0])
        }
    }, [open])

    // Update amount when budget is selected
    React.useEffect(() => {
        if (selectedBudgetId) {
            const budget = budgets.find((b: any) => b.id === selectedBudgetId)
            if (budget) {
                // Format with thousand separator (.) and decimal comma (,)
                setAmount(new Intl.NumberFormat('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                }).format(budget.totalValue))
            }
        }
    }, [selectedBudgetId, budgets])

    const handleCreate = async () => {
        if (!selectedBudgetId || !amount || !dueDate) {
            toast.error("Preencha todos os campos")
            return
        }

        setIsSubmitting(true)
        try {
            const selectedBudget = budgets.find((b: any) => b.id === selectedBudgetId)
            
            // Remove thousand separator (.) and convert decimal comma (,) to dot (.)
            const parsedAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'))
            
            await createInvoice.mutateAsync({
                budgetId: selectedBudgetId,
                clientId: selectedBudget.clientId,
                amount: parsedAmount,
                dueDate: new Date(dueDate),
                status: "PENDING"
            })
            
            toast.success("Fatura criada com sucesso!")
            onOpenChange(false)
            // Reset
            setSelectedBudgetId("")
            setAmount("")
        } catch (error) {
            toast.error("Erro ao criar fatura")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <DialogHeader className="p-8 bg-neutral-900 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Nova Fatura</DialogTitle>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Gerar cobrança para projeto</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Selecionar Projeto / Orçamento</Label>
                        <Select onValueChange={setSelectedBudgetId} value={selectedBudgetId}>
                            <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800">
                                <SelectValue placeholder="Escolha um projeto aprovado" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {budgets.map((budget: any) => (
                                    <SelectItem key={budget.id} value={budget.id}>
                                        {budget.projectName} ({budget.client?.name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Valor da Fatura (BRL)</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600 uppercase">R$</span>
                                <Input 
                                    placeholder="0,00" 
                                    className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 font-black text-neutral-900 dark:text-white"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            {amount && !isNaN(parseFloat(amount.replace(/\./g, '').replace(',', '.'))) && (
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
                                    Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(amount.replace(/\./g, '').replace(',', '.')))}
                                </p>
                            )}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Vencimento</Label>
                            <Input 
                                type="date"
                                className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex gap-3">
                        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide leading-relaxed">
                            O cliente poderá pagar esta fatura via Boleto ou Cartão de Crédito. Um link de pagamento exclusivo do Stripe será gerado após a criação.
                        </p>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="font-bold uppercase tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleCreate}
                        disabled={isSubmitting}
                        className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
                    >
                        {isSubmitting ? "Criando..." : "Gerar Fatura & Cobrança"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
