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
import { useBudgetRates, useUpdateBudgetRates, useOperationalCosts } from "@/hooks/use-budget-items"
import { Loader2, RefreshCw, Calculator } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface RatesModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    budgetId: string
}

export function PricingRatesModal({ open, onOpenChange, budgetId }: RatesModalProps) {
    const { data: rates, isLoading: isLoadingRates } = useBudgetRates(budgetId)
    const updateRates = useUpdateBudgetRates(budgetId)
    const { data: operational = { total: 0, fixed: 0, variable: 0 }, isLoading: isLoadingCosts } = useOperationalCosts()

    const [baseHours, setBaseHours] = React.useState(140)
    const [hourlyRate, setHourlyRate] = React.useState(0)
    const [profitMargin, setProfitMargin] = React.useState(20)
    const [multiplier, setMultiplier] = React.useState(1.0)

    const isLoading = isLoadingRates || isLoadingCosts

    // Sync state from API
    React.useEffect(() => {
        if (rates) {
            setBaseHours(rates.baseHours)
            setHourlyRate(rates.hourlyRate)
            setProfitMargin(rates.profitMargin)
            setMultiplier(rates.multiplier)
        }
    }, [rates])

    // Auto-calculate hourlyRate from total operational costs / baseHours
    const calculatedHourlyRate = baseHours > 0 ? operational.total / baseHours : 0
    const effectiveHourlyRate = hourlyRate > 0 ? hourlyRate : calculatedHourlyRate

    const handleAutoCalc = () => {
        setHourlyRate(parseFloat(calculatedHourlyRate.toFixed(2)))
    }

    const handleSave = async () => {
        try {
            await updateRates.mutateAsync({
                baseHours,
                hourlyRate: effectiveHourlyRate,
                profitMargin,
                multiplier,
            })
            toast.success("Taxas atualizadas e itens recalculados!")
            onOpenChange(false)
        } catch {
            toast.error("Erro ao atualizar taxas.")
        }
    }

    const inputClass = "h-11 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 font-bold text-neutral-900 dark:text-neutral-100 focus-visible:ring-neutral-900 dark:focus-visible:ring-white transition-all rounded-lg"
    const labelClass = "text-[10px] uppercase font-bold text-neutral-400 tracking-widest"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 border-none shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 flex flex-col max-h-[90vh]">
                <DialogHeader className="p-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 shrink-0">
                    <DialogTitle className="text-lg font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-neutral-400" />
                        Configurar Precificação
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center p-16">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
                    </div>
                ) : (
                    <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5 custom-scrollbar">
                        {/* Info box */}
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Custos Operacionais Mensais</span>
                                <span className="text-lg font-black text-neutral-900 dark:text-white uppercase">{formatCurrency(operational.total)}</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-bold text-neutral-400 uppercase tracking-widest border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-1">
                                <span>Fixos: {formatCurrency(operational.fixed)}</span>
                                <span>Variáveis: {formatCurrency(operational.variable)}</span>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Horas Base */}
                            <div className="grid gap-1.5">
                                <Label className={labelClass}>Horas Base / Mês</Label>
                                <Input
                                    type="number"
                                    value={baseHours}
                                    onChange={(e) => setBaseHours(parseFloat(e.target.value) || 0)}
                                    className={inputClass}
                                />
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-0.5">
                                    Custo/h: {formatCurrency(calculatedHourlyRate)}
                                </p>
                            </div>

                            {/* Valor Hora */}
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className={labelClass}>Valor/Hora (R$)</Label>
                                    <button
                                        onClick={handleAutoCalc}
                                        className="text-[9px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-widest cursor-pointer transition-colors"
                                    >
                                        Auto-calc
                                    </button>
                                </div>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Margem de Lucro */}
                            <div className="grid gap-1.5">
                                <Label className={labelClass}>Margem Lucro (%)</Label>
                                <Input
                                    type="number"
                                    value={profitMargin}
                                    onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Multiplicador */}
                            <div className="grid gap-1.5">
                                <Label className={labelClass}>Multiplicador</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={multiplier}
                                    onChange={(e) => setMultiplier(parseFloat(e.target.value) || 1)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Result preview */}
                        <div className="p-4 bg-neutral-900 dark:bg-white rounded-xl flex flex-col items-center gap-1 shadow-inner">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 dark:text-neutral-900/50">
                                Valor Hora Efetivo (Lucro + Multiplicador)
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-white dark:text-neutral-900 tabular-nums">
                                    {formatCurrency(effectiveHourlyRate * multiplier * (1 + profitMargin / 100))}
                                </span>
                                <span className="text-[10px] font-bold text-white/40 dark:text-neutral-900/40 uppercase">/hora</span>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="p-5 bg-neutral-50/50 dark:bg-neutral-800/20 border-t border-neutral-100 dark:border-neutral-800 shrink-0 flex gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="font-bold uppercase tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={updateRates.isPending}
                        className="flex-1 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest h-11 rounded-xl shadow-lg shadow-black/5 transition-all active:scale-[0.98] cursor-pointer gap-2"
                    >
                        {updateRates.isPending ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Aplicando...</>
                        ) : (
                            <><RefreshCw className="w-4 h-4" /> Salvar e Aplicar</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
