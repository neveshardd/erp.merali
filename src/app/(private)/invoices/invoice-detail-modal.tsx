"use client"

import * as React from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
    Calendar, 
    CreditCard, 
    DollarSign, 
    User, 
    FileText, 
    Clock, 
    CheckCircle2, 
    ExternalLink,
    Building2,
    Hash
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { formatCurrency } from "@/lib/utils"

interface InvoiceDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    invoice: any
}

export function InvoiceDetailModal({ open, onOpenChange, invoice }: InvoiceDetailModalProps) {
    if (!invoice) return null

    const details = invoice.paymentDetails as any
    const isPaid = invoice.status === 'PAID'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl border-none shadow-2xl rounded-[32px] p-0 overflow-hidden bg-white dark:bg-neutral-900 leading-tight">
                {/* Visual Header */}
                <div className={`p-10 text-white ${isPaid ? 'bg-emerald-500' : 'bg-neutral-900'} relative overflow-hidden`}>
                    <div className="relative z-10 flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                            {isPaid ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7 text-amber-500" />}
                        </div>
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                                {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
                            </DialogTitle>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Fatura #{invoice.id.slice(-8).toUpperCase()}</span>
                        </div>
                    </div>
                    {/* Abstract background element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                </div>

                <div className="p-8 space-y-10">
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                        <InfoBlock icon={User} label="Cliente" value={invoice.client?.name} />
                        <InfoBlock icon={FileText} label="Projeto" value={invoice.budget?.projectName || 'Serviços'} />
                        <InfoBlock icon={Calendar} label="Vencimento" value={format(new Date(invoice.dueDate), "dd MMM, yyyy", { locale: ptBR })} />
                        <InfoBlock icon={DollarSign} label="Valor Total" value={formatCurrency(invoice.amount)} highlighted />
                    </div>

                    {/* Payment Specs Section */}
                    {isPaid && (
                        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800">
                             <h3 className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] mb-6 flex items-center gap-2">
                                <CreditCard className="w-3 h-3" /> Detalhes da Transação
                             </h3>
                             
                             <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-[24px] p-6 space-y-4">
                                <DetailRow label="Método de Pagamento" value={invoice.paymentMethod?.split('_').join(' ') || '---'} />
                                {invoice.paidAt && (
                                    <DetailRow label="Data do Pagamento" value={format(new Date(invoice.paidAt), "dd/MM/yyyy 'às' HH:mm")} />
                                )}
                                
                                {details && (
                                    <>
                                        <div className="h-px bg-neutral-200/50 dark:bg-neutral-700/50 my-2" />
                                        {details.installments && (
                                            <DetailRow label="Parcelamento" value={`${details.installments}x Sem Juros`} />
                                        )}
                                        {details.card && (
                                            <DetailRow label="Cartão Utilizado" value={`${details.card.brand} •••• ${details.card.last4 || details.card.last_four_digits}`} />
                                        )}
                                        {details.transaction_details?.total_paid_amount && (
                                            <DetailRow label="Total Processado" value={formatCurrency(details.transaction_details.total_paid_amount)} />
                                        )}
                                        <DetailRow label="ID de Referência" value={invoice.stripeId || invoice.mercadopagoId} isCode />
                                    </>
                                )}
                             </div>
                        </div>
                    )}

                    {!isPaid && (
                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/20 flex gap-4 items-start">
                            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase">Cobrança Pendente</span>
                                <p className="text-[10px] font-bold text-amber-700/70 dark:text-amber-400/70 uppercase leading-relaxed max-w-[320px]">
                                    O link de pagamento foi enviado ao cliente. Os detalhes da transação aparecerão aqui assim que o pagamento for confirmado.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function InfoBlock({ icon: Icon, label, value, highlighted = false }: { icon: any, label: string, value: string, highlighted?: boolean }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-1.5">
                <Icon className="w-2.5 h-2.5 opacity-50" /> {label}
            </span>
            <span className={`text-xs font-black uppercase tracking-tight truncate ${highlighted ? 'text-emerald-600 dark:text-emerald-400 text-sm' : 'text-neutral-900 dark:text-white'}`}>
                {value || '---'}
            </span>
        </div>
    )
}

function DetailRow({ label, value, isCode = false }: { label: string, value: any, isCode?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{label}</span>
            <span className={`text-[10px] font-black uppercase text-neutral-900 dark:text-white tabular-nums ${isCode ? 'bg-neutral-200/50 dark:bg-neutral-700/50 px-2 py-0.5 rounded text-[8px] font-mono' : ''}`}>
                {value || '---'}
            </span>
        </div>
    )
}

