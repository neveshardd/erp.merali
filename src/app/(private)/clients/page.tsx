"use client";

import {
  Briefcase,
  Building2,
  ExternalLink,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner"; // Added
import { ConfirmModal } from "@/components/confirm-modal"; // Added
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClients, useDeleteClient } from "@/hooks/use-clients"; // Modified
import { ClientModal } from "./client-modal";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<any>(null);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null,
  ); // Added
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false); // Added

  const { data: clients = [], isLoading } = useClients(); // Modified: removed error
  const deleteClient = useDeleteClient(); // Added

  const filteredClients = clients.filter(
    (
      client: any, // Modified: c to client
    ) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company || "").toLowerCase().includes(searchQuery.toLowerCase()), // Modified: c.company to client.company
  );

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  // Added handleDelete function
  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  // Added executeDelete function
  const executeDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteClient.mutateAsync(pendingDeleteId);
      toast.success("Cliente removido com sucesso!");
      setConfirmDeleteOpen(false);
    } catch (_error) {
      toast.error("Erro ao remover cliente.");
    }
  };

  if (isLoading) {
    // Optionally return null or a skeleton if you want to keep the header visible.
    // For now I'll just remove the early return to show the page structure.
  }
  // Removed: if (error) return <div className="p-6">Erro ao carregar clientes.</div>

  return (
    <main className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">
            Clientes & Contatos
          </h1>
          <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">
            Gestão de base de clientes e parcerias
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
        >
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Clientes",
            value: clients.length,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/10",
          },
          {
            label: "Pessoas Jurídicas",
            value: clients.filter((c: any) => c.taxId?.length > 11).length,
            icon: Building2,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-900/10",
          },
          {
            label: "Pessoas Físicas",
            value: clients.filter((c: any) => c.taxId?.length <= 11).length,
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/10",
          },
          {
            label: "Projetos Ativos",
            value: 0,
            icon: Briefcase,
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-900/10",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none bg-white dark:bg-neutral-900 shadow-sm rounded-2xl overflow-hidden"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">
                  {stat.label}
                </span>
                <span className="text-2xl font-black text-neutral-900 dark:text-white leading-none">
                  {stat.value}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter and Table */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Buscar por nome, empresa ou e-mail..."
            className="h-12 pl-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
              <TableRow>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">
                  Cliente
                </TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">
                  Empresa / Tipo
                </TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">
                  Contato
                </TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-center">
                  Projetos
                </TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-neutral-400">
                        Carregando clientes...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client: any) => (
                  <TableRow
                    key={client.id}
                    className="group hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black uppercase text-neutral-900 dark:text-white">
                          {client.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="w-fit text-[8px] font-bold uppercase tracking-widest px-1.5 py-0 border-neutral-200 dark:border-neutral-700"
                        >
                          ID: {client.id.padStart(3, "0")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase">
                          {client.company}
                        </span>
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                          {client.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                          <Mail className="w-3 h-3" /> {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                          <Phone className="w-3 h-3" /> {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-black tabular-nums text-neutral-900 dark:text-white">
                      {client.projects}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                          onClick={() => handleEdit(client)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl border-neutral-200 dark:border-neutral-800"
                          >
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                              Opções do Cliente
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest gap-2 cursor-pointer">
                              <ExternalLink className="w-3.5 h-3.5" /> Ver
                              Histórico
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest gap-2 cursor-pointer">
                              <Plus className="w-3.5 h-3.5" /> Novo Projeto
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-[10px] font-bold uppercase tracking-widest gap-2 text-red-600 cursor-pointer"
                              onClick={() => handleDelete(client.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir Cliente
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!isLoading && filteredClients.length === 0 && (
            <div className="py-20 text-center text-neutral-500 flex flex-col items-center gap-2">
              <Search className="w-8 h-8 opacity-20" />
              <span className="font-bold uppercase tracking-widest text-[10px]">
                Nenhum cliente encontrado
              </span>
            </div>
          )}
        </Card>
      </div>

      <ClientModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={selectedClient}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={executeDelete}
        title="Excluir Cliente?"
        description="Esta ação removerá permanentemente o cliente e todos os dados de contato associados."
      />
    </main>
  );
}
