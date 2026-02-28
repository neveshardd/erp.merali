"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Gauge, Loader2, Save, TrendingUp } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateDifficulty, useUpdateDifficulty } from "@/hooks/use-settings";
import { type DifficultyInput, difficultySchema } from "@/schemas/settings";

interface DifficultyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  difficulty?: any;
}

export function DifficultyModal({
  open,
  onOpenChange,
  difficulty,
}: DifficultyModalProps) {
  const createMutation = useCreateDifficulty();
  const updateMutation = useUpdateDifficulty();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DifficultyInput>({
    resolver: zodResolver(difficultySchema) as any,
    values: difficulty
      ? {
          name: difficulty.name,
          multiplier: difficulty.multiplier,
          criteria: difficulty.criteria || "",
        }
      : {
          name: "",
          multiplier: 1,
          criteria: "",
        },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: DifficultyInput) => {
    try {
      if (difficulty) {
        await updateMutation.mutateAsync({ id: difficulty.id, ...data });
        toast.success("Dificuldade atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Dificuldade criada com sucesso!");
      }
      onOpenChange(false);
      reset();
    } catch (_error) {
      toast.error("Erro ao salvar dificuldade.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-8 bg-neutral-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Gauge className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                  {difficulty
                    ? "Editar Grau de Dificuldade"
                    : "Novo Grau de Dificuldade"}
                </DialogTitle>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Configurar complexidade e impacto
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Nome do Nível
              </Label>
              <Input
                {...register("name")}
                placeholder="Ex: Hiper-Realismo Crítico"
                className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] uppercase font-bold">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Multiplicador de Complexidade
              </Label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <Input
                  {...register("multiplier")}
                  type="number"
                  step="0.05"
                  placeholder="1.50"
                  className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 tabular-nums"
                />
              </div>
              {errors.multiplier && (
                <p className="text-red-500 text-[10px] uppercase font-bold">
                  {errors.multiplier.message}
                </p>
              )}
              <p className="text-[9px] font-bold text-neutral-400 uppercase">
                Impacto direto no cálculo de horas totais por imagem.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Critérios de Avaliação
              </Label>
              <Textarea
                {...register("criteria")}
                placeholder="Descreva o que define este nível de dificuldade (ex: vegetação densa, muitos reflexos...)"
                className="min-h-[100px] rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 p-4"
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
              className="flex-1 gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-black/10 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Nível
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
