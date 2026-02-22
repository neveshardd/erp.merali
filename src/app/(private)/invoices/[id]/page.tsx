"use client"

import * as React from "react"
import { 
    CreditCard, 
    Calendar, 
    ArrowLeft, 
    CheckCircle2, 
    Clock,
    ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import axios from "axios"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function PublicInvoicePage() {
    const params = useParams()
    const id = params.id as string

    const { data: invoice, isLoading, error } = useQuery({
        queryKey: ["public-invoice", id],
        queryFn: async () => {
            const response = await axios.get(`/api/invoices/${id}`)
            return response.data
        }
    })

    const handleCheckout = async () => {
        try {
            const { data } = await axios.post(`/api/invoices/${id}/checkout`)
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            toast.error("Erro ao iniciar pagamento. Tente novamente.")
        }
    }

    if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-xs tracking-widest opacity-30 text-neutral-900 dark:text-white">Carregando Fatura...</div>
    
    if (error || !invoice) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-xs tracking-widest text-red-500">Fatura não encontrada.</div>

    const isPaid = invoice.status === 'PAID'

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 md:p-12 flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full"
            >
                <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white dark:bg-neutral-900 leading-tight">
                    {/* Header Banner */}
                    <div className={`p-8 text-white flex flex-col items-center justify-center gap-2 ${isPaid ? 'bg-emerald-500' : 'bg-neutral-900'}`}>
                        {isPaid ? <CheckCircle2 className="w-12 h-12" /> : <Clock className="w-12 h-12 text-amber-500" />}
                        <h1 className="text-xl font-black uppercase tracking-tighter mt-2">
                            {isPaid ? "Fatura Paga" : "Fatura Pendente"}
                        </h1>
                        <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">#{id.slice(-6).toUpperCase()}</span>
                    </div>

                    <CardContent className="p-8 md:p-12">
                        {/* Project Info */}
                        <div className="flex flex-col gap-1 mb-10 text-center">
                            <span className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.3em]">Referente ao Projeto</span>
                            <h2 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase">
                                {invoice.budget?.projectName || "Serviços Digitais"}
                            </h2>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="flex flex-col gap-2">
                                <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Cliente</span>
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-black">
                                        {invoice.client?.name?.[0].toUpperCase()}
                                    </div>
                                    <span className="font-bold text-xs uppercase text-neutral-900 dark:text-white">{invoice.client?.name}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Vencimento</span>
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-neutral-400" />
                                    <span className="font-bold text-xs uppercase text-neutral-900 dark:text-white">
                                        {format(new Date(invoice.dueDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Total Section */}
                        <div className="p-8 bg-neutral-900 dark:bg-black rounded-[30px] text-white flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black uppercase opacity-40 tracking-widest text-center md:text-left">Valor Total</span>
                                <span className="text-4xl font-black tabular-nums">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.amount)}
                                </span>
                            </div>
                            {!isPaid && (
                                <Button 
                                    onClick={handleCheckout}
                                    className="h-14 px-8 bg-white text-neutral-900 hover:bg-neutral-100 font-bold uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-white/5 cursor-pointer w-full md:w-auto"
                                >
                                    <CreditCard className="w-4 h-4 mr-2" /> Pagar Agora
                                </Button>
                            )}
                        </div>

                        {/* Security Footer */}
                        <div className="flex items-center justify-center gap-2 opacity-30">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Pagamento seguro via Stripe</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Return Link */}
                <div className="mt-8 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                       <ArrowLeft className="w-3 h-3" /> Voltar ao ERP
                    </Link>
                </div>
            </motion.div>
        </main>
    )
}
