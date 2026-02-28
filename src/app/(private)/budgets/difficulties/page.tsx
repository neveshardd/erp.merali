"use client";

import {
  AlertTriangle,
  Flame,
  Gauge,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Zap,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteDifficulty, useDifficulties } from "@/hooks/use-settings";
import { DifficultyModal } from "./difficulty-modal";

export default function DifficultiesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<any>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null,
  );

  const { data: difficulties = [], isLoading } = useDifficulties();
  const deleteMutation = useDeleteDifficulty();

  const filteredDifficulties = difficulties.filter((diff: any) =>
    diff.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEdit = (difficulty: any) => {
    setSelectedDifficulty(difficulty);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteMutation.mutateAsync(pendingDeleteId);
      toast.success("Nível de dificuldade excluído com sucesso!");
      setConfirmDeleteOpen(false);
    } catch (_error) {
      toast.error("Erro ao excluir nível de dificuldade.");
    }
  };

  const getIcon = (index: number) => {
    const icons = [Zap, Gauge, AlertTriangle, Flame];
    return icons[index % icons.length];
  };

  const getColors = (index: number) => {
    const colors = [
      { color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
      { color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
      { color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10" },
      { color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/10" },
    ];
    return colors[index % colors.length];
  };

  return (
    <main className="flex flex-col gap-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">
            Graus de Dificuldade
          </h1>
          <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">
            Níveis de complexidade técnica e seus multiplicadores
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedDifficulty(null);
            setIsModalOpen(true);
          }}
          className="gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
        >
          <Plus className="w-4 h-4" /> Novo Nível
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder="BUSCAR NÍVEL DE DIFICULDADE..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl text-[10px] font-black uppercase tracking-widest"
        />
      </div>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
          </div>
        ) : (
          filteredDifficulties.map((diff: any, i: number) => {
            const style = getColors(i);
            const Icon = getIcon(i);
            const multiplier = Number(diff.multiplier);
            return (
              <Card
                key={diff.id}
                className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm group hover:border-neutral-900 dark:hover:border-white transition-all"
              >
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <div
                      className={`w-24 h-24 sm:w-32 sm:h-32 ${style.bg} ${style.color} flex items-center justify-center border-r border-neutral-100 dark:border-neutral-800 shrink-0`}
                    >
                      <Icon className="w-8 h-8 sm:w-12 sm:h-12" />
                    </div>
                    <div className="p-6 sm:p-8 flex flex-1 justify-between items-center gap-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black uppercase text-neutral-900 dark:text-white leading-none">
                            {diff.name}
                          </h3>
                          <Badge
                            className={`text-[9px] font-black uppercase tracking-widest ${style.bg} ${style.color} border-none shadow-none`}
                          >
                            Multiplicador: {multiplier.toFixed(2)}x
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-neutral-400 uppercase leading-relaxed max-w-xl">
                          {diff.criteria || "Sem critérios definidos"}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1">
                            Impacto Financeiro
                          </span>
                          <span
                            className={`text-2xl font-black tabular-nums ${multiplier > 1 ? "text-orange-500" : multiplier < 1 ? "text-emerald-500" : "text-blue-500"}`}
                          >
                            {multiplier > 1
                              ? `+${Math.round((multiplier - 1) * 100)}%`
                              : multiplier < 1
                                ? `-${Math.round((1 - multiplier) * 100)}%`
                                : "Base"}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                            onClick={() => handleEdit(diff)}
                          >
                            <Pencil className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 text-neutral-400 hover:text-red-600 cursor-pointer"
                            onClick={() => handleDelete(diff.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <DifficultyModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedDifficulty(null);
        }}
        difficulty={selectedDifficulty}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={executeDelete}
        title="Excluir Nível de Dificuldade?"
        description="Esta ação removerá este nível de complexidade e poderá afetar o cálculo de novos orçamentos."
      />
    </main>
  );
}
