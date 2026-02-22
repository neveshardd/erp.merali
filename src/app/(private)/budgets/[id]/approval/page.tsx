"use client"

import { useParams } from "next/navigation"
import { 
    Printer, 
    Download,
    ArrowLeft, 
    CheckCircle2,
    Star,
    ShieldCheck,
    Award,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

import dynamic from "next/dynamic";
const PDFDownloadLink = dynamic(() => import("@/components/pdf-download"), { ssr: false });
import { ApprovalPDFDocument } from "./document"

function useApproval(id: string) {
    return useQuery({
        queryKey: ["approval", id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/budgets/${id}/approval`)
            return data
        },
        enabled: !!id,
    })
}

export default function FinalApprovalPage() {
    const params = useParams()
    const id = params.id as string
    
    const { data: approval, isLoading } = useApproval(id)

    const [rating, setRating] = useState(5)

    const handlePrint = () => window.print()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Gerando Termo de Aprovação...</p>
                </div>
            </div>
        )
    }

    if (!approval) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Aprovação não encontrada.</p>
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
                        key={rating}
                        document={<ApprovalPDFDocument data={approval} rating={rating} />}
                        fileName={`${approval.number}.pdf`}
                    >
                        {({ loading }) => (
                            <Button 
                                disabled={loading}
                                className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white gap-2 font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer"
                            >
                                <Download className="w-3.5 h-4" /> 
                                {loading ? "Gerando..." : "Baixar PDF"}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* A4 Paper */}
            <div className="max-w-[21cm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[29.7cm] p-[2cm] flex flex-col gap-10 text-neutral-900 relative border-t-8 border-cyan-500">
                
                {/* Header */}
                <header className="flex justify-between items-start">
                    <div className="flex flex-col gap-4">
                        <Image src="/logo.png" alt="Merali Logo" width={64} height={64} className="rounded-xl" />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900">Aprovação Final</h1>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-1">Termo de Encerramento e Aceite de Projeto</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end text-right gap-1">
                        <span className="text-sm font-black text-cyan-600 tracking-tight">{approval.number}</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">{approval.date}</span>
                        <div className="mt-4 flex items-center gap-2 text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100 print:hidden">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Entrega Concluída</span>
                        </div>
                    </div>
                </header>

                {/* Main Statement */}
                <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100 flex flex-col gap-4 text-left">
                    <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-500" /> Declaração de Aceite
                    </h2>
                    <p className="text-sm font-medium leading-relaxed text-neutral-600 uppercase">
                        Eu, <strong>{approval.client.name}</strong>, representante da empresa <strong>{approval.client.company}</strong>, declaro para os devidos fins que recebi e aprovei todos os produtos e serviços listados neste documento, referentes ao projeto <strong>"{approval.project}"</strong> executado pelo <strong>MERALI STUDIO</strong>.
                        <br /><br />
                        Confirmo que a entrega está em total conformidade com as especificações contratadas, dando por encerrada esta etapa de produção sem quaisquer pendências técnicas ou artísticas.
                    </p>
                </div>

                {/* Delivered Items */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Itens Entregues e Conferidos</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {approval.itemsDelivered.map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
                                <span className="text-xs font-bold uppercase text-neutral-900 tracking-tight">{item.description}</span>
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase">100% OK</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Satisfaction Section */}
                <div className="grid grid-cols-2 gap-8 mt-4">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Avaliação de Qualidade</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button 
                                        key={s} 
                                        onClick={() => setRating(s)}
                                        className="cursor-pointer hover:scale-110 transition-transform"
                                    >
                                        <Star 
                                            className={`w-6 h-6 ${
                                                s <= rating 
                                                    ? "fill-cyan-500 text-cyan-500" 
                                                    : "text-neutral-200 fill-neutral-100"
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                                Nível de Satisfação: {
                                    rating === 5 ? "Excelente" : 
                                    rating === 4 ? "Muito Bom" : 
                                    rating === 3 ? "Bom" : 
                                    rating === 2 ? "Regular" : "Insatisfatório"
                                }
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 pb-2">Informações de Encerramento</h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                                <span className="text-neutral-400">Data de Conclusão</span>
                                <span className="text-neutral-900 tracking-tight">{approval.completionDate}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                                <span className="text-neutral-400">Status Financeiro</span>
                                <span className="text-emerald-600 font-black tracking-tight">Liquidado</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signatures */}
                <div className="mt-auto grid grid-cols-2 gap-20 py-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-full h-px bg-neutral-200"></div>
                        <span className="text-[9px] font-black uppercase text-neutral-900">Merali Studio de Visualização</span>
                        <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-widest">Responsável Técnico</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-full h-px bg-neutral-200"></div>
                        <span className="text-[9px] font-black uppercase text-neutral-900 tracking-tight">{approval.client.name}</span>
                        <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-widest">Assinante do Projeto</span>
                    </div>
                </div>

                {/* Footer OS */}
                <footer className="pt-8 border-t border-neutral-100 flex justify-between items-center text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                         <span>Protocolo Digital Verificado</span>
                    </div>
                    <span>Merali ERP Document Engine | Pág 01/01</span>
                </footer>
            </div>

            <style jsx global>{`
                @media print {
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                    main { padding: 0 !important; }
                    .max-w-\\[21cm\\] { max-width: 100% !important; margin: 0 !important; }
                }
            `}</style>
        </div>
    )
}
