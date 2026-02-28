"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Image as ImageIcon, Loader2, Save } from "lucide-react";
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
import { useCreateImageType, useUpdateImageType } from "@/hooks/use-settings";
import { type ImageTypeInput, imageTypeSchema } from "@/schemas/settings";

interface ImageTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: any;
}

export function ImageTypeModal({
  open,
  onOpenChange,
  type,
}: ImageTypeModalProps) {
  const createMutation = useCreateImageType();
  const updateMutation = useUpdateImageType();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ImageTypeInput>({
    resolver: zodResolver(imageTypeSchema) as any,
    values: type
      ? {
          name: type.name,
          baseHours: type.baseHours,
          icon: type.icon || "Box",
          description: type.description || "",
        }
      : {
          name: "",
          baseHours: 1,
          icon: "Box",
          description: "",
        },
  });

  const selectedIcon = watch("icon");
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: ImageTypeInput) => {
    try {
      if (type) {
        await updateMutation.mutateAsync({ id: type.id, ...data });
        toast.success("Tipo de imagem atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Tipo de imagem criado com sucesso!");
      }
      onOpenChange(false);
      reset();
    } catch (_error) {
      toast.error("Erro ao salvar tipo de imagem.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-8 bg-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                  {type ? "Editar Tipo de Imagem" : "Novo Tipo de Imagem"}
                </DialogTitle>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Configurar categoria e horas base
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Nome da Categoria
              </Label>
              <Input
                {...register("name")}
                placeholder="Ex: Panorâmica 360"
                className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] uppercase font-bold">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                Horas Base de Produção
              </Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  {...register("baseHours")}
                  type="number"
                  placeholder="24"
                  className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 tabular-nums"
                />
              </div>
              {errors.baseHours && (
                <p className="text-red-500 text-[10px] uppercase font-bold">
                  {errors.baseHours.message}
                </p>
              )}
              <p className="text-[9px] font-bold text-neutral-400 uppercase">
                Tempo estimado para uma imagem padrão deste tipo.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Ícone Representativo
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {["Box", "Monitor", "Layout", "Camera"].map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setValue("icon", icon)}
                    className={`h-10 border rounded-lg flex items-center justify-center transition-colors ${
                      selectedIcon === icon
                        ? "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800"
                        : "border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-400"
                    }`}
                  >
                    <span className="text-[8px] font-black uppercase">
                      {icon}
                    </span>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("icon")} />
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
              className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-purple-500/10"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Categoria
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
