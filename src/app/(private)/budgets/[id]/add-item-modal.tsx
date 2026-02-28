"use client";

import { Loader2 } from "lucide-react";
import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBudgetRates,
  useCreateBudgetItem,
  useDifficulties,
  useImageTypes,
  useUpdateBudgetItem,
} from "@/hooks/use-budget-items";
import { formatCurrency } from "@/lib/utils";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetId: string;
  item?: any; // Optional item for editing
}

export function AddItemModal({
  open,
  onOpenChange,
  budgetId,
  item,
}: AddItemModalProps) {
  const { data: imageTypes = [], isLoading: loadingTypes } = useImageTypes();
  const { data: difficulties = [], isLoading: loadingDiffs } =
    useDifficulties();
  const { data: rates } = useBudgetRates(budgetId);
  const createItem = useCreateBudgetItem(budgetId);
  const updateItem = useUpdateBudgetItem(budgetId);

  const [description, setDescription] = React.useState("");
  const [imageTypeName, setImageTypeName] = React.useState("");
  const [difficultyName, setDifficultyName] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);

  // Sync state for editing
  React.useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setImageTypeName(item.imageTypeName || "");
      setDifficultyName(item.difficultyName || "");
      setQuantity(item.quantity || 1);
    } else {
      setDescription("");
      setImageTypeName("");
      setDifficultyName("");
      setQuantity(1);
    }
  }, [item]);

  // Derived values
  const selectedType = imageTypes.find((t) => t.name === imageTypeName);
  const selectedDiff = difficulties.find((d) => d.name === difficultyName);
  const baseHoursUnit = selectedType?.baseHours ?? 1;
  const diffMultiplier = selectedDiff?.multiplier ?? 1;
  const estimatedHours = baseHoursUnit * diffMultiplier;
  const hourlyRate = rates?.hourlyRate ?? 0;
  const profitMargin = rates?.profitMargin ?? 0;
  const multiplier = rates?.multiplier ?? 1;
  const unitValue =
    estimatedHours * hourlyRate * multiplier * (1 + profitMargin / 100);
  const totalValue = unitValue * quantity;

  const handleSave = async () => {
    if (!description.trim()) {
      toast.error("Informe a identificação da imagem.");
      return;
    }
    if (!imageTypeName) {
      toast.error("Selecione o tipo de imagem.");
      return;
    }
    if (!difficultyName) {
      toast.error("Selecione a dificuldade.");
      return;
    }

    try {
      const data = {
        description,
        imageTypeName,
        difficultyName,
        difficultyMultiplier: diffMultiplier,
        baseHoursUnit,
        estimatedHours,
        quantity,
        unitValue: parseFloat(unitValue.toFixed(2)),
        totalValue: parseFloat(totalValue.toFixed(2)),
      };

      if (item) {
        await updateItem.mutateAsync({ itemId: item.id, ...data });
        toast.success("Item atualizado!");
      } else {
        await createItem.mutateAsync(data);
        toast.success("Item adicionado!");
      }
      onOpenChange(false);
    } catch {
      toast.error("Erro ao salvar item.");
    }
  };

  const inputClass =
    "h-11 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 font-bold text-neutral-900 dark:text-neutral-100 focus-visible:ring-neutral-900 dark:focus-visible:ring-white transition-all rounded-lg";
  const labelClass =
    "text-[10px] uppercase font-bold text-neutral-400 tracking-widest";
  const selectTriggerClass =
    "h-11 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 font-bold text-neutral-900 dark:text-neutral-100 focus:ring-neutral-900 dark:focus:ring-white rounded-lg";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 border-none shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-neutral-900">
        <DialogHeader className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
          <DialogTitle className="text-lg font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
            {item ? "Editar Item" : "Adicionar Item de Produção"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 flex flex-col gap-5">
          {/* Identificação */}
          <div className="grid gap-2">
            <Label className={labelClass}>Identificação da Imagem</Label>
            <Input
              placeholder="Ex: Fachada Principal - Render Noturno"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Imagem */}
            <div className="grid gap-2">
              <Label className={labelClass}>Tipo de Imagem</Label>
              {loadingTypes ? (
                <div className="h-11 flex items-center px-4">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                </div>
              ) : (
                <Select value={imageTypeName} onValueChange={setImageTypeName}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl rounded-xl">
                    {imageTypes.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.name}
                        className="font-bold text-xs uppercase py-3"
                      >
                        {t.name}{" "}
                        <span className="text-neutral-400 normal-case font-medium">
                          ({t.baseHours}h)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Dificuldade */}
            <div className="grid gap-2">
              <Label className={labelClass}>Dificuldade</Label>
              {loadingDiffs ? (
                <div className="h-11 flex items-center px-4">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                </div>
              ) : (
                <Select
                  value={difficultyName}
                  onValueChange={setDifficultyName}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl rounded-xl">
                    {difficulties.map((d) => (
                      <SelectItem
                        key={d.id}
                        value={d.name}
                        className="font-bold text-xs uppercase py-3"
                      >
                        {d.name}{" "}
                        <span className="text-neutral-400 normal-case font-medium">
                          ({d.multiplier}x)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Quantidade */}
          <div className="grid gap-2">
            <Label className={labelClass}>Quantidade</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className={inputClass}
            />
          </div>

          {/* Preview card */}
          {imageTypeName && difficultyName && (
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Cálculo do Item
              </span>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                    Horas Estimadas
                  </span>
                  <span className="text-lg font-black text-neutral-900 dark:text-white tabular-nums">
                    {estimatedHours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                    Unitário
                  </span>
                  <span className="text-lg font-black text-neutral-900 dark:text-white tabular-nums">
                    {formatCurrency(unitValue)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                    Total
                  </span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-neutral-50/50 dark:bg-neutral-800/20 border-t border-neutral-100 dark:border-neutral-800 flex sm:justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="font-bold uppercase tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={createItem.isPending || updateItem.isPending}
            className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest px-8 rounded-lg shadow-none transition-all active:scale-95 h-11 cursor-pointer gap-2"
          >
            {createItem.isPending || updateItem.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : item ? (
              "Atualizar Item"
            ) : (
              "Adicionar Item"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
