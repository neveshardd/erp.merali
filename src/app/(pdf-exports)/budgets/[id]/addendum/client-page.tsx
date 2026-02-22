"use client"

import { PDFDownloadLink } from "@react-pdf/renderer";

import { useParams } from "next/navigation"
import { 
    Printer, 
    Download,
    ArrowLeft, 
    FilePlus,
    AlertCircle,
    FileText,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { formatCurrency } from "@/lib/utils"

import { AddendumPDFDocument } from "./document"

function useAddendum(id: string) {
    return useQuery({
        queryKey: ["addendum", id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/budgets/${id}/addendum`)
            return data
        },
        enabled: !!id,
    })
}

export default function ScopeAddendumPage() {
    const params = useParams()
    const id = params.id as string
    
    const { data: addendum, isLoading } = useAddendum(id)

    const handlePrint = () => window.print()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Gerando Aditivo de Escopo...</p>
                </div>
            </div>
        )
    }

    if (!addendum) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Aditivo não encontrado.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 p-4 md:p-8 pb-20 print:p-0 print:bg-white print:min-h-0">
            {/* Toolbar */}
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
                        document={<AddendumPDFDocument data={addendum} />}
                        fileName={`${addendum.number}.pdf`}
                    >
                        {({ loading }) => (
                            <Button 
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white gap-2 font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer"
                            >
                                <Download className="w-3.5 h-4" /> 
                                {loading ? "Gerando..." : "Baixar PDF"}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* A4 Paper */}
            <div className="max-w-[21cm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[29.7cm] p-[2cm] flex flex-col gap-10 text-neutral-900 relative border-t-8 border-emerald-500">
                
                {/* Header */}
                <header className="flex justify-between items-start">
                    <div className="flex flex-col gap-4">
                        <Image src="/logo.png" alt="Merali Logo" width={64} height={64} className="rounded-xl" />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Aditivo de Escopo</h1>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-1">Instrumento de Alteração Contratual</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end text-right gap-1">
                        <span className="text-sm font-black tracking-tighter">{addendum.number}</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Emissão: {addendum.date}</span>
                        <div className="mt-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 print:hidden">
                            <FilePlus className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Expansão de Projeto</span>
                        </div>
                    </div>
                </header>

                {/* Scope Info */}
                <div className="grid grid-cols-2 gap-8 text-left">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Referência Contratual</h2>
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-neutral-400" />
                                <span className="text-xs font-bold text-neutral-600 uppercase">Orçamento: {addendum.originalBudget}</span>
                            </div>
                            <p className="text-xs font-medium text-neutral-500 leading-relaxed uppercase">
                                Este aditivo altera o escopo de trabalho do projeto <strong>"{addendum.project}"</strong> para o cliente <strong>"{addendum.client.company || addendum.client.name}"</strong>.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Justificativa da Alteração</h2>
                        <p className="text-[10px] font-bold text-neutral-500 leading-relaxed uppercase bg-neutral-50 p-3 border border-neutral-100 rounded-lg">
                            {addendum.justification}
                        </p>
                    </div>
                </div>

                {/* New Items Table */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Novos Itens Adicionados</h2>
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-neutral-900">
                            <tr>
                                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400">Descrição do Novo Item</th>
                                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Valor Adicional</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addendum.newItems.map((item: any, i: number) => (
                                <tr key={i} className="border-b border-neutral-50">
                                    <td className="py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black uppercase tracking-tight text-neutral-900">{item.description}</span>
                                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{item.type} | +{Number(item.hours).toFixed(1)}h estimadas</span>
                                        </div>
                                    </td>
                                    <td className="py-5 text-right font-black tabular-nums">
                                        {formatCurrency(item.price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Financial Summary */}
                <div className="flex flex-col gap-6 p-8 bg-neutral-900 text-white rounded-3xl relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <div className="w-32 h-32 border-8 border-white rounded-full translate-x-16 -translate-y-16"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 relative z-10">
                        <div className="flex flex-col gap-1 border-r border-white/10">
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Valor Original</span>
                            <span className="text-lg font-bold tabular-nums opacity-60">
                                {formatCurrency(addendum.previousTotal)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 border-r border-white/10">
                            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Adicional Aditivo</span>
                            <span className="text-2xl font-black tabular-nums text-emerald-400">
                                + {formatCurrency(addendum.addendumValue)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Novo Valor Total</span>
                            <span className="text-3xl font-black tabular-nums tracking-tighter">
                                {formatCurrency(addendum.newTotal)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <AlertCircle className="w-4 h-4" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest">Condições Adicionais</h2>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase leading-relaxed tracking-wider border-l-2 border-emerald-100 pl-4 border-dashed">
                        {addendum.paymentTerms}
                        <br /><br />
                        As demais cláusulas do contrato original permanecem inalteradas e em pleno vigor.
                    </p>
                </div>

                {/* Signatures */}
                <div className="mt-auto grid grid-cols-2 gap-20 py-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-full h-px bg-neutral-200"></div>
                        <span className="text-[9px] font-black uppercase text-neutral-900">Merali Studio</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-full h-px bg-neutral-200"></div>
                        <span className="text-[9px] font-black uppercase text-neutral-900">{addendum.client.name}</span>
                    </div>
                </div>

                {/* OS Footer */}
                <footer className="pt-8 border-t border-neutral-100 flex justify-between items-center text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
                    <span>Merali ERP Document Engine | Addendum Unit</span>
                    <span>Pág 01/01</span>
                </footer>
            </div>

            <style jsx global>{`
                @media print {
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                    main { padding: 0 !important; }
                }
            `}</style>
        </div>
    )
}
