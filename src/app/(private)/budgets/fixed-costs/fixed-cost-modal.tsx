"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, DollarSign, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateFixedCost, useUpdateFixedCost } from "@/hooks/use-costs";
import { type FixedCostInput, fixedCostSchema } from "@/schemas/costs";

interface FixedCostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cost?: any;
}

export function FixedCostModal({
  open,
  onOpenChange,
  cost,
}: FixedCostModalProps) {
  const createMutation = useCreateFixedCost();
  const updateMutation = useUpdateFixedCost();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FixedCostInput>({
    resolver: zodResolver(fixedCostSchema) as any,
    values: cost
      ? {
          description: cost.description,
          category: cost.category || "",
          value: cost.value,
          dueDate: cost.dueDate || null,
        }
      : undefined,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: FixedCostInput) => {
    try {
      if (cost) {
        await updateMutation.mutateAsync({ id: cost.id, ...data });
        toast.success("Despesa atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Despesa criada com sucesso!");
      }
      onOpenChange(false);
      reset();
    } catch (_error) {
      toast.error("Erro ao salvar despesa.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-8 bg-neutral-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                  {cost ? "Editar Despesa" : "Nova Despesa Fixa"}
                </DialogTitle>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Custos recorrentes da estrutura
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Descrição do Custo
              </Label>
              <Input
                {...register("description")}
                placeholder="Ex: Assinatura Adobe"
                className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
              />
              {errors.description && (
                <p className="text-red-500 text-[10px] uppercase font-bold">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Categoria
                </Label>
                <Input
                  {...register("category")}
                  placeholder="Ex: Software"
                  className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Valor Mensal
                </Label>
                <Input
                  {...register("value")}
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 tabular-nums"
                />
                {errors.value && (
                  <p className="text-red-500 text-[10px] uppercase font-bold">
                    {errors.value.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Dia de Vencimento
              </Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  {...register("dueDate")}
                  type="number"
                  placeholder="10"
                  className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 tabular-nums"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-[10px] uppercase font-bold">
                    {errors.dueDate.message}
                  </p>
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
              className="flex-1 gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-black/10"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {cost ? "Atualizar Despesa" : "Salvar Despesa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
