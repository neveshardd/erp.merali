import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, Layout, Loader2, Save } from "lucide-react";
import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBudget, useUpdateBudget } from "@/hooks/use-budgets";
import { useClients } from "@/hooks/use-clients";
import { useClientTypes } from "@/hooks/use-settings";
import { type BudgetInput, budgetSchema } from "@/schemas/budget";

interface BudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: any;
}

export function BudgetModal({ open, onOpenChange, budget }: BudgetModalProps) {
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const { data: clients = [] } = useClients();
  const { data: clientTypes = [] } = useClientTypes();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      projectName: "",
      clientId: "",
      clientTypeName: "",
      category: "Residencial",
      deadline: "",
      status: "PENDING",
      paymentTerms: "HALF_HALF",
      totalValue: 0,
    },
  });

  useEffect(() => {
    if (budget) {
      reset({
        projectName: budget.projectName,
        clientId: budget.clientId,
        clientTypeName: budget.clientTypeName,
        category: budget.category || "Residencial",
        deadline: budget.deadline || "",
        status: budget.status,
        paymentTerms: budget.paymentTerms || "HALF_HALF",
        totalValue: budget.totalValue || 0,
      });
    } else {
      reset({
        projectName: "",
        clientId: "",
        clientTypeName: "",
        category: "Residencial",
        deadline: "",
        status: "PENDING",
        paymentTerms: "HALF_HALF",
        totalValue: 0,
      });
    }
  }, [budget, reset]);

  const onSubmit = async (formData: BudgetInput) => {
    try {
      const { totalValue, ...data } = formData;
      if (budget) {
        await updateMutation.mutateAsync({ id: budget.id, ...data });
        toast.success("Orçamento atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Orçamento criado com sucesso!");
      }
      onOpenChange(false);
    } catch (_error) {
      toast.error("Erro ao salvar orçamento.");
    }
  };

  const selectedClientId = watch("clientId");
  const selectedClientTypeName = watch("clientTypeName");
  const selectedCategory = watch("category");
  const selectedPaymentTerms = watch("paymentTerms");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-8 bg-neutral-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <FilePlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                  {budget ? "Editar Orçamento" : "Novo Orçamento Inteligente"}
                </DialogTitle>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  {budget
                    ? "Atualize os dados básicos do projeto"
                    : "Inicie um novo projeto Merali Studio"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Nome do Projeto
              </Label>
              <div className="relative">
                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  {...register("projectName")}
                  placeholder="Ex: Loft Industrial Ed. Horizonte"
                  className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 font-bold"
                />
              </div>
              {errors.projectName && (
                <p className="text-red-500 text-[10px] font-bold uppercase">
                  {errors.projectName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Selecionar Cliente
                </Label>
                <Select
                  value={selectedClientId}
                  onValueChange={(value) => setValue("clientId", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 font-bold">
                    <SelectValue placeholder="Busque por nome" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client: any) => (
                      <SelectItem
                        key={client.id}
                        value={client.id}
                        className="font-bold uppercase text-[10px]"
                      >
                        {client.name}{" "}
                        {client.company ? `(${client.company})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && (
                  <p className="text-red-500 text-[10px] font-bold uppercase">
                    {errors.clientId.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Perfil do Cliente
                </Label>
                <Select
                  value={selectedClientTypeName}
                  onValueChange={(value) => setValue("clientTypeName", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 font-bold">
                    <SelectValue placeholder="Tipo de Perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientTypes.map((type: any) => (
                      <SelectItem
                        key={type.id}
                        value={type.name}
                        className="font-bold uppercase text-[10px]"
                      >
                        {type.name} ({type.multiplier.toFixed(2)}x)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientTypeName && (
                  <p className="text-red-500 text-[10px] font-bold uppercase">
                    {errors.clientTypeName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Categoria do Projeto
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 font-bold">
                    <SelectValue placeholder="Escolha a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Residencial"
                      className="font-bold uppercase text-[10px]"
                    >
                      Residencial
                    </SelectItem>
                    <SelectItem
                      value="Comercial"
                      className="font-bold uppercase text-[10px]"
                    >
                      Comercial
                    </SelectItem>
                    <SelectItem
                      value="Urbanismo"
                      className="font-bold uppercase text-[10px]"
                    >
                      Urbanismo
                    </SelectItem>
                    <SelectItem
                      value="Interiores"
                      className="font-bold uppercase text-[10px]"
                    >
                      Interiores
                    </SelectItem>
                    <SelectItem
                      value="Design de Objeto"
                      className="font-bold uppercase text-[10px]"
                    >
                      Design de Objeto
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Prazo Estimado (Ex: 4 semanas)
                </Label>
                <Input
                  {...register("deadline")}
                  placeholder="Ex: 4 semanas"
                  className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 tabular-nums font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Condição de Pagamento
              </Label>
              <Select
                value={selectedPaymentTerms}
                onValueChange={(value) => setValue("paymentTerms", value as any)}
              >
                <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 font-bold">
                  <SelectValue placeholder="Escolha a condição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="HALF_HALF"
                    className="font-bold uppercase text-[10px]"
                  >
                    50% Entrada / 50% Entrega
                  </SelectItem>
                  <SelectItem
                    value="FULL"
                    className="font-bold uppercase text-[10px]"
                  >
                    Valor Total à Vista
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!budget && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-relaxed">
                  Ao criar o orçamento, você será direcionado para a tela de
                  composição de imagens, onde poderá definir quantidades e
                  dificuldades para o cálculo automático de horas.
                </p>
              </div>
            )}
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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-black/10"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {budget ? "Salvar Alterações" : "Criar e Continuar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
