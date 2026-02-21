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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Calendar, Archive, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { variableCostSchema, VariableCostInput } from "@/schemas/costs"
import { useCreateVariableCost, useUpdateVariableCost } from "@/hooks/use-costs"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

interface VariableCostModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cost?: any
}

export function VariableCostModal({ open, onOpenChange, cost }: VariableCostModalProps) {
    const createMutation = useCreateVariableCost()
    const updateMutation = useUpdateVariableCost()

    const { data: budgets = [] } = useQuery({
        queryKey: ["budgets"],
        queryFn: async () => {
            const { data } = await axios.get("/api/budgets")
            return data
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<VariableCostInput>({
        resolver: zodResolver(variableCostSchema) as any,
        values: cost ? {
            description: cost.description,
            value: cost.value,
            date: new Date(cost.date),
            budgetId: cost.budgetId || null,
        } : undefined,
    })

    const isPending = createMutation.isPending || updateMutation.isPending

    const onSubmit = async (data: VariableCostInput) => {
        try {
            if (cost) {
                await updateMutation.mutateAsync({ id: cost.id, ...data })
                toast.success("Custo atualizado com sucesso!")
            } else {
                await createMutation.mutateAsync(data)
                toast.success("Custo criado com sucesso!")
            }
            onOpenChange(false)
            reset()
        } catch (error) {
            toast.error("Erro ao salvar custo.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="p-8 bg-emerald-600 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Archive className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                                    {cost ? "Editar Custo" : "Registrar Custo Variável"}
                                </DialogTitle>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Vincule despesas a projetos específicos</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Projeto Vinculado (Opcional)</Label>
                            <Select 
                                onValueChange={(value) => reset({ budgetId: value === "none" ? null : value })}
                                defaultValue={cost?.budgetId || "none"}
                            >
                                <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800">
                                    <SelectValue placeholder="Selecione um projeto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhum projeto</SelectItem>
                                    {budgets.map((budget: any) => (
                                        <SelectItem key={budget.id} value={budget.id}>
                                            {budget.projectName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Descrição do Item</Label>
                            <Input 
                                {...register("description")}
                                placeholder="Ex: Modelo 3D Premium" 
                                className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800" 
                            />
                            {errors.description && (
                                <p className="text-red-500 text-[10px] uppercase font-bold">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Valor</Label>
                                <Input 
                                    {...register("value")}
                                    type="number" 
                                    step="0.01"
                                    placeholder="0,00" 
                                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 tabular-nums" 
                                />
                                {errors.value && (
                                    <p className="text-red-500 text-[10px] uppercase font-bold">{errors.value.message}</p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Data da Despesa</Label>
                                <Input 
                                    type="date" 
                                    {...register("date")}
                                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800" 
                                />
                                {errors.date && (
                                    <p className="text-red-500 text-[10px] uppercase font-bold">{errors.date.message}</p>
                                )}
                            </div>
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
                            className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-emerald-500/10"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {cost ? "Salvar Alterações" : "Confirmar Custo"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
