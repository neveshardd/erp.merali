"use client"

import { PDFDownloadLink } from "@react-pdf/renderer";

import { useParams } from "next/navigation"
import { useRef } from "react"
import {
    Printer,
    Download,
    ArrowLeft,
    MessageCircle,
    Mail,
    MapPin,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface BudgetPDFData {
    id: string
    code: string
    date: string
    validUntil: string
    projectName: string
    category: string | null
    deadline: string | null
    status: string
    totalValue: number
    clientTypeName: string
    client: {
        name: string
        company: string
        email: string
        phone: string
        taxId: string
    }
    items: Array<{
        id: string
        description: string
        quantity: number
        unitValue: number
        totalValue: number
    }>
    variableCosts: Array<{
        id: string
        description: string
        value: number
        date: string
    }>
}

import { BudgetPDFDocument } from "./document"

function useBudgetPDF(id: string) {
    return useQuery<BudgetPDFData>({
        queryKey: ["budget-pdf", id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/budgets/${id}/pdf`)
            return data
        },
        enabled: !!id,
    })
}

export default function BudgetPDFPage() {
    const params = useParams()
    const id = params.id as string
    const printRef = useRef<HTMLDivElement>(null)

    const { data: budget, isLoading } = useBudgetPDF(id)

    const handlePrint = () => {
        window.print()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Gerando Orçamento...</p>
                </div>
            </div>
        )
    }

    if (!budget) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Orçamento não encontrado.</p>
            </div>
        )
    }

    const totalVariableCosts = budget.variableCosts.reduce((s, c) => s + c.value, 0)
    const subtotal = budget.totalValue
    const total = subtotal + totalVariableCosts

    // Payment schedule: 50% on approval + 50% on delivery
    const paymentSchedule = [
        { description: "Entrada 50%", value: total * 0.5, date: "Aprovação" },
        { description: "Entrega Final 50%", value: total * 0.5, date: budget.deadline || "A combinar" },
    ]

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 p-4 md:p-8 pb-20 print:p-0 print:bg-white print:min-h-0">
            {/* Toolbar - Hidden in Print */}
            <div className="max-w-[21cm] mx-auto mb-8 flex justify-between items-center print:hidden">
                <Link
                    href={`/budgets/${id}`}
                    className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-3 h-3" /> Voltar ao Projeto
                </Link>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="gap-2 font-bold uppercase tracking-widest text-[10px] h-9 border-neutral-200 dark:border-neutral-800 cursor-pointer"
                    >
                        <Printer className="w-3.5 h-4" /> Imprimir
                    </Button>
                    
                    <PDFDownloadLink
                        document={<BudgetPDFDocument data={budget} />}
                        fileName={`${budget.code} - ${budget.projectName}.pdf`}
                    >
                        {({ loading }) => (
                            <Button
                                disabled={loading}
                                className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white gap-2 font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer"
                            >
                                <Download className="w-3.5 h-4" /> 
                                {loading ? "Gerando..." : "Baixar PDF"}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* A4 Paper — this is the ref that gets captured for PDF */}
            <div
                ref={printRef}
                className="max-w-[21cm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[29.7cm] p-[1.5cm] flex flex-col gap-10 text-neutral-900 relative overflow-hidden"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-900/5 -rotate-45 translate-x-16 -translate-y-16" />

                {/* Header */}
                <header className="flex justify-between items-start border-b-2 border-neutral-900 pb-8">
                    <div className="flex flex-col gap-4">
                        <Image src="/logo.png" alt="Merali Logo" width={80} height={80} className="rounded-xl" />
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Merali Studio de Visualização</span>
                            <span className="text-[9px] font-bold text-neutral-400">www.merali.com.br | contato@merali.com.br</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end text-right gap-1">
                        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Orçamento</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Código</span>
                            <span className="text-sm font-black tabular-nums">{budget.code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Emissão</span>
                            <span className="text-xs font-bold tabular-nums">{budget.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Validade</span>
                            <span className="text-xs font-bold tabular-nums">{budget.validUntil}</span>
                        </div>
                    </div>
                </header>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-12">
                    {/* Client Info */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Dados do Cliente</h2>
                        <div className="flex flex-col gap-1">
                            <span className="text-lg font-black uppercase tracking-tight leading-tight">{budget.client.name}</span>
                            {budget.client.company && (
                                <span className="text-xs font-bold text-neutral-500 uppercase">{budget.client.company}</span>
                            )}
                            {budget.client.taxId && (
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">CPF/CNPJ: {budget.client.taxId}</span>
                            )}
                            <div className="flex flex-col gap-2 mt-4">
                                {budget.client.email && (
                                    <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                                        <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                                        <span>{budget.client.email}</span>
                                    </div>
                                )}
                                {budget.client.phone && (
                                    <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                                        <MessageCircle className="w-3 h-3 text-neutral-400 shrink-0" />
                                        <span>{budget.client.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Project Info */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Informações do Projeto</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Projeto</span>
                                <span className="text-lg font-black uppercase tracking-tight text-neutral-900">{budget.projectName}</span>
                            </div>
                            {budget.deadline && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Prazo</span>
                                    <span className="text-xs font-bold text-neutral-700">{budget.deadline}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Services / Items Table */}
                {budget.items.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Discriminação de Serviços / Visualização</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-neutral-900">
                                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400">Serviço</th>
                                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-center">Qtd</th>
                                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Unitário</th>
                                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-900 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budget.items.map((item, i) => (
                                    <tr key={item.id} className="border-b border-neutral-100">
                                        <td className="py-4">
                                            <span className="text-sm font-black uppercase tracking-tight text-neutral-900">{item.description}</span>
                                        </td>
                                        <td className="py-4 text-xs font-bold text-neutral-500 text-center tabular-nums">{item.quantity}</td>
                                        <td className="py-4 text-xs font-bold text-neutral-500 text-right tabular-nums">
                                            {formatCurrency(item.unitValue)}
                                        </td>
                                        <td className="py-4 text-sm font-black text-neutral-900 text-right tabular-nums">
                                            {formatCurrency(item.totalValue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Variable Costs Table */}
                {budget.variableCosts.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Custos Adicionais / Deslocamento</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-neutral-900">
                                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400">Descrição</th>
                                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-center">Data</th>
                                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-900 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budget.variableCosts.map((item, i) => (
                                    <tr key={item.id} className="border-b border-neutral-100">
                                        <td className="py-4">
                                            <span className="text-sm font-black uppercase tracking-tight text-neutral-900">{item.description}</span>
                                        </td>
                                        <td className="py-4 text-xs font-bold text-neutral-500 uppercase text-center tabular-nums">{item.date}</td>
                                        <td className="py-4 text-sm font-black text-neutral-900 text-right tabular-nums">
                                            {formatCurrency(item.value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Totals and Observations */}
                <div className="grid grid-cols-2 gap-12 mt-auto">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Observações</h2>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase leading-relaxed tracking-wider">
                            O prazo de entrega inicia após a aprovação do orçamento e o envio de todo o material técnico necessário.
                            Valores sujeitos a revisão mediante alterações de escopo.
                        </p>

                        <div className="mt-6 flex flex-col gap-4">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Cronograma de Pagamento</h2>
                            <div className="flex flex-col gap-2">
                                {paymentSchedule.map((p, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase bg-neutral-50 p-2 border border-neutral-100">
                                        <div className="flex flex-col">
                                            <span className="text-neutral-900">{p.description}</span>
                                            <span className="text-neutral-400 text-[8px]">{p.date}</span>
                                        </div>
                                        <span className="text-neutral-900 tabular-nums">{formatCurrency(p.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Totals box */}
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-3 p-8 bg-neutral-900 text-white rounded-2xl">
                            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Base do Projeto</span>
                                <span className="text-sm font-bold tabular-nums">{formatCurrency(subtotal)}</span>
                            </div>
                            {totalVariableCosts > 0 && (
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Custos Adicionais</span>
                                    <span className="text-sm font-bold tabular-nums">{formatCurrency(totalVariableCosts)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Desconto</span>
                                <span className="text-sm font-bold tabular-nums text-emerald-400">- R$ 0,00</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Total</span>
                                <span className="text-3xl font-black tabular-nums tracking-tighter">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="mt-12 flex flex-col items-center gap-2">
                            <div className="w-full h-px bg-neutral-200" />
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                                Merali Studio | {budget.date}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-auto pt-8 border-t border-neutral-100 flex justify-between items-center">
                    <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">Documento gerado eletronicamente por Merali ERP</span>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-neutral-900 rounded-full" />
                            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{budget.code}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-neutral-200 rounded-full" />
                            <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">Pág 01/01</span>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Print CSS */}
            <style>{`
                @media print {
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    main, .print\\:hidden {
                        display: none !important;
                    }
                    nav, aside, header, .no-print {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    )
}
