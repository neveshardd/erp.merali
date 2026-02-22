"use client"

import { PDFDownloadLink } from "@react-pdf/renderer";

import { useParams } from "next/navigation"
import { 
    Printer, 
    Download,
    ArrowLeft, 
    Camera,
    Shield,
    Globe,
    Instagram,
    FileCheck2,
    Lock,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { UsagePDFDocument } from "./document"

function useUsage(id: string) {
    return useQuery({
        queryKey: ["usage", id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/budgets/${id}/usage`)
            return data
        },
        enabled: !!id,
    })
}

export default function ImageUsagePage() {
    const params = useParams()
    const id = params.id as string
    
    const { data: usage, isLoading } = useUsage(id)

    const handlePrint = () => window.print()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Gerando Autorização de Uso...</p>
                </div>
            </div>
        )
    }

    if (!usage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Autorização não encontrada.</p>
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
                        document={<UsagePDFDocument data={usage} />}
                        fileName={`${usage.number}.pdf`}
                    >
                        {({ loading }) => (
                            <Button 
                                disabled={loading}
                                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white gap-2 font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer"
                            >
                                <Download className="w-3.5 h-4" /> 
                                {loading ? "Gerando..." : "Baixar PDF"}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* A4 Paper */}
            <div className="max-w-[21cm] mx-auto bg-white dark:bg-neutral-900 shadow-2xl print:shadow-none min-h-[29.7cm] p-[2cm] flex flex-col gap-10 text-neutral-900 dark:text-neutral-100 relative border-t-8 border-purple-500">
                
                {/* Header */}
                <header className="flex justify-between items-start">
                    <div className="flex flex-col gap-4">
                        <Image src="/logo.png" alt="Merali Logo" width={64} height={64} className="rounded-xl" />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">Uso de Imagem</h1>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-1">Cessão de Direitos para Portfólio e Marketing</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end text-right gap-1">
                        <span className="text-sm font-black text-purple-600 tracking-tight">{usage.number}</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{usage.date}</span>
                        <div className="mt-4 flex items-center gap-2 text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-900/30 print:hidden">
                            <Camera className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Portfolio Permission</span>
                        </div>
                    </div>
                </header>

                {/* Consent Box */}
                <div className="bg-purple-50/30 dark:bg-purple-900/10 p-8 rounded-3xl border border-purple-100 dark:border-purple-900/30 flex flex-col gap-6 text-justify relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <Shield className="w-32 h-32 text-purple-900 dark:text-purple-100" />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-purple-900 dark:text-purple-400 flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4" /> Termo de Consentimento
                    </h2>
                    <p className="text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300 relative z-10 uppercase">
                        Pelo presente instrumento, eu <strong className="text-neutral-900 dark:text-white">{usage.client.name}</strong>, devidamente qualificado como proprietário ou representante legal do cliente <strong className="text-neutral-900 dark:text-white">{usage.client.company}</strong>, autorizo de forma gratuita e sem restrições territoriais ou temporais o <strong className="text-neutral-900 dark:text-white">MERALI STUDIO DE VISUALIZAÇÃO</strong> a utilizar as imagens produzidas para o projeto <strong className="text-neutral-900 dark:text-white">"{usage.project}"</strong> para fins de divulgação de seu trabalho artístico e técnico.
                    </p>
                </div>

                {/* Usage Scope */}
                <div className="flex flex-col gap-6 text-neutral-900 dark:text-neutral-100">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 dark:border-neutral-800 pb-2">Escopo da Autorização</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {usage.terms.map((term: string, i: number) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-white dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                <div className="p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                    {i % 2 === 0 ? <Globe className="w-3 h-3 text-purple-400" /> : <Instagram className="w-3 h-3 text-purple-400" />}
                                </div>
                                <span className="text-[11px] font-bold uppercase text-neutral-600 dark:text-neutral-400 leading-tight tracking-tight">{term}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legal Note */}
                <div className="flex flex-col gap-4 p-6 bg-neutral-900 text-white rounded-2xl relative overflow-hidden shadow-lg">
                     <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Lock className="w-16 h-16" />
                    </div>
                    <div className="flex items-center gap-2 text-purple-400 relative z-10">
                        <Lock className="w-4 h-4" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest">Proteção de Dados e Copyright</h2>
                    </div>
                    <p className="text-[10px] font-medium leading-relaxed opacity-60 uppercase tracking-wide relative z-10">
                        O Merali Studio compromete-se a não divulgar informações sigilosas extras, limitando-se apenas à representação visual do projeto. O Copyright legal das imagens permanece de propriedade do estúdio conforme lei de direitos autorais, sendo esta autorização referente apenas à exibição pública.
                    </p>
                </div>

                {/* Signatures */}
                <div className="mt-auto grid grid-cols-2 gap-20 py-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800"></div>
                        <span className="text-[9px] font-black uppercase text-neutral-900 dark:text-neutral-100">Merali Studio de Visualização</span>
                        <span className="text-[7px] text-neutral-400 uppercase font-bold text-center tracking-widest">Detentor dos Direitos Autorais</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800"></div>
                        <span className="text-[9px] font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-tight">{usage.client.name}</span>
                        <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-widest">Autorizante (Cliente)</span>
                    </div>
                </div>

                {/* Footer OS */}
                <footer className="pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                         <span>Autorização de Marketing Merali Studio</span>
                    </div>
                    <span>Data de Registro: {usage.date} | Pág 01/01</span>
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
