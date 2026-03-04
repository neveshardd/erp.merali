"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  useCreateCheckout,
  useDeleteInvoice,
  useInvoices,
} from "@/hooks/use-invoices";
import { CopyLinkButton } from "./copy-link-button";
import { InvoiceDetailModal } from "./invoice-detail-modal";
import { InvoiceModal } from "./invoice-modal";
import { PaymentMethodModal } from "./payment-method-modal";

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null,
  );
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [pendingCheckoutId, setPendingCheckoutId] = React.useState<
    string | null
  >(null);

  const { data: invoices = [], isLoading } = useInvoices();
  const deleteInvoice = useDeleteInvoice();
  const createCheckout = useCreateCheckout();

  const handleCheckout = (id: string) => {
    setPendingCheckoutId(id);
    setPaymentModalOpen(true);
  };

  const executeCheckout = async (gateway: "stripe" | "mercadopago") => {
    if (!pendingCheckoutId) return;
    try {
      const data = await createCheckout.mutateAsync({
        id: pendingCheckoutId,
        gateway,
      });
      if (data.url) {
        window.open(data.url, "_blank");
        setPaymentModalOpen(false);
      }
    } catch (_error) {
      toast.error("Erro ao gerar link de pagamento");
    }
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteInvoice.mutateAsync(pendingDeleteId);
      toast.success("Fatura excluída com sucesso!");
      setConfirmDeleteOpen(false);
    } catch (_error) {
      toast.error("Erro ao excluir fatura");
    }
  };

  const filteredInvoices = invoices.filter(
    (i: any) =>
      i.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.budget?.projectName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: invoices.reduce((acc: number, curr: any) => acc + curr.amount, 0),
    pending: invoices
      .filter((i: any) => i.status === "PENDING")
      .reduce((acc: number, curr: any) => acc + curr.amount, 0),
    paid: invoices
      .filter((i: any) => i.status === "PAID")
      .reduce((acc: number, curr: any) => acc + curr.amount, 0),
  };

  if (isLoading) {
    // Keeping this section empty as we're handling loading in the table
  }

  return (
    <main className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">
            Faturamento & Cobrança
          </h1>
          <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">
            Gestão de faturas e pagamentos via Mercado Pago
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
          >
            <Plus className="w-4 h-4" /> Nova Fatura
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl bg-white dark:bg-neutral-900/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                Total Faturado
              </span>
            </div>
            <p className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats.total)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl bg-white dark:bg-neutral-900/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                Pendente
              </span>
            </div>
            <p className="text-2xl font-black tracking-tighter text-amber-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats.pending)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl bg-white dark:bg-neutral-900/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                Recebido
              </span>
            </div>
            <p className="text-2xl font-black tracking-tighter text-emerald-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats.paid)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Pesquisar por cliente, projeto ou ID..."
            className="h-12 pl-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="h-12 gap-2 font-bold uppercase tracking-widest text-[10px] rounded-xl border-neutral-200 shadow-none px-6"
        >
          <Filter className="w-4 h-4" /> Filtros
        </Button>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
            <TableRow>
              <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">
                ID / Projeto
              </TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">
                Cliente
              </TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">
                Vencimento
              </TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">
                Valor
              </TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">
                Status
              </TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
                    <span className="font-bold uppercase tracking-widest text-[10px] text-neutral-400">
                      Carregando faturas...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((i: any) => (
                <TableRow
                  key={i.id}
                  className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <TableCell className="font-black text-xs uppercase text-neutral-900 dark:text-white py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-neutral-400">
                        #{i.id.slice(-6).toUpperCase()}
                      </span>
                      <span>{i.budget?.projectName || "Serviços"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-neutral-500 uppercase">
                    {i.client.name}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase">
                      <Calendar className="w-3.5 h-3.5 opacity-40" />
                      {format(new Date(i.dueDate), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-black text-xs text-neutral-900 dark:text-white">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(i.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 ${i.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : i.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                    >
                      {i.status === "PAID"
                        ? "Pago"
                        : i.status === "PENDING"
                          ? "Pendente"
                          : i.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {i.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-neutral-400 hover:text-blue-600 cursor-pointer"
                            onClick={() => handleCheckout(i.id)}
                            title="Abrir Checkout"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </Button>
                          <CopyLinkButton invoiceId={i.id} />
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-neutral-400 cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl border-neutral-200 dark:border-neutral-800 p-1"
                        >
                          <DropdownMenuItem
                            className="gap-2 font-bold uppercase tracking-widest text-[9px] cursor-pointer rounded-lg p-3"
                            onClick={() => {
                              setSelectedInvoice(i);
                              setDetailModalOpen(true);
                            }}
                          >
                            <FileText className="w-3.5 h-3.5" /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 font-bold uppercase tracking-widest text-[9px] cursor-pointer rounded-lg p-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDelete(i.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Excluir Fatura
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
        {!isLoading && filteredInvoices.length === 0 && (
          <div className="py-20 text-center text-neutral-500 flex flex-col items-center gap-2">
            <Search className="w-8 h-8 opacity-20" />
            <span className="font-bold uppercase tracking-widest text-[10px]">
              Nenhuma fatura encontrada
            </span>
          </div>
        )}
      </Card>

      <InvoiceModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <InvoiceDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        invoice={selectedInvoice}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={executeDelete}
        title="Excluir Fatura?"
        description="Esta ação removerá permanentemente a fatura e o link de pagamento associado."
      />

      <PaymentMethodModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        onSelect={executeCheckout}
        isLoading={createCheckout.isPending}
      />
    </main>
  );
}
