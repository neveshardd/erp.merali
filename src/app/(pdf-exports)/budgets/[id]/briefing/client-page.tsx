"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  Download,
  FileText,
  Info,
  Layers,
  Link2,
  Loader2,
  Printer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import { BriefingPDFDocument } from "./document";

function useBriefing(id: string) {
  return useQuery({
    queryKey: ["briefing", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/budgets/${id}/briefing`);
      return data;
    },
    enabled: !!id,
  });
}

export default function TechnicalBriefingPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: briefing, isLoading } = useBriefing(id);

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
            Aguardando dados técnicos...
          </p>
        </div>
      </div>
    );
  }

  if (!briefing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
          Briefing não iniciado.
        </p>
      </div>
    );
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
            document={<BriefingPDFDocument data={briefing} />}
            fileName={`${briefing.number}.pdf`}
          >
            {({ loading }) => (
              <Button
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white gap-2 font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer"
              >
                <Download className="w-3.5 h-4" />
                {loading ? "Gerando..." : "Baixar PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* A4 Paper */}
      <div className="max-w-[21cm] mx-auto bg-white dark:bg-neutral-900 shadow-2xl print:shadow-none min-h-[29.7cm] p-[2cm] flex flex-col gap-10 text-neutral-900 dark:text-neutral-100 relative border-t-8 border-rose-500">
        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="flex flex-col gap-4">
            <Image
              src="/logo.png"
              alt="Merali Logo"
              width={64}
              height={64}
              className="rounded-xl"
            />
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">
                Briefing Técnico
              </h1>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-1">
                Especificações e Requisitos de Produção 3D
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end text-right gap-1">
            <span className="text-sm font-black text-rose-600 tracking-tight">
              {briefing.number}
            </span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              {briefing.date}
            </span>
            <div className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-900/30 print:hidden">
              <FileText className="w-3 h-3" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                {briefing.status}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              Projeto / Obra
            </h2>
            <p className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-white">
              {briefing.project}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              Cliente
            </h2>
            <p className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-white">
              {briefing.client.company || briefing.client.name}
            </p>
          </div>
        </div>

        {/* Section: Files */}
        <div className="flex flex-col gap-6 text-neutral-900 dark:text-neutral-100">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Arquivos Originais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest block mb-1">
                Formato do Modelo
              </span>
              <span className="text-xs font-bold uppercase text-neutral-900 dark:text-white">
                {briefing.format || "NÃO INFORMADO"}
              </span>
            </div>
            <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest block mb-1">
                Links de Download
              </span>
              <div className="flex flex-col gap-2 mt-2">
                {briefing.links && briefing.links.length > 0 ? (
                  briefing.links.map((link: string, i: number) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      className="flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors uppercase tracking-tight truncate"
                    >
                      <Link2 className="w-3 h-3 shrink-0" /> {link}
                    </a>
                  ))
                ) : (
                  <span className="text-[10px] font-medium text-neutral-400 uppercase">
                    Nenhum link fornecido
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Artistic */}
        <div className="flex flex-col gap-6 text-neutral-900 dark:text-neutral-100">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Direcionamento Artístico
          </h2>
          <div className="p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-100 dark:border-neutral-800 flex flex-col gap-4 text-neutral-600 dark:text-neutral-400">
            {briefing.mood && (
              <div className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg self-start text-[8px] font-black uppercase tracking-widest">
                Mood: {briefing.mood}
              </div>
            )}
            <p className="text-xs font-bold leading-relaxed uppercase">
              {briefing.lightingNotes ||
                "O CLIENTE NÃO FORNECEU OBSERVAÇÕES ESPECÍFICAS SOBRE ILUMINAÇÃO OU ATMOSFERA."}
            </p>
          </div>
        </div>

        {/* Section: Materials */}
        <div className="flex flex-col gap-6">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 border-b border-neutral-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
            <Info className="w-4 h-4" /> Materiais & Acabamentos
          </h2>
          <div className="p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
            <p className="text-xs font-bold leading-relaxed uppercase">
              {briefing.materialsNotes ||
                "NÃO FORAM LISTADOS MATERIAIS ESPECÍFICOS PARA ESTE PROJETO."}
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-auto flex flex-col gap-8">
          <div className="flex justify-between items-center bg-rose-50 dark:bg-rose-900/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-rose-500" />
              <div>
                <p className="text-[10px] font-black uppercase text-rose-900 dark:text-rose-100">
                  Briefing Verificado
                </p>
                <p className="text-[8px] font-bold text-rose-400 uppercase tracking-widest">
                  Aguardando início da produção
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-rose-900 dark:text-rose-100 flex items-center gap-1 justify-end">
                <Calendar className="w-3 h-3" /> Última Atualização
              </p>
              <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">
                {briefing.updatedAt || briefing.date}
              </p>
            </div>
          </div>

          <footer className="pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
            <span>Merali ERP Document Engine | Technical Briefing Module</span>
            <span>Pág 01/01</span>
          </footer>
        </div>
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
  );
}
