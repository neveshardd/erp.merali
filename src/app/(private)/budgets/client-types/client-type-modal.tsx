"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Users } from "lucide-react";
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
import { useCreateClientType, useUpdateClientType } from "@/hooks/use-settings";
import { type ClientTypeInput, clientTypeSchema } from "@/schemas/settings";

interface ClientTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: any;
}

export function ClientTypeModal({
  open,
  onOpenChange,
  type,
}: ClientTypeModalProps) {
  const createMutation = useCreateClientType();
  const updateMutation = useUpdateClientType();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientTypeInput>({
    resolver: zodResolver(clientTypeSchema) as any,
    values: type
      ? {
          name: type.name,
          multiplier: type.multiplier,
          description: type.description || "",
        }
      : {
          name: "",
          multiplier: 1,
          description: "",
        },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: ClientTypeInput) => {
    try {
      if (type) {
        await updateMutation.mutateAsync({ id: type.id, ...data });
        toast.success("Tipo de cliente atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Tipo de cliente criado com sucesso!");
      }
      onOpenChange(false);
      reset();
    } catch (_error) {
      toast.error("Erro ao salvar tipo de cliente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-8 bg-blue-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                  {type ? "Editar Tipo de Cliente" : "Novo Tipo de Cliente"}
                </DialogTitle>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Configurar perfil e multiplicador
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Nome do Tipo
              </Label>
              <Input
                {...register("name")}
                placeholder="Ex: Incorporadoras GIG"
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
                Multiplicador de Preço
              </Label>
              <Input
                {...register("multiplier")}
                type="number"
                step="0.01"
                placeholder="1.25"
                className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 tabular-nums"
              />
              {errors.multiplier && (
                <p className="text-red-500 text-[10px] uppercase font-bold">
                  {errors.multiplier.message}
                </p>
              )}
              <p className="text-[9px] font-bold text-neutral-400 uppercase">
                Use 1.00 para preço base. Ex: 1.25 adiciona 25% ao valor.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Descrição Interna
              </Label>
              <Textarea
                {...register("description")}
                placeholder="Descreva as características deste perfil de cliente..."
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
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-blue-500/10"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Perfil
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
