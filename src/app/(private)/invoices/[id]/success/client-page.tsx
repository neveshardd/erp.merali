"use client"

import { PDFDownloadLink } from "@react-pdf/renderer";

import * as React from "react"
import { CheckCircle2, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import axios from "axios"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { InvoiceReceiptPDFDocument } from "./receipt-document"
import type { InvoiceReceiptPDFProps } from "./receipt-document"

export default function InvoiceSuccessPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const invoiceId = params.id as string
    const sessionId = searchParams.get('session_id') ?? ''

    const [invoice, setInvoice] = React.useState<Record<string, any> | null>(null)
    const [receiptData, setReceiptData] = React.useState<InvoiceReceiptPDFProps["data"] | null>(null)

    // Busca dados da fatura (para exibição no card)
    React.useEffect(() => {
        if (!invoiceId) return
        axios.get(`/api/invoices/${invoiceId}`)
            .then(res => setInvoice(res.data))
            .catch(() => {})
    }, [invoiceId])

    // Busca dados do recibo (para o PDF)
    React.useEffect(() => {
        if (!invoiceId) return
        const qs = sessionId ? `?session_id=${sessionId}` : ''
        axios.get(`/api/invoices/${invoiceId}/receipt${qs}`)
            .then(res => setReceiptData(res.data))
            .catch(() => {})
    }, [invoiceId, sessionId])

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

    const receiptFileName = receiptData
        ? `${receiptData.number}.pdf`
        : `recibo-${invoiceId.slice(-8).toUpperCase()}.pdf`

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="w-full rounded-[40px] overflow-hidden shadow-2xl bg-white dark:bg-neutral-900">

                    {/* ── Header verde ───────────────────────────────── */}
                    <div className="bg-emerald-500 w-full flex justify-center items-center py-12 text-white">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                        >
                            <CheckCircle2 className="w-20 h-20" />
                        </motion.div>
                    </div>

                    {/* ── Conteúdo ───────────────────────────────────── */}
                    <div className="p-10 flex flex-col gap-6 text-center">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase mb-2">
                                Pagamento Recebido!
                            </h1>
                            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
                                Sua fatura #{invoiceId.slice(-6).toUpperCase()} foi liquidada com sucesso.
                            </p>
                        </div>

                        {/* Detalhes */}
                        <div className="py-6 border-y border-neutral-100 dark:border-neutral-800 flex flex-col gap-4 text-left font-bold text-xs uppercase tracking-tight text-neutral-400">
                            <div className="flex justify-between items-center">
                                <span>Status</span>
                                <span className="text-emerald-500 font-black">Confirmado</span>
                            </div>
                            {invoice?.client?.name && (
                                <div className="flex justify-between items-center">
                                    <span>Cliente</span>
                                    <span className="text-neutral-900 dark:text-white font-black truncate max-w-[160px]">
                                        {invoice.client.name}
                                    </span>
                                </div>
                            )}
                            {invoice?.budget?.projectName && (
                                <div className="flex justify-between items-center">
                                    <span>Projeto</span>
                                    <span className="text-neutral-900 dark:text-white font-black truncate max-w-[160px]">
                                        {invoice.budget.projectName}
                                    </span>
                                </div>
                            )}
                            {invoice?.amount !== undefined && (
                                <div className="flex justify-between items-center">
                                    <span>Valor</span>
                                    <span className="text-neutral-900 dark:text-white font-black">
                                        {formatCurrency(invoice.amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span>ID Transação</span>
                                <span className="text-neutral-900 dark:text-white font-black truncate max-w-[150px]">
                                    {sessionId ? sessionId.slice(0, 20) + "..." : "---"}
                                </span>
                            </div>
                        </div>

                        {/* Botão de download */}
                        {receiptData ? (
                            <PDFDownloadLink
                                document={<InvoiceReceiptPDFDocument data={receiptData} />}
                                fileName={receiptFileName}
                            >
                                {({ loading }) => (
                                    <Button
                                        disabled={loading}
                                        className="h-14 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl w-full shadow-xl shadow-black/10 cursor-pointer"
                                    >
                                        {loading ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando PDF...</>
                                        ) : (
                                            <><Download className="w-4 h-4 mr-2" /> Baixar Recibo (PDF)</>
                                        )}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        ) : (
                            <Button
                                disabled
                                className="h-14 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl w-full shadow-xl shadow-black/10"
                            >
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparando Recibo...
                            </Button>
                        )}

                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em]">
                            Obrigado pela confiança em nosso trabalho!
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}
