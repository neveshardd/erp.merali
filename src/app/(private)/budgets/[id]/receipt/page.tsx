"use client"

import { useParams, useSearchParams } from "next/navigation"
import { 
    Printer, 
    Download,
    ArrowLeft, 
    FileCheck,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { formatCurrency } from "@/lib/utils"

import dynamic from "next/dynamic";
const PDFDownloadLink = dynamic(() => import("@/components/pdf-download"), { ssr: false });
import { ReceiptPDFDocument } from "./document"

function useReceipt(id: string, type?: string | null) {
    return useQuery({
        queryKey: ["receipt", id, type],
        queryFn: async () => {
            const url = type 
                ? `/api/budgets/${id}/receipt?type=${type}` 
                : `/api/budgets/${id}/receipt`
            const { data } = await axios.get(url)
            return data
        },
        enabled: !!id,
    })
}

export default function ReceiptPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const id = params.id as string
    const type = searchParams.get("type")
    
    const { data: receipt, isLoading } = useReceipt(id, type)

    const handlePrint = () => window.print()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Gerando Recibo...</p>
                </div>
            </div>
        )
    }

    if (!receipt) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Recibo não encontrado.</p>
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
                        document={<ReceiptPDFDocument data={receipt} />}
                        fileName={`${receipt.number}.pdf`}
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

            {/* A4 Paper */}
            <div className="max-w-[21cm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[14cm] p-[2cm] flex flex-col gap-8 text-neutral-900 border-2 border-dashed border-neutral-100 print:border-none relative overflow-hidden">
                
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-50 rounded-full -translate-y-32 translate-x-32 print:hidden z-0"></div>

                {/* Header */}
                <header className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-4">
                        <Image src="/logo.png" alt="Merali Logo" width={64} height={64} className="rounded-xl" />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Recibo</h1>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Merali Studio de Visualização</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end text-right">
                        <div className="bg-neutral-900 text-white p-4 rounded-xl flex flex-col items-end">
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">Valor do Pagamento</span>
                            <span className="text-2xl font-black tabular-nums">{formatCurrency(receipt.value)}</span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Nº {receipt.number}</span>
                    </div>
                </header>

                {/* Body */}
                <div className="flex flex-col gap-6 py-8 relative z-10">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium leading-relaxed">
                            Recebemos de <strong className="uppercase">{receipt.payer.name}</strong>, 
                            {receipt.payer.company ? ` representante da empresa ${receipt.payer.company}, ` : ''} 
                            {receipt.payer.cnpj ? `inscrita no CNPJ/CPF sob o nº ${receipt.payer.cnpj}, ` : ''}
                            a importância de <strong>{receipt.amountInWords.toUpperCase()}</strong>.
                        </p>
                        <div className="mt-4 p-4 bg-neutral-50 border border-neutral-100 rounded-lg">
                            <p className="text-xs font-bold uppercase text-neutral-500 tracking-wide text-justify italic">
                                "{receipt.description}"
                            </p>
                        </div>
                        <p className="text-sm font-medium mt-4">
                            Para maior clareza, firmamos o presente recibo.
                        </p>
                    </div>

                    <div className="mt-12 flex flex-col items-end">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 font-sans">São Paulo, {receipt.date}</span>
                    </div>
                </div>

                {/* Signatures */}
                <div className="mt-8 flex justify-center py-8 relative z-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-64 h-px bg-neutral-300 mb-2"></div>
                        <span className="text-xs font-black uppercase text-neutral-900 tracking-tighter">{receipt.receiver.name}</span>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">CNPJ: {receipt.receiver.cnpj}</span>
                        <span className="text-[8px] font-medium text-neutral-400 uppercase tracking-widest italic mt-1">Este documento serve como comprovante definitivo de quitação.</span>
                    </div>
                </div>

                {/* Footer Stamp */}
                <div className="absolute bottom-10 left-10 pointer-events-none opacity-[0.03] print:opacity-[0.05]">
                    <FileCheck className="w-48 h-48 rotate-12" />
                </div>
            </div>

            <style>{`
                @media print {
                    body { 
                        background: white !important; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print\\:hidden { display: none !important; }
                    main { padding: 0 !important; }
                    nav, aside, header.main-header { display: none !important; }
                }
            `}</style>
        </div>
    )
}
